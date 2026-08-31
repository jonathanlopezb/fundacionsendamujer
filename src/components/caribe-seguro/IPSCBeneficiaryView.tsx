'use client';

/**
 * IPSCBeneficiaryView — Vista real del IPSC para la beneficiaria
 *
 * Consulta /api/caribe-seguro/ipsc/trajectory/[code] y renderiza
 * la trayectoria individual con datos reales de MongoDB.
 * Si no hay datos, muestra un estado honesto y orientativo.
 */

import React, { useEffect, useState } from 'react';
import { Loader2, Shield, TrendingUp, Info, AlertTriangle } from 'lucide-react';
import { IPSCRadarChart, IPSCTrajectoryChart, IPSCDimensionBars } from './IPSCCharts';

interface Measurement {
  _id: string;
  measurementPeriod: string;
  measurementDate: string;
  ipscTotal: number;
  deltaFromPrevious: number | null;
  dimensions: Record<string, { score: number; notes?: string }>;
  appliedBy: string;
  appliedByRole: string;
}

interface IPSCBeneficiaryViewProps {
  beneficiaryCode: string;   // Ej: "SM-8842"
  beneficiaryName: string;   // Solo primer nombre para el saludo
}

const PERIOD_LABELS: Record<string, string> = {
  ingreso: 'Ingreso',
  '30d': '30 días',
  '90d': '90 días',
  '180d': '180 días',
  seguimiento_especial: 'Seguimiento Especial',
};

function EmptyIPSC({ code }: { code: string }) {
  return (
    <div className="bg-white rounded-3xl border border-pink-100 p-10 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto">
        <Shield className="w-8 h-8 text-[#52166F]" />
      </div>
      <h3 className="text-xl font-black text-[#52166F]">Tu Índice IPSC está en preparación</h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        El equipo profesional de la Fundación aplicará tu primera medición IPSC próximamente.
        Este índice mide tu avance en 10 dimensiones de protección, basado en el acompañamiento que recibes.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 text-left font-semibold max-w-sm mx-auto">
        <p className="font-extrabold mb-1">¿Qué es el IPSC?</p>
        <p>Es el Índice de Protección Senda-Caribe. Mide 10 dimensiones como tu seguridad física, autonomía económica, red de apoyo y acceso a justicia. Nunca predice riesgo — mide el resultado de tu proceso.</p>
      </div>
      <p className="text-[10px] text-slate-400 font-mono">Expediente: {code}</p>
    </div>
  );
}

export default function IPSCBeneficiaryView({ beneficiaryCode, beneficiaryName }: IPSCBeneficiaryViewProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!beneficiaryCode) return;

    const fetchTrajectory = async () => {
      setLoading(true);
      setApiError('');
      try {
        const res = await fetch(`/api/caribe-seguro/ipsc/trajectory/${encodeURIComponent(beneficiaryCode)}`);
        const data = await res.json();
        if (data.success) {
          setMeasurements(data.measurements || []);
        } else {
          setApiError(data.error || 'No se pudo cargar la trayectoria.');
        }
      } catch (err: any) {
        setApiError('Error de conexión. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrajectory();
  }, [beneficiaryCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Cargando tu trayectoria IPSC...</span>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-red-800 text-sm">No se pudo cargar el IPSC</p>
          <p className="text-xs text-red-600 mt-0.5">{apiError}</p>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return <EmptyIPSC code={beneficiaryCode} />;
  }

  // Última medición y penúltima para comparar
  const latest = measurements[measurements.length - 1];
  const previous = measurements.length >= 2 ? measurements[measurements.length - 2] : null;

  // Datos para la gráfica de trayectoria: usar measurementPeriod como label
  const trajectoryData = measurements.map((m) => ({
    period: PERIOD_LABELS[m.measurementPeriod] || m.measurementPeriod,
    ipscTotal: m.ipscTotal,
  }));

  const delta = latest.deltaFromPrevious;
  const deltaPositive = delta !== null && delta >= 0;

  return (
    <div className="space-y-6">

      {/* Banner de estado */}
      <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">CARIBE SEGURO</span>
          <h2 className="text-xl font-black">Mi Índice de Protección Senda-Caribe</h2>
          <p className="text-xs text-pink-200 mt-1">
            Expediente: <strong className="font-mono text-amber-300">{beneficiaryCode}</strong>
            {' '}• {measurements.length} medición{measurements.length !== 1 ? 'es' : ''} registrada{measurements.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
            <p className="text-3xl font-black text-white">
              {latest.ipscTotal.toFixed(1)}
              <span className="text-sm font-normal text-pink-200">/10</span>
            </p>
            <p className="text-[10px] text-pink-200 font-bold">IPSC Actual</p>
          </div>
          {delta !== null && (
            <div className={`rounded-xl px-4 py-3 text-center border ${deltaPositive ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-red-500/20 border-red-400/30'}`}>
              <p className={`text-2xl font-black ${deltaPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                {deltaPositive ? '+' : ''}{delta.toFixed(1)}
              </p>
              <p className={`text-[10px] font-bold ${deltaPositive ? 'text-emerald-200' : 'text-red-200'}`}>
                {deltaPositive ? 'Mejora' : 'Variación'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info ética */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-800">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
        <p>
          <strong>Este índice mide el avance de tu proceso de acompañamiento</strong>, no diagnostica ni predice situaciones.
          Fue aplicado por el equipo profesional de la Fundación. Tu participación es siempre voluntaria.
        </p>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IPSCRadarChart
          dimensions={latest.dimensions}
          previousDimensions={previous?.dimensions}
          period={previous
            ? `${PERIOD_LABELS[previous.measurementPeriod] || previous.measurementPeriod} → ${PERIOD_LABELS[latest.measurementPeriod] || latest.measurementPeriod}`
            : PERIOD_LABELS[latest.measurementPeriod] || latest.measurementPeriod
          }
        />

        <IPSCTrajectoryChart
          measurements={trajectoryData}
          beneficiaryCode={beneficiaryCode}
        />
      </div>

      {/* Barras por dimensión */}
      <IPSCDimensionBars dimensions={latest.dimensions} />

      {/* Historial de mediciones */}
      {measurements.length > 1 && (
        <div className="bg-white rounded-2xl border border-pink-100 p-5 space-y-3 shadow-sm">
          <h4 className="font-extrabold text-[#52166F] text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E12880]" />
            Historial de Mediciones
          </h4>
          <div className="space-y-2">
            {[...measurements].reverse().map((m, i) => (
              <div key={m._id} className="flex items-center justify-between p-3 rounded-xl bg-pink-50/40 border border-pink-100 text-xs">
                <div>
                  <span className="font-extrabold text-[#52166F]">
                    {PERIOD_LABELS[m.measurementPeriod] || m.measurementPeriod}
                  </span>
                  <span className="text-slate-400 ml-2">
                    {new Date(m.measurementDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {m.deltaFromPrevious !== null && (
                    <span className={`font-bold ${m.deltaFromPrevious >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {m.deltaFromPrevious >= 0 ? '▲' : '▼'} {Math.abs(m.deltaFromPrevious).toFixed(1)}
                    </span>
                  )}
                  <span className="font-black text-[#52166F] text-base">{m.ipscTotal.toFixed(1)}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pie */}
      <p className="text-center text-[10px] text-slate-400">
        Datos médicos confidenciales bajo Ley 1581 de 2012 • Fundación Senda Mujer • Cartagena de Indias
      </p>
    </div>
  );
}
