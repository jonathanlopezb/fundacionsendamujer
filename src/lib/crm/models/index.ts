import mongoose, { Schema, Model, Document } from 'mongoose';

// ==========================================
// 1. COUNTER (Generador Atómico de Códigos)
// ==========================================
export interface ICrmCounter extends Document {
  key: string;
  year: number;
  seq: number;
}
const CrmCounterSchema = new Schema<ICrmCounter>({
  key: { type: String, required: true },
  year: { type: Number, required: true },
  seq: { type: Number, default: 0 },
});
CrmCounterSchema.index({ key: 1, year: 1 }, { unique: true });

export async function getNextSequence(key: string, prefix: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const counterModel = mongoose.models.CrmCounter || mongoose.model<ICrmCounter>('CrmCounter', CrmCounterSchema);
  const result = await counterModel.findOneAndUpdate(
    { key, year: currentYear },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const formattedSeq = String(result.seq).padStart(5, '0');
  return `${prefix}-${currentYear}-${formattedSeq}`;
}

// ==========================================
// 2. USERS (Usuarios del CRM & IAM)
// ==========================================
export interface ICrmUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  documentNumber?: string;
  phone?: string;
  specialty?: string;
  scopes: {
    programIds: string[];
    projectIds: string[];
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const CrmUserSchema = new Schema<ICrmUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        'SUPER_ADMIN',
        'DIRECTORA',
        'COORDINADOR',
        'TRABAJADOR_SOCIAL',
        'PSICOLOGO',
        'ABOGADO',
        'GESTOR_PROGRAMAS',
        'GESTOR_DONANTES',
        'GESTOR_FINANCIERO',
        'VOLUNTARIO',
        'CONSULTA',
      ],
      default: 'TRABAJADOR_SOCIAL',
    },
    documentNumber: { type: String },
    phone: { type: String },
    specialty: { type: String },
    scopes: {
      programIds: { type: [String], default: [] },
      projectIds: { type: [String], default: [] },
    },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    mfaEnabled: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// ==========================================
// 3. PEOPLE (Personas & Núcleo CRM)
// ==========================================
export interface ICrmPerson extends Document {
  code: string;
  firstName: string;
  lastName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP' | 'PPT' | 'PASAPORTE' | 'OTRO';
  documentNumber: string;
  documentNumberHash: string;
  birthDate?: Date;
  gender?: 'FEMALE' | 'MALE' | 'NON_BINARY' | 'OTHER';
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    locality?: string;
  };
  occupation?: string;
  educationLevel?: string;
  roles: Array<'BENEFICIARY' | 'DONOR' | 'VOLUNTEER' | 'STAFF' | 'PARTNER' | 'PROFESSIONAL' | 'INSTITUTIONAL_CONTACT'>;
  protectedIdentity: boolean;
  pseudonym?: string;
  habeasDataConsent: {
    granted: boolean;
    grantedAt?: Date;
    evidenceText?: string;
  };
  classification: 'CONFIDENTIAL' | 'RESTRICTED' | 'INTERNAL';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}
