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
