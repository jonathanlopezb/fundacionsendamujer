'use client';

import React, { useState } from 'react';
import {
  BookOpen, PlayCircle, CheckCircle2, Award, Clock, Sparkles, Download,
  FileText, Lock, ChevronDown, ChevronRight, Star, Globe, Users, ShieldAlert, EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileData {
  name: string;
  code: string;
  docId: string;
  coursesCompleted: number;
  totalCourses: number;
}

interface AcademiaPortalProps {
  profile: ProfileData;
  onSOS: () => void;
  onIncognito: () => void;
}

const MODULES = [
  {
    id: 1,
    category: 'Salud',
    icon: '⚕️',
    title: 'Módulo 1: Ginecología Preventiva & Derechos Reproductivos',
    duration: '25 min',
    instructor: 'Dra. Elena Ruiz — Ginecóloga Especialista',
    desc: 'Conoce tu anatomía, salud sexual, señales de alarma y la jurisprudencia colombiana C-055/2022 y C-355/2006. Aprende a reconocer cuándo buscar atención médica urgente.',
    completed: true,
    resources: ['Guía de Salud Reproductiva.pdf', 'Sentencias Constitucionales Resumen.pdf'],
  },
  {
    id: 2,
    category: 'Emprendimiento',
    icon: '🧵',
    title: 'Módulo 2: Confección & Patronaje Textil Básico',
    duration: '40 min',
    instructor: 'Instructora Carmen Lora — SENA Aliado',
    desc: 'Fundamentos de toma de medidas, trazado de patrones y costura a máquina. Aprende a crear tu propia línea de ropa y empieza tu emprendimiento desde casa.',
    completed: true,
    resources: ['Guía de Patronaje Básico.pdf', 'Lista de Herramientas Mínimas.pdf'],
  },
  {
    id: 3,
    category: 'Digital',
    icon: '📱',
    title: 'Módulo 3: Marketing Digital & WhatsApp Business',
    duration: '30 min',
    instructor: 'Lic. Mateo Gómez — Marketing Digital',
    desc: 'Crea tu catálogo digital, atiende clientes por WhatsApp Business, usa Instagram para ventas y promociona tus productos en Cartagena y la Costa Caribe.',
    completed: false,
    resources: ['Plantilla Catálogo Digital.pdf', 'Guía WhatsApp Business.pdf'],
  },
  {
    id: 4,
    category: 'Jurídico',
    icon: '⚖️',
    title: 'Módulo 4: Prevención VBG & Autonomía Jurídica',
    duration: '35 min',
    instructor: 'Dra. Patricia Herrera — Abogada VBG',
    desc: 'Cómo identificar violencia psicológica y económica, solicitar medidas de protección, activar rutas de denuncia ante la Fiscalía y Comisaría de Familia.',
    completed: false,
    resources: ['Ruta de Denuncia VBG Colombia.pdf', 'Medidas de Protección — Paso a Paso.pdf'],
  },
  {
    id: 5,
    category: 'Finanzas',
    icon: '💰',
    title: 'Módulo 5: Finanzas Personales & Ahorro Inteligente',
    duration: '28 min',
    instructor: 'Lic. Paola Mendoza — Asesora Financiera',
    desc: 'Aprende a crear un presupuesto mensual, ahorrar con ingresos irregulares, acceder a microcréditos y construir tu independencia económica.',
    completed: false,
    resources: ['Plantilla Presupuesto Mensual.xlsx', 'Directorio de Microcréditos Cartagena.pdf'],
  },
  {
    id: 6,
    category: 'Bienestar',
    icon: '🧠',
    title: 'Módulo 6: Salud Mental & Autocuidado Emocional',
    duration: '32 min',
    instructor: 'Lic. Claudia Morales — Psicóloga',
    desc: 'Técnicas de regulación emocional, manejo del duelo, autocuidado en situaciones de violencia y fortalecimiento de tu autoestima y proyecto de vida.',
    completed: false,
    resources: ['Diario de Emociones.pdf', 'Técnicas de Respiración y Mindfulness.pdf'],
  },
];

const CATEGORIES = ['Todos', 'Salud', 'Emprendimiento', 'Digital', 'Jurídico', 'Finanzas', 'Bienestar'];

export default function AcademiaPortal({ profile, onSOS, onIncognito }: AcademiaPortalProps) {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [filter, setFilter] = useState('Todos');

  const completedCount = MODULES.filter((m) => m.completed).length;
  const progressPct = Math.round((completedCount / MODULES.length) * 100);

  const filteredModules = filter === 'Todos' ? MODULES : MODULES.filter((m) => m.category === filter);

  const handleCertificate = () => {
    setShowCertificate(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <div className="space-y-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="bg-amber-400 text-[#3B0852] font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <BookOpen className="w-3.5 h-3.5" /> SendaAcademia — Panel de Formación
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tu Academia de Capacitación
            </h2>
            <p className="text-xs text-pink-100 max-w-lg leading-relaxed">
              Formación virtual gratuita con certificación oficial. Completa los módulos a tu ritmo.
            </p>
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-[10px] font-bold text-pink-200 mb-1">
                  <span>Progreso global</span>
                  <span>{completedCount}/{MODULES.length} módulos • {progressPct}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5">
                  <div className="bg-amber-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleCertificate}
            className="bg-amber-400 hover:bg-amber-300 text-[#3B0852] font-extrabold px-6 py-3 rounded-full text-sm shadow-lg flex items-center gap-2 shrink-0 cursor-pointer transition-all"
          >
            <Award className="w-5 h-5" />
            Generar Mi Certificado
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="bg-gradient-to-br from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-8 rounded-3xl border-2 border-amber-400 shadow-2xl space-y-6 text-center relative overflow-hidden animate-fadeIn">
          <div className="w-20 h-20 bg-amber-400 text-[#3B0852] rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Award className="w-12 h-12" />
          </div>
          <span className="bg-amber-400/20 text-amber-300 font-extrabold text-xs px-4 py-1 rounded-full border border-amber-300/30 uppercase tracking-widest">
            Certificado Oficial de Capacitación
          </span>
          <div className="space-y-1">
            <p className="text-xs text-pink-100 uppercase tracking-wider">La Fundación Senda Mujer certifica a:</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white underline decoration-amber-400 underline-offset-8">{profile.name}</h3>
            <p className="text-xs text-amber-300 font-mono">C.C. {profile.docId} • Expediente: {profile.code}</p>
          </div>
          <p className="text-xs text-pink-100 max-w-lg mx-auto leading-relaxed">
            Por haber completado satisfactoriamente la formación en <strong>Salud Reproductiva, Derechos de la Mujer, Emprendimiento y Autonomía Jurídica</strong> — Cartagena de Indias, Colombia.
          </p>
          <div className="pt-4 border-t border-pink-400/30 flex justify-between items-center text-[10px] text-pink-200">
            <span>Fecha de Emisión: {new Date().toLocaleDateString('es-CO')}</span>
            <span>Verificación: SM-CERT-{profile.code.replace('SM-', '')}</span>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => setShowCertificate(false)} className="bg-white text-[#52166F] font-extrabold px-6 py-2.5 rounded-full text-xs hover:bg-pink-100 transition-colors cursor-pointer">
              Cerrar
            </button>
            <button className="bg-amber-400 text-[#3B0852] font-extrabold px-6 py-2.5 rounded-full text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
              <Download className="w-4 h-4" /> Descargar PDF
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === cat
                ? 'bg-[#52166F] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Active Module Player */}
        <div className="lg:col-span-7 space-y-5">

          {/* Video Placeholder */}
          <div className="bg-gradient-to-br from-[#3B0852] to-slate-900 rounded-3xl overflow-hidden aspect-video shadow-xl flex flex-col items-center justify-center text-center p-8 border border-slate-700 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#52166F]/50 to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 bg-[#E12880]/20 rounded-full border border-[#E12880]/40 flex items-center justify-center mx-auto animate-pulse">
                <PlayCircle className="w-10 h-10 text-[#E12880]" />
              </div>
              <div>
                <span className="bg-amber-400 text-[#3B0852] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">{activeModule.category}</span>
                <h3 className="font-extrabold text-base text-white mt-2 max-w-sm mx-auto leading-tight">{activeModule.title}</h3>
                <p className="text-xs text-pink-200 mt-1">{activeModule.instructor} • {activeModule.duration}</p>
              </div>
              <button className="bg-[#E12880] hover:bg-[#c41070] text-white font-extrabold px-8 py-2.5 rounded-full text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2 mx-auto">
                <PlayCircle className="w-4 h-4" />
                Iniciar Módulo
              </button>
            </div>
          </div>

          {/* Module Info */}
          <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeModule.icon}</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${activeModule.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-[#E12880]'}`}>
                  {activeModule.completed ? '✅ Completado' : '🔓 Disponible'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {activeModule.duration}
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-[#52166F]">{activeModule.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{activeModule.desc}</p>
            <p className="text-xs font-bold text-[#52166F]">Instructor/a: {activeModule.instructor}</p>

            {/* Resources */}
            <div className="pt-4 border-t border-pink-100">
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">📎 Material Descargable</p>
              <div className="space-y-2">
                {activeModule.resources.map((r) => (
                  <button key={r} className="flex items-center gap-2 text-xs font-bold text-[#52166F] hover:text-[#E12880] transition-colors cursor-pointer">
                    <FileText className="w-3.5 h-3.5 text-[#E12880] shrink-0" />
                    <Download className="w-3 h-3" />
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-pink-100 flex justify-between items-center flex-wrap gap-3">
              {activeModule.completed ? (
                <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Módulo Completado
                </div>
              ) : (
                <button className="bg-[#E12880] text-white font-extrabold px-5 py-2 rounded-full text-xs shadow-sm hover:bg-[#c41070] transition-all cursor-pointer flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  Comenzar Ahora
                </button>
              )}
              <button
                onClick={handleCertificate}
                className="bg-amber-400 hover:bg-amber-300 text-[#3B0852] font-extrabold px-5 py-2 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Emitir Certificado
              </button>
            </div>
          </div>
        </div>

        {/* Right: Modules List */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Módulos del Programa
          </h4>

          <div className="space-y-2">
            {filteredModules.map((mod) => {
              const isSelected = activeModule.id === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#E12880] bg-pink-50 ring-2 ring-[#E12880]/30'
                      : 'border-slate-200 hover:border-pink-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="text-base shrink-0">{mod.icon}</span>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-slate-800 leading-snug truncate">{mod.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#52166F] font-bold">{mod.duration}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{mod.category}</span>
                        </div>
                      </div>
                    </div>
                    {mod.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Library CTA */}
          <div className="bg-gradient-to-br from-[#52166F]/5 to-[#E12880]/5 border border-pink-100 rounded-2xl p-4 space-y-2 mt-4">
            <p className="text-xs font-extrabold text-[#52166F] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-500" />
              Biblioteca de Recursos Adicionales
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Accede a guías PDF, directorio de servicios en Cartagena, y material de apoyo para tu proyecto de vida.
            </p>
            <button className="text-[11px] font-extrabold text-[#E12880] flex items-center gap-1 cursor-pointer hover:underline">
              Ver biblioteca completa <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
