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

export interface ILegalProcedure {
  id: string;
  date: string;
  entity: string; // ej: Comisaría de Familia Chiquinquirá, Fiscalía Bolívar, Juzgado de Familia
  procedureType: string; // ej: Medida de Protección Ley 1257/2008, Denuncia VBG, Custodia, Alimentos
  status: 'RADICADO' | 'EN_MEDIDA' | 'AUDIENCIA' | 'RESUELTO' | 'ARCHIVADO';
  caseNumber?: string;
  notes: string;
  documents?: Array<{ name: string; url?: string; date: string }>;
}

export interface IResourceProvided {
  id: string;
  date: string;
  resourceType: 'KIT_MATERNAL' | 'CAPITAL_SEMILLA' | 'HOSPEDAJE_REFUGIO' | 'SUBSIDIO_TRANSPORTE' | 'MERCADO_ALIMENTARIO' | 'ATENCION_ODONTOLOGICA';
  description: string;
  quantity: number;
  estimatedValueCop: number;
  deliveredBy: string;
}

export interface IMultidisciplinaryProgress {
  id: string;
  date: string;
  professionalName: string;
  role: string;
  area: 'MEDICINA' | 'PSICOLOGIA' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'ODONTOLOGIA';
  milestone: string;
  summary: string;
  nextAction?: string;
}

export interface IPatientEHR extends Document {
  id: string;
  patientCode: string;
  patientName: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  secondLastName?: string;
  documentType?: string;
  documentNumber?: string;
  docId: string;
  age: number;
  birthDate: string;
  bloodType: string;
  eps?: string;
  phone: string;
  email?: string;
  department?: string;
  municipality?: string;
  neighborhood: string;
  address?: string;
  preferredContact?: string;
  safeContact?: string;
  educationLevel?: string;
  maritalStatus?: string;
  occupation?: string;
  employmentStatus?: string;
  householdMembers?: number;
  hasChildren?: boolean;
  childrenCount?: number;
  healthRegime?: string;
  typeOfDisability?: string;
  accessibilitySupport?: string;
  motivation?: string[];
  riskSituations?: string[];
  emergencyContact: string;
  allergies: string;
  riskLevel: 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';
  ipscScore: number;
  dimensionsIPSC: Record<string, number>;
  primaryCategory: 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO';
  assignedDoctor: string;
  assignedProfessionalIds?: string[];
  assignedProfessionalNames?: string[];
  status: 'ACTIVA' | 'EN_ORIENTACION' | 'RUTA_ACTIVADA' | 'EN_SEGUIMIENTO' | 'COMPLETADA';
  vitals: {
    bloodPressure: string;
    heartRate: number;
    weightKg: number;
    heightM: number;
    bmi: number;
    tempC: number;
  };
  consents?: Array<{
    purpose: string;
    grantedAt: Date;
    status: 'CONCEDIDO' | 'REVOCADO';
    version: string;
  }>;
  evolutions: IClinicalEvolution[];
  legalProcedures: ILegalProcedure[];
  resourcesProvided: IResourceProvided[];
  multidisciplinaryProgress: IMultidisciplinaryProgress[];
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
    firstName: { type: String },
    secondName: { type: String },
    lastName: { type: String },
    secondLastName: { type: String },
    documentType: { type: String, default: 'CC' },
    documentNumber: { type: String },
    docId: { type: String, required: true },
    age: { type: Number, default: 25 },
    birthDate: { type: String, default: '1999-01-01' },
    bloodType: { type: String, default: 'O+' },
    eps: { type: String, default: 'Mutual Ser EPS-S' },
    phone: { type: String, default: '+57 300 000 0000' },
    email: { type: String },
    department: { type: String },
    municipality: { type: String },
    neighborhood: { type: String, default: 'Olaya Herrera, Cartagena' },
    address: { type: String },
    preferredContact: { type: String, default: 'WhatsApp' },
    safeContact: { type: String },
    educationLevel: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },
    employmentStatus: { type: String },
    householdMembers: { type: Number },
    hasChildren: { type: Boolean },
    childrenCount: { type: Number },
    healthRegime: { type: String },
    typeOfDisability: { type: String },
    accessibilitySupport: { type: String },
    motivation: [{ type: String }],
    riskSituations: [{ type: String }],
    emergencyContact: { type: String, default: 'Familiar Responsable' },
    allergies: { type: String, default: 'Ninguna' },
    riskLevel: { type: String, enum: ['BAJO', 'MODERADO', 'ALTO', 'CRITICO'], default: 'BAJO' },
    ipscScore: { type: Number, default: 70 },
    dimensionsIPSC: { type: Schema.Types.Mixed, default: {} },
    primaryCategory: { type: String, enum: ['MEDICO', 'TRABAJO_SOCIAL', 'JURIDICO', 'PSICOLOGO'], default: 'MEDICO' },
    assignedDoctor: { type: String, default: 'Dra. Elena Ruiz' },
    assignedProfessionalIds: { type: [String], default: [] },
    assignedProfessionalNames: { type: [String], default: [] },
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
    consents: [
      {
        purpose: { type: String, required: true },
        grantedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['CONCEDIDO', 'REVOCADO'], default: 'CONCEDIDO' },
        version: { type: String, default: '1.0' },
      },
    ],
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
    legalProcedures: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        entity: { type: String, required: true },
        procedureType: { type: String, required: true },
        status: { type: String, enum: ['RADICADO', 'EN_MEDIDA', 'AUDIENCIA', 'RESUELTO', 'ARCHIVADO'], default: 'RADICADO' },
        caseNumber: { type: String },
        notes: { type: String, required: true },
        documents: [{ name: String, url: String, date: String }],
      },
    ],
    resourcesProvided: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        resourceType: { type: String, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        estimatedValueCop: { type: Number, default: 0 },
        deliveredBy: { type: String, required: true },
      },
    ],
    multidisciplinaryProgress: [
      {
        id: { type: String, required: true },
        date: { type: String, required: true },
        professionalName: { type: String, required: true },
        role: { type: String, required: true },
        area: { type: String, required: true },
        milestone: { type: String, required: true },
        summary: { type: String, required: true },
        nextAction: { type: String },
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
