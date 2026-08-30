'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock, KeyRound, ShieldAlert, EyeOff, LogOut, Shield,
  GraduationCap, HeartPulse, Calendar, Brain, ChevronRight,
  CheckCircle2, User, Info,
} from 'lucide-react';
import Link from 'next/link';
import GestionAdministrativa from './GestionAdministrativa';
import AcademiaPortal from './AcademiaPortal';
import PsychologicalTest from './PsychologicalTest';

interface BeneficiaryPortalProps {
  onOpenSOS?: () => void;
  onOpenIncognito?: () => void;
}

type ActiveModule = 'home' | 'expediente' | 'academia' | 'test';

// ─── DEMO USER ───────────────────────────────────────────────────────────────
const DEMO = { doc: '1047892411', pin: '1234', code: 'SM-8842', altDoc: 'SM-8842' };

const PROFILE = {
  name: 'Maria Alejandra Torres',
  code: 'SM-8842',
  docId: '1.047.892.411',
  phone: '+57 301 555 0192',
  neighborhood: 'Olaya Herrera, Cartagena',
  assignedSpecialist: 'Dra. Elena Ruiz — Ginecologia & Salud Reproductiva',
  primaryProgram: 'Programa 4 — Ruta de Salud y Derechos Reproductivos',
  status: 'Activa — Acompanamiento Continuo',
  avatar: 'MA',
  joinDate: 'Agosto 2026',
  nextAppointment: '02 Sep 2026 — 10:00 AM',
  sendaIndex: 34,
  coursesCompleted: 2,
  totalCourses: 6,
};

// ─── MODULE CARDS CONFIG ─────────────────────────────────────────────────────
const MODULES = [
  {
    id: 'expediente',
    icon: HeartPulse,
    emoji: '🏥',
    title: 'Mi Expediente Seguro',
    subtitle: 'Accede a tu historial confidencial',
    desc: 'Citas medicas, seguimientos psicologicos, documentos cifrados, hoja de ruta y tu SENDA Index de progreso.',
    color: 'from-[#E12880] to-[#52166F]',
    border: 'border-pink-200 hover:border-pink-400',
    badge: 'Expediente Activo',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    highlight: '02 Sep — Proxima cita',
    action: 'internal' as const,
    actionTarget: 'expediente',
  },
  {
    id: 'academia',
    icon: GraduationCap,
    emoji: '🎓',
    title: 'SendaAcademia',
    subtitle: 'Cursos y material de formacion',
    desc: 'Accede a tus 6 modulos de capacitacion: salud reproductiva, emprendimiento textil, derechos juridicos, finanzas y mas.',
    color: 'from-[#52166F] to-[#3B0852]',
    border: 'border-purple-200 hover:border-purple-400',
    badge: '2/6 modulos',
    badgeColor: 'bg-purple-100 text-purple-700',
    highlight: 'Certificados disponibles',
    action: 'internal' as const,
    actionTarget: 'academia',
  },
  {
    id: 'cita',
    icon: Calendar,
    emoji: '📅',
    title: 'Agendar Cita Medica',
    subtitle: 'Ginecologia, Psicologia, Odontologia',
    desc: 'Agenda tu proxima cita con los especialistas de la fundacion en Cartagena o por teleorientacion virtual.',
    color: 'from-amber-500 to-orange-500',
    border: 'border-amber-200 hover:border-amber-400',
    badge: 'Disponible',
    badgeColor: 'bg-amber-100 text-amber-700',
    highlight: 'Cartagena & Virtual',
    action: 'link' as const,
    actionTarget: '/agendar-cita',
  },
  {
    id: 'test',
    icon: Brain,
    emoji: '🧠',
    title: 'Test Psicologico',
    subtitle: 'Evaluacion de bienestar SENDA EVAL',
    desc: '18 preguntas de evaluacion psicosocial integral. Genera tu SENDA Index actualizado y recibe orientacion especializada.',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-200 hover:border-emerald-400',
    badge: 'SENDA EVAL',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    highlight: '5 pasos • 18 preguntas',
    action: 'internal' as const,
    actionTarget: 'test',
  },
  {
    id: 'sos',
    icon: ShieldAlert,
    emoji: '🆘',
    title: 'SENDA SOS — Necesito Ayuda Ahora',
    subtitle: 'Sin registro requerido',
    desc: 'Acceso inmediato a lineas de emergencia, protocolo de seguridad y contacto silencioso con el equipo Senda.',
    color: 'from-red-600 to-red-700',
    border: 'border-red-200 hover:border-red-400',
    badge: '24/7',
    badgeColor: 'bg-red-100 text-red-700',
    highlight: 'Linea Purpura 155',
    action: 'link' as const,
    actionTarget: '/senda-sos',
  },
];

