'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { Home, Search, PlusCircle, MapPin, Users, AlertTriangle, X } from 'lucide-react';

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
    city: 'Cartagena',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Home className="w-5 h-5 text-rose-400" />
            Caracterización Territorial de Hogares
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de condiciones habitacionales, estratificación y riesgos socioeconómicos en Cartagena.
          </p>
        </div>

        {can('people.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Caracterizar Hogar</span>
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por barrio o dirección..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchHouseholds()}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500 text-xs animate-pulse">
            Cargando caracterizaciones...
          </div>
        ) : households.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 text-xs bg-slate-900/60 border border-slate-800 rounded-2xl">
            No se han registrado hogares en la base de datos todavía.
          </div>
        ) : (
          households.map((h) => (
            <div key={h._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-400">{h.code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                  Estrato {h.stratum}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {h.neighborhood}, {h.city}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{h.address}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {h.membersCount} integrantes
                </span>
                <span className="text-slate-400">({h.childrenCount} menores)</span>
              </div>

              {h.socioeconomicRisks?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {h.socioeconomicRisks.map((r: string) => (
                    <span key={r} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-900 font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Caracterizar Hogar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Caracterizar Hogar
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHousehold} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Barrio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Nelson Mandela"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dirección Exacta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sector Campo Bello Mz 2 Lote 5"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estrato</label>
                  <input
                    type="number"
                    value={formData.stratum}
                    onChange={(e) => setFormData({ ...formData, stratum: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Integrantes</label>
                  <input
                    type="number"
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Menores</label>
                  <input
                    type="number"
                    value={formData.childrenCount}
                    onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Condiciones del entorno, observaciones de visita..."
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                >
                  {creating ? 'Guardando...' : 'Guardar Caracterización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
