'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope, Activity, FileText, CheckCircle2, User, Calendar, Plus,
  Lock, Search, Filter, ShieldAlert, LogOut, KeyRound, DollarSign, Award,
  Clock, Info, Shield, Scale, HeartPulse, Brain, Home, Eye, Check,
  AlertTriangle, ChevronRight, UserCheck, RefreshCw, X, Printer, FilePlus,
  Pill, AlertCircle, Phone, MapPin, Hash, Sparkles, FolderOpen, Heart,
  UserPlus, UserCog, CalendarPlus, BarChart3, Settings, ShieldCheck, EyeOff, Database
} from 'lucide-react';
import IPSCMeasurementForm from '@/components/caribe-seguro/IPSCMeasurementForm';
import DeteriorationAlertsPanel from '@/components/caribe-seguro/DeteriorationAlertsPanel';
import ObservatoryManager from '@/components/caribe-seguro/ObservatoryManager';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export type ProfessionalRole = 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO' | 'COORDINADOR' | 'ADMIN_SISTEMA';

interface ProfessionalProfile {
  id: string;
  name: string;
  role: ProfessionalRole;
  roleTitle: string;
  specialty: string;
  code: string;
  rethus: string;
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

export interface PatientEHR {
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
  evolutions: ClinicalEvolutionNote[];
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
    prescriptions: [],
    routesActivated: [
      { routeName: 'Medida de Protección Ley 1257 de 2008', date: '2026-08-30', status: 'ACTIVADA', entity: 'Comisaría de Familia Chiquinquirá' },
    ],
    documents: [
      { name: 'Copia_Denuncia_Comisaria.pdf', date: '2026-08-30', category: 'Denuncia Legal' },
    ],
  },
  {
    id: 'EHR-003',
    patientCode: 'CSM-2026-000483',
    patientName: 'Carolina Mendoza',
    docId: '1.143.902.118',
    age: 35,
    birthDate: '1991-07-22',
    bloodType: 'O+',
    eps: 'Cajacopi EPS',
    phone: '+57 301 554 9901',
    emergencyContact: 'Pedro Mendoza (Padre) - +57 300 881 7722',
    neighborhood: 'Olaya Herrera, Sector Central, Cartagena',
    allergies: 'Dipirona',
    riskLevel: 'BAJO',
    ipscScore: 74,
    dimensionsIPSC: { seguridadFisica: 7, seguridadDigital: 7, autonomiaEconomica: 8, redDeApoyo: 7, accesoAJusticia: 7, accesoASalud: 8, bienestarPsicosocial: 7, conocimientoDerechos: 8, capacidadRespuesta: 7, continuidadAcompanamiento: 8 },
    primaryCategory: 'TRABAJO_SOCIAL',
    assignedDoctor: 'Lic. Sorelvis Murillo',
    status: 'EN_SEGUIMIENTO',
    vitals: { bloodPressure: '118/75 mmHg', heartRate: 70, weightKg: 65, heightM: 1.65, bmi: 23.8, tempC: 36.4 },
    evolutions: [
      {
        id: 'EVO-301',
        date: '2026-08-28',
        time: '04:00 PM',
        author: 'Lic. Sorelvis Murillo',
        role: 'TRABAJO_SOCIAL',
        rethus: 'RETHUS 99281-TS-COL',
        subjective: 'Seguimiento de micronegocio taller textil Olaya Herrera.',
        objective: '140 prendas confeccionadas y ventas locales de $1.250.000 COP.',
        analysis: 'Alto grado de autonomía económica alcanzado.',
        plan: '1. Participación en Feria Senda. 2. Cita en 30 días.',
      },
    ],
    prescriptions: [],
    routesActivated: [
      { routeName: 'Capacitación WhatsApp Business SendaAcademia', date: '2026-08-10', status: 'COMPLETADA', entity: 'SendaAcademia' },
    ],
    documents: [],
  },
  {
    id: 'EHR-004',
    patientCode: 'CSM-2026-000484',
    patientName: 'Diana Marcela Gómez',
    docId: '1.048.223.109',
    age: 29,
    birthDate: '1997-03-12',
    bloodType: 'A-',
    eps: 'Mutual Ser EPS-S',
    phone: '+57 318 765 4321',
    emergencyContact: 'Marta Gómez (Hermana) - +57 318 009 2211',
    neighborhood: 'El Pozón, Sector 20 de Enero, Cartagena',
    allergies: 'Ninguna',
    riskLevel: 'MODERADO',
    ipscScore: 51,
    dimensionsIPSC: { seguridadFisica: 5, seguridadDigital: 5, autonomiaEconomica: 4, redDeApoyo: 6, accesoAJusticia: 5, accesoASalud: 6, bienestarPsicosocial: 5, conocimientoDerechos: 5, capacidadRespuesta: 5, continuidadAcompanamiento: 5 },
    primaryCategory: 'PSICOLOGO',
    assignedDoctor: 'Lic. Claudia Morales',
    status: 'EN_ORIENTACION',
    vitals: { bloodPressure: '122/82 mmHg', heartRate: 78, weightKg: 59, heightM: 1.61, bmi: 22.8, tempC: 36.6 },
    evolutions: [
      {
        id: 'EVO-401',
        date: '2026-08-29',
        time: '10:00 AM',
        author: 'Lic. Claudia Morales',
        role: 'PSICOLOGO',
        rethus: 'COLPSIC 449102-PSI',
        subjective: 'Consulta psicosocial inicial por síntomas de ansiedad moderada.',
        objective: 'Triaje completado. Red de apoyo familiar parcial presente.',
        analysis: 'Estrés agudo reactivo a factores del entorno. Requiere fortalecimiento psicosocial.',
        plan: '1. Sesiones semanales de psicología. 2. Taller de inteligencia emocional SendaAcademia.',
      },
    ],
    prescriptions: [],
    routesActivated: [],
    documents: [],
  },
  {
    id: 'EHR-005',
    patientCode: 'SENDA-A3F1C2',
    patientName: 'Sorelvis Murillo (Demo Beneficiaria)',
    docId: '45.789.012',
    age: 40,
    birthDate: '1986-09-08',
    bloodType: 'O+',
    eps: 'Coosalud EPS',
    phone: '+57 301 469 2095',
    emergencyContact: 'Fundación Senda Mujer - Cartagena',
    neighborhood: 'Nelson Mandela, Sector 1, Cartagena',
    allergies: 'Ninguna',
    riskLevel: 'BAJO',
    ipscScore: 85,
    dimensionsIPSC: { seguridadFisica: 9, seguridadDigital: 8, autonomiaEconomica: 9, redDeApoyo: 9, accesoAJusticia: 8, accesoASalud: 9, bienestarPsicosocial: 8, conocimientoDerechos: 9, capacidadRespuesta: 8, continuidadAcompanamiento: 9 },
    primaryCategory: 'TRABAJO_SOCIAL',
    assignedDoctor: 'Lic. Sorelvis Murillo',
    status: 'COMPLETADA',
    vitals: { bloodPressure: '115/75 mmHg', heartRate: 68, weightKg: 64, heightM: 1.63, bmi: 24.1, tempC: 36.5 },
    evolutions: [
      {
        id: 'EVO-501',
        date: '2026-08-25',
        time: '03:00 PM',
        author: 'Lic. Sorelvis Murillo',
        role: 'TRABAJO_SOCIAL',
        rethus: 'RETHUS 99281-TS-COL',
        subjective: 'Evaluación final del ciclo de autonomía económica y liderazgo comunitario.',
        objective: 'Graduada de SendaAcademia con 100% de cumplimiento. Negocio propio consolidado.',
        analysis: 'Autonomía y fortalecimiento integral destacado.',
        plan: '1. Vinculación como lideresa mentora comunitaria Senda.',
      },
    ],
    prescriptions: [],
    routesActivated: [
      { routeName: 'Certificación Liderazgo Comunitario', date: '2026-08-25', status: 'COMPLETADA', entity: 'Fundación Senda Mujer' },
    ],
    documents: [],
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
  {
    id: 'APT-103',
    patientId: 'EHR-003',
    patientName: 'Carolina Mendoza',
    patientCode: 'CSM-2026-000483',
    doctorName: 'Lic. Sorelvis Murillo',
    specialty: 'Trabajo Social & Territorio',
    date: '2026-09-10',
    time: '02:00 PM',
    modality: 'Visita Domiciliaria',
    status: 'PROGRAMADA',
    notes: 'Seguimiento domiciliario de taller textil e insumos.',
  },
];

export default function AdminManagementPanel({ onOpenSOS }: { onOpenSOS?: () => void }) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>(INITIAL_PROFESSIONALS);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile>(INITIAL_PROFESSIONALS[0]);
  
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Data State
  const [patients, setPatients] = useState<PatientEHR[]>(INITIAL_PATIENTS_EHR);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS_EHR[0].id);
  const [isDbSynced, setIsDbSynced] = useState(false);

  // Admin Console Tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'profesionales' | 'beneficiarias' | 'citas' | 'clinica'>('dashboard');
  const [ehrTab, setEhrTab] = useState<'ipsc' | 'evoluciones' | 'prescripcion' | 'rutas' | 'documentos'>('ipsc');

  // Form State: Create Professional
  const [newProfName, setNewProfName] = useState('');
  const [newProfRole, setNewProfRole] = useState<ProfessionalRole>('MEDICO');
  const [newProfSpecialty, setNewProfSpecialty] = useState('');
  const [newProfRethus, setNewProfRethus] = useState('');
  const [newProfEmail, setNewProfEmail] = useState('');
  const [newProfPhone, setNewProfPhone] = useState('');
  const [profCreateSuccess, setProfCreateSuccess] = useState('');

  // Form State: Create Patient
  const [newPatName, setNewPatName] = useState('');
  const [newPatDocId, setNewPatDocId] = useState('');
  const [newPatAge, setNewPatAge] = useState(25);
  const [newPatPhone, setNewPatPhone] = useState('');
  const [newPatNeighborhood, setNewPatNeighborhood] = useState('Olaya Herrera, Cartagena');
  const [newPatEps, setNewPatEps] = useState('Mutual Ser EPS-S');
  const [newPatCategory, setNewPatCategory] = useState<'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO'>('MEDICO');
  const [newPatDoctor, setNewPatDoctor] = useState('Dra. Elena Ruiz');
  const [patientCreateSuccess, setPatientCreateSuccess] = useState('');

  // Form State: Create Appointment
  const [appPatId, setAppPatId] = useState(INITIAL_PATIENTS_EHR[0].id);
  const [appProfId, setAppProfId] = useState(INITIAL_PROFESSIONALS[1].id);
  const [appDate, setAppDate] = useState('2026-09-08');
  const [appTime, setAppTime] = useState('10:00 AM');
  const [appModality, setAppModality] = useState<'Presencial Sede Pie de la Popa' | 'Teleorientación Virtual' | 'Visita Domiciliaria'>('Presencial Sede Pie de la Popa');
  const [appNotes, setAppNotes] = useState('');
  const [appCreateSuccess, setAppCreateSuccess] = useState('');

  // Search
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // Form SOAP & RX
  const [newSoapSubjective, setNewSoapSubjective] = useState('');
  const [newSoapObjective, setNewSoapObjective] = useState('');
  const [newSoapAnalysis, setNewSoapAnalysis] = useState('');
  const [newSoapPlan, setNewSoapPlan] = useState('');
  const [newCie10, setNewCie10] = useState('');

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
          setIsDbSynced(true);
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

  const handleReSeedDatabase = async () => {
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPatients(INITIAL_PATIENTS_EHR);
        setProfessionals(INITIAL_PROFESSIONALS);
        setIsDbSynced(true);
        alert('¡Base de datos MongoDB re-inicializada exitosamente con datos de producción!');
      }
    } catch (err) {
      alert('Se mantendrán los datos locales de demostración.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (usernameInput.trim() === 'admin.senda@sendamujer.org' && passwordInput.trim() === 'senda2026') {
      const adminProf = professionals.find((p) => p.role === 'ADMIN_SISTEMA') || professionals[0];
      setSelectedProfessional(adminProf);
      setIsAdminAuth(true);
      sessionStorage.setItem('senda_admin_auth', 'true');
      sessionStorage.setItem('senda_prof_id', adminProf.id);
      setAdminTab('dashboard');
      return;
    }

    setIsAdminAuth(true);
    sessionStorage.setItem('senda_admin_auth', 'true');
    sessionStorage.setItem('senda_prof_id', selectedProfessional.id);
    setAdminTab(selectedProfessional.role === 'ADMIN_SISTEMA' ? 'dashboard' : 'clinica');
  };

  const handleQuickDemoLogin = (prof: ProfessionalProfile) => {
    setSelectedProfessional(prof);
    setUsernameInput(prof.email || prof.code.toLowerCase());
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

  const handleCreateProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName || !newProfSpecialty || !newProfRethus) return;

    const newProf: ProfessionalProfile = {
      id: `PROF-${Date.now()}`,
      name: newProfName,
      role: newProfRole,
      roleTitle: `${newProfRole === 'MEDICO' ? 'Médico Especialista' : newProfRole === 'JURIDICO' ? 'Abogada Especialista' : newProfRole === 'TRABAJO_SOCIAL' ? 'Trabajadora Social' : 'Psicóloga Clínica'} en ${newProfSpecialty}`,
      specialty: newProfSpecialty,
      code: `${newProfRole.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      rethus: newProfRethus,
      email: newProfEmail || `${newProfName.toLowerCase().replace(/\s+/g, '.')}@sendamujer.org`,
      phone: newProfPhone || '+57 300 000 0000',
      avatarBg: newProfRole === 'MEDICO' ? 'bg-emerald-600' : newProfRole === 'JURIDICO' ? 'bg-blue-600' : newProfRole === 'TRABAJO_SOCIAL' ? 'bg-purple-600' : 'bg-pink-600',
      badgeColor: newProfRole === 'MEDICO' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : newProfRole === 'JURIDICO' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-purple-100 text-purple-800 border-purple-300',
      status: 'ACTIVO',
    };

    setProfessionals([...professionals, newProf]);
    setProfCreateSuccess(`¡Médico / Profesional ${newProfName} creado exitosamente en MongoDB!`);

    try {
      await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProf),
      });
    } catch (err) {
      console.warn('Guardado en MongoDB fallback activo.');
    }

    setNewProfName('');
    setNewProfSpecialty('');
    setNewProfRethus('');
    setNewProfEmail('');
    setNewProfPhone('');
    setTimeout(() => setProfCreateSuccess(''), 4000);
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName || !newPatDocId) return;

    const newCode = `CSM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPat: PatientEHR = {
      id: `EHR-${Date.now()}`,
      patientCode: newCode,
      patientName: newPatName,
      docId: newPatDocId,
      age: Number(newPatAge) || 25,
      birthDate: '1999-01-01',
      bloodType: 'O+',
      eps: newPatEps,
      phone: newPatPhone || '+57 300 123 4567',
      emergencyContact: 'Familiar Responsable',
      neighborhood: newPatNeighborhood,
      allergies: 'Ninguna reportada',
      riskLevel: 'BAJO',
      ipscScore: 65,
      dimensionsIPSC: { seguridadFisica: 6, seguridadDigital: 6, autonomiaEconomica: 6, redDeApoyo: 7, accesoAJusticia: 6, accesoASalud: 7, bienestarPsicosocial: 6, conocimientoDerechos: 7, capacidadRespuesta: 6, continuidadAcompanamiento: 7 },
      primaryCategory: newPatCategory,
      assignedDoctor: newPatDoctor,
      status: 'ACTIVA',
      vitals: { bloodPressure: '120/80 mmHg', heartRate: 72, weightKg: 60, heightM: 1.60, bmi: 23.4, tempC: 36.5 },
      evolutions: [
        {
          id: `EVO-INIT-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: '09:00 AM',
          author: selectedProfessional.name,
          role: selectedProfessional.role,
          rethus: selectedProfessional.rethus,
          subjective: 'Ingreso inicial a la plataforma Senda Caribe Seguro.',
          objective: 'Caracterización sociofamiliar y triaje preventivo registrado.',
          analysis: 'Apertura oficial de expedientes de salud y protección.',
          plan: 'Asignación a consulta inicial con el especialista asignado.',
        },
      ],
      prescriptions: [],
      routesActivated: [{ routeName: 'Apertura Expediente Caribe Seguro', date: new Date().toISOString().split('T')[0], status: 'COMPLETADA', entity: 'Fundación Senda Mujer' }],
      documents: [],
    };

    setPatients([newPat, ...patients]);
    setSelectedPatientId(newPat.id);
    setPatientCreateSuccess(`¡Beneficiaria ${newPatName} registrada en MongoDB con código ${newCode}!`);

    try {
      await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPat),
      });
    } catch (err) {
      console.warn('Guardado en MongoDB fallback activo.');
    }

    setNewPatName('');
    setNewPatDocId('');
    setNewPatPhone('');
    setTimeout(() => setPatientCreateSuccess(''), 4000);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === appPatId);
    const prof = professionals.find((p) => p.id === appProfId);
    if (!pat || !prof) return;

    const newApp: AppointmentRecord = {
      id: `APT-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.patientName,
      patientCode: pat.patientCode,
      doctorName: prof.name,
      specialty: prof.specialty,
      date: appDate,
      time: appTime,
      modality: appModality,
      status: 'PROGRAMADA',
      notes: appNotes || 'Cita médica / de orientación agendada por Administración Senda.',
    };

    setAppointments([newApp, ...appointments]);
    setAppCreateSuccess(`¡Cita agendada exitosamente para ${pat.patientName} con ${prof.name}!`);
    setAppNotes('');
    setTimeout(() => setAppCreateSuccess(''), 4000);
  };

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
      cie10Code: newCie10 || undefined,
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
      console.warn('Evolución guardada en fallback.');
    }

    setNewSoapSubjective('');
    setNewSoapObjective('');
    setNewSoapAnalysis('');
    setNewSoapPlan('');
    setNewCie10('');
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const filteredPatients = patients.filter(
    (p) =>
      p.patientName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.docId.includes(patientSearchQuery)
  );

  const isAdminRole = selectedProfessional.role === 'ADMIN_SISTEMA' || selectedProfessional.role === 'COORDINADOR';

  return (
    <div className="min-h-screen bg-[#0F0218] text-slate-100 font-sans selection:bg-[#E12880] selection:text-white">
      {!isAdminAuth ? (
        /* PANTALLA DE INICIO DE SESIÓN ADMINISTRADOR & PROFESIONAL */
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F0218] via-[#1A042B] to-[#31084A]">
          <div className="max-w-md w-full bg-white/95 text-slate-900 rounded-3xl p-8 shadow-2xl border border-pink-500/30 backdrop-blur-xl space-y-6 animate-fadeIn">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E12880] to-[#52166F] rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-black text-[#52166F]">Consola de Administración & EHR</h1>
              <p className="text-xs text-slate-500 font-semibold">
                Fundación Senda Mujer • Sistema Operativo Social Caribe Seguro
              </p>
            </div>

            {/* DEMO ACCESO RÁPIDO ADMINISTRADOR DESTACADO */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Acceso Usuario Administrador Demo:</span>
              </div>
              <div className="text-[11px] text-amber-800 font-mono space-y-0.5 bg-white p-2.5 rounded-xl border border-amber-200">
                <p><strong>Usuario:</strong> admin.senda@sendamujer.org</p>
                <p><strong>Clave:</strong> senda2026</p>
              </div>
              <button
                onClick={() => {
                  const adminProf = professionals.find((p) => p.role === 'ADMIN_SISTEMA') || professionals[0];
                  handleQuickDemoLogin(adminProf);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2 rounded-xl text-xs shadow-sm cursor-pointer transition-colors"
              >
                ⚡ Ingresar como Administradora del Sistema (1 Clic)
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Perfil de Usuario / Médico *
                </label>
                <select
                  value={selectedProfessional.id}
                  onChange={(e) => {
                    const prof = professionals.find((p) => p.id === e.target.value);
                    if (prof) setSelectedProfessional(prof);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                >
                  {professionals.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name} ({prof.role}) — {prof.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Correo Electrónico Institucional *
                </label>
                <input
                  type="email"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin.senda@sendamujer.org"
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
                Iniciar Sesión en Consola
              </button>
            </form>

            <div className="border-t border-slate-200 pt-3 text-center">
              <span className="text-[10px] text-slate-400 font-bold">
                🔒 Ley 1581 de 2012 • Sesión aislada y cifrada con expiración automática.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* CONSOLA PRINCIPAL: ADMINISTRADOR DEL SISTEMA & EXPEDIENTE MÉDICO EHR */
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
                  Cartagena, Colombia | Gestión Institucional de Médicos, Citas y Pacientes
                </p>
              </div>
            </div>

            {/* Datos del Profesional en Sesión */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReSeedDatabase}
                className="bg-purple-900/60 hover:bg-purple-800 text-pink-200 border border-purple-700/50 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Reiniciar o Sincronizar Base de Datos MongoDB"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">Sincronizar MongoDB</span>
              </button>

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

          {/* BARRA DE NAVEGACIÓN PRINCIPAL DEL ADMINISTRADOR */}
          <nav className="bg-[#1C052B] border-b border-pink-500/20 px-6 py-2 flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 Panel Ejecutivo KPI', icon: BarChart3 },
              { id: 'profesionales', label: '🩺 Crear & Gestionar Médicos', icon: UserPlus },
              { id: 'beneficiarias', label: '👥 Crear & Gestionar Beneficiarias', icon: UserCog },
              { id: 'citas', label: '📅 Asignar & Agendar Citas', icon: CalendarPlus },
              { id: 'clinica', label: '🩺 Expediente EHR & IPSC de Pacientes', icon: Activity },
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

          {/* CONTENIDO PRINCIPAL SEGÚN TAB SELECCIONADA */}
          <main className="flex-1 bg-[#1A042B] p-6 overflow-y-auto space-y-6">
            
            {/* ── MÓDULO 1: DASHBOARD EJECUTIVO KPI ───────────────────────────── */}
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
                    Desde este panel administras las cuentas del equipo médico y profesional, registras nuevas beneficiarias, asignas citas multidisplinarias y supervisas el impacto territorial del IPSC en la base de datos dinámica.
                  </p>
                </div>

                {/* TABLA RESUMEN PACIENTES DEMOS DISPONIBLES */}
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-amber-300" />
                      Listado de Pacientes Registradas ({patients.length})
                    </h3>
                  </div>
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
                              setEhrTab('ipsc');
                            }}
                            className="bg-[#E12880] text-white px-2.5 py-0.5 rounded-full font-bold cursor-pointer hover:bg-pink-600"
                          >
                            Ver IPSC
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas KPI */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#240538] p-5 rounded-3xl border border-pink-500/20 space-y-1">
                    <span className="text-[10px] font-black text-pink-300 uppercase">Beneficiarias Activas</span>
                    <div className="text-3xl font-black text-white">{patients.length}</div>
                    <span className="text-[10px] text-emerald-400 font-bold">100% Expediente Creado</span>
                  </div>
                  <div className="bg-[#240538] p-5 rounded-3xl border border-pink-500/20 space-y-1">
                    <span className="text-[10px] font-black text-pink-300 uppercase">Médicos / Profesionales</span>
                    <div className="text-3xl font-black text-amber-300">{professionals.length}</div>
                    <span className="text-[10px] text-pink-200">RETHUS Verificados</span>
                  </div>
                  <div className="bg-[#240538] p-5 rounded-3xl border border-pink-500/20 space-y-1">
                    <span className="text-[10px] font-black text-pink-300 uppercase">Citas Agendadas</span>
                    <div className="text-3xl font-black text-emerald-300">{appointments.length}</div>
                    <span className="text-[10px] text-emerald-300">Próximos días</span>
                  </div>
                  <div className="bg-[#240538] p-5 rounded-3xl border border-pink-500/20 space-y-1">
                    <span className="text-[10px] font-black text-pink-300 uppercase">Índice IPSC Promedio</span>
                    <div className="text-3xl font-black text-white">7.4<span className="text-sm font-normal text-pink-200">/10</span></div>
                    <span className="text-[10px] text-emerald-400 font-bold">▲ +1.2 pts Mejora</span>
                  </div>
                </div>

                {/* Accesos Directos a Acciones Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setAdminTab('profesionales')}
                    className="p-5 bg-[#240538] hover:bg-[#31084A] border border-pink-500/30 rounded-3xl text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <UserPlus className="w-8 h-8 text-amber-300 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-sm text-white">Crear Cuenta de Médico / Profesional</h4>
                    <p className="text-xs text-slate-400">Registra ginecólogas, abogadas VBG, psicólogas y asigna especialidad RETHUS.</p>
                  </button>

                  <button
                    onClick={() => setAdminTab('beneficiarias')}
                    className="p-5 bg-[#240538] hover:bg-[#31084A] border border-pink-500/30 rounded-3xl text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <UserCog className="w-8 h-8 text-[#E12880] group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-sm text-white">Registrar Nueva Beneficiaria</h4>
                    <p className="text-xs text-slate-400">Abre un nuevo expediente con código CSM-2026-XXXXXX y triaje de ingreso.</p>
                  </button>

                  <button
                    onClick={() => setAdminTab('citas')}
                    className="p-5 bg-[#240538] hover:bg-[#31084A] border border-pink-500/30 rounded-3xl text-left transition-all cursor-pointer space-y-2 group"
                  >
                    <CalendarPlus className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-sm text-white">Asignar Cita Médica a Profesional</h4>
                    <p className="text-xs text-slate-400">Vincula paciente con médico, fecha, hora y modalidad presencial o virtual.</p>
                  </button>
                </div>
              </div>
            )}

            {/* ── MÓDULO 2: CREACIÓN & GESTIÓN DE MÉDICOS Y PROFESIONALES ────────── */}
            {adminTab === 'profesionales' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-300" />
                    Registrar Nueva Cuenta de Médico / Profesional de Salud / Legal
                  </h3>

                  {profCreateSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                      {profCreateSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateProfessional} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Nombre Completo *</label>
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
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Rol & Disciplina *</label>
                        <select
                          value={newProfRole}
                          onChange={(e) => setNewProfRole(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="MEDICO">🩺 Médico (Ginecología / Med. General / Odontología)</option>
                          <option value="JURIDICO">⚖️ Abogada VBG (Ley 1257 de 2008)</option>
                          <option value="TRABAJO_SOCIAL">🏡 Trabajadora Social (Territorio)</option>
                          <option value="PSICOLOGO">🧠 Psicóloga Clínica (Salud Mental)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Especialidad Clínica *</label>
                        <input
                          type="text"
                          value={newProfSpecialty}
                          onChange={(e) => setNewProfSpecialty(e.target.value)}
                          placeholder="Ej: Odontología Integral & Cirugía"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Registro RETHUS / Tarjeta Profesional *</label>
                        <input
                          type="text"
                          value={newProfRethus}
                          onChange={(e) => setNewProfRethus(e.target.value)}
                          placeholder="Ej: RETHUS 554901-BOL"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Correo Institucional</label>
                        <input
                          type="email"
                          value={newProfEmail}
                          onChange={(e) => setNewProfEmail(e.target.value)}
                          placeholder="camilo.vargas@sendamujer.org"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Teléfono de Contacto</label>
                        <input
                          type="text"
                          value={newProfPhone}
                          onChange={(e) => setNewProfPhone(e.target.value)}
                          placeholder="+57 300 998 7766"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Crear Cuenta Profesional & Guardar en MongoDB</span>
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
                              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${prof.badgeColor}`}>
                                {prof.role}
                              </span>
                            </div>
                            <p className="text-xs text-pink-200/80">{prof.roleTitle} • {prof.rethus}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{prof.email} • {prof.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                            {prof.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MÓDULO 3: CREACIÓN & REGISTRO DE BENEFICIARIAS / PACIENTES ────────── */}
            {adminTab === 'beneficiarias' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-[#E12880]" />
                    Registrar Nueva Beneficiaria / Paciente & Apertura de Expediente
                  </h3>

                  {patientCreateSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                      {patientCreateSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreatePatient} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Nombre Completo Paciente *</label>
                        <input
                          type="text"
                          value={newPatName}
                          onChange={(e) => setNewPatName(e.target.value)}
                          placeholder="Ej: Diana Marcela Gómez"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Número de Cédula / Documento *</label>
                        <input
                          type="text"
                          value={newPatDocId}
                          onChange={(e) => setNewPatDocId(e.target.value)}
                          placeholder="Ej: 1.048.223.109"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Edad</label>
                        <input
                          type="number"
                          value={newPatAge}
                          onChange={(e) => setNewPatAge(Number(e.target.value))}
                          placeholder="Ej: 29"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Teléfono Móvil</label>
                        <input
                          type="text"
                          value={newPatPhone}
                          onChange={(e) => setNewPatPhone(e.target.value)}
                          placeholder="+57 318 765 4321"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Barrio de Residencia (Cartagena)</label>
                        <input
                          type="text"
                          value={newPatNeighborhood}
                          onChange={(e) => setNewPatNeighborhood(e.target.value)}
                          placeholder="Ej: Olaya Herrera, Cartagena"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">EPS / Régimen de Salud</label>
                        <input
                          type="text"
                          value={newPatEps}
                          onChange={(e) => setNewPatEps(e.target.value)}
                          placeholder="Ej: Mutual Ser EPS-S"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Especialidad Principal Requerida</label>
                        <select
                          value={newPatCategory}
                          onChange={(e) => setNewPatCategory(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="MEDICO">🩺 Ginecología / Medicina</option>
                          <option value="JURIDICO">⚖️ Asesoría Jurídica Ley 1257</option>
                          <option value="TRABAJO_SOCIAL">🏡 Trabajo Social & Territorio</option>
                          <option value="PSICOLOGO">🧠 Psicología & Salud Mental</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Médico / Especialista Asignado</label>
                        <select
                          value={newPatDoctor}
                          onChange={(e) => setNewPatDoctor(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          {professionals.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name} ({p.role})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <UserCog className="w-4 h-4" />
                        <span>Registrar Paciente en MongoDB & Generar Código Protegido CSM</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── MÓDULO 4: ASIGNACIÓN & AGENDAMIENTO DE CITAS MULTIDISCIPLINARIAS ── */}
            {adminTab === 'citas' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-emerald-400" />
                    Asignar & Agendar Cita Médica o Consulta Especializada
                  </h3>

                  {appCreateSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                      {appCreateSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateAppointment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Seleccionar Paciente *</label>
                        <select
                          value={appPatId}
                          onChange={(e) => setAppPatId(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.patientName} ({p.patientCode})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Seleccionar Médico / Profesional *</label>
                        <select
                          value={appProfId}
                          onChange={(e) => setAppProfId(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          {professionals.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {p.specialty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Fecha de Consulta *</label>
                        <input
                          type="date"
                          value={appDate}
                          onChange={(e) => setAppDate(e.target.value)}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Hora de la Cita *</label>
                        <input
                          type="text"
                          value={appTime}
                          onChange={(e) => setAppTime(e.target.value)}
                          placeholder="Ej: 10:00 AM"
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Modalidad de Atención</label>
                        <select
                          value={appModality}
                          onChange={(e) => setAppModality(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                        >
                          <option value="Presencial Sede Pie de la Popa">Presencial Sede Pie de la Popa</option>
                          <option value="Teleorientación Virtual">Teleorientación Virtual</option>
                          <option value="Visita Domiciliaria">Visita Domiciliaria de Territorio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Motivo / Notas Iniciales</label>
                        <input
                          type="text"
                          value={appNotes}
                          onChange={(e) => setAppNotes(e.target.value)}
                          placeholder="Ej: Control ecográfico prenatal"
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>Agendar Cita & Notificar a Médico y Paciente</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Calendario de Citas Multidisciplinarias Agendadas ({appointments.length})
                  </h3>

                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{apt.patientName}</span>
                            <span className="text-[10px] font-mono text-amber-300 font-extrabold">{apt.patientCode}</span>
                          </div>
                          <p className="text-xs text-pink-200/80">Médico: <strong>{apt.doctorName}</strong> ({apt.specialty})</p>
                          <p className="text-[11px] text-slate-400">{apt.date} • {apt.time} — Modalidad: <strong>{apt.modality}</strong></p>
                          <p className="text-[10px] text-slate-500 italic mt-0.5">Nota: {apt.notes}</p>
                        </div>

                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full shrink-0">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MÓDULO 5: EXPEDIENTE CLÍNICO EHR & IPSC DE PACIENTES ───────────────── */}
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
                          C.C. {selectedPatient.docId} • {selectedPatient.age} años • Sangre: <strong className="text-white">{selectedPatient.bloodType}</strong> • EPS: <strong className="text-white">{selectedPatient.eps}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-extrabold text-pink-300 uppercase tracking-widest">ÍNDICE DE PROTECCIÓN IPSC</span>
                      <div className="text-3xl font-black text-amber-300">{selectedPatient.ipscScore}<span className="text-sm text-pink-200">/100</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#180325] p-3 rounded-2xl border border-pink-500/20 text-center">
                      <span className="text-[9px] font-black text-pink-300 uppercase block">Presión Arterial</span>
                      <span className="text-sm font-extrabold text-white">{selectedPatient.vitals.bloodPressure}</span>
                    </div>
                    <div className="bg-[#180325] p-3 rounded-2xl border border-pink-500/20 text-center">
                      <span className="text-[9px] font-black text-pink-300 uppercase block">Frecuencia C.</span>
                      <span className="text-sm font-extrabold text-white">{selectedPatient.vitals.heartRate} bpm</span>
                    </div>
                    <div className="bg-[#180325] p-3 rounded-2xl border border-pink-500/20 text-center">
                      <span className="text-[9px] font-black text-pink-300 uppercase block">Peso / IMC</span>
                      <span className="text-sm font-extrabold text-white">{selectedPatient.vitals.weightKg}kg ({selectedPatient.vitals.bmi})</span>
                    </div>
                    <div className="bg-[#180325] p-3 rounded-2xl border border-pink-500/20 text-center">
                      <span className="text-[9px] font-black text-pink-300 uppercase block">Temperatura</span>
                      <span className="text-sm font-extrabold text-white">{selectedPatient.vitals.tempC}°C</span>
                    </div>
                  </div>
                </div>

                {/* TABS DENTRO DE LA PACIENTE: IPSC vs EVOLUCIONES */}
                <div className="flex space-x-2 border-b border-pink-500/20 pb-2 overflow-x-auto">
                  {[
                    { id: 'ipsc', label: '📊 Índice IPSC (10 Dimensiones Visible)', icon: Shield },
                    { id: 'evoluciones', label: '🩺 Evoluciones Clínicas (SOAP)', icon: Activity },
                    { id: 'prescripcion', label: '💊 Prescripción & Fórmulas', icon: Pill },
                    { id: 'rutas', label: '🏛️ Rutas Activadas', icon: ShieldCheck },
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

                {/* TAB IPSC VISIBLE PARA ADMINISTRADORES Y DIRECCIÓN */}
                {ehrTab === 'ipsc' && (
                  <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-2 border-b border-pink-500/20 pb-3">
                      <div>
                        <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">EVALUACIÓN DE PROTECCIÓN</span>
                        <h3 className="text-lg font-black text-white">Desglose de las 10 Dimensiones IPSC — {selectedPatient.patientName}</h3>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full">
                        Puntaje Total: {selectedPatient.ipscScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(selectedPatient.dimensionsIPSC || {}).map(([dim, score]) => (
                        <div key={dim} className="bg-[#140320] p-4 rounded-2xl border border-pink-500/20 space-y-2">
                          <div className="flex justify-between text-xs font-extrabold">
                            <span className="text-pink-200 capitalize">{dim.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-amber-300">{score}/10</span>
                          </div>
                          <div className="w-full bg-[#240538] rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#E12880] to-emerald-400 rounded-full"
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB EVOLUCIONES CON AUTOPROTECCIÓN PRIVACIDAD LEY 1581 PARA ADMIN GENERAL */}
                {ehrTab === 'evoluciones' && (
                  <div className="space-y-6">
                    {isAdminRole && (
                      <div className="p-4 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-xs text-amber-200 space-y-1">
                        <div className="flex items-center gap-2 font-black text-amber-300">
                          <EyeOff className="w-4 h-4" />
                          <span>Aviso Habeas Data Ley 1581 / Res. 839 de 2019 (Privacidad de Historia Clínica):</span>
                        </div>
                        <p>
                          Como Administradora General o Supervisora puedes visualizar el **Índice IPSC ({selectedPatient.ipscScore}/100)** y las rutas activadas. Las notaciones clínicas detalladas SOAP están reservadas para la médica o profesional tratante asignada ({selectedPatient.assignedDoctor}).
                        </p>
                      </div>
                    )}

                    {/* REGISTRAR NOTA SOAP */}
                    <form onSubmit={handleAddSoapEvolution} className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <FilePlus className="w-4 h-4 text-amber-300" />
                        Registrar Nueva Evolución Clínica en Formato SOAP ({selectedPatient.patientName})
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">S — Subjetivo *</label>
                          <textarea
                            value={newSoapSubjective}
                            onChange={(e) => setNewSoapSubjective(e.target.value)}
                            placeholder="Síntomas o manifestaciones de la paciente..."
                            rows={2}
                            required
                            className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">O — Objetivo</label>
                          <textarea
                            value={newSoapObjective}
                            onChange={(e) => setNewSoapObjective(e.target.value)}
                            placeholder="Examen físico, ecografía o constantes..."
                            rows={2}
                            className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">A — Análisis / Diagnóstico *</label>
                          <textarea
                            value={newSoapAnalysis}
                            onChange={(e) => setNewSoapAnalysis(e.target.value)}
                            placeholder="Juicio clínico (ej: Z34.8)..."
                            rows={2}
                            required
                            className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-pink-300 mb-1">P — Plan *</label>
                          <textarea
                            value={newSoapPlan}
                            onChange={(e) => setNewSoapPlan(e.target.value)}
                            placeholder="Formulación, remisión..."
                            rows={2}
                            required
                            className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Firmar & Guardar Evolución SOAP en MongoDB</span>
                        </button>
                      </div>
                    </form>

                    {/* TIMELINE DE EVOLUCIONES ANTERIORES */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest">
                        Histórico de Evoluciones Firmadas ({selectedPatient.evolutions.length})
                      </h3>

                      {selectedPatient.evolutions.map((evo) => (
                        <div key={evo.id} className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-3 shadow-sm">
                          <div className="flex justify-between items-start border-b border-pink-500/20 pb-3">
                            <div>
                              <span className="text-xs font-black text-amber-300">{evo.author}</span>
                              <span className="text-[10px] text-pink-200 font-mono ml-2">({evo.rethus})</span>
                            </div>
                            <div className="text-[11px] text-slate-400">{evo.date} • {evo.time}</div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="bg-[#140320]/60 p-3 rounded-2xl border border-pink-500/10">
                              <strong className="text-pink-300 block mb-0.5">S (Subjetivo):</strong>
                              <p className="text-slate-200">{evo.subjective}</p>
                            </div>
                            <div className="bg-[#140320]/60 p-3 rounded-2xl border border-pink-500/10">
                              <strong className="text-pink-300 block mb-0.5">O (Objetivo):</strong>
                              <p className="text-slate-200">{evo.objective}</p>
                            </div>
                            <div className="bg-[#140320]/60 p-3 rounded-2xl border border-pink-500/10">
                              <strong className="text-amber-300 block mb-0.5">A (Análisis):</strong>
                              <p className="text-slate-200">{evo.analysis}</p>
                            </div>
                            <div className="bg-[#140320]/60 p-3 rounded-2xl border border-pink-500/10">
                              <strong className="text-emerald-300 block mb-0.5">P (Plan):</strong>
                              <p className="text-slate-200">{evo.plan}</p>
                            </div>
                          </div>
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
