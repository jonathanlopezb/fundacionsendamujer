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
  LayoutGrid,
  List,
  User,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'NEW', label: '1. Nuevos', color: 'border-blue-500/30 text-blue-300 bg-blue-500/10' },
  { id: 'ASSESSMENT', label: '2. Valoración', color: 'border-amber-500/30 text-amber-300 bg-amber-500/10' },
  { id: 'PLAN', label: '3. Plan de Acción', color: 'border-purple-500/30 text-purple-300 bg-purple-500/10' },
  { id: 'FOLLOW_UP', label: '4. Seguimiento', color: 'border-teal-500/30 text-teal-300 bg-teal-500/10' },
  { id: 'REFERRAL', label: '5. Remisión', color: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10' },
  { id: 'CLOSED', label: '6. Cerrados', color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' },
];

export default function CrmCasosPage() {
  const { user, can } = useCrmAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);

  // Modal
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
          if (jp.people?.length > 0 && !formData.personId) {
            setFormData((prev) => ({ ...prev, personId: jp.people[0]._id }));
          }
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
        personId: formData.personId,
        type: formData.type,
        priority: formData.priority,
        openingReason: formData.openingReason,
        assessmentSummary: formData.assessmentSummary,
        responsibleUserId: formData.responsibleUserId || undefined,
        responsibleUserName: selectedUser ? selectedUser.name : undefined,
      };

      const res = await fetch('/api/crm/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Error al abrir el caso');
      }

      setModalOpen(false);
      setFormData({
        personId: people[0]?._id || '',
        type: 'SOCIAL',
        priority: 'MEDIUM',
        openingReason: '',
        assessmentSummary: '',
        responsibleUserId: '',
        responsibleUserName: '',
      });
      fetchCases();
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  const priorityBadge: Record<string, { label: string; color: string }> = {
    LOW: { label: 'Baja', color: 'text-slate-400 bg-slate-800/80 border-slate-700' },
    MEDIUM: { label: 'Media', color: 'text-blue-400 bg-blue-950/60 border-blue-800/60' },
    HIGH: { label: 'Alta', color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' },
    CRITICAL: { label: 'Crítica / Urgente', color: 'text-red-400 bg-red-950/60 border-red-800/80 font-bold animate-pulse' },
  };

  const typeLabels: Record<string, string> = {
    SOCIAL: 'Trabajo Social',
    PSYCHOSOCIAL: 'Atención Psicológica',
    LEGAL: 'Asesoría Jurídica / THEMIS',
    VBG: 'Violencia de Género (VBG)',
    ECONOMIC: 'Emprendimiento / CAM',
    OTHER: 'Otro Acompañamiento',
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileHeart className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Gestión de Casos & Expedientes</h1>
          </div>
          <p className="text-xs text-slate-400">
            Acompañamiento integral multidisciplinario (Social, Psicosocial y Jurídico) con notas confidenciales cifradas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#161b27] border border-slate-800 rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Tablero Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {can('cases.write') && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Abrir Nuevo Caso</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por código CAS-2026-..., motivo o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-rose-500/60"
            >
              <option value="">Todos los Estados</option>
              <option value="NEW">1. Nuevos</option>
              <option value="ASSESSMENT">2. Valoración</option>
              <option value="PLAN">3. Plan de Acción</option>
              <option value="FOLLOW_UP">4. Seguimiento</option>
              <option value="REFERRAL">5. Remisión</option>
              <option value="CLOSED">6. Cerrados</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-rose-500/60"
            >
              <option value="">Todos los Tipos</option>
              <option value="SOCIAL">Trabajo Social</option>
              <option value="PSYCHOSOCIAL">Psicología</option>
              <option value="LEGAL">Jurídico / THEMIS</option>
              <option value="VBG">Violencia de Género (VBG)</option>
              <option value="ECONOMIC">Emprendimiento / CAM</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-rose-500/60"
            >
              <option value="">Todas las Prioridades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica / Urgente</option>
            </select>

            <button
              onClick={() => setOnlyMine(!onlyMine)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                onlyMine
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-semibold'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Solo Mis Casos
            </button>

            {(search || statusFilter || typeFilter || priorityFilter || onlyMine) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setTypeFilter('');
                  setPriorityFilter('');
                  setOnlyMine(false);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/40 border border-slate-700/40"
                title="Limpiar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/40">
          <span>{cases.length} casos encontrados</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Acceso restringido por rol y asignación
          </span>
        </div>
      </div>

      {/* ── Vista Lista ── */}
      {viewMode === 'list' && (
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Cargando expedientes...
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <FileHeart className="w-10 h-10 mx-auto text-slate-600 opacity-40 mb-1" />
              <p className="text-sm font-semibold text-slate-300">No hay casos registrados bajo estos filtros</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {cases.map((c) => {
                const prio = priorityBadge[c.priority] || { label: c.priority, color: 'text-slate-400 bg-slate-800' };
                return (
                  <Link
                    key={c._id}
                    href={`/crm/casos/${c._id}`}
                    className="p-4 hover:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors group block"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{c.caseNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {c.status}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded border font-medium bg-slate-900 border-slate-700 text-slate-300">
                          {typeLabels[c.type] || c.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${prio.color}`}>
                          {prio.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 group-hover:text-rose-300 font-medium transition-colors">
                        {c.openingReason}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 text-slate-400">
                          <User className="w-3 h-3 text-slate-500" />
                          Responsable: {c.responsibleUserName || 'Sin asignar'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Apertura: {new Date(c.openedAt || c.createdAt).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-slate-400 group-hover:text-rose-400 transition-colors">
                      <span className="text-xs font-medium">Abrir Expediente</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Vista Kanban ── */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {STATUS_COLUMNS.map((col) => {
            const colCases = cases.filter((c) => c.status === col.id);
            return (
              <div key={col.id} className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2.5 min-h-[500px]">
                <div className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-xs font-bold ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-700">
                    {colCases.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {colCases.map((c) => {
                    const prio = priorityBadge[c.priority] || { label: c.priority, color: 'text-slate-400' };
                    return (
                      <Link
                        key={c._id}
                        href={`/crm/casos/${c._id}`}
                        className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl space-y-2 block transition-all group hover:border-slate-700 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white font-mono">{c.caseNumber}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border ${prio.color}`}>
                            {prio.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 group-hover:text-rose-300 transition-colors">
                          {c.openingReason}
                        </p>
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="truncate max-w-[100px]">{c.responsibleUserName || 'Sin asignar'}</span>
                          <span>{new Date(c.openedAt || c.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </Link>
                    );
                  })}
                  {colCases.length === 0 && (
                    <div className="py-8 text-center text-slate-600 text-[11px]">
                      Sin casos
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Apertura de Caso ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <FileHeart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Apertura de Expediente / Caso</h2>
                  <p className="text-[11px] text-slate-400">Atención social y seguimiento confidencial</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Persona / Participante *</label>
                <select
                  required
                  value={formData.personId}
                  onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName} — {p.documentType} {p.documentNumberMasked || '••••'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Acompañamiento</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="SOCIAL">Trabajo Social</option>
                    <option value="PSYCHOSOCIAL">Atención Psicológica</option>
                    <option value="LEGAL">Asesoría Jurídica / THEMIS</option>
                    <option value="VBG">Violencia de Género (VBG)</option>
                    <option value="ECONOMIC">Emprendimiento / CAM</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridad / Nivel de Riesgo</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profesional Responsable Asignada</label>
                <select
                  value={formData.responsibleUserId}
                  onChange={(e) => setFormData({ ...formData, responsibleUserId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="">Asignarme a mí mismo / Sin asignar</option>
                  {usersList.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo de Apertura / Solicitud *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describa el motivo principal por el que se abre el caso..."
                  value={formData.openingReason}
                  onChange={(e) => setFormData({ ...formData, openingReason: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resumen Inicial de Valoración (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Primeras impresiones o antecedentes relevantes..."
                  value={formData.assessmentSummary}
                  onChange={(e) => setFormData({ ...formData, assessmentSummary: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>Aperturar Caso</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
