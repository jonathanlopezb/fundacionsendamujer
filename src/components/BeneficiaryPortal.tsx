'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock, KeyRound, ShieldAlert, EyeOff, LogOut, Shield,
  GraduationCap, HeartPulse, Calendar, Brain, ChevronRight,
  CheckCircle2, User, Info, Target, Coins, ExternalLink, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import GestionAdministrativa from './GestionAdministrativa';
import PsychologicalTest from './PsychologicalTest';

interface BeneficiaryPortalProps {
  onOpenSOS?: () => void;
  onOpenIncognito?: () => void;
}

type ActiveModule = 'home' | 'expediente' | 'test';

// DEMO USER CREDENTIALS
const DEMO = { doc: '1047892411', pin: '1234', code: 'SM-8842' };

const PROFILE = {
  name: 'María Alejandra Torres',
  code: 'SM-8842',
  docId: '1.047.892.411',
  phone: '+57 301 555 0192',
  neighborhood: 'Olaya Herrera, Cartagena',
  assignedSpecialist: 'Dra. Elena Ruiz — Ginecología & Salud Reproductiva',
  primaryProgram: 'Programa 4 — Ruta de Salud y Derechos Reproductivos',
  status: 'Activa — Acompañamiento Continuo',
  avatar: 'MA',
  joinDate: 'Agosto 2026',
  nextAppointment: '02 Sep 2026 — 10:00 AM',
  sendaIndex: 34,
  coursesCompleted: 2,
  totalCourses: 6,
};

function FloatingButtons({ onSOS, onIncognito }: { onSOS: () => void; onIncognito: () => void }) {
  return (
    <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-3">
      <button
        onClick={onIncognito}
        className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl hover:bg-slate-700 transition-all cursor-pointer"
        title="Modo Incógnito [ESC]"
      >
        <EyeOff className="w-5 h-5" />
      </button>
      <button
        onClick={onSOS}
        className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 animate-pulse cursor-pointer"
        title="Pánico SOS"
      >
        <ShieldAlert className="w-5 h-5" />
      </button>
    </div>
  );
}

function BackButton({ onBack, color = 'text-[#52166F]' }: { onBack: () => void; color?: string }) {
  return (
    <button
      onClick={onBack}
      className={`flex items-center gap-2 text-sm font-bold ${color} hover:opacity-70 transition-opacity mb-6 cursor-pointer`}
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      Volver al Panel Principal del Portal
    </button>
  );
}

const TWO_HOURS_BENEFICIARY_MS = 2 * 60 * 60 * 1000;