// ─── FLOATING PANIC BUTTONS ───────────────────────────────────────────────────
function FloatingButtons({ onSOS, onIncognito }: { onSOS: () => void; onIncognito: () => void }) {
  return (
    <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-3">
      <button
        onClick={onIncognito}
        className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl hover:bg-slate-700 transition-all cursor-pointer"
        title="Modo Incognito"
      >
        <EyeOff className="w-5 h-5" />
      </button>
      <button
        onClick={onSOS}
        className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 animate-pulse cursor-pointer"
        title="Panico SOS"
      >
        <ShieldAlert className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─── BACK BUTTON ──────────────────────────────────────────────────────────────
function BackButton({ onBack, color = 'text-[#52166F]' }: { onBack: () => void; color?: string }) {
  return (
    <button
      onClick={onBack}
      className={`flex items-center gap-2 text-sm font-bold ${color} hover:opacity-70 transition-opacity mb-6 cursor-pointer`}
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      Volver al Panel Principal
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TWO_HOURS_BENEFICIARY_MS = 2 * 60 * 60 * 1000;

export default function BeneficiaryPortal({ onOpenSOS, onOpenIncognito }: BeneficiaryPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [acceptedHabeasData, setAcceptedHabeasData] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [showDemo, setShowDemo] = useState(false);

  const triggerSOS = () => { if (onOpenSOS) onOpenSOS(); };
  const triggerIncognito = () => { if (onOpenIncognito) onOpenIncognito(); else if (onOpenSOS) onOpenSOS(); };

  // Check tab-scoped sessionStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAuth = sessionStorage.getItem('senda_beneficiary_auth') === 'true';
    const loginTime = sessionStorage.getItem('senda_beneficiary_login_time');
    if (isAuth && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed < TWO_HOURS_BENEFICIARY_MS) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('senda_beneficiary_auth');
        sessionStorage.removeItem('senda_beneficiary_login_time');
      }
    }
  }, []);

  // 2-Hour Automatic Session Expiration Security Controller for Active Tab
  useEffect(() => {
    if (!isAuthenticated) return;

    sessionStorage.setItem('senda_beneficiary_auth', 'true');
    if (!sessionStorage.getItem('senda_beneficiary_login_time')) {
      sessionStorage.setItem('senda_beneficiary_login_time', Date.now().toString());
    }

    const checkInterval = setInterval(() => {
      const storedTime = sessionStorage.getItem('senda_beneficiary_login_time');
      if (storedTime) {
        const elapsed = Date.now() - parseInt(storedTime, 10);
        if (elapsed >= TWO_HOURS_BENEFICIARY_MS) {
          handleLogoutDueToTimeout();
        }
      }
    }, 30000);

    const autoLogoutTimer = setTimeout(() => {
      handleLogoutDueToTimeout();
    }, TWO_HOURS_BENEFICIARY_MS);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(autoLogoutTimer);
    };
  }, [isAuthenticated]);

  const handleLogoutDueToTimeout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('senda_beneficiary_auth');
    sessionStorage.removeItem('senda_beneficiary_login_time');
    setDocumentId('');
    setSecretPin('');
    setAcceptedHabeasData(false);
    setActiveModule('home');
    setLoginError('Tu sesión de beneficiaria ha cerrado automáticamente tras 2 horas o al cerrar la pestaña por seguridad y confidencialidad.');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!acceptedHabeasData) {
      setLoginError('Debes aceptar la autorizacion de datos personales (Ley 1581 de 2012).');
      return;
    }
    const doc = documentId.trim();
    const pin = secretPin.trim();
    // Demo validation
    const validDoc = doc === DEMO.doc || doc === DEMO.altDoc;
    const validPin = pin === DEMO.pin;
    if (!doc || !pin) {
      setLoginError('Ingresa tu cedula/codigo de expediente y tu clave PIN.');
      return;
    }
    if (!validDoc || !validPin) {
      setLoginError('Credenciales incorrectas. Usa el usuario demo: Cedula 1047892411 / PIN 1234');
      return;
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('senda_beneficiary_auth');
    sessionStorage.removeItem('senda_beneficiary_login_time');
    setDocumentId('');
    setSecretPin('');
    setAcceptedHabeasData(false);
    setActiveModule('home');
    setLoginError('');
  };

  const fillDemo = () => {
    setDocumentId(DEMO.doc);
    setSecretPin(DEMO.pin);
    setAcceptedHabeasData(true);
    setShowDemo(false);
  };

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4">

          {/* Demo Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-extrabold text-amber-700">Usuario Demo Disponible</p>
              <p className="text-[11px] text-amber-600 mt-0.5">
                Cedula: <strong>1047892411</strong> — PIN: <strong>1234</strong>
              </p>
            </div>
            <button
              onClick={fillDemo}
              className="bg-amber-400 hover:bg-amber-500 text-[#3B0852] font-extrabold text-[10px] px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0"
            >
              Autocompletar
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-8 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Lock className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-2xl font-extrabold">Acceso Seguro Beneficiarias</h2>
              <p className="text-xs text-pink-100 mt-1">Portal Confidencial — Fundacion Senda Mujer</p>
              <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                SSL Cifrado • Habeas Data Protegido
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-7 space-y-5">
              {loginError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Cedula o Codigo de Expediente *
                </label>
                <input
                  type="text"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="Ej: 1047892411 o SM-8842"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Clave PIN Secreta *
                </label>
                <input
                  type="password"
                  value={secretPin}
                  onChange={(e) => setSecretPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30"
                />
                <p className="text-[10px] text-slate-400 mt-1">Olvidé mi PIN — Contactar a Dra. Sorelvis Murillo (+57 301 469 2095)</p>
              </div>

              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedHabeasData}
                    onChange={(e) => setAcceptedHabeasData(e.target.checked)}
                    className="w-4 h-4 text-[#E12880] rounded mt-0.5 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    Autorizo a la <strong>Fundacion Senda Mujer</strong> el tratamiento confidencial de mis datos personales conforme a la <strong>Ley 1581 de 2012</strong>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                Ingresar a Mi Portal Seguro
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={triggerSOS}
                  className="text-[11px] text-red-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Peligro cerca? Activar Modo Camuflaje [ESC]
                </button>
              </div>
            </form>
          </div>

          {/* SOS card */}
          <div className="bg-red-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-200" />
              <div>
                <p className="font-extrabold text-sm">Necesitas ayuda ahora?</p>
                <p className="text-[10px] text-red-200">Sin registro requerido</p>
              </div>
            </div>
            <Link href="/senda-sos" className="bg-white text-red-700 font-extrabold px-4 py-2 rounded-full text-xs hover:bg-red-50 transition-colors">
              SENDA SOS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── POST-LOGIN: HOME ─────────────────────────────────────────────────────────
  if (activeModule === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-[#3B0852] font-extrabold text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SendaPass Verificado
                  </span>
                  <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                    Habeas Data Activo
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-extrabold text-xl">
                    {PROFILE.avatar}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold">
                      Hola, {PROFILE.name.split(' ')[0]}!
                    </h1>
                    <p className="text-xs text-pink-100 mt-0.5">
                      Expediente: <strong className="text-amber-300 font-mono">{PROFILE.code}</strong> • {PROFILE.status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center gap-2">
                <button onClick={triggerIncognito} className="flex items-center gap-1.5 bg-slate-800/60 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/20 cursor-pointer hover:bg-slate-800/80">
                  <EyeOff className="w-3.5 h-3.5" /> Incognito
                </button>
                <button onClick={triggerSOS} className="flex items-center gap-1.5 bg-red-500 text-white font-extrabold px-4 py-2 rounded-full text-xs shadow-md animate-pulse cursor-pointer">
                  <ShieldAlert className="w-4 h-4" /> SOS
                </button>
                <button onClick={handleLogout} className="flex items-center gap-1 bg-white/10 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/20 cursor-pointer hover:bg-white/20">
                  <LogOut className="w-3.5 h-3.5" /> Salir
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'SENDA Index', value: PROFILE.sendaIndex, unit: '/100', icon: '📊', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Cursos', value: `${PROFILE.coursesCompleted}/${PROFILE.totalCourses}`, unit: '', icon: '🎓', color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Proxima Cita', value: '02 Sep', unit: '', icon: '📅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Programa', value: 'P-04', unit: '', icon: '🌷', color: 'text-pink-600', bg: 'bg-pink-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <span className="text-2xl">{s.icon}</span>
                <div className={`text-xl font-extrabold ${s.color} mt-1`}>{s.value}<span className="text-xs">{s.unit}</span></div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 2 MAIN PRIMARY OPTIONS HERO CARDS */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E12880]"></span>
              Selecciona tu Módulo Principal de Atención
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* OPTION 1: CITAS MÉDICAS & GESTIONES ADMINISTRATIVAS */}
              <div 
                onClick={() => setActiveModule('expediente')}
                className="group relative bg-white rounded-3xl border-2 border-pink-200 hover:border-[#E12880] p-7 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#E12880] to-[#52166F] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <HeartPulse className="w-7 h-7" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                      Cita Activa: 02 Sep
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">MÓDULO ADMINISTRATIVO Y CLÍNICO</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 group-hover:text-[#E12880] transition-colors">
                      1. Citas Médicas & Gestiones Administrativas
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Accede a tu historial clínico confidencial, agendamiento prioritario de citas (*Ginecología, Odontología, Medicina, Psicología y Asesoría Jurídica*), descarga de documentos verificados y seguimiento de tu expediente seguro.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-pink-100 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="bg-pink-50 px-2.5 py-1 rounded-lg">🏥 Agendar Citas</span>
                    <span className="bg-pink-50 px-2.5 py-1 rounded-lg">📄 Historial Clínico</span>
                    <span className="bg-pink-50 px-2.5 py-1 rounded-lg">🔐 Bóveda Cifrada</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between font-extrabold text-xs text-[#E12880] relative z-10">
                  <span>Ingresar a Gestiones Administrativas</span>
                  <div className="w-8 h-8 rounded-full bg-pink-100 group-hover:bg-[#E12880] group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* OPTION 2: SENDA ACADEMIA & RECURSOS ACADÉMICOS */}
              <div 
                onClick={() => setActiveModule('academia')}
                className="group relative bg-white rounded-3xl border-2 border-purple-200 hover:border-purple-600 p-7 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#52166F] to-[#3B0852] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <span className="bg-purple-100 text-purple-800 text-xs font-extrabold px-3 py-1 rounded-full border border-purple-200">
                      2/6 Cursos Completados
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700">MÓDULO EDUCATIVO Y FORMACIÓN</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 group-hover:text-purple-700 transition-colors">
                      2. SendaAcademia & Recursos Académicos
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Accede a tus cursos asignados y catálogo completo disponible: salud reproductiva, emprendimiento textil, liderazgo femenino, finanzas del hogar y certificaciones oficiales descargables.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="bg-purple-50 px-2.5 py-1 rounded-lg">🎓 Cursos Asignados</span>
                    <span className="bg-purple-50 px-2.5 py-1 rounded-lg">📚 Recursos Disponibles</span>
                    <span className="bg-purple-50 px-2.5 py-1 rounded-lg">📜 Diplomas Oficiales</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between font-extrabold text-xs text-purple-700 relative z-10">
                  <span>Ingresar a SendaAcademia</span>
                  <div className="w-8 h-8 rounded-full bg-purple-100 group-hover:bg-purple-700 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECONDARY TOOLS */}
          <div className="pt-4 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Herramientas Complementarias de Apoyo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveModule('test')}
                className="bg-white p-4 rounded-2xl border border-emerald-200 hover:border-emerald-500 flex items-center justify-between text-left transition-all hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">Test Psicológico SENDA EVAL</h4>
                    <p className="text-[11px] text-slate-500">Evaluación confidencial de bienestar en 4 áreas</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>

              <Link
                href="/senda-sos"
                className="bg-red-50 p-4 rounded-2xl border border-red-200 hover:border-red-500 flex items-center justify-between text-left transition-all hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold animate-pulse">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-red-700">SENDA SOS — Emergencias 24/7</h4>
                    <p className="text-[11px] text-red-600">Líneas de ayuda y protocolo de camuflaje</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-600" />
              </Link>
            </div>
          </div>
        </div>
        <FloatingButtons onSOS={triggerSOS} onIncognito={triggerIncognito} />
      </div>
    );
  }

  // ── SUB-MODULE: EXPEDIENTE ────────────────────────────────────────────────────
  if (activeModule === 'expediente') {
    return (
      <div className="min-h-screen bg-[#FDF8FA]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BackButton onBack={() => setActiveModule('home')} color="text-[#E12880]" />
          <GestionAdministrativa profile={PROFILE} onSOS={triggerSOS} onIncognito={triggerIncognito} />
        </div>
        <FloatingButtons onSOS={triggerSOS} onIncognito={triggerIncognito} />
      </div>
    );
  }

  // ── SUB-MODULE: ACADEMIA ──────────────────────────────────────────────────────
  if (activeModule === 'academia') {
    return (
      <div className="min-h-screen bg-[#FDF8FA]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BackButton onBack={() => setActiveModule('home')} color="text-[#52166F]" />
          <AcademiaPortal profile={PROFILE} onSOS={triggerSOS} onIncognito={triggerIncognito} />
        </div>
        <FloatingButtons onSOS={triggerSOS} onIncognito={triggerIncognito} />
      </div>
    );
  }

  // ── SUB-MODULE: TEST PSICOLOGICO ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackButton onBack={() => setActiveModule('home')} color="text-emerald-700" />
        <PsychologicalTest />
      </div>
      <FloatingButtons onSOS={triggerSOS} onIncognito={triggerIncognito} />
    </div>
  );
}
