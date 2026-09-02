import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  institutionName: string;
  category: 'HOTEL' | 'COLEGIO' | 'UNIVERSIDAD' | 'EMPRESA' | 'ENTIDAD_PUBLICA';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  neighborhood: string;
  level: 'NIVEL_1_PREVENCION' | 'NIVEL_2_PROTOCOLO' | 'NIVEL_3_ESPACIO_SEGURO' | 'NIVEL_4_EXCELENCIA';
  status: 'POSTULADA' | 'EN_AUDITORIA' | 'CERTIFICADA' | 'RECHAZADA' | 'VENCIDA';
  validUntil?: Date;
  approvedBy?: string;
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    institutionName: { type: String, required: true },
    category: {
      type: String,
      enum: ['HOTEL', 'COLEGIO', 'UNIVERSIDAD', 'EMPRESA', 'ENTIDAD_PUBLICA'],
      required: true,
    },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    neighborhood: { type: String, required: true },
    level: {
      type: String,
      enum: ['NIVEL_1_PREVENCION', 'NIVEL_2_PROTOCOLO', 'NIVEL_3_ESPACIO_SEGURO', 'NIVEL_4_EXCELENCIA'],
      default: 'NIVEL_1_PREVENCION',
    },
    status: {
      type: String,
      enum: ['POSTULADA', 'EN_AUDITORIA', 'CERTIFICADA', 'RECHAZADA', 'VENCIDA'],
      default: 'POSTULADA',
    },
    validUntil: { type: Date },
    approvedBy: { type: String },
    verificationNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Certification ||
  mongoose.model<ICertification>('Certification', CertificationSchema);
