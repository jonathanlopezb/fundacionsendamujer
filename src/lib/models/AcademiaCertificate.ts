import mongoose, { Document, Schema } from 'mongoose';
export interface IAcademiaCertificate extends Document { code: string; learnerName: string; learnerId: string; courseSlug: string; courseTitle: string; instructor: string; hours: number; issuedAt: Date; status: 'VALID' | 'REVOKED'; }
const Def = new Schema<IAcademiaCertificate>({ code: { type: String, unique: true, index: true }, learnerName: String, learnerId: String, courseSlug: String, courseTitle: String, instructor: String, hours: Number, issuedAt: { type: Date, default: Date.now }, status: { type: String, enum: ['VALID', 'REVOKED'], default: 'VALID' } }, { collection: 'academia_certificates' });
export default mongoose.models.AcademiaCertificate || mongoose.model<IAcademiaCertificate>('AcademiaCertificate', Def);
