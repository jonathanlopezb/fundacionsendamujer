'use client';

import { FormEvent, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, ClipboardList,
  HeartPulse, LockKeyhole, ShieldCheck, Users, Scale, DollarSign,
  Eye, Plus, Trash2, UserCheck, FileText, Sparkles, Activity, Stethoscope
} from 'lucide-react';

/* ── Tipos ───────────────────────────────────────────────────────────────── */
interface HouseholdMember {
  fullName: string;
  age: string;
  relationship: string;
  documentType: string;
  documentNumber: string;
}

interface EncuestaFormProps {
  barrio: string;
  localidad: string;
  jornada?: string;
}

const NEEDS = [
  ['ginecologia', 'Consulta de Ginecología y Citología', 'Salud'],
  ['medicina_general', 'Consulta de Medicina General', 'Salud'],
  ['pediatria', 'Consulta de Pediatría y Nutrición infantil', 'Salud'],
  ['odontologia', 'Atención Odontológica', 'Salud'],
  ['psicologia', 'Consulta de Psicología y Apoyo Emocional', 'Salud'],
  ['afiliacion', 'Afiliación a EPS o SISBÉN', 'Salud'],
  ['materna', 'Embarazo, lactancia o controles prenatales', 'Salud'],
  ['vacunacion', 'Vacunación pendiente PAI', 'Salud'],
  ['cronica', 'Enfermedad crónica (HTA/Diabetes)', 'Salud'],
  ['acceso_salud', 'Citas, medicamentos o remisiones pendientes', 'Salud'],
  ['citologia_urgente', 'Toma o resultado de citología cérvico-uterina', 'Salud'],
  ['planificacion_familiar', 'Asesoría / métodos de planificación familiar', 'Salud'],
  ['educacion', 'Escolarización o riesgo de deserción', 'Familia y protección'],
  ['documentacion', 'Documentos de identidad', 'Familia y protección'],
  ['familia', 'Alimentos, custodia o asuntos de familia', 'Familia y protección'],
  ['violencia', 'Orientación ante violencia familiar o de género', 'Familia y protección'],
  ['vivienda', 'Vivienda, servicios o estratificación', 'Jurídico y social'],
  ['tramites', 'Pensión, tutela u otro trámite público', 'Jurídico y social'],
  ['subsidios', 'Subsidios y oferta institucional', 'Jurídico y social'],
  ['empleo', 'Empleo, formación o emprendimiento', 'Jurídico y social'],
] as const;

const STEPS = [
  { id: 'ficha', label: 'Ficha del hogar', icon: ClipboardList },
  { id: 'secA', label: 'Sección A · Composición', icon: Users },
  { id: 'secB', label: 'Sección B · Salud General', icon: HeartPulse },
  { id: 'secB1', label: 'Sección B.1 · Citas Médicas & Gineco', icon: Stethoscope },
  { id: 'secC', label: 'Sección C · Jurídico', icon: Scale },
  { id: 'secD', label: 'Sección D · Económico', icon: DollarSign },
  { id: 'secE', label: 'Sección E · Riesgo', icon: Eye },
  { id: 'consentimiento', label: 'Consentimiento', icon: ShieldCheck },
];

const DOC_TYPES = [
  { value: 'RC', label: 'Registro Civil' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'OTRO', label: 'Otro' },
  { value: 'SIN_DOC', label: 'Sin Documento' },
];

const WATER_SOURCES = [
  { value: 'ACUEDUCTO', label: 'Acueducto' },
  { value: 'PILA_PUBLICA', label: 'Pila pública' },
  { value: 'CARROTANQUE', label: 'Carrotanque' },
  { value: 'POZO', label: 'Pozo' },
  { value: 'OTRO', label: 'Otra fuente' },
];

const HOUSING_TYPES = [
  { value: 'PROPIA', label: 'Propia' },
  { value: 'ARRENDADA', label: 'Arrendada' },
  { value: 'FAMILIAR', label: 'De un familiar' },
  { value: 'OTRA', label: 'Otra' },
];

const RISK_LEVELS = [
  { value: 'BAJO', label: 'BAJO', color: 'border-emerald-400 bg-emerald-500/15 text-emerald-200' },
  { value: 'MEDIO', label: 'MEDIO', color: 'border-amber-400 bg-amber-500/15 text-amber-200' },
  { value: 'ALTO', label: 'ALTO', color: 'border-rose-400 bg-rose-500/15 text-rose-200' },
];

const PAP_SMEAR_OPTIONS = [
  { value: 'MENOS_1_ANO', label: 'Hace menos de 1 año' },
  { value: '1_A_3_ANOS', label: 'Entre 1 y 3 años' },
  { value: 'MAS_3_ANOS', label: 'Hace más de 3 años' },
  { value: 'NUNCA', label: 'Nunca se ha realizado una citología' },
  { value: 'NO_APLICA', label: 'No aplica en el hogar' },
];

const PLANNING_OPTIONS = [
  { value: 'NINGUNO', label: 'Ninguno (sin método)' },
  { value: 'ORAL', label: 'Pastillas anticonceptivas' },
  { value: 'INYECTABLE', label: 'Inyección mensual o trimestral' },
  { value: 'IMPLANTE', label: 'Implante subdérmico (Jadelle/Implanon)' },
  { value: 'DIU', label: 'DIU (Dispositivo intrauterino / T de cobre)' },
  { value: 'BARRERA', label: 'Preservativo / Condón' },
  { value: 'QUIRURGICO', label: 'Pomeroy / Ligadura / Vasectomía' },
  { value: 'OTRO', label: 'Otro método tradicional o natural' },
];

const ROUTE_TYPES = [
  'Comisaría de Familia',
  'Fiscalía General de la Nación',
  'ICBF (riesgo sobre menor)',
  'IPS/EPS aliada (emergencia médica)',
  'Defensoría del Pueblo',
];

/* ── Componentes de ayuda ────────────────────────────────────────────────── */
function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-purple-100 mb-1.5">
        {label}{required && <span className="text-rose-400 ml-1">*</span>}
      </span>
      {hint && <span className="block text-xs text-purple-300/70 mb-1.5">{hint}</span>}
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-purple-950/50 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors ${props.className ?? ''}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-purple-950/50 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors ${props.className ?? ''}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`w-full bg-purple-950/50 border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors resize-none ${props.className ?? ''}`}
    />
  );
}

function YesNo({ value, onChange, name }: { value: boolean | null; onChange: (v: boolean) => void; name: string }) {
  return (
    <div className="flex gap-3">
      {[true, false].map((v) => (
        <label
          key={String(v)}
          className={`flex items-center gap-2 cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
            value === v ? (v ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200' : 'border-rose-400 bg-rose-500/15 text-rose-200') : 'border-purple-700 bg-purple-950/30 text-purple-200 hover:border-purple-500'
          }`}
        >
          <input type="radio" name={name} className="sr-only" checked={value === v} onChange={() => onChange(v)} />
          <span className={`w-4 h-4 rounded-full border grid place-items-center ${value === v ? (v ? 'border-emerald-300 bg-emerald-500' : 'border-rose-300 bg-rose-500') : 'border-purple-500'}`}>
            {value === v && <Check className="w-3 h-3" />}
          </span>
          {v ? 'Sí' : 'No'}
        </label>
      ))}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-pink-300 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-black tracking-widest uppercase">Paso del diagnóstico</span>
      </div>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mt-1.5 text-sm text-purple-200/70 leading-relaxed">{description}</p>
    </div>
  );
}

