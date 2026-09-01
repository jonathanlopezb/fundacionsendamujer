'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope, Activity, FileText, CheckCircle2, User, Calendar, Plus,
  Lock, Search, Filter, ShieldAlert, LogOut, KeyRound, DollarSign, Award,
  Clock, Info, Shield, Scale, HeartPulse, Brain, Home, Eye, Check,
  AlertTriangle, ChevronRight, UserCheck, RefreshCw, X, Printer, FilePlus,
  Pill, AlertCircle, Phone, MapPin, Hash, Sparkles, FolderOpen, Heart
} from 'lucide-react';
import IPSCMeasurementForm from '@/components/caribe-seguro/IPSCMeasurementForm';
import DeteriorationAlertsPanel from '@/components/caribe-seguro/DeteriorationAlertsPanel';
import ObservatoryManager from '@/components/caribe-seguro/ObservatoryManager';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export type ProfessionalRole = 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO' | 'COORDINADOR';

interface ProfessionalProfile {
  id: string;
  name: string;
  role: ProfessionalRole;
  roleTitle: string;
  specialty: string;
  code: string;
  rethus: string;
  avatarBg: string;
  badgeColor: string;
}

const DEMO_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: 'PROF-101',
    name: 'Dra. Elena Ruiz',
    role: 'MEDICO',
    roleTitle: 'Médica Especialista en Ginecología & Obstetricia',
    specialty: 'Salud Reproductiva & Ecografía Pélvica',
    code: 'MED-7712',
    rethus: 'RETHUS 1047892-BOL',
    avatarBg: 'bg-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'PROF-102',
    name: 'Lic. Sorelvis Murillo',
    role: 'TRABAJO_SOCIAL',
    roleTitle: 'Directora & Trabajadora Social de Territorio',
    specialty: 'Acompañamiento Domiciliario & Proyectos',
    code: 'SOC-4401',
    rethus: 'RETHUS 99281-TS-COL',
    avatarBg: 'bg-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'PROF-103',
    name: 'Dra. Patricia Herrera',
    role: 'JURIDICO',
    roleTitle: 'Abogada Especialista en VBG & Ley 1257 de 2008',
    specialty: 'Derecho de Familia & Medidas de Protección',
    code: 'JUR-9923',
    rethus: 'TP 204918-CSJ',
    avatarBg: 'bg-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'PROF-104',
    name: 'Lic. Claudia Morales',
    role: 'PSICOLOGO',
    roleTitle: 'Psicóloga Clínica & Salud Mental',
    specialty: 'Contención Emocional & Trauma de Género',
    code: 'PSI-3320',
    rethus: 'COLPSIC 449102-PSI',
    avatarBg: 'bg-pink-600',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
  },
  {
    id: 'PROF-100',
    name: 'Dra. Sorelvis Murillo (Supervisión)',
    role: 'COORDINADOR',
    roleTitle: 'Coordinación Territorial Caribe Seguro',
    specialty: 'Supervisión Multidisciplinaria & Casos',
    code: 'ADM-0001',
    rethus: 'DIR-SENDA-2026',
    avatarBg: 'bg-amber-600',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
];

