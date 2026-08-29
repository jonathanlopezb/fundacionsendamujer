import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorName: string;
  email: string;
  phone?: string;
  amountCOP: number;
  impactType: 'Kit Maternidad' | 'Sesión Psicológica' | 'Consulta Odontológica' | 'Asesoría Jurídica' | 'Beca Emprendimiento' | 'Aporte Libre';
  unitsSponsored: number;
  message?: string;
  isAnonymous: boolean;
  status: 'PENDIENTE' | 'COMPLETADA';
  createdAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donorName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    amountCOP: { type: Number, required: true },
    impactType: {
      type: String,
      enum: [
        'Kit Maternidad',
        'Sesión Psicológica',
        'Consulta Odontológica',
        'Asesoría Jurídica',
        'Beca Emprendimiento',
        'Aporte Libre',
      ],
      default: 'Aporte Libre',
    },
    unitsSponsored: { type: Number, default: 1 },
    message: { type: String },
    isAnonymous: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['PENDIENTE', 'COMPLETADA'],
      default: 'COMPLETADA',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Donation ||
  mongoose.model<IDonation>('Donation', DonationSchema);