/* ── Componente principal ────────────────────────────────────────────────── */
export default function EncuestaComunitariaForm({ barrio, localidad, jornada }: EncuestaFormProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ surveyCode: string; priority: string } | null>(null);

  /* Ficha */
  const [manzana, setManzana] = useState('');
  const [collectorName, setCollectorName] = useState('');
  const [collectorCode, setCollectorCode] = useState('');
  const [fieldZone, setFieldZone] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [participationAccepted, setParticipationAccepted] = useState<boolean | null>(null);

  /* Sección A */
  const [members, setMembers] = useState<HouseholdMember[]>([
    { fullName: '', age: '', relationship: 'Persona referente', documentType: 'CC', documentNumber: '' },
  ]);
  const [householdSize, setHouseholdSize] = useState('');
  const [minorCount, setMinorCount] = useState('');
  const [allDocumentsValid, setAllDocumentsValid] = useState<boolean | null>(null);
  const [documentsIssue, setDocumentsIssue] = useState('');
  const [allNNASchooled, setAllNNASchooled] = useState<boolean | null>(null);
  const [schoolDropoutReason, setSchoolDropoutReason] = useState('');
  const [hasDisabledMember, setHasDisabledMember] = useState<boolean | null>(null);
  const [disabledDetails, setDisabledDetails] = useState('');
  const [hasElderlyMember, setHasElderlyMember] = useState<boolean | null>(null);
  const [elderlyCount, setElderlyCount] = useState('');
  const [rooms, setRooms] = useState('');
  const [overcrowdingNotes, setOvercrowdingNotes] = useState('');

  /* Sección B */
  const [allEPSAffiliated, setAllEPSAffiliated] = useState<boolean | null>(null);
  const [epsRegime, setEpsRegime] = useState('');
  const [nonAffiliatedReason, setNonAffiliatedReason] = useState('');
  const [hasPregnant, setHasPregnant] = useState<boolean | null>(null);
  const [prenatalCare, setPrenatalCare] = useState('');
  const [vaccinesUpToDate, setVaccinesUpToDate] = useState<boolean | null>(null);
  const [vaccineCard, setVaccineCard] = useState<boolean | null>(null);
  const [hasChronicDisease, setHasChronicDisease] = useState<boolean | null>(null);
  const [chronicDiseaseDetails, setChronicDiseaseDetails] = useState('');
  const [hasEDAParasites, setHasEDAParasites] = useState<boolean | null>(null);
  const [edaDetails, setEdaDetails] = useState('');
  const [dentalPending, setDentalPending] = useState<boolean | null>(null);
  const [healthAccessDifficulty, setHealthAccessDifficulty] = useState<boolean | null>(null);
  const [healthAccessDetails, setHealthAccessDetails] = useState('');
  const [waterSource, setWaterSource] = useState('ACUEDUCTO');
  const [psychoSupport, setPsychoSupport] = useState<boolean | null>(null);
  const [psychoSupportWho, setPsychoSupportWho] = useState('');
  const [hasCaregiverBurnout, setHasCaregiverBurnout] = useState<boolean | null>(null);

  /* Sección B.1 — Citas Médicas por Especialidad & Salud de la Mujer */
  const [needsGynecology, setNeedsGynecology] = useState<boolean | null>(null);
  const [gynecologySymptoms, setGynecologySymptoms] = useState('');
  const [lastPapSmear, setLastPapSmear] = useState('NO_APLICA');
  const [familyPlanning, setFamilyPlanning] = useState('NINGUNO');
  const [desiresPlanningCounseling, setDesiresPlanningCounseling] = useState<boolean | null>(null);
  const [breastExamTrained, setBreastExamTrained] = useState<boolean | null>(null);
  const [mammographyNeeded, setMammographyNeeded] = useState<boolean | null>(null);

  const [needsGeneralMedicine, setNeedsGeneralMedicine] = useState<boolean | null>(null);
  const [generalMedicineReason, setGeneralMedicineReason] = useState('');
  const [needsPediatrics, setNeedsPediatrics] = useState<boolean | null>(null);
  const [pediatricsReason, setPediatricsReason] = useState('');
  const [needsDental, setNeedsDental] = useState<boolean | null>(null);
  const [dentalReason, setDentalReason] = useState('');
  const [needsPsychology, setNeedsPsychology] = useState<boolean | null>(null);
  const [psychologyReason, setPsychologyReason] = useState('');
  const [needsNutrition, setNeedsNutrition] = useState<boolean | null>(null);
  const [nutritionReason, setNutritionReason] = useState('');

  /* Sección C */
  const [hasFamilyProcess, setHasFamilyProcess] = useState<boolean | null>(null);
  const [familyProcessDetails, setFamilyProcessDetails] = useState('');
  const [hasVIF, setHasVIF] = useState<boolean | null>(null);
  const [vifComplaint, setVifComplaint] = useState<boolean | null>(null);
  const [vifStatus, setVifStatus] = useState('');
  const [knowsRights, setKnowsRights] = useState<boolean | null>(null);
  const [hasMedidaProteccion, setHasMedidaProteccion] = useState<boolean | null>(null);
  const [housingType, setHousingType] = useState('ARRENDADA');
  const [hasHousingDocument, setHasHousingDocument] = useState<boolean | null>(null);
  const [hasDebt, setHasDebt] = useState<boolean | null>(null);
  const [debtDetails, setDebtDetails] = useState('');
  const [needsSubsidy, setNeedsSubsidy] = useState<boolean | null>(null);
  const [subsidyDetails, setSubsidyDetails] = useState('');
  const [hasUrgentCase, setHasUrgentCase] = useState<boolean | null>(null);
  const [urgentDesc, setUrgentDesc] = useState('');

  /* Sección D */
  const [incomeSource, setIncomeSource] = useState('');
  const [receivesSubsidies, setReceivesSubsidies] = useState<boolean | null>(null);
  const [subsidiesDetails, setSubsidiesDetails] = useState('');
  const [hasJobSeeker, setHasJobSeeker] = useState<boolean | null>(null);
  const [jobDifficulty, setJobDifficulty] = useState('');
  const [hasGraduate, setHasGraduate] = useState<boolean | null>(null);
  const [graduateStatus, setGraduateStatus] = useState('');
  const [interestInTraining, setInterestInTraining] = useState<boolean | null>(null);
  const [hasSmartphoneAccess, setHasSmartphoneAccess] = useState<boolean | null>(null);

  /* Sección E */
  const [riskLevel, setRiskLevel] = useState<'BAJO' | 'MEDIO' | 'ALTO'>('BAJO');
  const [observedRisk, setObservedRisk] = useState('');
  const [authorizedRecontact, setAuthorizedRecontact] = useState<boolean | null>(null);
  const [collectorObs, setCollectorObs] = useState('');
  const [activateRoute, setActivateRoute] = useState<boolean | null>(null);
  const [routeType, setRouteType] = useState('');

  /* Necesidades */
  const [pickedNeeds, setPickedNeeds] = useState<string[]>([]);

  /* Consentimiento */
  const [consent, setConsent] = useState(false);
  const [minorImageConsent, setMinorImageConsent] = useState(false);

  /* ── Reset Formulario ─────────────────────────────────────────────────── */
  const resetForm = () => {
    setResult(null);
    setStep(0);
    setError('');
    setSending(false);

    /* Ficha */
    setManzana('');
    // Mantenemos collectorName y collectorCode para conveniencia del encuestador en campo, pero limpiamos los datos del hogar
    setFieldZone('');
    setContactPhone('');
    setLandmark('');
    setParticipationAccepted(null);

    /* Sección A */
    setMembers([
      { fullName: '', age: '', relationship: 'Persona referente', documentType: 'CC', documentNumber: '' },
    ]);
    setHouseholdSize('');
    setMinorCount('');
    setAllDocumentsValid(null);
    setDocumentsIssue('');
    setAllNNASchooled(null);
    setSchoolDropoutReason('');
    setHasDisabledMember(null);
    setDisabledDetails('');
    setHasElderlyMember(null);
    setElderlyCount('');
    setRooms('');
    setOvercrowdingNotes('');

    /* Sección B */
    setAllEPSAffiliated(null);
    setEpsRegime('');
    setNonAffiliatedReason('');
    setHasPregnant(null);
    setPrenatalCare('');
    setVaccinesUpToDate(null);
    setVaccineCard(null);
    setHasChronicDisease(null);
    setChronicDiseaseDetails('');
    setHasEDAParasites(null);
    setEdaDetails('');
    setDentalPending(null);
    setHealthAccessDifficulty(null);
    setHealthAccessDetails('');
    setWaterSource('ACUEDUCTO');
    setPsychoSupport(null);
    setPsychoSupportWho('');
    setHasCaregiverBurnout(null);

    /* Sección B.1 */
    setNeedsGynecology(null);
    setGynecologySymptoms('');
    setLastPapSmear('NO_APLICA');
    setFamilyPlanning('NINGUNO');
    setDesiresPlanningCounseling(null);
    setBreastExamTrained(null);
    setMammographyNeeded(null);
    setNeedsGeneralMedicine(null);
    setGeneralMedicineReason('');
    setNeedsPediatrics(null);
    setPediatricsReason('');
    setNeedsDental(null);
    setDentalReason('');
    setNeedsPsychology(null);
    setPsychologyReason('');
    setNeedsNutrition(null);
    setNutritionReason('');

    /* Sección C */
    setHasFamilyProcess(null);
    setFamilyProcessDetails('');
    setHasVIF(null);
    setVifComplaint(null);
    setVifStatus('');
    setKnowsRights(null);
    setHasMedidaProteccion(null);
    setHousingType('ARRENDADA');
    setHasHousingDocument(null);
    setHasDebt(null);
    setDebtDetails('');
    setNeedsSubsidy(null);
    setSubsidyDetails('');
    setHasUrgentCase(null);
    setUrgentDesc('');

    /* Sección D */
    setIncomeSource('');
    setReceivesSubsidies(null);
    setSubsidiesDetails('');
    setHasJobSeeker(null);
    setJobDifficulty('');
    setHasGraduate(null);
    setGraduateStatus('');
    setInterestInTraining(null);
    setHasSmartphoneAccess(null);

    /* Sección E */
    setRiskLevel('BAJO');
    setObservedRisk('');
    setAuthorizedRecontact(null);
    setCollectorObs('');
    setActivateRoute(null);
    setRouteType('');
    setPickedNeeds([]);
    setConsent(false);
    setMinorImageConsent(false);
  };

  /* ── Funciones de miembros del hogar ─────────────────────────────────── */
  const addMember = () =>
    setMembers((m) => [
      ...m,
      { fullName: '', age: '', relationship: '', documentType: 'CC', documentNumber: '' },
    ]);

  const removeMember = (i: number) =>
    setMembers((m) => m.filter((_, idx) => idx !== i));

  const updateMember = (i: number, field: keyof HouseholdMember, value: string) =>
    setMembers((m) => m.map((mb, idx) => (idx === i ? { ...mb, [field]: value } : mb)));

  const toggleNeed = (id: string) =>
    setPickedNeeds((c) => (c.includes(id) ? c.filter((v) => v !== id) : [...c, id]));

  /* ── Validación por step ─────────────────────────────────────────────── */
  const validate = (): string => {
    if (step === 0) {
      if (!collectorName) return 'Ingresa el nombre del encuestador/a.';
      if (participationAccepted === null) return 'Indica si el hogar acepta participar.';
      if (participationAccepted === false) return '';
    }
    if (step === 1) {
      if (!householdSize || +householdSize < 1) return 'Indica cuántas personas viven en el hogar.';
      if (!minorCount) return 'Indica cuántos menores de 18 años hay en el hogar.';
      if (+minorCount > +householdSize) return 'Los menores no pueden ser más que el total del hogar.';
      if (!rooms || +rooms < 1) return 'Indica cuántas habitaciones tiene la vivienda.';
    }
    if (step === 2) {
      if (allEPSAffiliated === null) return 'Indica si todos están afiliados a EPS.';
      if (vaccinesUpToDate === null) return 'Indica si las vacunas están al día.';
      if (!waterSource) return 'Selecciona la fuente de agua del hogar.';
    }
    if (step === 3) {
      // Validaciones Sección B.1 opcionales pero recomendadas
    }
    if (step === STEPS.length - 1) {
      if (!consent) return 'El hogar debe aceptar el consentimiento informado para guardar la ficha.';
    }
    return '';
  };

  const next = () => {
    if (step === 0 && participationAccepted === false) return;
    const msg = validate();
    if (msg) return setError(msg);
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => { setError(''); setStep((s) => Math.max(s - 1, 0)); };

  /* ── Submit ──────────────────────────────────────────────────────────── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/community-surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barrio,
          manzana,
          collectorName,
          collectorCode,
          fieldZone,
          contactPhone,
          landmark,
          householdMembers: members.filter((m) => m.fullName.trim()),
          householdSize: +householdSize,
          minorCount: +minorCount,
          allDocumentsValid: allDocumentsValid ?? true,
          documentsIssue,
          allNNASchooled: allNNASchooled ?? true,
          schoolDropoutReason,
          hasDisabledMember: hasDisabledMember ?? false,
          disabledDetails,
          hasElderlyMember: hasElderlyMember ?? false,
          elderlyCount: +elderlyCount || 0,
          rooms: +rooms || 1,
          overcrowdingNotes,
          allEPSAffiliated: allEPSAffiliated ?? true,
          epsRegime,
          nonAffiliatedReason,
          hasPregnantOrLactating: hasPregnant ?? false,
          prenatalCareStatus: prenatalCare,
          vaccinesUpToDate: vaccinesUpToDate ?? true,
          vaccineCardAvailable: vaccineCard ?? true,
          hasChronicDisease: hasChronicDisease ?? false,
          chronicDiseaseDetails,
          hasEDAParasites: hasEDAParasites ?? false,
          edaDetails,
          dentalCarePending: dentalPending ?? false,
          healthcareAccessDifficulty: healthAccessDifficulty ?? false,
          healthcareAccessDetails: healthAccessDetails,
          waterSource,
          psychologicalSupportNeeded: psychoSupport ?? false,
          psychologicalSupportWho: psychoSupportWho,
          hasCaregiverBurnout: hasCaregiverBurnout ?? false,

          /* B.1 - Citas Médicas por Especialidad & Salud de la Mujer */
          needsGynecology: needsGynecology ?? false,
          gynecologySymptoms,
          needsGeneralMedicine: needsGeneralMedicine ?? false,
          generalMedicineReason,
          needsPediatrics: needsPediatrics ?? false,
          pediatricsReason,
          needsDental: needsDental ?? false,
          dentalReason,
          needsPsychology: needsPsychology ?? false,
          psychologyReason,
          needsNutrition: needsNutrition ?? false,
          nutritionReason,
          lastPapSmear,
          familyPlanningMethod: familyPlanning,
          desiresFamilyPlanningCounseling: desiresPlanningCounseling ?? false,
          breastSelfExamTrained: breastExamTrained ?? false,
          hasMammographyOrUltrasoundNeeded: mammographyNeeded ?? false,

          /* C */
          hasFamilyProcess: hasFamilyProcess ?? false,
          familyProcessDetails,
          hasVIFVBG: hasVIF ?? false,
          vifComplaintFiled: vifComplaint ?? false,
          vifProcessStatus: vifStatus,
          knowsRightsAndRoutes: knowsRights ?? false,
          hasMedidaProteccion: hasMedidaProteccion ?? false,
          housingType,
          hasHousingDocument: hasHousingDocument ?? false,
          hasDebtOrProcess: hasDebt ?? false,
          debtDetails,
          needsPensionOrSubsidy: needsSubsidy ?? false,
          pensionDetails: subsidyDetails,
          hasUrgentCase: hasUrgentCase ?? false,
          urgentCaseDescription: urgentDesc,

          /* D */
          incomeSource,
          receivesSubsidies: receivesSubsidies ?? false,
          subsidiesDetails,
          hasJobSeeker: hasJobSeeker ?? false,
          jobSearchDifficulty: jobDifficulty,
          hasRecentGraduate: hasGraduate ?? false,
          graduateStatus,
          interestInTraining: interestInTraining ?? false,
          hasSmartphoneAccess: hasSmartphoneAccess ?? true,

          /* E */
          riskLevel,
          observedRiskIndicators: observedRisk,
          authorizedRecontact: authorizedRecontact ?? false,
          collectorObservations: collectorObs,
          activateImmediateRoute: activateRoute ?? false,
          immediateRouteType: routeType,
          needs: pickedNeeds,
          consentGranted: consent,
          minorImageConsent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible registrar la ficha.');
    } finally {
      setSending(false);
    }
  }

  /* ── Resultado exitoso ───────────────────────────────────────────────── */
  if (result) {
    return (
      <div className="p-5 sm:p-10 max-w-3xl mx-auto">
        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-950/30 p-8 sm:p-12 text-center space-y-5">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-400 text-emerald-950 grid place-items-center">
            <Check className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black">Caracterización registrada</h1>
          <p className="text-emerald-100">
            Código de seguimiento: <strong>{result.surveyCode}</strong>
          </p>
          <p className="text-sm text-emerald-200/70">
            Barrio: <strong>{barrio}</strong>
          </p>
          {result.priority === 'INMEDIATA' && (
            <div className="rounded-2xl bg-rose-500/15 border border-rose-400/30 text-rose-100 p-4 font-bold">
              <AlertTriangle className="w-5 h-5 inline mr-2 text-amber-300" />
              PRIORIDAD INMEDIATA — Activa la ruta de atención con el equipo de campo ahora.
            </div>
          )}
          {result.priority === 'PRIORITARIA' && (
            <div className="rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-100 p-4 font-bold">
              Caso prioritario — Incluir en lista de atención preferente el día del evento.
            </div>
          )}
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-bold text-pink-300 hover:text-white transition-colors"
          >
            Registrar otro hogar
          </button>
        </div>
      </div>
    );
  }

  /* ── Hogar no acepta participar ──────────────────────────────────────── */
  if (step === 0 && participationAccepted === false) {
    return (
      <div className="p-5 sm:p-10 max-w-3xl mx-auto">
        <div className="rounded-3xl border border-purple-700/50 bg-purple-950/30 p-8 text-center space-y-4">
          <p className="text-purple-200 font-bold">El hogar declinó participar. No se registra ningún dato.</p>
          <p className="text-sm text-purple-300/70">Gracias por respetar la decisión. Pasa al siguiente domicilio.</p>
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-bold text-pink-300 hover:text-white"
          >
            Ir al siguiente hogar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header de la jornada */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-300 text-[#2b0a39] px-3 py-1 text-[11px] font-black tracking-wider">
          <ClipboardList className="w-3.5 h-3.5" /> MODO ENCUESTADORA · DIAGNÓSTICO COMUNITARIO
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black">
          Caracterización familiar{' '}
          <span className="text-pink-300">· {barrio}</span>
        </h1>
        <p className="mt-1 text-sm text-purple-300/70">{localidad}</p>
        {jornada && (
          <p className="mt-2 text-xs text-purple-200/60 italic">{jornada}</p>
        )}
      </div>

      {/* Alerta de caso urgente */}
      <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-950/35 p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <p className="text-sm text-rose-100">
          <strong>¿Hay peligro o necesidad crítica ahora?</strong> No esperes la jornada. Activa
          la ruta de atención inmediata con el equipo de campo o llama al{' '}
          <a href="tel:123" className="text-amber-300 font-bold">123</a>.
        </p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar de pasos */}
        <aside className="rounded-3xl border border-purple-800/50 bg-[#170525] p-4 h-fit lg:sticky lg:top-6">
          <p className="text-[10px] font-black tracking-widest text-pink-300 mb-3 uppercase">Progreso</p>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 py-2.5 text-xs ${
                  i === step ? 'text-white font-black' : i < step ? 'text-emerald-300' : 'text-purple-300/50'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full grid place-items-center border ${
                    i === step
                      ? 'bg-pink-600 border-pink-400 text-white'
                      : i < step
                      ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                      : 'border-purple-700 text-purple-600'
                  }`}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </span>
                <span>{s.label}</span>
              </div>
            );
          })}
        </aside>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-purple-800/50 bg-[#170525] shadow-2xl p-5 sm:p-8">
          <div className="min-h-[400px] space-y-5">

            {/* ── STEP 0 — Ficha del hogar ─────────────────────────────── */}
            {step === 0 && (
              <>
                <SectionHeader icon={ClipboardList} title="Ficha de identificación del hogar" description="Ubica la visita sin exponer datos de la familia hasta que se otorgue el consentimiento." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nombre del encuestador/a" required>
                    <Input value={collectorName} onChange={(e) => setCollectorName(e.target.value)} placeholder="Ej. María Fernández" />
                  </Field>
                  <Field label="Código de encuestadora">
                    <Input value={collectorCode} onChange={(e) => setCollectorCode(e.target.value)} placeholder="Ej. E-07" />
                  </Field>
                  <Field label="Manzana / dirección aproximada" hint="El barrio aún consolida nomenclatura; usa referencias">
                    <Input value={manzana} onChange={(e) => setManzana(e.target.value)} placeholder="Ej. Mz 14 casa 3" />
                  </Field>
                  <Field label="Sector o zona de barrido">
                    <Input value={fieldZone} onChange={(e) => setFieldZone(e.target.value)} placeholder="Ej. Zona norte" />
                  </Field>
                  <Field label="Teléfono de contacto del hogar" hint="Solo si el hogar lo autoriza">
                    <Input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Ej. 311 000 0000" />
                  </Field>
                  <Field label="Punto de referencia o descripción de la vivienda">
                    <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Ej. Casa azul, frente a la cancha" />
                  </Field>
                </div>
                <hr className="border-purple-800/60" />
                <Field label="¿El hogar acepta participar voluntariamente?" required hint="Si responde No, agradece y retírate. No se registra ningún dato.">
                  <YesNo value={participationAccepted} onChange={setParticipationAccepted} name="participation" />
                </Field>
              </>
            )}

            {/* ── STEP 1 — Sección A: Composición del hogar ───────────── */}
            {step === 1 && (
              <>
                <SectionHeader icon={Users} title="Sección A — Datos generales del hogar" description="Registra la composición del hogar con datos de cada miembro. Solo lo que la familia autorice." />

                {/* Composición del hogar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-purple-100">Miembros del hogar</p>
                    <button type="button" onClick={addMember} className="flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Agregar miembro
                    </button>
                  </div>
                  {members.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-purple-800/60 bg-purple-950/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Miembro #{i + 1}</span>
                        {i > 0 && (
                          <button type="button" onClick={() => removeMember(i)} className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Nombre completo" required>
                          <Input value={m.fullName} onChange={(e) => updateMember(i, 'fullName', e.target.value)} placeholder="Nombre y apellidos" />
                        </Field>
                        <Field label="Edad">
                          <Input type="number" min="0" max="120" value={m.age} onChange={(e) => updateMember(i, 'age', e.target.value)} placeholder="Años" />
                        </Field>
                        <Field label="Parentesco / relación con la persona referente del hogar">
                          <Input value={m.relationship} onChange={(e) => updateMember(i, 'relationship', e.target.value)} placeholder="Ej. Cónyuge, hijo/a, nieto/a, hermana" />
                        </Field>
                        <Field label="Tipo de documento">
                          <Select value={m.documentType} onChange={(e) => updateMember(i, 'documentType', e.target.value)}>
                            {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </Select>
                        </Field>
                        {m.documentType !== 'SIN_DOC' && (
                          <Field label="Número de documento" hint="Solo si el miembro lo autoriza">
                            <Input value={m.documentNumber} onChange={(e) => updateMember(i, 'documentNumber', e.target.value)} placeholder="Número" />
                          </Field>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-purple-800/60" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Total personas en el hogar" required>
                    <Input type="number" min="1" max="50" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value.replace(/\D/g, ''))} placeholder="Ej. 4" />
                  </Field>
                  <Field label="¿Cuántas son menores de 18 años?" required>
                    <Input type="number" min="0" max="50" value={minorCount} onChange={(e) => setMinorCount(e.target.value.replace(/\D/g, ''))} placeholder="Ej. 2" />
                  </Field>
                  <Field label="Número de habitaciones" required>
                    <Input type="number" min="1" max="30" value={rooms} onChange={(e) => setRooms(e.target.value.replace(/\D/g, ''))} placeholder="Ej. 2" />
                  </Field>
                </div>

                <Field label="¿Todos los miembros tienen documento de identidad vigente?" required>
                  <YesNo value={allDocumentsValid} onChange={setAllDocumentsValid} name="docs" />
                  {allDocumentsValid === false && (
                    <Textarea className="mt-2" value={documentsIssue} onChange={(e) => setDocumentsIssue(e.target.value)} placeholder="¿Quién no tiene documento y por qué? (activa Mesa de Identidad)" />
                  )}
                </Field>

                <Field label="¿Todos los NNA del hogar están escolarizados?">
                  <YesNo value={allNNASchooled} onChange={setAllNNASchooled} name="school" />
                  {allNNASchooled === false && (
                    <Textarea className="mt-2" value={schoolDropoutReason} onChange={(e) => setSchoolDropoutReason(e.target.value)} placeholder="¿Quién no está escolarizado y por qué?" />
                  )}
                </Field>

                <Field label="¿Hay alguna persona con discapacidad en el hogar?">
                  <YesNo value={hasDisabledMember} onChange={setHasDisabledMember} name="disabled" />
                  {hasDisabledMember === true && (
                    <Input className="mt-2" value={disabledDetails} onChange={(e) => setDisabledDetails(e.target.value)} placeholder="¿Quién? ¿Tipo de discapacidad?" />
                  )}
                </Field>

                <Field label="¿Hay adultos mayores (65+) en el hogar?">
                  <YesNo value={hasElderlyMember} onChange={setHasElderlyMember} name="elderly" />
                  {hasElderlyMember === true && (
                    <Input className="mt-2" type="number" min="1" value={elderlyCount} onChange={(e) => setElderlyCount(e.target.value.replace(/\D/g, ''))} placeholder="¿Cuántos adultos mayores?" />
                  )}
                </Field>

                <Field label="Observaciones sobre hacinamiento u otras condiciones de la vivienda">
                  <Textarea value={overcrowdingNotes} onChange={(e) => setOvercrowdingNotes(e.target.value)} placeholder="Ej. 6 personas en 1 habitación" />
                </Field>
              </>
            )}

            {/* ── STEP 2 — Sección B: Salud General ──────────────────────── */}
            {step === 2 && (
              <>
                <SectionHeader icon={HeartPulse} title="Sección B — Salud General y Niñez" description="Construye el perfil epidemiológico del hogar para el brief médico de la jornada." />

                <Field label="¿Todos los miembros del hogar están afiliados a EPS?" required>
                  <YesNo value={allEPSAffiliated} onChange={setAllEPSAffiliated} name="eps" />
                </Field>
                {allEPSAffiliated === true && (
                  <Field label="¿Régimen?">
                    <Select value={epsRegime} onChange={(e) => setEpsRegime(e.target.value)}>
                      <option value="">Seleccionar régimen…</option>
                      <option value="SUBSIDIADO">Subsidiado</option>
                      <option value="CONTRIBUTIVO">Contributivo</option>
                      <option value="MIXTO">Mixto (ambos regímenes)</option>
                    </Select>
                  </Field>
                )}
                {allEPSAffiliated === false && (
                  <Field label="¿Por qué no están afiliados?">
                    <Textarea value={nonAffiliatedReason} onChange={(e) => setNonAffiliatedReason(e.target.value)} placeholder="Razón de no afiliación (activa Mesa de Tutela y Salud)" />
                  </Field>
                )}

                <Field label="¿Hay mujer embarazada o en periodo de lactancia?">
                  <YesNo value={hasPregnant} onChange={setHasPregnant} name="pregnant" />
                  {hasPregnant === true && (
                    <Textarea className="mt-2" value={prenatalCare} onChange={(e) => setPrenatalCare(e.target.value)} placeholder="¿Ha tenido controles prenatales? ¿Cuántos?" />
                  )}
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="¿Niños con esquema de vacunación al día?" required>
                    <YesNo value={vaccinesUpToDate} onChange={setVaccinesUpToDate} name="vaccines" />
                  </Field>
                  <Field label="¿Tiene carné de vacunación?">
                    <YesNo value={vaccineCard} onChange={setVaccineCard} name="card" />
                  </Field>
                </div>

                <Field label="¿Alguna persona tiene enfermedad crónica diagnosticada?" hint="Hipertensión, diabetes, enfermedad respiratoria, etc.">
                  <YesNo value={hasChronicDisease} onChange={setHasChronicDisease} name="chronic" />
                  {hasChronicDisease === true && (
                    <Textarea className="mt-2" value={chronicDiseaseDetails} onChange={(e) => setChronicDiseaseDetails(e.target.value)} placeholder="¿Quién? ¿Cuál enfermedad? ¿Lleva control médico?" />
                  )}
                </Field>

                <Field label="¿Algún menor con episodios frecuentes de EDA, parásitos o infecciones de piel en el último año?">
                  <YesNo value={hasEDAParasites} onChange={setHasEDAParasites} name="eda" />
                  {hasEDAParasites === true && (
                    <Textarea className="mt-2" value={edaDetails} onChange={(e) => setEdaDetails(e.target.value)} placeholder="¿Quién? ¿Frecuencia? ¿Recibió tratamiento?" />
                  )}
                </Field>

                <Field label="¿Alguien requiere atención odontológica pendiente?">
                  <YesNo value={dentalPending} onChange={setDentalPending} name="dental" />
                </Field>

                <Field label="¿Han tenido dificultad para conseguir citas, medicamentos o remisiones?">
                  <YesNo value={healthAccessDifficulty} onChange={setHealthAccessDifficulty} name="access" />
                  {healthAccessDifficulty === true && (
                    <Textarea className="mt-2" value={healthAccessDetails} onChange={(e) => setHealthAccessDetails(e.target.value)} placeholder="¿Cuál fue la dificultad? (activa Mesa de Tutela y Salud)" />
                  )}
                </Field>

                <Field label="Principal fuente de agua para consumo" required>
                  <Select value={waterSource} onChange={(e) => setWaterSource(e.target.value)}>
                    {WATER_SOURCES.map((w) => <option key={w.value} value={w.label}>{w.label}</option>)}
                  </Select>
                </Field>

                <Field label="¿Alguna persona del hogar considera que necesita apoyo emocional o psicológico?">
                  <YesNo value={psychoSupport} onChange={setPsychoSupport} name="psycho" />
                  {psychoSupport === true && (
                    <div className="mt-2.5 space-y-2">
                      <span className="block text-xs font-semibold text-purple-200">
                        Selecciona el integrante del hogar que requiere apoyo psicológico o emocional:
                      </span>
                      {members.filter((m) => m.fullName.trim().length > 0).length > 0 ? (
                        <Select
                          value={psychoSupportWho}
                          onChange={(e) => setPsychoSupportWho(e.target.value)}
                        >
                          <option value="">Selecciona un integrante registrado en la Sección A…</option>
                          {members
                            .filter((m) => m.fullName.trim().length > 0)
                            .map((m, idx) => {
                              const desc = `${m.fullName.trim()} (${m.relationship || 'Integrante'}, ${m.age ? `${m.age} años` : 'edad n/d'})`;
                              return (
                                <option key={idx} value={desc}>
                                  {desc}
                                </option>
                              );
                            })}
                          <option value="OTRO">Otro integrante / Todo el núcleo familiar</option>
                        </Select>
                      ) : (
                        <Input
                          value={psychoSupportWho}
                          onChange={(e) => setPsychoSupportWho(e.target.value)}
                          placeholder="Escribe el nombre o parentesco del integrante que requiere apoyo…"
                        />
                      )}
                      {psychoSupportWho === 'OTRO' && (
                        <Input
                          className="mt-2"
                          onChange={(e) => setPsychoSupportWho(`Otro: ${e.target.value}`)}
                          placeholder="Especifica quién o si requiere atención familiar conjunta…"
                        />
                      )}
                    </div>
                  )}
                </Field>

                <Field
                  label="¿Alguna mujer del hogar cuida permanentemente a otra persona (adulto mayor, discapacidad, niños) y siente sobrecarga o agotamiento emocional por las labores de cuidado?"
                  hint="Criterio de ingreso prioritario al Programa 03 · Contención Psicosocial y Círculos de Autocuidado."
                >
                  <YesNo value={hasCaregiverBurnout} onChange={setHasCaregiverBurnout} name="caregiverBurnout" />
                </Field>
              </>
            )}

            {/* ── STEP 3 — Sección B.1: Solicitud de Citas Médicas & Gineco ──────── */}
            {step === 3 && (
              <>
                <SectionHeader
                  icon={Stethoscope}
                  title="Sección B.1 — Solicitud de Citas Médicas por Especialidad"
                  description="Identifica las citas que el hogar requiere para la jornada de salud, registrando síntomas y motivo o intención de la consulta."
                />

                {/* 1. Ginecología y Salud Femenina */}
                <div className="rounded-2xl border border-pink-500/40 bg-pink-950/20 p-4 space-y-4">
                  <div className="flex items-center gap-2 text-pink-300">
                    <HeartPulse className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-black uppercase tracking-wider">Atención en Ginecología & Salud de la Mujer</span>
                  </div>

                  <Field label="¿Alguna mujer del hogar requiere cita / valoración con Ginecología?" hint="Consulta prioritaria de salud femenina en la jornada">
                    <YesNo value={needsGynecology} onChange={setNeedsGynecology} name="gynecology" />
                    {needsGynecology === true && (
                      <Textarea
                        className="mt-2"
                        value={gynecologySymptoms}
                        onChange={(e) => setGynecologySymptoms(e.target.value)}
                        placeholder="¿Qué síntomas presenta o cuál es el motivo / intención de la consulta? (ej. dolor pélvico, citología, molestia menstrual, revisión o control)"
                      />
                    )}
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="¿Cuándo se realizó la última citología cérvico-uterina?">
                      <Select value={lastPapSmear} onChange={(e) => setLastPapSmear(e.target.value)}>
                        {PAP_SMEAR_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </Select>
                    </Field>

                    <Field label="Método de planificación familiar actual">
                      <Select value={familyPlanning} onChange={(e) => setFamilyPlanning(e.target.value)}>
                        {PLANNING_OPTIONS.map((po) => <option key={po.value} value={po.value}>{po.label}</option>)}
                      </Select>
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="¿Desea asesoría médica para iniciar o cambiar método anticonceptivo?">
                      <YesNo value={desiresPlanningCounseling} onChange={setDesiresPlanningCounseling} name="counseling" />
                    </Field>

                    <Field label="¿Requiere o tiene pendiente mamografía o ecografía mamaria?">
                      <YesNo value={mammographyNeeded} onChange={setMammographyNeeded} name="mammo" />
                    </Field>
                  </div>

                  <Field label="¿Ha recibido capacitación o sabe realizarse el autoexamen de mama?">
                    <YesNo value={breastExamTrained} onChange={setBreastExamTrained} name="breast" />
                  </Field>
                </div>

                {/* 2. Otras Especialidades Médicas de la Jornada */}
                <div className="rounded-2xl border border-purple-800/70 bg-purple-950/30 p-4 space-y-4">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Stethoscope className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-black uppercase tracking-wider">Citas Requeridas en Otras Especialidades</span>
                  </div>

                  {/* Medicina General */}
                  <Field label="¿Requiere cita con Medicina General?">
                    <YesNo value={needsGeneralMedicine} onChange={setNeedsGeneralMedicine} name="generalMedicine" />
                    {needsGeneralMedicine === true && (
                      <Textarea
                        className="mt-2"
                        value={generalMedicineReason}
                        onChange={(e) => setGeneralMedicineReason(e.target.value)}
                        placeholder="¿Qué síntomas presenta o cuál es el motivo de consulta con el médico general?"
                      />
                    )}
                  </Field>

                  {/* Pediatría */}
                  <Field label="¿Requiere cita con Pediatría para los niños/as del hogar?">
                    <YesNo value={needsPediatrics} onChange={setNeedsPediatrics} name="pediatrics" />
                    {needsPediatrics === true && (
                      <Textarea
                        className="mt-2"
                        value={pediatricsReason}
                        onChange={(e) => setPediatricsReason(e.target.value)}
                        placeholder="¿Quién consulta? ¿Qué síntomas presenta o qué control requiere el menor?"
                      />
                    )}
                  </Field>

                  {/* Odontología */}
                  <Field label="¿Requiere atención con Odontología?">
                    <YesNo value={needsDental} onChange={setNeedsDental} name="dentalAppt" />
                    {needsDental === true && (
                      <Textarea
                        className="mt-2"
                        value={dentalReason}
                        onChange={(e) => setDentalReason(e.target.value)}
                        placeholder="Motivo de la atención odontológica (ej. dolor, revisión, calzas, limpieza)"
                      />
                    )}
                  </Field>

                  {/* Psicología */}
                  <Field label="¿Requiere cita con Psicología / Apoyo Emocional?">
                    <YesNo value={needsPsychology} onChange={setNeedsPsychology} name="psychologyAppt" />
                    {needsPsychology === true && (
                      <Textarea
                        className="mt-2"
                        value={psychologyReason}
                        onChange={(e) => setPsychologyReason(e.target.value)}
                        placeholder="Motivo o intención de consulta psicológica (espacio confidencial)"
                      />
                    )}
                  </Field>

                  {/* Nutrición */}
                  <Field label="¿Requiere consulta con Nutrición?">
                    <YesNo value={needsNutrition} onChange={setNeedsNutrition} name="nutritionAppt" />
                    {needsNutrition === true && (
                      <Textarea
                        className="mt-2"
                        value={nutritionReason}
                        onChange={(e) => setNutritionReason(e.target.value)}
                        placeholder="Motivo de valoración nutricional (bajo peso infantil, sobrepeso, dieta especial)"
                      />
                    )}
                  </Field>
                </div>

                {/* Necesidades médicas y de salud */}
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-black text-purple-100">Servicios de salud a priorizar el día del evento:</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {NEEDS.filter((n) => n[2] === 'Salud').map(([id, label]) => (
                      <label key={id} className={`cursor-pointer rounded-xl border p-3 text-sm transition-colors ${
                        pickedNeeds.includes(id) ? 'border-pink-400 bg-pink-500/15 text-white' : 'border-purple-800 bg-purple-950/30 text-purple-100 hover:border-purple-500'
                      }`}>
                        <input type="checkbox" className="sr-only" checked={pickedNeeds.includes(id)} onChange={() => toggleNeed(id)} />
                        <span className="flex gap-2">
                          <span className={`mt-0.5 w-4 h-4 rounded border grid place-items-center shrink-0 ${pickedNeeds.includes(id) ? 'border-pink-300 bg-pink-500' : 'border-purple-500'}`}>
                            {pickedNeeds.includes(id) && <Check className="w-3 h-3" />}
                          </span>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 4 — Sección C: Jurídico y familiar ─────────────── */}
            {step === 4 && (
              <>
                <SectionHeader icon={Scale} title="Sección C — Situación jurídica y familiar" description="Dimensiona la demanda de las mesas jurídicas y activa rutas de protección si es necesario." />

                <Field label="¿Hay proceso pendiente de alimentos, custodia o régimen de visitas?">
                  <YesNo value={hasFamilyProcess} onChange={setHasFamilyProcess} name="family" />
                  {hasFamilyProcess === true && (
                    <Textarea className="mt-2" value={familyProcessDetails} onChange={(e) => setFamilyProcessDetails(e.target.value)} placeholder="Detalla brevemente el estado del proceso (activa Mesa de Familia)" />
                  )}
                </Field>

                <Field label="¿Alguna persona del hogar ha sido víctima de violencia intrafamiliar o de género?" hint="Pregunta con especial sensibilidad. Si hay riesgo activo, activa ruta inmediata.">
                  <YesNo value={hasVIF} onChange={setHasVIF} name="vif" />
                  {hasVIF === true && (
                    <div className="mt-2 space-y-2">
                      <Field label="¿Se puso la denuncia?">
                        <YesNo value={vifComplaint} onChange={setVifComplaint} name="complaint" />
                      </Field>
                      <Textarea value={vifStatus} onChange={(e) => setVifStatus(e.target.value)} placeholder="Estado del proceso (activa Mesa de Protección y protocolo de ruta inmediata)" />
                    </div>
                  )}
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="¿Cuenta o ha contado con medida de protección formal?"
                    hint="Orden de alejamiento, desalojo del agresor o protección de Policía (Programa 06 · Mujer y Justicia)"
                  >
                    <YesNo value={hasMedidaProteccion} onChange={setHasMedidaProteccion} name="medidaProteccion" />
                  </Field>

                  <Field
                    label="¿Conoce las rutas de denuncia y sus derechos ante VBG?"
                    hint="Línea 155, Comisarías de Familia, Fiscalía CAVIF (Programa 06 · Asesoría Legal)"
                  >
                    <YesNo value={knowsRights} onChange={setKnowsRights} name="knowsRights" />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Tipo de tenencia de la vivienda">
                    <Select value={housingType} onChange={(e) => setHousingType(e.target.value)}>
                      {HOUSING_TYPES.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
                    </Select>
                  </Field>
                  <Field label="¿Cuenta con documento de propiedad o posesión?">
                    <YesNo value={hasHousingDocument} onChange={setHasHousingDocument} name="housedoc" />
                  </Field>
                </div>

                <Field label="¿Tiene alguna deuda, embargo o proceso judicial en curso?">
                  <YesNo value={hasDebt} onChange={setHasDebt} name="debt" />
                  {hasDebt === true && (
                    <Textarea className="mt-2" value={debtDetails} onChange={(e) => setDebtDetails(e.target.value)} placeholder="Describe brevemente (activa Mesa de Tutela y Trámites)" />
                  )}
                </Field>

                <Field label="¿Necesita orientación sobre trámite pensional, subsidio o proceso ante entidad pública?">
                  <YesNo value={needsSubsidy} onChange={setNeedsSubsidy} name="subsidy" />
                  {needsSubsidy === true && (
                    <Textarea className="mt-2" value={subsidyDetails} onChange={(e) => setSubsidyDetails(e.target.value)} placeholder="¿Qué trámite o subsidio? (activa Mesa de Tutela)" />
                  )}
                </Field>

                <Field label="¿Existe algún caso urgente que NO puede esperar al día del evento?" hint="Si responde Sí, activa el protocolo de ruta inmediata en la Sección E.">
                  <YesNo value={hasUrgentCase} onChange={setHasUrgentCase} name="urgent" />
                  {hasUrgentCase === true && (
                    <div className="mt-2 rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4">
                      <p className="text-sm text-amber-100 font-bold mb-2">No incluyas detalles sensibles aquí. Notifica al coordinador de campo hoy.</p>
                      <Textarea value={urgentDesc} onChange={(e) => setUrgentDesc(e.target.value)} placeholder="Descripción mínima del tipo de urgencia" />
                    </div>
                  )}
                </Field>

                {/* Necesidades jurídicas */}
                <div className="space-y-2">
                  <p className="text-sm font-black text-purple-100">Necesidades jurídicas y de protección (multi-selección)</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {NEEDS.filter((n) => n[2] === 'Familia y protección' || n[2] === 'Jurídico y social').map(([id, label]) => (
                      <label key={id} className={`cursor-pointer rounded-xl border p-3 text-sm transition-colors ${
                        pickedNeeds.includes(id) ? 'border-pink-400 bg-pink-500/15 text-white' : 'border-purple-800 bg-purple-950/30 text-purple-100 hover:border-purple-500'
                      }`}>
                        <input type="checkbox" className="sr-only" checked={pickedNeeds.includes(id)} onChange={() => toggleNeed(id)} />
                        <span className="flex gap-2">
                          <span className={`mt-0.5 w-4 h-4 rounded border grid place-items-center shrink-0 ${pickedNeeds.includes(id) ? 'border-pink-300 bg-pink-500' : 'border-purple-500'}`}>
                            {pickedNeeds.includes(id) && <Check className="w-3 h-3" />}
                          </span>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 5 — Sección D: Económico y social ──────────────── */}
            {step === 5 && (
              <>
                <SectionHeader icon={DollarSign} title="Sección D — Situación económica y social" description="Identifica déficit de oportunidades y subsidios no aprovechados." />

                <Field label="Principal fuente de ingreso del hogar">
                  <Textarea value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} placeholder="Ej. Ventas informales, empleo doméstico, rebusque, empleo formal" />
                </Field>

                <Field label="¿El hogar recibe algún subsidio o programa del Estado?" hint="Familias en Acción, Renta Ciudadana, Devolución del IVA, Colombia Mayor, etc.">
                  <YesNo value={receivesSubsidies} onChange={setReceivesSubsidies} name="subs" />
                  {receivesSubsidies === true && (
                    <Input className="mt-2" value={subsidiesDetails} onChange={(e) => setSubsidiesDetails(e.target.value)} placeholder="¿Cuáles subsidios recibe?" />
                  )}
                </Field>

                <Field label="¿Hay alguien en el hogar buscando empleo activamente?">
                  <YesNo value={hasJobSeeker} onChange={setHasJobSeeker} name="job" />
                  {hasJobSeeker === true && (
                    <Textarea className="mt-2" value={jobDifficulty} onChange={(e) => setJobDifficulty(e.target.value)} placeholder="¿Qué dificultad ha encontrado? (activa Mesa de Empleo)" />
                  )}
                </Field>

                <Field label="¿Hay algún joven que egresó del bachillerato en los últimos 2 años?">
                  <YesNo value={hasGraduate} onChange={setHasGraduate} name="grad" />
                  {hasGraduate === true && (
                    <Input className="mt-2" value={graduateStatus} onChange={(e) => setGraduateStatus(e.target.value)} placeholder="¿Está estudiando o trabajando actualmente? ¿Qué dificultad?" />
                  )}
                </Field>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <Field
                    label="¿Alguna mujer del hogar desea formarse para emprender o trabajar?"
                    hint="Talleres de confección textil, gastronomía, habilidades digitales o negocios"
                  >
                    <YesNo value={interestInTraining} onChange={setInterestInTraining} name="training" />
                  </Field>

                  <Field
                    label="¿El hogar cuenta con smartphone con WhatsApp e internet?"
                    hint="Permite enviar convocatorias formativas y ofertas laborales comunitarias"
                  >
                    <YesNo value={hasSmartphoneAccess} onChange={setHasSmartphoneAccess} name="smartphone" />
                  </Field>
                </div>
              </>
            )}

            {/* ── STEP 6 — Sección E: Percepción de riesgo ────────────── */}
            {step === 6 && (
              <>
                <SectionHeader icon={Eye} title="Sección E — Percepción de riesgo (encuestador)" description="Esta sección la diligencia exclusivamente el encuestador/a con base en lo observado, no el hogar." />

                <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 mb-4">
                  <p className="text-sm text-amber-100"><strong>Protocolo de activación inmediata:</strong> Si el riesgo es ALTO, notifica hoy mismo al coordinador de trabajo social. No esperes al día del evento.</p>
                </div>

                <Field label="Nivel de riesgo o vulnerabilidad del hogar (percepción del encuestador)" required>
                  <div className="flex gap-3 flex-wrap">
                    {RISK_LEVELS.map((r) => (
                      <label key={r.value} className={`cursor-pointer rounded-2xl border px-5 py-3 font-black text-sm transition-all ${
                        riskLevel === r.value ? r.color : 'border-purple-700 bg-purple-950/30 text-purple-300 hover:border-purple-500'
                      }`}>
                        <input type="radio" name="risk" className="sr-only" checked={riskLevel === r.value} onChange={() => setRiskLevel(r.value as 'BAJO' | 'MEDIO' | 'ALTO')} />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="¿Hay indicios de riesgo que el hogar no verbalizó pero el encuestador observó?" hint="No incluyas datos sensibles innecesarios. Solo lo que sea relevante para la priorización.">
                  <Textarea value={observedRisk} onChange={(e) => setObservedRisk(e.target.value)} placeholder="Ej. Señales de violencia visible, condición de salud crítica no declarada, etc." />
                </Field>

                <Field label="¿El hogar autoriza ser contactado antes del evento si hay necesidad prioritaria?">
                  <YesNo value={authorizedRecontact} onChange={setAuthorizedRecontact} name="recontact" />
                </Field>

                <Field label="Observaciones generales del encuestador">
                  <Textarea rows={4} value={collectorObs} onChange={(e) => setCollectorObs(e.target.value)} placeholder="Condiciones de la vivienda, actitud del hogar, contexto relevante para el equipo" />
                </Field>

                <hr className="border-purple-800/60" />

                <Field label="¿Se debe activar una ruta institucional INMEDIATA?" hint="Solo para casos donde esperar al evento pone en riesgo la vida o la seguridad de una persona">
                  <YesNo value={activateRoute} onChange={setActivateRoute} name="route" />
                </Field>

                {activateRoute === true && (
                  <div className="rounded-2xl border border-rose-400/30 bg-rose-950/30 p-4 space-y-3">
                    <p className="text-sm text-rose-100 font-bold">⚠ Notifica al coordinador de campo AHORA. Esta activación quedará registrada con fecha y responsable.</p>
                    <Field label="Tipo de ruta a activar">
                      <Select value={routeType} onChange={(e) => setRouteType(e.target.value)}>
                        <option value="">Seleccionar ruta…</option>
                        {ROUTE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </Select>
                    </Field>
                  </div>
                )}
              </>
            )}

            {/* ── STEP 7 — Consentimiento informado ───────────────────── */}
            {step === 7 && (
              <>
                <SectionHeader icon={ShieldCheck} title="Consentimiento informado y autorización" description="Base legal: Ley 1581 de 2012 (Habeas Data) · Decreto 1377 de 2013 · Ley 1098 de 2006 (art. 47)" />

                {/* Resumen de la ficha */}
                <div className="rounded-2xl bg-purple-950/50 border border-purple-800 p-4 text-sm text-purple-100 space-y-1">
                  <p><strong>Barrio:</strong> {barrio}</p>
                  <p><strong>Encuestador/a:</strong> {collectorName}</p>
                  <p><strong>Personas en el hogar:</strong> {householdSize} · <strong>Menores:</strong> {minorCount}</p>
                  <p><strong>Servicios priorizados:</strong> {pickedNeeds.length}</p>
                  {needsGynecology && <p className="text-pink-300 font-bold">🌸 Cita de Ginecología solicitada: {gynecologySymptoms || 'Valoración general'}</p>}
                  {needsGeneralMedicine && <p className="text-purple-300 font-bold">🩺 Cita de Medicina General solicitada</p>}
                  {needsPediatrics && <p className="text-amber-300 font-bold">👶 Cita de Pediatría para menores</p>}
                  {hasUrgentCase && <p className="text-amber-300 font-bold">⚠ Caso urgente declarado</p>}
                  {activateRoute && <p className="text-rose-300 font-bold">🔴 Ruta de atención inmediata activada</p>}
                </div>

                {/* Texto del consentimiento */}
                <div className="rounded-2xl border border-purple-700/60 bg-purple-950/40 p-5 text-sm text-purple-100 space-y-3 leading-relaxed">
                  <div className="flex items-center gap-2 text-pink-300 font-black">
                    <FileText className="w-4 h-4" />
                    <span>Autorización de tratamiento de datos personales</span>
                  </div>
                  <p>Yo, en representación del hogar visitado, autorizo a la <strong>Fundación Senda Mujer</strong>, con domicilio en Cartagena de Indias, D.T. y C., Colombia, para recopilar, almacenar, usar y transmitir los datos personales consignados en esta ficha de caracterización, con las siguientes finalidades:</p>
                  <ul className="list-disc pl-5 space-y-1 text-purple-200">
                    <li>Planificación y ejecución de la Jornada Cívica y Médica en el barrio {barrio}.</li>
                    <li>Articulación con entidades públicas de salud, educación, justicia y protección social para gestionar rutas de atención.</li>
                    <li>Seguimiento posterior al evento durante 60 días calendario.</li>
                    <li>Generación de estadísticas agregadas para informes de impacto (sin identificación individual).</li>
                  </ul>
                  <p>Los datos serán tratados de conformidad con la <strong>Ley 1581 de 2012</strong>, el <strong>Decreto 1377 de 2013</strong> y la política de privacidad de la Fundación. Tengo derecho a conocer, actualizar, rectificar y suprimir mis datos, y a revocar esta autorización en cualquier momento enviando solicitud a la Fundación.</p>
                  <p className="text-purple-300/70 text-xs">Responsable del tratamiento: Fundación Senda Mujer · Cartagena, Colombia · Contacto: fundacionsendamujer@gmail.com</p>
                </div>

                <label className="flex gap-3 cursor-pointer rounded-2xl border border-purple-800 p-4 text-sm text-purple-100 hover:border-pink-500/50 transition-colors">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-pink-500 h-4 w-4" />
                  <span>
                    <strong>El hogar acepta y comprende</strong> esta autorización de tratamiento de datos personales.
                    La caracterización se almacenará con código de seguimiento anónimo.
                  </span>
                </label>

                {/* Consentimiento de imagen para menores */}
                {+minorCount > 0 && (
                  <label className="flex gap-3 cursor-pointer rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-100 hover:border-amber-500/50 transition-colors">
                    <input type="checkbox" checked={minorImageConsent} onChange={(e) => setMinorImageConsent(e.target.checked)} className="mt-0.5 accent-amber-500 h-4 w-4" />
                    <span>
                      <strong>Autorización de uso de imagen para menores de edad</strong> (Ley 1098/2006, art. 47):
                      El padre, madre o acudiente autoriza el registro fotográfico o audiovisual de los menores del hogar
                      con fines exclusivos de documentación del proyecto.
                    </span>
                  </label>
                )}

                <div className="flex items-start gap-2 text-xs text-purple-300/70">
                  <LockKeyhole className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>La ficha se almacena en MongoDB con código único aleatorio. Los datos no se compartirán con terceros sin nueva autorización expresa del titular.</span>
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-rose-500/15 border border-rose-400/30 p-3 text-sm text-rose-100">
              {error}
            </p>
          )}

          {/* Navegación */}
          <div className="mt-7 pt-5 border-t border-purple-800/50 flex justify-between items-center gap-3">
            {step > 0 ? (
              <button type="button" onClick={back} className="inline-flex items-center gap-2 text-sm font-bold text-purple-200 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : <span />}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-sm font-black shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={sending || !consent}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-black text-emerald-950 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                {sending ? 'Guardando en MongoDB…' : 'Guardar caracterización'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
