'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  CheckSquare,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  User,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function CrmTareasPage() {
  const { user, can } = useCrmAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine' | 'pending' | 'completed'>('all');

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

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'mine') return t.assignedToUserId === user?.id || t.assignedToUserId === (user as any)?._id;
    if (filter === 'pending') return t.status !== 'COMPLETED';
    if (filter === 'completed') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Centro de Tareas & Alertas Operativas</h1>
          </div>
          <p className="text-xs text-slate-400">
            Asignación de actividades, recordatorios de seguimiento y alertas tempranas de casos.
          </p>
        </div>

        {can('tasks.manage') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear Nueva Tarea</span>
          </button>
        )}
      </div>

      {/* ── Filter Buttons ── */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        {[
          { id: 'all', label: `Todas (${tasks.length})` },
          { id: 'mine', label: 'Mis Tareas' },
          { id: 'pending', label: `Pendientes (${tasks.filter((x) => x.status !== 'COMPLETED').length})` },
          { id: 'completed', label: `Completadas (${tasks.filter((x) => x.status === 'COMPLETED').length})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f.id
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Task List ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando tareas...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600 opacity-40 mb-2" />
            <p className="text-sm font-semibold text-slate-300">¡Todo al día!</p>
            <p className="text-xs text-slate-500">No hay tareas pendientes bajo este filtro.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((t) => {
              const isCompleted = t.status === 'COMPLETED';
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && !isCompleted;

              return (
                <div
                  key={t._id}
                  className={`p-4 bg-slate-900/80 border rounded-xl flex items-start justify-between gap-4 transition-all ${
                    isCompleted
                      ? 'border-slate-800/40 opacity-60'
                      : isOverdue
                      ? 'border-red-800/60 bg-red-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleTask(t._id, t.status)}
                      className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-700 text-slate-500 hover:border-emerald-500 hover:text-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                          {t.title}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border font-medium ${
                            t.priority === 'HIGH' || t.priority === 'CRITICAL'
                              ? 'bg-red-950/60 border-red-800 text-red-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span>Asignada: {t.assignedToName || 'Personal Senda'}</span>
                        {t.dueDate && (
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-bold' : ''}`}>
                            {isOverdue && <AlertTriangle className="w-3 h-3" />}
                            Vence: {new Date(t.dueDate).toLocaleDateString('es-CO')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal Nueva Tarea ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Crear Nueva Tarea</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Seguimiento psicosocial a participante CAS-2026-00012"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre lo que se debe realizar..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asignar a</label>
                  <select
                    value={formData.assignedToUserId}
                    onChange={(e) => setFormData({ ...formData, assignedToUserId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="">A mí mismo</option>
                    {usersList.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
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
