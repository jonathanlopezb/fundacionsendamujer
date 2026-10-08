'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Plus, Search, DollarSign, CheckCircle, Clock,
  Loader2, Trash2, FileText, Calendar, ChevronRight,
  X, Phone, Mail, CreditCard, AlertCircle, ExternalLink,
} from 'lucide-react';

interface Provider {
  _id: string;
  code: string;
  name: string;
  nit: string;
  contactName?: string;
  phone?: string;
  email?: string;
  category: string;
  status: 'ACTIVO' | 'INACTIVO';
  notes?: string;
  createdAt: string;
}

interface Contract {
  _id: string;
  code: string;
  providerId: string;
  providerName: string;
  description: string;
  startDate: string;
  endDate?: string;
  totalAmount: number;
  amountPaid: number;
  status: 'VIGENTE' | 'VENCIDO' | 'CANCELADO' | 'FINALIZADO';
}

interface Payment {
  _id: string;
  code: string;
  providerId: string;
  providerName: string;
  contractId?: string;
  description: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: 'PENDIENTE' | 'PAGADO' | 'RECHAZADO';
}

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const TABS = ['Proveedores', 'Contratos', 'Pagos'] as const;
type Tab = typeof TABS[number];

const CONTRACT_STATUS = {
  VIGENTE:    { label: 'Vigente',    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  VENCIDO:    { label: 'Vencido',    color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  CANCELADO:  { label: 'Cancelado',  color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  FINALIZADO: { label: 'Finalizado', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};

const PAYMENT_STATUS = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  PAGADO:    { label: 'Pagado',    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  RECHAZADO: { label: 'Rechazado', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
};

const CATEGORIES = ['General', 'Servicios Profesionales', 'Tecnología', 'Mantenimiento', 'Capacitación', 'Suministros', 'Transporte', 'Otros'];
const PAY_METHODS = ['Transferencia', 'Cheque', 'Efectivo', 'PSE', 'Otro'];

export default function ProveedoresPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Proveedores');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<{ _id: string; total: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  // Modals
  const [showProvider, setShowProvider] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Forms
  const [pForm, setPForm] = useState({ name: '', nit: '', contactName: '', phone: '', email: '', category: 'General', notes: '' });
  const [cForm, setCForm] = useState({ providerId: '', providerName: '', description: '', startDate: '', endDate: '', totalAmount: '' });
  const [payForm, setPayForm] = useState({ providerId: '', providerName: '', contractId: '', description: '', amount: '', paymentDate: '', method: 'Transferencia' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes, payRes] = await Promise.all([
        fetch(`/api/crm/proveedores?entity=providers&limit=100&search=${search}`),
        fetch('/api/crm/proveedores?entity=contracts&limit=100'),
        fetch('/api/crm/proveedores?entity=payments&limit=100'),
      ]);
      const [pData, cData, payData] = await Promise.all([pRes.json(), cRes.json(), payRes.json()]);
      setProviders(pData.providers ?? []);
      setContracts(cData.contracts ?? []);
      setPayments(payData.payments ?? []);
      setPaymentSummary(payData.summary ?? []);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const post = async (body: Record<string, unknown>) => {
    await fetch('/api/crm/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    await fetchData();
  };

  const createProvider = async () => {
    if (!pForm.name || !pForm.nit) return;
    setActionId('prov');
    try { await post({ action: 'CREATE_PROVIDER', ...pForm }); setShowProvider(false); setPForm({ name: '', nit: '', contactName: '', phone: '', email: '', category: 'General', notes: '' }); }
    finally { setActionId(null); }
  };

  const createContract = async () => {
    if (!cForm.providerId || !cForm.description || !cForm.startDate) return;
    setActionId('ctr');
    try { await post({ action: 'CREATE_CONTRACT', ...cForm, totalAmount: Number(cForm.totalAmount) }); setShowContract(false); }
    finally { setActionId(null); }
  };

  const createPayment = async () => {
    if (!payForm.providerId || !payForm.amount || !payForm.paymentDate) return;
    setActionId('pay');
    try { await post({ action: 'CREATE_PAYMENT', ...payForm, amount: Number(payForm.amount) }); setShowPayment(false); }
    finally { setActionId(null); }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    setActionId(paymentId);
    try { await post({ action: 'UPDATE_PAYMENT_STATUS', paymentId, newStatus }); }
    finally { setActionId(null); }
  };

  const totalPendiente = paymentSummary.find(s => s._id === 'PENDIENTE')?.total ?? 0;
  const totalPagado    = paymentSummary.find(s => s._id === 'PAGADO')?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-rose-400" />
            Proveedores & Pagos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Directorio de proveedores, contratos de servicio y pagos pendientes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPayment(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/50 text-slate-300 rounded-xl text-sm hover:border-slate-600 transition-all">
            <CreditCard className="w-4 h-4" /> Registrar Pago
          </button>
          <button onClick={() => setShowProvider(true)} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all">
            <Plus className="w-4 h-4" /> Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Proveedores Activos', value: providers.filter(p => p.status === 'ACTIVO').length, icon: Building2, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Contratos Vigentes',  value: contracts.filter(c => c.status === 'VIGENTE').length, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Pagos Pendientes',    value: COP(totalPendiente), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Total Pagado',        value: COP(totalPagado),    icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border p-4 ${k.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <k.icon className={`w-4 h-4 ${k.color}`} />
              <span className="text-xs text-slate-400 font-medium">{k.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-xl border border-slate-700/40 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      {activeTab === 'Proveedores' && (
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar proveedor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center h-40 items-center">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Providers Tab */}
          {activeTab === 'Proveedores' && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {providers.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center h-40 text-slate-500">
                  <Building2 className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No hay proveedores. Agrega el primero.</p>
                </div>
              )}
              {providers.map(p => (
                <div key={p._id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-600/60 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-slate-500 font-mono">NIT: {p.nit} · {p.code}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.status === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    {p.contactName && <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{p.contactName}</div>}
                    {p.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{p.phone}</div>}
                    {p.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{p.email}</div>}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                    <span className="text-[10px] bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full">{p.category}</span>
                    <button
                      onClick={() => { setCForm(f => ({ ...f, providerId: p._id, providerName: p.name })); setShowContract(true); }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Contrato
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contracts Tab */}
          {activeTab === 'Contratos' && (
            <div className="space-y-3">
              {contracts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <FileText className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No hay contratos registrados.</p>
                </div>
              )}
              {contracts.map(c => {
                const st = CONTRACT_STATUS[c.status];
                const pct = c.totalAmount > 0 ? Math.min(100, Math.round((c.amountPaid / c.totalAmount) * 100)) : 0;
                return (
                  <div key={c._id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 hover:border-slate-600/60 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-white">{c.description}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border ${st.color}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-slate-500">{c.providerName} · {c.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{COP(c.totalAmount)}</p>
                        <p className="text-xs text-slate-500">Pagado: {COP(c.amountPaid)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {c.startDate} {c.endDate ? `→ ${c.endDate}` : '(abierto)'}
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{pct}% pagado</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'Pagos' && (
            <div className="space-y-3">
              {payments.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <CreditCard className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No hay pagos registrados.</p>
                </div>
              )}
              {payments.map(pay => {
                const st = PAYMENT_STATUS[pay.status];
                const isActing = actionId === pay._id;
                return (
                  <div key={pay._id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-600/60 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-semibold text-white">{pay.description}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-xs text-slate-400">{pay.providerName} · {pay.method} · {pay.paymentDate} · <span className="font-mono text-slate-500">{pay.code}</span></p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-base font-bold text-white">{COP(pay.amount)}</p>
                      {pay.status === 'PENDIENTE' && (
                        <button
                          onClick={() => updatePaymentStatus(pay._id, 'PAGADO')}
                          disabled={isActing}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                        >
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Marcar Pagado
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal: Create Provider */}
      {showProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-rose-400" /> Nuevo Proveedor</h2>
              <button onClick={() => setShowProvider(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Razón Social *', key: 'name', placeholder: 'Nombre del proveedor' },
                  { label: 'NIT / CC *', key: 'nit', placeholder: '900.123.456-7' },
                  { label: 'Contacto', key: 'contactName', placeholder: 'Nombre del contacto' },
                  { label: 'Teléfono', key: 'phone', placeholder: '+57 300 000 0000' },
                  { label: 'Email', key: 'email', placeholder: 'contacto@empresa.com' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'email' ? 'col-span-2' : ''}>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">{f.label}</label>
                    <input value={(pForm as Record<string, string>)[f.key]} onChange={e => setPForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Categoría</label>
                  <select value={pForm.category} onChange={e => setPForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Notas</label>
                  <textarea rows={2} value={pForm.notes} onChange={e => setPForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observaciones..."
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowProvider(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">Cancelar</button>
                <button onClick={createProvider} disabled={!pForm.name || !pForm.nit || actionId === 'prov'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50">
                  {actionId === 'prov' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Contract */}
      {showContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-rose-400" /> Nuevo Contrato</h2>
              <button onClick={() => setShowContract(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Proveedor *</label>
                <select value={cForm.providerId} onChange={e => {
                  const p = providers.find(p => p._id === e.target.value);
                  setCForm(f => ({ ...f, providerId: e.target.value, providerName: p?.name ?? '' }));
                }} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50">
                  <option value="">Seleccionar proveedor...</option>
                  {providers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Descripción del servicio *</label>
                <input value={cForm.description} onChange={e => setCForm(f => ({ ...f, description: e.target.value }))} placeholder="Ej: Mantenimiento de equipos Q4 2026"
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Fecha Inicio *', key: 'startDate', type: 'date' },
                  { label: 'Fecha Fin', key: 'endDate', type: 'date' },
                  { label: 'Valor Total (COP)', key: 'totalAmount', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">{f.label}</label>
                    <input type={f.type} value={(cForm as Record<string, string>)[f.key]} onChange={e => setCForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowContract(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">Cancelar</button>
                <button onClick={createContract} disabled={!cForm.providerId || !cForm.description || !cForm.startDate || actionId === 'ctr'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50">
                  {actionId === 'ctr' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Payment */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-rose-400" /> Registrar Pago</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Proveedor *</label>
                <select value={payForm.providerId} onChange={e => {
                  const p = providers.find(p => p._id === e.target.value);
                  setPayForm(f => ({ ...f, providerId: e.target.value, providerName: p?.name ?? '' }));
                }} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50">
                  <option value="">Seleccionar proveedor...</option>
                  {providers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Contrato (opcional)</label>
                <select value={payForm.contractId} onChange={e => setPayForm(f => ({ ...f, contractId: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50">
                  <option value="">Sin contrato</option>
                  {contracts.filter(c => !payForm.providerId || c.providerId === payForm.providerId).map(c => (
                    <option key={c._id} value={c._id}>{c.description}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Descripción *</label>
                <input value={payForm.description} onChange={e => setPayForm(f => ({ ...f, description: e.target.value }))} placeholder="Concepto del pago"
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Monto (COP) *</label>
                  <input type="number" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Fecha de Pago *</label>
                  <input type="date" value={payForm.paymentDate} onChange={e => setPayForm(f => ({ ...f, paymentDate: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Método de Pago</label>
                  <select value={payForm.method} onChange={e => setPayForm(f => ({ ...f, method: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50">
                    {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowPayment(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">Cancelar</button>
                <button onClick={createPayment} disabled={!payForm.providerId || !payForm.amount || !payForm.paymentDate || actionId === 'pay'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50">
                  {actionId === 'pay' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