export default function BeneficiaryPortal({ onOpenSOS, onOpenIncognito }: BeneficiaryPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [acceptedHabeasData, setAcceptedHabeasData] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');

  const triggerSOS = () => { if (onOpenSOS) onOpenSOS(); };
  const triggerIncognito = () => { if (onOpenIncognito) onOpenIncognito(); else if (onOpenSOS) onOpenSOS(); };

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

    return () => clearInterval(checkInterval);
  }, [isAuthenticated]);

  const handleLogoutDueToTimeout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('senda_beneficiary_auth');
    sessionStorage.removeItem('senda_beneficiary_login_time');
    setDocumentId('');
    setSecretPin('');
    setAcceptedHabeasData(false);
    setActiveModule('home');
    setLoginError('Tu sesión ha finalizado por seguridad tras 2 horas de inactividad.');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!acceptedHabeasData) {
      setLoginError('Debes autorizar el tratamiento confidencial de datos personales (Ley 1581 de 2012).');
      return;
    }
    const doc = documentId.trim();
    const pin = secretPin.trim();
    const validDoc = doc === DEMO.doc || doc === DEMO.code;
    const validPin = pin === DEMO.pin;

    if (!doc || !pin) {
      setLoginError('Ingresa tu número de cédula o código de expediente y tu PIN.');
      return;
    }
    if (!validDoc || !validPin) {
      setLoginError('Credenciales incorrectas. Usa el usuario demo: Cédula 1047892411 / PIN 1234');
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
  };

  // ── PRE-LOGIN AUTHENTICATION ────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4">

          {/* Demo Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-extrabold text-amber-800">Acceso de Demostración Disponible</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Cédula: <strong>1047892411</strong> — PIN: <strong>1234</strong>
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
              <h1 className="text-2xl font-extrabold">Portal de Beneficiarias</h1>
              <p className="text-xs text-pink-100 mt-1">Fundación Senda Mujer • Cartagena</p>
              <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                Cifrado SSL • Protección Habeas Data Ley 1581
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
                  Cédula o Código de Expediente *
                </label>
                <input
                  type="text"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="Ej. 1047892411 o SM-8842"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30 text-slate-900"
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
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30 text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">¿Olvidaste tu PIN? Contacta a la Dra. Sorelvis Murillo (+57 301 469 2095)</p>
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
                    Autorizo a la <strong>Fundación Senda Mujer</strong> el tratamiento confidencial de mis datos personales de salud y seguimiento bajo la <strong>Ley 1581 de 2012</strong>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                Ingresar a Mi Portal Seguro
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={triggerSOS}
                  className="text-[11px] text-red-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  ¿Emergencia en casa? Activar Modo Camuflaje [ESC]
                </button>
              </div>
            </form>
          </div>

          <div className="bg-red-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-200" />
              <div>
                <p className="font-extrabold text-sm">SENDA SOS — Ayuda Inmediata</p>
                <p className="text-[10px] text-red-200">Sin registro requerido</p>
              </div>
            </div>
            <Link href="/senda-sos" className="bg-white text-red-700 font-extrabold px-4 py-2 rounded-full text-xs hover:bg-red-50 transition-colors">
              Ingresar SOS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── POST-LOGIN: DASHBOARD MAIN ───────────────────────────────────────────────
  if (activeModule === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-[#3B0852] font-extrabold text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Beneficiaria Activa SendaPass
                  </span>
                  <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                    Habeas Data Vigente (Ley 1581)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-extrabold text-xl text-amber-300">
                    {PROFILE.avatar}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold">
                      ¡Bienvenida, {PROFILE.name.split(' ')[0]}!
                    </h1>
                    <p className="text-xs text-pink-100 mt-0.5">
                      Expediente: <strong className="text-amber-300 font-mono">{PROFILE.code}</strong> • {PROFILE.status}
                    </p>
                    <p className="text-xs text-pink-200">Directora: Dra. Sorelvis Murillo (+57 301 469 2095)</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center gap-2">
                <button onClick={triggerIncognito} className="flex items-center gap-1.5 bg-slate-800/60 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/20 cursor-pointer hover:bg-slate-800/80">
                  <EyeOff className="w-3.5 h-3.5" /> Incógnito
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

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'SENDA Index', value: PROFILE.sendaIndex, unit: '/100', icon: '📊', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
              { label: 'Citas Activas', value: '3', unit: ' Programadas', icon: '🩺', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Capital Semilla', value: '$2.5M', unit: ' Otorgado', icon: '💰', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
              { label: 'Metas en Progreso', value: '4/4', unit: ' Al día', icon: '🎯', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-4 border shadow-xs`}>
                <span className="text-2xl">{s.icon}</span>
                <div className={`text-xl font-extrabold ${s.color} mt-1`}>{s.value}<span className="text-xs">{s.unit}</span></div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* INDEPENDENT MICROSITE BANNER LINK TO SENDA ACADEMIA */}
          <div className="bg-gradient-to-r from-[#270538] via-[#3B0852] to-[#52166F] text-white rounded-3xl p-6 sm:p-8 border border-pink-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-[#E12880]/30 border border-pink-400/30">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>Plataforma EdTech Independiente</span>
              </div>
              <h2 className="text-2xl font-black">SendaAcademia — Aula Virtual Externa</h2>
              <p className="text-xs text-pink-200/90 leading-relaxed">
                Accede a tus cursos interactivos, clases en vivo con la Dra. Sorelvis Murillo y certificaciones oficiales en nuestra plataforma educativa independiente.
              </p>
            </div>
            <a
              href="/academia"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#E12880] to-amber-400 text-[#180325] font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Abrir SendaAcademia en Nueva Pestaña</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* CORE PORTAL MODULES */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E12880]"></span>
              Módulos Principales del Portal de Beneficiarias
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* MODULE 1: EXPEDIENTE & CITAS & VISITAS DOMICILIARIAS */}
              <div 
                onClick={() => setActiveModule('expediente')}
                className="group relative bg-white rounded-3xl border-2 border-pink-200 hover:border-[#E12880] p-7 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
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
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">EXPEDIENTE & ATENCIÓN INTEGRAL</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 group-hover:text-[#E12880] transition-colors">
                      1. Citas Médicas, Especialidades & Visitas Domiciliarias
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Agendamiento de Ginecología, Medicina General, Odontología, Psicología, Trabajo Social y programación de <strong>Visitas Domiciliarias en vivienda (Cartagena)</strong>.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-pink-100 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="bg-pink-50 px-2.5 py-1 rounded-lg">⚕️ Ginecología & Odontología</span>
                    <span className="bg-pink-50 px-2.5 py-1 rounded-lg">🏡 Visita en Vivienda</span>
                    <span className="bg-pink-50 px-2.5 py-1 rounded-lg">📄 Bóveda Cifrada</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between font-extrabold text-xs text-[#E12880] relative z-10">
                  <span>Ingresar a Gestión de Citas y Expediente</span>
                  <div className="w-8 h-8 rounded-full bg-pink-100 group-hover:bg-[#E12880] group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* MODULE 2: TEST PSICOLÓGICO SENDA EVAL */}
              <div 
                onClick={() => setActiveModule('test')}
                className="group relative bg-white rounded-3xl border-2 border-emerald-200 hover:border-emerald-600 p-7 shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Brain className="w-7 h-7" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                      SENDA Index: {PROFILE.sendaIndex}/100
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">EVALUACIÓN PSICOSOCIAL</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
                      2. Test Psicológico SENDA EVAL
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Evaluación confidencial de bienestar en 4 áreas psicosociales para monitorear tu fortaleza emocional y actualizar tu SENDA Index de progreso.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-100 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg">🧠 Bienestar Emocional</span>
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg">📊 SENDA Index</span>
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg">🔒 100% Confidencial</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between font-extrabold text-xs text-emerald-700 relative z-10">
                  <span>Realizar Test de Bienestar SENDA EVAL</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <FloatingButtons onSOS={triggerSOS} onIncognito={triggerIncognito} />
      </div>
    );
  }

  // ── SUB-MODULE: EXPEDIENTE INTEGRAL ─────────────────────────────────────────
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

  // ── SUB-MODULE: TEST PSICOLÓGICO ────────────────────────────────────────────
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
