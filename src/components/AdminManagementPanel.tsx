'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Stethoscope, Activity, FileText, CheckCircle2, User,
  Calendar, Plus, Lock, Search, Filter, ShieldAlert, LogOut, KeyRound,
  DollarSign, Award, Clock, Info, Shield, Scale, HeartPulse, Brain,
  Home, Eye, Check, AlertTriangle, ChevronRight, UserCheck, RefreshCw, X
} from 'lucide-react';
import IPSCMeasurementForm from '@/components/caribe-seguro/IPSCMeasurementForm';
import DeteriorationAlertsPanel from '@/components/caribe-seguro/DeteriorationAlertsPanel';
import ObservatoryManager from '@/components/caribe-seguro/ObservatoryManager';

interface AdminManagementPanelProps {
  onOpenSOS?: () => void;
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export type ProfessionalRole = 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO' | 'COORDINADOR';

interface ProfessionalProfile {
  id: string;
  name: string;
  role: ProfessionalRole;
  roleTitle: string;
  specialty: string;
  code: string;
  avatarBg: string;
  badgeColor: string;
}

const DEMO_PROFESSIONALS: ProfessionalProfile[] = [
  {
    id: 'PROF-101',
    name: 'Dra. Elena Ruiz',
    role: 'MEDICO',
    roleTitle: 'Especialista en Ginecología & Salud Reproductiva',
    specialty: 'Ginecología & Obstetricia',
    code: 'MED-7712',
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
    avatarBg: 'bg-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'PROF-103',
    name: 'Dra. Patricia Herrera',
    role: 'JURIDICO',
    roleTitle: 'Abogada Especialista en VBG & Ley 1257',
    specialty: 'Derecho de Familia & Medidas de Protección',
    code: 'JUR-9923',
    avatarBg: 'bg-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'PROF-104',
    name: 'Lic. Claudia Morales',
    role: 'PSICOLOGO',
    roleTitle: 'Psicóloga Clínica & Salud Mental',
    specialty: 'Contención Emocional & Trauma',
    code: 'PSI-3320',
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
    avatarBg: 'bg-amber-600',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
];

interface PatientCase {
  id: string;
  patientCode: string;
  patientName: string;
  docId: string;
  phone: string;
  neighborhood: string;
  primaryCategory: 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO';
  assignedProfessional: string;
  status: 'NUEVA' | 'EN_ORIENTACION' | 'RUTA_ACTIVADA' | 'EN_SEGUIMIENTO' | 'COMPLETADA';
  ipscScore: number;
  lastUpdate: string;
  medicalSummary?: string;
  socialSummary?: string;
  legalSummary?: string;
  psychologicalSummary?: string;
}

const INITIAL_PATIENTS: PatientCase[] = [
  {
    id: 'CASE-2026-001',
    patientCode: 'CSM-2026-000481',
    patientName: 'María Alejandra Torres',
    docId: '1.047.892.411',
    phone: '+57 300 489 1120',
    neighborhood: 'Pie de la Popa, Cartagena',
    primaryCategory: 'MEDICO',
    assignedProfessional: 'Dra. Elena Ruiz',
    status: 'RUTA_ACTIVADA',
    ipscScore: 68,
    lastUpdate: '2026-09-01',
    medicalSummary: 'Ecografía obstétrica de control realizada. Parámetros fetales normales. Se expide orden de ecografía morfológica.',
    socialSummary: 'Visita domiciliaria completada. Se vincula al programa de emprendimiento textil con entrega de máquina fileteadora.',
    legalSummary: 'Asesoría preventiva sobre derechos de filiación y cuota alimentaria.',
    psychologicalSummary: 'Sesión de contención emocional por estrés de embarazo. Buena respuesta a ejercicios de relajación.',
  },
  {
    id: 'CASE-2026-002',
    patientCode: 'CSM-2026-000482',
    patientName: 'Valeria Castro',
    docId: '1.050.441.982',
    phone: '+57 312 901 8843',
    neighborhood: 'Chiquinquirá, Cartagena',
    primaryCategory: 'JURIDICO',
    assignedProfessional: 'Dra. Patricia Herrera',
    status: 'EN_ORIENTACION',
    ipscScore: 42,
    lastUpdate: '2026-08-30',
    medicalSummary: 'Remisión a consulta médica general por cefalea tensional recurrente.',
    socialSummary: 'Evaluación sociofamiliar. Requiere acompañamiento prioritario en vivienda y subsidio de alimentación.',
    legalSummary: 'Medida de protección radicada ante la Comisaría de Familia Chiquinquirá bajo Ley 1257 de 2008. Alarma activa.',
    psychologicalSummary: 'Acompañamiento en crisis inicial. Plan de seguridad digital y personal establecido.',
  },
  {
    id: 'CASE-2026-003',
    patientCode: 'CSM-2026-000483',
    patientName: 'Carolina Mendoza',
    docId: '1.143.902.118',
    phone: '+57 301 554 9901',
    neighborhood: 'Olaya Herrera, Cartagena',
    primaryCategory: 'TRABAJO_SOCIAL',
    assignedProfessional: 'Lic. Sorelvis Murillo',
    status: 'EN_SEGUIMIENTO',
    ipscScore: 74,
    lastUpdate: '2026-08-28',
    medicalSummary: 'Chequeo profiláctico odontológico y valoración nutricional.',
    socialSummary: 'Visita de seguimiento a micronegocio de confección textil. Desembolso de Capital Semilla $2.500.000 COP ejecutado al 100%.',
    legalSummary: 'Sin requerimientos jurídicos activos actualmente.',
    psychologicalSummary: 'Asistencia constante a grupos de apoyo de empoderamiento comunitario Senda.',
  },
  {
    id: 'CASE-2026-004',
    patientCode: 'CSM-2026-000484',
    patientName: 'Diana Marcela Gómez',
    docId: '1.048.223.109',
    phone: '+57 318 765 4321',
    neighborhood: 'El Pozón, Cartagena',
    primaryCategory: 'PSICOLOGO',
    assignedProfessional: 'Lic. Claudia Morales',
    status: 'NUEVA',
    ipscScore: 51,
    lastUpdate: '2026-09-01',
    medicalSummary: 'Pendiente primera valoración médica ginecológica.',
    socialSummary: 'Caracterización inicial del hogar registrada a través del SendaWizard.',
    legalSummary: 'Orientación preliminar en derechos económicos y patrimoniales.',
    psychologicalSummary: 'Triaje psicológico completado. Se programa primera cita presencial.',
  },
];

export default function AdminManagementPanel({ onOpenSOS }: AdminManagementPanelProps) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalProfile>(DEMO_PROFESSIONALS[0]);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'pacientes' | 'citas' | 'historias' | 'documentos' | 'capital' | 'caribe-seguro'>('pacientes');

  // Filter & Search State for Patients
  const [patientSearch, setPatientSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'TODAS' | 'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO'>('TODAS');
  const [selectedPatientModal, setSelectedPatientModal] = useState<PatientCase | null>(null);

  // Note addition in Modal
  const [newNoteCategory, setNewNoteCategory] = useState<'MEDICO' | 'TRABAJO_SOCIAL' | 'JURIDICO' | 'PSICOLOGO'>('MEDICO');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Patient List State
  const [patients, setPatients] = useState<PatientCase[]>(INITIAL_PATIENTS);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAuth = sessionStorage.getItem('senda_admin_auth') === 'true';
    const loginTime = sessionStorage.getItem('senda_admin_login_time');
    const storedProfId = sessionStorage.getItem('senda_prof_id');

    if (isAuth && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed < TWO_HOURS_MS) {
        setIsAdminAuth(true);
        if (storedProfId) {
          const prof = DEMO_PROFESSIONALS.find((p) => p.id === storedProfId);
          if (prof) setSelectedProfessional(prof);
        }
      } else {
        sessionStorage.removeItem('senda_admin_auth');
        sessionStorage.removeItem('senda_admin_login_time');
      }
    }
  }, []);

  useEffect(() => {
    if (!isAdminAuth) return;

    sessionStorage.setItem('senda_admin_auth', 'true');
    sessionStorage.setItem('senda_prof_id', selectedProfessional.id);
    if (!sessionStorage.getItem('senda_admin_login_time')) {
      sessionStorage.setItem('senda_admin_login_time', Date.now().toString());
    }

    const checkInterval = setInterval(() => {
      const storedTime = sessionStorage.getItem('senda_admin_login_time');
      if (storedTime) {
        const elapsed = Date.now() - parseInt(storedTime, 10);
        if (elapsed >= TWO_HOURS_MS) {
          handleLogoutDueToTimeout();
        }
      }
    }, 30000);

    const autoLogoutTimer = setTimeout(() => {
      handleLogoutDueToTimeout();
    }, TWO_HOURS_MS);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(autoLogoutTimer);
    };
  }, [isAdminAuth, selectedProfessional]);

  const handleLogoutDueToTimeout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('senda_admin_auth');
    sessionStorage.removeItem('senda_admin_login_time');
    sessionStorage.removeItem('senda_prof_id');
    setSessionExpiredNotice(true);
    setAdminError('Tu sesión profesional ha expirado por límite de seguridad (2 horas). Por favor ingresa de nuevo.');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('senda_admin_auth');
    sessionStorage.removeItem('senda_admin_login_time');
    sessionStorage.removeItem('senda_prof_id');
    setAdminUser('');
    setAdminPass('');
    setAdminError('');
    setSessionExpiredNotice(false);
  };

  const triggerSOS = () => {
    if (onOpenSOS) {
      onOpenSOS();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsAdminAuth(true);
  };

  const handleQuickDemoLogin = (prof: ProfessionalProfile) => {
    setSelectedProfessional(prof);
    setIsAdminAuth(true);
  };

  const handleAddNoteToPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientModal || !newNoteContent.trim()) return;

    const updatedPatients = patients.map((p) => {
      if (p.id === selectedPatientModal.id) {
        const fieldKey =
          newNoteCategory === 'MEDICO'
            ? 'medicalSummary'
            : newNoteCategory === 'TRABAJO_SOCIAL'
            ? 'socialSummary'
            : newNoteCategory === 'JURIDICO'
            ? 'legalSummary'
            : 'psychologicalSummary';

        return {
          ...p,
          lastUpdate: new Date().toISOString().split('T')[0],
          [fieldKey]: `${p[fieldKey] ? p[fieldKey] + ' — ' : ''}[${new Date().toLocaleDateString('es-CO')}] ${newNoteContent}`,
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    const updatedModal = updatedPatients.find((p) => p.id === selectedPatientModal.id) || null;
    setSelectedPatientModal(updatedModal);
    setNewNoteContent('');
  };

  // Filtering patients logic
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.patientName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.docId.includes(patientSearch);

    const matchesCategory =
      categoryFilter === 'TODAS' || p.primaryCategory === categoryFilter;

    // Role-based visibility scoping
    if (selectedProfessional.role === 'COORDINADOR') return matchesSearch && matchesCategory;
    if (selectedProfessional.role === 'MEDICO' && categoryFilter === 'TODAS') return matchesSearch;
    if (selectedProfessional.role === 'JURIDICO' && categoryFilter === 'TODAS') return matchesSearch;
    if (selectedProfessional.role === 'TRABAJO_SOCIAL' && categoryFilter === 'TODAS') return matchesSearch;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {!isAdminAuth ? (
        /* LOGIN / SELECCIÓN DE ROL PROFESIONAL */
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-6 sm:p-8 text-center relative">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-white/20 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase border border-white/20">
                  Caribe Seguro • Sistema Operativo
                </span>
                <button
                  type="button"
                  onClick={triggerSOS}
                  className="bg-amber-400 text-senda-purple-dark font-black text-[11px] px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>CAMUFLAJE [ESC]</span>
                </button>
              </div>

              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                <Stethoscope className="w-8 h-8 text-amber-300" />
              </div>

              <h2 className="text-2xl font-black">Portal Profesional Multidisciplinario</h2>
              <p className="text-xs text-pink-100 mt-1 max-w-md mx-auto">
                Acceso seguro para Médicas, Trabajadoras Sociales, Abogadas VBG, Psicólogas y Coordinadores.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
                  Selecciona tu Perfil Profesional para Ingresar:
                </label>
                <div className="space-y-2.5">
                  {DEMO_PROFESSIONALS.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => handleQuickDemoLogin(prof)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer group ${
                        selectedProfessional.id === prof.id
                          ? 'border-[#E12880] bg-pink-50/60 ring-2 ring-[#E12880]/30 shadow-md'
                          : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${prof.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                          {prof.role === 'MEDICO' && <Stethoscope className="w-5 h-5" />}
                          {prof.role === 'TRABAJO_SOCIAL' && <Home className="w-5 h-5" />}
                          {prof.role === 'JURIDICO' && <Scale className="w-5 h-5" />}
                          {prof.role === 'PSICOLOGO' && <Brain className="w-5 h-5" />}
                          {prof.role === 'COORDINADOR' && <Shield className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#52166F]">
                            {prof.name}
                          </h4>
                          <p className="text-xs text-slate-500">{prof.roleTitle}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${prof.badgeColor}`}>
                        {prof.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Ley 1581 de 2012 (Habeas Data):</strong> Todas las consultas quedan registradas en el sistema de auditoría. La sesión expira automáticamente tras 120 minutos de inactividad o al cerrar la pestaña.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD AUTENTICADO DE PROFESIONAL */
        <div className="space-y-8 animate-fadeIn">
          {/* HEADER DEL PANEL */}
          <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${selectedProfessional.avatarBg} text-white flex items-center justify-center font-bold shadow-md shrink-0 border-2 border-white/30`}>
                {selectedProfessional.role === 'MEDICO' && <Stethoscope className="w-7 h-7" />}
                {selectedProfessional.role === 'TRABAJO_SOCIAL' && <Home className="w-7 h-7" />}
                {selectedProfessional.role === 'JURIDICO' && <Scale className="w-7 h-7" />}
                {selectedProfessional.role === 'PSICOLOGO' && <Brain className="w-7 h-7" />}
                {selectedProfessional.role === 'COORDINADOR' && <Shield className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${selectedProfessional.badgeColor}`}>
                    Rol Activo: {selectedProfessional.role}
                  </span>
                  <span className="text-[10px] font-mono text-pink-200">ID: {selectedProfessional.code}</span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1">{selectedProfessional.name}</h1>
                <p className="text-xs text-pink-100">{selectedProfessional.roleTitle} • Fundación Senda Mujer Cartagena</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={triggerSOS}
                className="bg-amber-400 hover:bg-amber-300 text-senda-purple-dark font-black px-4 py-2 rounded-full text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>CAMUFLAJE [ESC]</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/30 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* TABS DE NAVEGACIÓN PRINCIPAL */}
          <div className="flex space-x-2 border-b border-pink-200 pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'pacientes', label: '👥 Expedientes de Pacientes (CSM)', icon: UserCheck },
              { id: 'caribe-seguro', label: '🛡️ Caribe Seguro — IPSC & Alertas', icon: Shield },
              { id: 'citas', label: '📅 Citas Multidisciplinarias', icon: Calendar },
              { id: 'historias', label: '🩺 Evolución & Notas Especializadas', icon: Activity },
              { id: 'documentos', label: '📁 Bóveda de Evidencias Cifrada', icon: FileText },
              { id: 'capital', label: '💰 Capital Semilla $2.5M COP', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: LISTADO AVANZADO DE PACIENTES / CASOS */}
          {activeTab === 'pacientes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">MÓDULO DE PACIENTES</span>
                    <h2 className="text-xl font-black text-[#52166F]">Directorio Único de Usuarias & Casos Caribe Seguro</h2>
                    <p className="text-xs text-slate-500">Filtrado por especialidad profesional y código protegido temporal (Ley 1581).</p>
                  </div>

                  <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-2xl border border-pink-100 text-xs font-bold text-[#52166F]">
                    <span>Total Casos: {filteredPatients.length}</span>
                  </div>
                </div>

                {/* SEARCH & FILTERS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      placeholder="Buscar por Nombre, Cédula o Código CSM-2026-XXXXXX..."
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pink-200 text-xs focus:ring-2 focus:ring-[#E12880] focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as any)}
                      className="w-full py-3 px-4 rounded-2xl border border-pink-200 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-[#E12880]"
                    >
                      <option value="TODAS">Todas las Especialidades</option>
                      <option value="MEDICO">🩺 Ginecología / Medicina</option>
                      <option value="TRABAJO_SOCIAL">🏡 Trabajo Social</option>
                      <option value="JURIDICO">⚖️ Jurídico / Ley 1257</option>
                      <option value="PSICOLOGO">🧠 Psicología / Salud Mental</option>
                    </select>
                  </div>
                </div>

                {/* PATIENTS TABLE / GRID */}
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="bg-white p-5 rounded-2xl border border-pink-100 hover:border-pink-300 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-sm text-slate-900">{patient.patientName}</span>
                          <span className="text-[10px] font-mono bg-purple-100 text-purple-900 font-extrabold px-2.5 py-0.5 rounded-full">
                            {patient.patientCode}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            patient.status === 'RUTA_ACTIVADA' ? 'bg-red-100 text-red-700' :
                            patient.status === 'EN_SEGUIMIENTO' ? 'bg-emerald-100 text-emerald-700' :
                            patient.status === 'EN_ORIENTACION' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {patient.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>🪪 C.C. {patient.docId}</span>
                          <span>📞 {patient.phone}</span>
                          <span>📍 {patient.neighborhood}</span>
                          <span>Profesional: <strong>{patient.assignedProfessional}</strong></span>
                        </div>

                        <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
                          <span>Especialidad Principal:</span>
                          <span className="font-extrabold text-[#52166F] uppercase">{patient.primaryCategory}</span>
                          <span>• IPSC Score:</span>
                          <strong className="text-emerald-600">{patient.ipscScore}/100</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedPatientModal(patient)}
                          className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver Expediente Completo</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredPatients.length === 0 && (
                    <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold">No se encontraron usuarias con los criterios de búsqueda.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL DETALLE EXPEDIENTE Y NOTAS CLÍNICAS */}
              {selectedPatientModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-pink-200 animate-fadeIn">
                    <div className="flex justify-between items-start border-b border-pink-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-purple-600 font-extrabold uppercase">{selectedPatientModal.patientCode}</span>
                        <h3 className="text-xl font-black text-slate-900">{selectedPatientModal.patientName}</h3>
                        <p className="text-xs text-slate-500">C.C. {selectedPatientModal.docId} • {selectedPatientModal.neighborhood}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPatientModal(null)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* VISTAS DE NOTAS POR ROL */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-[#52166F] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#E12880]" />
                        Histórico Multidisciplinario de Atenciones
                      </h4>

                      {/* Médica */}
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                        <div className="flex justify-between text-xs font-black text-emerald-900">
                          <span>🩺 Registro Médico / Ginecológico</span>
                          <span>Atendido por: Dra. Elena Ruiz</span>
                        </div>
                        <p className="text-xs text-slate-700">{selectedPatientModal.medicalSummary || 'Sin registro aún.'}</p>
                      </div>

                      {/* Jurídica */}
                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                        <div className="flex justify-between text-xs font-black text-blue-900">
                          <span>⚖️ Asesoría Jurídica & Medidas Ley 1257</span>
                          <span>Atendido por: Dra. Patricia Herrera</span>
                        </div>
                        <p className="text-xs text-slate-700">{selectedPatientModal.legalSummary || 'Sin medidas jurídicas pendientes.'}</p>
                      </div>

                      {/* Trabajo Social */}
                      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
                        <div className="flex justify-between text-xs font-black text-purple-900">
                          <span>🏡 Acompañamiento Social & Entorno</span>
                          <span>Atendido por: Lic. Sorelvis Murillo</span>
                        </div>
                        <p className="text-xs text-slate-700">{selectedPatientModal.socialSummary || 'Sin visitas de territorio registradas.'}</p>
                      </div>

                      {/* Psicología */}
                      <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-1">
                        <div className="flex justify-between text-xs font-black text-pink-900">
                          <span>🧠 Psicología & Salud Mental</span>
                          <span>Atendido por: Lic. Claudia Morales</span>
                        </div>
                        <p className="text-xs text-slate-700">{selectedPatientModal.psychologicalSummary || 'Sin atenciones en salud mental registradas.'}</p>
                      </div>
                    </div>

                    {/* FORMULARIO AGREGAR NUEVA NOTA SEGÚN ROL */}
                    <form onSubmit={handleAddNoteToPatient} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                        Registrar Nueva Nota Profesional como {selectedProfessional.name} ({selectedProfessional.role}):
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Categoría de la Nota</label>
                          <select
                            value={newNoteCategory}
                            onChange={(e) => setNewNoteCategory(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                          >
                            <option value="MEDICO">🩺 Nota Médica / Ginecología</option>
                            <option value="TRABAJO_SOCIAL">🏡 Nota de Visita Social</option>
                            <option value="JURIDICO">⚖️ Nota de Asesoría Jurídica</option>
                            <option value="PSICOLOGO">🧠 Nota Psicológica</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Profesional Firmante</label>
                          <input
                            type="text"
                            value={selectedProfessional.name}
                            disabled
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 bg-slate-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Detalle de la Atención / Evolución *</label>
                        <textarea
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          placeholder="Escribe aquí los hallazgos de la consulta, ruta activada o recomendación..."
                          rows={3}
                          required
                          className="w-full p-3 rounded-xl border border-pink-200 text-xs focus:ring-2 focus:ring-[#E12880] focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPatientModal(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                        >
                          Cerrar
                        </button>
                        <button
                          type="submit"
                          className="bg-senda-pink hover:bg-senda-purple-dark text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md cursor-pointer"
                        >
                          Guardar Nota en Expediente
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CARIBE SEGURO: IPSC & ALERTAS */}
          {activeTab === 'caribe-seguro' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pink-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">SISTEMA CARIBE SEGURO</span>
                    <h2 className="text-xl font-black text-[#52166F]">Gestión del IPSC & Señales de Deterioro</h2>
                    <p className="text-xs text-slate-500">Herramientas profesionales para seguimiento longitudinal e intervención prioritaria.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-extrabold text-base text-[#52166F] mb-4">Nueva Medición del IPSC (10 Dimensiones)</h3>
                    <IPSCMeasurementForm />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#52166F] mb-4">Panel de Señales de Deterioro</h3>
                    <DeteriorationAlertsPanel />
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <ObservatoryManager />
                </div>
              </div>
            </div>
          )}

          {/* OTRAS TABS EXISTENTES */}
          {activeTab === 'citas' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-[#52166F]">Citas Multidisciplinarias Agendadas</h2>
              <p className="text-xs text-slate-500">Gestión de consultas en Sede Cartagena y Teleorientación Virtual.</p>
              {/* Citas simplificadas */}
              <div className="space-y-3">
                {patients.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{p.patientName}</span>
                      <span className="text-slate-500 block font-mono">{p.patientCode} • {p.primaryCategory}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full">
                      CONFIRMADA
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'historias' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-[#52166F]">Notas Clínicas & Evolución Multidisciplinaria</h2>
              <p className="text-xs text-slate-500">Registro unificado de hallazgos médicos, jurídicos, de trabajo social y psicología.</p>
              <div className="space-y-3">
                {patients.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-[#52166F]">
                      <span>{p.patientName} ({p.patientCode})</span>
                      <span className="text-slate-400 font-normal">{p.lastUpdate}</span>
                    </div>
                    <p className="text-slate-700 italic">"{p.medicalSummary || p.legalSummary || p.socialSummary || p.psychologicalSummary}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-[#52166F]">Bóveda Cifrada de Evidencias & Documentos</h2>
              <p className="text-xs text-slate-500">Ecografías, denuncias, cedulación y actas subidas con cifrado Vercel Storage.</p>
              <div className="p-4 bg-purple-50 rounded-2xl text-xs text-purple-900 font-bold border border-purple-200">
                🔒 Todos los archivos están protegidos bajo almacenamiento de alta seguridad de acuerdo a la Ley 1581.
              </div>
            </div>
          )}

          {activeTab === 'capital' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-[#52166F]">Fondo de Capital Semilla — $2.500.000 COP</h2>
              <p className="text-xs text-slate-500">Aprobación y supervisión de proyectos productivos de graduadas de Proyecto de Vida.</p>
              <div className="p-5 bg-gradient-to-r from-[#3B0852] to-[#52166F] text-white rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">Proyecto: Taller Textil Olaya</h4>
                  <p className="text-xs text-pink-200">Beneficiaria: Carolina Mendoza (CSM-2026-000483)</p>
                </div>
                <span className="bg-amber-400 text-senda-purple-dark font-extrabold px-4 py-1.5 rounded-full text-xs">
                  Aprobado & Entregado
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
