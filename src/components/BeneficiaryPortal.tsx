'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, Shield, FileText, Upload, Calendar, CheckCircle2, Lock, Sparkles, BookOpen, Clock, Heart, Award, ArrowRight, Activity, Plus } from 'lucide-react';

export default function BeneficiaryPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [accessCode, setAccessCode] = useState('SM-2026-CARTAGENA');
  const [activeTab, setActiveTab] = useState<'citas' | 'documentos' | 'seguimiento' | 'actividades'>('citas');

  // Simulated Beneficiary Profile State
  const [profile, setProfile] = useState({
    name: 'María Alejandra Torres',
    code: 'SM-8842',
    phone: '+57 301 555 0192',
    neighborhood: 'Olaya Herrera, Cartagena',
    assignedSpecialist: 'Dra. Elena Ruiz — Ginecología & Salud Reproductiva',
    primaryProgram: 'Programa 4 — Ruta de Salud y Derechos Reproductivos',
    status: 'Activa — Acompañamiento Continuo',
  });

  const [appointments, setAppointments] = useState([
    {
      id: 'APT-101',
      specialty: 'Ginecología Especializada',
      professional: 'Dra. Elena Ruiz',
      date: '2026-09-02',
      time: '10:00 AM',
      location: 'Sede Cartagena (Pie de la Popa)',
      status: 'CONFIRMADA',
    },
    {
      id: 'APT-102',
      specialty: 'Odontología Integral',
      professional: 'Dr. Camilo Vargas',
      date: '2026-09-05',
      time: '02:00 PM',
      location: 'Sede Cartagena (Pie de la Popa)',
      status: 'PENDIENTE',
    },
    {
      id: 'APT-103',
      specialty: 'Psicología & Salud Mental',
      professional: 'Lic. Claudia Morales',
      date: '2026-08-20',
      time: '09:00 AM',
      location: 'Teleorientación Virtual',
      status: 'ATENDIDA',
    },
  ]);

  const [documents, setDocuments] = useState([
    { name: 'Ecografía_Ginecológica_Semana12.pdf', size: '1.4 MB', date: '2026-08-15', status: 'Verificado' },
    { name: 'Documento_Identidad_Cedula.pdf', size: '820 KB', date: '2026-08-10', status: 'Verificado' },
    { name: 'Certificado_Asistencia_Taller_Textil.pdf', size: '640 KB', date: '2026-08-22', status: 'Aprobado' },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      const data = await res.json();
      setDocuments([
        {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          date: new Date().toISOString().split('T')[0],
          status: 'Cargado con Éxito',
        },
        ...documents,
      ]);
    } catch (err) {
      console.error('Error cargando documento:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <Shield className="w-3.5 h-3.5" />
              SendaPass — Expediente Único Confidencial
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bienvenida, {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-pink-100">
              Código de Expediente: <strong className="text-amber-300 font-mono">{profile.code}</strong> • Cartagena, Bolívar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-pink-100 space-y-1">
            <span className="text-[10px] text-amber-300 font-bold uppercase block">Profesional Asignada:</span>
            <div className="font-extrabold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              {profile.assignedSpecialist}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-pink-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'citas', label: 'Mis Citas (Ginecología/Odontología/Mente)', icon: Calendar },
          { id: 'documentos', label: 'Bóveda de Documentos & Evidencias', icon: FileText },
          { id: 'seguimiento', label: 'Hoja de Ruta & Metas', icon: CheckCircle2 },
          { id: 'actividades', label: 'Actividades & Academia', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-senda-purple text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MIS CITAS */}
      {activeTab === 'citas' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-extrabold text-senda-purple-dark">
              Mis Citas Médicas y de Acompañamiento
            </h2>

            <Link
              href="/agendar-cita"
              className="bg-senda-pink hover:bg-senda-pink-dark text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Solicitar Nueva Cita</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{apt.id}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    apt.status === 'CONFIRMADA'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'PENDIENTE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-senda-purple-dark">{apt.specialty}</h3>
                  <p className="text-xs text-slate-600 font-semibold">{apt.professional}</p>
                </div>

                <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-100 space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <strong className="text-senda-purple">{apt.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora:</span>
                    <strong className="text-slate-800">{apt.time}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium truncate">
                  📍 {apt.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BÓVEDA DE DOCUMENTOS */}
      {activeTab === 'documentos' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-senda-purple-dark flex items-center gap-2">
                  <Lock className="w-5 h-5 text-senda-pink" />
                  Bóveda Encriptada de Documentación & Evidencias
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Sube de forma segura ecografías ginecológicas, documentos de identidad o solicitudes para tu equipo de especialistas.
                </p>
              </div>

              <label className="bg-gradient-to-r from-senda-pink to-senda-purple text-white font-extrabold px-6 py-3 rounded-full text-xs shadow-md hover:shadow-glow transition-all flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Subiendo...' : 'Subir Documento (Vercel Blob)'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-senda-pink" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{doc.name}</h4>
                      <span className="text-[10px] text-slate-500">{doc.size} • Cargado el {doc.date}</span>
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

      {/* TAB 3: HOJA DE RUTA */}
      {activeTab === 'seguimiento' && (
        <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <h2 className="text-xl font-extrabold text-senda-purple-dark">
            Mi Hoja de Ruta & Metas Personales
          </h2>

          <div className="space-y-4">
            {[
              { title: 'Entrevista Social Inicial & Valoración de Riesgo', done: true, date: '10 Ago 2026' },
              { title: 'Valoración Ginecológica y Salud Sexual Oportuna', done: true, date: '15 Ago 2026' },
              { title: 'Primera Consulta Odontológica Preventiva', done: true, date: '22 Ago 2026' },
              { title: 'Inscripción al Taller de Confección & Emprendimiento', done: false, date: 'Próximo' },
              { title: 'Graduación & Entrega de Capital Semilla', done: false, date: 'Octubre 2026' },
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-pink-100 bg-pink-50/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className={`w-5 h-5 ${task.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={`text-xs font-bold ${task.done ? 'text-slate-800' : 'text-slate-500'}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-senda-purple">{task.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVIDADES & ACADEMIA */}
      {activeTab === 'actividades' && (
        <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-senda-purple-dark">
              Clases Virtuales & Agenda de Talleres en Cartagena
            </h2>
            <Link
              href="/academia"
              className="text-xs font-bold text-senda-pink hover:underline flex items-center gap-1"
            >
              <span>Ir a SendaAcademia</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-senda-purple to-senda-purple-dark text-white p-6 rounded-3xl space-y-3">
              <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                SendaAcademia Virtual
              </span>
              <h3 className="font-extrabold text-lg">Módulo 1: Derechos Reproductivos & Ginecología Preventiva</h3>
              <p className="text-xs text-pink-100 leading-relaxed">
                Aprende sobre tus derechos bajo la legislación colombiana y autocuidado femenino con nuestras ginecólogas aliadas.
              </p>
              <Link
                href="/academia"
                className="inline-block bg-white text-senda-purple font-extrabold px-5 py-2 rounded-full text-xs hover:bg-pink-100 transition-colors"
              >
                Ver Lección en Video
              </Link>
            </div>

            <div className="bg-gradient-to-br from-senda-pink to-rose-600 text-white p-6 rounded-3xl space-y-3">
              <span className="bg-white text-senda-pink font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Presencial Cartagena
              </span>
              <h3 className="font-extrabold text-lg">Jornada de Salud Oral & Nutrición Infantil</h3>
              <p className="text-xs text-pink-100 leading-relaxed">
                Este sábado en la Casa de Justicia de Chiquinquirá: Entregas de kits odontológicos y revisión pediátrica.
              </p>
              <span className="text-[11px] font-bold text-amber-300 block">Sábado 9:00 AM • Entrada Libre</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
