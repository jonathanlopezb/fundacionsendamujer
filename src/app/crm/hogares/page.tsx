'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Home,
  Search,
  PlusCircle,
  MapPin,
  Users,
  AlertTriangle,
  X,
  Building,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function CrmHogaresPage() {
  const { can } = useCrmAuth();
  const [households, setHouseholds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    neighborhood: '',
    locality: '',
    city: 'Barranquilla',
    housingType: 'Propia',
    stratum: 1,
    membersCount: 1,
    childrenCount: 0,
    services: ['Agua', 'Energía'],
    socioeconomicRisks: ['Ingresos Informales'],
    vulnerabilities: [],
    observations: '',
  });

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('q', search.trim());
      const res = await fetch(`/api/crm/households?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setHouseholds(json.households || []);
      }
    } catch (err) {
      console.error('Error al cargar hogares:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/crm/households', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchHouseholds();
      }
    } catch (err) {
      console.error('Error al registrar hogar:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Caracterización Territorial de Hogares</h1>
          </div>
          <p className="text-xs text-slate-400">
            Registro de condiciones habitacionales, estratificación y riesgos socioeconómicos familiares.
          </p>
        </div>

        {can('people.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Caracterizar Hogar</span>
          </button>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por barrio, dirección o código de hogar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchHouseholds()}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60"
          />
        </div>
      </div>

      {/* ── Grid / List ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando caracterizaciones de hogares...
          </div>
        ) : households.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No se registran hogares caracterizados bajo estos criterios.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {households.map((h) => (
              <div
                key={h._id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {h.code || 'HOG-2026'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Estrato {h.stratum || 1}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>{h.neighborhood || 'Barrio sin asignar'}, {h.city || 'Barranquilla'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{h.address}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {h.membersCount || 1} integrantes
                    </span>
                    <span className="text-purple-400 font-medium text-[11px]">
                      {h.childrenCount || 0} menores
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>Vivienda: {h.housingType}</span>
                  <span>Registrado: {new Date(h.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Nuevo Hogar ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Caracterizar Nuevo Hogar</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHousehold} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Barrio / Sector *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. La Paz, El Bosque"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección Exacta *</label>
                <input
                  type="text"
                  required
                  placeholder="Calle 80 # 10-40"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estrato</label>
                  <select
                    value={formData.stratum}
                    onChange={(e) => setFormData({ ...formData, stratum: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value={1}>Estrato 1</option>
                    <option value={2}>Estrato 2</option>
                    <option value={3}>Estrato 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Integrantes</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Menores</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Tenencia</label>
                <select
                  value={formData.housingType}
                  onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="Propia">Propia (Pagada / Hipoteca)</option>
                  <option value="Arriendo">Arrendada</option>
                  <option value="Familiar">Familiar / Prestada</option>
                  <option value="Posesion">Posesión sin título</option>
                </select>
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  {creating ? 'Guardando...' : 'Guardar Hogar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
