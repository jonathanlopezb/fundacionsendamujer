import { connectToDatabase } from './mongodb';
import CmsStats from './models/CmsStats';

export interface CmsStatsData {
  site_mujeres_orientadas: string;
  site_rutas_activadas: string;
  site_acciones_apoyo: string;
  site_procesos_autonomia: string;
  site_impact_eyebrow: string;
  site_impact_title: string;
  site_impact_subtitle: string;

  caribe_mujeres_acompanadas: number;
  caribe_rutas_activadas: number;
  caribe_citas_realizadas: number;
  caribe_talleres_realizados: number;
  caribe_planes_proteccion: number;
  caribe_variacion_ipsc: number;
  caribe_fondo_capital_cop: number;
  caribe_periodo: string;
  caribe_territorios: string;
  caribe_dimension_fuerte: string;
  caribe_dimension_debil: string;
  caribe_notas: string;
  updatedAt?: string;
}

export const DEFAULT_CMS_STATS: CmsStatsData = {
  site_mujeres_orientadas: '450+',
  site_rutas_activadas: '310+',
  site_acciones_apoyo: '180+',
  site_procesos_autonomia: '65',
  site_impact_eyebrow: 'Impacto verificable',
  site_impact_title: 'No son cifras.\nSon vidas.',
  site_impact_subtitle: 'Conoce nuestras historias, jornadas y resultados en territorio.',

  caribe_mujeres_acompanadas: 450,
  caribe_rutas_activadas: 310,
  caribe_citas_realizadas: 180,
  caribe_talleres_realizados: 45,
  caribe_planes_proteccion: 120,
  caribe_variacion_ipsc: 2.4,
  caribe_fondo_capital_cop: 45000000,
  caribe_periodo: '2026-Q3 (Cartagena & Bolívar)',
  caribe_territorios: 'Cartagena (Olaya Herrera, El Pozón, Chiquinquirá), Turbaco, Arjona',
  caribe_dimension_fuerte: 'Conocimiento de Derechos & Autonomía',
  caribe_dimension_debil: 'Seguridad Digital',
  caribe_notas: 'Cifras reales agregadas consumidas en tiempo real desde MongoDB Atlas.',
};

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
