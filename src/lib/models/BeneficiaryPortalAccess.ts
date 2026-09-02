import mongoose, { Schema, Document } from 'mongoose';

export interface IBeneficiaryPortalAccess extends Document {
  patientId: string;
  documentNumber: string; // Usuario (cédula)
  password: string; // Contraseña inicial (cédula)
  patientName: string;
  patientCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const BeneficiaryPortalAccessSchema = new Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    documentNumber: { type: String, required: true, index: true },
    password: { type: String, required: true },
    patientName: { type: String, required: true },
    patientCode: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.BeneficiaryPortalAccess ||
  mongoose.model<IBeneficiaryPortalAccess>('BeneficiaryPortalAccess', BeneficiaryPortalAccessSchema);
