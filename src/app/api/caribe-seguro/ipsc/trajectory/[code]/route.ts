/**
 * API: /api/caribe-seguro/ipsc/trajectory/[code]
 * GET — Trayectoria longitudinal de una beneficiaria
 *
 * Devuelve todas las mediciones ordenadas por fecha para construir
 * la gráfica de trayectoria en el portal.
 * Auto-inicializa datos de semilla institucionales si la BD está limpia.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import IPSCMeasurement from '@/lib/models/IPSCMeasurement';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    if (!code) return NextResponse.json({ error: 'Código requerido.' }, { status: 400 });

    await connectToDatabase();

    // Auto-seed si no hay suficientes mediciones
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

    return NextResponse.json({ success: true, code, measurements });
  } catch (err: any) {
    console.error('IPSC Trajectory Error:', err);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
