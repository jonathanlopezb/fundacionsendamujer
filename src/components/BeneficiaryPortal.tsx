'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, Shield, FileText, Upload, Calendar, CheckCircle2, Lock, Sparkles, BookOpen, Clock, Heart, Award, ArrowRight, Activity, Plus, ShieldAlert, LogOut, KeyRound } from 'lucide-react';

interface BeneficiaryPortalProps {
  onOpenSOS?: () => void;
}

export default function BeneficiaryPortal({ onOpenSOS }: BeneficiaryPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [acceptedHabeasData, setAcceptedHabeasData] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'citas' | 'documentos' | 'seguimiento' | 'actividades'>('citas');

  // Simulated Beneficiary Profile State
  const [profile, setProfile] = useState({
    name: 'María Alejandra Torres',
    code: 'SM-8842',
    docId: '1.047.892.411',
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

  const triggerSOS = () => {
    if (onOpenSOS) {
      onOpenSOS();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!acceptedHabeasData) {
      setLoginError('Debes aceptar la autorización de tratamiento de datos personales de acuerdo con la Ley 1581 de 2012 de Colombia.');
      return;
    }

    if (!documentId.trim() || !secretPin.trim()) {
      setLoginError('Por favor ingresa tu número de documento/código de expediente y tu clave PIN secreta.');
      return;
    }

    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDocumentId('');
    setSecretPin('');
    setAcceptedHabeasData(false);
  };

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
      
      {/* If NOT Authenticated: Secure Login Screen with Habeas Data Consent & SOS Escape Button */}
      {!isAuthenticated ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white p-6 sm:p-8 text-center relative">
            
            {/* SOS Escape Button inside Login Header */}
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={triggerSOS}
                className="bg-amber-400 hover:bg-amber-300 text-senda-purple-dark font-extrabold text-[11px] px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 transition-transform active:scale-95 shadow-md cursor-pointer"
                title="Presiona ESC o clic para camuflar instantáneamente"
              >
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>MODO CAMUFLAJE SOS [ESC]</span>
              </button>
            </div>

            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Lock className="w-7 h-7 text-amber-300" />
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              SendaPass — Acceso Seguro a tu Expediente
            </h2>
            <p className="text-xs text-pink-100 mt-1">
              Portal confidencial de beneficiarias de la Fundación Senda Mujer en Cartagena.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-6">
            
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 leading-snug">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Número de Cédula / Documento o Código de Expediente *
                </label>
                <input
                  type="text"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="Ej: 1047892411 o SM-8842"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Clave PIN Secreta / Contraseña *
                </label>
                <input
                  type="password"
                  value={secretPin}
                  onChange={(e) => setSecretPin(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Si no recuerdas tu PIN confidencial, solicítalo a tu trabajadora social o ginecóloga aliada.
                </span>
              </div>
            </div>

            {/* Habeas Data & Protection of Personal Data Box (Ley 1581 de 2012 Colombia) */}
            <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="habeasData"
                  checked={acceptedHabeasData}
                  onChange={(e) => setAcceptedHabeasData(e.target.checked)}
                  className="w-4 h-4 text-senda-pink rounded focus:ring-senda-pink mt-0.5 cursor-pointer"
                />
                <label htmlFor="habeasData" className="text-[11px] text-slate-700 leading-relaxed font-semibold cursor-pointer">
                  Autorizo a la <strong>Fundación Senda Mujer</strong> para el tratamiento confidencial y seguro de mis datos personales de salud y seguimiento, en estricto cumplimiento de la <strong>Ley 1581 de 2012 de Habeas Data y Protección de Datos Personales en Colombia</strong>. Mis datos no serán compartidos con terceros sin mi consentimiento explícito.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-senda-pink to-senda-purple text-white font-extrabold py-3.5 rounded-full text-sm shadow-lg hover:shadow-glow transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Ingresar a Mi Expediente Seguro</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={triggerSOS}
                className="text-xs text-red-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>¿Peligro o agresor cerca? Salir inmediatamente a Modo Camuflaje [ESC]</span>
              </button>
            </div>
          </form>

        </div>
      ) : (
        /* Authenticated Beneficiary Dashboard */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    SendaPass — Expediente Único Confidencial
                  </span>
                  <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                    Habeas Data Protegido (Ley 1581/2012)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Bienvenida, {profile.name}
                </h1>
                <p className="text-xs sm:text-sm text-pink-100">
                  Cédula: <strong className="text-amber-300">{profile.docId}</strong> • Código Expediente: <strong className="text-amber-300 font-mono">{profile.code}</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={triggerSOS}
                  className="bg-amber-400 hover:bg-amber-300 text-senda-purple-dark font-extrabold px-4 py-2 rounded-full text-xs flex items-center space-x-1 shadow-md cursor-pointer"
                  title="Presiona la tecla ESC para activar camuflaje gastronómico"
                >
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>MODO CAMUFLAJE [ESC]</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center space-x-1 border border-white/30 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
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
                      Sube de forma segura ecografías ginecológicas, documentos de identidad o solicitudes para tu equipo de especialistas. Protegido bajo la Ley 1581 de 2012.
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
      )}

    </div>
  );
}
