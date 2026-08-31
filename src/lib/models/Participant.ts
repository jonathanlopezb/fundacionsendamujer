/**
 * Participant Model — Caribe Seguro
 *
 * Maneja el registro progresivo, ID interno (CSM-2026-XXXXXX) y los 4 niveles de participación.
 * Separación estricta de la identidad legal bajo Ley 1581 (Habeas Data).
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IParticipant extends Document {
  participantId: string; // ej: "CSM-2026-000001"
  anonymizedCode: string; // ej: "SM-8842"
  participationLevel: 'PARTICIPANTE' | 'BENEFICIARIA' | 'ACOMPANAMIENTO' | 'LIDERAZGO_COMUNITARIO';
  registrationChannel: string;
  needsCategory: string[];
  consentGranted: boolean;
  status: 'ACTIVO' | 'EN_SEGUIMIENTO' | 'GRADUADA' | 'INACTIVO';
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    participantId: { type: String, required: true, unique: true },
    anonymizedCode: { type: String, required: true },
    participationLevel: {
      type: String,
      enum: ['PARTICIPANTE', 'BENEFICIARIA', 'ACOMPANAMIENTO', 'LIDERAZGO_COMUNITARIO'],
      default: 'PARTICIPANTE',
    },
    registrationChannel: { type: String, default: 'web_caribe_seguro' },
    needsCategory: [{ type: String }],
    consentGranted: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['ACTIVO', 'EN_SEGUIMIENTO', 'GRADUADA', 'INACTIVO'],
      default: 'ACTIVO',
    },
  },
  {
    timestamps: true,
    collection: 'caribe_participants',
  }
);

export default mongoose.models.Participant ||
  mongoose.model<IParticipant>('Participant', ParticipantSchema);
