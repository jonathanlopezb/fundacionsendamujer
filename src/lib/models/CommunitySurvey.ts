/**
 * CommunitySurvey — Modelo completo de caracterización familiar
 * Jornada Cívica y Médica · Fundación Senda Mujer
 *
 * Cumple Ley 1581 de 2012 (Habeas Data) y Ley 1098 de 2006 (art. 47).
 * Cada registro está vinculado a un consentimiento previo, expreso e informado.
 */
import mongoose, { Document, Schema } from 'mongoose';

/** Miembro del hogar con datos de identificación */
export interface IHouseholdMember {
  fullName: string;
  age: number;
  relationship: string;
  documentType: 'RC' | 'TI' | 'CC' | 'CE' | 'PA' | 'OTRO' | 'SIN_DOC';
  documentNumber?: string;
}

export interface ICommunitySurvey extends Document {
  /* ── Ficha de identificación ─────────────────────────────────── */
  surveyCode: string;
  barrio: string;
  manzana?: string;
  visitDate: Date;
  collectorName?: string;
  collectorCode?: string;
  fieldZone?: string;
  contactPhone?: string;
  landmark?: string;

  /* ── Sección A — Datos generales del hogar ───────────────────── */
  householdMembers: IHouseholdMember[];
  householdSize: number;
  minorCount: number;
  allDocumentsValid: boolean;
  documentsIssue?: string;
  allNNASchooled: boolean;
  schoolDropoutReason?: string;
  hasDisabledMember: boolean;
  disabledDetails?: string;
  hasElderlyMember: boolean;
  elderlyCount: number;
  rooms: number;
  overcrowdingNotes?: string;

  /* ── Sección B — Salud ───────────────────────────────────────── */
  allEPSAffiliated: boolean;
  epsRegime?: string;
  nonAffiliatedReason?: string;
  hasPregnantOrLactating: boolean;
  prenatalCareStatus?: string;
  vaccinesUpToDate: boolean;
  vaccineCardAvailable: boolean;
  hasChronicDisease: boolean;
  chronicDiseaseDetails?: string;
  hasEDAParasites: boolean;
  edaDetails?: string;
  dentalCarePending: boolean;
  healthcareAccessDifficulty: boolean;
  healthcareAccessDetails?: string;
  waterSource: 'ACUEDUCTO' | 'PILA_PUBLICA' | 'CARROTANQUE' | 'POZO' | 'OTRO';
  psychologicalSupportNeeded: boolean;
  psychologicalSupportWho?: string;

  /* ── Sección C — Situación jurídica y familiar ───────────────── */
  hasFamilyProcess: boolean;
  familyProcessDetails?: string;
  hasVIFVBG: boolean;
  vifComplaintFiled?: boolean;
  vifProcessStatus?: string;
  housingType: 'PROPIA' | 'ARRENDADA' | 'FAMILIAR' | 'OTRA';
  hasHousingDocument: boolean;
  hasDebtOrProcess: boolean;
  debtDetails?: string;
  needsPensionOrSubsidy: boolean;
  pensionDetails?: string;
  hasUrgentCase: boolean;
  urgentCaseDescription?: string;

  /* ── Sección D — Situación económica y social ────────────────── */
  incomeSource?: string;
  receivesSubsidies: boolean;
  subsidiesDetails?: string;
  hasJobSeeker: boolean;
  jobSearchDifficulty?: string;
  hasRecentGraduate: boolean;
  graduateStatus?: string;

  /* ── Sección E — Percepción de riesgo (encuestador) ─────────── */
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
  observedRiskIndicators?: string;
  authorizedRecontact: boolean;
  collectorObservations?: string;
  activateImmediateRoute: boolean;
  immediateRouteType?: string;

  /* ── Necesidades priorizadas (multi-select) ──────────────────── */
  needs: string[];

  /* ── Consentimiento Ley 1581 ─────────────────────────────────── */
  consentGranted: boolean;
  minorImageConsent?: boolean;

  /* ── Prioridad calculada ─────────────────────────────────────── */
  priority: 'NORMAL' | 'PRIORITARIA' | 'INMEDIATA';

  createdAt: Date;
}

const HouseholdMemberSchema = new Schema<IHouseholdMember>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    age: { type: Number, required: true, min: 0, max: 120 },
    relationship: { type: String, required: true, trim: true, maxlength: 60 },
    documentType: {
      type: String,
      enum: ['RC', 'TI', 'CC', 'CE', 'PA', 'OTRO', 'SIN_DOC'],
      default: 'CC',
    },
    documentNumber: { type: String, trim: true, maxlength: 30 },
  },
  { _id: false }
);

