'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope, Activity, FileText, CheckCircle2, User, Calendar, Plus,
  Lock, Search, Filter, ShieldAlert, LogOut, KeyRound, DollarSign, Award,
  Clock, Info, Shield, Scale, HeartPulse, Brain, Home, Eye, Check,
  AlertTriangle, ChevronRight, UserCheck, RefreshCw, X, Printer, FilePlus,
  Pill, AlertCircle, Phone, MapPin, Hash, Sparkles, FolderOpen, Heart,
  UserPlus, UserCog, CalendarPlus, BarChart3, Settings, ShieldCheck, EyeOff, Database, PackageCheck, Gavel, FileCheck
} from 'lucide-react';
import IPSCMeasurementForm from '@/components/caribe-seguro/IPSCMeasurementForm';
import DeteriorationAlertsPanel from '@/components/caribe-seguro/DeteriorationAlertsPanel';
import ObservatoryManager from '@/components/caribe-seguro/ObservatoryManager';

const PROFESSIONAL_SPECIALTIES: Record<ProfessionalRole, string[]> = {
  MEDICO: ['Medicina general', 'Ginecología y obstetricia', 'Psiquiatría', 'Medicina familiar', 'Pediatría', 'Odontología', 'Otra especialidad médica'],
  JURIDICO: ['Violencias basadas en género (VBG)', 'Derecho de familia', 'Derecho penal', 'Derechos humanos', 'Derechos sexuales y reproductivos', 'Otra especialidad jurídica'],
  PSICOLOGO: ['Psicología clínica', 'Psicología social', 'Psicología comunitaria', 'Trauma', 'VBG', 'Salud mental', 'Otra especialidad psicológica'],
  TRABAJO_SOCIAL: ['Trabajo social comunitario', 'Trabajo social familiar', 'Intervención territorial', 'VBG', 'Protección social', 'Otra especialidad social'],
  COORDINADOR: ['Coordinación de programas', 'Gestión de casos', 'Otra especialidad'],
  ADMIN_SISTEMA: ['Administración del sistema', 'Otra especialidad'],
};

export type ProfessionalRole = 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO' | 'COORDINADOR' | 'ADMIN_SISTEMA';

interface ProfessionalProfile {
  id: string;
  name: string;
  role: ProfessionalRole;
  roleTitle: string;
  specialty: string;
  code: string;
  documentType: string;
  documentNumber: string;
  rethus: string;
  professionalCard?: string;
  institutionName?: string;
  organizationType?: string;
  city?: string;
  department?: string;
  modalities?: string[];
  services?: string[];
  availability?: string;
  urgentCases?: boolean;
  yearsExperience?: string;
  bio?: string;
  consentsAccepted?: boolean;
  verificationStatus?: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO' | 'VENCIDO';
  email: string;
  phone: string;
  avatarBg: string;
  badgeColor: string;
  status: 'ACTIVO' | 'LICENCIA' | 'INACTIVO';
}

const INITIAL_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: 'PROF-ADMIN',
    name: 'Dra. Sorelvis Murillo (Administración)',
    role: 'ADMIN_SISTEMA',
    roleTitle: 'Directora Ejecutiva & Administradora del Sistema',
    specialty: 'Gestión Global, Creación de Médicos, Citas & Pacientes',
    code: 'ADMIN-001',
    documentType: 'CC',
    documentNumber: '1000000001',
    rethus: 'DIR-EJECUTIVA-2026',
    email: 'admin.senda@sendamujer.org',
    phone: '+57 301 469 2095',
    avatarBg: 'bg-amber-600',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    status: 'ACTIVO',
  },
  {
    id: 'PROF-101',
    name: 'Dra. Elena Ruiz',
    role: 'MEDICO',
    roleTitle: 'Médica Especialista en Ginecología & Obstetricia',
    specialty: 'Salud Reproductiva & Ecografía Pélvica',
    code: 'MED-7712',
    documentType: 'CC',
    documentNumber: '1000000002',
    rethus: 'RETHUS 1047892-BOL',
    email: 'elena.ruiz@sendamujer.org',
    phone: '+57 300 112 4490',
    avatarBg: 'bg-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    status: 'ACTIVO',
  },
  {
    id: 'PROF-102',
    name: 'Lic. Sorelvis Murillo',
    role: 'TRABAJO_SOCIAL',
    roleTitle: 'Trabajadora Social de Territorio',
    specialty: 'Acompañamiento Domiciliario & Proyectos',
    code: 'SOC-4401',
    documentType: 'CC',
    documentNumber: '1000000003',
    rethus: 'RETHUS 99281-TS-COL',
    email: 'sorelvis.murillo@sendamujer.org',
    phone: '+57 301 469 2095',
    avatarBg: 'bg-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    status: 'ACTIVO',
  },
  {
    id: 'PROF-103',
    name: 'Dra. Patricia Herrera',
    role: 'JURIDICO',
    roleTitle: 'Abogada Especialista en VBG & Ley 1257 de 2008',
    specialty: 'Derecho de Familia & Medidas de Protección',
    code: 'JUR-9923',
    documentType: 'CC',
    documentNumber: '1000000004',
    rethus: 'TP 204918-CSJ',
    email: 'patricia.herrera@sendamujer.org',
    phone: '+57 315 889 0011',
    avatarBg: 'bg-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    status: 'ACTIVO',
  },
  {
    id: 'PROF-104',
    name: 'Lic. Claudia Morales',
    role: 'PSICOLOGO',
    roleTitle: 'Psicóloga Clínica & Salud Mental',
    specialty: 'Contención Emocional & Trauma de Género',
    code: 'PSI-3320',
    documentType: 'CC',
    documentNumber: '1000000005',
    rethus: 'COLPSIC 449102-PSI',
    email: 'claudia.morales@sendamujer.org',
    phone: '+57 312 443 8810',
    avatarBg: 'bg-pink-600',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    status: 'ACTIVO',
  },
];

export interface ClinicalEvolutionNote {
  id: string;
  date: string;
  time: string;
  author: string;
  role: ProfessionalRole;
  rethus: string;
  subjective: string;
  objective: string;
  analysis: string;
  plan: string;
  cie10Code?: string;
}

export interface LegalProcedureItem {
  id: string;
  date: string;
  entity: string;
  procedureType: string;
  status: 'RADICADO' | 'EN_MEDIDA' | 'AUDIENCIA' | 'RESUELTO' | 'ARCHIVADO';
  caseNumber?: string;
  notes: string;
}

export interface ResourceProvidedItem {
  id: string;
  date: string;
  resourceType: 'KIT_MATERNAL' | 'CAPITAL_SEMILLA' | 'HOSPEDAJE_REFUGIO' | 'SUBSIDIO_TRANSPORTE' | 'MERCADO_ALIMENTARIO' | 'ATENCION_ODONTOLOGICA';
  description: string;
  quantity: number;
  estimatedValueCop: number;
  deliveredBy: string;
}

export interface PatientEHR {
  id: string;
  patientCode: string;
  patientName: string;
  firstName?: string;
  lastName?: string;
  documentType?: string;
  documentNumber?: string;
  docId: string;
  age: number;
  birthDate: string;
  bloodType: string;
  eps: string;
  phone: string;
  email?: string;
  department?: string;
  municipality?: string;
  neighborhood: string;
  address?: string;
  zone?: string;
  preferredContact?: string;
  safeContact?: string;
  maritalStatus?: string;
  educationLevel?: string;
  occupation?: string;
  employmentStatus?: string;
  housingType?: string;
  householdMembers?: number;
  hasChildren?: boolean;
  childrenCount?: number;
  peopleInCharge?: string;
  healthRegime?: string;
  typeOfDisability?: string;
  disabilityType?: string;
  accessibilitySupport?: string;
  motivation?: string[];
  riskSituations?: string[];
  digitalPhoneAccess?: string;
  internetAccess?: string;
  safeCommunication?: string;
  notificationsDiscrete?: string;
  participationSource?: string;
  emergencyContact: string;
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
  consents?: Array<{ purpose: string; grantedAt: Date; status: string; version: string }>;
  evolutions: ClinicalEvolutionNote[];
  legalProcedures: LegalProcedureItem[];
  resourcesProvided: ResourceProvidedItem[];
  prescriptions: { id: string; date: string; medication: string; dosage: string; duration: string; doctor: string }[];
  routesActivated: { routeName: string; date: string; status: string; entity: string }[];
  documents: { name: string; date: string; category: string; url?: string }[];
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  modality: 'Presencial Sede Pie de la Popa' | 'Teleorientación Virtual' | 'Visita Domiciliaria';
  status: 'PROGRAMADA' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  notes: string;
}

