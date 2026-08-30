'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BrainCircuit, Compass, ShieldCheck, Layers, Workflow, Target,
  BarChart3, Sliders, Globe, Activity, FileText, LockKeyhole,
  Users, Volume2, Zap, Search, CheckCircle2, AlertCircle,
  ArrowRight, Clock, MapPin, TrendingUp, EyeOff, Mic,
  VolumeX, Share2, Key, RefreshCw, Award, Check, ChevronRight,
  GraduationCap, Briefcase, DollarSign, Home, HeartPulse, Heart,
  ShieldAlert, Sparkles, AlertTriangle, Play, HelpCircle, Scale
} from 'lucide-react';

// Types for Policy Engine Simulation
interface PolicyProfile {
  salud: 'HIGH' | 'MEDIUM' | 'LOW';
  violencia: 'HIGH' | 'MEDIUM' | 'LOW';
  economia: 'HIGH' | 'MEDIUM' | 'LOW';
  cuidado: 'HIGH' | 'MEDIUM' | 'LOW';
  vivienda: 'HIGH' | 'MEDIUM' | 'LOW';
  educacion: 'HIGH' | 'MEDIUM' | 'LOW';
  redApoyo: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function SendaUniversalModule() {
  const [activePillar, setActivePillar] = useState<string>('engine');

  // ----------------------------------------------------
  // Module 1: SENDA Policy Engine State
  // ----------------------------------------------------
  const [narrativeInput, setNarrativeInput] = useState<string>(
    'Tengo 22 años, estoy embarazada, no tengo empleo, vivo sola con mi hija, fui víctima de violencia de pareja y no tengo ingresos económicos.'
  );
  const [engineResult, setEngineResult] = useState<{
    profile: PolicyProfile;
    rightsMap: { category: string; icon: any; title: string; route: string; norm: string; color: string }[];
  } | null>({
    profile: {
      salud: 'HIGH',
      violencia: 'HIGH',
      economia: 'HIGH',
      cuidado: 'MEDIUM',
      vivienda: 'MEDIUM',
      educacion: 'MEDIUM',
      redApoyo: 'HIGH',
    },
    rightsMap: [
      {
        category: 'Salud & SSR',
        icon: HeartPulse,
        title: 'Atención Maternal & Control Prenatal Inmediato',
        route: 'Ruta Prioritaria IPS Cartagena + Acompañamiento Nutricional Senda',
        norm: 'Res. 1350 de 2026 & Ley 2244 de Parto Digno',
        color: 'border-rose-500 bg-rose-50 text-rose-800',
      },
      {
        category: 'Protección',
        icon: ShieldAlert,
        title: 'Medidas Cautelares de Protección Inmediata',
        route: 'Comisaría de Familia + Casa de Justicia Chiquinquirá + Línea Púrpura 155',
        norm: 'Ley 1257 de 2008 & CONPES 4080 (Vida Libre de Violencia)',
        color: 'border-red-500 bg-red-50 text-red-800',
      },
      {
        category: 'Justicia',
        icon: Scale,
        title: 'Orientación Jurídica & Representación Legal Gratuitas',
        route: 'Consultorio Jurídico Senda + Defensoría del Pueblo Cartagena',
        norm: 'Derechos de las Víctimas de Violencia de Género (MinSalud)',
        color: 'border-purple-500 bg-purple-50 text-purple-800',
      },
      {
        category: 'Autonomía Económica',
        icon: DollarSign,
        title: 'Subsidio de Emergencia & Emprendimiento Semilla',
        route: 'Vinculación a Programa SendaAutonomía + Renta Ciudadana Prioritaria',
        norm: 'Eje 1 CONPES 4080 (Autonomía Económica)',
        color: 'border-emerald-500 bg-emerald-50 text-emerald-800',
      },
      {
        category: 'Cuidado',
        icon: Home,
        title: 'Red de Cuidado Infantil & Lactancia',
        route: 'Cupo en Centro de Desarrollo Infantil (CDI) + Asistencia Nutricional',
        norm: 'Política Nacional del Cuidado & Política SSR 2026-2035',
        color: 'border-amber-500 bg-amber-50 text-amber-800',
      },
    ],
  });

  const [loadingEngine, setLoadingEngine] = useState<boolean>(false);

  const handleAnalyzePolicy = async () => {
    if (!narrativeInput.trim() || loadingEngine) return;
    setLoadingEngine(true);

    try {
      const res = await fetch('/api/senda-policy-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narrative: narrativeInput }),
      });
      const data = await res.json();

      if (data.profile && data.rightsMap) {
        // Map raw icons & colors
        const mappedRightsMap = data.rightsMap.map((rm: any) => {
          let IconComp = ShieldCheck;
          let colorClass = 'border-purple-500 bg-purple-50/70 text-purple-900';
          
          if (rm.category.includes('Salud')) {
            IconComp = HeartPulse;
            colorClass = 'border-rose-500 bg-rose-50/70 text-rose-900';
          } else if (rm.category.includes('Protección')) {
            IconComp = ShieldAlert;
            colorClass = 'border-red-500 bg-red-50/70 text-red-900';
          } else if (rm.category.includes('Económ')) {
            IconComp = DollarSign;
            colorClass = 'border-emerald-500 bg-emerald-50/70 text-emerald-900';
          }

          return {
            category: rm.category,
            icon: IconComp,
            title: rm.title,
            route: rm.route,
            norm: rm.norm,
            color: colorClass,
          };
        });

        setEngineResult({
          profile: data.profile,
          rightsMap: mappedRightsMap,
        });
      }
    } catch (err) {
      console.error('Error analyzing policy:', err);
    } finally {
      setLoadingEngine(false);
    }
  };

