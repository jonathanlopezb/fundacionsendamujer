'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Clock, User, Phone, Mail, MapPin, Stethoscope,
  CheckCircle, XCircle, RefreshCw, FileHeart, AlertCircle,
  ChevronDown, Search, Filter, ExternalLink, Loader2,
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
  notes?: string;
  status: string;
  reviewStatus: 'NUEVA' | 'GESTIONADA' | 'CONFIRMADA' | 'CANCELADA';
  createdAt: string;
}

const STATUS_MAP = {
  NUEVA:      { label: 'Nueva',      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',    dot: 'bg-amber-400' },
  GESTIONADA: { label: 'Gestionada', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',       dot: 'bg-blue-400' },
  CONFIRMADA: { label: 'Confirmada', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  CANCELADA:  { label: 'Cancelada',  color: 'bg-red-500/15 text-red-300 border-red-500/30',          dot: 'bg-red-400' },
};

const SPECIALTY_LABELS: Record<string, string> = {
  psicologia:      'Psicología',
  trabajo_social:  'Trabajo Social',
  juridica:        'Asesoría Jurídica',
  orientacion:     'Orientación',
  otro:            'Otro',
};

const TABS = [
  { key: 'NUEVA',      label: 'Nuevas' },
  { key: 'GESTIONADA', label: 'Gestionadas' },
  { key: 'CONFIRMADA', label: 'Confirmadas' },
  { key: 'CANCELADA',  label: 'Canceladas' },
  { key: 'ALL',        label: 'Todas' },
];

export default function CitasPage() {
  const [tab, setTab] = useState('NUEVA');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts]   = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (tab !== 'ALL') params.set('status', tab);
      if (search) params.set('search', search);
      const res = await fetch(`/api/crm/appointments?${params}`);
      const data = await res.json();
      setAppointments(data.appointments ?? []);
      setCounts(data.counts ?? {});
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (id: string, action: string, extra?: Record<string, unknown>) => {
    setActionId(id);
    try {
      await fetch('/api/crm/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, appointmentId: id, ...extra }),
      });
      await fetchData();
    } finally {
      setActionId(null);
    }
  };

  const filteredList = appointments.filter(a =>
    !search ||
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search) ||
    (a.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-rose-400" />
            Citas & Solicitudes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona las citas agendadas desde el sitio web. Confirma, cancela o convierte en caso.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/50 text-slate-300 rounded-xl hover:border-slate-600 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {/* Tabs */}
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
                t.key === 'NUEVA' ? 'bg-amber-500/20 text-amber-300' :
                t.key === 'CONFIRMADA' ? 'bg-emerald-500/20 text-emerald-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
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

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <Filter className="w-10 h-10 mb-2 opacity-40" />
          <p className="text-sm">No hay citas en esta categoría.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredList.map(appt => {
            const st = STATUS_MAP[appt.reviewStatus] ?? STATUS_MAP.NUEVA;
            const isActing = actionId === appt._id;
            const spec = SPECIALTY_LABELS[appt.specialty] ?? appt.specialty;
            return (
              <div key={appt._id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-600/60 transition-all">
                {/* Status + Date */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${st.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(appt.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Person Info */}
                <div className="space-y-1.5">
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

                {/* Appointment Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">{spec}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">
                      {appt.preferredDate} · {appt.preferredTime}
                    </span>
                  </div>
                  <div className="col-span-2 bg-slate-900/50 rounded-lg p-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-slate-300 truncate">{appt.location}</span>
                  </div>
                </div>

                {/* Notes */}
                {appt.notes && (
                  <p className="text-xs text-slate-400 bg-slate-900/40 rounded-lg p-2 border border-slate-700/30 line-clamp-2">
                    {appt.notes}
                  </p>
                )}

                {/* Note input for NUEVA */}
                {showNoteFor === appt._id && (
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Agregar nota de gestión (opcional)..."
                    rows={2}
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none"
                  />
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-700/30">
                  {appt.reviewStatus === 'NUEVA' && (
                    <>
                      <button
                        onClick={() => {
                          if (showNoteFor !== appt._id) { setShowNoteFor(appt._id); setNote(''); }
                          else { handleAction(appt._id, 'STATUS_UPDATE', { newStatus: 'CONFIRMADA', note }); setShowNoteFor(null); }
                        }}
                        disabled={isActing}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                      >
                        {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {showNoteFor === appt._id ? 'Confirmar ahora' : 'Confirmar'}
                      </button>
                      <button
                        onClick={() => handleAction(appt._id, 'STATUS_UPDATE', { newStatus: 'CANCELADA' })}
                        disabled={isActing}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium hover:bg-red-500/25 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancelar
                      </button>
                    </>
                  )}
                  {appt.reviewStatus === 'CONFIRMADA' && (
                    <button
                      onClick={() => handleAction(appt._id, 'STATUS_UPDATE', { newStatus: 'GESTIONADA' })}
                      disabled={isActing}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium hover:bg-blue-500/25 transition-all disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Marcar atendida
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(appt._id, 'CONVERT_TO_CASE')}
                    disabled={isActing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium hover:bg-rose-500/25 transition-all disabled:opacity-50"
                  >
                    <FileHeart className="w-3.5 h-3.5" /> Abrir Caso
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