const CommunitySurveySchema = new Schema<ICommunitySurvey>(
  {
    /* Ficha */
    surveyCode: { type: String, required: true, unique: true },
    barrio: { type: String, required: true, trim: true, maxlength: 100 },
    manzana: { type: String, trim: true, maxlength: 100 },
    visitDate: { type: Date, default: Date.now },
    collectorName: { type: String, trim: true, maxlength: 100 },
    collectorCode: { type: String, trim: true, maxlength: 30 },
    fieldZone: { type: String, trim: true, maxlength: 80 },
    contactPhone: { type: String, trim: true, maxlength: 20 },
    landmark: { type: String, trim: true, maxlength: 200 },

    /* Sección A */
    householdMembers: { type: [HouseholdMemberSchema], default: [] },
    householdSize: { type: Number, required: true, min: 1, max: 50 },
    minorCount: { type: Number, required: true, min: 0, max: 50 },
    allDocumentsValid: { type: Boolean, default: true },
    documentsIssue: { type: String, trim: true, maxlength: 500 },
    allNNASchooled: { type: Boolean, default: true },
    schoolDropoutReason: { type: String, trim: true, maxlength: 500 },
    hasDisabledMember: { type: Boolean, default: false },
    disabledDetails: { type: String, trim: true, maxlength: 500 },
    hasElderlyMember: { type: Boolean, default: false },
    elderlyCount: { type: Number, default: 0, min: 0 },
    rooms: { type: Number, default: 1, min: 1 },
    overcrowdingNotes: { type: String, trim: true, maxlength: 300 },

    /* Sección B */
    allEPSAffiliated: { type: Boolean, default: true },
    epsRegime: { type: String, trim: true, maxlength: 100 },
    nonAffiliatedReason: { type: String, trim: true, maxlength: 400 },
    hasPregnantOrLactating: { type: Boolean, default: false },
    prenatalCareStatus: { type: String, trim: true, maxlength: 300 },
    vaccinesUpToDate: { type: Boolean, default: true },
    vaccineCardAvailable: { type: Boolean, default: true },
    hasChronicDisease: { type: Boolean, default: false },
    chronicDiseaseDetails: { type: String, trim: true, maxlength: 500 },
    hasEDAParasites: { type: Boolean, default: false },
    edaDetails: { type: String, trim: true, maxlength: 300 },
    dentalCarePending: { type: Boolean, default: false },
    healthcareAccessDifficulty: { type: Boolean, default: false },
    healthcareAccessDetails: { type: String, trim: true, maxlength: 400 },
    waterSource: {
      type: String,
      enum: ['ACUEDUCTO', 'PILA_PUBLICA', 'CARROTANQUE', 'POZO', 'OTRO'],
      default: 'ACUEDUCTO',
    },
    psychologicalSupportNeeded: { type: Boolean, default: false },
    psychologicalSupportWho: { type: String, trim: true, maxlength: 300 },

    /* Sección C */
    hasFamilyProcess: { type: Boolean, default: false },
    familyProcessDetails: { type: String, trim: true, maxlength: 500 },
    hasVIFVBG: { type: Boolean, default: false },
    vifComplaintFiled: { type: Boolean },
    vifProcessStatus: { type: String, trim: true, maxlength: 400 },
    housingType: {
      type: String,
      enum: ['PROPIA', 'ARRENDADA', 'FAMILIAR', 'OTRA'],
      default: 'ARRENDADA',
    },
    hasHousingDocument: { type: Boolean, default: false },
    hasDebtOrProcess: { type: Boolean, default: false },
    debtDetails: { type: String, trim: true, maxlength: 400 },
    needsPensionOrSubsidy: { type: Boolean, default: false },
    pensionDetails: { type: String, trim: true, maxlength: 400 },
    hasUrgentCase: { type: Boolean, default: false },
    urgentCaseDescription: { type: String, trim: true, maxlength: 600 },

    /* Sección D */
    incomeSource: { type: String, trim: true, maxlength: 300 },
    receivesSubsidies: { type: Boolean, default: false },
    subsidiesDetails: { type: String, trim: true, maxlength: 400 },
    hasJobSeeker: { type: Boolean, default: false },
    jobSearchDifficulty: { type: String, trim: true, maxlength: 400 },
    hasRecentGraduate: { type: Boolean, default: false },
    graduateStatus: { type: String, trim: true, maxlength: 300 },

    /* Sección E */
    riskLevel: {
      type: String,
      enum: ['BAJO', 'MEDIO', 'ALTO'],
      required: true,
      default: 'BAJO',
    },
    observedRiskIndicators: { type: String, trim: true, maxlength: 600 },
    authorizedRecontact: { type: Boolean, default: false },
    collectorObservations: { type: String, trim: true, maxlength: 800 },
    activateImmediateRoute: { type: Boolean, default: false },
    immediateRouteType: { type: String, trim: true, maxlength: 200 },

    /* Necesidades */
    needs: [{ type: String }],

    /* Consentimiento */
    consentGranted: { type: Boolean, required: true },
    minorImageConsent: { type: Boolean, default: false },

    /* Prioridad */
    priority: {
      type: String,
      enum: ['NORMAL', 'PRIORITARIA', 'INMEDIATA'],
      required: true,
    },
  },
  { timestamps: true, collection: 'community_surveys' }
);

export default mongoose.models.CommunitySurvey ||
  mongoose.model<ICommunitySurvey>('CommunitySurvey', CommunitySurveySchema);
