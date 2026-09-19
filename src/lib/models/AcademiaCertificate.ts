import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademiaCertificate extends Document {
  code: string;
  learnerName: string;
  learnerId?: string;
  courseSlug: string;
  courseTitle: string;
  courseCategory?: string;
  instructor: string;
  hours: number;
  grade?: number;
  qrUrl?: string;
  issuedAt: Date;
  status: 'VALID' | 'REVOKED';
}

const Def = new Schema<IAcademiaCertificate>({
  code: { type: String, unique: true, index: true, required: true },
  learnerName: { type: String, required: true },
  learnerId: String,
  courseSlug: { type: String, required: true, index: true },
  courseTitle: { type: String, required: true },
  courseCategory: { type: String, default: 'Autonomía Económica' },
  instructor: { type: String, required: true },
  hours: { type: Number, default: 32 },
  grade: { type: Number, default: 95 },
  qrUrl: String,
  issuedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['VALID', 'REVOKED'], default: 'VALID' },
}, { timestamps: true, collection: 'academia_certificates' });

export default mongoose.models.AcademiaCertificate || mongoose.model<IAcademiaCertificate>('AcademiaCertificate', Def);
