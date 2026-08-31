/**
 * API: /api/caribe-seguro/observatory/public
 * GET — Datos públicos del Observatorio Caribe Seguro
 *
 * Solo devuelve snapshots aprobados (approved: true).
 * NUNCA expone datos individuales ni identificadores.
 * Sigue las reglas de publicación del Blueprint cap. 9.1.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ObservatorySnapshot from '@/lib/models/ObservatorySnapshot';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const snapshots = (await ObservatorySnapshot.find(
      { approved: true },
      {
        period: 1,
        periodType: 1,
        publishedAt: 1,
        metrics: 1,
        publicationNotes: 1,
      }
    )
      .sort({ publishedAt: -1 })
      .limit(8)
      .lean()) as any[];

    // Última snapshot aprobada como "actual"
    const latest = snapshots[0] || null;

    // Datos históricos para gráficas de tendencia (máx 8 periodos)
    const historicalIPSC = snapshots
      .filter((s) => s.metrics.mejoraPromedioIPSC_90d !== null)
      .map((s) => ({
        period: s.period,
        mejora90d: s.metrics.mejoraPromedioIPSC_90d,
        mujeres: s.metrics.mujeresAcompanadaTotal,
      }))
      .reverse();

    return NextResponse.json({
      success: true,
      latest,
      historicalIPSC,
      totalPeriods: snapshots.length,
    });
  } catch (err: any) {
    console.error('Observatory Public Error:', err);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
