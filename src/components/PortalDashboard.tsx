'use client';
import React, { useState } from 'react';
import { GraduationCap, HeartPulse, LogOut, EyeOff, ShieldAlert, Award, PlayCircle, CheckCircle2, Download, FileText, Clock, ChevronRight, KeyRound } from 'lucide-react';
import Link from 'next/link';

interface UserData {
  name: string; code: string; docId: string; program: string;
  specialist: string; sendaIndex: number;
  assignedCourses: number[]; completedCourses: number[];
}

const ALL_COURSES = [
  { id:1, icon:'⚕️', category:'Salud', title:'Ginecologia Preventiva y Derechos Reproductivos', duration:'25 min', instructor:'Dra. Elena Ruiz', desc:'Salud sexual, senales de alarma y jurisprudencia colombiana C-055/2022.' },
  { id:2, icon:'🧵', category:'Emprendimiento', title:'Confeccion y Patronaje Textil Basico', duration:'40 min', instructor:'Instructora Carmen Lora — SENA', desc:'Toma de medidas, trazado de patrones y costura a maquina.' },
  { id:3, icon:'📱', category:'Digital', title:'Marketing Digital y WhatsApp Business', duration:'30 min', instructor:'Lic. Mateo Gomez', desc:'Catalogo digital, Instagram para ventas y atencion al cliente.' },
  { id:4, icon:'⚖️', category:'Juridico', title:'Prevencion VBG y Autonomia Juridica', duration:'35 min', instructor:'Dra. Patricia Herrera', desc:'Identificar violencia, medidas de proteccion y rutas de denuncia.' },
  { id:5, icon:'💰', category:'Finanzas', title:'Finanzas Personales y Ahorro Inteligente', duration:'28 min', instructor:'Lic. Paola Mendoza', desc:'Presupuesto mensual, microcreditos e independencia economica.' },
  { id:6, icon:'🧠', category:'Bienestar', title:'Salud Mental y Autocuidado Emocional', duration:'32 min', instructor:'Lic. Claudia Morales', desc:'Regulacion emocional, autocuidado y proyecto de vida.' },
];

const APPOINTMENTS = [
  { specialty:'Ginecologia', prof:'Dra. Elena Ruiz', date:'2026-09-02', time:'10:00 AM', status:'CONFIRMADA' },
  { specialty:'Psicologia', prof:'Lic. Claudia Morales', date:'2026-09-10', time:'11:00 AM', status:'CONFIRMADA' },
  { specialty:'Odontologia', prof:'Dr. Camilo Vargas', date:'2026-09-15', time:'02:00 PM', status:'PENDIENTE' },
];

