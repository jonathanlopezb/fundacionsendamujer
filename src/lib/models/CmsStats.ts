import mongoose, { Schema, Document } from 'mongoose';

export interface ICmsStats extends Document {
  // Sitio Web Principal (Home / General)
  site_mujeres_orientadas: string;
  site_rutas_activadas: string;
  site_acciones_apoyo: string;
  site_procesos_autonomia: string;
  site_impact_eyebrow: string;
  site_impact_title: string;
  site_impact_subtitle: string;

  // Programa Senda Caribe / Observatorio / Impact Engine
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

  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CmsStatsSchema = new Schema<ICmsStats>(
  {
    site_mujeres_orientadas: { type: String, default: '450+' },
    site_rutas_activadas: { type: String, default: '310+' },
    site_acciones_apoyo: { type: String, default: '180+' },
    site_procesos_autonomia: { type: String, default: '65' },
    site_impact_eyebrow: { type: String, default: 'Impacto verificable' },
    site_impact_title: { type: String, default: 'No son cifras. Son vidas.' },
    site_impact_subtitle: {
      type: String,
      default: 'Conoce nuestras historias, jornadas y resultados en territorio.',
    },

    caribe_mujeres_acompanadas: { type: Number, default: 450 },
    caribe_rutas_activadas: { type: Number, default: 310 },
    caribe_citas_realizadas: { type: Number, default: 180 },
    caribe_talleres_realizados: { type: Number, default: 45 },
    caribe_planes_proteccion: { type: Number, default: 120 },
    caribe_variacion_ipsc: { type: Number, default: 2.4 },
    caribe_fondo_capital_cop: { type: Number, default: 45000000 },
    caribe_periodo: { type: String, default: '2026-Q3 (Cartagena & Bolívar)' },
    caribe_territorios: {
      type: String,
      default: 'Cartagena (Olaya Herrera, El Pozón, Chiquinquirá), Turbaco, Arjona',
    },
    caribe_dimension_fuerte: {
      type: String,
      default: 'Conocimiento de Derechos & Autonomía',
    },
    caribe_dimension_debil: {
      type: String,
      default: 'Seguridad Digital',
    },
    caribe_notas: {
      type: String,
      default: 'Cifras reales agregadas consumidas en tiempo real desde MongoDB Atlas.',
    },

    updatedBy: { type: String, default: 'admin' },
  },
  {
    timestamps: true,
    collection: 'cms_stats',
  }
);

export default mongoose.models.CmsStats ||
  mongoose.model<ICmsStats>('CmsStats', CmsStatsSchema);
