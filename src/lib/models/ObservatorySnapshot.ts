/**
 * ObservatorySnapshot Model — Observatorio Caribe Seguro
 *
 * Almacena los snapshots de datos AGREGADOS y ANONIMIZADOS del observatorio.
 *
 * REGLAS DE PUBLICACIÓN (Blueprint cap. 9.1):
 * - Solo datos agregados: NUNCA información que permita identificar a una mujer
 * - minimumGroupSize = 5: si n < 5 en cualquier grupo, el campo se publica como null
 * - Toda cifra debe originarse en el sistema: el equipo NUNCA estima ni redondea
 * - approved: true SOLO después de que el responsable de datos lo apruebe explícitamente
 * - Sigue la lógica output / outcome / impact (Blueprint cap. 14)
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IObservatorySnapshot extends Document {
  period: string;                         // Ej: "2026-Q3" o "2026-09"
  periodType: 'mensual' | 'trimestral' | 'anual';
  generatedAt: Date;
  generatedBy: 'sistema_automatico';      // Solo el sistema genera cifras
  reviewedBy: string;                     // Responsable de datos (persona)
  reviewedAt: Date | null;
  approved: boolean;                      // DEBE ser true para publicar
  approvedAt: Date | null;
  publishedAt: Date | null;

  // Mínimo de grupo para publicar (Regla anti-reidentificación)
  minimumGroupSize: number;              // Default: 5

  metrics: {
    // OUTPUT — ¿Qué hicimos?
    mujeresAcompanadaTotal: number | null;
    nuevosIngresosEnPeriodo: number | null;
    citasRealizadas: number | null;
    rutasActivadas: number | null;
    talleresRealizados: number | null;

    // OUTCOME — ¿Qué cambió?
    planesProteccionCompletados: number | null;
    mujeresCon1ContactoSeguimiento: number | null;  // Al menos 1 medición de seguimiento
    rutasInstitucionales: number | null;             // Derivaciones exitosas

    // IMPACT — ¿Qué se transformó?
    mejoraPromedioIPSC_30d: number | null;           // Δ IPSC promedio a 30 días
    mejoraPromedioIPSC_90d: number | null;           // Δ IPSC promedio a 90 días
    tiempoPromedioOrientacionHoras: number | null;   // Tiempo hasta primera orientación
    municipiosPresenciaActiva: string[];              // Solo nombres, sin conteos < 5

    // Dimensión del IPSC más mejorada en el periodo (nombre)
    dimensionMasFortalecida: string | null;
    dimensionMasDebil: string | null;
  };

  // Notas del responsable de datos antes de publicar
  publicationNotes: string;

  // Flags de anonimización
  anonymizationVerified: boolean;
  reidentificationRiskChecked: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ObservatorySnapshotSchema = new Schema<IObservatorySnapshot>(
  {
    period: { type: String, required: true, unique: true },
    periodType: { type: String, enum: ['mensual', 'trimestral', 'anual'], required: true },
    generatedAt: { type: Date, default: Date.now },
    generatedBy: { type: String, default: 'sistema_automatico' },
    reviewedBy: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    minimumGroupSize: { type: Number, default: 5 },

    metrics: {
      mujeresAcompanadaTotal: { type: Number, default: null },
      nuevosIngresosEnPeriodo: { type: Number, default: null },
      citasRealizadas: { type: Number, default: null },
      rutasActivadas: { type: Number, default: null },
      talleresRealizados: { type: Number, default: null },
      planesProteccionCompletados: { type: Number, default: null },
      mujeresCon1ContactoSeguimiento: { type: Number, default: null },
      rutasInstitucionales: { type: Number, default: null },
      mejoraPromedioIPSC_30d: { type: Number, default: null },
      mejoraPromedioIPSC_90d: { type: Number, default: null },
      tiempoPromedioOrientacionHoras: { type: Number, default: null },
      municipiosPresenciaActiva: [{ type: String }],
      dimensionMasFortalecida: { type: String, default: null },
      dimensionMasDebil: { type: String, default: null },
    },

    publicationNotes: { type: String, default: '' },
    anonymizationVerified: { type: Boolean, default: false },
    reidentificationRiskChecked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'observatory_snapshots',
  }
);

export default mongoose.models.ObservatorySnapshot ||
  mongoose.model<IObservatorySnapshot>('ObservatorySnapshot', ObservatorySnapshotSchema);
