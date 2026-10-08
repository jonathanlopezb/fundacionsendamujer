'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  DollarSign,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  CreditCard,
  Building,
  Calendar,
  FileText,
  Clock,
  Shield,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function CrmFinanzasPage() {
  const { user, can } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<'expenses' | 'payables' | 'payments'>('expenses');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<any>(null);

  const [formData, setFormData] = useState({
    category: 'MATERIALS',
    concept: '',
    providerName: '',
    providerNit: '',
    amount: '',
  });

  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'Transferencia Bancaria',
    reference: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resExp, resPay, resPmts] = await Promise.all([
        fetch('/api/crm/finance?view=expenses'),
        fetch('/api/crm/finance?view=payables'),
        fetch('/api/crm/finance?view=payments'),
      ]);

      if (resExp.ok) setExpenses((await resExp.json()).expenses || []);
      if (resPay.ok) setPayables((await resPay.json()).payables || []);
      if (resPmts.ok) setPayments((await resPmts.json()).payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'expense', ...formData }),
      });
      if (res.ok) {
        setExpenseModalOpen(false);
        setFormData({ category: 'MATERIALS', concept: '', providerName: '', providerNit: '', amount: '' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveExpense = async (expenseId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/crm/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'approve_expense', expenseId, decision }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'No se pudo procesar la aprobación');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayable) return;
    try {
      const res = await fetch('/api/crm/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'register_payment',
          accountPayableId: selectedPayable._id,
          ...paymentData,
        }),
      });
      if (res.ok) {
        setPaymentModalOpen(false);
        setSelectedPayable(null);
        setPaymentData({ amount: '', paymentMethod: 'Transferencia Bancaria', reference: '' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalExecuted = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPending = payables
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Finanzas Operativas & Gastos</h1>
          </div>
          <p className="text-xs text-slate-400">
            Control de presupuesto, solicitudes de gasto, cuentas por pagar y desembolsos institucionales.
          </p>
        </div>

        {can('finance.write') && (
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Gasto / Factura</span>
          </button>
        )}
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Total Ejecutado / Pagado</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{fmtCOP(totalExecuted)}</div>
            <span className="text-[11px] text-emerald-400 mt-0.5 block font-medium">Pagos soportados</span>
          </div>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Cuentas por Pagar Pendientes</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{fmtCOP(totalPending)}</div>
            <span className="text-[11px] text-amber-400 mt-0.5 block font-medium">Compromisos vigentes</span>
          </div>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Solicitudes en Revisión</span>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">
              {expenses.filter((e) => e.status === 'IN_REVIEW' || e.status === 'DRAFT').length}
            </div>
            <span className="text-[11px] text-purple-400 mt-0.5 block font-medium">Flujo de aprobación</span>
          </div>
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'expenses'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Gastos y Solicitudes ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payables')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'payables'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Cuentas por Pagar ({payables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'payments'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Comprobantes de Pago ({payments.length})</span>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando registros financieros...
          </div>
        ) : activeTab === 'expenses' ? (
          expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No hay gastos registrados aún.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Código / Concepto</th>
                    <th className="py-3.5 px-4">Proveedor</th>
                    <th className="py-3.5 px-4">Monto</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {expenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white text-[11px] block">{exp.expenseNumber}</span>
                        <span className="text-slate-300 text-xs">{exp.concept}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{exp.providerName || 'N/A'}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">{fmtCOP(exp.amount)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            exp.status === 'APPROVED'
                              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                              : exp.status === 'REJECTED'
                              ? 'bg-red-950/60 border border-red-800 text-red-300'
                              : 'bg-amber-950/60 border border-amber-800 text-amber-300'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {(can('finance.approve_basic') || can('finance.approve_high')) && exp.status === 'IN_REVIEW' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveExpense(exp._id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleApproveExpense(exp._id, 'REJECTED')}
                              className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded-lg text-[11px] font-medium"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'payables' ? (
          payables.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No hay cuentas por pagar registradas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Concepto / Obligación</th>
                    <th className="py-3.5 px-4">Total Obligación</th>
                    <th className="py-3.5 px-4">Saldo Pendiente</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {payables.map((pay) => (
                    <tr key={pay._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 text-white font-medium">{pay.concept}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{fmtCOP(pay.totalAmount)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{fmtCOP(pay.remainingAmount)}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {can('finance.write') && pay.status === 'PENDING' && (
                          <button
                            onClick={() => {
                              setSelectedPayable(pay);
                              setPaymentData({ ...paymentData, amount: pay.remainingAmount?.toString() || '' });
                              setPaymentModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                          >
                            <span>Pagar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          payments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No hay comprobantes de pago registrados.</div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {payments.map((pmt) => (
                <div key={pmt._id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div>
                    <span className="font-mono font-bold text-white text-xs block">{pmt.paymentNumber}</span>
                    <span className="text-[11px] text-slate-400">
                      Método: {pmt.paymentMethod} · Ref: {pmt.reference || 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Fecha: {new Date(pmt.createdAt).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono block">{fmtCOP(pmt.amount)}</span>
                    <span className="text-[10px] text-emerald-500 font-medium">Ejecutado</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Modal Nuevo Gasto ── */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Registrar Solicitud de Gasto</h2>
              <button onClick={() => setExpenseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Concepto del Gasto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Telas e insumos para taller CAM modistería"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monto (COP) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="600000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="MATERIALS">Materiales & Insumos</option>
                    <option value="SERVICES">Servicios Profesionales</option>
                    <option value="TRANSPORT">Transporte & Logística</option>
                    <option value="FOOD">Refrigerios & Alimentación</option>
                    <option value="RENT">Alquiler de Espacios</option>
                    <option value="OTHER">Otros Gastos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Proveedor</label>
                  <input
                    type="text"
                    placeholder="Textiles del Caribe S.A.S"
                    value={formData.providerName}
                    onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">NIT / Cédula</label>
                  <input
                    type="text"
                    placeholder="900123456-7"
                    value={formData.providerNit}
                    onChange={(e) => setFormData({ ...formData, providerNit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  Crear Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Registrar Pago ── */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Registrar Comprobante de Pago</h2>
              <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Concepto a Pagar</label>
                <div className="p-2.5 bg-slate-900 rounded-xl text-xs text-slate-300 font-medium border border-slate-800">
                  {selectedPayable?.concept}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monto a Pagar (COP) *</label>
                  <input
                    type="number"
                    required
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Medio</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Efectivo / Caja Menor">Efectivo / Caja Menor</option>
                    <option value="PSE / Nequi">PSE / Nequi / Daviplata</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">No. Referencia / Comprobante</label>
                <input
                  type="text"
                  placeholder="Ej. TR-994821"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Confirmar Desembolso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
