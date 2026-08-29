'use client';

import React, { useState } from 'react';
import {
  Calendar, FileText, CheckCircle2, Lock, Upload, Clock, Plus,
  HeartPulse, Brain, Scale, Activity, TrendingDown, ShieldAlert,
  EyeOff, ChevronRight, Bell, Target,
} from 'lucide-react';
import Link from 'next/link';

interface ProfileData {
  name: string;
  code: string;
  docId: string;
  assignedSpecialist: string;
  primaryProgram: string;
  status: string;
  sendaIndex: number;
}

interface GestionAdministrativaProps {
  profile: ProfileData;
  onSOS: () => void;
  onIncognito: () => void;
}

type Tab = 'citas' | 'seguimiento' | 'documentos' | 'ruta' | 'index';

const APPOINTMENTS = [
  { id: 'APT-101', specialty: 'Ginecología Especializada', professional: 'Dra. Elena Ruiz', date: '2026-09-02', time: '10:00 AM', location: 'Sede Cartagena (Pie de la Popa)', status: 'CONFIRMADA', icon: '⚕️' },
  { id: 'APT-102', specialty: 'Psicología & Salud Mental', professional: 'Lic. Claudia Morales', date: '2026-09-10', time: '11:00 AM', location: 'Teleorientación Virtual', status: 'CONFIRMADA', icon: '🧠' },
  { id: 'APT-103', specialty: 'Odontología Integral', professional: 'Dr. Camilo Vargas', date: '2026-09-15', time: '02:00 PM', location: 'Sede Cartagena (Pie de la Popa)', status: 'PENDIENTE', icon: '🦷' },
  { id: 'APT-104', specialty: 'Asesoría Jurídica VBG', professional: 'Dra. Patricia Herrera', date: '2026-08-20', time: '09:00 AM', location: 'Sede Cartagena', status: 'ATENDIDA', icon: '⚖️' },
];

const FOLLOW_UPS = [
  { date: '10 Ago 2026', type: 'Psicología', note: 'Primera consulta de valoración emocional. Se identifican síntomas leves de ansiedad situacional. Plan de trabajo: técnicas de regulación emocional.', specialist: 'Lic. Claudia Morales', level: 'verde' },
  { date: '15 Ago 2026', type: 'Ginecología', note: 'Valoración reproductiva completa. Ecografía pélvica dentro de parámetros normales. Se orienta sobre salud sexual y derechos reproductivos.', specialist: 'Dra. Elena Ruiz', level: 'verde' },
  { date: '22 Ago 2026', type: 'Trabajo Social', note: 'Entrevista de seguimiento. Se identifican factores de vulnerabilidad económica. Se vincula al programa de emprendimiento textil.', specialist: 'Lic. Sorelvis Reyes', level: 'amarillo' },
  { date: 'Próximo', type: 'Seguimiento Mensual', note: 'Evaluación de avance en el programa. Verificar acceso a recursos económicos y red de apoyo familiar.', specialist: 'Equipo Senda Mujer', level: 'gris' },
];

const DOCUMENTS = [
  { name: 'Ecografía_Ginecológica_Ago2026.pdf', size: '1.4 MB', date: '2026-08-15', status: 'Verificado', icon: '📋' },
  { name: 'Documento_Identidad_Cedula.pdf', size: '820 KB', date: '2026-08-10', status: 'Verificado', icon: '🪪' },
  { name: 'Certificado_Taller_Textil.pdf', size: '640 KB', date: '2026-08-22', status: 'Aprobado', icon: '🏅' },
];

const ROADMAP = [
  { title: 'Entrevista Social Inicial & Valoración de Riesgo', done: true, date: '10 Ago 2026', icon: '🌱' },
  { title: 'Valoración Ginecológica y Salud Sexual', done: true, date: '15 Ago 2026', icon: '⚕️' },
  { title: 'Primera Consulta Psicológica', done: true, date: '18 Ago 2026', icon: '🧠' },
  { title: 'Inscripción al Taller de Confección & Emprendimiento', done: true, date: '22 Ago 2026', icon: '🧵' },
  { title: 'Consulta Odontológica Preventiva', done: false, date: '15 Sep 2026', icon: '🦷' },
  { title: 'Acceso a Capital Semilla de Emprendimiento', done: false, date: 'Oct 2026', icon: '💰' },
  { title: 'Graduación & Cierre de Programa', done: false, date: 'Nov 2026', icon: '🎓' },
];

