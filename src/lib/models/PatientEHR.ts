import mongoose, { Schema, Document } from 'mongoose';

export interface IClinicalEvolution {
  id: string;
  date: string;
  time: string;
  author: string;
  role: string;
  rethus: string;
  subjective: string;
  objective: string;
  analysis: string;
  plan: string;
  cie10Code?: string;
}

export interface IPatientEHR extends Document {
  id: string;
  patientCode: string;
  patientName: string;
  docId: string;
  age: number;
  birthDate: string;
  bloodType: string;
  eps: string;
  phone: string;
  emergencyContact: string;
  neighborhood: string;
  allergies: string;
  riskLevel: 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';
  ipscScore: number;
  dimensionsIPSC: Record<string, number>;
  primaryCategory: 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO';
  assignedDoctor: string;
  status: 'ACTIVA' | 'EN_ORIENTACION' | 'RUTA_ACTIVADA' | 'EN_SEGUIMIENTO' | 'COMPLETADA';
  vitals: {
    bloodPressure: string;
    heartRate: number;
    weightKg: number;
    heightM: number;
    bmi: number;
    tempC: number;
  };
  evolutions: IClinicalEvolution[];
  prescriptions: Array<{
    id: string;
    date: string;
    medication: string;
    dosage: string;
    duration: string;
    doctor: string;
  }>;
  routesActivated: Array<{
    routeName: string;
    date: string;
    status: string;
    entity: string;
  }>;
  documents: Array<{
    name: string;
    date: string;
    category: string;
    url?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PatientEHRSchema = new Schema<IPatientEHR>(
  {
    id: { type: String, required: true, unique: true },
    patientCode: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    docId: { type: String, required: true },
    age: { type: Number, default: 25 },
    birthDate: { type: String, default: '1999-01-01' },
    bloodType: { type: String, default: 'O+' },
    eps: { type: String, default: 'Mutual Ser EPS-S' },
    phone: { type: String, default: '+57 300 000 0000' },
    emergencyContact: { type: String, default: 'Familiar Responsable' },
    neighborhood: { type: String, default: 'Olaya Herrera, Cartagena' },
    allergies: { type: String, default: 'Ninguna' },
    riskLevel: { type: String, enum: ['BAJO', 'MODERADO', 'ALTO', 'CRITICO'], default: 'BAJO' },
    ipscScore: { type: Number, default: 70 },
    dimensionsIPSC: { type: Schema.Types.Mixed, default: {} },
    primaryCategory: { type: String, enum: ['MEDICO', 'TRABAJO_SOCIAL', 'JURIDICO', 'PSICOLOGO'], default: 'MEDICO' },
    assignedDoctor: { type: String, default: 'Dra. Elena Ruiz' },
    status: {
      type: String,
      enum: ['ACTIVA', 'EN_ORIENTACION', 'RUTA_ACTIVADA', 'EN_SEGUIMIENTO', 'COMPLETADA'],
      default: 'ACTIVA',
    },
    vitals: {
      bloodPressure: { type: String, default: '120/80 mmHg' },
      heartRate: { type: Number, default: 72 },
      weightKg: { type: Number, default: 60 },
      heightM: { type: Number, default: 1.6 },
      bmi: { type: Number, default: 23.4 },
      tempC: { type: Number, default: 36.5 },
    },
    evolutions: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        author: { type: String, required: true },
        role: { type: String, required: true },
        rethus: { type: String, required: true },
        subjective: { type: String, required: true },
        objective: { type: String, required: true },
        analysis: { type: String, required: true },
        plan: { type: String, required: true },
        cie10Code: { type: String },
      },
    ],
    prescriptions: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
        doctor: { type: String, required: true },
      },
    ],
    routesActivated: [
      {
        routeName: { type: String, required: true },
        date: { type: String, required: true },
        status: { type: String, required: true },
        entity: { type: String, required: true },
      },
    ],
    documents: [
      {
        name: { type: String, required: true },
        date: { type: String, required: true },
        category: { type: String, required: true },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.PatientEHR ||
  mongoose.model<IPatientEHR>('PatientEHR', PatientEHRSchema);
