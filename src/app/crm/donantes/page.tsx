'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  HeartHandshake,
  DollarSign,
  PlusCircle,
  Award,
  CheckCircle2,
  X,
  Building,
  User,
  CreditCard,
  Calendar,
  Sparkles,
  TrendingUp,
  Download,
  Search,
} from 'lucide-react';

const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function CrmDonantesPage() {
  const { can } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<'donations' | 'donors' | 'campaigns'>('donations');
  const [donations, setDonations] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

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

  const totalRaised = donations
    .filter((d) => d.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HeartHandshake className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Recaudación de Fondos & Donantes</h1>
          </div>
          <p className="text-xs text-slate-400">
            Aportes en dinero y especie, campañas de recaudación y certificados tributarios.
          </p>
        </div>

        {can('donations.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Aporte / Donación</span>
          </button>
        )}
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Total Recaudado</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{fmtCOP(totalRaised)}</div>
            <span className="text-[11px] text-emerald-400 mt-0.5 block font-medium">Aportes confirmados</span>
          </div>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Donantes en Base</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{donors.length}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Naturales y empresas</span>
          </div>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Donaciones Totales</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{donations.length}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Recibos emitidos</span>
          </div>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Campañas Activas</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{campaigns.length}</div>
            <span className="text-[11px] text-purple-400 mt-0.5 block font-medium">Fondos con meta</span>
          </div>
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        <button
          onClick={() => setActiveTab('donations')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'donations'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Historial de Aportes ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donors')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'donors'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Directorio de Donantes ({donors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'campaigns'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Campañas & Metas ({campaigns.length})</span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando información financiera y de donantes...
          </div>
        ) : activeTab === 'donations' ? (
          donations.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <HeartHandshake className="w-10 h-10 mx-auto text-slate-600 opacity-40 mb-1" />
              <p className="text-sm font-semibold text-slate-300">No hay donaciones registradas</p>
              <p className="text-xs text-slate-500">Registra aportes en dinero o especie desde el botón superior.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Recibo / Donante</th>
                    <th className="py-3.5 px-4">Monto / Tipo</th>
                    <th className="py-3.5 px-4">Medio de Pago</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white text-[11px] block">{d.receiptNumber || 'REC-PENDING'}</span>
                        <span className="text-slate-400 text-xs">{d.donorName || 'Donante Anónimo'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white font-mono text-xs">{fmtCOP(d.amount)}</span>
                        <span className="text-[10px] text-slate-500 block">{d.type}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{d.paymentMethod}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(d.receivedAt || d.createdAt).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'donors' ? (
          donors.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No hay donantes registrados aún.</div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {donors.map((dor) => (
                <div key={dor._id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-white block">{dor.name}</span>
                    <span className="text-[11px] text-slate-400">{dor.email || dor.phone || 'Sin contacto'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono block">{fmtCOP(dor.totalDonated || 0)}</span>
                    <span className="text-[10px] text-slate-500">Total donado</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No hay campañas registradas aún.</div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div key={camp._id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-white block">{camp.name}</span>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Meta: {fmtCOP(camp.goalAmount)}</span>
                  <span className="text-emerald-400">Recaudado: {fmtCOP(camp.raisedAmount || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Nueva Donación ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Registrar Donación / Aporte</h2>
                  <p className="text-[11px] text-slate-400">Emisión automática de recibo institucional</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Donante *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fundación Bolívar Davivienda o Persona Natural"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="donante@ejemplo.org"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+57 300 123 4567"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monto (COP) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Ej. 250000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Medio de Pago</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="PSE">PSE / Pasarela</option>
                    <option value="Efectivo">Efectivo / Caja</option>
                    <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                    <option value="Wompi">Wompi</option>
                  </select>
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
                  disabled={creating}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  {creating ? 'Guardando...' : 'Confirmar Donación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