const INDEX_DIMENSIONS = [
  { label: 'Riesgo de Vulnerabilidad', value: 38, color: '#F59E0B', icon: '🛡️', desc: 'Leve reducción respecto al ingreso' },
  { label: 'Red de Apoyo Social', value: 65, color: '#10B981', icon: '👥', desc: 'Fortalecida con talleres grupales' },
  { label: 'Autonomía Personal', value: 52, color: '#8B5CF6', icon: '🌟', desc: 'En proceso de fortalecimiento' },
  { label: 'Acceso a Servicios', value: 71, color: '#3B82F6', icon: '🏥', desc: 'Vinculada a 4 servicios activos' },
  { label: 'Bienestar Emocional', value: 60, color: '#EC4899', icon: '💖', desc: 'Mejoría notable en últimas sesiones' },
  { label: 'Proyecto de Vida', value: 44, color: '#F97316', icon: '🚀', desc: 'Definiendo metas a corto plazo' },
];

const statusColor: Record<string, string> = {
  CONFIRMADA: 'bg-emerald-100 text-emerald-800',
  PENDIENTE: 'bg-amber-100 text-amber-800',
  ATENDIDA: 'bg-slate-100 text-slate-600',
};

const levelColor: Record<string, string> = {
  verde: 'border-l-emerald-400',
  amarillo: 'border-l-amber-400',
  gris: 'border-l-slate-300',
};

