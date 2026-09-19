import mongoose, { Schema, Document } from 'mongoose';
export interface IAcademiaRole extends Document { name: string; description?: string; permissions: string[]; active: boolean; }
const Def = new Schema<IAcademiaRole>({ name: { type: String, unique: true }, description: String, permissions: [String], active: { type: Boolean, default: true } }, { timestamps: true, collection: 'academia_roles' });
export default mongoose.models.AcademiaRole || mongoose.model<IAcademiaRole>('AcademiaRole', Def);
