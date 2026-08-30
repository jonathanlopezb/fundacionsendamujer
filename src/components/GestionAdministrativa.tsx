'use client';

import React, { useState } from 'react';
import {
  Calendar, FileText, CheckCircle2, Lock, Upload, Clock, Plus,
  HeartPulse, Brain, Scale, Activity, TrendingDown, ShieldAlert,
  EyeOff, ChevronRight, Bell, Target, Coins, Home, Sparkles, UserCheck, DollarSign
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

type Tab = 'citas' | 'seguimiento' | 'metas' | 'capital_semilla' | 'documentos' | 'index';

const APPOINTMENTS = [
  { id: 'APT-101', specialty: 'Ginecología & Salud Reproductiva', professional: 'Dra. Elena Ruiz', date: '2026-09-02', time: '10:00 AM', location: 'Sede Cartagena (Pie de la Popa)', status: 'CONFIRMADA', icon: '⚕️' },
  { id: 'APT-102', specialty: 'Psicología & Salud Mental', professional: 'Lic. Claudia Morales', date: '2026-09-10', time: '11:00 AM', location: 'Teleorientación Virtual', status: 'CONFIRMADA', icon: '🧠' },
  { id: 'APT-103', specialty: 'Odontología Integral', professional: 'Dr. Camilo Vargas', date: '2026-09-15', time: '02:00 PM', location: 'Sede Cartagena (Pie de la Popa)', status: 'PENDIENTE', icon: '🦷' },
  { id: 'APT-104', specialty: 'Medicina General Preventiva', professional: 'Dra. María Patricia Gómez', date: '2026-09-18', time: '08:30 AM', location: 'Sede Cartagena', status: 'CONFIRMADA', icon: '🩺' },
  { id: 'APT-105', specialty: 'Visita Domiciliaria de Acompañamiento', professional: 'Lic. Sorelvis Murillo & Equipo Social', date: '2026-09-22', time: '09:00 AM', location: 'Vivienda Usuaria — Olaya Herrera, Cartagena', status: 'PROGRAMADA', icon: '🏡' },
  { id: 'APT-106', specialty: 'Asesoría Jurídica VBG (Ley 1257)', professional: 'Dra. Patricia Herrera', date: '2026-08-20', time: '09:00 AM', location: 'Sede Cartagena', status: 'ATENDIDA', icon: '⚖️' },
];

const FOLLOW_UPS = [
  { date: '22 Ago 2026', type: 'Visita Domiciliaria', note: 'Visita psicosocial en territorio (Olaya Herrera). Se verifica entorno seguro de la usuaria, red comunitaria y condiciones para la entrega de insumos de emprendimiento.', specialist: 'Lic. Sorelvis Murillo', level: 'verde' },
  { date: '18 Ago 2026', type: 'Psicología', note: 'Segunda consulta de fortaleza emocional. Excelente evolución y actitud proactiva ante los talleres formativos.', specialist: 'Lic. Claudia Morales', level: 'verde' },
  { date: '15 Ago 2026', type: 'Ginecología', note: 'Valoración reproductiva completa. Ecografía pélvica dentro de parámetros normales. Se entrega kit de autocuidado.', specialist: 'Dra. Elena Ruiz', level: 'verde' },
  { date: '10 Ago 2026', type: 'Trabajo Social', note: 'Entrevista de ingreso y caracterización de hogar. Se vincula al programa de emprendimiento textil con capital semilla.', specialist: 'Lic. Sorelvis Murillo', level: 'amarillo' },
];

const GOALS = [
  { id: 1, title: 'Autonomía Económica & Emprendimiento Textil', progress: 85, targetDate: 'Octubre 2026', category: 'Emprendimiento', status: 'En Progreso', desc: 'Lanzamiento de la primera colección de confección textil con apoyo del capital semilla.', icon: '🧵' },
  { id: 2, title: 'Control Médico Integral & Salud Reproductiva', progress: 100, targetDate: 'Agosto 2026', category: 'Salud', status: 'Completada', desc: 'Chequeos ginecológicos y de salud preventiva al día con especialistas Senda.', icon: '⚕️' },
  { id: 3, title: 'Capacitación Digital & WhatsApp Business', progress: 90, targetDate: 'Septiembre 2026', category: 'Educación', status: 'En Progreso', desc: 'Aprobación de 5 de 6 módulos en SendaAcademia.', icon: '🎓' },
  { id: 4, title: 'Fortalecimiento Emocional & Red de Apoyo', progress: 75, targetDate: 'Noviembre 2026', category: 'Bienestar', status: 'En Progreso', desc: 'Asistencia continua a sesiones de psicología y grupo de apoyo en Cartagena.', icon: '🧠' },
];

const SEED_PROJECT = {
  projectName: 'Confecciones & Diseños Senda — Taller Textil Olaya',
  grantedAmount: 2500000,
  disbursedAmount: 2500000,
  mentor: 'Lic. Sorelvis Murillo & Mg. Karen Ramos',
  salesMonth: 1250000,
  productionUnits: 140,
  itemsPurchased: [
    { name: 'Máquina de Coser Fileteadora Industrial', cost: 1400000, date: '12 Ago 2026', status: 'Entregado' },
    { name: 'Insumos de Tela, Hilos & Cortadores', cost: 600000, date: '15 Ago 2026', status: 'Entregado' },
    { name: 'Kit de Empaque & Branding Comercial', cost: 500000, date: '20 Ago 2026', status: 'Entregado' },
  ],
  milestones: [
    { title: 'Aprobación del Plan de Negocio', done: true },
    { title: 'Desembolso del Capital Semilla ($2.500.000 COP)', done: true },
    { title: 'Adquisición de Maquinaria e Insumos', done: true },
    { title: 'Primera Producción y Ventas Locales', done: true },
    { title: 'Participación en Feria de Emprendimiento Senda', done: false },
  ],
};

const DOCUMENTS = [
  { name: 'Acta_Entrega_Capital_Semilla_2026.pdf', size: '1.8 MB', date: '2026-08-20', status: 'Verificado', icon: '📜' },
  { name: 'Ecografía_Ginecológica_Ago2026.pdf', size: '1.4 MB', date: '2026-08-15', status: 'Verificado', icon: '📋' },
  { name: 'Documento_Identidad_Cedula.pdf', size: '820 KB', date: '2026-08-10', status: 'Verificado', icon: '🪪' },
  { name: 'Informe_Visita_Domiciliaria_Olaya.pdf', size: '950 KB', date: '2026-08-22', status: 'Verificado', icon: '🏡' },
];

const INDEX_DIMENSIONS = [
  { label: 'Riesgo de Vulnerabilidad', value: 38, color: '#F59E0B', icon: '🛡️', desc: 'Leve reducción respecto al ingreso' },
  { label: 'Red de Apoyo Social', value: 65, color: '#10B981', icon: '👥', desc: 'Fortalecida con visitas y talleres' },
  { label: 'Autonomía Económica', value: 85, color: '#8B5CF6', icon: '💰', desc: 'Proyecto productivo en marcha' },
  { label: 'Acceso a Salud Especializada', value: 90, color: '#3B82F6', icon: '🏥', desc: 'Atención ginecológica y médica al día' },
  { label: 'Bienestar Emocional', value: 75, color: '#EC4899', icon: '💖', desc: 'Acompañamiento psicológico continuo' },
];

const statusColor: Record<string, string> = {
  CONFIRMADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PROGRAMADA: 'bg-purple-100 text-purple-800 border-purple-200',
  PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-200',
  ATENDIDA: 'bg-slate-100 text-slate-600 border-slate-200',
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
    { id: 'citas', label: 'Citas & Visitas Domiciliarias', icon: Calendar },
    { id: 'seguimiento', label: 'Seguimiento Clínico', icon: HeartPulse },
    { id: 'metas', label: '¿Cómo van tus metas?', icon: Target },
    { id: 'capital_semilla', label: 'Proyectos & Capital Semilla', icon: Coins },
    { id: 'documentos', label: 'Bóveda de Documentos', icon: FileText },
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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              🏥 Expediente & Dashboard de Beneficiaria
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">Gestión de {profile.name}</h2>
            <p className="text-xs text-pink-100 mt-1">
              Código Expediente: <strong className="text-amber-300 font-mono">{profile.code}</strong> • Directora: Dra. Sorelvis Murillo
            </p>
            <p className="text-xs text-pink-200 mt-0.5">Especialista Asignada: {profile.assignedSpecialist}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-center backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-amber-300">{profile.sendaIndex}</div>
              <div className="text-[10px] text-pink-200 font-bold uppercase">SENDA Index</div>
              <div className="text-[10px] text-emerald-300">↓ Avance Positivo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === id
                ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-md border border-pink-400/40'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-pink-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: CITAS & VISITAS DOMICILIARIAS ────────────────────────────────── */}
      {activeTab === 'citas' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#52166F]">Agendamiento de Citas & Visitas Domiciliarias</h3>
              <p className="text-xs text-slate-500">Ginecología, Odontología, Medicina, Psicología y Acompañamiento en Vivienda</p>
            </div>
            <Link href="/agendar-cita" className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]">
              <Plus className="w-4 h-4 text-amber-300" />
              Solicitar Nueva Cita / Visita
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{apt.icon}</span>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{apt.id}</span>
                      <h4 className="font-extrabold text-sm text-[#52166F]">{apt.specialty}</h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusColor[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold mb-2">Atiende: <strong>{apt.professional}</strong></p>
                <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-100 space-y-1 text-xs text-slate-700">
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

      {/* ── TAB: SEGUIMIENTO CLÍNICO & DOMICILIARIO ─────────────────────────── */}
      {activeTab === 'seguimiento' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-lg font-extrabold text-[#52166F]">Historial de Clinico & Visitas en Territorio</h3>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              Directora Responsable: Dra. Sorelvis Murillo (+57 301 469 2095)
            </div>
          </div>

          <div className="space-y-4">
            {FOLLOW_UPS.map((f, i) => (
              <div key={i} className={`bg-white rounded-2xl border-l-4 ${levelColor[f.level]} border-t border-r border-b border-pink-100 p-5 shadow-sm`}>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      f.type === 'Visita Domiciliaria' ? 'bg-emerald-100 text-emerald-800' :
                      f.type === 'Psicología' ? 'bg-purple-100 text-purple-800' :
                      f.type === 'Ginecología' ? 'bg-pink-100 text-pink-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>{f.type}</span>
                    <span className="text-xs font-bold text-slate-700">{f.date}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{f.specialist}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ¿CÓMO VAN TUS METAS? ────────────────────────────────────────── */}
      {activeTab === 'metas' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#52166F]">¿Cómo Van Tus Metas Personalizadas?</h3>
              <p className="text-xs text-slate-500">Plan de empoderamiento integral acordado con la Fundación Senda Mujer</p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-pink-100 text-[#52166F]">
              4 Metas Asignadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GOALS.map((g) => (
              <div key={g.id} className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{g.icon}</span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-500">{g.category}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{g.title}</h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    g.status === 'Completada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-slate-500">Avance Actual</span>
                    <span className="text-[#52166F]">{g.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E12880] to-[#52166F] transition-all duration-700"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-pink-50 flex justify-between text-[11px] text-slate-400">
                  <span>Meta pactada para:</span>
                  <strong className="text-slate-700">{g.targetDate}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: PROYECTOS PRODUCTIVOS & CAPITAL SEMILLA ───────────────────── */}
      {activeTab === 'capital_semilla' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-300" />
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Fondo de Emprendimiento Femenino Senda</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">{SEED_PROJECT.projectName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-pink-200 block">Capital Otorgado</span>
                <span className="text-lg font-extrabold text-amber-300">$2.500.000 COP</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-pink-200 block">Ventas Último Mes</span>
                <span className="text-lg font-extrabold text-emerald-300">$1.250.000 COP</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-pink-200 block">Unidades Producidas</span>
                <span className="text-lg font-extrabold text-white">140 Prendas</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-pink-200 block">Tutora Responsable</span>
                <span className="text-xs font-extrabold text-pink-100">Dra. Sorelvis Murillo</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-4 shadow-sm">
            <h4 className="font-extrabold text-sm text-[#52166F] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Insumos & Maquinaria Adquiridos con el Capital Semilla
            </h4>
            <div className="space-y-3">
              {SEED_PROJECT.itemsPurchased.map((item, idx) => (
                <div key={idx} className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">{item.name}</h5>
                    <span className="text-[10px] text-slate-400">Fecha de Entrega: {item.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-[#52166F]">${item.cost.toLocaleString('es-CO')} COP</span>
                    <span className="block text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: DOCUMENTOS ─────────────────────────────────────────────────── */}
      {activeTab === 'documentos' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-5">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#52166F] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#E12880]" />
                  Bóveda de Documentos Cifrada
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Protegido bajo la Ley 1581 de 2012 de Habeas Data</p>
              </div>
              <label className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-md flex items-center gap-2 cursor-pointer hover:shadow-lg transition-all">
                <Upload className="w-4 h-4 text-amber-300" />
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

      {/* ── TAB: SENDA INDEX ─────────────────────────────────────────────────── */}
      {activeTab === 'index' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-[#3B0852] to-[#52166F] text-white rounded-3xl p-8 text-center shadow-xl">
            <p className="text-xs text-pink-200 uppercase tracking-widest mb-3">SENDA Index — Indicador de Progreso</p>
            <div className="text-7xl font-extrabold text-amber-300 mb-2">{profile.sendaIndex}</div>
            <div className="text-sm font-bold text-pink-100 mb-4">Escala 0–100 (Menor puntaje = Mayor Autonomía y Seguridad)</div>
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-extrabold text-sm">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              Evolución altamente positiva bajo tutela de la Dra. Sorelvis Murillo
            </div>
          </div>

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
        </div>
      )}
    </div>
  );
}
