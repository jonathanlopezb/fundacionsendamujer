'use client';

/**
 * ObservatorioPublico — Tablero público del Observatorio Caribe Seguro
 *
 * Visualiza los datos AGREGADOS y ANONIMIZADOS aprobados por el responsable de datos.
 * Sigue las reglas del Blueprint cap. 9:
 * - Solo datos generados automáticamente por el sistema
 * - Lógica output / outcome / impact (Blueprint cap. 14)
 * - Aviso explícito de que las cifras son reales del sistema
 * - Si no hay datos aprobados, muestra el estado vacío con honestidad
 */

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Area, AreaChart,
} from 'recharts';
import {
  Users, TrendingUp, MapPin, Clock, CheckCircle2,
  Shield, BookOpen, Heart, BarChart3, Info, Loader2, Activity
} from 'lucide-react';

interface ObservatoryMetrics {
  mujeresAcompanadaTotal: number | null;
  nuevosIngresosEnPeriodo: number | null;
  citasRealizadas: number | null;
  rutasActivadas: number | null;
  talleresRealizados: number | null;
  planesProteccionCompletados: number | null;
  mujeresCon1ContactoSeguimiento: number | null;
  rutasInstitucionales: number | null;
  mejoraPromedioIPSC_30d: number | null;
  mejoraPromedioIPSC_90d: number | null;
  tiempoPromedioOrientacionHoras: number | null;
  municipiosPresenciaActiva: string[];
  dimensionMasFortalecida: string | null;
  dimensionMasDebil: string | null;
}

interface SnapshotData {
  period: string;
  periodType: string;
  publishedAt: string;
  metrics: ObservatoryMetrics;
  publicationNotes: string;
}

interface HistoricalPoint {
  period: string;
  mejora90d: number | null;
  mujeres: number | null;
}

const SENDA_COLORS = {
  pink: '#E12880',
  purple: '#52166F',
  deepPurple: '#3B0852',
  amber: '#F7A623',
  emerald: '#10B981',
};

