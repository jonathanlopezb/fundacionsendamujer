import { connectToDatabase } from './mongodb';
import CmsStats from './models/CmsStats';
import { CmsStatsData, DEFAULT_CMS_STATS } from './cms-stats-types';

export { DEFAULT_CMS_STATS };
export type { CmsStatsData };

export async function getCmsStats(): Promise<CmsStatsData> {
  try {
    await connectToDatabase();
    const doc = (await CmsStats.findOne().sort({ updatedAt: -1 }).lean()) as any;
    if (doc) {
      return {
        site_mujeres_orientadas: doc.site_mujeres_orientadas || DEFAULT_CMS_STATS.site_mujeres_orientadas,
        site_rutas_activadas: doc.site_rutas_activadas || DEFAULT_CMS_STATS.site_rutas_activadas,
        site_acciones_apoyo: doc.site_acciones_apoyo || DEFAULT_CMS_STATS.site_acciones_apoyo,
        site_procesos_autonomia: doc.site_procesos_autonomia || DEFAULT_CMS_STATS.site_procesos_autonomia,
        site_impact_eyebrow: doc.site_impact_eyebrow || DEFAULT_CMS_STATS.site_impact_eyebrow,
        site_impact_title: doc.site_impact_title || DEFAULT_CMS_STATS.site_impact_title,
        site_impact_subtitle: doc.site_impact_subtitle || DEFAULT_CMS_STATS.site_impact_subtitle,

        caribe_mujeres_acompanadas: Number(doc.caribe_mujeres_acompanadas) || DEFAULT_CMS_STATS.caribe_mujeres_acompanadas,
        caribe_rutas_activadas: Number(doc.caribe_rutas_activadas) || DEFAULT_CMS_STATS.caribe_rutas_activadas,
        caribe_citas_realizadas: Number(doc.caribe_citas_realizadas) || DEFAULT_CMS_STATS.caribe_citas_realizadas,
        caribe_talleres_realizados: Number(doc.caribe_talleres_realizados) || DEFAULT_CMS_STATS.caribe_talleres_realizados,
        caribe_planes_proteccion: Number(doc.caribe_planes_proteccion) || DEFAULT_CMS_STATS.caribe_planes_proteccion,
        caribe_variacion_ipsc: Number(doc.caribe_variacion_ipsc) || DEFAULT_CMS_STATS.caribe_variacion_ipsc,
        caribe_fondo_capital_cop: Number(doc.caribe_fondo_capital_cop) || DEFAULT_CMS_STATS.caribe_fondo_capital_cop,
        caribe_periodo: doc.caribe_periodo || DEFAULT_CMS_STATS.caribe_periodo,
        caribe_territorios: doc.caribe_territorios || DEFAULT_CMS_STATS.caribe_territorios,
        caribe_dimension_fuerte: doc.caribe_dimension_fuerte || DEFAULT_CMS_STATS.caribe_dimension_fuerte,
        caribe_dimension_debil: doc.caribe_dimension_debil || DEFAULT_CMS_STATS.caribe_dimension_debil,
        caribe_notas: doc.caribe_notas || DEFAULT_CMS_STATS.caribe_notas,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
      };
    }
  } catch (error) {
    console.warn('Fallback a DEFAULT_CMS_STATS:', error);
  }

  return DEFAULT_CMS_STATS;
}
