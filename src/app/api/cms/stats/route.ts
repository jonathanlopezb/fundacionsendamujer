import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { readCmsSession } from '@/lib/cms-auth';
import CmsStats from '@/lib/models/CmsStats';
import ObservatorySnapshot from '@/lib/models/ObservatorySnapshot';
import { DEFAULT_CMS_STATS, getCmsStats } from '@/lib/cms-stats-service';

export const dynamic = 'force-dynamic';

// GET: Obtener las estadísticas actuales
export async function GET() {
  try {
    const stats = await getCmsStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, stats: DEFAULT_CMS_STATS },
      { status: 500 }
    );
  }
}

// POST/PUT: Guardar/actualizar las estadísticas (requiere rol en CMS)
export async function POST(req: NextRequest) {
  const session = readCmsSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
    return NextResponse.json(
      { error: 'No autorizado. Inicia sesión en el CMS para editar las cifras.' },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();
    const body = await req.json();

    const payload = {
      site_mujeres_orientadas: body.site_mujeres_orientadas || DEFAULT_CMS_STATS.site_mujeres_orientadas,
      site_rutas_activadas: body.site_rutas_activadas || DEFAULT_CMS_STATS.site_rutas_activadas,
      site_acciones_apoyo: body.site_acciones_apoyo || DEFAULT_CMS_STATS.site_acciones_apoyo,
      site_procesos_autonomia: body.site_procesos_autonomia || DEFAULT_CMS_STATS.site_procesos_autonomia,
      site_impact_eyebrow: body.site_impact_eyebrow || DEFAULT_CMS_STATS.site_impact_eyebrow,
      site_impact_title: body.site_impact_title || DEFAULT_CMS_STATS.site_impact_title,
      site_impact_subtitle: body.site_impact_subtitle || DEFAULT_CMS_STATS.site_impact_subtitle,

      caribe_mujeres_acompanadas: Number(body.caribe_mujeres_acompanadas) || DEFAULT_CMS_STATS.caribe_mujeres_acompanadas,
      caribe_rutas_activadas: Number(body.caribe_rutas_activadas) || DEFAULT_CMS_STATS.caribe_rutas_activadas,
      caribe_citas_realizadas: Number(body.caribe_citas_realizadas) || DEFAULT_CMS_STATS.caribe_citas_realizadas,
      caribe_talleres_realizados: Number(body.caribe_talleres_realizados) || DEFAULT_CMS_STATS.caribe_talleres_realizados,
      caribe_planes_proteccion: Number(body.caribe_planes_proteccion) || DEFAULT_CMS_STATS.caribe_planes_proteccion,
      caribe_variacion_ipsc: Number(body.caribe_variacion_ipsc) || DEFAULT_CMS_STATS.caribe_variacion_ipsc,
      caribe_fondo_capital_cop: Number(body.caribe_fondo_capital_cop) || DEFAULT_CMS_STATS.caribe_fondo_capital_cop,
      caribe_periodo: body.caribe_periodo || DEFAULT_CMS_STATS.caribe_periodo,
      caribe_territorios: body.caribe_territorios || DEFAULT_CMS_STATS.caribe_territorios,
      caribe_dimension_fuerte: body.caribe_dimension_fuerte || DEFAULT_CMS_STATS.caribe_dimension_fuerte,
      caribe_dimension_debil: body.caribe_dimension_debil || DEFAULT_CMS_STATS.caribe_dimension_debil,
      caribe_notas: body.caribe_notas || DEFAULT_CMS_STATS.caribe_notas,
      updatedBy: session.username || 'admin',
    };

    // 1. Guardar o actualizar en CmsStats
    let doc = await CmsStats.findOne();
    if (doc) {
      Object.assign(doc, payload);
      await doc.save();
    } else {
      doc = await CmsStats.create(payload);
    }

    // 2. Sincronizar con el ObservatorioSnapshot activo
    try {
      const municipiosArray = (payload.caribe_territorios || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);

      await ObservatorySnapshot.findOneAndUpdate(
        { period: payload.caribe_periodo },
        {
          period: payload.caribe_periodo,
          periodType: 'trimestral',
          approved: true,
          approvedBy: session.username,
          approvedAt: new Date(),
          publishedAt: new Date(),
          metrics: {
            mujeresAcompanadaTotal: payload.caribe_mujeres_acompanadas,
            rutasActivadas: payload.caribe_rutas_activadas,
            citasRealizadas: payload.caribe_citas_realizadas,
            talleresRealizados: payload.caribe_talleres_realizados,
            planesProteccionCompletados: payload.caribe_planes_proteccion,
            mejoraPromedioIPSC_90d: payload.caribe_variacion_ipsc,
            municipiosPresenciaActiva: municipiosArray.length > 0 ? municipiosArray : ['Cartagena de Indias'],
            dimensionMasFortalecida: payload.caribe_dimension_fuerte,
            dimensionMasDebil: payload.caribe_dimension_debil,
          },
          publicationNotes: payload.caribe_notas,
        },
        { upsert: true, new: true }
      );
    } catch (syncErr) {
      console.warn('ObservatorySnapshot sync notice:', syncErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Cifras e indicadores actualizados exitosamente en MongoDB Atlas.',
      stats: doc,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al guardar cifras' }, { status: 500 });
  }
}
