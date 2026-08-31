/**
 * ProtectionPlan Model — My Protection Plan
 *
 * Itinerario individual de fortalecimiento y protección de la participante.
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IProtectionGoal {
  id: string;
  title: string;
  category: string;
  status: 'PENDIENTE' | 'EN_PROGRESO' | 'LOGRADO';
  targetDate?: string;
}

export interface IProtectionAction {
  id: string;
  title: string;
  status: 'PENDIENTE' | 'COMPLETADA';
  assignedProfessional?: string;
}

export interface IProtectionPlan extends Document {
  participantId: string;
  anonymizedCode: string;
  objectives: IProtectionGoal[];
  actions: IProtectionAction[];
  assignedProfessional: string;
  protectionIndexCurrent: number;
  protectionIndexBaseline: number;
  lastEvaluatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProtectionPlanSchema = new Schema<IProtectionPlan>(
  {
    participantId: { type: String, required: true },
    anonymizedCode: { type: String, required: true },
    objectives: [
      {
        id: String,
        title: String,
        category: String,
        status: { type: String, enum: ['PENDIENTE', 'EN_PROGRESO', 'LOGRADO'], default: 'EN_PROGRESO' },
        targetDate: String,
      },
    ],
    actions: [
      {
        id: String,
        title: String,
        status: { type: String, enum: ['PENDIENTE', 'COMPLETADA'], default: 'PENDIENTE' },
        assignedProfessional: String,
      },
    ],
    assignedProfessional: { type: String, default: 'Equipo Profesional Senda' },
    protectionIndexCurrent: { type: Number, default: 5.0 },
    protectionIndexBaseline: { type: Number, default: 4.0 },
    lastEvaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'caribe_protection_plans' }
);

export default mongoose.models.ProtectionPlan ||
  mongoose.model<IProtectionPlan>('ProtectionPlan', ProtectionPlanSchema);
