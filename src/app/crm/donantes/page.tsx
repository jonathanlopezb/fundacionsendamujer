'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { HeartHandshake, DollarSign, PlusCircle, Award, CheckCircle2, X } from 'lucide-react';

export default function CrmDonantesPage() {
  const { can } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<'donations' | 'donors' | 'campaigns'>('donations');
  const [donations, setDonations] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    donorType: 'INDIVIDUAL',
    type: 'MONEY',
    amount: '',
    currency: 'COP',
    paymentMethod: 'Transferencia Bancaria',
    campaignId: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resDon, resDors, resCamp] = await Promise.all([
        fetch('/api/crm/donations?view=donations'),
        fetch('/api/crm/donations?view=donors'),
        fetch('/api/crm/donations?view=campaigns'),
      ]);

      if (resDon.ok) setDonations((await resDon.json()).donations || []);
      if (resDors.ok) setDonors((await resDors.json()).donors || []);
      if (resCamp.ok) setCampaigns((await resCamp.json()).campaigns || []);
    } catch (err) {
      console.error('Error cargando donaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/crm/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({
          donorName: '',
          donorEmail: '',
          donorPhone: '',
          donorType: 'INDIVIDUAL',
          type: 'MONEY',
          amount: '',
          currency: 'COP',
          paymentMethod: 'Transferencia Bancaria',
          campaignId: '',
          notes: '',
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-400" />
            Recaudación de Fondos & Donantes
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión de donantes, aportes en dinero/especie, campañas y certificados tributarios.
          </p>
        </div>

        {can('donations.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Donación</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('donations')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'donations' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Donaciones ({donations.length})
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'donors' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Directorio Donantes ({donors.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'campaigns' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Campañas ({campaigns.length})
        </button>
      </div>

      {activeTab === 'donations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Recibo</th>
                  <th className="p-3">Donante</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Tipo / Medio</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Certificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-rose-400">{d.receiptNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{d.donorName}</div>
                      <span className="text-[10px] text-slate-400">{d.donorEmail}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ${Number(d.amount).toLocaleString('es-CO')} {d.currency}
                    </td>
                    <td className="p-3 text-slate-300">
                      {d.type} · {d.paymentMethod}
                    </td>
                    <td className="p-3 text-slate-400">{new Date(d.receivedAt).toLocaleDateString('es-CO')}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Emitido
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'donors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donors.map((dor) => (
            <div key={dor._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                {dor.donorType}
              </span>
              <h3 className="text-xs font-bold text-white">{dor.companyName || dor.contactEmail}</h3>
              <p className="text-[11px] text-slate-400">{dor.contactEmail}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Donado:</span>
                <span className="font-mono font-bold text-emerald-400">${Number(dor.totalDonated).toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Registrar Donación */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Registrar Donación
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Donante / Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fundación Bolívar Davivienda / Carlos Ruiz"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correo Donante *</label>
                  <input
                    type="email"
                    required
                    placeholder="donante@ejemplo.com"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+57 300 000 0000"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monto *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 250000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                    <option value="COP">COP (Pesos Colombianos)</option>
                    <option value="USD">USD (Dólares)</option>
                    <option value="EUR">EUR (Euros)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medio de Pago</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Transferencia Bancaria Bancolombia">Transferencia Bancaria Bancolombia</option>
                  <option value="PSE">PSE / Botón de Pagos</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Efectivo en Sede">Efectivo en Sede</option>
                  <option value="Wompi / PayU">Wompi / Pasarela</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  {creating ? 'Registrando...' : 'Emitir Recibo & Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
