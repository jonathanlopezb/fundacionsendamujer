'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Award,
  PlusCircle,
  Globe,
  Calendar,
  DollarSign,
  X,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const PIPELINE_COLUMNS = [
  { id: 'IDENTIFIED', label: '1. Identificadas', color: 'border-blue-500/30 text-blue-300 bg-blue-500/10' },
  { id: 'IN_PREPARATION', label: '2. En Formulación', color: 'border-amber-500/30 text-amber-300 bg-amber-500/10' },
  { id: 'SUBMITTED', label: '3. Postuladas', color: 'border-purple-500/30 text-purple-300 bg-purple-500/10' },
  { id: 'APPROVED', label: '4. Aprobadas / Ejecución', color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' },
  { id: 'CLOSED', label: '5. Cerradas', color: 'border-slate-700 text-slate-400 bg-slate-800/40' },
];

const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function CrmSubvencionesPage() {
  const { can } = useCrmAuth();
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    funderName: '',
    country: 'Colombia / Internacional',
    deadline: '',
    requestedAmount: '',
    currency: 'COP',
    status: 'IDENTIFIED',
  });

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/grants');
      if (res.ok) {
        setGrants((await res.json()).grants || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  const handleCreateGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({
          title: '',
          funderName: '',
          country: 'Colombia / Internacional',
          deadline: '',
          requestedAmount: '',
          currency: 'COP',
          status: 'IDENTIFIED',
        });
        fetchGrants();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeStatus = async (grantId: string, nextStatus: string) => {
    try {
      const res = await fetch('/api/crm/grants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grantId, status: nextStatus }),
      });
      if (res.ok) fetchGrants();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Subvenciones & Cooperación Internacional</h1>
          </div>
          <p className="text-xs text-slate-400">
            Pipeline kanban de convocatorias, propuestas a fondos globales y proyectos de cooperación.
          </p>
        </div>

        {can('grants.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Convocatoria</span>
          </button>
        )}
      </div>

      {/* ── Kanban Board ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {PIPELINE_COLUMNS.map((col) => {
          const colGrants = grants.filter((g) => g.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2.5 min-h-[500px]"
            >
              <div className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-xs font-bold ${col.color}`}>
                <span>{col.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-700">
                  {colGrants.length}
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                {colGrants.map((g) => (
                  <div
                    key={g._id}
                    className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5 transition-all shadow-sm"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block leading-tight">{g.title}</span>
                      <span className="text-[11px] text-rose-400 font-medium block mt-0.5">{g.funderName}</span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Monto:</span>
                        <span className="font-mono font-bold text-white text-xs">
                          {g.requestedAmount ? fmtCOP(g.requestedAmount) : 'Por definir'}
                        </span>
                      </div>
                      {g.deadline && (
                        <div className="flex items-center justify-between text-[10px] text-amber-400">
                          <span>Límite:</span>
                          <span>{new Date(g.deadline).toLocaleDateString('es-CO')}</span>
                        </div>
                      )}
                    </div>

                    {can('grants.write') && col.id !== 'CLOSED' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const nextIdx = PIPELINE_COLUMNS.findIndex((x) => x.id === col.id) + 1;
                            if (nextIdx < PIPELINE_COLUMNS.length) {
                              handleChangeStatus(g._id, PIPELINE_COLUMNS[nextIdx].id);
                            }
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1 font-medium transition-colors"
                        >
                          <span>Avanzar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {colGrants.length === 0 && (
                  <div className="py-8 text-center text-slate-600 text-[11px]">
                    Sin convocatorias
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Nueva Convocatoria ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Registrar Convocatoria / Subvención</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGrant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Propuesta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fortalecimiento CAM para Mujeres del Caribe"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entidad Financiadora *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. USAID, Fondo Canadá, Embajada de Suiza"
                  value={formData.funderName}
                  onChange={(e) => setFormData({ ...formData, funderName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monto Solicitado (COP)</label>
                  <input
                    type="number"
                    placeholder="120000000"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  Guardar Propuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
