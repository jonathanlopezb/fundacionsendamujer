'use client';

/**
 * IPSCRadarChart — Gráfica de araña de las 10 dimensiones del IPSC
 * IPSCTrajectoryChart — Línea de evolución longitudinal del IPSC total
 *
 * Construidos con recharts sobre los patrones de visualización del Blueprint cap. 7.2:
 * - Siempre muestra TRAYECTORIA (cambio entre momentos), nunca etiqueta fija
 * - La paleta de colores usa el sistema de diseño de Senda Mujer
 */

import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Tipos ───────────────────────────────────────────────────────────────────
interface DimensionScore {
  key: string;
  label: string;
  score: number;
  previousScore?: number;
}

interface MeasurementPoint {
  period: string;
  ipscTotal: number;
  label?: string;
}

// ── RADAR CHART ──────────────────────────────────────────────────────────────
const DIMENSION_LABELS: Record<string, string> = {
  seguridadFisica: 'Seg. Física',
  seguridadDigital: 'Seg. Digital',
  autonomiaEconomica: 'Autonomía Ec.',
  redDeApoyo: 'Red de Apoyo',
  accesoAJusticia: 'Justicia',
  accesoASalud: 'Salud',
  bienestarPsicosocial: 'Bienestar',
  conocimientoDerechos: 'Derechos',
  capacidadRespuesta: 'Capacidad',
  continuidadAcompanamiento: 'Continuidad',
};

interface IPSCRadarChartProps {
  dimensions: Record<string, { score: number }>;
  previousDimensions?: Record<string, { score: number }> | null;
  period?: string;
}

export function IPSCRadarChart({ dimensions, previousDimensions, period }: IPSCRadarChartProps) {
  const data = Object.entries(DIMENSION_LABELS).map(([key, label]) => ({
    subject: label,
    actual: dimensions[key]?.score ?? 0,
    anterior: previousDimensions ? (previousDimensions[key]?.score ?? 0) : undefined,
    fullMark: 10,
  }));

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E12880]">PERFIL IPSC</span>
          <h4 className="text-base font-black text-[#52166F]">10 Dimensiones de Protección</h4>
          {period && <p className="text-xs text-slate-400">{period}</p>}
        </div>
        {previousDimensions && (
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-[#E12880] inline-block" /> Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-purple-300 inline-block" /> Anterior</span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fontSize: 9, fill: '#94A3B8' }}
            tickCount={6}
          />
          {previousDimensions && (
            <Radar
              name="Anterior"
              dataKey="anterior"
              stroke="#C084FC"
              fill="#C084FC"
              fillOpacity={0.15}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          )}
          <Radar
            name="Actual"
            dataKey="actual"
            stroke="#E12880"
            fill="#E12880"
            fillOpacity={0.25}
            strokeWidth={2.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── TRAJECTORY LINE CHART ────────────────────────────────────────────────────
interface IPSCTrajectoryChartProps {
  measurements: MeasurementPoint[];
  beneficiaryCode?: string;
}

const PERIOD_LABELS: Record<string, string> = {
  ingreso: 'Ingreso',
  '30d': 'Día 30',
  '90d': 'Día 90',
  '180d': 'Día 180',
  seguimiento_especial: 'Seg. Esp.',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white border border-pink-200 rounded-xl px-4 py-3 shadow-lg text-xs">
        <p className="font-extrabold text-[#52166F]">{label}</p>
        <p className={`font-black text-lg ${val >= 7 ? 'text-emerald-600' : val >= 4 ? 'text-amber-500' : 'text-red-600'}`}>
          {val.toFixed(1)}<span className="text-slate-400 font-normal text-xs">/10</span>
        </p>
      </div>
    );
  }
  return null;
};

export function IPSCTrajectoryChart({ measurements, beneficiaryCode }: IPSCTrajectoryChartProps) {
  const data = measurements.map((m) => ({
    name: PERIOD_LABELS[m.period] || m.period,
    ipsc: m.ipscTotal,
  }));

  const first = data[0]?.ipsc ?? 0;
  const last = data[data.length - 1]?.ipsc ?? 0;
  const delta = last - first;

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">TRAYECTORIA LONGITUDINAL</span>
          <h4 className="text-base font-black text-[#52166F]">Evolución del Índice IPSC</h4>
          {beneficiaryCode && (
            <p className="text-xs text-slate-400 font-mono">Código: {beneficiaryCode}</p>
          )}
        </div>
        {data.length >= 2 && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${
            delta > 0
              ? 'bg-emerald-100 text-emerald-800'
              : delta < 0
              ? 'bg-red-100 text-red-800'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {delta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {delta > 0 ? '+' : ''}{delta.toFixed(1)} pts
          </div>
        )}
      </div>

      {data.length < 2 ? (
        <div className="h-44 flex items-center justify-center text-slate-400 text-sm">
          Se necesitan al menos 2 mediciones para mostrar la trayectoria.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ipscGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E12880" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E12880" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} ticks={[0, 2, 4, 6, 8, 10]} />
            <Tooltip content={<CustomTooltip />} />
            {/* Zona óptima de protección */}
            <ReferenceLine y={7} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5}
              label={{ value: 'Zona protección', position: 'insideTopRight', fontSize: 9, fill: '#10B981' }}
            />
            <Area
              type="monotoneX"
              dataKey="ipsc"
              stroke="#E12880"
              strokeWidth={3}
              fill="url(#ipscGradient)"
              dot={{ fill: '#E12880', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <p className="text-[10px] text-slate-400 text-center italic">
        El IPSC mide trayectoria del programa, no predice eventos. Supervisión profesional siempre requerida.
      </p>
    </div>
  );
}

// ── MINI DIMENSION BARS ──────────────────────────────────────────────────────
interface IPSCDimensionBarsProps {
  dimensions: Record<string, { score: number }>;
}

const FULL_LABELS: Record<string, string> = {
  seguridadFisica: 'Seguridad Física',
  seguridadDigital: 'Seguridad Digital',
  autonomiaEconomica: 'Autonomía Económica',
  redDeApoyo: 'Red de Apoyo',
  accesoAJusticia: 'Acceso a Justicia',
  accesoASalud: 'Acceso a Salud',
  bienestarPsicosocial: 'Bienestar Psicosocial',
  conocimientoDerechos: 'Conocimiento de Derechos',
  capacidadRespuesta: 'Capacidad de Respuesta',
  continuidadAcompanamiento: 'Continuidad Acompañamiento',
};

function getDimColor(score: number) {
  if (score <= 2) return 'bg-red-500';
  if (score <= 4) return 'bg-orange-400';
  if (score <= 6) return 'bg-amber-400';
  if (score <= 8) return 'bg-emerald-500';
  return 'bg-green-500';
}

export function IPSCDimensionBars({ dimensions }: IPSCDimensionBarsProps) {
  const sorted = Object.entries(FULL_LABELS)
    .map(([key, label]) => ({ key, label, score: dimensions[key]?.score ?? 0 }))
    .sort((a, b) => a.score - b.score);

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-3">
      <h4 className="text-base font-black text-[#52166F]">Desglose por Dimensión</h4>
      <div className="space-y-2.5">
        {sorted.map(({ key, label, score }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">{label}</span>
              <span className={score <= 4 ? 'text-red-600' : score <= 7 ? 'text-amber-600' : 'text-emerald-700'}>
                {score}/10
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getDimColor(score)}`}
                style={{ width: `${score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
