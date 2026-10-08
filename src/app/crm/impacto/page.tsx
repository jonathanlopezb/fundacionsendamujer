'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Award,
  HeartHandshake,
  CheckCircle2,
  Package,
  Sparkles,
  TrendingUp,
  Download,
  ShieldCheck,
  Target,
} from 'lucide-react';
import {
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

const CHART_COLORS = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];

export default function CrmImpactoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      try {
        setLoading(true);
        const res = await fetch('/api/crm/impact');
        if (res.ok) {
          const json = await res.json();
          setData(json.impact);
        }
      } catch (err) {
        console.error('Error al cargar impacto:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchImpact();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-800 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-800/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const camLines = (data?.camEnrollmentsByLine || []).map((l: any) => ({
    name: l._id || 'General',
    total: l.total,
  }));
  const aidTypes = (data?.aidDeliveriesByType || []).map((a: any) => ({
    name: a._id || 'Kit General',
    total: a.total,
  }));
  const casesOutcome = data?.casesByOutcome || [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Observatorio de Impacto Social & Autonomía</h1>
          </div>
          <p className="text-xs text-slate-400">
            Métricas consolidadas anonimizadas para rendición de cuentas a cooperantes y juntas directivas.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Imprimir / Exportar Reporte</span>
        </button>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mujeres Acompañadas</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{data?.totalWomenServed || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Base única con Habeas Data
          </p>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Horas de Voluntariado</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{data?.volunteering?.totalHours || 0} hrs</div>
          <p className="text-[11px] text-slate-500 mt-1">Aportadas por voluntarias comunitarias</p>
        </div>

        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Casos con Resolución</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {casesOutcome.reduce((acc: number, c: any) => acc + c.total, 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Acompañamiento integral culminado</p>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución Líneas CAM */}
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" />
                Participación por Línea Productiva CAM
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Centro de Apoyo a la Mujer</p>
            </div>
          </div>

          {camLines.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">No hay datos de inscripción todavía.</p>
          ) : (
            <div className="space-y-3">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={camLines} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2534', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="total" name="Inscritas" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {camLines.map((line: any) => (
                  <div key={line.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{line.name}</span>
                    <span className="text-white font-mono font-bold">{line.total} participantes</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Distribución Ayudas y Kits */}
        <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                Dotaciones y Ayudas Entregadas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Kits de emprendimiento y asistencia</p>
            </div>
          </div>

          {aidTypes.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center">No hay entregas registradas todavía.</p>
          ) : (
            <div className="space-y-3">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={aidTypes} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                    {aidTypes.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2534', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {aidTypes.map((aid: any, i: number) => (
                  <div key={aid.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-slate-300 font-medium">{aid.name}</span>
                    </div>
                    <span className="text-white font-mono font-bold">{aid.total} entregas</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
