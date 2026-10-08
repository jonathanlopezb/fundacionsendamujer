'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Users,
  FileHeart,
  HeartHandshake,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
  Calendar,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- Utilidades ---
const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  NEW:        { label: 'Nuevo',          color: 'text-blue-300',   bg: 'bg-blue-500/15 border-blue-500/25' },
  ASSESSMENT: { label: 'Valoración',     color: 'text-amber-300',  bg: 'bg-amber-500/15 border-amber-500/25' },
  PLAN:       { label: 'Plan de Acción', color: 'text-purple-300', bg: 'bg-purple-500/15 border-purple-500/25' },
  FOLLOW_UP:  { label: 'Seguimiento',    color: 'text-teal-300',   bg: 'bg-teal-500/15 border-teal-500/25' },
  REFERRAL:   { label: 'Remitido',       color: 'text-indigo-300', bg: 'bg-indigo-500/15 border-indigo-500/25' },
  CLOSED:     { label: 'Cerrado',        color: 'text-emerald-300',bg: 'bg-emerald-500/15 border-emerald-500/25' },
};

const CHART_COLORS = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];

// --- Sub-componentes ---
interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: { value: number; positive: boolean } | null;
  href?: string;
}

function KpiCard({ label, value, sub, icon: Icon, iconColor, iconBg, trend, href }: KpiCardProps) {
  const inner = (
    <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-700 transition-all h-full group relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">{label}</span>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-black text-white tracking-tight">{value}</div>
        {(sub || trend) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend && (
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend.value}%
              </span>
            )}
            {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e2534] border border-slate-700/60 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? fmtCOP(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// --- Página principal ---
export default function CrmDashboardPage() {
  const { user, can } = useCrmAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/dashboard');
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    const res = await fetch('/api/crm/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, status: nextStatus }),
    });
    if (res.ok) fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <div key={i} className="h-32 bg-slate-800/60 rounded-2xl border border-slate-800" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-800/60 rounded-2xl border border-slate-800" />
          <div className="h-80 bg-slate-800/60 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  const m = data?.metrics || {};
  const recentCases = data?.recentCases || [];
  const pendingTasks = data?.pendingTasks || [];

  // Datos sintéticos para gráficos cuando no hay datos reales (arranque del sistema)
  const monthlyData = data?.monthlyTrend || [
    { mes: 'May', casos: 0, personas: 0, donaciones: 0 },
    { mes: 'Jun', casos: 0, personas: 0, donaciones: 0 },
    { mes: 'Jul', casos: 0, personas: 0, donaciones: 0 },
    { mes: 'Ago', casos: 0, personas: 0, donaciones: 0 },
    { mes: 'Sep', casos: 0, personas: 0, donaciones: 0 },
    { mes: 'Oct', casos: m.activeCases || 0, personas: m.totalPeople || 0, donaciones: m.totalDonationsAmount || 0 },
  ];

  const caseTypeData = data?.casesByType || [
    { name: 'VBG', value: 0 },
    { name: 'Desplazamiento', value: 0 },
    { name: 'Jurídico', value: 0 },
    { name: 'Psicosocial', value: 0 },
    { name: 'Económico', value: 0 },
  ];

  const hasAnyCase = recentCases.length > 0;
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Buenos días' : today.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches';
  const firstName = user?.name?.split(' ')[0] || 'Usuaria';

  return (
    <div className="space-y-6">
      {/* ── Cabecera ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Panel de Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {greeting}, <span className="text-rose-400">{firstName}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Sistema Operativo Social · Fundación Senda Mujer
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {can('people.write') && (
            <Link href="/crm/personas" className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/25 transition-all hover:scale-105">
              <PlusCircle className="w-3.5 h-3.5" />
              Registrar Persona
            </Link>
          )}
          {can('cases.write') && (
            <Link href="/crm/casos" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-105">
              <FileHeart className="w-3.5 h-3.5" />
              Abrir Caso
            </Link>
          )}
          {can('donations.write') && (
            <Link href="/crm/donantes" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all hover:scale-105">
              <HeartHandshake className="w-3.5 h-3.5" />
              Registrar Donación
            </Link>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Mujeres Atendidas"
          value={m.totalPeople || 0}
          sub="base única con Habeas Data"
          icon={Users}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border border-rose-500/20"
          href="/crm/personas"
        />
        <KpiCard
          label="Casos Activos"
          value={m.activeCases || 0}
          sub={m.criticalCases > 0 ? `${m.criticalCases} de alta prioridad` : 'atención al día'}
          icon={FileHeart}
          iconColor={m.criticalCases > 0 ? 'text-red-400' : 'text-indigo-400'}
          iconBg={m.criticalCases > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-indigo-500/10 border border-indigo-500/20'}
          trend={m.criticalCases > 0 ? { value: m.criticalCases, positive: false } : null}
          href="/crm/casos"
        />
        <KpiCard
          label="Donaciones COP"
          value={fmtCOP(m.totalDonationsAmount || 0)}
          sub={`${m.totalDonationsCount || 0} aportes confirmados`}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
          href="/crm/donantes"
        />
        <KpiCard
          label="Ayudas Entregadas"
          value={m.totalAidsDelivered || 0}
          sub={`${m.completedOperations || 0} jornadas territoriales`}
          icon={Package}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border border-amber-500/20"
          href="/crm/activos"
        />
      </div>

      {/* ── Gráficos Fila 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendencia Mensual */}
        <div className="lg:col-span-2 bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Actividad Mensual
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Personas, casos y donaciones por mes</p>
            </div>
            <Link href="/crm/impacto" className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
              Ver impacto <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gCasos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPersonas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="personas" name="Personas" stroke="#8b5cf6" fill="url(#gPersonas)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="casos" name="Casos" stroke="#f43f5e" fill="url(#gCasos)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Casos por Tipo */}
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Tipos de Casos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Distribución por categoría</p>
          </div>
          {caseTypeData.every((d: any) => d.value === 0) ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600 text-xs text-center">
              <FileHeart className="w-10 h-10 mb-2 opacity-30" />
              <span>Los datos aparecerán al registrar casos</span>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={caseTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {caseTypeData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {caseTypeData.map((d: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-white font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Expedientes recientes + Tareas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expedientes recientes */}
        <div className="lg:col-span-2 bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-4 mb-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileHeart className="w-4 h-4 text-rose-400" />
              Expedientes Recientes
            </h2>
            <Link href="/crm/casos" className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!hasAnyCase ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-600 text-center">
              <FileHeart className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium text-slate-500">No hay expedientes registrados</p>
              <p className="text-xs text-slate-600 mt-1">Los casos aparecerán aquí en tiempo real</p>
              {can('cases.write') && (
                <Link href="/crm/casos" className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/20 transition-all">
                  <PlusCircle className="w-3.5 h-3.5" /> Registrar primer caso
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {recentCases.map((c: any) => {
                const st = STATUS_LABELS[c.status] || { label: c.status, color: 'text-slate-300', bg: 'bg-slate-800 border-slate-700' };
                return (
                  <Link
                    key={c._id}
                    href={`/crm/casos/${c._id}`}
                    className="flex items-center gap-4 p-3.5 bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/60 hover:border-slate-700/60 rounded-xl transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white font-mono">{c.caseNumber}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{c.type}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{c.openingReason}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-slate-500 block">{c.responsibleUserName || 'Asignado'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-rose-400 mt-0.5 ml-auto transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Mis Tareas */}
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-4 mb-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mis Tareas
            </h2>
            <Link href="/crm/tareas" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
              Ver todas <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mb-2" />
              <p className="text-sm font-medium text-slate-500">¡Sin tareas pendientes!</p>
              <p className="text-xs text-slate-600 mt-1">Buen trabajo, todo al día.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTasks.map((t: any) => {
                const isOverdue = t.dueDate && new Date(t.dueDate) < new Date();
                return (
                  <div
                    key={t._id}
                    className="flex items-start gap-3 p-3 bg-slate-900/50 border border-slate-800/60 rounded-xl"
                  >
                    <button
                      onClick={() => handleToggleTask(t._id, t.status)}
                      className="mt-0.5 text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0"
                      title="Marcar completada"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{t.title}</p>
                      {t.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                      )}
                      <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-medium ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                        {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>
                          {t.dueDate ? new Date(t.dueDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : 'Sin fecha límite'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Accesos Rápidos Institucionales ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/crm/programas',   icon: TrendingUp,     label: 'Programas',  sub: 'CAM · THEMIS',       color: 'text-violet-400',  bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20' },
          { href: '/crm/voluntarios', icon: HeartHandshake, label: 'Voluntarios',sub: 'Gestionar equipo',   color: 'text-pink-400',    bg: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20' },
          { href: '/crm/impacto',     icon: BarChart3,      label: 'Impacto',    sub: 'Métricas sociales',  color: 'text-cyan-400',    bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20' },
          { href: '/crm/configuracion',icon: Calendar,      label: 'Usuarios',   sub: 'Roles y accesos',    color: 'text-amber-400',   bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${item.bg}`}>
              <div className={`${item.color} flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xs font-bold ${item.color}`}>{item.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
