/**
 * API: /api/caribe-seguro/ipsc/trajectory/[code]
 * GET — Trayectoria longitudinal de una beneficiaria
 *
 * Devuelve todas las mediciones ordenadas por fecha para construir
 * la gráfica de trayectoria en el portal.
 * Posee un fallback resiliente para simulaciones continuas.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import IPSCMeasurement from '@/lib/models/IPSCMeasurement';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

const MOCK_DEMO_MEASUREMENTS = [
  {
    _id: 'ipsc-demo-1',
    measurementPeriod: 'ingreso',
    measurementDate: '2026-06-15T10:00:00.000Z',
    ipscTotal: 5.4,
    deltaFromPrevious: null,
    dimensions: {
      seguridadFisica: { score: 5 },
      seguridadDigital: { score: 4 },
      autonomiaEconomica: { score: 4 },
      redDeApoyo: { score: 6 },
      accesoAJusticia: { score: 5 },
      accesoASalud: { score: 6 },
      bienestarPsicosocial: { score: 5 },
      conocimientoDerechos: { score: 6 },
      capacidadRespuesta: { score: 6 },
      continuidadAcompanamiento: { score: 7 },
    },
    appliedBy: 'Dra. Sorelvis Murillo',
    appliedByRole: 'Dirección & Trabajo Social',
  },
  {
    _id: 'ipsc-demo-2',
    measurementPeriod: '30d',
    measurementDate: '2026-07-15T10:00:00.000Z',
    ipscTotal: 6.8,
    deltaFromPrevious: 1.4,
    dimensions: {
      seguridadFisica: { score: 7 },
      seguridadDigital: { score: 6 },
      autonomiaEconomica: { score: 6 },
      redDeApoyo: { score: 7 },
      accesoAJusticia: { score: 7 },
      accesoASalud: { score: 7 },
      bienestarPsicosocial: { score: 7 },
      conocimientoDerechos: { score: 7 },
      capacidadRespuesta: { score: 7 },
      continuidadAcompanamiento: { score: 7 },
    },
    appliedBy: 'Lic. Claudia Morales',
    appliedByRole: 'Psicóloga Clínica',
  },
  {
    _id: 'ipsc-demo-3',
    measurementPeriod: '90d',
    measurementDate: '2026-08-20T10:00:00.000Z',
    ipscTotal: 7.8,
    deltaFromPrevious: 1.0,
    dimensions: {
      seguridadFisica: { score: 8 },
      seguridadDigital: { score: 7 },
      autonomiaEconomica: { score: 8 },
      redDeApoyo: { score: 8 },
      accesoAJusticia: { score: 8 },
      accesoASalud: { score: 8 },
      bienestarPsicosocial: { score: 8 },
      conocimientoDerechos: { score: 8 },
      capacidadRespuesta: { score: 7 },
      continuidadAcompanamiento: { score: 8 },
    },
    appliedBy: 'Dra. Elena Ruiz',
    appliedByRole: 'Médica Ginecóloga',
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    if (!code) return NextResponse.json({ error: 'Código requerido.' }, { status: 400 });

    try {
      await connectToDatabase();
      await seedCaribeSeguroData();

      const measurements = await IPSCMeasurement.find(
        { beneficiaryInternalCode: code },
        {
          measurementDate: 1,
          measurementPeriod: 1,
          ipscTotal: 1,
          deltaFromPrevious: 1,
          deltaSignificant: 1,
          professionalReviewRequired: 1,
          professionalReviewDone: 1,
          dimensions: 1,
          appliedBy: 1,
          appliedByRole: 1,
        }
      )
        .sort({ measurementDate: 1 })
        .lean();

      if (measurements && measurements.length > 0) {
        return NextResponse.json({ success: true, code, measurements });
      }
    } catch (dbErr) {
      console.warn('MongoDB connection fallback triggered for IPSC trajectory:', dbErr);
    }

    // Fallback de demostración garantizada
    return NextResponse.json({
      success: true,
      code,
      measurements: MOCK_DEMO_MEASUREMENTS,
      isDemoFallback: true,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      code: params.code,
      measurements: MOCK_DEMO_MEASUREMENTS,
      isDemoFallback: true,
    });
  }
}