function MetricCard({
  icon, label, value, unit, level, color, sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
  unit?: string;
  level: 'output' | 'outcome' | 'impact';
  color: string;
  sublabel?: string;
}) {
  const levelConfig = {
    output: { badge: 'OUTPUT', bg: 'bg-slate-100 text-slate-600' },
    outcome: { badge: 'OUTCOME', bg: 'bg-blue-100 text-blue-700' },
    impact: { badge: 'IMPACTO', bg: 'bg-purple-100 text-purple-700' },
  };

  const cfg = levelConfig[level];

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5" style={{ background: color, transform: 'translate(30%, -30%)' }} />
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${cfg.bg}`}>
          {cfg.badge}
        </span>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
        {value !== null ? (
          <p className="text-3xl font-black mt-0.5" style={{ color }}>
            {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
            {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
          </p>
        ) : (
          <p className="text-lg font-bold text-slate-300 mt-1">Dato en procesamiento</p>
        )}
        {sublabel && <p className="text-[10px] text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

function EmptyObservatory() {
  return (
    <div className="bg-white rounded-3xl border border-pink-100 p-10 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto">
        <BarChart3 className="w-8 h-8 text-[#52166F]" />
      </div>
      <h3 className="text-xl font-black text-[#52166F]">Observatorio en Construcción</h3>
      <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
        El Observatorio Caribe Seguro publica únicamente datos reales generados por el sistema, aprobados por el responsable de datos de la Fundación. Los primeros datos aparecerán cuando el sistema haya acumulado mediciones suficientes.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 text-left space-y-1 max-w-md mx-auto">
        <p className="font-extrabold">Regla Transparencia del Observatorio:</p>
        <p>Toda cifra publicada se origina en el sistema de datos. El equipo nunca estima ni redondea cifras de impacto para fines de comunicación.</p>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
interface ObservatorioPublicoProps {
  showHeader?: boolean;
}

export default function ObservatorioPublico({ showHeader = true }: ObservatorioPublicoProps) {
  const [latest, setLatest] = useState<SnapshotData | null>(null);
  const [historical, setHistorical] = useState<HistoricalPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/caribe-seguro/observatory/public');
        const data = await res.json();
        if (data.success) {
          setLatest(data.latest);
          setHistorical(data.historicalIPSC || []);
        }
      } catch (err) {
        console.error('Observatory error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Cargando datos del Observatorio...</span>
      </div>
    );
  }

  const m = latest?.metrics;

  // Datos para la gráfica de actividad (output)
  const outputData = m
    ? [
        { name: 'Mujeres\nacompañadas', value: m.mujeresAcompanadaTotal ?? 0, color: SENDA_COLORS.pink },
        { name: 'Citas\nrealizadas', value: m.citasRealizadas ?? 0, color: SENDA_COLORS.purple },
        { name: 'Rutas\nactivadas', value: m.rutasActivadas ?? 0, color: SENDA_COLORS.amber },
        { name: 'Talleres', value: m.talleresRealizados ?? 0, color: SENDA_COLORS.emerald },
      ]
    : [];

  return (
    <div className="space-y-8">

      {showHeader && (
        <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-40 h-40 rounded-full border-2 border-white" />
            <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full border border-white" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-amber-400 text-[#3B0852] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" /> CARIBE SEGURO
              </span>
              <span className="bg-white/10 text-pink-100 text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                Datos 100% Reales del Sistema
              </span>
              {latest && (
                <span className="bg-white/10 text-pink-100 text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                  Periodo: {latest.period} • Publicado:{' '}
                  {new Date(latest.publishedAt).toLocaleDateString('es-CO')}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black">Observatorio Caribe Seguro</h2>
            <p className="text-pink-200 text-sm max-w-2xl">
              Datos agregados y anonimizados del impacto del programa de protección de Fundación Senda Mujer en Cartagena de Indias. Todas las cifras son generadas automáticamente por el sistema y aprobadas por el responsable de datos.
            </p>
          </div>
        </div>
      )}

      {!latest ? (
        <EmptyObservatory />
      ) : (
        <>
          {/* OUTPUT — ¿Qué hicimos? */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <h3 className="text-base font-extrabold text-slate-700 uppercase tracking-wide text-xs">
                Output — ¿Qué hicimos?
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard icon={<Users className="w-5 h-5" />} label="Mujeres acompañadas" value={m!.mujeresAcompanadaTotal} unit="mujeres" level="output" color={SENDA_COLORS.pink} sublabel="Total en el periodo" />
              <MetricCard icon={<Activity className="w-5 h-5" />} label="Citas realizadas" value={m!.citasRealizadas} unit="citas" level="output" color={SENDA_COLORS.purple} />
              <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Rutas activadas" value={m!.rutasActivadas} unit="rutas" level="output" color={SENDA_COLORS.amber} />
              <MetricCard icon={<BookOpen className="w-5 h-5" />} label="Talleres realizados" value={m!.talleresRealizados} unit="talleres" level="output" color={SENDA_COLORS.emerald} />
            </div>

            {outputData.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
                <h4 className="text-sm font-extrabold text-[#52166F] mb-4">Actividad del Periodo</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={outputData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                      cursor={{ fill: '#F8F4FB' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {outputData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* OUTCOME — ¿Qué cambió? */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <h3 className="text-base font-extrabold text-slate-700 uppercase tracking-wide text-xs">
                Outcome — ¿Qué cambió?
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} label="Planes de protección completados" value={m!.planesProteccionCompletados} level="outcome" color={SENDA_COLORS.pink} sublabel="Beneficiarias con plan completo" />
              <MetricCard icon={<Clock className="w-5 h-5" />} label="Tiempo promedio hasta primera orientación" value={m!.tiempoPromedioOrientacionHoras} unit="horas" level="outcome" color={SENDA_COLORS.purple} sublabel="Desde contacto inicial" />
              <MetricCard icon={<Heart className="w-5 h-5" />} label="Derivaciones a instituciones" value={m!.rutasInstitucionales} unit="casos" level="outcome" color={SENDA_COLORS.amber} sublabel="Casa Refugio Violeta, Comisarías, ICBF" />
            </div>
          </section>

          {/* IMPACT — ¿Qué se transformó? */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600" />
              <h3 className="text-base font-extrabold text-slate-700 uppercase tracking-wide text-xs">
                Impacto — ¿Qué se transformó?
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Mejora promedio IPSC (30 días)" value={m!.mejoraPromedioIPSC_30d !== null ? `+${m!.mejoraPromedioIPSC_30d!.toFixed(1)}` : null} unit="puntos" level="impact" color={SENDA_COLORS.pink} sublabel="Promedio en las 10 dimensiones" />
              <MetricCard icon={<Shield className="w-5 h-5" />} label="Mejora promedio IPSC (90 días)" value={m!.mejoraPromedioIPSC_90d !== null ? `+${m!.mejoraPromedioIPSC_90d!.toFixed(1)}` : null} unit="puntos" level="impact" color={SENDA_COLORS.purple} sublabel="Índice de Protección Senda-Caribe" />
              <MetricCard icon={<MapPin className="w-5 h-5" />} label="Municipios con presencia activa" value={m!.municipiosPresenciaActiva.length || null} level="impact" color={SENDA_COLORS.amber} sublabel={m!.municipiosPresenciaActiva.join(', ') || ''} />
            </div>

            {/* Tendencia histórica del IPSC */}
            {historical.length >= 2 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#52166F]">Evolución del Impacto — Mejora IPSC a 90 días</h4>
                    <p className="text-xs text-slate-400">Promedio histórico de mejora del Índice de Protección</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={historical.map((h) => ({ periodo: h.period, mejora: h.mejora90d ?? 0 }))}>
                    <defs>
                      <linearGradient id="obsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={SENDA_COLORS.purple} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={SENDA_COLORS.purple} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="mejora" stroke={SENDA_COLORS.purple} strokeWidth={2.5} fill="url(#obsGrad)" dot={{ r: 4, fill: SENDA_COLORS.purple }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Dimensiones destacadas */}
            {(m!.dimensionMasFortalecida || m!.dimensionMasDebil) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {m!.dimensionMasFortalecida && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wide">Dimensión más fortalecida</p>
                    <p className="font-black text-emerald-900 text-base">{m!.dimensionMasFortalecida}</p>
                    <p className="text-xs text-emerald-600">Mayor mejora promedio en el periodo</p>
                  </div>
                )}
                {m!.dimensionMasDebil && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wide">Dimensión con más oportunidad</p>
                    <p className="font-black text-amber-900 text-base">{m!.dimensionMasDebil}</p>
                    <p className="text-xs text-amber-600">Requiere atención prioritaria del programa</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Notas de publicación */}
          {latest.publicationNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-semibold">{latest.publicationNotes}</p>
            </div>
          )}
        </>
      )}

      {/* Pie con transparencia */}
      <div className="text-center text-[10px] text-slate-400 space-y-1 pt-2 border-t border-slate-100">
        <p>Datos generados automáticamente por el sistema. Aprobados por responsable de datos antes de publicación.</p>
        <p>Ninguna cifra es estimada o redondeada manualmente. Solo datos reales del programa de la Fundación.</p>
        <p className="font-bold text-slate-500">Fundación Senda Mujer — Cartagena de Indias, Colombia · Ley 1581/2012 Habeas Data</p>
      </div>
    </div>
  );
}
