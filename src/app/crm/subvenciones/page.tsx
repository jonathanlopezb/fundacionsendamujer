'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { Award, PlusCircle, Globe, Calendar, DollarSign, X } from 'lucide-react';

const PIPELINE_COLUMNS = [
  { id: 'IDENTIFIED', label: 'Identificadas' },
  { id: 'IN_PREPARATION', label: 'En Formulación' },
  { id: 'SUBMITTED', label: 'Postuladas' },
  { id: 'APPROVED', label: 'Aprobadas / En Ejecución' },
  { id: 'CLOSED', label: 'Cerradas' },
];

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
        fetchGrants();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-400" />
            Subvenciones & Cooperación Internacional
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pipeline kanban de convocatorias, propuestas a fondos globales y proyectos de cooperación.
          </p>
        </div>

        {can('grants.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Convocatoria</span>
          </button>
        )}
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((col) => {
          const colGrants = grants.filter((g) => g.status === col.id);

          return (
            <div key={col.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col min-h-[450px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300">{col.label}</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {colGrants.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colGrants.length === 0 ? (
                  <div className="py-8 text-center text-slate-600 text-[11px]">Sin convocatorias</div>
                ) : (
                  colGrants.map((g) => (
                    <div key={g._id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 hover:border-slate-700 transition-all shadow-sm">
                      <h4 className="text-xs font-bold text-white line-clamp-2">{g.title}</h4>
                      <p className="text-[11px] text-rose-400 font-semibold">{g.funderName}</p>
                      <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono text-emerald-400 font-bold">${Number(g.requestedAmount).toLocaleString('es-CO')} {g.currency}</span>
                        <span>{new Date(g.deadline).toLocaleDateString('es-CO')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva Subvención */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Registrar Oportunidad / Subvención
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGrant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título de la Convocatoria / Proyecto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fondo Global para la Autonomía de Mujeres 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organismo Financiador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. ONU Mujeres / USAID / AECID"
                    value={formData.funderName}
                    onChange={(e) => setFormData({ ...formData, funderName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha Límite *</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monto Solicitado *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 50000000"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Moneda</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="COP">COP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado en Pipeline</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="IDENTIFIED">Identificada</option>
                  <option value="IN_PREPARATION">En Formulación</option>
                  <option value="SUBMITTED">Postulada</option>
                  <option value="APPROVED">Aprobada</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  Guardar Oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