const INITIAL_PATIENTS_EHR: PatientEHR[] = [
  {
    id: 'EHR-001',
    patientCode: 'CSM-2026-000481',
    patientName: 'María Alejandra Torres',
    docId: '1.047.892.411',
    age: 28,
    birthDate: '1998-04-14',
    bloodType: 'O+',
    eps: 'Mutual Ser EPS-S',
    phone: '+57 300 489 1120',
    emergencyContact: 'Carmen Torres (Madre) - +57 301 223 9901',
    neighborhood: 'Pie de la Popa, Calle 30 #21-45, Cartagena',
    allergies: 'Penicilina, Sulfas',
    riskLevel: 'BAJO',
    ipscScore: 78,
    dimensionsIPSC: { seguridadFisica: 8, seguridadDigital: 7, autonomiaEconomica: 8, redDeApoyo: 8, accesoAJusticia: 8, accesoASalud: 8, bienestarPsicosocial: 8, conocimientoDerechos: 8, capacidadRespuesta: 7, continuidadAcompanamiento: 8 },
    primaryCategory: 'MEDICO',
    assignedDoctor: 'Dra. Elena Ruiz',
    status: 'RUTA_ACTIVADA',
    vitals: { bloodPressure: '120/80 mmHg', heartRate: 74, weightKg: 62, heightM: 1.62, bmi: 23.6, tempC: 36.6 },
    evolutions: [
      {
        id: 'EVO-101',
        date: '2026-09-01',
        time: '09:30 AM',
        author: 'Dra. Elena Ruiz',
        role: 'MEDICO',
        rethus: 'RETHUS 1047892-BOL',
        subjective: 'Paciente gestante de 14 semanas en control prenatal. Refiere náusea matutina tratada.',
        objective: 'AU: 12 cm. FCF: 148 lpm audible con Doppler. Ecografía fetal normal.',
        analysis: 'Supervisión de embarazo normal de 14 semanas. CIE-10: Z34.8.',
        plan: '1. Ácido Fólico + Sulfato Ferroso. 2. Ecografía Morfológica semana 20.',
        cie10Code: 'Z34.8',
      },
    ],
    legalProcedures: [
      {
        id: 'LEG-101',
        date: '2026-08-15',
        entity: 'Comisaría de Familia Chiquinquirá',
        procedureType: 'Medida de Protección Preventiva Ley 1257/2008',
        status: 'RESUELTO',
        caseNumber: 'RAD-2026-8819',
        notes: 'Medida cautelar de alejamiento otorgada a favor de la paciente gestante.',
      },
    ],
    resourcesProvided: [
      {
        id: 'RES-101',
        date: '2026-08-15',
        resourceType: 'KIT_MATERNAL',
        description: 'Entrega de Kit Maternal Nutricional Prioritario y Suplementos',
        quantity: 1,
        estimatedValueCop: 350000,
        deliveredBy: 'Lic. Sorelvis Murillo',
      },
    ],
    prescriptions: [
      { id: 'RX-1', date: '2026-09-01', medication: 'Ácido Fólico 1mg Tab', dosage: '1 tableta VO cada 24 horas', duration: '90 días', doctor: 'Dra. Elena Ruiz' },
    ],
    routesActivated: [
      { routeName: 'Atención Médica Prenatal Preferencial', date: '2026-08-15', status: 'COMPLETADA', entity: 'Sede Cartagena Senda Mujer' },
    ],
    documents: [
      { name: 'Ecografía_Obstétrica_14S.pdf', date: '2026-09-01', category: 'Ecografía' },
    ],
  },
  {
    id: 'EHR-002',
    patientCode: 'CSM-2026-000482',
    patientName: 'Valeria Castro',
    docId: '1.050.441.982',
    age: 32,
    birthDate: '1994-11-02',
    bloodType: 'A+',
    eps: 'Coosalud EPS',
    phone: '+57 312 901 8843',
    emergencyContact: 'Sofía Castro (Hermana) - +57 310 994 0012',
    neighborhood: 'Chiquinquirá, Transversal 54 #30-12, Cartagena',
    allergies: 'Ninguna conocida',
    riskLevel: 'ALTO',
    ipscScore: 42,
    dimensionsIPSC: { seguridadFisica: 3, seguridadDigital: 4, autonomiaEconomica: 4, redDeApoyo: 5, accesoAJusticia: 4, accesoASalud: 5, bienestarPsicosocial: 4, conocimientoDerechos: 5, capacidadRespuesta: 4, continuidadAcompanamiento: 4 },
    primaryCategory: 'JURIDICO',
    assignedDoctor: 'Dra. Patricia Herrera',
    status: 'EN_ORIENTACION',
    vitals: { bloodPressure: '135/85 mmHg', heartRate: 88, weightKg: 58, heightM: 1.58, bmi: 23.2, tempC: 36.5 },
    evolutions: [
      {
        id: 'EVO-201',
        date: '2026-08-30',
        time: '11:00 AM',
        author: 'Dra. Patricia Herrera',
        role: 'JURIDICO',
        rethus: 'TP 204918-CSJ',
        subjective: 'Solicitud de asesoría por violencia intrafamiliar y perturbación psicológica.',
        objective: 'Radicación de Medidas de Protección Ley 1257 ante Comisaría Chiquinquirá.',
        analysis: 'Vulnerabilidad jurídica que requiere medida cautelar urgente de protección.',
        plan: '1. Medida de Protección Prioritaria. 2. Alarma activa Patrulla Púrpura.',
        cie10Code: 'Z65.9',
      },
    ],
    legalProcedures: [
      {
        id: 'LEG-201',
        date: '2026-08-30',
        entity: 'Comisaría de Familia Chiquinquirá & Fiscalía Bolívar',
        procedureType: 'Solicitud Cautelar de Desalojo del Agresor Ley 1257',
        status: 'EN_MEDIDA',
        caseNumber: 'RAD-2026-9904',
        notes: 'Proceso activo de protección inmediata y solicitud de patrullaje policial.',
      },
    ],
    resourcesProvided: [
      {
        id: 'RES-201',
        date: '2026-08-30',
        resourceType: 'HOSPEDAJE_REFUGIO',
        description: 'Ingreso Temporal a Casa Refugio Violeta con Alojamiento Completo',
        quantity: 1,
        estimatedValueCop: 1200000,
        deliveredBy: 'Dra. Patricia Herrera',
      },
    ],
    prescriptions: [],
    routesActivated: [
      { routeName: 'Medida de Protección Ley 1257 de 2008', date: '2026-08-30', status: 'ACTIVADA', entity: 'Comisaría de Familia Chiquinquirá' },
    ],
    documents: [
      { name: 'Copia_Denuncia_Comisaria.pdf', date: '2026-08-30', category: 'Denuncia Legal' },
    ],
  },
];

const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'APT-101',
    patientId: 'EHR-001',
    patientName: 'María Alejandra Torres',
    patientCode: 'CSM-2026-000481',
    doctorName: 'Dra. Elena Ruiz',
    specialty: 'Ginecología & Obstetricia',
    date: '2026-09-05',
    time: '10:00 AM',
    modality: 'Presencial Sede Pie de la Popa',
    status: 'CONFIRMADA',
    notes: 'Control ginecológico y ecografía prenatal de seguimiento.',
  },
  {
    id: 'APT-102',
    patientId: 'EHR-002',
    patientName: 'Valeria Castro',
    patientCode: 'CSM-2026-000482',
    doctorName: 'Dra. Patricia Herrera',
    specialty: 'Asesoría Jurídica VBG (Ley 1257)',
    date: '2026-09-03',
    time: '09:00 AM',
    modality: 'Teleorientación Virtual',
    status: 'CONFIRMADA',
    notes: 'Revisión de medida de protección radicada ante Comisaría.',
  },
];