const CrmPersonSchema = new Schema<ICrmPerson>(
  {
    code: { type: String, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    documentType: { type: String, enum: ['CC', 'TI', 'CE', 'PEP', 'PPT', 'PASAPORTE', 'OTRO'], default: 'CC' },
    documentNumber: { type: String, required: true },
    documentNumberHash: { type: String, index: true },
    birthDate: { type: Date },
    gender: { type: String, enum: ['FEMALE', 'MALE', 'NON_BINARY', 'OTHER'], default: 'FEMALE' },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    address: {
      street: { type: String },
      neighborhood: { type: String },
      city: { type: String, default: 'Cartagena' },
      locality: { type: String },
    },
    occupation: { type: String },
    educationLevel: { type: String },
    roles: {
      type: [String],
      enum: ['BENEFICIARY', 'DONOR', 'VOLUNTEER', 'STAFF', 'PARTNER', 'PROFESSIONAL', 'INSTITUTIONAL_CONTACT'],
      default: ['BENEFICIARY'],
    },
    protectedIdentity: { type: Boolean, default: false },
    pseudonym: { type: String },
    habeasDataConsent: {
      granted: { type: Boolean, default: true },
      grantedAt: { type: Date, default: Date.now },
      evidenceText: { type: String, default: 'Autorización expresa según Ley 1581 de 2012' },
    },
    classification: { type: String, enum: ['CONFIDENTIAL', 'RESTRICTED', 'INTERNAL'], default: 'CONFIDENTIAL' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

// ==========================================
// 4. HOUSEHOLDS (Hogares & Caracterización)
// ==========================================
export interface ICrmHousehold extends Document {
  code: string;
  headPersonId?: string;
  address: string;
  neighborhood: string;
  locality?: string;
  city: string;
  housingType: string;
  stratum: number;
  membersCount: number;
  childrenCount: number;
  services: string[];
  socioeconomicRisks: string[];
  vulnerabilities: string[];
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}
const CrmHouseholdSchema = new Schema<ICrmHousehold>(
  {
    code: { type: String, unique: true },
    headPersonId: { type: String },
    address: { type: String, required: true },
    neighborhood: { type: String, required: true },
    locality: { type: String },
    city: { type: String, default: 'Cartagena' },
    housingType: { type: String, default: 'Propia' },
    stratum: { type: Number, default: 1 },
    membersCount: { type: Number, default: 1 },
    childrenCount: { type: Number, default: 0 },
    services: { type: [String], default: [] },
    socioeconomicRisks: { type: [String], default: [] },
    vulnerabilities: { type: [String], default: [] },
    observations: { type: String },
  },
  { timestamps: true }
);

// ==========================================
// 5. CASES (Casos de Acompañamiento Social/Legal/Psicológico)
// ==========================================
export interface ICrmCase extends Document {
  caseNumber: string;
  personId: string;
  householdId?: string;
  programId?: string;
  projectId?: string;
  type: 'SOCIAL' | 'PSYCHOLOGICAL' | 'LEGAL' | 'EMPOWERMENT' | 'EMERGENCY' | 'MEDICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSESSMENT' | 'PLAN' | 'FOLLOW_UP' | 'REFERRAL' | 'REFERRAL_FOLLOW_UP' | 'CLOSED';
  openingReason: string;
  assessmentSummary?: string;
  responsibleUserId: string;
  responsibleUserName?: string;
  openedAt: Date;
  closedAt?: Date;
  closureReason?: string;
  outcome?: string;
  classification: 'RESTRICTED';
  lastFollowUpAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const CrmCaseSchema = new Schema<ICrmCase>(
  {
    caseNumber: { type: String, required: true, unique: true },
    personId: { type: String, required: true, index: true },
    householdId: { type: String },
    programId: { type: String },
    projectId: { type: String },
    type: {
      type: String,
      enum: ['SOCIAL', 'PSYCHOLOGICAL', 'LEGAL', 'EMPOWERMENT', 'EMERGENCY', 'MEDICAL'],
      required: true,
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    status: {
      type: String,
      enum: ['NEW', 'ASSESSMENT', 'PLAN', 'FOLLOW_UP', 'REFERRAL', 'REFERRAL_FOLLOW_UP', 'CLOSED'],
      default: 'NEW',
    },
    openingReason: { type: String, required: true },
    assessmentSummary: { type: String },
    responsibleUserId: { type: String, required: true },
    responsibleUserName: { type: String },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    closureReason: { type: String },
    outcome: { type: String },
    classification: { type: String, default: 'RESTRICTED' },
    lastFollowUpAt: { type: Date },
  },
  { timestamps: true }
);

// ==========================================
// 6. CASE NOTES (Notas Confidenciales Cifradas)
// ==========================================
export interface ICrmCaseNote extends Document {
  caseId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  kind: 'ASSESSMENT' | 'SESSION_NOTE' | 'LEGAL_ACTION' | 'HOME_VISIT' | 'FOLLOW_UP' | 'INCIDENT';
  body: string;
  visibilityRoles: string[];
  classification: 'RESTRICTED' | 'CONFIDENTIAL';
  createdAt: Date;
}
const CrmCaseNoteSchema = new Schema<ICrmCaseNote>(
  {
    caseId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    kind: {
      type: String,
      enum: ['ASSESSMENT', 'SESSION_NOTE', 'LEGAL_ACTION', 'HOME_VISIT', 'FOLLOW_UP', 'INCIDENT'],
      default: 'SESSION_NOTE',
    },
    body: { type: String, required: true },
    visibilityRoles: { type: [String], default: [] },
    classification: { type: String, default: 'RESTRICTED' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ==========================================
// 7. FOLLOW UPS & REFERRALS
// ==========================================
export interface ICrmFollowUp extends Document {
  caseId: string;
  dueDate: Date;
  doneAt?: Date;
  userId: string;
  userName?: string;
  channel: 'PHONE' | 'VISIT' | 'OFFICE' | 'WHATSAPP';
  summary: string;
  nextFollowUpDate?: Date;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
}
const CrmFollowUpSchema = new Schema<ICrmFollowUp>(
  {
    caseId: { type: String, required: true, index: true },
    dueDate: { type: Date, required: true },
    doneAt: { type: Date },
    userId: { type: String, required: true },
    userName: { type: String },
    channel: { type: String, enum: ['PHONE', 'VISIT', 'OFFICE', 'WHATSAPP'], default: 'PHONE' },
    summary: { type: String, required: true },
    nextFollowUpDate: { type: Date },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'OVERDUE'], default: 'PENDING' },
  },
  { timestamps: true }
);

export interface ICrmReferral extends Document {
  caseId: string;
  institutionName: string;
  routeType: string;
  referredAt: Date;
  status: 'REFERRED' | 'ACCEPTED' | 'IN_PROCESS' | 'RESOLVED' | 'REJECTED';
  responseAt?: Date;
  outcome?: string;
}
const CrmReferralSchema = new Schema<ICrmReferral>(
  {
    caseId: { type: String, required: true, index: true },
    institutionName: { type: String, required: true },
    routeType: { type: String, required: true },
    referredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['REFERRED', 'ACCEPTED', 'IN_PROCESS', 'RESOLVED', 'REJECTED'], default: 'REFERRED' },
    responseAt: { type: Date },
    outcome: { type: String },
  },
  { timestamps: true }
);

// ==========================================
// 8. PROGRAMS & ENROLLMENTS (CAM, THEMIS, ETC.)
// ==========================================
export interface ICrmProgram extends Document {
  code: string;
  name: string;
  description: string;
  objectives: string[];
  targetPopulation: string;
  responsibleUserId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}
const CrmProgramSchema = new Schema<ICrmProgram>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    objectives: { type: [String], default: [] },
    targetPopulation: { type: String, default: 'Mujeres en situación de vulnerabilidad' },
    responsibleUserId: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export interface ICrmProgramEnrollment extends Document {
  personId: string;
  programId: string;
  cohortId?: string;
  productiveLine?: string; // CAM: Costura, Panadería, Sublimación, etc.
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'GRADUATED' | 'DROPPED';
  enrolledAt: Date;
  completedAt?: Date;
  notes?: string;
}
const CrmProgramEnrollmentSchema = new Schema<ICrmProgramEnrollment>(
  {
    personId: { type: String, required: true, index: true },
    programId: { type: String, required: true, index: true },
    cohortId: { type: String },
    productiveLine: { type: String },
    status: {
      type: String,
      enum: ['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'GRADUATED', 'DROPPED'],
      default: 'ENROLLED',
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// ==========================================
// 9. PROJECTS & OPERATIONS
// ==========================================
export interface ICrmProject extends Document {
  projectCode: string;
  name: string;
  description: string;
  programId?: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  allocatedBudget: number;
  currency: string;
  responsibleUserId?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}
const CrmProjectSchema = new Schema<ICrmProject>(
  {
    projectCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    programId: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, default: 'Cartagena' },
    allocatedBudget: { type: Number, default: 0 },
    currency: { type: String, default: 'COP' },
    responsibleUserId: { type: String },
    status: { type: String, enum: ['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export interface ICrmOperation extends Document {
  operationNumber: string;
  name: string;
  type: 'WORKSHOP' | 'TRAINING' | 'HOME_VISIT' | 'MEDICAL_DAY' | 'LEGAL_DAY' | 'MEETING' | 'CAMPAIGN' | 'AID_DELIVERY' | 'COMMUNITY';
  projectId?: string;
  programId?: string;
  responsibleUserId: string;
  date: Date;
  location: string;
  expectedParticipants: number;
  actualParticipants: number;
  plannedBudget: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  resultsSummary?: string;
  createdAt: Date;
}
const CrmOperationSchema = new Schema<ICrmOperation>(
  {
    operationNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['WORKSHOP', 'TRAINING', 'HOME_VISIT', 'MEDICAL_DAY', 'LEGAL_DAY', 'MEETING', 'CAMPAIGN', 'AID_DELIVERY', 'COMMUNITY'],
      required: true,
    },
    projectId: { type: String },
    programId: { type: String },
    responsibleUserId: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    expectedParticipants: { type: Number, default: 0 },
    actualParticipants: { type: Number, default: 0 },
    plannedBudget: { type: Number, default: 0 },
    status: { type: String, enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
    resultsSummary: { type: String },
  },
  { timestamps: true }
);

export interface ICrmAttendance extends Document {
  operationId: string;
  personId: string;
  status: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'ABSENT';
  checkInAt?: Date;
  method: 'QR' | 'MANUAL';
  recordedBy?: string;
}
const CrmAttendanceSchema = new Schema<ICrmAttendance>(
  {
    operationId: { type: String, required: true, index: true },
    personId: { type: String, required: true, index: true },
    status: { type: String, enum: ['REGISTERED', 'CONFIRMED', 'ATTENDED', 'ABSENT'], default: 'ATTENDED' },
    checkInAt: { type: Date, default: Date.now },
    method: { type: String, enum: ['QR', 'MANUAL'], default: 'MANUAL' },
    recordedBy: { type: String },
  },
  { timestamps: true }
);

// ==========================================
// 10. DONATIONS & REVENUE
// ==========================================
export interface ICrmDonor extends Document {
  personId?: string;
  companyName?: string;
  nit?: string;
  donorType: 'INDIVIDUAL' | 'COMPANY' | 'FOUNDATION' | 'PUBLIC_ENTITY';
  contactEmail: string;
  contactPhone?: string;
  totalDonated: number;
  donationsCount: number;
  lastDonationAt?: Date;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
}
const CrmDonorSchema = new Schema<ICrmDonor>(
  {
    personId: { type: String },
    companyName: { type: String },
    nit: { type: String },
    donorType: { type: String, enum: ['INDIVIDUAL', 'COMPANY', 'FOUNDATION', 'PUBLIC_ENTITY'], default: 'INDIVIDUAL' },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    totalDonated: { type: Number, default: 0 },
    donationsCount: { type: Number, default: 0 },
    lastDonationAt: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export interface ICrmDonation extends Document {
  receiptNumber: string;
  donorId?: string;
  donorName: string;
  donorEmail: string;
  type: 'MONEY' | 'IN_KIND' | 'EQUIPMENT' | 'SERVICE' | 'FOOD' | 'MEDICINE' | 'MATERIAL';
  amount: number;
  currency: 'COP' | 'USD' | 'EUR';
  paymentMethod: string;
  campaignId?: string;
  projectId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
  receivedAt: Date;
  certificateGenerated: boolean;
  notes?: string;
}
const CrmDonationSchema = new Schema<ICrmDonation>(
  {
    receiptNumber: { type: String, required: true, unique: true },
    donorId: { type: String, index: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    type: {
      type: String,
      enum: ['MONEY', 'IN_KIND', 'EQUIPMENT', 'SERVICE', 'FOOD', 'MEDICINE', 'MATERIAL'],
      default: 'MONEY',
    },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['COP', 'USD', 'EUR'], default: 'COP' },
    paymentMethod: { type: String, default: 'Transferencia Bancaria' },
    campaignId: { type: String },
    projectId: { type: String },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED'], default: 'CONFIRMED' },
    receivedAt: { type: Date, default: Date.now },
    certificateGenerated: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

export interface ICrmCampaign extends Document {
  name: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}
const CrmCampaignSchema = new Schema<ICrmCampaign>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'PAUSED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

// ==========================================
// 11. GRANTS & SUBVENCIONES
// ==========================================
export interface ICrmGrantApplication extends Document {
  title: string;
  funderName: string;
  country: string;
  deadline: Date;
  requestedAmount: number;
  approvedAmount?: number;
  currency: string;
  status: 'IDENTIFIED' | 'EVALUATING' | 'IN_PREPARATION' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'IN_EXECUTION' | 'CLOSED';
  responsibleUserId?: string;
  projectId?: string;
  submissionDate?: Date;
  createdAt: Date;
}
const CrmGrantApplicationSchema = new Schema<ICrmGrantApplication>(
  {
    title: { type: String, required: true },
    funderName: { type: String, required: true },
    country: { type: String, default: 'Colombia' },
    deadline: { type: Date, required: true },
    requestedAmount: { type: Number, required: true },
    approvedAmount: { type: Number },
    currency: { type: String, default: 'COP' },
    status: {
      type: String,
      enum: ['IDENTIFIED', 'EVALUATING', 'IN_PREPARATION', 'SUBMITTED', 'APPROVED', 'REJECTED', 'IN_EXECUTION', 'CLOSED'],
      default: 'IDENTIFIED',
    },
    responsibleUserId: { type: String },
    projectId: { type: String },
    submissionDate: { type: Date },
  },
  { timestamps: true }
);

// ==========================================
// 12. VOLUNTEERS
// ==========================================
export interface ICrmVolunteer extends Document {
  personId: string;
  profession: string;
  skills: string[];
  availability: string;
  hoursTotal: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
}
const CrmVolunteerSchema = new Schema<ICrmVolunteer>(
  {
    personId: { type: String, required: true, unique: true },
    profession: { type: String, required: true },
    skills: { type: [String], default: [] },
    availability: { type: String, default: 'Fines de semana' },
    hoursTotal: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export interface ICrmVolunteerShift extends Document {
  volunteerId: string;
  volunteerName?: string;
  operationId?: string;
  date: Date;
  hours: number;
  activity: string;
  evaluation?: string;
}
const CrmVolunteerShiftSchema = new Schema<ICrmVolunteerShift>(
  {
    volunteerId: { type: String, required: true, index: true },
    volunteerName: { type: String },
    operationId: { type: String },
    date: { type: Date, default: Date.now },
    hours: { type: Number, required: true },
    activity: { type: String, required: true },
    evaluation: { type: String },
  },
  { timestamps: true }
);

// ==========================================
// 13. FINANCES (Gastos, Cuentas por Pagar, Pagos, Presupuestos)
// ==========================================
export interface ICrmExpense extends Document {
  expenseNumber: string;
  date: Date;
  category: 'MATERIALS' | 'HONORARIOS' | 'TRANSPORTE' | 'ALIMENTACION' | 'ALQUILER' | 'SERVICIOS' | 'MEDICAMENTOS' | 'DOTACION' | 'OTROS';
  concept: string;
  providerName: string;
  providerNit?: string;
  amount: number;
  currency: string;
  projectId?: string;
  operationId?: string;
  responsibleUserId: string;
  responsibleUserName?: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAYABLE' | 'PAID' | 'VOID';
  approvedBy?: string;
  approvedAt?: Date;
  receiptUrl?: string;
  createdAt: Date;
}
const CrmExpenseSchema = new Schema<ICrmExpense>(
  {
    expenseNumber: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['MATERIALS', 'HONORARIOS', 'TRANSPORTE', 'ALIMENTACION', 'ALQUILER', 'SERVICIOS', 'MEDICAMENTOS', 'DOTACION', 'OTROS'],
      required: true,
    },
    concept: { type: String, required: true },
    providerName: { type: String, required: true },
    providerNit: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'COP' },
    projectId: { type: String },
    operationId: { type: String },
    responsibleUserId: { type: String, required: true },
    responsibleUserName: { type: String },
    status: {
      type: String,
      enum: ['DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PAYABLE', 'PAID', 'VOID'],
      default: 'IN_REVIEW',
    },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

export interface ICrmAccountPayable extends Document {
  expenseId?: string;
  providerName: string;
  concept: string;
  invoiceNumber?: string;
  issueDate: Date;
  dueDate: Date;
  totalAmount: number;
  remainingAmount: number;
  status: 'PENDING' | 'SCHEDULED' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}
const CrmAccountPayableSchema = new Schema<ICrmAccountPayable>(
  {
    expenseId: { type: String },
    providerName: { type: String, required: true },
    concept: { type: String, required: true },
    invoiceNumber: { type: String },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'SCHEDULED', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export interface ICrmPayment extends Document {
  paymentNumber: string;
  accountPayableId?: string;
  expenseId?: string;
  providerName: string;
  date: Date;
  amount: number;
  paymentMethod: string;
  reference?: string;
  status: 'REGISTERED' | 'REVERSED';
  reversedReason?: string;
  registeredBy: string;
}
const CrmPaymentSchema = new Schema<ICrmPayment>(
  {
    paymentNumber: { type: String, required: true, unique: true },
    accountPayableId: { type: String },
    expenseId: { type: String },
    providerName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Transferencia Bancaria' },
    reference: { type: String },
    status: { type: String, enum: ['REGISTERED', 'REVERSED'], default: 'REGISTERED' },
    reversedReason: { type: String },
    registeredBy: { type: String, required: true },
  },
  { timestamps: true }
);

// ==========================================
// 14. PROVIDERS & CONTRACTS
// ==========================================
export interface ICrmProvider extends Document {
  name: string;
  documentType: string;
  documentNumber: string;
  category: string;
  contactPhone?: string;
  contactEmail?: string;
  bankName?: string;
  bankAccountNumber?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
}
const CrmProviderSchema = new Schema<ICrmProvider>(
  {
    name: { type: String, required: true },
    documentType: { type: String, default: 'NIT' },
    documentNumber: { type: String, required: true },
    category: { type: String, default: 'SERVICIOS_GENERALES' },
    contactPhone: { type: String },
    contactEmail: { type: String },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export interface ICrmServiceContract extends Document {
  providerName: string;
  serviceName: string;
  category: string;
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'ONE_TIME';
  amount: number;
  currency: string;
  startDate: Date;
  nextPaymentDate: Date;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}
const CrmServiceContractSchema = new Schema<ICrmServiceContract>(
  {
    providerName: { type: String, required: true },
    serviceName: { type: String, required: true },
    category: { type: String, default: 'INTERNET_Y_COMUNICACIONES' },
    billingFrequency: { type: String, enum: ['MONTHLY', 'QUARTERLY', 'ANNUAL', 'ONE_TIME'], default: 'MONTHLY' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'COP' },
    startDate: { type: Date, default: Date.now },
    nextPaymentDate: { type: Date, required: true },
    status: { type: String, enum: ['ACTIVE', 'PAUSED', 'CANCELLED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

// ==========================================
// 15. ASSETS & AID DELIVERIES
// ==========================================
export interface ICrmAsset extends Document {
  assetNumber: string;
  name: string;
  category: 'MAQUINARIA' | 'EQUIPO_COMPUTO' | 'MOBILIARIO' | 'VEHICULO' | 'HERRAMIENTAS' | 'INSUMOS_PRODUCTIVOS';
  purchaseDate: Date;
  value: number;
  location: string;
  assignedTo?: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'DELIVERED' | 'IN_REPAIR';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}
const CrmAssetSchema = new Schema<ICrmAsset>(
  {
    assetNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['MAQUINARIA', 'EQUIPO_COMPUTO', 'MOBILIARIO', 'VEHICULO', 'HERRAMIENTAS', 'INSUMOS_PRODUCTIVOS'],
      required: true,
    },
    purchaseDate: { type: Date, default: Date.now },
    value: { type: Number, default: 0 },
    location: { type: String, default: 'Sede Principal Cartagena' },
    assignedTo: { type: String },
    status: { type: String, enum: ['AVAILABLE', 'ASSIGNED', 'DELIVERED', 'IN_REPAIR'], default: 'AVAILABLE' },
    condition: { type: String, enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'], default: 'GOOD' },
  },
  { timestamps: true }
);

export interface ICrmAidDelivery extends Document {
  personId: string;
  personName: string;
  householdId?: string;
  type: 'KIT_PRODUCTIVO' | 'ALIMENTOS' | 'MEDICAMENTOS' | 'MAQUINA_COSER' | 'TELAS' | 'SUBSIDIO_TRANSPORTE' | 'OTRO';
  quantity: number;
  value: number;
  deliveryDate: Date;
  responsibleUserName: string;
  status: 'DELIVERED' | 'SCHEDULED';
  notes?: string;
}
const CrmAidDeliverySchema = new Schema<ICrmAidDelivery>(
  {
    personId: { type: String, required: true, index: true },
    personName: { type: String, required: true },
    householdId: { type: String },
    type: {
      type: String,
      enum: ['KIT_PRODUCTIVO', 'ALIMENTOS', 'MEDICAMENTOS', 'MAQUINA_COSER', 'TELAS', 'SUBSIDIO_TRANSPORTE', 'OTRO'],
      required: true,
    },
    quantity: { type: Number, default: 1 },
    value: { type: Number, default: 0 },
    deliveryDate: { type: Date, default: Date.now },
    responsibleUserName: { type: String, required: true },
    status: { type: String, enum: ['DELIVERED', 'SCHEDULED'], default: 'DELIVERED' },
    notes: { type: String },
  },
  { timestamps: true }
);

// ==========================================
// 16. TASKS & AUDIT LOGS
// ==========================================
export interface ICrmTask extends Document {
  title: string;
  description: string;
  assignedToUserId: string;
  assignedToName: string;
  createdByUserId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: Date;
  relatedEntityType?: 'CASE' | 'PERSON' | 'EXPENSE' | 'OPERATION' | 'GRANT';
  relatedEntityId?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt?: Date;
  createdAt: Date;
}
const CrmTaskSchema = new Schema<ICrmTask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedToUserId: { type: String, required: true, index: true },
    assignedToName: { type: String, required: true },
    createdByUserId: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    dueDate: { type: Date, required: true },
    relatedEntityType: { type: String, enum: ['CASE', 'PERSON', 'EXPENSE', 'OPERATION', 'GRANT'] },
    relatedEntityId: { type: String },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'TODO' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export interface ICrmAuditLog extends Document {
  userId?: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  timestamp: Date;
}
const CrmAuditLogSchema = new Schema<ICrmAuditLog>(
  {
    userId: { type: String, index: true },
    userName: { type: String, default: 'Sistema' },
    userRole: { type: String, default: 'SYSTEM' },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String },
    details: { type: Schema.Types.Mixed },
    ip: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ==========================================
// 17. PAYROLL & NOMINA (Programación y Liquidación)
// ==========================================
export interface ICrmPayrollItem {
  employeeName: string;
  employeeDocument: string;
  role: string;
  contractType: string;
  baseSalary: number;
  transportAllowance: number;
  bonuses: number;
  deductions: number;
  netToPay: number;
  bankName?: string;
  bankAccount?: string;
  status: 'PENDING' | 'PAID';
}

export interface ICrmPayroll extends Document {
  payrollNumber: string;
  periodName: string;
  periodType: 'FIRST_FORTNIGHT' | 'SECOND_FORTNIGHT' | 'MONTHLY' | 'SPECIAL';
  scheduledPaymentDate: Date;
  paidAt?: Date;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: 'DRAFT' | 'SCHEDULED' | 'PAID' | 'CANCELLED';
  items: ICrmPayrollItem[];
  notes?: string;
  responsibleUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CrmPayrollSchema = new Schema<ICrmPayroll>(
  {
    payrollNumber: { type: String, required: true, unique: true },
    periodName: { type: String, required: true },
    periodType: {
      type: String,
      enum: ['FIRST_FORTNIGHT', 'SECOND_FORTNIGHT', 'MONTHLY', 'SPECIAL'],
      default: 'MONTHLY',
    },
    scheduledPaymentDate: { type: Date, required: true },
    paidAt: { type: Date },
    totalGross: { type: Number, required: true },
    totalDeductions: { type: Number, default: 0 },
    totalNet: { type: Number, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'PAID', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    items: [
      {
        employeeName: { type: String, required: true },
        employeeDocument: { type: String, required: true },
        role: { type: String, required: true },
        contractType: { type: String, default: 'Prestación de Servicios' },
        baseSalary: { type: Number, required: true },
        transportAllowance: { type: Number, default: 0 },
        bonuses: { type: Number, default: 0 },
        deductions: { type: Number, default: 0 },
        netToPay: { type: Number, required: true },
        bankName: { type: String },
        bankAccount: { type: String },
        status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
      },
    ],
    notes: { type: String },
    responsibleUserId: { type: String, required: true },
  },
  { timestamps: true }
);

// ==========================================
// EXPORTING MONGOOSE MODELS
// ==========================================
export const CrmCounter = (mongoose.models.CrmCounter as Model<ICrmCounter>) || mongoose.model<ICrmCounter>('CrmCounter', CrmCounterSchema);
export const CrmUser = (mongoose.models.CrmUser as Model<ICrmUser>) || mongoose.model<ICrmUser>('CrmUser', CrmUserSchema);
export const CrmPerson = (mongoose.models.CrmPerson as Model<ICrmPerson>) || mongoose.model<ICrmPerson>('CrmPerson', CrmPersonSchema);
export const CrmHousehold = (mongoose.models.CrmHousehold as Model<ICrmHousehold>) || mongoose.model<ICrmHousehold>('CrmHousehold', CrmHouseholdSchema);
export const CrmCase = (mongoose.models.CrmCase as Model<ICrmCase>) || mongoose.model<ICrmCase>('CrmCase', CrmCaseSchema);
export const CrmCaseNote = (mongoose.models.CrmCaseNote as Model<ICrmCaseNote>) || mongoose.model<ICrmCaseNote>('CrmCaseNote', CrmCaseNoteSchema);
export const CrmFollowUp = (mongoose.models.CrmFollowUp as Model<ICrmFollowUp>) || mongoose.model<ICrmFollowUp>('CrmFollowUp', CrmFollowUpSchema);
export const CrmReferral = (mongoose.models.CrmReferral as Model<ICrmReferral>) || mongoose.model<ICrmReferral>('CrmReferral', CrmReferralSchema);
export const CrmProgram = (mongoose.models.CrmProgram as Model<ICrmProgram>) || mongoose.model<ICrmProgram>('CrmProgram', CrmProgramSchema);
export const CrmProgramEnrollment = (mongoose.models.CrmProgramEnrollment as Model<ICrmProgramEnrollment>) || mongoose.model<ICrmProgramEnrollment>('CrmProgramEnrollment', CrmProgramEnrollmentSchema);
export const CrmProject = (mongoose.models.CrmProject as Model<ICrmProject>) || mongoose.model<ICrmProject>('CrmProject', CrmProjectSchema);
export const CrmOperation = (mongoose.models.CrmOperation as Model<ICrmOperation>) || mongoose.model<ICrmOperation>('CrmOperation', CrmOperationSchema);
export const CrmAttendance = (mongoose.models.CrmAttendance as Model<ICrmAttendance>) || mongoose.model<ICrmAttendance>('CrmAttendance', CrmAttendanceSchema);
export const CrmDonor = (mongoose.models.CrmDonor as Model<ICrmDonor>) || mongoose.model<ICrmDonor>('CrmDonor', CrmDonorSchema);
export const CrmDonation = (mongoose.models.CrmDonation as Model<ICrmDonation>) || mongoose.model<ICrmDonation>('CrmDonation', CrmDonationSchema);
export const CrmCampaign = (mongoose.models.CrmCampaign as Model<ICrmCampaign>) || mongoose.model<ICrmCampaign>('CrmCampaign', CrmCampaignSchema);
export const CrmGrantApplication = (mongoose.models.CrmGrantApplication as Model<ICrmGrantApplication>) || mongoose.model<ICrmGrantApplication>('CrmGrantApplication', CrmGrantApplicationSchema);
export const CrmVolunteer = (mongoose.models.CrmVolunteer as Model<ICrmVolunteer>) || mongoose.model<ICrmVolunteer>('CrmVolunteer', CrmVolunteerSchema);
export const CrmVolunteerShift = (mongoose.models.CrmVolunteerShift as Model<ICrmVolunteerShift>) || mongoose.model<ICrmVolunteerShift>('CrmVolunteerShift', CrmVolunteerShiftSchema);
export const CrmExpense = (mongoose.models.CrmExpense as Model<ICrmExpense>) || mongoose.model<ICrmExpense>('CrmExpense', CrmExpenseSchema);
export const CrmAccountPayable = (mongoose.models.CrmAccountPayable as Model<ICrmAccountPayable>) || mongoose.model<ICrmAccountPayable>('CrmAccountPayable', CrmAccountPayableSchema);
export const CrmPayment = (mongoose.models.CrmPayment as Model<ICrmPayment>) || mongoose.model<ICrmPayment>('CrmPayment', CrmPaymentSchema);
export const CrmProvider = (mongoose.models.CrmProvider as Model<ICrmProvider>) || mongoose.model<ICrmProvider>('CrmProvider', CrmProviderSchema);
export const CrmServiceContract = (mongoose.models.CrmServiceContract as Model<ICrmServiceContract>) || mongoose.model<ICrmServiceContract>('CrmServiceContract', CrmServiceContractSchema);
export const CrmPayroll = (mongoose.models.CrmPayroll as Model<ICrmPayroll>) || mongoose.model<ICrmPayroll>('CrmPayroll', CrmPayrollSchema);
export const CrmAsset = (mongoose.models.CrmAsset as Model<ICrmAsset>) || mongoose.model<ICrmAsset>('CrmAsset', CrmAssetSchema);
export const CrmAidDelivery = (mongoose.models.CrmAidDelivery as Model<ICrmAidDelivery>) || mongoose.model<ICrmAidDelivery>('CrmAidDelivery', CrmAidDeliverySchema);
export const CrmTask = (mongoose.models.CrmTask as Model<ICrmTask>) || mongoose.model<ICrmTask>('CrmTask', CrmTaskSchema);
export const CrmAuditLog = (mongoose.models.CrmAuditLog as Model<ICrmAuditLog>) || mongoose.model<ICrmAuditLog>('CrmAuditLog', CrmAuditLogSchema);
