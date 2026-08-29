import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  fullName: string;
  phone: string;
  email?: string;
  specialty:
    | 'Ginecología Especializada & Salud Reproductiva'
    | 'Psicología & Salud Mental'
    | 'Medicina General & Salud Reproductiva'
    | 'Odontología Integral'
    | 'Asesoría Jurídica & VBG'
    | 'Trabajo Social';
  preferredDate: string;
  preferredTime: string;
  location: string;
  notes?: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    specialty: {
      type: String,
      enum: [
        'Ginecología Especializada & Salud Reproductiva',
        'Psicología & Salud Mental',
        'Medicina General & Salud Reproductiva',
        'Odontología Integral',
        'Asesoría Jurídica & VBG',
        'Trabajo Social',
      ],
      required: true,
    },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    location: { type: String, default: 'Sede Cartagena / Atención Directa' },
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
