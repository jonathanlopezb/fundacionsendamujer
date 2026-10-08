'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { DollarSign, PlusCircle, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';

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
          expenseId: selectedPayable.expenseId,
          providerName: selectedPayable.providerName,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          reference: paymentData.reference,
        }),
      });
      if (res.ok) {
        setPaymentModalOpen(false);
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
            <DollarSign className="w-5 h-5 text-rose-400" />
            Finanzas Operativas & Ejecución Presupuestal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Flujo de gastos, cadena de aprobación por montos y conciliación de cuentas por pagar.
          </p>
        </div>

        {can('finance.write') && (
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'expenses' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Gastos y Aprobaciones ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('payables')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'payables' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Cuentas por Pagar ({payables.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'payments' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pagos Realizados ({payments.length})
        </button>
      </div>

      {activeTab === 'expenses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Código</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Proveedor</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Registrado Por</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-rose-400">{exp.expenseNumber}</td>
                    <td className="p-3 font-semibold text-white">
                      {exp.concept} <span className="text-[10px] text-slate-400 block font-normal">{exp.category}</span>
                    </td>
                    <td className="p-3 text-slate-300">{exp.providerName}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ${Number(exp.amount).toLocaleString('es-CO')} COP
                    </td>
                    <td className="p-3 text-slate-400">{exp.responsibleUserName}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          exp.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : exp.status === 'PAID'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : exp.status === 'REJECTED'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {exp.status === 'IN_REVIEW' && (can('finance.approve_basic') || can('finance.approve_high')) && (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleApproveExpense(exp._id, 'APPROVED')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleApproveExpense(exp._id, 'REJECTED')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold"
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
        </div>
      )}

      {activeTab === 'payables' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Proveedor</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Saldo Pendiente</th>
                  <th className="p-3">Vencimiento</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payables.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{pay.providerName}</td>
                    <td className="p-3 text-slate-300">{pay.concept}</td>
                    <td className="p-3 font-mono">${Number(pay.totalAmount).toLocaleString('es-CO')}</td>
                    <td className="p-3 font-mono font-bold text-rose-400">${Number(pay.remainingAmount).toLocaleString('es-CO')}</td>
                    <td className="p-3 text-slate-400">{new Date(pay.dueDate).toLocaleDateString('es-CO')}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {pay.remainingAmount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedPayable(pay);
                            setPaymentData({ ...paymentData, amount: String(pay.remainingAmount) });
                            setPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registrar Gasto */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Registrar Gasto Operativo
              </h2>
              <button onClick={() => setExpenseModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="MATERIALS">Materiales e Insumos CAM</option>
                  <option value="HONORARIOS">Honorarios Profesionales</option>
                  <option value="TRANSPORTE">Transporte y Logística</option>
                  <option value="ALIMENTACION">Alimentación y Refrigerios</option>
                  <option value="MEDICAMENTOS">Salud y Medicamentos</option>
                  <option value="DOTACION">Dotación y Ayudas</option>
                  <option value="OTROS">Otros Gastos Operativos</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Concepto Detallado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Telas e hilos para taller de costura Mandela"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Proveedor / Beneficiario *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Distribuidora Textil Caribe"
                    value={formData.providerName}
                    onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monto COP *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 450000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setExpenseModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  Enviar a Revisión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {paymentModalOpen && selectedPayable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Registrar Pago a Proveedor
              </h2>
              <button onClick={() => setPaymentModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1">
                <div>Proveedor: <strong className="text-white">{selectedPayable.providerName}</strong></div>
                <div>Concepto: <span className="text-slate-300">{selectedPayable.concept}</span></div>
                <div>Saldo Pendiente: <strong className="text-rose-400 font-mono">${Number(selectedPayable.remainingAmount).toLocaleString('es-CO')} COP</strong></div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monto a Pagar *</label>
                <input
                  type="number"
                  required
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medio de Pago</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Transferencia Bancaria Bancolombia">Transferencia Bancaria Bancolombia</option>
                  <option value="Efectivo de Caja Menor">Efectivo de Caja Menor</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Comprobante / Referencia</label>
                <input
                  type="text"
                  placeholder="Ej. Aprobación #987654"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setPaymentModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 font-bold text-white rounded-xl">
                  Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