export default function AdminManagementPanel({ onOpenSOS }: { onOpenSOS?: () => void }) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>(INITIAL_PROFESSIONALS);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile>(INITIAL_PROFESSIONALS[0]);
  
  const [documentNumberInput, setDocumentNumberInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Data State
  const [patients, setPatients] = useState<PatientEHR[]>(INITIAL_PATIENTS_EHR);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS_EHR[0].id);

  // Admin Console Tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'profesionales' | 'beneficiarias' | 'citas' | 'clinica'>('dashboard');
  const [ehrTab, setEhrTab] = useState<'ipsc' | 'evoluciones' | 'juridico' | 'recursos' | 'rutas'>('ipsc');

  // Form State: Create Professional
  const [newProfName, setNewProfName] = useState('');
  const [newProfDocumentNumber, setNewProfDocumentNumber] = useState('');
  const [newProfDocumentType, setNewProfDocumentType] = useState('CC');
  const [newProfRole, setNewProfRole] = useState<ProfessionalRole>('MEDICO');
  const [newProfSpecialty, setNewProfSpecialty] = useState('');
  const [newProfRethus, setNewProfRethus] = useState('');
  const [newProfProfessionalCard, setNewProfProfessionalCard] = useState('');
  const [newProfEmail, setNewProfEmail] = useState('');
  const [newProfPassword, setNewProfPassword] = useState('');
  const [newProfPhone, setNewProfPhone] = useState('');
  const [newProfInstitution, setNewProfInstitution] = useState('');
  const [newProfOrganizationType, setNewProfOrganizationType] = useState('Independiente');
  const [newProfCity, setNewProfCity] = useState('Cartagena');
  const [newProfDepartment, setNewProfDepartment] = useState('Bolívar');
  const [newProfModalities, setNewProfModalities] = useState<string[]>(['Presencial']);
  const [newProfServices, setNewProfServices] = useState('');
  const [newProfAvailability, setNewProfAvailability] = useState('');
  const [newProfUrgentCases, setNewProfUrgentCases] = useState(false);
  const [newProfYearsExperience, setNewProfYearsExperience] = useState('');
  const [newProfBio, setNewProfBio] = useState('');
  const [newProfConsent, setNewProfConsent] = useState(false);
  const [profCreateSuccess, setProfCreateSuccess] = useState('');

  const specialtyOptions = PROFESSIONAL_SPECIALTIES[newProfRole];

  // Form State: Create Patient with Immediate Appointment
  const [newPatName, setNewPatName] = useState('');
  const [newPatDocId, setNewPatDocId] = useState('');
  const [newPatFirstName, setNewPatFirstName] = useState('');
  const [newPatLastName, setNewPatLastName] = useState('');
  const [newPatDocumentType, setNewPatDocumentType] = useState('CC');
  const [newPatDocumentNumber, setNewPatDocumentNumber] = useState('');
  const [newPatBirthDate, setNewPatBirthDate] = useState('1998-01-01');
  const [newPatAge, setNewPatAge] = useState(25);
  const [newPatPlaceOfBirth, setNewPatPlaceOfBirth] = useState('Cartagena');
  const [newPatNationality, setNewPatNationality] = useState('Colombiana');
  const [newPatSex, setNewPatSex] = useState('Femenino');
  const [newPatPreferredName, setNewPatPreferredName] = useState('');
  const [newPatPhone, setNewPatPhone] = useState('');
  const [newPatEmail, setNewPatEmail] = useState('');
  const [newPatDepartment, setNewPatDepartment] = useState('Bolívar');
  const [newPatMunicipality, setNewPatMunicipality] = useState('Cartagena');
  const [newPatNeighborhood, setNewPatNeighborhood] = useState('Olaya Herrera, Cartagena');
  const [newPatAddress, setNewPatAddress] = useState('');
  const [newPatZone, setNewPatZone] = useState('Urbana');
  const [newPatPreferredContact, setNewPatPreferredContact] = useState('WhatsApp');
  const [newPatSafeContact, setNewPatSafeContact] = useState('Sí');
  const [newPatMaritalStatus, setNewPatMaritalStatus] = useState('Soltera');
  const [newPatEducation, setNewPatEducation] = useState('Bachillerato');
  const [newPatOccupation, setNewPatOccupation] = useState('');
  const [newPatEmploymentStatus, setNewPatEmploymentStatus] = useState('Desempleada');
  const [newPatHousingType, setNewPatHousingType] = useState('Propia');
  const [newPatHouseholdMembers, setNewPatHouseholdMembers] = useState(3);
  const [newPatHasChildren, setNewPatHasChildren] = useState('No');
  const [newPatChildrenCount, setNewPatChildrenCount] = useState(0);
  const [newPatPeopleInCharge, setNewPatPeopleInCharge] = useState('No');
  const [newPatEps, setNewPatEps] = useState('Mutual Ser EPS-S');
  const [newPatHealthRegime, setNewPatHealthRegime] = useState('Contributivo');
  const [newPatDisability, setNewPatDisability] = useState('No');
  const [newPatDisabilityType, setNewPatDisabilityType] = useState('');
  const [newPatAccessibilitySupport, setNewPatAccessibilitySupport] = useState('No');
  const [newPatMotivations, setNewPatMotivations] = useState<string[]>([]);
  const [newPatRiskSituations, setNewPatRiskSituations] = useState<string[]>([]);
  const [newPatDigitalPhoneAccess, setNewPatDigitalPhoneAccess] = useState('Sí');
  const [newPatInternetAccess, setNewPatInternetAccess] = useState('Diario');
  const [newPatSafeCommunication, setNewPatSafeCommunication] = useState('Sí');
  const [newPatNotificationsDiscrete, setNewPatNotificationsDiscrete] = useState('Sí');
  const [newPatSource, setNewPatSource] = useState('Redes sociales');
  const [newPatConsentPersonal, setNewPatConsentPersonal] = useState(false);
  const [newPatConsentProgram, setNewPatConsentProgram] = useState(false);
  const [newPatConsentFollowUp, setNewPatConsentFollowUp] = useState(false);
  const [newPatConsentImpact, setNewPatConsentImpact] = useState(false);
  const [newPatConsentCommunications, setNewPatConsentCommunications] = useState(false);
  const [newPatCategory, setNewPatCategory] = useState<'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO'>('MEDICO');
  const [newPatDoctor, setNewPatDoctor] = useState('Dra. Elena Ruiz');
  const [scheduleImmediateAppointment, setScheduleImmediateAppointment] = useState(true);
  const [newPatAppDate, setNewPatAppDate] = useState('2026-09-08');
  const [newPatAppTime, setNewPatAppTime] = useState('10:00 AM');
  const [newPatAppModality, setNewPatAppModality] = useState<'Presencial Sede Pie de la Popa' | 'Teleorientación Virtual' | 'Visita Domiciliaria'>('Presencial Sede Pie de la Popa');
  const [patientCreateSuccess, setPatientCreateSuccess] = useState('');

  const toggleChecklist = <T extends string>(value: T, current: T[], setCurrent: React.Dispatch<React.SetStateAction<T[]>>) => {
    setCurrent((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  };

  // Form State: Assign Appointment
  const [newAppointmentBeneficiaryId, setNewAppointmentBeneficiaryId] = useState('');
  const [newAppointmentProfessionalId, setNewAppointmentProfessionalId] = useState('');
  const [newAppointmentDate, setNewAppointmentDate] = useState('2026-09-08');
  const [newAppointmentTime, setNewAppointmentTime] = useState('10:00 AM');
  const [newAppointmentModality, setNewAppointmentModality] = useState<'Presencial Sede Pie de la Popa' | 'Teleorientación Virtual' | 'Visita Domiciliaria'>('Presencial Sede Pie de la Popa');
  const [newAppointmentNotes, setNewAppointmentNotes] = useState('');
  const [appointmentCreateSuccess, setAppointmentCreateSuccess] = useState('');

  // Form State: Legal Procedure
  const [newLegalEntity, setNewLegalEntity] = useState('Comisaría de Familia Chiquinquirá');
  const [newLegalType, setNewLegalType] = useState('Medida de Protección Ley 1257/2008');
  const [newLegalCaseNum, setNewLegalCaseNum] = useState('');
  const [newLegalNotes, setNewLegalNotes] = useState('');
  const [legalSuccess, setLegalSuccess] = useState('');

  // Form State: Resource Provided
  const [newResType, setNewResType] = useState<'KIT_MATERNAL' | 'CAPITAL_SEMILLA' | 'HOSPEDAJE_REFUGIO' | 'SUBSIDIO_TRANSPORTE' | 'MERCADO_ALIMENTARIO' | 'ATENCION_ODONTOLOGICA'>('KIT_MATERNAL');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResQty, setNewResQty] = useState(1);
  const [newResValueCop, setNewResValueCop] = useState(250000);
  const [resourceSuccess, setResourceSuccess] = useState('');

  // Form State: SOAP Evolution
  const [newSoapSubjective, setNewSoapSubjective] = useState('');
  const [newSoapObjective, setNewSoapObjective] = useState('');
  const [newSoapAnalysis, setNewSoapAnalysis] = useState('');
  const [newSoapPlan, setNewSoapPlan] = useState('');

  // Carga inicial dinámica desde MongoDB
  useEffect(() => {
    const fetchMongoData = async () => {
      try {
        const [patRes, docRes] = await Promise.all([
          fetch('/api/admin/patients'),
          fetch('/api/admin/doctors'),
        ]);

        const patData = await patRes.json();
        const docData = await docRes.json();

        if (patData.success && patData.patients && patData.patients.length > 0) {
          setPatients(patData.patients);
          setSelectedPatientId(patData.patients[0].id);
        }

        if (docData.success && docData.doctors && docData.doctors.length > 0) {
          setProfessionals(docData.doctors);
        }
      } catch (err) {
        console.warn('Carga inicial MongoDB fallback activo:', err);
      }
    };

    fetchMongoData();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAuth = sessionStorage.getItem('senda_admin_auth') === 'true';
    const storedProfId = sessionStorage.getItem('senda_prof_id');

    if (isAuth) {
      setIsAdminAuth(true);
      if (storedProfId) {
        const prof = professionals.find((p) => p.id === storedProfId);
        if (prof) setSelectedProfessional(prof);
      }
    }
  }, [professionals]);

  // LOGIN POR CEDULA Y CONTRASENA
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNumber: documentNumberInput, password: passwordInput }),
      });
      const data = await res.json();

      if (data.success && data.professional) {
        setSelectedProfessional(data.professional);
        setIsAdminAuth(true);
        sessionStorage.setItem('senda_admin_auth', 'true');
        sessionStorage.setItem('senda_prof_id', data.professional.id);
        setAdminTab(data.professional.role === 'ADMIN_SISTEMA' ? 'dashboard' : 'clinica');
        return;
      } else {
        setLoginError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setLoginError('Error de conexión. Intente nuevamente.');
    }
  };

  const handleQuickDemoLogin = (prof: ProfessionalProfile) => {
    setSelectedProfessional(prof);
    setDocumentNumberInput(prof.documentNumber);
    setPasswordInput('senda2026');
    setIsAdminAuth(true);
    sessionStorage.setItem('senda_admin_auth', 'true');
    sessionStorage.setItem('senda_prof_id', prof.id);
    setAdminTab(prof.role === 'ADMIN_SISTEMA' ? 'dashboard' : 'clinica');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('senda_admin_auth');
    sessionStorage.removeItem('senda_prof_id');
  };

  // ACCIONES: CREAR PROFESIONAL CON CÓDIGO Y CONTRASEÑA
  const handleCreateProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName || !newProfDocumentNumber || !newProfSpecialty || !newProfPassword || !newProfConsent) {
      setProfCreateSuccess('Completa los campos obligatorios, incluida la especialidad profesional y la autorización de verificación.');
      return;
    }

    const generatedCode = `${newProfRole.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProf: ProfessionalProfile = {
      id: `PROF-${Date.now()}`,
      name: newProfName,
      documentType: newProfDocumentType,
      documentNumber: newProfDocumentNumber,
      role: newProfRole,
      roleTitle: `${newProfRole === 'MEDICO' ? 'Médico Especialista' : newProfRole === 'JURIDICO' ? 'Abogada Especialista' : newProfRole === 'TRABAJO_SOCIAL' ? 'Trabajadora Social' : 'Psicóloga Clínica'} en ${newProfSpecialty}`,
      specialty: newProfSpecialty,
      code: generatedCode,
      rethus: newProfRethus,
      professionalCard: newProfProfessionalCard,
      institutionName: newProfInstitution,
      organizationType: newProfOrganizationType,
      city: newProfCity,
      department: newProfDepartment,
      modalities: newProfModalities,
      services: newProfServices.split(',').map((service) => service.trim()).filter(Boolean),
      availability: newProfAvailability,
      urgentCases: newProfUrgentCases,
      yearsExperience: newProfYearsExperience,
      bio: newProfBio,
      consentsAccepted: newProfConsent,
      email: newProfEmail || `${newProfName.toLowerCase().replace(/\s+/g, '.')}@sendamujer.org`,
      phone: newProfPhone || '+57 300 000 0000',
      avatarBg: newProfRole === 'MEDICO' ? 'bg-emerald-600' : newProfRole === 'JURIDICO' ? 'bg-blue-600' : newProfRole === 'TRABAJO_SOCIAL' ? 'bg-purple-600' : 'bg-pink-600',
      badgeColor: newProfRole === 'MEDICO' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : newProfRole === 'JURIDICO' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-purple-100 text-purple-800 border-purple-300',
      status: 'ACTIVO',
    };

    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProf, password: newProfPassword }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No fue posible guardar el profesional.');
      }
      setProfessionals([...professionals, result.doctor || newProf]);
      setProfCreateSuccess(`¡Profesional ${newProfName} creado exitosamente con código ${generatedCode}! Ya puede ingresar con su documento y contraseña.`);
    } catch (err) {
      setProfCreateSuccess(err instanceof Error ? err.message : 'No fue posible guardar el profesional.');
      return;
    }

    setNewProfName('');
    setNewProfDocumentNumber('');
    setNewProfSpecialty('');
    setNewProfRethus('');
    setNewProfProfessionalCard('');
    setNewProfEmail('');
    setNewProfPassword('');
    setNewProfPhone('');
    setNewProfInstitution('');
    setNewProfServices('');
    setNewProfAvailability('');
    setNewProfYearsExperience('');
    setNewProfBio('');
    setNewProfConsent(false);
    setTimeout(() => setProfCreateSuccess(''), 5000);
  };

  // ACCIONES: REGISTRAR BENEFICIARIA CON CÓDIGO CSM Y CITA INMEDIATA
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const patientName = `${newPatFirstName} ${newPatLastName}`.trim();
    const docNumber = newPatDocumentNumber || newPatDocumentType;
    if (!patientName || !docNumber) return;

    const generatedCode = `CSM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPat: PatientEHR = {
      id: `EHR-${Date.now()}`,
      patientCode: generatedCode,
      patientName,
      firstName: newPatFirstName,
      lastName: newPatLastName,
      documentType: newPatDocumentType,
      documentNumber: newPatDocumentNumber,
      docId: docNumber,
      age: Number(newPatAge) || 25,
      birthDate: newPatBirthDate,
      bloodType: 'O+',
      eps: newPatEps,
      phone: newPatPhone || '+57 300 123 4567',
      email: newPatEmail || undefined,
      department: newPatDepartment,
      municipality: newPatMunicipality,
      neighborhood: newPatNeighborhood,
      address: newPatAddress,
      zone: newPatZone,
      preferredContact: newPatPreferredContact,
      safeContact: newPatSafeContact,
      educationLevel: newPatEducation,
      maritalStatus: newPatMaritalStatus,
      occupation: newPatOccupation,
      employmentStatus: newPatEmploymentStatus,
      housingType: newPatHousingType,
      householdMembers: newPatHouseholdMembers,
      hasChildren: newPatHasChildren === 'Sí',
      childrenCount: newPatChildrenCount,
      peopleInCharge: newPatPeopleInCharge,
      healthRegime: newPatHealthRegime,
      typeOfDisability: newPatDisability === 'Sí' ? newPatDisabilityType || 'No reportada' : 'No',
      disabilityType: newPatDisabilityType,
      accessibilitySupport: newPatAccessibilitySupport,
      motivation: newPatMotivations,
      riskSituations: newPatRiskSituations,
      digitalPhoneAccess: newPatDigitalPhoneAccess,
      internetAccess: newPatInternetAccess,
      safeCommunication: newPatSafeCommunication,
      notificationsDiscrete: newPatNotificationsDiscrete,
      participationSource: newPatSource,
      emergencyContact: 'Familiar Responsable',
      allergies: 'Ninguna reportada',
      riskLevel: 'BAJO',
      ipscScore: 65,
      dimensionsIPSC: { seguridadFisica: 6, seguridadDigital: 6, autonomiaEconomica: 6, redDeApoyo: 7, accesoAJusticia: 6, accesoASalud: 7, bienestarPsicosocial: 6, conocimientoDerechos: 7, capacidadRespuesta: 6, continuidadAcompanamiento: 7 },
      primaryCategory: newPatCategory,
      assignedDoctor: newPatDoctor,
      status: 'ACTIVA',
      vitals: { bloodPressure: '120/80 mmHg', heartRate: 72, weightKg: 60, heightM: 1.60, bmi: 23.4, tempC: 36.5 },
      consents: [
        { purpose: 'política de tratamiento de datos personales', grantedAt: new Date(), status: 'CONCEDIDO', version: '1.0' },
        { purpose: 'participar en Caribe Seguro para Mujeres', grantedAt: new Date(), status: 'CONCEDIDO', version: '1.0' },
        { purpose: 'seguimiento de participación', grantedAt: new Date(), status: newPatConsentFollowUp ? 'CONCEDIDO' : 'REVOCADO', version: '1.0' },
        { purpose: 'medición de impacto e investigación anónima', grantedAt: new Date(), status: newPatConsentImpact ? 'CONCEDIDO' : 'REVOCADO', version: '1.0' },
        { purpose: 'comunicaciones del programa', grantedAt: new Date(), status: newPatConsentCommunications ? 'CONCEDIDO' : 'REVOCADO', version: '1.0' },
      ].filter((consent) => consent.status === 'CONCEDIDO' || consent.purpose !== 'seguimiento de participación' || consent.status === 'REVOCADO'),
      evolutions: [
        {
          id: `EVO-INIT-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: '09:00 AM',
          author: selectedProfessional.name,
          role: selectedProfessional.role,
          rethus: selectedProfessional.rethus,
          subjective: 'Apertura oficial de expediente en la plataforma Senda Caribe Seguro.',
          objective: 'Caracterización sociofamiliar y registro de triaje de ingreso completado.',
          analysis: 'Beneficiaria asignada a seguimiento multidisciplinario con especialidad ' + newPatCategory,
          plan: 'Asignación inmediata a consulta inicial y seguimiento del plan de autoprotección.',
        },
      ],
      legalProcedures: [],
      resourcesProvided: [],
      prescriptions: [],
      routesActivated: [{ routeName: 'Apertura Expediente Caribe Seguro', date: new Date().toISOString().split('T')[0], status: 'COMPLETADA', entity: 'Fundación Senda Mujer' }],
      documents: [],
    };

    setPatients([newPat, ...patients]);
    setSelectedPatientId(newPat.id);

    if (scheduleImmediateAppointment) {
      const newApp: AppointmentRecord = {
        id: `APT-${Date.now()}`,
        patientId: newPat.id,
        patientName: newPat.patientName,
        patientCode: generatedCode,
        doctorName: newPatDoctor,
        specialty: newPatCategory,
        date: newPatAppDate,
        time: newPatAppTime,
        modality: newPatAppModality,
        status: 'CONFIRMADA',
        notes: 'Cita de ingreso inicial agendada de forma automática al registrar a la beneficiaria.',
      };
      setAppointments([newApp, ...appointments]);
    }

    setPatientCreateSuccess(`¡Beneficiaria ${patientName} registrada con Código Protegido ${generatedCode} y Cita Inicial Agendada!`);

    try {
      await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPat),
      });
      
      // Guardar credenciales de acceso al portal: usuario y contraseña = número de cédula
      await fetch('/api/beneficiary/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: newPat.id,
          documentNumber: newPatDocumentNumber,
          password: newPatDocumentNumber, // Contraseña = número de cédula
          patientName: newPat.patientName,
          patientCode: generatedCode,
        }),
      });
    } catch (err) {
      console.warn('Fallback local activo');
    }

    setNewPatFirstName('');
    setNewPatLastName('');
    setNewPatDocumentType('CC');
    setNewPatDocumentNumber('');
    setNewPatBirthDate('1998-01-01');
    setNewPatPhone('');
    setNewPatEmail('');
    setNewPatDepartment('Bolívar');
    setNewPatMunicipality('Cartagena');
    setNewPatNeighborhood('Olaya Herrera, Cartagena');
    setNewPatAddress('');
    setNewPatZone('Urbana');
    setNewPatPreferredContact('WhatsApp');
    setNewPatSafeContact('Sí');
    setNewPatMaritalStatus('Soltera');
    setNewPatEducation('Bachillerato');
    setNewPatOccupation('');
    setNewPatEmploymentStatus('Desempleada');
    setNewPatHousingType('Propia');
    setNewPatHouseholdMembers(3);
    setNewPatHasChildren('No');
    setNewPatChildrenCount(0);
    setNewPatPeopleInCharge('No');
    setNewPatEps('Mutual Ser EPS-S');
    setNewPatDisability('No');
    setNewPatDisabilityType('');
    setNewPatAccessibilitySupport('No');
    setNewPatMotivations([]);
    setNewPatRiskSituations([]);
    setNewPatDigitalPhoneAccess('Sí');
    setNewPatInternetAccess('Diario');
    setNewPatSafeCommunication('Sí');
    setNewPatNotificationsDiscrete('Sí');
    setNewPatSource('Redes sociales');
    setNewPatConsentPersonal(false);
    setNewPatConsentProgram(false);
    setNewPatConsentFollowUp(false);
    setNewPatConsentImpact(false);
    setNewPatConsentCommunications(false);
    setTimeout(() => setPatientCreateSuccess(''), 5000);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const beneficiary = patients.find((p) => p.id === newAppointmentBeneficiaryId);
    const professional = professionals.find((p) => p.id === newAppointmentProfessionalId);

    if (!beneficiary || !professional || !newAppointmentDate || !newAppointmentTime) {
      setAppointmentCreateSuccess('Debes seleccionar beneficiaria, profesional y datos de la cita.');
      return;
    }

    const appointmentPayload = {
      fullName: beneficiary.patientName,
      patientName: beneficiary.patientName,
      patientId: beneficiary.id,
      beneficiaryId: beneficiary.id,
      professionalName: professional.name,
      professionalId: professional.id,
      phone: beneficiary.phone,
      email: professional.email,
      specialty: professional.specialty,
      preferredDate: newAppointmentDate,
      preferredTime: newAppointmentTime,
      location: 'Sede Fundación Senda Mujer - Cartagena',
      modality: newAppointmentModality,
      notes: newAppointmentNotes || 'Cita programada desde el panel administrativo del rol ADMIN_SISTEMA.',
    };

    const nextAppointment: AppointmentRecord = {
      id: `APT-${Date.now()}`,
      patientId: beneficiary.id,
      patientName: beneficiary.patientName,
      patientCode: beneficiary.patientCode,
      doctorName: professional.name,
      specialty: professional.specialty,
      date: newAppointmentDate,
      time: newAppointmentTime,
      modality: newAppointmentModality,
      status: 'PROGRAMADA',
      notes: appointmentPayload.notes,
    };

    setAppointments((prev) => [nextAppointment, ...prev]);
    setAppointmentCreateSuccess(`Cita programada para ${beneficiary.patientName} con ${professional.name}.`);

    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentPayload),
      });
    } catch (err) {
      console.warn('Fallback local de cita:', err);
    }

    setNewAppointmentBeneficiaryId('');
    setNewAppointmentProfessionalId('');
    setNewAppointmentDate('2026-09-08');
    setNewAppointmentTime('10:00 AM');
    setNewAppointmentModality('Presencial Sede Pie de la Popa');
    setNewAppointmentNotes('');
    setTimeout(() => setAppointmentCreateSuccess(''), 5000);
  };

  // RADICAR TRÁMITE JURÍDICO (LEY 1257, COMISARÍA, FISCALÍA)
  const handleAddLegalProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLegalNotes) return;

    const newProcedure: LegalProcedureItem = {
      id: `LEG-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      entity: newLegalEntity,
      procedureType: newLegalType,
      status: 'RADICADO',
      caseNumber: newLegalCaseNum || `RAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: newLegalNotes,
    };

    const updated = patients.map((p) =>
      p.id === selectedPatientId
        ? { ...p, legalProcedures: [newProcedure, ...(p.legalProcedures || [])] }
        : p
    );
    setPatients(updated);
    setLegalSuccess('¡Trámite Legal radicado y archivado exitosamente en el expediente!');

    try {
      await fetch(`/api/admin/patients/${selectedPatientId}/legal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProcedure),
      });
    } catch (err) {
      console.warn('Fallback local activo');
    }

    setNewLegalNotes('');
    setNewLegalCaseNum('');
    setTimeout(() => setLegalSuccess(''), 4000);
  };

  // ARCHIVAR RECURSO / AYUDA PRESTADA
  const handleAddResourceProvided = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResDesc) return;

    const newResource: ResourceProvidedItem = {
      id: `RES-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      resourceType: newResType,
      description: newResDesc,
      quantity: Number(newResQty) || 1,
      estimatedValueCop: Number(newResValueCop) || 0,
      deliveredBy: selectedProfessional.name,
    };

    const updated = patients.map((p) =>
      p.id === selectedPatientId
        ? { ...p, resourcesProvided: [newResource, ...(p.resourcesProvided || [])] }
        : p
    );
    setPatients(updated);
    setResourceSuccess('¡Recurso / Ayuda registrada y archivada en la historia clínica!');
    setNewResDesc('');
    setTimeout(() => setResourceSuccess(''), 4000);
  };

  // EVOLUCIÓN SOAP
  const handleAddSoapEvolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSoapSubjective || !newSoapAnalysis || !newSoapPlan) return;

    const newEvo: ClinicalEvolutionNote = {
      id: `EVO-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      author: selectedProfessional.name,
      role: selectedProfessional.role,
      rethus: selectedProfessional.rethus,
      subjective: newSoapSubjective,
      objective: newSoapObjective || 'Examen físico y parámetros estables.',
      analysis: newSoapAnalysis,
      plan: newSoapPlan,
    };

    const updated = patients.map((p) => (p.id === selectedPatientId ? { ...p, evolutions: [newEvo, ...p.evolutions] } : p));
    setPatients(updated);

    try {
      await fetch(`/api/admin/patients/${selectedPatientId}/evolutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvo),
      });
    } catch (err) {
      console.warn('Fallback local activo');
    }

    setNewSoapSubjective('');
    setNewSoapObjective('');
    setNewSoapAnalysis('');
    setNewSoapPlan('');
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const isAdminRole = selectedProfessional.role === 'ADMIN_SISTEMA' || selectedProfessional.role === 'COORDINADOR';

  return (
    <div className="min-h-screen bg-[#0F0218] text-slate-100 font-sans selection:bg-[#E12880] selection:text-white">
      {!isAdminAuth ? (
        /* PANTALLA DE INICIO DE SESIÓN POR CEDULA */
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F0218] via-[#1A042B] to-[#31084A]">
          <div className="max-w-md w-full bg-white/95 text-slate-900 rounded-3xl p-8 shadow-2xl border border-pink-500/30 backdrop-blur-xl space-y-6 animate-fadeIn">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E12880] to-[#52166F] rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-black text-[#52166F]">Consola Ejecutiva & EHR</h1>
              <p className="text-xs text-slate-500 font-semibold">
                Fundación Senda Mujer • Sistema Operativo Social Caribe Seguro
              </p>
            </div>

            {/* ACCESO POR CEDULA Y CONTRASENA */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Número de cédula *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={documentNumberInput}
                  onChange={(e) => setDocumentNumberInput(e.target.value)}
                  placeholder="1000000001"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#E12880] focus:outline-none bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Contraseña de Seguridad *
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#E12880] focus:outline-none bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black py-3.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                Ingresar a la Consola Médica & EHR
              </button>
            </form>

            {/* BOTÓN DEMO RÁPIDO DISCRETO */}
            <div className="border-t border-slate-200 pt-4 text-center space-y-2">
              <button
                onClick={() => handleQuickDemoLogin(professionals[0])}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] rounded-xl transition-colors cursor-pointer"
              >
                ⚡ Acceso Demostración SuperAdmin (1 Clic)
              </button>
              <span className="text-[10px] text-slate-400 block font-bold">
                🔒 Ley 1581 de 2012 • Sesión aislada y cifrada en MongoDB Atlas.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* CONSOLA PRINCIPAL ADMINISTRATIVA Y EXPEDIENTE EHR */
        <div className="flex flex-col min-h-screen">
          
          {/* HEADER TOPBAR EJECUTIVO */}
          <header className="bg-[#140320] border-b border-pink-500/20 px-6 py-3 sticky top-0 z-40 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E12880] to-amber-400 flex items-center justify-center text-white font-black shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                  <span>Fundación Senda Mujer • Consola Ejecutiva</span>
                  <span className="text-[9px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase font-bold">
                    {selectedProfessional.role}
                  </span>
                  <span className="hidden sm:inline text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    <Database className="w-3 h-3 inline mr-1" />
                    MongoDB Conectado
                  </span>
                </h1>
                <p className="text-[10px] text-pink-200/70">
                  Cartagena, Colombia | Gestión Multidisciplinaria de Médicos, Citas y Pacientes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 bg-[#240538] border border-pink-500/30 px-4 py-2 rounded-2xl">
                <div className={`w-8 h-8 rounded-xl ${selectedProfessional.avatarBg} text-white flex items-center justify-center font-extrabold text-xs shadow-xs`}>
                  {selectedProfessional.role[0]}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white">{selectedProfessional.name}</div>
                  <div className="text-[10px] text-amber-300 font-mono">{selectedProfessional.rethus}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </header>

          {/* NAVEGACIÓN PRINCIPAL */}
          <nav className="bg-[#1C052B] border-b border-pink-500/20 px-6 py-2 flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 Panel Ejecutivo KPI', icon: BarChart3 },
              { id: 'profesionales', label: '🩺 Crear & Gestionar Médicos', icon: UserPlus },
              { id: 'beneficiarias', label: '👥 Registro de Beneficiaria', icon: UserCog },
              { id: 'citas', label: '📅 Asignar Cita', icon: CalendarPlus },
              { id: 'clinica', label: '🩺 Expediente EHR & Módulo Jurídico', icon: Activity },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = adminTab === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setAdminTab(t.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-md'
                      : 'bg-[#140320] text-slate-300 hover:bg-[#2B0642] border border-pink-500/20'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-300" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          <main className="flex-1 bg-[#1A042B] p-6 overflow-y-auto space-y-6">
            
            {/* DASHBOARD EJECUTIVO */}
            {adminTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      CONSOLA DE CONTROL GENERAL — FUNDACIÓN SENDA MUJER
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">Bienvenida, {selectedProfessional.name}</h2>
                  <p className="text-xs text-pink-100 max-w-2xl leading-relaxed">
                    Desde este panel gestionas al equipo médico y profesional, registras nuevas beneficiarias asignándoles su Código Protegido CSM y cita inmediata, y monitoreas los trámites jurídicos bajo Ley 1257 en MongoDB.
                  </p>
                </div>

                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4">
                  <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-300" />
                    Pacientes Registradas en Sistema ({patients.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {patients.map((p) => (
                      <div key={p.id} className="p-3.5 bg-[#140320] rounded-2xl border border-pink-500/20 space-y-1">
                        <div className="flex justify-between font-black text-xs text-white">
                          <span>{p.patientName}</span>
                          <span className="text-amber-300 font-mono text-[10px]">{p.patientCode}</span>
                        </div>
                        <p className="text-[10px] text-pink-200/80">C.C. {p.docId} • {p.neighborhood}</p>
                        <div className="flex justify-between items-center text-[10px] pt-1">
                          <span className="text-emerald-300 font-bold">IPSC: {p.ipscScore}/100</span>
                          <button
                            onClick={() => {
                              setSelectedPatientId(p.id);
                              setAdminTab('clinica');
                              setEhrTab('juridico');
                            }}
                            className="bg-[#E12880] text-white px-2.5 py-0.5 rounded-full font-bold cursor-pointer hover:bg-pink-600"
                          >
                            Ver Expediente & Jurídico
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREACIÓN & GESTIÓN DE MÉDICOS Y PROFESIONALES */}
            {adminTab === 'profesionales' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-300" />
                    Crear Nueva Cuenta de Médico / Profesional (Con Código & Contraseña)
                  </h3>

                  {profCreateSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                      {profCreateSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateProfessional} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Nombre completo *</label>
                        <input
                          type="text"
                          value={newProfName}
                          onChange={(e) => setNewProfName(e.target.value)}
                          placeholder="Ej: Dr. Camilo Vargas"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de documento *</label>
                        <select
                          value={newProfDocumentType}
                          onChange={(e) => setNewProfDocumentType(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="CC">Cédula de ciudadanía</option>
                          <option value="CE">Cédula de extranjería</option>
                          <option value="PA">Pasaporte</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Número de documento *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={newProfDocumentNumber}
                          onChange={(e) => setNewProfDocumentNumber(e.target.value)}
                          placeholder="Ej: 1047892411"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Rol & Disciplina *</label>
                        <select
                          value={newProfRole}
                          onChange={(e) => {
                            const role = e.target.value as ProfessionalRole;
                            setNewProfRole(role);
                            setNewProfSpecialty(PROFESSIONAL_SPECIALTIES[role][0]);
                          }}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="MEDICO">🩺 Médico (Ginecología / Med. General / Odontología)</option>
                          <option value="JURIDICO">⚖️ Abogada VBG (Ley 1257 de 2008)</option>
                          <option value="TRABAJO_SOCIAL">🏡 Trabajadora Social (Territorio)</option>
                          <option value="PSICOLOGO">🧠 Psicóloga Clínica (Salud Mental)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Especialidad profesional *</label>
                        <select
                          value={newProfSpecialty}
                          onChange={(e) => setNewProfSpecialty(e.target.value)}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="">Selecciona una especialidad</option>
                          {specialtyOptions.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Registro RETHUS</label>
                        <input
                          type="text"
                          value={newProfRethus}
                          onChange={(e) => setNewProfRethus(e.target.value)}
                          placeholder="Ej: RETHUS 554901-BOL"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tarjeta profesional</label>
                        <input
                          type="text"
                          value={newProfProfessionalCard}
                          onChange={(e) => setNewProfProfessionalCard(e.target.value)}
                          placeholder="Ej: TP 204918"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Correo Institucional *</label>
                        <input
                          type="email"
                          value={newProfEmail}
                          onChange={(e) => setNewProfEmail(e.target.value)}
                          placeholder="camilo.vargas@sendamujer.org"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Contraseña *</label>
                        <input
                          type="password"
                          value={newProfPassword}
                          onChange={(e) => setNewProfPassword(e.target.value)}
                          placeholder="Crea una contraseña segura"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Teléfono profesional</label>
                        <input type="tel" value={newProfPhone} onChange={(e) => setNewProfPhone(e.target.value)} placeholder="+57 300 000 0000" className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white" />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Institución / organización</label>
                        <input type="text" value={newProfInstitution} onChange={(e) => setNewProfInstitution(e.target.value)} placeholder="IPS, clínica, fundación o independiente" className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white" />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de organización</label>
                        <select value={newProfOrganizationType} onChange={(e) => setNewProfOrganizationType(e.target.value)} className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold">
                          <option>Independiente</option><option>IPS</option><option>Hospital</option><option>Clínica</option><option>Fundación</option><option>Universidad</option><option>Entidad pública</option><option>ONG</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Ciudad / departamento</label>
                        <input type="text" value={`${newProfCity}, ${newProfDepartment}`} onChange={(e) => { const [city, ...department] = e.target.value.split(','); setNewProfCity(city.trim()); setNewProfDepartment(department.join(',').trim()); }} placeholder="Cartagena, Bolívar" className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-2">Modalidad de atención</label>
                        <div className="flex flex-wrap gap-3">
                          {['Presencial', 'Virtual', 'Domiciliaria', 'Telefónica'].map((modality) => (
                            <label key={modality} className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={newProfModalities.includes(modality)} onChange={() => toggleChecklist(modality, newProfModalities, setNewProfModalities)} />{modality}</label>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Servicios que presta</label>
                        <input type="text" value={newProfServices} onChange={(e) => setNewProfServices(e.target.value)} placeholder="Medicina general, SSR, orientación médica (separados por coma)" className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white" />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Disponibilidad</label>
                        <input type="text" value={newProfAvailability} onChange={(e) => setNewProfAvailability(e.target.value)} placeholder="Lun-Vie, 8:00-17:00" className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white" />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Experiencia</label>
                        <select value={newProfYearsExperience} onChange={(e) => setNewProfYearsExperience(e.target.value)} className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"><option value="">Seleccionar años</option><option>&lt; 1 año</option><option>1-3 años</option><option>4-6 años</option><option>7-10 años</option><option>10+ años</option></select>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-pink-500/20 pt-4">
                      <label className="flex items-start gap-2 text-xs text-pink-100"><input type="checkbox" checked={newProfUrgentCases} onChange={(e) => setNewProfUrgentCases(e.target.checked)} className="mt-0.5" />Disponible para casos prioritarios.</label>
                      <textarea value={newProfBio} onChange={(e) => setNewProfBio(e.target.value.slice(0, 500))} maxLength={500} placeholder="Perfil profesional público (máximo 500 caracteres)" className="w-full min-h-20 p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white" />
                      <label className="flex items-start gap-2 text-xs text-pink-100"><input type="checkbox" checked={newProfConsent} onChange={(e) => setNewProfConsent(e.target.checked)} required className="mt-0.5" />Autorizo a SENDA a verificar mis credenciales profesionales y acepto su política de privacidad, confidencialidad y código de conducta.</label>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Crear Cuenta, Asignar Código & Guardar en MongoDB</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Directorio de Médicos & Profesionales Registrados ({professionals.length})
                  </h3>
                  <div className="space-y-3">
                    {professionals.map((prof) => (
                      <div key={prof.id} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${prof.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                            {prof.role[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm text-white">{prof.name}</h4>
                              <span className="text-[10px] font-mono text-amber-300 font-extrabold">{prof.code}</span>
                              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${prof.badgeColor}`}>
                                {prof.role}
                              </span>
                            </div>
                            <p className="text-xs text-pink-200/80">{prof.roleTitle} • {prof.rethus}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{prof.documentType} {prof.documentNumber} • {prof.email}</p>
                            <p className="text-[10px] text-amber-300/80 font-semibold">Verificación: {prof.verificationStatus || 'PENDIENTE'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREACIÓN DE BENEFICIARIA CON CÓDIGO CSM & CITA INMEDIATA */}
            {adminTab === 'beneficiarias' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-[#E12880]" />
                    Registrar Nueva Beneficiaria & Asignar Cita Inicial Simultánea
                  </h3>

                  {patientCreateSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                      {patientCreateSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreatePatient} className="space-y-5">
                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque A — Identificación</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Primer nombre *</label>
                          <input value={newPatFirstName} onChange={(e) => setNewPatFirstName(e.target.value)} placeholder="Ej: Diana" required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Primer apellido *</label>
                          <input value={newPatLastName} onChange={(e) => setNewPatLastName(e.target.value)} placeholder="Ej: Gómez" required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de documento *</label>
                          <select value={newPatDocumentType} onChange={(e) => setNewPatDocumentType(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="CC">CC</option>
                            <option value="TI">TI</option>
                            <option value="CE">CE</option>
                            <option value="PP">PP</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Número de documento *</label>
                          <input value={newPatDocumentNumber} onChange={(e) => setNewPatDocumentNumber(e.target.value)} placeholder="Ej: 1.048.223.109" required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-mono" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Fecha de nacimiento *</label>
                          <input type="date" value={newPatBirthDate} onChange={(e) => setNewPatBirthDate(e.target.value)} required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Edad</label>
                          <input type="number" value={newPatAge} onChange={(e) => setNewPatAge(Number(e.target.value) || 0)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Lugar de nacimiento</label>
                          <input value={newPatPlaceOfBirth} onChange={(e) => setNewPatPlaceOfBirth(e.target.value)} placeholder="Cartagena" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Nacionalidad</label>
                          <input value={newPatNationality} onChange={(e) => setNewPatNationality(e.target.value)} placeholder="Colombiana" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Sexo registrado al nacer</label>
                          <select value={newPatSex} onChange={(e) => setNewPatSex(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Otro">Otro</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Nombre preferido</label>
                          <input value={newPatPreferredName} onChange={(e) => setNewPatPreferredName(e.target.value)} placeholder="Ej: Diana" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque B — Contacto y ubicación</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Celular *</label>
                          <input value={newPatPhone} onChange={(e) => setNewPatPhone(e.target.value)} placeholder="+57 318 765 4321" required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Correo electrónico</label>
                          <input type="email" value={newPatEmail} onChange={(e) => setNewPatEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Departamento *</label>
                          <input value={newPatDepartment} onChange={(e) => setNewPatDepartment(e.target.value)} placeholder="Bolívar" required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Municipio / ciudad *</label>
                          <input value={newPatMunicipality} onChange={(e) => setNewPatMunicipality(e.target.value)} placeholder="Cartagena" required className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Barrio / localidad</label>
                          <input value={newPatNeighborhood} onChange={(e) => setNewPatNeighborhood(e.target.value)} placeholder="Olaya Herrera" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Dirección</label>
                          <input value={newPatAddress} onChange={(e) => setNewPatAddress(e.target.value)} placeholder="Calle 20 # 12-34" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Zona</label>
                          <select value={newPatZone} onChange={(e) => setNewPatZone(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Urbana">Urbana</option>
                            <option value="Rural">Rural</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Medio preferido de contacto</label>
                          <select value={newPatPreferredContact} onChange={(e) => setNewPatPreferredContact(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Llamada">Llamada</option>
                            <option value="SMS">SMS</option>
                            <option value="Correo">Correo</option>
                            <option value="Plataforma">Plataforma</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Es seguro este medio?</label>
                          <select value={newPatSafeContact} onChange={(e) => setNewPatSafeContact(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                            <option value="Solo determinados horarios">Solo determinados horarios</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque C — Caracterización socioeconómica</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Estado civil</label>
                          <select value={newPatMaritalStatus} onChange={(e) => setNewPatMaritalStatus(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Soltera">Soltera</option>
                            <option value="Casada">Casada</option>
                            <option value="Unión marital de hecho">Unión marital de hecho</option>
                            <option value="Separada">Separada</option>
                            <option value="Divorciada">Divorciada</option>
                            <option value="Viuda">Viuda</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Nivel académico</label>
                          <select value={newPatEducation} onChange={(e) => setNewPatEducation(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sin escolaridad">Sin escolaridad</option>
                            <option value="Primaria">Primaria</option>
                            <option value="Bachillerato">Bachillerato</option>
                            <option value="Técnico">Técnico</option>
                            <option value="Tecnólogo">Tecnólogo</option>
                            <option value="Universidad">Universidad</option>
                            <option value="Posgrado">Posgrado</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Ocupación</label>
                          <input value={newPatOccupation} onChange={(e) => setNewPatOccupation(e.target.value)} placeholder="Ej: Empleada" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Situación laboral</label>
                          <select value={newPatEmploymentStatus} onChange={(e) => setNewPatEmploymentStatus(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Empleada">Empleada</option>
                            <option value="Independiente">Independiente</option>
                            <option value="Empresaria">Empresaria</option>
                            <option value="Desempleada">Desempleada</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Trabajo doméstico / no remunerado">Trabajo doméstico / no remunerado</option>
                            <option value="Pensionada">Pensionada</option>
                            <option value="Otra">Otra</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de vivienda</label>
                          <select value={newPatHousingType} onChange={(e) => setNewPatHousingType(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Propia">Propia</option>
                            <option value="Arrendada">Arrendada</option>
                            <option value="Familia">Familia</option>
                            <option value="Alquiler temporal">Alquiler temporal</option>
                            <option value="Otra">Otra</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Número de personas en el hogar</label>
                          <input type="number" value={newPatHouseholdMembers} onChange={(e) => setNewPatHouseholdMembers(Number(e.target.value) || 0)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Tiene hijos/as?</label>
                          <select value={newPatHasChildren} onChange={(e) => setNewPatHasChildren(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Número de hijos/as</label>
                          <input type="number" value={newPatChildrenCount} onChange={(e) => setNewPatChildrenCount(Number(e.target.value) || 0)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Tiene personas a cargo?</label>
                          <select value={newPatPeopleInCharge} onChange={(e) => setNewPatPeopleInCharge(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque D — Salud y aseguramiento</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Régimen de salud</label>
                          <select value={newPatHealthRegime} onChange={(e) => setNewPatHealthRegime(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Contributivo">Contributivo</option>
                            <option value="Subsidiado">Subsidiado</option>
                            <option value="Especial">Especial</option>
                            <option value="No afiliada">No afiliada</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">EPS</label>
                          <input value={newPatEps} onChange={(e) => setNewPatEps(e.target.value)} placeholder="Mutual Ser EPS-S" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Tiene discapacidad?</label>
                          <select value={newPatDisability} onChange={(e) => setNewPatDisability(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de discapacidad</label>
                          <input value={newPatDisabilityType} onChange={(e) => setNewPatDisabilityType(e.target.value)} placeholder="Ej: Auditiva" className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Requiere apoyo para la plataforma?</label>
                          <select value={newPatAccessibilitySupport} onChange={(e) => setNewPatAccessibilitySupport(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                            <option value="Prefiero no responder">Prefiero no responder</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque F — Acceso y necesidades</h4>
                      <div className="space-y-3">
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Qué te motivó a vincularte?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-white">
                          {[
                            'Quiero fortalecer mi seguridad',
                            'Quiero conocer mis derechos',
                            'Quiero acceder a formación',
                            'Quiero fortalecer mi autonomía',
                            'Necesito orientación',
                            'Necesito acompañamiento',
                            'Quiero mejorar mi seguridad digital',
                            'Quiero fortalecer mi red de apoyo',
                            'Quiero participar en mi comunidad',
                            'Otro',
                          ].map((motivation) => (
                            <label key={motivation} className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-2 py-2">
                              <input type="checkbox" checked={newPatMotivations.includes(motivation)} onChange={() => toggleChecklist(motivation, newPatMotivations, setNewPatMotivations)} className="accent-[#E12880]" />
                              <span>{motivation}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque G — Situaciones de riesgo o necesidad</h4>
                      <div className="space-y-3">
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Hay alguna situación sobre la que quisieras recibir orientación?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-white">
                          {[
                            'Seguridad personal',
                            'Violencia basada en género',
                            'Violencia intrafamiliar',
                            'Violencia sexual',
                            'Violencia económica',
                            'Violencia psicológica',
                            'Violencia digital',
                            'Orientación jurídica',
                            'Salud',
                            'Embarazo y maternidad',
                            'Derechos',
                            'Acceso a servicios',
                            'Otra',
                            'Prefiero no responder',
                          ].map((riskOption) => (
                            <label key={riskOption} className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-2 py-2">
                              <input type="checkbox" checked={newPatRiskSituations.includes(riskOption)} onChange={() => toggleChecklist(riskOption, newPatRiskSituations, setNewPatRiskSituations)} className="accent-[#E12880]" />
                              <span>{riskOption}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque H — Seguridad digital</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Tienes acceso personal a un teléfono?</label>
                          <select value={newPatDigitalPhoneAccess} onChange={(e) => setNewPatDigitalPhoneAccess(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                            <option value="Compartido">Compartido</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Tienes acceso a internet?</label>
                          <select value={newPatInternetAccess} onChange={(e) => setNewPatInternetAccess(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Diario">Diario</option>
                            <option value="Algunas veces">Algunas veces</option>
                            <option value="Muy limitado">Muy limitado</option>
                            <option value="No tengo acceso">No tengo acceso</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Es seguro recibir comunicaciones?</label>
                          <select value={newPatSafeCommunication} onChange={(e) => setNewPatSafeCommunication(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                            <option value="Depende del momento">Depende del momento</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Prefieres notificaciones discretas?</label>
                          <select value={newPatNotificationsDiscrete} onChange={(e) => setNewPatNotificationsDiscrete(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque I — Participación</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">¿Cómo conociste Caribe Seguro?</label>
                          <select value={newPatSource} onChange={(e) => setNewPatSource(e.target.value)} className="w-full p-3 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                            <option value="Redes sociales">Redes sociales</option>
                            <option value="Fundación Senda Mujer">Fundación Senda Mujer</option>
                            <option value="Profesional">Profesional</option>
                            <option value="Organización aliada">Organización aliada</option>
                            <option value="Institución educativa">Institución educativa</option>
                            <option value="Evento">Evento</option>
                            <option value="Recomendación">Recomendación</option>
                            <option value="Internet">Internet</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-pink-500/20 bg-[#140320] p-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Bloque J — Consentimientos</h4>
                      <div className="space-y-2 text-xs text-white">
                        <label className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-3 py-2"><input type="checkbox" checked={newPatConsentPersonal} onChange={(e) => setNewPatConsentPersonal(e.target.checked)} className="accent-[#E12880]" /> He leído y acepto la política de tratamiento de datos personales.</label>
                        <label className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-3 py-2"><input type="checkbox" checked={newPatConsentProgram} onChange={(e) => setNewPatConsentProgram(e.target.checked)} className="accent-[#E12880]" /> Autorizo el tratamiento de mis datos para participar en Caribe Seguro para Mujeres.</label>
                        <label className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-3 py-2"><input type="checkbox" checked={newPatConsentFollowUp} onChange={(e) => setNewPatConsentFollowUp(e.target.checked)} className="accent-[#E12880]" /> Autorizo el uso de mis datos para realizar seguimiento de mi participación.</label>
                        <label className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-3 py-2"><input type="checkbox" checked={newPatConsentImpact} onChange={(e) => setNewPatConsentImpact(e.target.checked)} className="accent-[#E12880]" /> Autorizo el uso de información anonimizada y agregada para medición de impacto, investigación y estadísticas.</label>
                        <label className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-[#240538] px-3 py-2"><input type="checkbox" checked={newPatConsentCommunications} onChange={(e) => setNewPatConsentCommunications(e.target.checked)} className="accent-[#E12880]" /> Deseo recibir comunicaciones sobre actividades, formación y servicios de Caribe Seguro.</label>
                      </div>
                    </div>

                    <div className="bg-[#140320] p-4 rounded-2xl border border-pink-500/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="schedApp" checked={scheduleImmediateAppointment} onChange={(e) => setScheduleImmediateAppointment(e.target.checked)} className="w-4 h-4 accent-[#E12880]" />
                        <label htmlFor="schedApp" className="text-xs font-black text-amber-300 cursor-pointer">📅 Agendar Cita Inicial Inmediata al Guardar Beneficiaria</label>
                      </div>

                      {scheduleImmediateAppointment && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          <div>
                            <label className="block text-[10px] font-extrabold text-slate-300 mb-1">Fecha de la Cita</label>
                            <input type="date" value={newPatAppDate} onChange={(e) => setNewPatAppDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-extrabold text-slate-300 mb-1">Hora de la Cita</label>
                            <input type="text" value={newPatAppTime} onChange={(e) => setNewPatAppTime(e.target.value)} placeholder="10:00 AM" className="w-full p-2.5 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-extrabold text-slate-300 mb-1">Modalidad</label>
                            <select value={newPatAppModality} onChange={(e) => setNewPatAppModality(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white font-bold">
                              <option value="Presencial Sede Pie de la Popa">Presencial Sede Pie de la Popa</option>
                              <option value="Teleorientación Virtual">Teleorientación Virtual</option>
                              <option value="Visita Domiciliaria">Visita Domiciliaria</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2">
                        <UserCog className="w-4 h-4" />
                        <span>Generar Código Protegido CSM, Registrar & Agendar Cita</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ASIGNACIÓN DE CITA CON BENEFICIARIA Y PROFESIONAL */}
            {adminTab === 'citas' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-amber-300" />
                    Asignar Cita a Beneficiaria con Profesional
                  </h3>

                  {appointmentCreateSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                      {appointmentCreateSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateAppointment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Beneficiaria *</label>
                        <select
                          value={newAppointmentBeneficiaryId}
                          onChange={(e) => setNewAppointmentBeneficiaryId(e.target.value)}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="">Selecciona una beneficiaria</option>
                          {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                              {patient.patientName} • {patient.patientCode}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Profesional *</label>
                        <select
                          value={newAppointmentProfessionalId}
                          onChange={(e) => setNewAppointmentProfessionalId(e.target.value)}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="">Selecciona un profesional</option>
                          {professionals.map((professional) => (
                            <option key={professional.id} value={professional.id}>
                              {professional.name} • {professional.specialty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Fecha *</label>
                        <input
                          type="date"
                          value={newAppointmentDate}
                          onChange={(e) => setNewAppointmentDate(e.target.value)}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Hora *</label>
                        <input
                          type="text"
                          value={newAppointmentTime}
                          onChange={(e) => setNewAppointmentTime(e.target.value)}
                          placeholder="10:00 AM"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Modalidad</label>
                        <select
                          value={newAppointmentModality}
                          onChange={(e) => setNewAppointmentModality(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="Presencial Sede Pie de la Popa">Presencial Sede Pie de la Popa</option>
                          <option value="Teleorientación Virtual">Teleorientación Virtual</option>
                          <option value="Visita Domiciliaria">Visita Domiciliaria</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Notas de la cita</label>
                      <textarea
                        value={newAppointmentNotes}
                        onChange={(e) => setNewAppointmentNotes(e.target.value)}
                        rows={3}
                        placeholder="Cita de ingreso, seguimiento, orientación jurídica, etc."
                        className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>Guardar Cita y Vincular Beneficiaria + Profesional</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Calendario de Citas Programadas ({appointments.length})
                  </h3>
                  <div className="space-y-3">
                    {appointments.map((appt) => (
                      <div key={appt.id} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex flex-col md:flex-row justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-sm text-white">{appt.patientName}</h4>
                            <span className="text-[10px] font-mono text-amber-300">{appt.patientCode}</span>
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-xs text-pink-200/80 mt-1">{appt.doctorName} • {appt.specialty}</p>
                          <p className="text-[11px] text-slate-300 mt-1">{appt.date} • {appt.time} • {appt.modality}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400">Notas</p>
                          <p className="text-xs text-slate-200 max-w-xs">{appt.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EXPEDIENTE EHR & MÓDULO JURÍDICO Y RECURSOS */}
            {adminTab === 'clinica' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-r from-[#2B0642] via-[#3B0852] to-[#1A042B] rounded-3xl p-6 border border-pink-500/30 shadow-2xl space-y-6">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-pink-500/20 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E12880] to-purple-800 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/20">
                        {selectedPatient.patientName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                            {selectedPatient.patientCode}
                          </span>
                          <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase">
                            {selectedPatient.status}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white mt-1">{selectedPatient.patientName}</h2>
                        <p className="text-xs text-pink-200/80">
                          C.C. {selectedPatient.docId} • {selectedPatient.age} años • Barrio: <strong className="text-white">{selectedPatient.neighborhood}</strong> • EPS: <strong className="text-white">{selectedPatient.eps}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-extrabold text-pink-300 uppercase tracking-widest">ÍNDICE DE PROTECCIÓN IPSC</span>
                      <div className="text-3xl font-black text-amber-300">{selectedPatient.ipscScore}<span className="text-sm text-pink-200">/100</span></div>
                    </div>
                  </div>
                </div>

                {/* SUBTABS EHR */}
                <div className="flex space-x-2 border-b border-pink-500/20 pb-2 overflow-x-auto">
                  {[
                    { id: 'ipsc', label: '📊 Índice IPSC (10D)', icon: Shield },
                    { id: 'juridico', label: '⚖️ Módulo Jurídico & Ley 1257', icon: Gavel },
                    { id: 'recursos', label: '📦 Ayudas & Recursos Entregados', icon: PackageCheck },
                    { id: 'evoluciones', label: '🩺 Evoluciones Clínicas (SOAP)', icon: Activity },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isActive = ehrTab === t.id;

                    return (
                      <button
                        key={t.id}
                        onClick={() => setEhrTab(t.id as any)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-md'
                            : 'bg-[#240538] text-slate-300 hover:bg-[#31084A] border border-pink-500/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* PESTAÑA MÓDULO JURÍDICO LEY 1257 & COMISARÍAS */}
                {ehrTab === 'juridico' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Gavel className="w-5 h-5 text-amber-300" />
                        Radicar & Archivar Trámite Jurídico (Ley 1257 / Comisaría de Familia)
                      </h3>

                      {legalSuccess && (
                        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                          {legalSuccess}
                        </div>
                      )}

                      <form onSubmit={handleAddLegalProcedure} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Entidad / Despacho *</label>
                            <input
                              type="text"
                              value={newLegalEntity}
                              onChange={(e) => setNewLegalEntity(e.target.value)}
                              placeholder="Ej: Comisaría de Familia Chiquinquirá"
                              required
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de Trámite / Acción *</label>
                            <input
                              type="text"
                              value={newLegalType}
                              onChange={(e) => setNewLegalType(e.target.value)}
                              placeholder="Ej: Medida de Protección Ley 1257/2008"
                              required
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Número de Radicado / Expediente</label>
                            <input
                              type="text"
                              value={newLegalCaseNum}
                              onChange={(e) => setNewLegalCaseNum(e.target.value)}
                              placeholder="Ej: RAD-2026-9904"
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Resumen & Actuaciones Jurídicas *</label>
                          <textarea
                            value={newLegalNotes}
                            onChange={(e) => setNewLegalNotes(e.target.value)}
                            placeholder="Detalle del trámite, acompañamiento prestado, citaciones o decisiones de la comisaría..."
                            rows={3}
                            required
                            className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                          >
                            <FileCheck className="w-4 h-4" />
                            <span>Radicar Trámite & Archivar en MongoDB</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* HISTÓRICO TRÁMITES JURÍDICOS */}
                    <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                      <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest">
                        Histórico de Trámites Jurídicos Archivados ({(selectedPatient.legalProcedures || []).length})
                      </h3>

                      {(selectedPatient.legalProcedures || []).map((leg) => (
                        <div key={leg.id} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-black text-sm text-white">{leg.procedureType}</h4>
                              <p className="text-xs text-pink-200/80">{leg.entity} • Radicado: <strong className="font-mono text-amber-300">{leg.caseNumber}</strong></p>
                            </div>
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full">
                              {leg.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 bg-[#240538]/60 p-3 rounded-xl border border-pink-500/10">
                            {leg.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PESTAÑA RECURSOS & AYUDAS PRESTADAS */}
                {ehrTab === 'recursos' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-emerald-400" />
                        Registrar & Entregar Recurso / Ayuda Institucional
                      </h3>

                      {resourceSuccess && (
                        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                          {resourceSuccess}
                        </div>
                      )}

                      <form onSubmit={handleAddResourceProvided} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Tipo de Ayuda / Recurso *</label>
                            <select
                              value={newResType}
                              onChange={(e) => setNewResType(e.target.value as any)}
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                            >
                              <option value="KIT_MATERNAL">👶 Kit Maternal & Suplementos</option>
                              <option value="CAPITAL_SEMILLA">💵 Fondo Capital Semilla ($ COP)</option>
                              <option value="HOSPEDAJE_REFUGIO">🏡 Hospedaje Casa Refugio Violeta</option>
                              <option value="SUBSIDIO_TRANSPORTE">🚌 Subsidio Transporte Ruta</option>
                              <option value="MERCADO_ALIMENTARIO">🍎 Mercado Alimentario Prioritario</option>
                              <option value="ATENCION_ODONTOLOGICA">🦷 Atención Odontológica Gratuita</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Descripción del Recurso *</label>
                            <input
                              type="text"
                              value={newResDesc}
                              onChange={(e) => setNewResDesc(e.target.value)}
                              placeholder="Ej: Entrega de Kit Maternal Nivel 1"
                              required
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Cantidad</label>
                            <input
                              type="number"
                              value={newResQty}
                              onChange={(e) => setNewResQty(Number(e.target.value))}
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Valor Estimado COP</label>
                            <input
                              type="number"
                              value={newResValueCop}
                              onChange={(e) => setNewResValueCop(Number(e.target.value))}
                              className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                          >
                            <PackageCheck className="w-4 h-4" />
                            <span>Registrar Ayuda & Archivar en Historia Clínica</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                      <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest">
                        Histórico de Ayudas & Recursos Entregados ({(selectedPatient.resourcesProvided || []).length})
                      </h3>

                      {(selectedPatient.resourcesProvided || []).map((res) => (
                        <div key={res.id} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm text-white">{res.description}</h4>
                              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                                {res.resourceType}
                              </span>
                            </div>
                            <p className="text-xs text-pink-200/80">Entregado por: <strong>{res.deliveredBy}</strong> el {res.date}</p>
                          </div>
                          <span className="text-sm font-black text-amber-300 font-mono">
                            ${(res.estimatedValueCop || 0).toLocaleString('es-CO')} COP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      )}
    </div>
  );
}
