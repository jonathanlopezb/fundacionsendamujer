import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorProfile extends Document {
  id: string;
  name: string;
  role: 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO' | 'COORDINADOR' | 'ADMIN_SISTEMA';
  roleTitle: string;
  specialty: string;
  code: string;
  rethus: string;
  email: string;
  password?: string;
  phone: string;
  avatarBg: string;
  badgeColor: string;
  status: 'ACTIVO' | 'LICENCIA' | 'INACTIVO';
  createdAt: Date;
  updatedAt: Date;
}

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['MEDICO', 'TRABAJO_SOCIAL', 'JURIDICO', 'PSICOLOGO', 'COORDINADOR', 'ADMIN_SISTEMA'],
      required: true,
    },
    roleTitle: { type: String, required: true },
    specialty: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    rethus: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: 'senda2026' },
    phone: { type: String, default: '+57 300 000 0000' },
    avatarBg: { type: String, default: 'bg-emerald-600' },
    badgeColor: { type: String, default: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    status: { type: String, enum: ['ACTIVO', 'LICENCIA', 'INACTIVO'], default: 'ACTIVO' },
  },
  { timestamps: true }
);

export default mongoose.models.DoctorProfile ||
  mongoose.model<IDoctorProfile>('DoctorProfile', DoctorProfileSchema);
