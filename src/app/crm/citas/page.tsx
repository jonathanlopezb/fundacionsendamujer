'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Clock, User, Phone, Mail, MapPin, Stethoscope,
  CheckCircle, XCircle, RefreshCw, FileHeart, Loader2,
  Search, Filter, Pencil, Trash2, Monitor, Building2, X,
  AlertTriangle, CalendarClock, ChevronDown, ChevronUp,
} from 'lucide-react';

interface Appointment {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  specialty: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  modality?: string;
  notes?: string;
  status: string;
  reviewStatus: 'NUEVA' | 'GESTIONADA' | 'CONFIRMADA' | 'CANCELADA';
  createdAt: string;
}

/* ── constants ───────────────────────────────────────────────── */
const STATUS_MAP = {
  NUEVA:      { label: 'Nueva',      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',      dot: 'bg-amber-400' },
  GESTIONADA: { label: 'Gestionada', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',         dot: 'bg-blue-400' },
  CONFIRMADA: { label: 'Confirmada', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  CANCELADA:  { label: 'Cancelada',  color: 'bg-red-500/15 text-red-300 border-red-500/30',            dot: 'bg-red-400' },
};

const SPECIALTY_LABELS: Record<string, string> = {
  psicologia:     'Psicología',
  trabajo_social: 'Trabajo Social',
  juridica:       'Asesoría Jurídica',
  orientacion:    'Orientación',
  otro:           'Otro',
};

const MODALITY_OPTIONS = ['Presencial', 'Virtual'];
const SPECIALTY_OPTIONS = Object.entries(SPECIALTY_LABELS);
const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
  '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const TABS = [
  { key: 'NUEVA',      label: 'Nuevas' },
  { key: 'CONFIRMADA', label: 'Confirmadas' },
  { key: 'GESTIONADA', label: 'Gestionadas' },
  { key: 'CANCELADA',  label: 'Canceladas' },
  { key: 'ALL',        label: 'Todas' },
];

/* ── empty reschedule / edit form ────────────────────────────── */
const emptyEdit = (a?: Appointment) => ({
  preferredDate: a?.preferredDate ?? '',
  preferredTime: a?.preferredTime ?? '',
  modality:      a?.modality      ?? 'Presencial',
  location:      a?.location      ?? '',
  specialty:     a?.specialty     ?? '',
  notes:         a?.notes         ?? '',
});

/* ── API helper ──────────────────────────────────────────────── */
async function apptAction(body: Record<string, unknown>) {
  const res = await fetch('/api/crm/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CitasPage() {
  const [tab, setTab]               = useState('NUEVA');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts]         = useState<Record<string, number>>({});
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [actionId, setActionId]     = useState<string | null>(null);

  // Modals
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [editMode, setEditMode]     = useState<'RESCHEDULE' | 'EDIT'>('EDIT');
  const [editForm, setEditForm]     = useState(emptyEdit());
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Appointment | null>(null);
  const [note, setNote]             = useState('');

  /* ── fetch ─────────────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (tab !== 'ALL') params.set('status', tab);
      if (search) params.set('q', search);
      const res  = await fetch(`/api/crm/appointments?${params}`);
      const data = await res.json();
      setAppointments(data.appointments ?? []);
      setCounts(data.counts ?? {});
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── actions ────────────────────────────────────────────────── */
  const doAction = async (id: string, action: string, extra?: Record<string, unknown>) => {
    setActionId(id);
    try {
      await apptAction({ action, appointmentId: id, ...extra });
      await fetchData();
    } finally { setActionId(null); }
  };

  const submitRescheduleOrEdit = async () => {
    if (!editTarget) return;
    setActionId(editTarget._id);
    try {
      await apptAction({ action: editMode, appointmentId: editTarget._id, ...editForm });
      setEditTarget(null);
      await fetchData();
    } finally { setActionId(null); }
  };

  const submitConfirm = async () => {
    if (!confirmTarget) return;
    setActionId(confirmTarget._id);
    try {
      await apptAction({ action: 'STATUS_UPDATE', appointmentId: confirmTarget._id, newStatus: 'CONFIRMADA', note });
      setConfirmTarget(null);
      setNote('');
      await fetchData();
    } finally { setActionId(null); }
  };

  const submitDelete = async () => {
    if (!deleteTarget) return;
    setActionId(deleteTarget._id);
    try {
      await apptAction({ action: 'DELETE', appointmentId: deleteTarget._id });
      setDeleteTarget(null);
      await fetchData();
    } finally { setActionId(null); }
  };

  const isVirtual = (a: Appointment) =>
    (a.modality ?? '').toLowerCase().includes('virtual');

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-rose-400" />
            Citas & Solicitudes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona, confirma, reprograma o elimina citas del sistema.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/50 text-slate-300 rounded-xl hover:border-slate-600 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-xl border border-slate-700/40 w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              tab === t.key
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
            }`}
          >
            {t.label}
            {t.key !== 'ALL' && (counts[t.key] ?? 0) > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                t.key === 'NUEVA'      ? 'bg-amber-500/20 text-amber-300' :
                t.key === 'CONFIRMADA' ? 'bg-emerald-500/20 text-emerald-300' :
                t.key === 'CANCELADA'  ? 'bg-red-500/20 text-red-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono..."
          className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
        />
      </div>

      {/* ── Cards ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <Filter className="w-10 h-10 mb-2 opacity-40" />
          <p className="text-sm">No hay citas en esta categoría.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {appointments.map(appt => {
            const st      = STATUS_MAP[appt.reviewStatus] ?? STATUS_MAP.NUEVA;
            const isAct   = actionId === appt._id;
            const virtual = isVirtual(appt);
            const spec    = SPECIALTY_LABELS[appt.specialty] ?? appt.specialty;

            return (
              <div key={appt._id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-600/60 transition-all">

                {/* Status + Modality + Date */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    {/* Modality badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                      virtual
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                    }`}>
                      {virtual
                        ? <Monitor className="w-3 h-3" />
                        : <Building2 className="w-3 h-3" />}
                      {virtual ? 'Virtual' : 'Presencial'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(appt.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                {/* Person */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-white truncate">{appt.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-300">{appt.phone}</span>
                  </div>
                  {appt.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate">{appt.email}</span>
                    </div>
                  )}
                </div>

                {/* Appointment details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">{spec}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">{appt.preferredDate}</span>
                  </div>
                  <div className="col-span-2 bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">{appt.location}</span>
                  </div>
                  <div className="col-span-2 bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-300">{appt.preferredTime}</span>
                  </div>
                </div>

                {appt.notes && (
                  <p className="text-xs text-slate-400 bg-slate-900/40 rounded-lg p-2 border border-slate-700/30 line-clamp-2">
                    {appt.notes}
                  </p>
                )}

                {/* ── Action Buttons ─────────────────────────────── */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-700/30">

                  {/* Confirm — for NUEVA */}
                  {appt.reviewStatus === 'NUEVA' && (
                    <button
                      onClick={() => { setConfirmTarget(appt); setNote(''); }}
                      disabled={isAct}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Confirmar
                    </button>
                  )}

                  {/* Mark attended — for CONFIRMADA */}
                  {appt.reviewStatus === 'CONFIRMADA' && (
                    <button
                      onClick={() => doAction(appt._id, 'STATUS_UPDATE', { newStatus: 'GESTIONADA' })}
                      disabled={isAct}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold hover:bg-blue-500/25 transition-all disabled:opacity-50"
                    >
                      {isAct ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Atendida
                    </button>
                  )}

                  {/* Cancel — for NUEVA or CONFIRMADA */}
                  {(appt.reviewStatus === 'NUEVA' || appt.reviewStatus === 'CONFIRMADA') && (
                    <button
                      onClick={() => doAction(appt._id, 'STATUS_UPDATE', { newStatus: 'CANCELADA' })}
                      disabled={isAct}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold hover:bg-red-500/25 transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  )}

                  {/* Reschedule — not for CANCELADA or GESTIONADA */}
                  {appt.reviewStatus !== 'CANCELADA' && appt.reviewStatus !== 'GESTIONADA' && (
                    <button
                      onClick={() => {
                        setEditTarget(appt);
                        setEditMode('RESCHEDULE');
                        setEditForm(emptyEdit(appt));
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold hover:bg-amber-500/25 transition-all"
                    >
                      <CalendarClock className="w-3.5 h-3.5" /> Reprogramar
                    </button>
                  )}

                  {/* Edit modality/details */}
                  {appt.reviewStatus !== 'CANCELADA' && (
                    <button
                      onClick={() => {
                        setEditTarget(appt);
                        setEditMode('EDIT');
                        setEditForm(emptyEdit(appt));
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 text-slate-300 border border-slate-600/40 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </button>
                  )}

                  {/* Convert to case */}
                  {appt.reviewStatus !== 'CANCELADA' && (
                    <button
                      onClick={() => doAction(appt._id, 'CONVERT_TO_CASE')}
                      disabled={isAct}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold hover:bg-rose-500/25 transition-all disabled:opacity-50"
                    >
                      <FileHeart className="w-3.5 h-3.5" /> Abrir Caso
                    </button>
                  )}

                  {/* Delete — ONLY if CANCELADA */}
                  {appt.reviewStatus === 'CANCELADA' && (
                    <button
                      onClick={() => setDeleteTarget(appt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 text-red-400 border border-red-800/40 rounded-lg text-xs font-semibold hover:bg-red-900/50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: Confirm appointment
      ══════════════════════════════════════════════════════════ */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Confirmar Cita
              </h2>
              <button onClick={() => setConfirmTarget(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-1 text-sm">
                <p className="font-semibold text-white">{confirmTarget.fullName}</p>
                <p className="text-slate-400">{SPECIALTY_LABELS[confirmTarget.specialty] ?? confirmTarget.specialty}</p>
                <p className="text-slate-400">{confirmTarget.preferredDate} · {confirmTarget.preferredTime}</p>
                <p className="text-slate-400">{confirmTarget.location}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Nota para el expediente (opcional)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="Ej: Se confirmó por teléfono. Se envió recordatorio por WhatsApp..."
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setConfirmTarget(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">Cancelar</button>
                <button
                  onClick={submitConfirm}
                  disabled={actionId === confirmTarget._id}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {actionId === confirmTarget._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirmar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: Reschedule / Edit
      ══════════════════════════════════════════════════════════ */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {editMode === 'RESCHEDULE'
                  ? <><CalendarClock className="w-5 h-5 text-amber-400" /> Reprogramar Cita</>
                  : <><Pencil className="w-5 h-5 text-slate-400" /> Editar Cita</>}
              </h2>
              <button onClick={() => setEditTarget(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Patient info (read-only) */}
              <div className="bg-slate-800/40 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="font-semibold text-white">{editTarget.fullName}</span>
                <span>·</span>
                <span>{editTarget.phone}</span>
              </div>

              {/* Modality — always editable */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-2 block">Modalidad</label>
                <div className="flex gap-3">
                  {MODALITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setEditForm(f => ({ ...f, modality: opt }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        editForm.modality === opt
                          ? opt === 'Virtual'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      {opt === 'Virtual' ? <Monitor className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time — required for RESCHEDULE, optional for EDIT */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">
                    Nueva Fecha {editMode === 'RESCHEDULE' && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    type="date"
                    value={editForm.preferredDate}
                    onChange={e => setEditForm(f => ({ ...f, preferredDate: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">
                    Nueva Hora {editMode === 'RESCHEDULE' && <span className="text-rose-400">*</span>}
                  </label>
                  <select
                    value={editForm.preferredTime}
                    onChange={e => setEditForm(f => ({ ...f, preferredTime: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="">Seleccionar...</option>
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Specialty */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Especialidad</label>
                <select
                  value={editForm.specialty}
                  onChange={e => setEditForm(f => ({ ...f, specialty: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50"
                >
                  <option value="">Sin cambios</option>
                  {SPECIALTY_OPTIONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              {/* Location — virtual shows link field hint */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">
                  {editForm.modality === 'Virtual' ? 'Enlace de videollamada / Sede' : 'Sede / Dirección'}
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                  placeholder={editForm.modality === 'Virtual' ? 'https://meet.google.com/...' : 'Sede Pie de la Popa, Cartagena'}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Notas / Motivo del cambio</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder={editMode === 'RESCHEDULE' ? 'Motivo de la reprogramación...' : 'Observaciones adicionales...'}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none"
                />
              </div>

              {editMode === 'RESCHEDULE' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  La cita quedará marcada como <strong className="ml-1">Confirmada</strong> al reprogramar.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">
                  Cancelar
                </button>
                <button
                  onClick={submitRescheduleOrEdit}
                  disabled={
                    (editMode === 'RESCHEDULE' && (!editForm.preferredDate || !editForm.preferredTime)) ||
                    actionId === editTarget._id
                  }
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    editMode === 'RESCHEDULE'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                  }`}
                >
                  {actionId === editTarget._id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : editMode === 'RESCHEDULE' ? <CalendarClock className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                  {editMode === 'RESCHEDULE' ? 'Reprogramar' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: Delete confirmation
      ══════════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-red-900/40 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">¿Eliminar esta cita?</h2>
                <p className="text-sm text-slate-400">
                  Se eliminará permanentemente la cita de{' '}
                  <span className="text-white font-semibold">{deleteTarget.fullName}</span>.
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 text-xs text-slate-400 text-left space-y-1">
                <p><span className="text-slate-500">Especialidad:</span> {SPECIALTY_LABELS[deleteTarget.specialty] ?? deleteTarget.specialty}</p>
                <p><span className="text-slate-500">Fecha:</span> {deleteTarget.preferredDate} · {deleteTarget.preferredTime}</p>
                <p className="flex items-center gap-1">
                  <span className="text-slate-500">Estado:</span>
                  <span className="text-red-300 font-semibold">CANCELADA</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold border border-slate-700/50 transition-all"
                >
                  No, conservar
                </button>
                <button
                  onClick={submitDelete}
                  disabled={actionId === deleteTarget._id}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 transition-all disabled:opacity-50"
                >
                  {actionId === deleteTarget._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
