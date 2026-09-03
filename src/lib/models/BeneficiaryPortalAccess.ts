import mongoose, { Schema, Document } from 'mongoose';

export interface IBeneficiaryPortalAccess extends Document {
  patientId: string;
  documentNumber: string; // Usuario (cédula)
  passwordHash: string;
  password?: string; // Compatibilidad temporal con registros antiguos
  patientName: string;
  patientCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const BeneficiaryPortalAccessSchema = new Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    documentNumber: { type: String, required: true, index: true },
    passwordHash: { type: String, required: false, select: false },
    password: { type: String, required: false, select: false },
    patientName: { type: String, required: true },
    patientCode: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.BeneficiaryPortalAccess ||
  mongoose.model<IBeneficiaryPortalAccess>('BeneficiaryPortalAccess', BeneficiaryPortalAccessSchema);