  // ----------------------------------------------------
  // Module 2: "¿A qué tengo derecho?" Wizard State
  // ----------------------------------------------------
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAnswers, setWizardAnswers] = useState({
    age: '18-28',
    situation: 'embarazo',
    economicStatus: 'sin_ingresos',
    location: 'cartagena_urbana',
  });
  const [wizardFinished, setWizardFinished] = useState(false);

  // ----------------------------------------------------
  // Module 5 & 7: SENDA Digital Twin Simulator State
  // ----------------------------------------------------
  const [simulatedCase, setSimulatedCase] = useState({
    victimType: 'Violencia Intrafamiliar + Madre Soltera',
    location: 'Localidad 2 Cartagena (De la Virgen y Turística)',
    institutionalDelayDays: 45,
    idealDays: 7,
    barriersFound: 4,
  });

  // ----------------------------------------------------
  // Module 9: SENDA Anónima Identity Code
  // ----------------------------------------------------
  const [anonymousId, setAnonymousId] = useState<string>('SENDA-8F72A');
  const [isAnonymousActive, setIsAnonymousActive] = useState<boolean>(true);

  const generateNewAnonId = () => {
    const chars = '0123456789ABCDEF';
    let code = 'SENDA-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAnonymousId(code);
  };

  // ----------------------------------------------------
  // Module 10: Pasaporte Digital Privacy Toggles
  // ----------------------------------------------------
  const [privacyPermissions, setPrivacyPermissions] = useState({
    trabajadoraSocial: true,
    psicologa: true,
    abogada: false,
    organizacionExterna: false,
    institucionSalud: false,
  });
  const [shareDurationHours, setShareDurationHours] = useState<number>(24);
  const [isSharedActive, setIsSharedActive] = useState<boolean>(true);

  // Helper helper icons map for profile matrix
  const getBadgeColor = (status: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (status) {
      case 'HIGH':
        return 'bg-red-500 text-white';
      case 'MEDIUM':
        return 'bg-amber-500 text-white';
      case 'LOW':
        return 'bg-emerald-500 text-white';
    }
  };

  const getStatusLabel = (status: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (status) {
      case 'HIGH':
        return '🔴 Prioridad Urgente';
      case 'MEDIUM':
        return '🟠 Atención Requerida';
      case 'LOW':
        return '🟢 Estable / Prevención';
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Header Banner: Futuristic Executive Hero ── */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-slate-950 to-pink-950/60 z-0" />
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-pink-400" /> SENDA UNIVERSAL 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Alineado CONPES 4080 & Política SSR 2026–2035
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              El Sistema Operativo de <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">Derechos de las Mujeres</span>
            </h1>
            <blockquote className="border-l-2 border-pink-500 pl-4 py-1 text-sm sm:text-base text-slate-300 italic max-w-3xl">
              &quot;Una mujer entra a Senda y la tecnología descubre qué derechos, servicios, ayudas, oportunidades y rutas le corresponden, independientemente de que conozca o no el funcionamiento del Estado.&quot;
            </blockquote>
          </div>

          {/* Slogan pill */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-pink-300 font-bold">Concepto Revolucionario</div>
              <div className="text-sm font-semibold text-white">
                No: &quot;¿Qué trámite necesitas?&quot; &rarr; Sino: <span className="text-amber-300 font-bold">&quot;Cuéntame qué estás viviendo y nosotros descubrimos qué puede ayudarte.&quot;</span>
              </div>
            </div>
            <Zap className="w-8 h-8 text-amber-400 shrink-0 hidden sm:block" />
          </div>
        </div>
      </div>

      {/* ── Modular Navigation Bar (12 Pillars Navigation) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" /> Los 12 Pilares del Sistema Operativo Senda
          </h2>
          <span className="text-xs text-slate-400 font-medium">Cartagena &bull; Caribe &bull; Colombia</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { id: 'engine', label: '1. Policy Engine', icon: BrainCircuit, color: 'text-purple-600' },
            { id: 'rights', label: '2. Descubre Derechos', icon: Compass, color: 'text-pink-600' },
            { id: 'senda_one', label: '3. SENDA One', icon: Workflow, color: 'text-emerald-600' },
            { id: 'territorio', label: '4. Mapa Vivo', icon: MapPin, color: 'text-amber-600' },
            { id: 'senda_gap', label: '5. Mapa Brechas', icon: AlertCircle, color: 'text-red-600' },
            { id: 'policy_lab', label: '6. Policy Lab', icon: BarChart3, color: 'text-indigo-600' },
            { id: 'digital_twin', label: '7. Gemelo Digital', icon: Sliders, color: 'text-cyan-600' },
            { id: 'senda_voz', label: '8. SENDA Voz', icon: Volume2, color: 'text-rose-600' },
            { id: 'senda_anon', label: '9. Modo Anónimo', icon: EyeOff, color: 'text-slate-600' },
            { id: 'pasaporte', label: '10. Pasaporte Privado', icon: Key, color: 'text-teal-600' },
            { id: 'senda_red', label: '11. Red Verificada', icon: Users, color: 'text-blue-600' },
            { id: 'senda_futuro', label: '12. SENDA Futuro', icon: Target, color: 'text-amber-500' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activePillar === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePillar(item.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-purple-500/50 scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-pink-400' : item.color}`} />
                  {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PILLAR 1: SENDA POLICY ENGINE ── */}
      {activePillar === 'engine' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-purple-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">1. SENDA Policy Engine (El Cerebro)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Convierte la narrativa libre de la mujer en un perfil multidimensional de necesidades y matriz legal de derechos.
              </p>
            </div>
            <span className="self-start md:self-auto text-[11px] font-mono bg-purple-50 text-purple-700 font-extrabold px-3 py-1 rounded-full border border-purple-200">
              Cerebro Algorítmico Fundacional
            </span>
          </div>

          {/* Interactive Narrative Box */}
          <div className="space-y-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Escribe o selecciona una situación de vida en lenguaje natural:
            </label>
            <div className="relative">
              <textarea
                value={narrativeInput}
                onChange={(e) => setNarrativeInput(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                placeholder="Ejemplo: Tengo 22 años, estoy embarazada, no tengo trabajo..."
              />
              <button
                type="button"
                onClick={handleAnalyzePolicy}
                disabled={loadingEngine}
                className="mt-2 sm:mt-0 sm:absolute sm:bottom-3 sm:right-3 bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Zap className={`w-4 h-4 text-amber-300 ${loadingEngine ? 'animate-spin' : ''}`} />
                <span>{loadingEngine ? 'Analizando con Groq AI Engine...' : 'Ejecutar Engine de Derechos'}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="text-slate-400 font-bold self-center">Situaciones modelo:</span>
              {[
                'Madre soltera embarazada sin empleabilidad en Cartagena',
                'Víctima de violencia intrafamiliar con 2 hijos',
                'Joven estudiante que requiere orientación en Salud Sexual y Reproductiva',
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNarrativeInput(preset)}
                  className="bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Outputs */}
          {engineResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              {/* Left Column: Needs Profile */}
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 space-y-6 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-pink-400" /> 🧬 Perfil de Necesidades
                    </h3>
                    <p className="text-[10px] text-slate-400">Diagnóstico multidimensional de riesgos</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Analizado Live
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Salud & SSR', status: engineResult.profile.salud },
                    { label: 'Violencia / Seguridad', status: engineResult.profile.violencia },
                    { label: 'Economía & Empleo', status: engineResult.profile.economia },
                    { label: 'Cuidado & Maternidad', status: engineResult.profile.cuidado },
                    { label: 'Vivienda & Hábitat', status: engineResult.profile.vivienda },
                    { label: 'Educación & Formación', status: engineResult.profile.educacion },
                    { label: 'Red de Apoyo Familiar', status: engineResult.profile.redApoyo },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                      <span className="font-bold text-slate-200">{item.label}</span>
                      <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-md ${getBadgeColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Rights Map */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Tu Mapa de Derechos Inmediatos
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Basado en Ley 1257 & CONPES 4080</span>
                </div>

                <div className="space-y-3">
                  {engineResult.rightsMap.map((rm, idx) => {
                    const Icon = rm.icon;
                    return (
                      <div key={idx} className={`p-4 rounded-2xl border ${rm.color} transition-all hover:shadow-md space-y-2`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-white/80 border border-current">
                            {rm.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{rm.norm}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-extrabold text-sm">{rm.title}</h4>
                            <p className="text-xs mt-1 opacity-90">{rm.route}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── PILLAR 2: ¿A QUÉ TENGO DERECHO? (Interactive Discovery Wizard) ── */}
      {activePillar === 'rights' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-pink-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">2. Descubre tus Derechos</h2>
              </div>
              <p className="text-xs text-slate-500">
                Responde 4 preguntas sencillas sin tecnicismos y SENDA generará tu Perfil Orientativo de Derechos.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-pink-50 text-pink-700 font-extrabold px-3 py-1 rounded-full border border-pink-200 self-start sm:self-auto">
              Herramienta Ciudadana Gratuita
            </span>
          </div>

          {!wizardFinished ? (
            <div className="max-w-2xl mx-auto bg-pink-50/40 rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-6">
              {/* Wizard Steps indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Paso {wizardStep} de 4</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-2 rounded-full transition-all ${
                        s === wizardStep ? 'w-8 bg-pink-600' : s < wizardStep ? 'w-3 bg-purple-400' : 'w-3 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {wizardStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-extrabold text-base text-slate-800">1. ¿En qué rango de edad te encuentras?</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    {['Menor de 18 años', '18 a 28 años', '29 a 45 años', '46 a 60+ años'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setWizardAnswers({ ...wizardAnswers, age: opt });
                          setWizardStep(2);
                        }}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 text-left transition-all cursor-pointer shadow-xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-extrabold text-base text-slate-800">2. ¿Cuál es tu situación principal en este momento?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    {[
                      { id: 'embarazo', label: '🤰 Estoy embarazada o en periodo de lactancia' },
                      { id: 'violencia', label: '🛡️ Requiero protección frente a violencia o amenazas' },
                      { id: 'empleo', label: '💼 Busco capacitación o independencia económica' },
                      { id: 'juridico', label: '⚖️ Necesito asesoría jurídica o custodia' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setWizardAnswers({ ...wizardAnswers, situation: opt.id });
                          setWizardStep(3);
                        }}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 text-left transition-all cursor-pointer shadow-xs"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-extrabold text-base text-slate-800">3. ¿Cuentas con empleo o ingresos económicos estables?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    {[
                      { id: 'sin_ingresos', label: 'Sin ingresos o en desempleo total' },
                      { id: 'informal', label: 'Trabajo informal o ingresos ocasionales' },
                      { id: 'formal', label: 'Trabajo formal o dependiente' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setWizardAnswers({ ...wizardAnswers, economicStatus: opt.id });
                          setWizardStep(4);
                        }}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 text-left transition-all cursor-pointer shadow-xs"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-extrabold text-base text-slate-800">4. ¿En qué territorio te encuentras ubicada?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    {[
                      'Cartagena (Zona Urbana)',
                      'Cartagena (Zona Insular / Corregimientos)',
                      'Bolívar / Región Caribe',
                      'Otro Departamento de Colombia',
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setWizardAnswers({ ...wizardAnswers, location: opt });
                          setWizardFinished(true);
                        }}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 text-left transition-all cursor-pointer shadow-xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">
                      Resultado Personalizado
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-2">TU PERFIL DE DERECHOS RECONOCIDOS</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(1);
                      setWizardFinished(false);
                    }}
                    className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                  >
                    Volver a responder
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Según la información proporcionada ({wizardAnswers.age}, {wizardAnswers.location}), la legislación colombiana y las políticas vigentes te garantizan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {[
                    { label: 'Salud Sexual & Reproductiva', detail: 'Acceso prioritario libre de barreras' },
                    { label: 'Protección Integral', detail: 'Atención multidisciplinaria inmediata' },
                    { label: 'Orientación Jurídica', detail: 'Acompañamiento legal sin costo' },
                    { label: 'Autonomía Económica', detail: 'Programas de capacitación y semillero' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 border border-white/10 p-3.5 rounded-2xl space-y-1">
                      <div className="text-xs font-bold text-amber-300">{item.label}</div>
                      <div className="text-[11px] text-slate-300">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── PILLAR 3: SENDA ONE (Una Sola Ruta) ── */}
      {activePillar === 'senda_one' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-emerald-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">3. SENDA ONE (Una Sola Ruta)</h2>
              </div>
              <p className="text-xs text-slate-500">
                En lugar de entregarte 14 enlaces dispersos, SENDA consolida tu atención en un mapa único y secuencial paso a paso.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Consolidación Simplificada
            </span>
          </div>

          {/* Active Step Hero Card */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Siguiente Paso Prioritario Requerido
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">¿Cuál es mi siguiente paso?</h3>
              <p className="text-xs text-slate-200 max-w-xl">
                <strong>Paso 01 — Medida de Protección Inmediata:</strong> Acudir a la Casa de Justicia de Chiquinquirá para activar la ruta de medida de protección física y asignación de trabajadora social.
              </p>
            </div>
            <button
              type="button"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs px-6 py-4 rounded-2xl shadow-lg transition-transform active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>Iniciar Paso 01 Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Steps Sequential Flow */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Tu Ruta Secuencial Consolidada (6 Pasos)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { num: '01', title: 'Protección', status: '🔴 Prioridad Urgente', color: 'border-red-400 bg-red-50 text-red-900' },
                { num: '02', title: 'Salud & SSR', status: '🟠 Pendiente', color: 'border-orange-300 bg-orange-50 text-orange-900' },
                { num: '03', title: 'Psicología', status: '🟠 Pendiente', color: 'border-amber-300 bg-amber-50 text-amber-900' },
                { num: '04', title: 'Orientación Jurídica', status: '🟡 En Proceso', color: 'border-yellow-300 bg-yellow-50 text-yellow-900' },
                { num: '05', title: 'Apoyo Económico', status: '🟡 Programado', color: 'border-blue-300 bg-blue-50 text-blue-900' },
                { num: '06', title: 'Proyecto de Vida', status: '⚪ Futuro', color: 'border-slate-200 bg-slate-50 text-slate-700' },
              ].map((step) => (
                <div key={step.num} className={`p-4 rounded-2xl border ${step.color} space-y-2 relative shadow-xs`}>
                  <div className="text-2xl font-black opacity-40 font-mono">{step.num}</div>
                  <div className="font-extrabold text-sm">{step.title}</div>
                  <div className="text-[10px] font-mono font-bold">{step.status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PILLAR 4: SENDA TERRITORIO (Mapa Vivo) ── */}
      {activePillar === 'territorio' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">4. SENDA Territorio (Mapa Vivo)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Directorio y mapa vivo interactivo de las políticas públicas y servicios de apoyo en Cartagena y Bolívar.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-amber-50 text-amber-700 font-extrabold px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
              Infraestructura Pública Actualizada
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '🏥 Casa de Justicia Chiquinquirá',
                type: 'Justicia & Protección',
                address: 'Cra. 58 #31-66, Cartagena',
                offers: 'Comisaría de familia, Fiscalía, Defensoría y orientación legal.',
                hours: 'Lun - Vie 7:30 AM - 4:00 PM',
              },
              {
                title: '🌷 Fundación Senda Mujer (Sede Cartagena)',
                type: 'Atención Integral',
                address: 'Atención Presencial & Telemedicina',
                offers: 'Psicología gratuita, Ginecología, Odontología y Asesoría.',
                hours: 'Línea 24/7 + Citas Programadas',
              },
              {
                title: '🏥 ESE Hospital Local Cartagena de Indias',
                type: 'Salud Pública & SSR',
                address: 'Varias Sedes (Pozón, Canapote, Arroz Barato)',
                offers: 'Control prenatal, Urgencias SSR y Red de apoyo maternal.',
                hours: 'Urgencias 24h / Citas diurnas',
              },
            ].map((res, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-amber-400 transition-all">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  {res.type}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{res.title}</h3>
                <p className="text-xs text-slate-600">{res.offers}</p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-1 border-t border-slate-200">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {res.address}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {res.hours}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PILLAR 5: SENDA GAP (Mapa de Brechas) ── */}
      {activePillar === 'senda_gap' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">5. SENDA GAP (Detector de Brechas de Género)</h2>
              </div>
              <p className="text-xs text-slate-500">
                La Fundación no solo ayuda a mujeres; produce evidencia cuantitativa sobre dónde están fallando las políticas públicas.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-red-50 text-red-700 font-extrabold px-3 py-1 rounded-full border border-red-200 self-start sm:self-auto">
              Auditoría de Impacto Institucional
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 bg-red-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <span className="text-[10px] font-mono bg-red-500/30 text-red-300 px-3 py-1 rounded-full border border-red-500/40">
                Muestra Anonimizada (6 Meses)
              </span>
              <div className="text-4xl font-black text-red-400 font-mono">57%</div>
              <h3 className="font-extrabold text-base text-white">Barrera de Acceso Detectada</h3>
              <p className="text-xs text-red-200 leading-relaxed">
                De 1,000 mujeres atendidas que intentaron acceder a rutas institucionales de atención, 570 enfrentaron obstáculos sistemáticos.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                Desglose de Causas Principales de Falla Institucional
              </h3>

              {[
                { title: 'Falta de información clara y oportuna', percent: 28, color: 'bg-red-500' },
                { title: 'Exceso de requisitos y trámites repetitivos', percent: 22, color: 'bg-amber-500' },
                { title: 'Demoras prolongadas en agendas institucionales', percent: 19, color: 'bg-purple-500' },
                { title: 'Barrera geográfica y costos de desplazamiento', percent: 15, color: 'bg-blue-500' },
                { title: 'Falta de acompañamiento psicosocial', percent: 16, color: 'bg-emerald-500' },
              ].map((gap, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{gap.title}</span>
                    <span className="font-mono text-slate-900">{gap.percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${gap.color} rounded-full`} style={{ width: `${gap.percent * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PILLAR 6: SENDA POLICY LAB (Observatorio Ciudadano) ── */}
      {activePillar === 'policy_lab' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">6. SENDA Policy Lab (Observatorio Tecnológico)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Transforma los datos en informes técnicos anonimizados para Alcaldías, Gobernaciones, Universidades y Cooperación Internacional.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
              Innovación Social Basada en Evidencia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Informe Cartagena 2026',
                subtitle: 'Barreras de Acceso en Salud Sexual y Reproductiva',
                date: 'Julio 2026',
                code: 'LAB-CTG-001',
              },
              {
                title: 'Mapa de Violencia Territorial',
                subtitle: 'Diagnóstico en Localidades 1, 2 y 3 de Cartagena',
                date: 'Agosto 2026',
                code: 'LAB-CTG-002',
              },
              {
                title: 'Brecha de Cuidado Femenino',
                subtitle: 'Impacto en la Autonomía Económica de Madres Solteras',
                date: 'Agosto 2026',
                code: 'LAB-BOL-003',
              },
            ].map((report, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-4 hover:border-indigo-400 transition-all">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                  <span>{report.code}</span>
                  <span>{report.date}</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{report.title}</h3>
                <p className="text-xs text-slate-600">{report.subtitle}</p>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver Informe Anonimizado</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PILLAR 7: SENDA DIGITAL TWIN (Gemelo Digital de Rutas) ── */}
      {activePillar === 'digital_twin' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-cyan-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">7. SENDA Digital Twin (Gemelo Digital)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Simula el recorrido institucional de una mujer para contrastar la Ruta Teorica vs la Ruta Real.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-cyan-50 text-cyan-700 font-extrabold px-3 py-1 rounded-full border border-cyan-200 self-start sm:self-auto">
              Simulación de Procesos Sociales
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ideal Route */}
            <div className="p-6 rounded-3xl border-2 border-emerald-400 bg-emerald-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full">
                  🟢 Ruta Ideal Prevista por la Ley
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">⏱️ 7 Días Esttimados</span>
              </div>
              <div className="space-y-2 text-xs font-bold text-slate-800">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">1. Orientación Telefónica / Presencial Senda</div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">2. Triaje de Protección Inmediata</div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">3. Expedición de Medida Cautelar (24h)</div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">4. Consulta Médica & SSR Prioritaria</div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">5. Ingreso a Programa de Autonomía</div>
              </div>
            </div>

            {/* Real Route */}
            <div className="p-6 rounded-3xl border-2 border-red-400 bg-red-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase text-red-800 bg-red-200 px-3 py-1 rounded-full">
                  🔴 Ruta Real Detectada por SENDA Twin
                </span>
                <span className="text-xs font-bold text-red-700 font-mono">⏱️ 45 Días Promedio</span>
              </div>
              <div className="space-y-2 text-xs font-bold text-slate-800">
                <div className="p-3 bg-white rounded-xl border border-red-200 text-red-900">1. Desconocimiento de la ruta e instituciones</div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-red-900">2. Remisión innecesaria entre 3 entidades</div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-red-900">3. Solicitud de copia de documentos físicos</div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-red-900">4. Demoras en asignación de citas en IPS</div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-red-900">5. Abandono de la ruta por desgaste</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PILLAR 8: SENDA VOZ (Multimodalidad & Accesibilidad) ── */}
      {activePillar === 'senda_voz' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-rose-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">8. SENDA Voz & Accesibilidad Total</h2>
              </div>
              <p className="text-xs text-slate-500">
                Diseñado para mujeres sin computador o sin facilidad de lectura. Funciona por voz, WhatsApp o modo de datos reducidos.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-rose-50 text-rose-700 font-extrabold px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
              Inclusión Tecnológica Universal
            </span>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center animate-pulse">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Simulador Interactivo de Voz SENDA</h3>
                  <span className="text-[10px] text-rose-400">Escuchando en vivo...</span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-3 py-1 rounded-full">WhatsApp / Audio</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 italic font-mono">&quot;No sé qué hacer... estoy sola y tengo miedo.&quot;</div>
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-100 leading-relaxed font-medium">
                🎙️ <strong>Respuesta por Voz SENDA:</strong> &quot;Estoy aquí contigo. No necesitas saber de trámites. Vamos paso a paso juntas. Tu primer paso es presionar el botón SOS o llamarme al 317 657 5800.&quot;
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PILLAR 9: SENDA ANÓNIMA ── */}
      {activePillar === 'senda_anon' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-slate-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">9. SENDA Anónima (Identidad Protegida)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Consulta cualquier información de derechos o salud sin ingresar tu nombre ni crear cuenta inicial.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-800 font-extrabold px-3 py-1 rounded-full border border-slate-300 self-start sm:self-auto">
              Privacidad & Cero Rastreo
            </span>
          </div>

          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900 text-white space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-pink-400">
              <LockKeyhole className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400">Tu Código Protegido Temporal</div>
              <div className="text-3xl font-black text-amber-300 font-mono tracking-widest">{anonymousId}</div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Guarda este código si deseas recuperar tu mapa de derechos en otro dispositivo sin registrar datos personales.
              </p>
            </div>

            <button
              type="button"
              onClick={generateNewAnonId}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generar Nueva Identidad Cifrada</span>
            </button>
          </div>
        </section>
      )}

      {/* ── PILLAR 10: PASAPORTE DIGITAL ── */}
      {activePillar === 'pasaporte' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Key className="w-5 h-5 text-teal-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">10. Control de mi Información (Pasaporte Digital)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Tú decides con qué profesional o institución compartes tu expediente y durante cuánto tiempo.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-700 font-extrabold px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
              Autonomía Digital Total
            </span>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Permisos de Acceso a tu Expediente Confidencial
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { key: 'trabajadoraSocial', label: 'Trabajadora Social Asignada' },
                  { key: 'psicologa', label: 'Psicóloga de Contención' },
                  { key: 'abogada', label: 'Abogada Asesora' },
                  { key: 'organizacionExterna', label: 'Organización Aliada Externa' },
                  { key: 'institucionSalud', label: 'IPS / Entidad de Salud Publica' },
                ].map((perm) => (
                  <div key={perm.key} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-800">{perm.label}</span>
                    <input
                      type="checkbox"
                      checked={(privacyPermissions as any)[perm.key]}
                      onChange={(e) =>
                        setPrivacyPermissions({ ...privacyPermissions, [perm.key]: e.target.checked })
                      }
                      className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-700">Duración del Permiso: 24 Horas</span>
                <button
                  type="button"
                  onClick={() =>
                    setPrivacyPermissions({
                      trabajadoraSocial: false,
                      psicologa: false,
                      abogada: false,
                      organizacionExterna: false,
                      institucionSalud: false,
                    })
                  }
                  className="bg-red-100 hover:bg-red-200 text-red-800 font-extrabold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Revocar Todos los Accesos Inmediatamente
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PILLAR 11: SENDA RED ── */}
      {activePillar === 'senda_red' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">11. SENDA Red (Red Verificada de Profesionales)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Conecta directamente a las beneficiarias con profesionales en psicología, derecho, medicina y trabajo social verificadas.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 font-extrabold px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
              Especialistas Auditadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Dra. María Paula Gómez', spec: 'Psicología Clínica & Trauma', verify: 'Senda Certified 2026' },
              { role: 'Dra. Sorelvis & Equipo Jurídico', spec: 'Derecho de Familia & Violencias', verify: 'Senda Certified 2026' },
              { role: 'Dra. Vanessa Martínez', spec: 'Ginecología & Salud Reproductiva', verify: 'Senda Certified 2026' },
            ].map((pro, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" /> {pro.verify}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{pro.role}</h3>
                <p className="text-xs text-slate-600">{pro.spec}</p>
                <Link
                  href="/agendar-cita"
                  className="block text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Solicitar Cita Verificada
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PILLAR 12: SENDA FUTURO ── */}
      {activePillar === 'senda_futuro' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-700" />
                </span>
                <h2 className="text-2xl font-black text-slate-900">12. SENDA Futuro (Proyecto de Vida & Autonomía)</h2>
              </div>
              <p className="text-xs text-slate-500">
                No nos quedamos en la contención de la crisis. Acompañamos a la mujer a construir su independencia integral.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-amber-50 text-amber-700 font-extrabold px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
              Planificación Estratégica Personal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: '🎓 Educación', desc: 'Cursos técnicos en SendaAcademia con certificación oficial.' },
              { icon: Briefcase, title: '💼 Empleo', desc: 'Vinculación a la red de empresas incluyentes de Cartagena.' },
              { icon: DollarSign, title: '💰 Independencia', desc: 'Asesoría en modelos de negocio e inclusión financiera.' },
              { icon: Home, title: '🏠 Vivienda & Bienestar', desc: 'Postulación a subsidios de vivienda y hábitat seguro.' },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl border border-slate-200 bg-amber-50/30 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
