'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCrmAuth } from '@/lib/crm/client';
import {
  ArrowLeft,
  User,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileHeart,
  Layers,
  Package,
  CalendarDays,
  PlusCircle,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Home,
  HeartHandshake,
  Lock,
  X,
  Sparkles,
} from 'lucide-react';

export default function CrmPersonaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, can } = useCrmAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'casos' | 'programas' | 'ayudas' | 'asistencias' | 'habeas'>('casos');
  const [unmasked, setUnmasked] = useState(false);

  // Quick Open Case Modal
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [caseType, setCaseType] = useState('SOCIAL');
  const [casePriority, setCasePriority] = useState('MEDIUM');
  const [caseReason, setCaseReason] = useState('');
  const [creatingCase, setCreatingCase] = useState(false);

  // Quick Enroll Program Modal
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [productiveLine, setProductiveLine] = useState('SEWING');
  const [enrolling, setEnrolling] = useState(false);

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPersona = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/people/${params.id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error al consultar persona:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchPersona();
    }
  }, [params.id]);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch('/api/crm/programs');
        if (res.ok) {
          const json = await res.json();
          setProgramsList(json.programs || []);
          if (json.programs?.length > 0) {
            setSelectedProgramId(json.programs[0]._id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadPrograms();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseReason.trim()) return;
    try {
      setCreatingCase(true);
      const res = await fetch('/api/crm/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: params.id,
          type: caseType,
          priority: casePriority,
          openingReason: caseReason,
        }),
      });

      if (res.ok) {
        setCaseModalOpen(false);
        setCaseReason('');
        setMsg({ type: 'success', text: 'Expediente aperturado exitosamente' });
        fetchPersona();
      } else {
        const errJson = await res.json();
        setMsg({ type: 'error', text: errJson.error || 'Error al abrir caso' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setCreatingCase(false);
    }
  };

  const handleEnrollProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) return;
    try {
      setEnrolling(true);
      const res = await fetch('/api/crm/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ENROLL',
          personId: params.id,
          programId: selectedProgramId,
          productiveLine,
        }),
      });

      if (res.ok) {
        setEnrollModalOpen(false);
        setMsg({ type: 'success', text: 'Inscripción a programa registrada' });
        fetchPersona();
      } else {
        const errJson = await res.json();
        setMsg({ type: 'error', text: errJson.error || 'Error al inscribir' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-32" />
        <div className="h-44 bg-slate-800/60 rounded-2xl border border-slate-800" />
        <div className="h-96 bg-slate-800/60 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  const person = data?.person;
  if (!person) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <p>No se encontró la persona solicitada.</p>
        <Link href="/crm/personas" className="text-rose-400 underline mt-2 inline-block">
          Volver al directorio
        </Link>
      </div>
    );
  }

  const cases = data?.cases || [];
  const enrollments = data?.enrollments || [];
  const aidDeliveries = data?.aidDeliveries || [];
  const attendances = data?.attendances || [];

  const displayName = person.protectedIdentity && !unmasked
    ? person.pseudonym || 'Identidad Protegida'
    : `${person.firstName} ${person.lastName}`;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/crm/personas"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Directorio de Personas</span>
        </Link>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            msg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
              : 'bg-red-950/60 border-red-800/80 text-red-300'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Ficha 360° Header Card ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-rose-500/25 flex-shrink-0">
              {person.firstName?.[0]?.toUpperCase()}
              {person.lastName?.[0]?.toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{displayName}</h1>
                {person.protectedIdentity && (
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Identidad Protegida
                  </span>
                )}
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Habeas Data Activo
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="font-mono text-slate-300">
                  {person.documentType}{' '}
                  {unmasked ? person.documentNumber : person.documentNumberMasked || '••••••••'}
                </span>
                {person.phone && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {person.phone}
                  </span>
                )}
                {person.email && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {person.email}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {person.address?.city || 'Barranquilla'}
                  {person.address?.neighborhood ? `, ${person.address.neighborhood}` : ''}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {(person.roles || ['BENEFICIARY']).map((r: string) => (
                  <span key={r} className="text-[10px] px-2.5 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-200 font-medium rounded-md">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start">
            {person.protectedIdentity && (
              <button
                onClick={() => setUnmasked(!unmasked)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Revelar nombre real y documento (Acción auditada)"
              >
                {unmasked ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                <span>{unmasked ? 'Ocultar Identidad' : 'Revelar Identidad'}</span>
              </button>
            )}

            {can('cases.write') && (
              <button
                onClick={() => setCaseModalOpen(true)}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Abrir Caso</span>
              </button>
            )}

            {can('programs.write') && (
              <button
                onClick={() => setEnrollModalOpen(true)}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Inscribir a Programa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sub-tabs Navigation ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        {[
          { id: 'casos', label: `Casos y Expedientes (${cases.length})`, icon: FileHeart },
          { id: 'programas', label: `Programas & CAM (${enrollments.length})`, icon: Layers },
          { id: 'ayudas', label: `Ayudas & Dotaciones (${aidDeliveries.length})`, icon: Package },
          { id: 'asistencias', label: `Asistencias a Jornadas (${attendances.length})`, icon: CalendarDays },
          { id: 'habeas', label: 'Habeas Data & Privacidad', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                active
                  ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-6 shadow-sm">
        {/* Tab Casos */}
        {activeTab === 'casos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileHeart className="w-4 h-4 text-rose-400" />
                Expedientes y Acompañamiento Multidisciplinario
              </h2>
              {can('cases.write') && (
                <button
                  onClick={() => setCaseModalOpen(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Abrir nuevo expediente
                </button>
              )}
            </div>

            {cases.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No hay casos registrados para esta persona aún.
              </div>
            ) : (
              <div className="space-y-3">
                {cases.map((c: any) => (
                  <Link
                    key={c._id}
                    href={`/crm/casos/${c._id}`}
                    className="p-4 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4 transition-all block group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{c.caseNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {c.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{c.type}</span>
                        <span className="text-[10px] text-rose-400 font-medium font-mono">{c.priority}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate">{c.openingReason}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Abierto: {new Date(c.openedAt || c.createdAt).toLocaleDateString('es-CO')}
                        </span>
                        <span>Responsable: {c.responsibleUserName || 'Asignada'}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs text-rose-400 group-hover:translate-x-1 transition-transform inline-block">
                        Ver Expediente →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Programas CAM/THEMIS */}
        {activeTab === 'programas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Inscripciones en Programas (CAM / THEMIS / Caribe Seguro)
              </h2>
              {can('programs.write') && (
                <button
                  onClick={() => setEnrollModalOpen(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Inscribir en programa
                </button>
              )}
            </div>

            {enrollments.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No hay inscripciones activas a programas institucionales.
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((en: any) => (
                  <div
                    key={en._id}
                    className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{en.programCode || 'CAM'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-medium">
                          {en.status}
                        </span>
                        {en.productiveLine && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300 font-medium">
                            Línea: {en.productiveLine}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{en.programName || 'Centro de Apoyo a la Mujer'}</p>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Inscripción: {new Date(en.enrolledAt || en.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Ayudas */}
        {activeTab === 'ayudas' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              Ayudas Humanitarias y Dotaciones Entregadas
            </h2>
            {aidDeliveries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No se registran entregas de kits o activos a esta persona.
              </div>
            ) : (
              <div className="space-y-3">
                {aidDeliveries.map((ad: any) => (
                  <div key={ad._id} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-white">{ad.type}</span>
                      <p className="text-xs text-slate-400 mt-0.5">Cantidad: {ad.quantity} · Estado: {ad.status}</p>
                      <span className="text-[11px] text-slate-500 block">
                        Fecha: {new Date(ad.deliveryDate || ad.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Asistencias */}
        {activeTab === 'asistencias' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              Participación y Asistencia a Eventos & Jornadas
            </h2>
            {attendances.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No hay registros de asistencia a eventos o jornadas comunitarias.
              </div>
            ) : (
              <div className="space-y-3">
                {attendances.map((att: any) => (
                  <div key={att._id} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-white">{att.eventName || 'Jornada Territorial'}</span>
                      <p className="text-xs text-slate-400 mt-0.5">Método: {att.method || 'MANUAL'} · Estado: {att.status}</p>
                      <span className="text-[11px] text-slate-500 block">
                        Check-in: {new Date(att.checkInAt || att.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Habeas Data */}
        {activeTab === 'habeas' && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Registro de Consentimiento & Habeas Data (Ley 1581 de 2012)
            </h2>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Estado de Autorización:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Concedida y Vigente
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Fecha de Registro:</span>
                <span>{new Date(person.createdAt).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Finalidad:</span>
                <span>Atención psicosocial, acompañamiento jurídico y programas CAM/THEMIS</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Cifrado de Documento:</span>
                <span className="text-purple-400 font-mono">AES-256-GCM (HMAC Index)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Abrir Caso ── */}
      {caseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileHeart className="w-4 h-4 text-rose-400" />
                Apertura de Expediente / Caso
              </h2>
              <button onClick={() => setCaseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Caso</label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="SOCIAL">Trabajo Social</option>
                    <option value="PSYCHOSOCIAL">Atención Psicológica</option>
                    <option value="LEGAL">Asesoría Jurídica / THEMIS</option>
                    <option value="VBG">Violencia Basada en Género (VBG)</option>
                    <option value="ECONOMIC">Emprendimiento / CAM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridad</label>
                  <select
                    value={casePriority}
                    onChange={(e) => setCasePriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica / Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo de Apertura *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describa el motivo de la consulta o solicitud de acompañamiento..."
                  value={caseReason}
                  onChange={(e) => setCaseReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCaseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingCase}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  {creatingCase ? 'Aperturando...' : 'Crear Expediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Inscribir Programa ── */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                Inscripción a Programa Institucional
              </h2>
              <button onClick={() => setEnrollModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollProgram} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Programa</label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  {programsList.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Línea Productiva (CAM)</label>
                <select
                  value={productiveLine}
                  onChange={(e) => setProductiveLine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="SEWING">Modistería & Confección</option>
                  <option value="BAKING">Repostería & Panadería</option>
                  <option value="SUBLIMATION">Estampado & Sublimación</option>
                  <option value="GARDENING">Huertas Urbanas & Agricultura</option>
                  <option value="CRAFTS">Artesanías & Manualidades</option>
                  <option value="OTHER">Formación General / Derechos</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
                >
                  {enrolling ? 'Inscribiendo...' : 'Confirmar Inscripción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