export interface ClinicalEvolutionNote {
  id: string;
  date: string;
  time: string;
  author: string;
  role: ProfessionalRole;
  rethus: string;
  subjective: string; // S
  objective: string;  // O
  analysis: string;   // A (Diagnóstico CIE-10 / Evaluativo)
  plan: string;       // P (Plan de tratamiento)
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
    primaryCategory: 'MEDICO',
    assignedDoctor: 'Dra. Elena Ruiz',
    status: 'RUTA_ACTIVADA',
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: 74,
      weightKg: 62,
      heightM: 1.62,
      bmi: 23.6,
      tempC: 36.6,
    },
    evolutions: [
      {
        id: 'EVO-101',
        date: '2026-09-01',
        time: '09:30 AM',
        author: 'Dra. Elena Ruiz',
        role: 'MEDICO',
        rethus: 'RETHUS 1047892-BOL',
        subjective: 'Paciente gestante de 14 semanas que acude a control prenatal especializado. Refiere leve náusea matutina, sin sangrado transvaginal ni dolor pélvico.',
        objective: 'Paciente consciente, orientada. AU: 12 cm. FCF: 148 lpm audible con Doppler. Ecografía pélvica demuestra feto único vivo con crecimiento adecuado para edad gestacional.',
        analysis: 'Supervisión de embarazo normal de 14 semanas. Diagnóstico CIE-10: Z34.8 (Supervisión de otros embarazos normales).',
        plan: '1. Continuar Micronutrientes (Ácido Fólico 1mg/día + Sulfato Ferroso 300mg/día). 2. Solicitar Ecografía Morfológica de Nivel II para semana 20. 3. Cita de control en 4 semanas.',
        cie10Code: 'Z34.8',
      },
      {
        id: 'EVO-100',
        date: '2026-08-20',
        time: '02:15 PM',
        author: 'Lic. Sorelvis Murillo',
        role: 'TRABAJO_SOCIAL',
        rethus: 'RETHUS 99281-TS-COL',
        subjective: 'Entrevista domiciliaria en sector Pie de la Popa. Usuaria manifiesta deseo de iniciar emprendimiento de confección textil para asegurar autonomía económica.',
        objective: 'Entorno familiar seguro, red de apoyo materna presente. Cumple con los requisitos del programa Proyecto de Vida.',
        analysis: 'Elegible para vinculación al Fondo Capital Semilla de $2.500.000 COP.',
        plan: '1. Entrega de máquina fileteadora industrial e insumos textiles. 2. Inscripción en módulo de Finanzas de SendaAcademia.',
      },
    ],
    prescriptions: [
      { id: 'RX-1', date: '2026-09-01', medication: 'Ácido Fólico 1mg Tab', dosage: '1 tableta vía oral cada 24 horas (Mañanas)', duration: '90 días', doctor: 'Dra. Elena Ruiz' },
      { id: 'RX-2', date: '2026-09-01', medication: 'Sulfato Ferroso 300mg Tab', dosage: '1 tableta vía oral cada 24 horas con jugo de cítricos', duration: '90 días', doctor: 'Dra. Elena Ruiz' },
    ],
    routesActivated: [
      { routeName: 'Atención Médica Prenatal Preferencial', date: '2026-08-15', status: 'COMPLETADA', entity: 'Sede Cartagena Senda Mujer' },
      { routeName: 'Capital Semilla Emprendimiento Textil ($2.5M)', date: '2026-08-20', status: 'EN_EJECUCION', entity: 'Fundación Senda Mujer' },
    ],
    documents: [
      { name: 'Ecografía_Obstétrica_14S.pdf', date: '2026-09-01', category: 'Ecografía' },
      { name: 'Acta_Entrega_Capital_Semilla.pdf', date: '2026-08-20', category: 'Acta Legal' },
      { name: 'Hemograma_Y_Uroanálisis.pdf', date: '2026-08-15', category: 'Laboratorio' },
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
    primaryCategory: 'JURIDICO',
    assignedDoctor: 'Dra. Patricia Herrera',
    status: 'EN_ORIENTACION',
    vitals: {
      bloodPressure: '135/85 mmHg',
      heartRate: 88,
      weightKg: 58,
      heightM: 1.58,
      bmi: 23.2,
      tempC: 36.5,
    },
    evolutions: [
      {
        id: 'EVO-201',
        date: '2026-08-30',
        time: '11:00 AM',
        author: 'Dra. Patricia Herrera',
        role: 'JURIDICO',
        rethus: 'TP 204918-CSJ',
        subjective: 'Usuaria solicita asesoría por violencia intrafamiliar y hostigamiento psicológico recurrente por parte de expareja.',
        objective: 'Se evidencia perturbación emocional. Se radican medidas de protección bajo el Amparo de la Ley 1257 de 2008 ante la Comisaría de Familia Chiquinquirá.',
        analysis: 'Situación de vulnerabilidad jurídica que requiere medida cautelar urgente de desalojo y prohibición de acercamiento.',
        plan: '1. Radicar Medida de Protección Prioritaria. 2. Coordinación con la Patrulla Púrpura (Línea 155). 3. Remisión a Psicología.',
        cie10Code: 'Z65.9',
      },
    ],
    prescriptions: [],
    routesActivated: [
      { routeName: 'Medida de Protección Ley 1257 de 2008', date: '2026-08-30', status: 'ACTIVADA', entity: 'Comisaría de Familia Chiquinquirá' },
      { routeName: 'Patrulla Púrpura Alarma Preventiva', date: '2026-08-30', status: 'ACTIVADA', entity: 'Policía Nacional Cartagena' },
    ],
    documents: [
      { name: 'Copia_Denuncia_Comisaria.pdf', date: '2026-08-30', category: 'Denuncia Legal' },
      { name: 'Ficha_Caracterizacion_VBG.pdf', date: '2026-08-28', category: 'Evaluación' },
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
    primaryCategory: 'TRABAJO_SOCIAL',
    assignedDoctor: 'Lic. Sorelvis Murillo',
    status: 'EN_SEGUIMIENTO',
    vitals: {
      bloodPressure: '118/75 mmHg',
      heartRate: 70,
      weightKg: 65,
      heightM: 1.65,
      bmi: 23.8,
      tempC: 36.4,
    },
    evolutions: [
      {
        id: 'EVO-301',
        date: '2026-08-28',
        time: '04:00 PM',
        author: 'Lic. Sorelvis Murillo',
        role: 'TRABAJO_SOCIAL',
        rethus: 'RETHUS 99281-TS-COL',
        subjective: 'Seguimiento mensual del proyecto taller textil Olaya Herrera.',
        objective: 'Producción activa con 140 prendas confeccionadas y ventas locales por $1.250.000 COP en el último mes.',
        analysis: 'Alto grado de autonomía económica lograda.',
        plan: '1. Continuar participación en la Feria de Emprendimiento Senda. 2. Cita de seguimiento en 30 días.',
      },
    ],
    prescriptions: [],
    routesActivated: [
      { routeName: 'Capacitación en WhatsApp Business SendaAcademia', date: '2026-08-10', status: 'COMPLETADA', entity: 'SendaAcademia' },
    ],
    documents: [
      { name: 'Balance_Ventas_Agosto2026.pdf', date: '2026-08-28', category: 'Informe Financiero' },
    ],
  },
];

