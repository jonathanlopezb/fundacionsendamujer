import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorProfile extends Document {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  documentType: string;
  documentNumber: string;
  birthDate?: string;
  publicName?: string;
  role: 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO' | 'COORDINADOR' | 'ADMIN_SISTEMA';
  roleTitle: string;
  specialty: string;
  code: string;
  rethus: string;
  professionalCard?: string;
  issuingEntity?: string;
  institutionName?: string;
  organizationType?: string;
  city?: string;
  department?: string;
  municipalities?: string[];
  modalities?: string[];
  services?: string[];
  population?: string[];
  availability?: string;
  urgentCases?: boolean;
  yearsExperience?: string;
  bio?: string;
  consentsAccepted?: boolean;
  verificationStatus: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO' | 'VENCIDO';
  verifiedBy?: string;
  verifiedAt?: Date;
  email: string;
  passwordHash: string;
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
    firstName: String,
    lastName: String,
    documentType: { type: String, required: true, default: 'CC' },
    documentNumber: { type: String, required: true, unique: true },
    birthDate: String,
    publicName: String,
    role: {
      type: String,
      enum: ['MEDICO', 'TRABAJO_SOCIAL', 'JURIDICO', 'PSICOLOGO', 'COORDINADOR', 'ADMIN_SISTEMA'],
      required: true,
    },
    roleTitle: { type: String, required: true },
    specialty: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    rethus: { type: String, default: '' },
    professionalCard: String,
    issuingEntity: String,
    institutionName: String,
    organizationType: String,
    city: String,
    department: String,
    municipalities: { type: [String], default: [] },
    modalities: { type: [String], default: [] },
    services: { type: [String], default: [] },
    population: { type: [String], default: [] },
    availability: String,
    urgentCases: { type: Boolean, default: false },
    yearsExperience: String,
    bio: { type: String, maxlength: 500 },
    consentsAccepted: { type: Boolean, required: true },
    verificationStatus: { type: String, enum: ['PENDIENTE', 'VERIFICADO', 'RECHAZADO', 'VENCIDO'], default: 'PENDIENTE' },
    verifiedBy: String,
    verifiedAt: Date,
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: '+57 300 000 0000' },
    avatarBg: { type: String, default: 'bg-emerald-600' },
    badgeColor: { type: String, default: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    status: { type: String, enum: ['ACTIVO', 'LICENCIA', 'INACTIVO'], default: 'ACTIVO' },
  },
  { timestamps: true }
);

export default mongoose.models.DoctorProfile ||
  mongoose.model<IDoctorProfile>('DoctorProfile', DoctorProfileSchema);
