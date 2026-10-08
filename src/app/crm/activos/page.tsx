'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Package,
  PlusCircle,
  CheckCircle2,
  X,
  User,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';

const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function CrmActivosPage() {
  const { can } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<'deliveries' | 'assets'>('deliveries');
  const [assets, setAssets] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    personId: '',
    type: 'KIT_PRODUCTIVO_MODISTERIA',
    quantity: 1,
    value: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAst, resDel, resPeo] = await Promise.all([
        fetch('/api/crm/assets?view=assets'),
        fetch('/api/crm/assets?view=deliveries'),
        fetch('/api/crm/people?limit=100'),
      ]);
      if (resAst.ok) setAssets((await resAst.json()).assets || []);
      if (resDel.ok) setDeliveries((await resDel.json()).deliveries || []);
      if (resPeo.ok) {
        const jp = await resPeo.json();
        setPeople(jp.people || []);
        if (jp.people?.length > 0 && !deliveryData.personId) {
          setDeliveryData((prev) => ({ ...prev, personId: jp.people[0]._id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    const selPerson = people.find((p) => p._id === deliveryData.personId);
    if (!selPerson) return;

    try {
      const res = await fetch('/api/crm/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'delivery',
          personId: selPerson._id,
          personName: `${selPerson.firstName} ${selPerson.lastName}`,
          type: deliveryData.type,
          quantity: deliveryData.quantity,
          value: deliveryData.value,
          notes: deliveryData.notes,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchData();
      }
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
            <Package className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Entregas de Ayudas & Dotación de Activos</h1>
          </div>
          <p className="text-xs text-slate-400">
            Registro de kits de modistería, repostería, ayudas humanitarias e inventario de maquinaria productiva.
          </p>
        </div>

        {can('assets.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Entrega de Ayuda</span>
          </button>
        )}
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'deliveries'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Ayudas & Kits Entregados ({deliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'assets'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Inventario de Maquinaria & Activos ({assets.length})</span>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando registros de ayudas y activos...
          </div>
        ) : activeTab === 'deliveries' ? (
          deliveries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No hay entregas registradas aún. Registra la primera desde el botón superior.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Beneficiaria</th>
                    <th className="py-3.5 px-4">Tipo de Ayuda / Kit</th>
                    <th className="py-3.5 px-4">Cantidad</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4">Fecha Entrega</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {deliveries.map((del) => (
                    <tr key={del._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{del.personName || 'Beneficiaria'}</td>
                      <td className="py-3.5 px-4 text-slate-300">{del.type}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{del.quantity} unidad(es)</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                          {del.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(del.deliveryDate || del.createdAt).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : assets.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No hay maquinaria en inventario.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((ast) => (
              <div key={ast._id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-white block">{ast.name}</span>
                <span className="text-[11px] text-slate-400 font-mono block">Serial: {ast.serialNumber || 'N/A'}</span>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-500">
                  <span>Estado: {ast.status}</span>
                  <span className="text-emerald-400 font-mono">{ast.value ? fmtCOP(ast.value) : 'Donación'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Nueva Entrega ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Registrar Entrega de Ayuda</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Beneficiaria *</label>
                <select
                  required
                  value={deliveryData.personId}
                  onChange={(e) => setDeliveryData({ ...deliveryData, personId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName} — {p.documentNumberMasked || '•••'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Kit / Ayuda</label>
                <select
                  value={deliveryData.type}
                  onChange={(e) => setDeliveryData({ ...deliveryData, type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="KIT_PRODUCTIVO_MODISTERIA">Kit Modistería & Confección</option>
                  <option value="KIT_PRODUCTIVO_REPOSTERIA">Kit Repostería & Panadería</option>
                  <option value="KIT_PRODUCTIVO_SUBLIMACION">Kit Estampado & Sublimación</option>
                  <option value="KIT_ALIMENTOS">Kit de Alimentos / Emergencia</option>
                  <option value="MAQUINARIA">Máquina de Coser / Insumo Mayor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={deliveryData.quantity}
                    onChange={(e) => setDeliveryData({ ...deliveryData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Estimado (COP)</label>
                  <input
                    type="number"
                    placeholder="350000"
                    value={deliveryData.value}
                    onChange={(e) => setDeliveryData({ ...deliveryData, value: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
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
                  Confirmar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
