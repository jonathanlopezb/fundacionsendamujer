'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { CheckSquare, PlusCircle, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';

export default function CrmTareasPage() {
  const { user, can } = useCrmAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToUserId: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTasks, resUsers] = await Promise.all([
        fetch('/api/crm/tasks?filter=all'),
        fetch('/api/crm/users'),
      ]);
      if (resTasks.ok) setTasks((await resTasks.json()).tasks || []);
      if (resUsers.ok) setUsersList((await resUsers.json()).users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      const res = await fetch('/api/crm/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: nextStatus }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const selUser = usersList.find((u) => u._id === formData.assignedToUserId) || user;

    try {
      const res = await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assignedToUserId: selUser?._id || selUser?.id,
          assignedToName: selUser?.name,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({ title: '', description: '', assignedToUserId: '', priority: 'MEDIUM', dueDate: '' });
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
            <CheckSquare className="w-5 h-5 text-rose-400" />
            Centro de Tareas & Alertas Operativas
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Asignación de actividades, recordatorios de seguimiento y alertas tempranas de casos.
          </p>
        </div>

        {can('tasks.manage') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear Tarea</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs animate-pulse">Cargando tareas...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
            No hay tareas registradas.
          </div>
        ) : (
          tasks.map((t) => {
            const isCompleted = t.status === 'COMPLETED';

            return (
              <div
                key={t._id}
                className={`p-4 bg-slate-900 border rounded-2xl flex items-start justify-between gap-4 transition-all ${
                  isCompleted ? 'border-slate-800/60 opacity-60' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleTask(t._id, t.status)}
                    className={`mt-0.5 transition-colors ${isCompleted ? 'text-emerald-400' : 'text-slate-600 hover:text-emerald-400'}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <h3 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-300">{t.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Responsable: <strong className="text-slate-200">{t.assignedToName}</strong></span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <Clock className="w-3 h-3" />
                        Vence: {new Date(t.dueDate).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    t.priority === 'URGENT'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : t.priority === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Crear Tarea */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Nueva Tarea de Seguimiento
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Llamada de seguimiento caso legal CAS-2026-00012"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Instrucciones detalladas de la tarea..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsable *</label>
                  <select
                    value={formData.assignedToUserId}
                    onChange={(e) => setFormData({ ...formData, assignedToUserId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="">A mí mismo ({user?.name})</option>
                    {usersList.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fecha Límite *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