export default function AdminManagementPanel({ onOpenSOS }: { onOpenSOS?: () => void }) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile>(DEMO_PROFESSIONALS[0]);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active EHR Patient Selection
  const [patients, setPatients] = useState<PatientEHR[]>(INITIAL_PATIENTS_EHR);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS_EHR[0].id);
  const [ehrTab, setEhrTab] = useState<'evoluciones' | 'prescripcion' | 'rutas' | 'documentos' | 'ipsc'>('evoluciones');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // Form New SOAP Evolution
  const [newSoapSubjective, setNewSoapSubjective] = useState('');
  const [newSoapObjective, setNewSoapObjective] = useState('');
  const [newSoapAnalysis, setNewSoapAnalysis] = useState('');
  const [newSoapPlan, setNewSoapPlan] = useState('');
  const [newCie10, setNewCie10] = useState('');

  // Form New Prescription
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedDuration, setNewMedDuration] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAuth = sessionStorage.getItem('senda_admin_auth') === 'true';
    const storedProfId = sessionStorage.getItem('senda_prof_id');

    if (isAuth) {
      setIsAdminAuth(true);
      if (storedProfId) {
        const prof = DEMO_PROFESSIONALS.find((p) => p.id === storedProfId);
        if (prof) setSelectedProfessional(prof);
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Por favor ingresa tu usuario y contraseña institucional.');
      return;
    }
    setIsAdminAuth(true);
    sessionStorage.setItem('senda_admin_auth', 'true');
    sessionStorage.setItem('senda_prof_id', selectedProfessional.id);
  };

  const handleQuickDemoLogin = (prof: ProfessionalProfile) => {
    setSelectedProfessional(prof);
    setUsernameInput(prof.code.toLowerCase());
    setPasswordInput('senda2026');
    setIsAdminAuth(true);
    sessionStorage.setItem('senda_admin_auth', 'true');
    sessionStorage.setItem('senda_prof_id', prof.id);
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('senda_admin_auth');
    sessionStorage.removeItem('senda_prof_id');
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAddSoapEvolution = (e: React.FormEvent) => {
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

    const updatedPatients = patients.map((p) => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          evolutions: [newEvo, ...p.evolutions],
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    setNewSoapSubjective('');
    setNewSoapObjective('');
    setNewSoapAnalysis('');
    setNewSoapPlan('');
    setNewCie10('');
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newMedDosage) return;

    const newRx = {
      id: `RX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      medication: newMedName,
      dosage: newMedDosage,
      duration: newMedDuration || 'Según evolución',
      doctor: selectedProfessional.name,
    };

    const updatedPatients = patients.map((p) => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          prescriptions: [newRx, ...p.prescriptions],
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedDuration('');
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.patientName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.docId.includes(patientSearchQuery)
  );

  return (
    <div className="min-h-screen bg-[#0F0218] text-slate-100 font-sans selection:bg-[#E12880] selection:text-white">
      {!isAdminAuth ? (
        /* PANTALLA DE INICIO DE SESIÓN PROFESIONAL */
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F0218] via-[#1A042B] to-[#31084A]">
          <div className="max-w-md w-full bg-white/95 text-slate-900 rounded-3xl p-8 shadow-2xl border border-pink-500/30 backdrop-blur-xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E12880] to-[#52166F] rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
                <Stethoscope className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-black text-[#52166F]">Sistema Clínico EHR Senda</h1>
              <p className="text-xs text-slate-500 font-semibold">
                Plataforma Médica & Gestión de Historias Clínicas Electrónicas
              </p>
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
                  Rol Profesional *
                </label>
                <select
                  value={selectedProfessional.id}
                  onChange={(e) => {
                    const prof = DEMO_PROFESSIONALS.find((p) => p.id === e.target.value);
                    if (prof) setSelectedProfessional(prof);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                >
                  {DEMO_PROFESSIONALS.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name} — {prof.roleTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Usuario Institucional *
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="ej: elena.ruiz@sendamujer.org"
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
                className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] hover:to-[#42105a] text-white font-black py-3.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                Ingresar al Expediente Clínico (EHR)
              </button>
            </form>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">
                Acceso Rápido Demo Médico:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_PROFESSIONALS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleQuickDemoLogin(p)}
                    className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 text-left text-[11px] font-bold text-[#52166F] truncate cursor-pointer transition-colors"
                  >
                    {p.name.split(' ')[0]} {p.name.split(' ')[1]} ({p.role})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PLATAFORMA MÉDICA Y SISTEMA DE HISTORIA CLÍNICA EHR COMPLETO */
        <div className="flex flex-col min-h-screen">
          
          {/* HEADER CLÍNICO TOPBAR */}
          <header className="bg-[#140320] border-b border-pink-500/20 px-6 py-3 sticky top-0 z-40 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E12880] to-amber-400 flex items-center justify-center text-white font-black shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                  <span>Plataforma Médica EHR Senda</span>
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                    Sistema Activo
                  </span>
                </h1>
                <p className="text-[10px] text-pink-200/70">
                  Fundación Senda Mujer • Cartagena | Cumplimiento Ley 1581 & Resolución 839/2019
                </p>
              </div>
            </div>

            {/* Datos del Profesional en Sesión */}
            <div className="flex items-center gap-4">
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
                onClick={() => window.print()}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
                title="Imprimir Historia Clínica"
              >
                <Printer className="w-4 h-4 text-pink-300" />
                <span className="hidden sm:inline">Imprimir PDF</span>
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </header>

          {/* WORKSPACE CLÍNICO CON VISTA DIVIDIDA (PACIENTES + EXPEDIENTE) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* SIDEBAR IZQUIERDO: LISTADO DE PACIENTES ASIGNADAS */}
            <aside className="w-full md:w-80 bg-[#140320]/80 border-r border-pink-500/20 p-4 space-y-4 shrink-0 flex flex-col">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#E12880]" />
                  Pacientes Asignadas ({filteredPatients.length})
                </h3>
              </div>

              {/* Buscador de Paciente */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                  placeholder="Nombre, Cédula o Código..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#240538] border border-pink-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E12880]"
                />
              </div>

              {/* Lista de Tarjetas de Pacientes */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {filteredPatients.map((p) => {
                  const isSelected = p.id === selectedPatient.id;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 relative ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#E12880]/30 to-[#52166F]/80 border-[#E12880] text-white shadow-lg ring-1 ring-[#E12880]'
                          : 'bg-[#1C052B]/60 border-pink-500/20 text-slate-300 hover:bg-[#250738]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-black text-xs text-white">{p.patientName}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          p.riskLevel === 'ALTO' || p.riskLevel === 'CRITICO' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {p.riskLevel}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-pink-200/70 font-mono">
                        <span>C.C. {p.docId}</span>
                        <span className="text-amber-300 font-extrabold">{p.patientCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                        <span>IPSC: {p.ipscScore}/100</span>
                        <span>{p.evolutions.length} evoluciones</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* PANEL PRINCIPAL DERECHO: EXPEDIENTE CLÍNICO DE LA PACIENTE SELECCIONADA */}
            <main className="flex-1 bg-[#1A042B] p-6 overflow-y-auto space-y-6">
              
              {/* CARD SUPERIOR DETALLES PACIENTE & SIGNOS VITALES */}
              <div className="bg-gradient-to-r from-[#2B0642] via-[#3B0852] to-[#1A042B] rounded-3xl p-6 border border-pink-500/30 shadow-2xl space-y-6">
                
                {/* Encabezado Paciente */}
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
                        C.C. {selectedPatient.docId} • {selectedPatient.age} años ({selectedPatient.birthDate}) • Sangre: <strong className="text-white">{selectedPatient.bloodType}</strong> • EPS: <strong className="text-white">{selectedPatient.eps}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-extrabold text-pink-300 uppercase tracking-widest">ÍNDICE DE PROTECCIÓN IPSC</span>
                    <div className="text-3xl font-black text-amber-300">{selectedPatient.ipscScore}<span className="text-sm text-pink-200">/100</span></div>
                    <span className="text-[10px] text-emerald-400 font-extrabold">● Evolución Positiva</span>
                  </div>
                </div>

                {/* Fila de Signos Vitales & Datos Críticos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
                  <div className="bg-[#180325] p-3 rounded-2xl border border-pink-500/20 text-center col-span-2 sm:col-span-2">
                    <span className="text-[9px] font-black text-red-400 uppercase block">Alergias Conocidas</span>
                    <span className="text-xs font-bold text-red-300 truncate block">{selectedPatient.allergies}</span>
                  </div>
                </div>

                <div className="text-xs text-pink-200/80 flex flex-wrap justify-between gap-2 pt-1 border-t border-pink-500/10">
                  <span>📍 Residencia: <strong>{selectedPatient.neighborhood}</strong></span>
                  <span>📞 Contacto Emergencia: <strong>{selectedPatient.emergencyContact}</strong></span>
                </div>
              </div>

              {/* TABS NAVEGACIÓN DENTRO DE LA HISTORIA CLÍNICA */}
              <div className="flex space-x-2 border-b border-pink-500/20 pb-2 overflow-x-auto">
                {[
                  { id: 'evoluciones', label: '🩺 Evoluciones Clínicas (SOAP)', icon: Activity },
                  { id: 'prescripcion', label: '💊 Prescripción & Fórmulas', icon: Pill },
                  { id: 'rutas', label: '🏛️ Rutas Activadas & Entidad', icon: Shield },
                  { id: 'documentos', label: '📁 Exámenes & Bóveda Evidencias', icon: FileText },
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

              {/* ── TAB 1: EVOLUCIONES CLÍNICAS (SOAP) ────────────────────────────── */}
              {ehrTab === 'evoluciones' && (
                <div className="space-y-6">
                  
                  {/* FORMULARIO REGISTRAR EVOLUCIÓN SOAP */}
                  <form onSubmit={handleAddSoapEvolution} className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4 shadow-xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <FilePlus className="w-4 h-4 text-amber-300" />
                      Registrar Nueva Evolución Clínica en Formato SOAP
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">S — Subjetivo (Relato de la Paciente) *</label>
                        <textarea
                          value={newSoapSubjective}
                          onChange={(e) => setNewSoapSubjective(e.target.value)}
                          placeholder="Síntomas, inquietudes o relato expresado por la usuaria..."
                          rows={2}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">O — Objetivo (Examen Físico / Hallazgos)</label>
                        <textarea
                          value={newSoapObjective}
                          onChange={(e) => setNewSoapObjective(e.target.value)}
                          placeholder="Signos físicos, ecografía, auscultación, estado emocional o jurídico..."
                          rows={2}
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">A — Análisis / Diagnóstico (CIE-10 / Evaluativo) *</label>
                        <textarea
                          value={newSoapAnalysis}
                          onChange={(e) => setNewSoapAnalysis(e.target.value)}
                          placeholder="Juicio clínico o diagnóstico (ej: Z34.8 Supervisión de Embarazo Normal)..."
                          rows={2}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">P — Plan & Conducta a Seguir *</label>
                        <textarea
                          value={newSoapPlan}
                          onChange={(e) => setNewSoapPlan(e.target.value)}
                          placeholder="Formulación, solicitud de exámenes, remisiones o activación de rutas..."
                          rows={2}
                          required
                          className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-pink-200">Código CIE-10 (Opcional):</span>
                        <input
                          type="text"
                          value={newCie10}
                          onChange={(e) => setNewCie10(e.target.value)}
                          placeholder="ej: Z34.8"
                          className="px-3 py-1 rounded-lg bg-[#140320] border border-pink-500/30 text-xs text-amber-300 font-mono w-28"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6e] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Firmar & Guardar en Historia Clínica</span>
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
                        <div className="flex justify-between items-start flex-wrap gap-2 border-b border-pink-500/20 pb-3">
                          <div>
                            <span className="text-xs font-black text-amber-300">{evo.author}</span>
                            <span className="text-[10px] text-pink-200 font-mono ml-2">({evo.rethus})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {evo.date} • {evo.time}
                          </div>
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
                            <strong className="text-amber-300 block mb-0.5">A (Análisis / Diagnóstico):</strong>
                            <p className="text-slate-200">{evo.analysis}</p>
                          </div>
                          <div className="bg-[#140320]/60 p-3 rounded-2xl border border-pink-500/10">
                            <strong className="text-emerald-300 block mb-0.5">P (Plan & Tratamiento):</strong>
                            <p className="text-slate-200">{evo.plan}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ── TAB 2: PRESCRIPCIÓN & FÓRMULAS MÉDICAS ────────────────────────── */}
              {ehrTab === 'prescripcion' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddPrescription} className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-400" />
                      Expedir Nueva Fórmula Médica / Prescripción
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Medicamento / Insumo *</label>
                        <input
                          type="text"
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          placeholder="ej: Ácido Fólico 1mg Tab"
                          required
                          className="w-full p-2.5 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Posología & Vía *</label>
                        <input
                          type="text"
                          value={newMedDosage}
                          onChange={(e) => setNewMedDosage(e.target.value)}
                          placeholder="ej: 1 tableta VO cada 24 horas"
                          required
                          className="w-full p-2.5 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-pink-300 mb-1">Duración Tratamiento</label>
                        <input
                          type="text"
                          value={newMedDuration}
                          onChange={(e) => setNewMedDuration(e.target.value)}
                          placeholder="ej: 30 días"
                          className="w-full p-2.5 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer">
                        Agregar a Fórmula Médica
                      </button>
                    </div>
                  </form>

                  {/* LISTADO DE FÓRMULAS EXPEDIDAS */}
                  <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                    <h4 className="font-black text-xs text-white uppercase tracking-widest">Fórmulas Expedidas</h4>
                    <div className="space-y-3">
                      {selectedPatient.prescriptions.map((rx) => (
                        <div key={rx.id} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-black text-emerald-300 text-sm">{rx.medication}</span>
                            <p className="text-slate-300">{rx.dosage} • Duración: {rx.duration}</p>
                            <span className="text-[10px] text-pink-200/60 block">Recetado por: {rx.doctor} • {rx.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: RUTAS ACTIVADAS ────────────────────────────────────────── */}
              {ehrTab === 'rutas' && (
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Rutas & Remisiones Institucionales Activadas</h3>
                  <div className="space-y-3">
                    {selectedPatient.routesActivated.map((r, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-black text-amber-300 text-sm">{r.routeName}</span>
                          <span className="text-slate-400 block">Entidad Responsable: {r.entity} • {r.date}</span>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 4: BÓVEDA DE EXÁMENES & EVIDENCIAS ───────────────────────── */}
              {ehrTab === 'documentos' && (
                <div className="bg-[#240538] rounded-3xl p-6 border border-pink-500/20 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Bóveda Cifrada de Exámenes & Documentos</h3>
                  <div className="space-y-3">
                    {selectedPatient.documents.map((doc, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#140320] border border-pink-500/20 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#E12880]" />
                          <div>
                            <span className="font-black text-white">{doc.name}</span>
                            <span className="text-[10px] text-pink-200/60 block">{doc.category} • {doc.date}</span>
                          </div>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded-lg text-xs">
                          Visualizar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      )}
    </div>
  );
}
