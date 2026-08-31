/**
 * IPSC Measurement Model — Índice de Protección Senda-Caribe
 *
 * Almacena cada medición longitudinal del IPSC por beneficiaria.
 * Principios éticos aplicados en este modelo:
 * - No almacena nombre ni cédula — solo internalCode anónimo
 * - measurementPeriod nunca es automático: requiere appliedBy (profesional humano)
 * - professionalReviewRequired: toda variación relevante debe ser revisada antes de comunicar
 * - NUNCA se almacena "probabilidad de violencia" ni "riesgo de feminicidio"
 * - Ley 1581 de 2012: consentimiento explícito y revocable
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IDimension {
  score: number;       // 0–10: 0 = situación crítica, 10 = plena autonomía
  notes?: string;      // Nota del profesional (opcional, confidencial)
}

export interface IIPSCMeasurement extends Document {
  beneficiaryInternalCode: string;     // Código anónimo de caso (ej: SM-8842), NUNCA cédula
  measurementDate: Date;
  measurementPeriod: 'ingreso' | '30d' | '90d' | '180d' | 'seguimiento_especial';
  appliedBy: string;                   // ID o nombre del profesional que aplicó (obligatorio)
  appliedByRole: 'psicologa' | 'trabajadora_social' | 'abogada' | 'coordinadora' | 'medica';

  // Las 10 dimensiones del IPSC (validadas con el Blueprint cap. 7)
  dimensions: {
    seguridadFisica: IDimension;           // ¿Tiene lugar seguro para pasar la noche?
    seguridadDigital: IDimension;          // ¿Puede identificar violencia facilitada por tecnología?
    autonomiaEconomica: IDimension;        // ¿Cuenta con fuente de ingresos propia o en desarrollo?
    redDeApoyo: IDimension;               // ¿Tiene al menos una persona/institución a quien acudir?
    accesoAJusticia: IDimension;          // ¿Conoce y pudo activar ruta de denuncia?
    accesoASalud: IDimension;             // ¿Tiene acceso efectivo a servicios de salud?
    bienestarPsicosocial: IDimension;     // ¿Cómo describe su bienestar emocional?
    conocimientoDerechos: IDimension;     // ¿Puede nombrar rutas y derechos básicos?
    capacidadRespuesta: IDimension;       // ¿Sabría qué hacer ante nueva situación de riesgo?
    continuidadAcompanamiento: IDimension; // ¿Ha mantenido contacto sostenido con la Fundación?
  };

  // Métricas calculadas
  ipscTotal: number;                   // Promedio ponderado calculado por el sistema
  deltaFromPrevious: number | null;    // Cambio vs medición anterior (null si es primera)
  deltaSignificant: boolean;           // true si delta > 15% (activa revisión profesional)

  // Salvaguardas obligatorias (Blueprint 7.3)
  professionalReviewRequired: boolean; // true si deltaSignificant o hay señales de deterioro
  professionalReviewDone: boolean;     // El profesional marcó que revisó antes de comunicar
  professionalReviewNotes: string;     // Notas de la revisión (obligatorias si reviewRequired)

  // Control ético
  consentimientoActivo: boolean;       // El consentimiento sigue vigente
  encryptionVersion: string;           // Versión de cifrado para auditoría ('v1')

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

const DimensionSchema = new Schema<IDimension>(
  {
    score: { type: Number, required: true, min: 0, max: 10 },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const IPSCMeasurementSchema = new Schema<IIPSCMeasurement>(
  {
    beneficiaryInternalCode: { type: String, required: true, index: true },
    measurementDate: { type: Date, required: true, default: Date.now },
    measurementPeriod: {
      type: String,
      enum: ['ingreso', '30d', '90d', '180d', 'seguimiento_especial'],
      required: true,
    },
    appliedBy: { type: String, required: true },
    appliedByRole: {
      type: String,
      enum: ['psicologa', 'trabajadora_social', 'abogada', 'coordinadora', 'medica'],
      required: true,
    },

    dimensions: {
      seguridadFisica: { type: DimensionSchema, required: true },
      seguridadDigital: { type: DimensionSchema, required: true },
      autonomiaEconomica: { type: DimensionSchema, required: true },
      redDeApoyo: { type: DimensionSchema, required: true },
      accesoAJusticia: { type: DimensionSchema, required: true },
      accesoASalud: { type: DimensionSchema, required: true },
      bienestarPsicosocial: { type: DimensionSchema, required: true },
      conocimientoDerechos: { type: DimensionSchema, required: true },
      capacidadRespuesta: { type: DimensionSchema, required: true },
      continuidadAcompanamiento: { type: DimensionSchema, required: true },
    },

    ipscTotal: { type: Number, required: true, min: 0, max: 10 },
    deltaFromPrevious: { type: Number, default: null },
    deltaSignificant: { type: Boolean, default: false },

    professionalReviewRequired: { type: Boolean, default: false },
    professionalReviewDone: { type: Boolean, default: false },
    professionalReviewNotes: { type: String, default: '' },

    consentimientoActivo: { type: Boolean, required: true, default: true },
    encryptionVersion: { type: String, default: 'v1' },
  },
  {
    timestamps: true,
    collection: 'ipsc_measurements',
  }
);

// Índice compuesto para consultas de trayectoria longitudinal
IPSCMeasurementSchema.index({ beneficiaryInternalCode: 1, measurementDate: 1 });

export default mongoose.models.IPSCMeasurement ||
  mongoose.model<IIPSCMeasurement>('IPSCMeasurement', IPSCMeasurementSchema);