export default function PortalDashboard({ user, onLogout }: { user: UserData; onLogout: () => void }) {
  const [tab, setTab] = useState<'academia'|'gestion'>('academia');
  const [selCourse, setSelCourse] = useState(ALL_COURSES.find(c => c.id === user.assignedCourses[0]) || ALL_COURSES[0]);
  const [cert, setCert] = useState<number|null>(null);
  const [completedLocal, setCompletedLocal] = useState<number[]>(user.completedCourses);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const myCourses = ALL_COURSES.filter(c => user.assignedCourses.includes(c.id));
  const isCompleted = (id:number) => completedLocal.includes(id);
  const completedCount = myCourses.filter(c => isCompleted(c.id)).length;
  const pct = Math.round((completedCount / myCourses.length) * 100);

  const markComplete = (id:number) => {
    if (!isCompleted(id)) setCompletedLocal(prev => [...prev, id]);
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/beneficiary/password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentNumber: user.docId, currentPassword, newPassword }),
    });
    const result = await response.json();
    setPasswordMessage(result.success ? result.message : result.error);
    if (result.success) { setCurrentPassword(''); setNewPassword(''); }
  };

  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white px-4 py-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Portal Seguro • {user.code}</p>
            <h1 className="text-xl font-extrabold">Bienvenida, {user.name.split(' ')[0]}</h1>
            <p className="text-xs text-pink-200 mt-0.5">{user.specialist} • SENDA Index: <strong className="text-amber-300">{user.sendaIndex}/100</strong></p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowPasswordForm((value) => !value)} className="flex items-center gap-1.5 bg-white/10 text-white font-bold px-3 py-1.5 rounded-full text-xs border border-white/20 cursor-pointer hover:bg-white/20">
              <KeyRound className="w-3.5 h-3.5" /> Contraseña
            </button>
            <Link href="/senda-sos" className="flex items-center gap-1.5 bg-red-500 text-white font-extrabold px-3 py-1.5 rounded-full text-xs animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" /> SOS
            </Link>
            <button onClick={onLogout} className="flex items-center gap-1.5 bg-white/10 text-white font-bold px-3 py-1.5 rounded-full text-xs border border-white/20 cursor-pointer hover:bg-white/20">
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>
      </div>

      {showPasswordForm && <div className="max-w-6xl mx-auto px-4 mt-4"><form onSubmit={changePassword} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm max-w-md space-y-3">
        <h2 className="font-extrabold text-[#52166F]">Cambiar contraseña</h2>
        {passwordMessage && <p className="text-xs font-bold text-emerald-700">{passwordMessage}</p>}
        <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Contraseña actual" className="w-full px-3 py-2.5 rounded-xl border border-pink-200 text-sm" />
        <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contraseña (mínimo 6 caracteres)" className="w-full px-3 py-2.5 rounded-xl border border-pink-200 text-sm" />
        <button type="submit" className="bg-[#E12880] text-white font-extrabold px-4 py-2 rounded-xl text-xs">Actualizar contraseña</button>
      </form></div>}

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'academia', label: 'SendaAcademia', icon: GraduationCap },
            { id: 'gestion', label: 'Gestion Administrativa', icon: HeartPulse },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === id ? 'bg-[#52166F] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-200'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* ── ACADEMIA ── */}
        {tab === 'academia' && (
          <div className="space-y-6 pb-12">
            {/* Progress Banner */}
            <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">SendaAcademia — {user.name}</p>
                <h2 className="text-xl font-extrabold">Mis Cursos Asignados</h2>
                <div className="w-48">
                  <div className="flex justify-between text-[10px] text-pink-200 mb-1">
                    <span>Progreso</span><span>{completedCount}/{myCourses.length} • {pct}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{width:`${pct}%`}} />
                  </div>
                </div>
              </div>
              {cert !== null && (
                <div className="bg-amber-400 text-[#3B0852] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2">
                  <Award className="w-4 h-4" /> Certificado Listo
                </div>
              )}
            </div>

            {/* Certificate Modal */}
            {cert !== null && (() => {
              const c = ALL_COURSES.find(x => x.id === cert)!;
              return (
                <div className="bg-gradient-to-br from-[#3B0852] to-[#52166F] text-white p-8 rounded-3xl border-2 border-amber-400 shadow-2xl text-center space-y-4">
                  <Award className="w-16 h-16 text-amber-400 mx-auto" />
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Certificado Oficial</span>
                  <h3 className="text-2xl font-extrabold underline decoration-amber-400">{user.name}</h3>
                  <p className="text-xs text-pink-100">C.C. {user.docId} • Expediente {user.code}</p>
                  <p className="text-sm font-bold text-amber-300">{c.title}</p>
                  <p className="text-xs text-pink-200">Fundacion Senda Mujer • {new Date().toLocaleDateString('es-CO')}</p>
                  <p className="text-[10px] text-pink-300 font-mono">CERT-{user.code.replace('SM-','')}-MOD{cert.toString().padStart(2,'0')}</p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button onClick={() => setCert(null)} className="bg-white text-[#52166F] font-extrabold px-5 py-2 rounded-full text-xs cursor-pointer">Cerrar</button>
                    <button className="bg-amber-400 text-[#3B0852] font-extrabold px-5 py-2 rounded-full text-xs flex items-center gap-1.5 cursor-pointer">
                      <Download className="w-4 h-4" /> Descargar PDF
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Player */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-gradient-to-br from-[#3B0852] to-slate-900 rounded-3xl aspect-video flex flex-col items-center justify-center text-center p-8 border border-slate-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#52166F]/50 to-transparent" />
                  <div className="relative z-10 space-y-3">
                    <div className="w-16 h-16 bg-[#E12880]/20 rounded-full border border-[#E12880]/40 flex items-center justify-center mx-auto animate-pulse">
                      <PlayCircle className="w-8 h-8 text-[#E12880]" />
                    </div>
                    <span className="bg-amber-400 text-[#3B0852] text-[10px] font-extrabold px-3 py-1 rounded-full">{selCourse.category}</span>
                    <h3 className="font-extrabold text-sm text-white max-w-xs mx-auto leading-tight">{selCourse.title}</h3>
                    <p className="text-xs text-pink-200">{selCourse.instructor} • {selCourse.duration}</p>
                    <button
                      onClick={() => markComplete(selCourse.id)}
                      className="bg-[#E12880] hover:bg-[#c41070] text-white font-extrabold px-6 py-2 rounded-full text-sm cursor-pointer flex items-center gap-2 mx-auto"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {isCompleted(selCourse.id) ? 'Ver de Nuevo' : 'Iniciar Modulo'}
                    </button>
                  </div>
                </div>

                {/* Info card */}
                <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selCourse.icon}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isCompleted(selCourse.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-[#E12880]'}`}>
                        {isCompleted(selCourse.id) ? 'Completado' : 'En progreso'}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3.5 h-3.5" />{selCourse.duration}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#52166F]">{selCourse.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{selCourse.desc}</p>
                  <div className="flex gap-3 pt-2">
                    {isCompleted(selCourse.id) ? (
                      <>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs"><CheckCircle2 className="w-4 h-4" /> Completado</div>
                        <button onClick={() => setCert(selCourse.id)} className="bg-amber-400 text-[#3B0852] font-extrabold px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-300">
                          <Award className="w-3.5 h-3.5" /> Emitir Certificado
                        </button>
                      </>
                    ) : (
                      <button onClick={() => markComplete(selCourse.id)} className="bg-[#E12880] text-white font-extrabold px-4 py-1.5 rounded-full text-xs cursor-pointer hover:bg-[#c41070] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Marcar como Completado
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Course list */}
              <div className="lg:col-span-5 space-y-2">
                <p className="text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-3">Mis Modulos Asignados</p>
                {myCourses.map(c => (
                  <button key={c.id} onClick={() => setSelCourse(c)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${selCourse.id === c.id ? 'border-[#E12880] bg-pink-50 ring-2 ring-[#E12880]/20' : 'border-slate-200 bg-white hover:border-pink-200'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-base shrink-0">{c.icon}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 leading-snug line-clamp-2">{c.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[#52166F] font-bold">{c.duration}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{c.category}</span>
                          </div>
                        </div>
                      </div>
                      {isCompleted(c.id) && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    </div>
                  </button>
                ))}
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mt-2">
                  <p className="text-xs font-extrabold text-[#52166F]">Cursos no asignados</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Los modulos adicionales son asignados por tu especialista segun el avance de tu programa.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── GESTION ── */}
        {tab === 'gestion' && (
          <div className="space-y-6 pb-12">
            <div className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white rounded-2xl p-6">
              <p className="text-[10px] font-bold text-pink-200 uppercase tracking-widest">Mi Expediente</p>
              <h2 className="text-xl font-extrabold mt-1">Gestion Administrativa — {user.name.split(' ')[0]}</h2>
              <p className="text-xs text-pink-200 mt-1">Expediente <span className="text-amber-300 font-mono font-bold">{user.code}</span> • {user.program}</p>
            </div>

            {/* Appointments */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#E12880]" /> Mis Citas Medicas y Psicologicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {APPOINTMENTS.map((apt, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-xs text-[#52166F]">{apt.specialty}</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${apt.status === 'CONFIRMADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{apt.status}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mb-2">{apt.prof}</p>
                    <div className="bg-pink-50 p-2 rounded-xl text-xs text-slate-700 space-y-0.5">
                      <div className="flex justify-between"><span>Fecha:</span><strong className="text-[#52166F]">{apt.date}</strong></div>
                      <div className="flex justify-between"><span>Hora:</span><strong>{apt.time}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/agendar-cita" className="mt-3 inline-flex items-center gap-2 bg-[#E12880] text-white font-extrabold px-5 py-2.5 rounded-full text-xs hover:bg-[#c41070] transition-all">
                + Agendar Nueva Cita
              </Link>
            </div>

            {/* SENDA Index */}
            <div className="bg-gradient-to-br from-[#3B0852] to-[#52166F] text-white rounded-2xl p-6 space-y-4">
              <h3 className="font-extrabold text-base text-amber-300">SENDA Index — Indicador de Progreso</h3>
              <div className="flex items-end gap-4">
                <div className="text-6xl font-extrabold text-amber-300">{user.sendaIndex}</div>
                <div>
                  <p className="text-xs text-pink-200">/ 100 puntos</p>
                  <p className="text-xs text-emerald-300 font-bold">Mejorando progresivamente</p>
                </div>
              </div>
              {[
                { label:'Red de Apoyo Social', value:65 },
                { label:'Autonomia Personal', value:52 },
                { label:'Acceso a Servicios', value:71 },
                { label:'Bienestar Emocional', value:60 },
              ].map(d => (
                <div key={d.label}>
                  <div className="flex justify-between text-[10px] text-pink-200 mb-1"><span>{d.label}</span><span>{d.value}%</span></div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{width:`${d.value}%`}} />
                  </div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#52166F]" /> Boveda de Documentos
              </h3>
              <div className="space-y-2">
                {['Ecografia Ginecologica Ago2026.pdf','Documento Identidad Cedula.pdf','Certificado Taller Textil.pdf'].map((doc,i) => (
                  <div key={i} className="bg-white rounded-xl border border-pink-100 p-3.5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#52166F] shrink-0" />
                      <span className="text-xs font-bold text-slate-700">{doc}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">Verificado</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Senda No Abandona */}
            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5">
              <h3 className="font-extrabold text-sm text-[#52166F] mb-3 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#E12880]" /> Senda No Te Abandona
              </h3>
              <div className="space-y-2">
                {[
                  {day:'Dia 1', label:'Bienvenida y Vinculacion', done:true},
                  {day:'Dia 7', label:'Verificacion de bienestar inicial', done:true},
                  {day:'Dia 15', label:'Revision de progreso', done:false},
                  {day:'Dia 30', label:'Evaluacion mensual integral', done:false},
                  {day:'Dia 90', label:'Evaluacion trimestral SENDA Index', done:false},
                ].map((s,i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${s.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className="font-extrabold text-[#52166F] w-14 shrink-0">{s.day}</span>
                    <span className={s.done ? 'text-slate-700' : 'text-slate-400'}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating buttons */}
      <div className="fixed bottom-6 left-4 z-40 flex flex-col gap-3">
        <Link href="/senda-sos" className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 animate-pulse" title="SOS">
          <ShieldAlert className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
