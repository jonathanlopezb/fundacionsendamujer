'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCrmAuth } from '@/lib/crm/client';
import {
  FileHeart,
  Search,
  PlusCircle,
  Filter,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Shield,
} from 'lucide-react';

export default function CrmCasosPage() {
  const { user, can } = useCrmAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    personId: '',
    type: 'SOCIAL',
    priority: 'MEDIUM',
    openingReason: '',
    assessmentSummary: '',
    responsibleUserId: '',
    responsibleUserName: '',
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('q', search.trim());
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (onlyMine) params.append('mine', 'true');

      const res = await fetch(`/api/crm/cases?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCases(json.cases || []);
      }
    } catch (err) {
      console.error('Error al consultar casos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter, typeFilter, priorityFilter, onlyMine]);

  useEffect(() => {
    async function loadAuxData() {
      try {
        const [resPeople, resUsers] = await Promise.all([
          fetch('/api/crm/people?limit=200'),
          fetch('/api/crm/users'),
        ]);
        if (resPeople.ok) {
          const jp = await resPeople.json();
          setPeople(jp.people || []);
        }
        if (resUsers.ok) {
          const ju = await resUsers.json();
          setUsersList(ju.users || []);
        }
      } catch (e) {
        console.error('Error cargando listas auxiliares:', e);
      }
    }
    loadAuxData();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const selectedUser = usersList.find((u) => u._id === formData.responsibleUserId);

      const payload = {
        ...formData,
        responsibleUserName: selectedUser ? selectedUser.name : user?.name,
      };

      const res = await fetch('/api/crm/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al abrir caso');
      }

      setModalOpen(false);
      setFormData({
        personId: '',
        type: 'SOCIAL',
        priority: 'MEDIUM',
        openingReason: '',
        assessmentSummary: '',
        responsibleUserId: '',
        responsibleUserName: '',
      });
      fetchCases();
    } catch (err: any) {
      setError(err.message || 'Error al abrir caso');
    } finally {
      setCreating(false);
    }
  };

  const statusBadge = (st: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      NEW: { bg: 'bg-blue-950/80 border-blue-800', text: 'text-blue-300', label: 'Nuevo' },
      ASSESSMENT: { bg: 'bg-amber-950/80 border-amber-800', text: 'text-amber-300', label: 'Valoración' },
      PLAN: { bg: 'bg-purple-950/80 border-purple-800', text: 'text-purple-300', label: 'Plan Aprobado' },
      FOLLOW_UP: { bg: 'bg-teal-950/80 border-teal-800', text: 'text-teal-300', label: 'En Seguimiento' },
      REFERRAL: { bg: 'bg-indigo-950/80 border-indigo-800', text: 'text-indigo-300', label: 'Remisión' },
      REFERRAL_FOLLOW_UP: { bg: 'bg-cyan-950/80 border-cyan-800', text: 'text-cyan-300', label: 'Seguimiento Remisión' },
      CLOSED: { bg: 'bg-emerald-950/80 border-emerald-800', text: 'text-emerald-300', label: 'Cerrado / Resuelto' },
    };
    const s = map[st] || { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300', label: st };
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const priorityBadge = (pr: string) => {
    switch (pr) {
      case 'CRITICAL':
        return <span className="text-[10px] font-bold text-red-400 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" /> CRÍTICA</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" /> ALTA</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-medium text-slate-300">MEDIA</span>;
      default:
        return <span className="text-[10px] text-slate-400">BAJA</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileHeart className="w-5 h-5 text-rose-400" />
            Expedientes y Casos de Atención
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Módulo confidencial y multidisciplinario: psicología, trabajo social y asesoría jurídica Ley 1257.
          </p>
        </div>

        {can('cases.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Aperturar Caso</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por número o motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
        >
          <option value="">Todos los estados</option>
          <option value="NEW">Nuevo</option>
          <option value="ASSESSMENT">En Valoración</option>
          <option value="PLAN">Plan Aprobado</option>
          <option value="FOLLOW_UP">En Seguimiento</option>
          <option value="REFERRAL">En Remisión</option>
          <option value="CLOSED">Cerrado</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
        >
          <option value="">Todas las áreas</option>
          <option value="SOCIAL">Trabajo Social</option>
          <option value="PSYCHOLOGICAL">Psicología</option>
          <option value="LEGAL">Asesoría Jurídica</option>
          <option value="EMPOWERMENT">Empoderamiento</option>
          <option value="EMERGENCY">Emergencia</option>
          <option value="MEDICAL">Médico / Salud</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
        >
          <option value="">Cualquier prioridad</option>
          <option value="CRITICAL">Crítica</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>
      </div>

      {/* Cases List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs animate-pulse">Cargando expedientes...</div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron casos registrados con los filtros seleccionados.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {cases.map((c) => (
              <Link
                key={c._id}
                href={`/crm/casos/${c._id}`}
                className="p-4 hover:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all block group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                      {c.caseNumber}
                    </span>
                    {statusBadge(c.status)}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {c.type}
                    </span>
                    {priorityBadge(c.priority)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span>Participante: {c.personName}</span>
                    {c.personPhone && <span className="text-slate-400 text-[11px]">· Tel: {c.personPhone}</span>}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">{c.openingReason}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-slate-200 font-medium block">{c.responsibleUserName || 'Sin asignar'}</span>
                    <span className="text-[10px] text-slate-500">
                      Apertura: {new Date(c.openedAt || c.createdAt).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modal Apertura de Caso */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Apertura de Nuevo Caso
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Participante / Titular *</label>
                <select
                  required
                  value={formData.personId}
                  onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="">Seleccione a la persona...</option>
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.protectedIdentity ? p.pseudonym || 'Identidad Protegida' : `${p.firstName} ${p.lastName}`} ({p.documentType} {p.documentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Área de Atención *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="SOCIAL">Trabajo Social</option>
                    <option value="PSYCHOLOGICAL">Psicología / Salud Mental</option>
                    <option value="LEGAL">Asesoría Jurídica (Ley 1257)</option>
                    <option value="EMPOWERMENT">Empoderamiento Productivo CAM</option>
                    <option value="EMERGENCY">Emergencia / Riesgo Vital</option>
                    <option value="MEDICAL">Atención Médica / Ecografía</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioridad *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica / Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Profesional Responsable Asignado</label>
                <select
                  value={formData.responsibleUserId}
                  onChange={(e) => setFormData({ ...formData, responsibleUserId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="">Asignar a mí mismo ({user?.name})</option>
                  {usersList.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motivo de Apertura / Hechos *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describa la situación inicial, motivo de consulta o necesidad identificada..."
                  value={formData.openingReason}
                  onChange={(e) => setFormData({ ...formData, openingReason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  Al abrir este caso se generará automáticamente una tarea de <strong>Valoración Inicial</strong> para el profesional asignado y el expediente quedará clasificado bajo confidencialidad <strong>RESTRICTED</strong>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 disabled:opacity-50"
                >
                  {creating ? 'Guardando...' : 'Aperturar Expediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
