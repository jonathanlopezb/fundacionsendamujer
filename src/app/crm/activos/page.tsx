'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { Package, PlusCircle, CheckCircle2, X } from 'lucide-react';

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
    type: 'KIT_PRODUCTIVO',
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
      if (resPeo.ok) setPeople((await resPeo.json()).people || []);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-400" />
            Entregas de Ayudas & Dotación de Activos
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de kits de modistería, panadería, alimentos e inventario de maquinaria para emprendimiento.
          </p>
        </div>

        {can('assets.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Entrega de Ayuda</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'deliveries' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ayudas y Kits Entregados ({deliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'assets' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Inventario de Activos Fijos ({assets.length})
        </button>
      </div>

      {activeTab === 'deliveries' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3">Participante</th>
                <th className="p-3">Tipo de Ayuda</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Valor Estimado</th>
                <th className="p-3">Fecha Entrega</th>
                <th className="p-3">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deliveries.map((del) => (
                <tr key={del._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{del.personName}</td>
                  <td className="p-3 text-rose-300 font-medium">{del.type}</td>
                  <td className="p-3 text-slate-300">{del.quantity} unidad(es)</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">${Number(del.value || 0).toLocaleString('es-CO')} COP</td>
                  <td className="p-3 text-slate-400">{new Date(del.deliveryDate).toLocaleDateString('es-CO')}</td>
                  <td className="p-3 text-slate-400">{del.responsibleUserName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Registrar Entrega */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Registrar Entrega de Ayuda
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Participante Receptora *</label>
                <select
                  required
                  value={deliveryData.personId}
                  onChange={(e) => setDeliveryData({ ...deliveryData, personId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="">Seleccione participante...</option>
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Ayuda / Dotación</label>
                  <select
                    value={deliveryData.type}
                    onChange={(e) => setDeliveryData({ ...deliveryData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="KIT_PRODUCTIVO">Kit de Costura / Confección</option>
                    <option value="MAQUINA_COSER">Máquina de Coser Industrial/Plana</option>
                    <option value="TELAS">Rollo de Telas e Insumos</option>
                    <option value="ALIMENTOS">Paquete Nutricional Familiar</option>
                    <option value="MEDICAMENTOS">Apoyo de Medicamentos</option>
                    <option value="SUBSIDIO_TRANSPORTE">Subsidio de Movilidad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cantidad</label>
                  <input
                    type="number"
                    required
                    value={deliveryData.quantity}
                    onChange={(e) => setDeliveryData({ ...deliveryData, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Valor Estimado COP</label>
                <input
                  type="number"
                  placeholder="Ej. 180000"
                  value={deliveryData.value}
                  onChange={(e) => setDeliveryData({ ...deliveryData, value: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  Registrar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
