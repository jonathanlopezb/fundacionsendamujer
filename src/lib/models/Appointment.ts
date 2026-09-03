import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patientId?: string;
  professionalId?: string;
  beneficiaryId?: string;
  patientCode?: string;
  fullName: string;
  patientName?: string;
  professionalName?: string;
  phone: string;
  email?: string;
  specialty: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  modality?: string;
  notes?: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: String },
    professionalId: { type: String },
    beneficiaryId: { type: String },
    patientCode: { type: String },
    fullName: { type: String, required: true },
    patientName: { type: String },
    professionalName: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    specialty: { type: String, required: true, trim: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    location: { type: String, default: 'Sede Cartagena / Atención Directa' },
    modality: { type: String, default: 'Presencial Sede Pie de la Popa' },
    notes: { type: String },
    status: {
      type: String,
      enum: ['PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'],
      default: 'PENDIENTE',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', AppointmentSchema);