export default function GestionAdministrativa({ profile, onSOS, onIncognito }: GestionAdministrativaProps) {
  const [activeTab, setActiveTab] = useState<Tab>('citas');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState(DOCUMENTS);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'citas', label: 'Mis Citas', icon: Calendar },
    { id: 'seguimiento', label: 'Seguimientos', icon: HeartPulse },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'ruta', label: 'Hoja de Ruta', icon: Target },
    { id: 'index', label: 'SENDA Index', icon: Activity },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDocuments([
      { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, date: new Date().toISOString().split('T')[0], status: 'Cargado', icon: '📄' },
      ...documents,
    ]);
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              🏥 Mi Gestión Integral
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">Expediente de {profile.name.split(' ')[0]}</h2>
            <p className="text-xs text-pink-100 mt-1">
              Expediente <strong className="text-amber-300 font-mono">{profile.code}</strong> • {profile.status}
            </p>
            <p className="text-xs text-pink-200 mt-0.5">Especialista: {profile.assignedSpecialist}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-center backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-amber-300">{profile.sendaIndex}</div>
              <div className="text-[10px] text-pink-200 font-bold uppercase">SENDA Index</div>
              <div className="text-[10px] text-emerald-300">↓ Mejorando</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === id
                ? 'bg-[#52166F] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: CITAS ──────────────────────────────────────────────────────── */}
      {activeTab === 'citas' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-lg font-extrabold text-[#52166F]">Mis Citas Médicas & Acompañamiento</h3>
            <Link href="/agendar-cita" className="bg-[#E12880] hover:bg-[#c41070] text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 transition-all">
              <Plus className="w-4 h-4" />
              Nueva Cita
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{apt.icon}</span>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{apt.id}</span>
                      <h4 className="font-extrabold text-sm text-[#52166F]">{apt.specialty}</h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${statusColor[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold mb-2">{apt.professional}</p>
                <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <strong className="text-[#52166F]">{apt.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora:</span>
                    <strong>{apt.time}</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">📍 {apt.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: SEGUIMIENTOS ───────────────────────────────────────────────── */}
      {activeTab === 'seguimiento' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-lg font-extrabold text-[#52166F]">Historial de Seguimientos</h3>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700">
              <Bell className="w-3.5 h-3.5" />
              Próximo: Día 30 — {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {FOLLOW_UPS.map((f, i) => (
              <div key={i} className={`bg-white rounded-2xl border-l-4 ${levelColor[f.level]} border-t border-r border-b border-pink-100 p-5 shadow-sm`}>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      f.type === 'Psicología' ? 'bg-purple-100 text-purple-700' :
                      f.type === 'Ginecología' ? 'bg-pink-100 text-pink-700' :
                      f.type === 'Trabajo Social' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{f.type}</span>
                    <span className="text-xs font-bold text-slate-700">{f.date}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{f.specialist}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>

          {/* Senda "No abandona" Schedule */}
          <div className="bg-gradient-to-r from-[#52166F]/5 to-[#E12880]/5 rounded-2xl border border-pink-100 p-5">
            <h4 className="font-extrabold text-sm text-[#52166F] mb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#E12880]" />
              Senda No Te Abandona — Calendario de Contacto
            </h4>
            <div className="space-y-2">
              {[
                { day: 'Día 1', label: 'Bienvenida & Vinculación', done: true },
                { day: 'Día 3', label: 'Verificación de acceso a atención', done: true },
                { day: 'Día 7', label: 'Seguimiento de bienestar inicial', done: true },
                { day: 'Día 15', label: 'Revisión de progreso en programa', done: false },
                { day: 'Día 30', label: 'Evaluación mensual integral', done: false },
                { day: 'Día 90', label: 'Evaluación trimestral SENDA Index', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="font-extrabold text-[#52166F] w-14 shrink-0">{item.day}</span>
                  <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: DOCUMENTOS ─────────────────────────────────────────────────── */}
      {activeTab === 'documentos' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-pink-200 p-6 space-y-5">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#52166F] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#E12880]" />
                  Bóveda de Documentos Cifrada
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Protegido bajo Ley 1581 de 2012</p>
              </div>
              <label className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-md flex items-center gap-2 cursor-pointer hover:shadow-lg transition-all">
                <Upload className="w-4 h-4" />
                {isUploading ? 'Subiendo...' : 'Subir Documento'}
                <input type="file" onChange={handleUpload} className="hidden" disabled={isUploading} />
              </label>
            </div>

            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{doc.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{doc.name}</h4>
                      <span className="text-[10px] text-slate-500">{doc.size} • {doc.date}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: HOJA DE RUTA ────────────────────────────────────────────────── */}
      {activeTab === 'ruta' && (
        <div className="space-y-5 animate-fadeIn">
          <h3 className="text-lg font-extrabold text-[#52166F]">Mi Hoja de Ruta & Proyecto de Vida</h3>
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-pink-100" />
            <div className="space-y-4">
              {ROADMAP.map((step, i) => (
                <div key={i} className="flex items-start gap-5 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 shrink-0 border-2 ${step.done ? 'bg-emerald-100 border-emerald-400' : 'bg-white border-slate-200'}`}>
                    {step.icon}
                  </div>
                  <div className={`flex-1 bg-white rounded-2xl border p-4 shadow-sm ${step.done ? 'border-emerald-100' : 'border-slate-100'}`}>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className={`font-bold text-sm ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#52166F]">{step.date}</span>
                        {step.done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: SENDA INDEX ─────────────────────────────────────────────────── */}
      {activeTab === 'index' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-lg font-extrabold text-[#52166F]">SENDA Index — Indicador de Progreso</h3>
            <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full">
              ⚠️ Indicador interno de acompañamiento. No es un diagnóstico clínico.
            </span>
          </div>

          {/* Main Score */}
          <div className="bg-gradient-to-br from-[#3B0852] to-[#52166F] text-white rounded-3xl p-8 text-center shadow-xl">
            <p className="text-xs text-pink-200 uppercase tracking-widest mb-3">Nivel de Vulnerabilidad Actual</p>
            <div className="text-7xl font-extrabold text-amber-300 mb-2">{profile.sendaIndex}</div>
            <div className="text-sm font-bold text-pink-100 mb-4">SENDA Index — Escala 0–100 (menor = mayor autonomía)</div>
            <div className="flex justify-center gap-4 text-xs">
              {[
                { label: 'Ingreso', value: 78, color: 'text-red-400' },
                { label: '30 días', value: 52, color: 'text-amber-400' },
                { label: '90 días', value: profile.sendaIndex, color: 'text-emerald-400' },
              ].map((p) => (
                <div key={p.label} className="bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                  <div className={`text-2xl font-extrabold ${p.color}`}>{p.value}</div>
                  <div className="text-pink-200">{p.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-emerald-300 font-bold text-sm">
              <TrendingDown className="w-4 h-4" />
              Mejora del 56% desde el ingreso
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INDEX_DIMENSIONS.map((dim) => (
              <div key={dim.label} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{dim.icon}</span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">{dim.label}</p>
                      <p className="text-[10px] text-slate-400">{dim.desc}</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold" style={{ color: dim.color }}>{dim.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${dim.value}%`, backgroundColor: dim.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-pink-50 rounded-2xl border border-pink-100 p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-[#52166F]">Nota metodológica:</strong> El SENDA Index es un indicador interno de acompañamiento creado por la Fundación Senda Mujer. No representa un diagnóstico psicológico ni jurídico. Su función es orientar al equipo profesional sobre el avance en los factores de vulnerabilidad identificados durante el proceso de acompañamiento.
          </div>
        </div>
      )}
    </div>
  );
}
