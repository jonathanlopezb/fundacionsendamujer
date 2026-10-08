'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Users,
  FileHeart,
  HeartHandshake,
  CalendarDays,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Package,
} from 'lucide-react';

export default function CrmDashboardPage() {
  const { user, can } = useCrmAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error al cargar datos de dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      const res = await fetch('/api/crm/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: nextStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-900 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="h-72 bg-slate-900 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentCases = data?.recentCases || [];
  const pendingTasks = data?.pendingTasks || [];

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Panel de Control Institucional
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bienvenid@, <span className="text-rose-400 font-semibold">{user?.name}</span> · Rol activo:{' '}
            <span className="text-slate-200 font-medium">{user?.role}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {can('people.write') && (
            <Link
              href="/crm/personas"
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Registrar Persona</span>
            </Link>
          )}
          {can('cases.write') && (
            <Link
              href="/crm/casos"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <FileHeart className="w-3.5 h-3.5" />
              <span>Abrir Caso</span>
            </Link>
          )}
          {can('donations.write') && (
            <Link
              href="/crm/donantes"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Registrar Donación</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Personas Atendidas */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Mujeres & Participantes</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{metrics.totalPeople || 0}</div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Base única con Habeas Data
            </p>
          </div>
        </div>

        {/* Casos Activos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Casos en Acompañamiento</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{metrics.activeCases || 0}</div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              {metrics.criticalCases > 0 ? (
                <span className="text-red-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {metrics.criticalCases} casos de alta prioridad
                </span>
              ) : (
                <span className="text-emerald-400">Atención multidisciplinaria al día</span>
              )}
            </p>
          </div>
        </div>

        {/* Recaudación & Donaciones COP */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Donaciones Recaudadas</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">
              ${(metrics.totalDonationsAmount || 0).toLocaleString('es-CO')} <span className="text-xs text-slate-400 font-normal">COP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {metrics.totalDonationsCount || 0} aportes confirmados
            </p>
          </div>
        </div>

        {/* Ayudas Humanitarias & Operaciones */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Ayudas & Dotaciones</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{metrics.totalAidsDelivered || 0}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {metrics.completedOperations || 0} jornadas territoriales realizadas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Casos Recientes & Mis Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Casos Recientes */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileHeart className="w-4 h-4 text-rose-400" />
                Expedientes y Casos Recientes
              </h2>
              <Link
                href="/crm/casos"
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Ver todos</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentCases.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No hay casos registrados aún. Registra el primer expediente desde el botón superior.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentCases.map((c: any) => {
                  const statusColors: Record<string, string> = {
                    NEW: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
                    ASSESSMENT: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
                    PLAN: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
                    FOLLOW_UP: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
                    REFERRAL: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
                    CLOSED: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
                  };

                  return (
                    <Link
                      key={c._id}
                      href={`/crm/casos/${c._id}`}
                      className="p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 transition-all group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{c.caseNumber}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${statusColors[c.status] || 'bg-slate-800 text-slate-300'}`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{c.type}</span>
                        </div>
                        <p className="text-xs text-slate-300 truncate mt-1">{c.openingReason}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] text-slate-400 block">{c.responsibleUserName || 'Asignado'}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tareas Pendientes */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Mis Tareas & Alertas
              </h2>
              <Link
                href="/crm/tareas"
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Ver todas</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No tienes tareas pendientes por el momento. ¡Buen trabajo!
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.map((t: any) => (
                  <div
                    key={t._id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start gap-2.5"
                  >
                    <button
                      onClick={() => handleToggleTask(t._id, t.status)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200">{t.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Vence: {new Date(t.dueDate).toLocaleDateString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
