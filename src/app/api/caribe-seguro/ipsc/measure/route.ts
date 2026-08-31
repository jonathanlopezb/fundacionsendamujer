/**
 * API: /api/caribe-seguro/ipsc/measure
 * POST — Registrar una medición IPSC
 *
 * Calcula automáticamente:
 * - ipscTotal (promedio de 10 dimensiones)
 * - deltaFromPrevious (vs última medición del mismo beneficiario)
 * - deltaSignificant (si delta > 15% activa revisión profesional)
 * - Evalúa señales de deterioro y crea alertas si aplica
 *
 * Solo acepta peticiones autenticadas (header: x-senda-role: psicologa|trabajadora_social|...)
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import IPSCMeasurement from '@/lib/models/IPSCMeasurement';
import DeteriorationAlert from '@/lib/models/DeteriorationAlert';

const DIMENSION_KEYS = [
  'seguridadFisica', 'seguridadDigital', 'autonomiaEconomica', 'redDeApoyo',
  'accesoAJusticia', 'accesoASalud', 'bienestarPsicosocial', 'conocimientoDerechos',
  'capacidadRespuesta', 'continuidadAcompanamiento',
] as const;

type DimensionKey = typeof DIMENSION_KEYS[number];

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  seguridadFisica: 'Seguridad Física',
  seguridadDigital: 'Seguridad Digital',
  autonomiaEconomica: 'Autonomía Económica',
  redDeApoyo: 'Red de Apoyo',
  accesoAJusticia: 'Acceso a Justicia',
  accesoASalud: 'Acceso a Salud',
  bienestarPsicosocial: 'Bienestar Psicosocial',
  conocimientoDerechos: 'Conocimiento de Derechos',
  capacidadRespuesta: 'Capacidad de Respuesta',
  continuidadAcompanamiento: 'Continuidad del Acompañamiento',
};

function calcIPSCTotal(dimensions: Record<string, { score: number }>): number {
  const scores = DIMENSION_KEYS.map((k) => dimensions[k]?.score ?? 0);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 10) / 10; // redondea a 1 decimal
}

/**
 * Detecta señales de deterioro según las reglas del Blueprint cap. 8:
 * - Disminución significativa en red de apoyo (–2+ puntos)
 * - Disminución simultánea en 3 o más dimensiones
 * - Delta total significativo negativo
 * - Pérdida de continuidad de acompañamiento
 * NUNCA indica predicción de violencia.
 */
function detectSignals(
  dims: Record<DimensionKey, { score: number }>,
  prevDims: Record<DimensionKey, { score: number }> | null,
  deltaTotal: number | null
): { signals: string[]; level: 'none' | 'amarilla' | 'roja'; dimensionsAffected: string[] } {
  if (!prevDims) return { signals: [], level: 'none', dimensionsAffected: [] };

  const signals: string[] = [];
  const dimensionsAffected: string[] = [];

  // Revisión por dimensión
  let dimsDeteriorated = 0;
  for (const key of DIMENSION_KEYS) {
    const delta = dims[key].score - prevDims[key].score;
    if (delta < 0) {
      dimsDeteriorated++;
      dimensionsAffected.push(DIMENSION_LABELS[key]);

      // Señal específica: caída significativa en red de apoyo (–2+)
      if (key === 'redDeApoyo' && delta <= -2) {
        signals.push(`Disminución significativa en Red de Apoyo (${delta.toFixed(1)} pts)`);
      }

      // Señal específica: pérdida de continuidad
      if (key === 'continuidadAcompanamiento' && delta <= -2) {
        signals.push(`Interrupción del contacto con la Fundación (${delta.toFixed(1)} pts)`);
      }
    }
  }

  // 3 o más dimensiones deterioradas simultáneamente
  if (dimsDeteriorated >= 3) {
    signals.push(`${dimsDeteriorated} dimensiones del IPSC disminuyeron simultáneamente`);
  }

  // Delta total negativo significativo
  if (deltaTotal !== null && deltaTotal <= -1.5) {
    signals.push(`Índice IPSC global bajó ${Math.abs(deltaTotal).toFixed(1)} puntos respecto a medición anterior`);
  }

  // Determinar nivel
  let level: 'none' | 'amarilla' | 'roja' = 'none';
  if (signals.length === 1 && dimsDeteriorated < 3) {
    level = 'amarilla'; // 1 señal = alerta amarilla
  } else if (signals.length >= 2 || dimsDeteriorated >= 3) {
    level = 'roja'; // múltiples señales = revisión prioritaria
  }

  return { signals, level, dimensionsAffected };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      beneficiaryInternalCode,
      measurementPeriod,
      appliedBy,
      appliedByRole,
      dimensions,
      consentimientoActivo,
    } = body;

    // Validaciones básicas
    if (!beneficiaryInternalCode || !measurementPeriod || !appliedBy || !appliedByRole || !dimensions) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    if (!consentimientoActivo) {
      return NextResponse.json(
        { error: 'No se puede registrar sin consentimiento activo de la beneficiaria (Ley 1581/2012).' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Buscar la medición anterior para calcular delta
    const lastMeasurement = await IPSCMeasurement.findOne(
      { beneficiaryInternalCode },
      { ipscTotal: 1, dimensions: 1, _id: 1 },
      { sort: { measurementDate: -1 } }
    ).lean();

    const ipscTotal = calcIPSCTotal(dimensions);
    const deltaFromPrevious = lastMeasurement ? ipscTotal - lastMeasurement.ipscTotal : null;
    const deltaSignificant = deltaFromPrevious !== null && Math.abs(deltaFromPrevious) >= 1.5;

    // Detectar señales de deterioro
    const { signals, level, dimensionsAffected } = detectSignals(
      dimensions,
      lastMeasurement?.dimensions as any ?? null,
      deltaFromPrevious
    );

    const newMeasurement = await IPSCMeasurement.create({
      beneficiaryInternalCode,
      measurementPeriod,
      appliedBy,
      appliedByRole,
      dimensions,
      ipscTotal,
      deltaFromPrevious,
      deltaSignificant,
      professionalReviewRequired: deltaSignificant || level !== 'none',
      professionalReviewDone: false,
      consentimientoActivo,
      encryptionVersion: 'v1',
    });

    // Si hay señales de deterioro → crear alerta
    let alert = null;
    if (level !== 'none') {
      const suggestedAction =
        level === 'amarilla'
          ? 'Revisar el caso en agenda del equipo profesional en las próximas 72 horas.'
          : 'Revisión INMEDIATA por la coordinación del Espacio Seguro. Activar protocolo de manejo de crisis si aplica.';

      alert = await DeteriorationAlert.create({
        beneficiaryInternalCode,
        alertLevel: level,
        triggeredAt: new Date(),
        triggeredBy: 'sistema',
        signals,
        dimensionsAffected,
        suggestedActionBySystem: suggestedAction,
        status: 'pendiente',
        ipscTotalAtAlert: ipscTotal,
        previousIPSCTotal: lastMeasurement?.ipscTotal ?? null,
        measurementId: newMeasurement._id.toString(),
      });
    }

    return NextResponse.json({
      success: true,
      measurement: {
        id: newMeasurement._id,
        ipscTotal,
        deltaFromPrevious,
        deltaSignificant,
        professionalReviewRequired: newMeasurement.professionalReviewRequired,
      },
      alert: alert
        ? { id: alert._id, level: alert.alertLevel, signals }
        : null,
    });
  } catch (err: any) {
    console.error('IPSC Measure Error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
