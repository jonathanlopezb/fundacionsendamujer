/**
 * DeteriorationAlert Model — Sistema de Señales de Deterioro
 *
 * LÍMITE ÉTICO ABSOLUTO (Blueprint cap. 8):
 * Este modelo NUNCA almacena:
 *   - "probabilidad de violencia"
 *   - "riesgo de feminicidio"
 *   - Cualquier predicción de evento futuro
 *
 * Solo registra SEÑALES DE DETERIORO observadas en las dimensiones del IPSC,
 * que requieren revisión prioritaria por un profesional humano.
 * La decisión final SIEMPRE corresponde al equipo profesional, nunca al sistema.
 */
import mongoose, { Schema, Document } from 'mongoose';

export type AlertLevel = 'amarilla' | 'roja';
export type AlertStatus = 'pendiente' | 'en_revision' | 'resuelta' | 'escalada';

export interface IDeteriorationAlert extends Document {
  beneficiaryInternalCode: string;
  alertLevel: AlertLevel;
  triggeredAt: Date;
  triggeredBy: 'sistema' | 'profesional';    // ¿Quién detectó la señal?

  // Señales detectadas — siempre en términos de cambio observado, NUNCA predicciones
  signals: string[];                          // Ej: "Disminución en red de apoyo (–3.5 pts)"
  dimensionsAffected: string[];               // Nombres de las dimensiones que bajaron
  suggestedActionBySystem: string;            // Sugerencia del sistema, NO decisión

  // Respuesta profesional OBLIGATORIA
  assignedTo: string;                        // Profesional asignado
  assignedToRole: string;
  status: AlertStatus;
  humanDecision: string;                     // OBLIGATORIO al resolver: qué decidió el profesional
  humanDecisionAt: Date | null;
  resolvedAt: Date | null;
  escalatedToDirection: boolean;             // Fue escalada a la coordinación del Espacio Seguro

  // Metadatos para el panel de alertas
  ipscTotalAtAlert: number;
  previousIPSCTotal: number | null;
  measurementId: string;                     // ID de la medición que generó la alerta

  createdAt: Date;
  updatedAt: Date;
}

const DeteriorationAlertSchema = new Schema<IDeteriorationAlert>(
  {
    beneficiaryInternalCode: { type: String, required: true, index: true },
    alertLevel: { type: String, enum: ['amarilla', 'roja'], required: true },
    triggeredAt: { type: Date, required: true, default: Date.now },
    triggeredBy: { type: String, enum: ['sistema', 'profesional'], default: 'sistema' },

    signals: [{ type: String }],
    dimensionsAffected: [{ type: String }],
    suggestedActionBySystem: { type: String, default: '' },

    assignedTo: { type: String, default: '' },
    assignedToRole: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pendiente', 'en_revision', 'resuelta', 'escalada'],
      default: 'pendiente',
    },
    humanDecision: { type: String, default: '' },
    humanDecisionAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    escalatedToDirection: { type: Boolean, default: false },

    ipscTotalAtAlert: { type: Number },
    previousIPSCTotal: { type: Number, default: null },
    measurementId: { type: String },
  },
  {
    timestamps: true,
    collection: 'deterioration_alerts',
  }
);

DeteriorationAlertSchema.index({ status: 1, alertLevel: 1, triggeredAt: -1 });

export default mongoose.models.DeteriorationAlert ||
  mongoose.model<IDeteriorationAlert>('DeteriorationAlert', DeteriorationAlertSchema);
