'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Stethoscope, Activity, FileText, CheckCircle2, User, Calendar, Plus, Lock, Search, Filter, ShieldAlert, LogOut, KeyRound, DollarSign, Award, Clock, Info, Shield } from 'lucide-react';
import IPSCMeasurementForm from '@/components/caribe-seguro/IPSCMeasurementForm';
import DeteriorationAlertsPanel from '@/components/caribe-seguro/DeteriorationAlertsPanel';
import ObservatoryManager from '@/components/caribe-seguro/ObservatoryManager';

interface AdminManagementPanelProps {
  onOpenSOS?: () => void;
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours security limit

export default function AdminManagementPanel({ onOpenSOS }: AdminManagementPanelProps) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  // Check tab-scoped sessionStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAuth = sessionStorage.getItem('senda_admin_auth') === 'true';
    const loginTime = sessionStorage.getItem('senda_admin_login_time');
    if (isAuth && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed < TWO_HOURS_MS) {
        setIsAdminAuth(true);
      } else {
        sessionStorage.removeItem('senda_admin_auth');
        sessionStorage.removeItem('senda_admin_login_time');
      }
    }
  }, []);

  // 2-Hour Security Session Expiration Controller for Active Tab
  useEffect(() => {
    if (!isAdminAuth) return;

    sessionStorage.setItem('senda_admin_auth', 'true');
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
    }, 30000); // Check every 30s

    const autoLogoutTimer = setTimeout(() => {
      handleLogoutDueToTimeout();
    }, TWO_HOURS_MS);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(autoLogoutTimer);
    };
  }, [isAdminAuth]);

  const handleLogoutDueToTimeout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('senda_admin_auth');
    sessionStorage.removeItem('senda_admin_login_time');
    setSessionExpiredNotice(true);
    setAdminError('Tu sesión profesional ha expirado automáticamente por políticas de seguridad (límite de 2 horas o pestaña cerrada). Por favor ingresa de nuevo.');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('senda_admin_auth');
    sessionStorage.removeItem('senda_admin_login_time');
    setAdminUser('');
    setAdminPass('');
    setAdminError('');
    setSessionExpiredNotice(false);
  };

  const [activeTab, setActiveTab] = useState<'citas' | 'historias' | 'documentos' | 'capital' | 'caribe-seguro'>('caribe-seguro');

  // Simulated Appointments State
  const [appointmentsList, setAppointmentsList] = useState([
    {
      id: 'APT-101',
      patientName: 'María Alejandra Torres',
      docId: '1.047.892.411',
      specialty: 'Ginecología Especializada',
      date: '2026-09-02',
      time: '10:00 AM',
      location: 'Sede Cartagena (Pie de la Popa)',
      status: 'CONFIRMADA',
      notes: 'Seguimiento ginecológico preventiva - Ecografía de control.',
    },
    {
      id: 'APT-102',
      patientName: 'Carolina Mendoza',
      docId: '1.143.902.118',
      specialty: 'Odontología Integral',
      date: '2026-09-05',
      time: '02:00 PM',
      location: 'Sede Cartagena (Pie de la Popa)',
      status: 'PENDIENTE',
      notes: 'Profilaxis y revisión preventiva.',
    },
    {
      id: 'APT-103',
      patientName: 'Valeria Castro',
      docId: '1.050.441.982',
      specialty: 'Asesoría Jurídica VBG',
      date: '2026-09-03',
      time: '09:00 AM',
      location: 'Teleorientación Virtual',
      status: 'CONFIRMADA',
      notes: 'Solicitud de medidas de protección ante Comisaría Chiquinquirá.',
    },
  ]);

  // Clinical Notes & History State
  const [clinicalNotes, setClinicalNotes] = useState([
    {
      patient: 'María Alejandra Torres',
      specialty: 'Ginecología',
      doctor: 'Dra. Elena Ruiz',
      date: '2026-08-15',
      note: 'Paciente en excelente evolución. Se realiza ecografía prenatal de control. Parámetros normales.',
    },
    {
      patient: 'Valeria Castro',
      specialty: 'Asesoría Jurídica',
      doctor: 'Dra. Patricia Herrera',
      date: '2026-08-20',
      note: 'Se radica medida de protección preventiva por violencia intrafamiliar en la Comisaría de Familia Country.',
    },
  ]);

  const [newNotePatient, setNewNotePatient] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

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

    if (!adminUser.trim() || !adminPass.trim()) {
      setAdminError('Ingresa tus credenciales profesionales.');
      return;
    }

    setIsAdminAuth(true);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppointmentsList((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleAddClinicalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotePatient || !newNoteText) return;

    setClinicalNotes([
      {
        patient: newNotePatient,
        specialty: 'Ginecología / Medicina',
        doctor: 'Equipo Especialista Senda Mujer',
        date: new Date().toISOString().split('T')[0],
        note: newNoteText,
      },
      ...clinicalNotes,
    ]);

    setNewNotePatient('');
    setNewNoteText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Login Screen for Professionals */}
      {!isAdminAuth ? (
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Demo Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-extrabold text-purple-900">Demo Profesional Disponible</p>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Usuario: <strong>ginecologia.cartagena</strong> — Clave: <strong>senda2026</strong>
              </p>
            </div>
            <button
              onClick={() => {
                setAdminUser('ginecologia.cartagena');
                setAdminPass('senda2026');
                setIsAdminAuth(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 shadow-sm"
            >
              Autocompletar Demo
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="bg-gradient-to-r from-senda-purple-dark to-senda-purple text-white p-6 sm:p-8 text-center relative">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={triggerSOS}
                  className="bg-amber-400 text-senda-purple-dark font-extrabold text-[11px] px-3 py-1 rounded-full flex items-center space-x-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>CAMUFLAJE [ESC]</span>
                </button>
              </div>

              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                <Stethoscope className="w-7 h-7 text-amber-300" />
              </div>

              <h2 className="text-2xl font-extrabold">Panel Profesional & Gestión</h2>
              <p className="text-xs text-pink-100 mt-1">
                Acceso exclusivo para médicos, ginecólogas, odontólogos, abogadas y trabajadoras sociales.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 space-y-4">
              {adminError && (
                <div className="p-3 bg-red-50 text-red-600 font-bold text-xs rounded-xl">
                  {adminError}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Usuario Profesional *</label>
                <input
                  type="text"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Ej: ginecologia.cartagena"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-senda-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Contraseña de Seguridad *</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-senda-pink"
                />
              </div>

              <div className="p-3 bg-pink-50 rounded-xl text-[10px] text-slate-600 border border-pink-200">
                🔒 <strong>Aviso Habeas Data Ley 1581/2012:</strong> La información médica e historias clínicas de las beneficiarias es estrictamente confidencial.
              </div>

              <button
                type="submit"
                className="w-full bg-senda-purple hover:bg-senda-purple-dark text-white font-extrabold py-3.5 rounded-full text-sm shadow-md transition-all cursor-pointer"
              >
                Ingresar al Panel Administrativo
              </button>
            </form>

          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Panel Profesional Cartagena
              </span>
              <h1 className="text-2xl font-extrabold mt-1">Gestión Administrativa & Historias Clínicas</h1>
              <p className="text-xs text-pink-100">Sesión Profesional Activa • Fundación Senda Mujer</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={triggerSOS}
                className="bg-amber-400 text-senda-purple-dark font-extrabold px-4 py-2 rounded-full text-xs cursor-pointer shadow-sm"
              >
                MODO CAMUFLAJE [ESC]
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs border border-white/30 cursor-pointer transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 border-b border-pink-200 pb-2 overflow-x-auto">
            {[
              { id: 'caribe-seguro', label: '🛡️ Caribe Seguro — IPSC & Alertas', icon: Shield },
              { id: 'citas', label: 'Gestión Citas Multidisciplinarias', icon: Calendar },
              { id: 'historias', label: 'Historias Clínicas & Evolución', icon: Activity },
              { id: 'documentos', label: 'Documentos & Evidencias Recibidas', icon: FileText },
              { id: 'capital', label: 'Aprobación Capital Semilla', icon: DollarSign },
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

          {/* TAB 1: GESTIÓN DE CITAS */}
          {activeTab === 'citas' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-lg font-extrabold text-senda-purple-dark">
                  Citas Agendadas (Ginecología, Odontología, Medicina, Derecho)
                </h2>
                <span className="text-xs font-bold text-slate-500">Total: {appointmentsList.length} Pacientes</span>
              </div>

              <div className="space-y-4">
                {appointmentsList.map((apt) => (
                  <div key={apt.id} className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-senda-purple">{apt.patientName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">C.C. {apt.docId}</span>
                      </div>
                      <div className="font-bold text-xs text-senda-pink">{apt.specialty}</div>
                      <p className="text-[11px] text-slate-600">{apt.date} • {apt.time} — {apt.location}</p>
                      <p className="text-[10px] text-slate-400 italic">Nota: {apt.notes}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStatusChange(apt.id, 'CONFIRMADA')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                          apt.status === 'CONFIRMADA' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleStatusChange(apt.id, 'ATENDIDA')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                          apt.status === 'ATENDIDA' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        Atendida
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HISTORIAS CLÍNICAS & EVOLUCIÓN */}
          {activeTab === 'historias' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Add Note Form */}
              <form onSubmit={handleAddClinicalNote} className="bg-white rounded-3xl border border-pink-200 p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-extrabold text-senda-purple-dark">
                  Registrar Nota de Evolución Médica / Ginecológica / Jurídica
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Paciente *</label>
                    <input
                      type="text"
                      value={newNotePatient}
                      onChange={(e) => setNewNotePatient(e.target.value)}
                      placeholder="Ej: María Alejandra Torres"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs focus:ring-2 focus:ring-senda-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Diagnóstico / Evolución *</label>
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Escribe la nota clínica o estrategia jurídica..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs focus:ring-2 focus:ring-senda-pink"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-senda-pink text-white font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md cursor-pointer"
                  >
                    Guardar Nota en Historia Clínica
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-4">
                <h3 className="font-extrabold text-base text-senda-purple-dark">Historias Clínicas Recientes</h3>

                <div className="space-y-3">
                  {clinicalNotes.map((note, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-senda-purple">
                        <span>{note.patient} ({note.specialty})</span>
                        <span className="text-slate-500 font-normal">{note.date}</span>
                      </div>
                      <p className="text-slate-700">{note.note}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">Firmado por: {note.doctor}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DOCUMENTOS RECIBIDOS */}
          {activeTab === 'documentos' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-4 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-senda-purple-dark">Bóveda de Evidencias & Documentos Recibidos</h2>
              <p className="text-xs text-slate-600">Revisa ecografías, solicitudes y documentos de identidad subidos por las usuarias.</p>

              <div className="space-y-3">
                {[
                  { file: 'Ecografía_Ginecológica_Semana12.pdf', patient: 'María Alejandra Torres', date: '2026-08-15' },
                  { file: 'Denuncia_Comisaria_Country.pdf', patient: 'Valeria Castro', date: '2026-08-18' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{doc.file}</div>
                      <span className="text-[11px] text-senda-purple">Paciente: {doc.patient} • {doc.date}</span>
                    </div>

                    <button className="bg-senda-purple text-white font-bold px-4 py-1.5 rounded-full text-xs">
                      Ver Documento
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CARIBE SEGURO — IPSC & ALERTAS */}
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

          {/* TAB 4: CAPITAL SEMILLA */}
          {activeTab === 'capital' && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-4 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-senda-purple-dark">Aprobación de Fondo Capital Semilla ($2.500.000 COP)</h2>
              <p className="text-xs text-slate-600">Evaluación de micronegocios de beneficiarias graduadas del programa Proyecto de Vida.</p>

              <div className="p-5 bg-gradient-to-r from-senda-purple to-senda-purple-dark text-white rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">Proyecto: Confección de Vestuario Playero</h4>
                  <p className="text-xs text-pink-200">Beneficiaria: María Alejandra Torres • Olaya Herrera, Cartagena</p>
                </div>
                <button className="bg-amber-400 text-senda-purple-dark font-extrabold px-5 py-2 rounded-full text-xs">
                  Aprobar $2.500.000 COP
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
