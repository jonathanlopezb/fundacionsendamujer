/**
 * API: /api/caribe-seguro/observatory/generate
 *
 * POST — Genera un snapshot del Observatorio Caribe Seguro desde datos REALES de MongoDB.
 *        Agrega métricas anónimas de IPSCMeasurement, DeteriorationAlert, Appointment.
 *        El snapshot se crea con approved: false → requiere revisión antes de publicar.
 *
 * GET  — Lista los snapshots recientes (aprobados y pendientes).
 *
 * PATCH — Aprueba un snapshot para publicación pública (aprobación por responsable de datos).
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import IPSCMeasurement from '@/lib/models/IPSCMeasurement';
import DeteriorationAlert from '@/lib/models/DeteriorationAlert';
import ObservatorySnapshot from '@/lib/models/ObservatorySnapshot';
import Appointment from '@/lib/models/Appointment';

const DIMENSION_LABELS: Record<string, string> = {
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

const DIMENSION_KEYS = Object.keys(DIMENSION_LABELS);

// POST — Generar snapshot real
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      period,          // ej: "2026-Q3"
      periodType,      // 'mensual' | 'trimestral' | 'anual'
      generatedBy,     // nombre del responsable de datos
      publicationNotes,
    } = body;

    if (!period || !periodType || !generatedBy) {
      return NextResponse.json(
        { error: 'Campos requeridos: period, periodType, generatedBy' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // ── 1. Total de beneficiarias únicas acompañadas ──────────────────────────
    const uniqueBeneficiaries = await IPSCMeasurement.distinct('beneficiaryInternalCode');
    const mujeresAcompanadaTotal = uniqueBeneficiaries.length;

    // Anti-reidentificación: si menos de 5, no publicar
    if (mujeresAcompanadaTotal < 5) {
      return NextResponse.json(
        {
          error: 'Datos insuficientes: el sistema requiere al menos 5 beneficiarias distintas para generar un snapshot del Observatorio (regla de privacidad).',
          currentCount: mujeresAcompanadaTotal,
        },
        { status: 422 }
      );
    }

    // ── 2. Ingresos nuevos (mediciones tipo 'ingreso') ────────────────────────
    const nuevosIngresosEnPeriodo = await IPSCMeasurement.countDocuments({
      measurementPeriod: 'ingreso',
    });

    // ── 3. Citas realizadas desde MongoDB ─────────────────────────────────────
    const citasRealizadas = await Appointment.countDocuments({
      status: 'ATENDIDA',
    });

    // ── 4. Citas confirmadas (rutas activadas) ────────────────────────────────
    const rutasActivadas = await Appointment.countDocuments({
      status: { $in: ['ATENDIDA', 'CONFIRMADA'] },
    });

    // ── 5. Mejora promedio IPSC (beneficiarias con al menos 2 mediciones) ─────
    // Para cada beneficiaria con medición de ingreso y de 30d/90d,
    // calcula el delta y saca el promedio.
    const beneficiaryDeltas30: number[] = [];
    const beneficiaryDeltas90: number[] = [];

    for (const code of uniqueBeneficiaries) {
      const measurements = (await IPSCMeasurement.find(
        { beneficiaryInternalCode: code },
        { measurementPeriod: 1, ipscTotal: 1 }
      )
        .sort({ measurementDate: 1 })
        .lean()) as { measurementPeriod: string; ipscTotal: number }[];

      const ingreso = measurements.find((m) => m.measurementPeriod === 'ingreso');
      const m30 = measurements.find((m) => m.measurementPeriod === '30d');
      const m90 = measurements.find((m) => m.measurementPeriod === '90d');

      if (ingreso && m30) {
        beneficiaryDeltas30.push(m30.ipscTotal - ingreso.ipscTotal);
      }
      if (ingreso && m90) {
        beneficiaryDeltas90.push(m90.ipscTotal - ingreso.ipscTotal);
      }
    }

    const mejoraPromedioIPSC_30d =
      beneficiaryDeltas30.length > 0
        ? Math.round((beneficiaryDeltas30.reduce((a, b) => a + b, 0) / beneficiaryDeltas30.length) * 10) / 10
        : null;

    const mejoraPromedioIPSC_90d =
      beneficiaryDeltas90.length > 0
        ? Math.round((beneficiaryDeltas90.reduce((a, b) => a + b, 0) / beneficiaryDeltas90.length) * 10) / 10
        : null;

    // ── 6. Dimensión más fortalecida y más débil ──────────────────────────────
    const dimScores: Record<string, number[]> = {};
    DIMENSION_KEYS.forEach((k) => { dimScores[k] = []; });

    const allMeasurements = (await IPSCMeasurement.find(
      {},
      { dimensions: 1 }
    ).lean()) as { dimensions: Record<string, { score: number }> }[];

    for (const m of allMeasurements) {
      for (const key of DIMENSION_KEYS) {
        const score = m.dimensions?.[key]?.score;
        if (typeof score === 'number') {
          dimScores[key].push(score);
        }
      }
    }

    const dimAverages: Record<string, number> = {};
    for (const key of DIMENSION_KEYS) {
      const scores = dimScores[key];
      if (scores.length > 0) {
        dimAverages[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
      }
    }

    let dimensionMasFortalecida: string | null = null;
    let dimensionMasDebil: string | null = null;
    if (Object.keys(dimAverages).length > 0) {
      const sorted = Object.entries(dimAverages).sort((a, b) => b[1] - a[1]);
      dimensionMasFortalecida = DIMENSION_LABELS[sorted[0][0]] || null;
      dimensionMasDebil = DIMENSION_LABELS[sorted[sorted.length - 1][0]] || null;
    }

    // ── 7. Alertas resueltas (rutas institucionales) ──────────────────────────
    const rutasInstitucionales = await DeteriorationAlert.countDocuments({
      status: { $in: ['resuelta', 'escalada'] },
    });

    // ── 8. Planes de protección completados (mediciones 90d completas) ─────────
    const planesProteccionCompletados = await IPSCMeasurement.countDocuments({
      measurementPeriod: '90d',
      professionalReviewDone: true,
    });

    // ── 9. Mujeres con al menos 1 contacto de seguimiento ─────────────────────
    const mujeresCon1ContactoSeguimiento = await IPSCMeasurement.countDocuments({
      measurementPeriod: { $in: ['30d', '90d', '180d', 'seguimiento_especial'] },
    });

    // ── 10. Tiempo promedio hasta orientación (horas) ─────────────────────────
    // Aproximación: tiempo en horas entre createdAt de la primera cita y la cita confirmada
    // Usamos diferencia entre citas PENDIENTE y CONFIRMADA en avg (simplificado)
    // Se deja null por ahora si no hay datos de timestamps disponibles directamente
    const tiempoPromedioOrientacionHoras = null;

    // ── Crear el snapshot ─────────────────────────────────────────────────────
    const snapshot = await ObservatorySnapshot.create({
      period,
      periodType,
      generatedAt: new Date(),
      generatedBy,
      approved: false,
      metrics: {
        mujeresAcompanadaTotal,
        nuevosIngresosEnPeriodo,
        citasRealizadas,
        rutasActivadas,
        talleresRealizados: null,               // Futura fuente de datos
        planesProteccionCompletados,
        mujeresCon1ContactoSeguimiento,
        rutasInstitucionales,
        mejoraPromedioIPSC_30d,
        mejoraPromedioIPSC_90d,
        tiempoPromedioOrientacionHoras,
        municipiosPresenciaActiva: ['Cartagena de Indias'],
        dimensionMasFortalecida,
        dimensionMasDebil,
      },
      publicationNotes: publicationNotes || '',
    });

    return NextResponse.json({
      success: true,
      snapshot: {
        id: snapshot._id,
        period: snapshot.period,
        approved: snapshot.approved,
        metrics: snapshot.metrics,
      },
      summary: {
        mujeresAcompanadaTotal,
        mejoraPromedioIPSC_30d,
        mejoraPromedioIPSC_90d,
        dimensionMasFortalecida,
        dimensionMasDebil,
      },
    });
  } catch (err: any) {
    console.error('Observatory Generate Error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.', detail: err.message }, { status: 500 });
  }
}

// GET — Listar snapshots recientes (para el panel de administración)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const snapshots = (await ObservatorySnapshot.find(
      {},
      { period: 1, periodType: 1, approved: 1, generatedAt: 1, generatedBy: 1, publishedAt: 1, 'metrics.mujeresAcompanadaTotal': 1, 'metrics.mejoraPromedioIPSC_90d': 1 }
    )
      .sort({ generatedAt: -1 })
      .limit(20)
      .lean()) as any[];

    return NextResponse.json({ success: true, snapshots, total: snapshots.length });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}

// PATCH — Aprobar un snapshot para publicación pública
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { snapshotId, approvedBy } = body;

    if (!snapshotId || !approvedBy) {
      return NextResponse.json({ error: 'snapshotId y approvedBy son requeridos.' }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await ObservatorySnapshot.findByIdAndUpdate(
      snapshotId,
      { approved: true, publishedAt: new Date(), approvedBy },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Snapshot no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, snapshot: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
