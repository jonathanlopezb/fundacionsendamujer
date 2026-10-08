'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Plus, Users, DollarSign, CheckCircle, Clock,
  Loader2, Search, ChevronDown, ChevronUp, Trash2, Send,
  FileText, Calendar, BarChart3, X, User,
} from 'lucide-react';

interface PayrollItem {
  employeeName: string;
  role: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
}

interface Payroll {
  _id: string;
  code: string;
  period: string;
  periodLabel: string;
  payDate: string;
  status: 'BORRADOR' | 'APROBADA' | 'PAGADA' | 'CANCELADA';
  totalGross: number;
  totalNet: number;
  employeeCount: number;
  items: PayrollItem[];
  notes?: string;
  createdAt: string;
}

const STATUS_MAP = {
  BORRADOR:  { label: 'Borrador',  color: 'bg-slate-500/15 text-slate-300 border-slate-500/30',     dot: 'bg-slate-400' },
  APROBADA:  { label: 'Aprobada',  color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',  dot: 'bg-indigo-400' },
  PAGADA:    { label: 'Pagada',    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  CANCELADA: { label: 'Cancelada', color: 'bg-red-500/15 text-red-300 border-red-500/30',           dot: 'bg-red-400' },
};

const NEXT_STATUS: Record<string, { label: string; next: string; color: string }> = {
  BORRADOR: { label: 'Aprobar',  next: 'APROBADA',  color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25' },
  APROBADA: { label: 'Marcar Pagada', next: 'PAGADA',    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25' },
};

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

export default function NominasPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [stats, setStats] = useState<{ _id: string; total: number; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // Create form
  const now = new Date();
  const [form, setForm] = useState({
    period: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    periodLabel: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
    payDate: '',
    notes: '',
    items: [] as PayrollItem[],
  });

  // New employee form
  const [empForm, setEmpForm] = useState({ employeeName: '', role: '', baseSalary: '', bonuses: '0', deductions: '0' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm/nominas?limit=50');
      const data = await res.json();
      setPayrolls(data.payrolls ?? []);
      setStats(data.stats ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addEmployee = () => {
    if (!empForm.employeeName || !empForm.baseSalary) return;
    const baseSalary  = Number(empForm.baseSalary);
    const bonuses     = Number(empForm.bonuses);
    const deductions  = Number(empForm.deductions);
    const netPay      = baseSalary + bonuses - deductions;
    setForm(f => ({ ...f, items: [...f.items, { employeeName: empForm.employeeName, role: empForm.role, baseSalary, bonuses, deductions, netPay }] }));
    setEmpForm({ employeeName: '', role: '', baseSalary: '', bonuses: '0', deductions: '0' });
  };

  const removeEmployee = (idx: number) =>
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const createPayroll = async () => {
    if (!form.payDate || form.items.length === 0) return;
    setActionId('create');
    try {
      await fetch('/api/crm/nominas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', ...form }),
      });
      setShowCreate(false);
      setForm({ period: form.period, periodLabel: form.periodLabel, payDate: '', notes: '', items: [] });
      await fetchData();
    } finally {
      setActionId(null);
    }
  };

  const updateStatus = async (payrollId: string, newStatus: string) => {
    setActionId(payrollId);
    try {
      await fetch('/api/crm/nominas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', payrollId, newStatus }),
      });
      await fetchData();
    } finally {
      setActionId(null);
    }
  };

  const deletePayroll = async (payrollId: string) => {
    if (!confirm('¿Eliminar esta nómina?')) return;
    setActionId(payrollId);
    try {
      await fetch('/api/crm/nominas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', payrollId }),
      });
      await fetchData();
    } finally {
      setActionId(null);
    }
  };

  // KPI totals from stats
  const kpiPagada   = stats.find(s => s._id === 'PAGADA');
  const kpiAprobada = stats.find(s => s._id === 'APROBADA');
  const kpiBorrador = stats.find(s => s._id === 'BORRADOR');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-400" />
            Nómina y Salarios
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Crea y gestiona nóminas, programa pagos y registra desembolsos al equipo.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva Nómina
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Nóminas Pagadas',   value: kpiPagada?.count ?? 0,   amount: kpiPagada?.total ?? 0,   icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Por Pagar',          value: kpiAprobada?.count ?? 0, amount: kpiAprobada?.total ?? 0, icon: Send,        color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'En Borrador',        value: kpiBorrador?.count ?? 0, amount: kpiBorrador?.total ?? 0, icon: FileText,    color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20' },
          { label: 'Total Nóminas',      value: payrolls.length,          amount: payrolls.reduce((s, p) => s + p.totalNet, 0), icon: BarChart3, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border p-4 ${k.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <k.icon className={`w-4 h-4 ${k.color}`} />
              <span className="text-xs text-slate-400 font-medium">{k.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-slate-400 mt-1">{COP(k.amount)}</p>
          </div>
        ))}
      </div>

      {/* Payroll List */}
      {loading ? (
        <div className="flex justify-center h-40 items-center">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
        </div>
      ) : payrolls.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-slate-500">
          <CreditCard className="w-10 h-10 mb-2 opacity-30" />
          <p className="text-sm">No hay nóminas registradas. Crea la primera.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payrolls.map(payroll => {
            const st = STATUS_MAP[payroll.status];
            const next = NEXT_STATUS[payroll.status];
            const isExpanded = expandedId === payroll._id;
            const isActing = actionId === payroll._id;

            return (
              <div key={payroll._id} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden hover:border-slate-600/60 transition-all">
                {/* Header Row */}
                <div className="flex items-center gap-4 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-bold text-white">{payroll.periodLabel}</span>
                      <span className="text-xs text-slate-500 font-mono">{payroll.code}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold border ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {payroll.employeeCount} empleados</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Pago: {payroll.payDate}</span>
                      <span className="flex items-center gap-1 text-white font-semibold"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {COP(payroll.totalNet)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {next && (
                      <button
                        onClick={() => updateStatus(payroll._id, next.next)}
                        disabled={isActing}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 ${next.color}`}
                      >
                        {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        {next.label}
                      </button>
                    )}
                    {payroll.status === 'BORRADOR' && (
                      <button
                        onClick={() => deletePayroll(payroll._id)}
                        disabled={isActing}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : payroll._id)}
                      className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 rounded-lg transition-all"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Detail: employee table */}
                {isExpanded && (
                  <div className="border-t border-slate-700/40 px-5 pb-5 pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detalle de empleados</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-700/40">
                            <th className="text-left pb-2 font-semibold">Nombre</th>
                            <th className="text-left pb-2 font-semibold">Cargo</th>
                            <th className="text-right pb-2 font-semibold">Salario Base</th>
                            <th className="text-right pb-2 font-semibold">Bonos</th>
                            <th className="text-right pb-2 font-semibold">Deducciones</th>
                            <th className="text-right pb-2 font-semibold text-emerald-400">Neto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/20">
                          {payroll.items.map((item, idx) => (
                            <tr key={idx} className="text-slate-300 hover:bg-slate-700/20">
                              <td className="py-2 font-medium text-white">{item.employeeName}</td>
                              <td className="py-2 text-slate-400">{item.role}</td>
                              <td className="py-2 text-right tabular-nums">{COP(item.baseSalary)}</td>
                              <td className="py-2 text-right tabular-nums text-emerald-400">+{COP(item.bonuses)}</td>
                              <td className="py-2 text-right tabular-nums text-red-400">-{COP(item.deductions)}</td>
                              <td className="py-2 text-right tabular-nums font-bold text-white">{COP(item.netPay)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-slate-700/40 font-bold text-white">
                            <td colSpan={5} className="pt-3 text-right text-slate-400 pr-4">Total Neto:</td>
                            <td className="pt-3 text-right text-emerald-400">{COP(payroll.totalNet)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {payroll.notes && (
                      <p className="mt-3 text-xs text-slate-400 bg-slate-900/40 border border-slate-700/30 rounded-lg p-2">
                        {payroll.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" /> Nueva Nómina
              </h2>
              <button onClick={() => setShowCreate(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Period & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Periodo (YYYY-MM)</label>
                  <input
                    type="month"
                    value={form.period}
                    onChange={e => {
                      const [y, m] = e.target.value.split('-');
                      setForm(f => ({
                        ...f,
                        period: e.target.value,
                        periodLabel: `${MONTHS[parseInt(m) - 1]} ${y}`,
                      }));
                    }}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Fecha de Pago</label>
                  <input
                    type="date"
                    value={form.payDate}
                    onChange={e => setForm(f => ({ ...f, payDate: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              {/* Add Employee */}
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agregar Empleado</p>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Nombre completo *" value={empForm.employeeName} onChange={e => setEmpForm(f => ({ ...f, employeeName: e.target.value }))}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
                  <input placeholder="Cargo" value={empForm.role} onChange={e => setEmpForm(f => ({ ...f, role: e.target.value }))}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
                  <input placeholder="Salario base (COP) *" type="number" value={empForm.baseSalary} onChange={e => setEmpForm(f => ({ ...f, baseSalary: e.target.value }))}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
                  <input placeholder="Bonos / Horas extra" type="number" value={empForm.bonuses} onChange={e => setEmpForm(f => ({ ...f, bonuses: e.target.value }))}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
                  <input placeholder="Deducciones (salud, pensión...)" type="number" value={empForm.deductions} onChange={e => setEmpForm(f => ({ ...f, deductions: e.target.value }))}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50" />
                  <button onClick={addEmployee} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold hover:bg-indigo-500/30 transition-all">
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>
              </div>

              {/* Employee List Preview */}
              {form.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-700/40">
                        <th className="text-left pb-2">Nombre</th>
                        <th className="text-right pb-2">Base</th>
                        <th className="text-right pb-2">Bonos</th>
                        <th className="text-right pb-2">Deducc.</th>
                        <th className="text-right pb-2 text-emerald-400">Neto</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/20">
                      {form.items.map((item, idx) => (
                        <tr key={idx} className="text-slate-300">
                          <td className="py-1.5 font-medium text-white">{item.employeeName}</td>
                          <td className="py-1.5 text-right tabular-nums">{COP(item.baseSalary)}</td>
                          <td className="py-1.5 text-right tabular-nums text-emerald-400">+{COP(item.bonuses)}</td>
                          <td className="py-1.5 text-right tabular-nums text-red-400">-{COP(item.deductions)}</td>
                          <td className="py-1.5 text-right tabular-nums font-bold text-white">{COP(item.netPay)}</td>
                          <td className="py-1.5 pl-2">
                            <button onClick={() => removeEmployee(idx)} className="text-slate-500 hover:text-red-400 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-700/40 font-bold">
                        <td colSpan={4} className="pt-2 text-right text-slate-400 pr-4 text-xs">Total Neto:</td>
                        <td className="pt-2 text-right text-emerald-400 text-sm">
                          {COP(form.items.reduce((s, i) => s + i.netPay, 0))}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">Notas (opcional)</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observaciones de la nómina..."
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 resize-none" />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">
                  Cancelar
                </button>
                <button
                  onClick={createPayroll}
                  disabled={!form.payDate || form.items.length === 0 || actionId === 'create'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionId === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Crear Nómina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
