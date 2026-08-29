'use client';

import React, { useState } from 'react';
import { GraduationCap, HeartPulse, ChevronRight, Lock, Shield, Star, Sparkles, LogOut, ShieldAlert, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

// Sub-panel imports
import GestionAdministrativa from './GestionAdministrativa';
import AcademiaPortal from './AcademiaPortal';

interface BeneficiaryPortalProps {
  onOpenSOS?: () => void;
  onOpenIncognito?: () => void;
}

type ActiveModule = 'home' | 'academia' | 'gestion';

export default function BeneficiaryPortal({ onOpenSOS, onOpenIncognito }: BeneficiaryPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [acceptedHabeasData, setAcceptedHabeasData] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');

  const profile = {
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

  const triggerSOS = () => {
    if (onOpenSOS) onOpenSOS();
  };

  const triggerIncognito = () => {
    if (onOpenIncognito) onOpenIncognito();
    else if (onOpenSOS) onOpenSOS();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!acceptedHabeasData) {
      setLoginError('Debes aceptar la autorización de datos personales (Ley 1581 de 2012).');
      return;
    }
    if (!documentId.trim() || !secretPin.trim()) {
      setLoginError('Por favor ingresa tu documento/código de expediente y tu clave PIN.');
      return;
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDocumentId('');
    setSecretPin('');
    setAcceptedHabeasData(false);
    setActiveModule('home');
  };

  // ─── LOGIN SCREEN ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-8 text-center relative">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 backdrop-blur-sm">
                <Lock className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">SendaPass</h2>
              <p className="text-xs text-pink-100 mt-1">Portal Seguro de Beneficiarias — Fundación Senda Mujer</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                  🔒 Cifrado SSL • Habeas Data Protegido
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-7 space-y-5">
              {loginError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                  {loginError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Número de Cédula o Código de Expediente *
                  </label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="Ej: 1047892411 o SM-8842"
                    required
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
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ¿Olvidaste tu PIN? Contáctanos al +57 317 657 5800
                  </span>
                </div>
              </div>

              {/* Habeas Data */}
              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedHabeasData}
                    onChange={(e) => setAcceptedHabeasData(e.target.checked)}
                    className="w-4 h-4 text-[#E12880] rounded mt-0.5 cursor-pointer focus:ring-[#E12880]"
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    Autorizo a la <strong>Fundación Senda Mujer</strong> el tratamiento confidencial de mis datos personales, en cumplimiento de la <strong>Ley 1581 de 2012</strong>. Mis datos no serán compartidos sin mi consentimiento explícito.
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
                  ¿Peligro cerca? Activar Modo Camuflaje [ESC]
                </button>
              </div>
            </form>
          </div>

          {/* SOS Card below login */}
          <div className="mt-4 bg-red-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-200" />
              <div>
                <p className="font-extrabold text-sm">¿Necesitas ayuda ahora?</p>
                <p className="text-[10px] text-red-200">Sin registro requerido</p>
              </div>
            </div>
            <a href="/senda-sos" className="bg-white text-red-700 font-extrabold px-4 py-2 rounded-full text-xs hover:bg-red-50 transition-colors">
              SENDA SOS
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── POST-LOGIN: HOME (Module Selector) ─────────────────────────────────
  if (activeModule === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-[#3B0852] font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SendaPass Verificado
                  </span>
                  <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                    Habeas Data Activo
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-extrabold text-xl text-white">
                    {profile.avatar}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                      ¡Hola, {profile.name.split(' ')[0]}! 🌷
                    </h1>
                    <p className="text-xs text-pink-100 mt-0.5">
                      Código: <strong className="text-amber-300 font-mono">{profile.code}</strong> • {profile.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={triggerIncognito}
                  className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800/80 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Modo Incógnito
                </button>
                <button
                  type="button"
                  onClick={triggerSOS}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-extrabold px-4 py-2 rounded-full text-xs shadow-md animate-pulse-glow transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  SOS [ESC]
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/20 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Salir
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'SENDA Index', value: profile.sendaIndex, unit: '/100', icon: '📊', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Cursos Completados', value: `${profile.coursesCompleted}/${profile.totalCourses}`, unit: '', icon: '🎓', color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Próxima Cita', value: '02 Sep', unit: '10:00 AM', icon: '📅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Desde', value: profile.joinDate, unit: '', icon: '🌷', color: 'text-pink-600', bg: 'bg-pink-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <span className="text-2xl">{s.icon}</span>
                <div className={`text-xl font-extrabold ${s.color} mt-1`}>{s.value} <span className="text-xs">{s.unit}</span></div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── 2 Module Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ACADEMIA */}
            <button
              type="button"
              onClick={() => setActiveModule('academia')}
              className="group bg-white rounded-3xl border-2 border-purple-100 p-8 shadow-md hover:shadow-xl hover:border-purple-300 transition-all text-left cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-purple-100 transition-all" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#52166F] to-[#E12880] rounded-2xl flex items-center justify-center shadow-lg mb-5">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-extrabold text-[#52166F]">SendaAcademia</h2>
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {profile.coursesCompleted}/{profile.totalCourses} módulos
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Accede a tus cursos de formación, material de estudio descargable, talleres virtuales y genera tus certificados oficiales.
                </p>
                <div className="space-y-1.5 mb-5">
                  {['Cursos y módulos de aprendizaje', 'Material descargable PDF', 'Certificados oficiales', 'Biblioteca de recursos'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>Progreso del programa</span>
                    <span>{Math.round((profile.coursesCompleted / profile.totalCourses) * 100)}%</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#52166F] to-[#E12880] h-2 rounded-full transition-all"
                      style={{ width: `${(profile.coursesCompleted / profile.totalCourses) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#E12880] font-extrabold text-sm group-hover:gap-3 transition-all">
                  Ir a la Academia <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* GESTIÓN ADMINISTRATIVA */}
            <button
              type="button"
              onClick={() => setActiveModule('gestion')}
              className="group bg-white rounded-3xl border-2 border-pink-100 p-8 shadow-md hover:shadow-xl hover:border-pink-300 transition-all text-left cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-pink-100 transition-all" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E12880] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg mb-5">
                  <HeartPulse className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-extrabold text-[#E12880]">Gestión Administrativa</h2>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Activa
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Consulta tus citas médicas, seguimientos psicológicos, documentos, hoja de ruta e indicador SENDA de progreso.
                </p>
                <div className="space-y-1.5 mb-5">
                  {['Mis citas médicas y psicológicas', 'Seguimientos y evolución', 'Bóveda de documentos seguros', 'Indicador SENDA Index', 'Hoja de ruta personal'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <div>
                    <div className="text-[10px] font-bold text-amber-700 uppercase">Próxima cita</div>
                    <div className="text-xs font-extrabold text-slate-800">{profile.nextAppointment}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#E12880] font-extrabold text-sm group-hover:gap-3 transition-all">
                  Ver Mi Gestión <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>

          {/* Botón pánico flotante en home */}
          <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
            <button
              onClick={triggerIncognito}
              className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl hover:bg-slate-700 transition-all cursor-pointer"
              title="Modo Incógnito"
            >
              <EyeOff className="w-5 h-5" />
            </button>
            <button
              onClick={triggerSOS}
              className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 transition-all animate-pulse cursor-pointer"
              title="Botón de Pánico SOS"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ─── ACADEMIA MODULE ─────────────────────────────────────────────────────
  if (activeModule === 'academia') {
    return (
      <div className="min-h-screen bg-[#FDF8FA]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button onClick={() => setActiveModule('home')} className="flex items-center gap-2 text-sm font-bold text-[#52166F] hover:text-[#E12880] transition-colors mb-6 cursor-pointer">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Volver al Panel Principal
          </button>
          <AcademiaPortal profile={profile} onSOS={triggerSOS} onIncognito={triggerIncognito} />
        </div>
        {/* Floating panic buttons */}
        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
          <button onClick={triggerIncognito} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl hover:bg-slate-700 transition-all cursor-pointer" title="Modo Incógnito">
            <EyeOff className="w-5 h-5" />
          </button>
          <button onClick={triggerSOS} className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 animate-pulse cursor-pointer" title="SOS">
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ─── GESTIÓN ADMINISTRATIVA MODULE ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => setActiveModule('home')} className="flex items-center gap-2 text-sm font-bold text-[#E12880] hover:text-[#52166F] transition-colors mb-6 cursor-pointer">
          <ChevronRight className="w-4 h-4 rotate-180" />
          Volver al Panel Principal
        </button>
        <GestionAdministrativa profile={profile} onSOS={triggerSOS} onIncognito={triggerIncognito} />
      </div>
      {/* Floating panic buttons */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        <button onClick={triggerIncognito} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl hover:bg-slate-700 transition-all cursor-pointer" title="Modo Incógnito">
          <EyeOff className="w-5 h-5" />
        </button>
        <button onClick={triggerSOS} className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 animate-pulse cursor-pointer" title="SOS">
          <ShieldAlert className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
