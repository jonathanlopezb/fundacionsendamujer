import mongoose, { Schema, Document } from 'mongoose';

export interface ITriageResult extends Document {
  patientName: string;
  phone: string;
  email?: string;
  age: number;
  neighborhood: string; // Barrio Cartagena
  scores: {
    emotionalRisk: number; // 0-100
    violenceRisk: number; // 0-100
    pregnancySupportNeeded: number; // 0-100
    legalNeed: number; // 0-100
  };
  overallRiskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'EMERGENCIA_CRÍTICA';
  primaryDepartment: 'Psicología' | 'Medicina General' | 'Odontología' | 'Asesoría Jurídica' | 'Trabajo Social';
  recommendedProgram: string;
  answers: Record<string, string>;
  createdAt: Date;
}

const TriageResultSchema = new Schema<ITriageResult>(
  {
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    age: { type: Number, required: true },
    neighborhood: { type: String, default: 'Cartagena' },
    scores: {
      emotionalRisk: { type: Number, default: 0 },
      violenceRisk: { type: Number, default: 0 },
      pregnancySupportNeeded: { type: Number, default: 0 },
      legalNeed: { type: Number, default: 0 },
    },
    overallRiskLevel: {
      type: String,
      enum: ['BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA_CRÍTICA'],
      default: 'MEDIO',
    },
    primaryDepartment: {
      type: String,
      enum: ['Psicología', 'Medicina General', 'Odontología', 'Asesoría Jurídica', 'Trabajo Social'],
      required: true,
    },
    recommendedProgram: { type: String, required: true },
    answers: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.TriageResult ||
  mongoose.model<ITriageResult>('TriageResult', TriageResultSchema);
