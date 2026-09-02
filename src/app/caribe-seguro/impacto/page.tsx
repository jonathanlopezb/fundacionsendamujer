'use client';

/**
 * /caribe-seguro/impacto — SENDA Impact Engine
 *
 * Cadena de Valor: INPUT -> ACTIVITIES -> OUTPUTS -> OUTCOMES -> IMPACT
 * Indicadores Pre/Post y Costo-Efectividad — Datos dinámicos desde MongoDB Atlas.
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, CheckCircle2, Loader2 } from 'lucide-react';

interface LiveMetrics {
  mujeresAcompanadas: number;
  rutasActivadas: number;
  citasRealizadas: number;
  talleresRealizados: number;
  variacionIPSC: number;
  nuevosIngresos: number;
}

export default function ImpactoPage() {
  const [live, setLive] = useState<LiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/caribe-seguro/observatory/public');
        const data = await res.json();
        if (data.success && data.latest?.metrics) {
          const m = data.latest.metrics;
          setLive({
            mujeresAcompanadas: m.mujeresAcompanadaTotal || 0,
            rutasActivadas: m.rutasActivadas || 0,
            citasRealizadas: m.citasRealizadas || 0,
            talleresRealizados: m.talleresRealizados || 0,
            variacionIPSC: m.mejoraPromedioIPSC_90d || 0,
            nuevosIngresos: m.nuevosIngresosEnPeriodo || 0,
          });
        }
      } catch {
        // Mantiene null si falla la carga
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const costoPorRuta = live && live.rutasActivadas > 0
    ? Math.round(45000000 / live.rutasActivadas).toLocaleString('es-CO')
    : '—';

  const tasaConclusion = live && live.mujeresAcompanadas > 0
    ? Math.round((live.rutasActivadas / live.mujeresAcompanadas) * 100)
    : 0;

  const chain = live
    ? [
        {
          step: 'INPUT',
          title: 'Recursos Invertidos',
          desc: `$45.000.000 COP aportados al Fondo Capital Semilla y operación psicosocial en 2026.`,
        },
        {
          step: 'ACTIVITIES',
          title: 'Actividades Realizadas',
          desc: `${live.talleresRealizados} talleres de autonomía y ${live.citasRealizadas} citas de atención psicosocial y legal.`,
        },
        {
          step: 'OUTPUTS',
          title: 'Cobertura Directa',
          desc: `${live.mujeresAcompanadas} mujeres acompañadas en Cartagena de Indias, Olaya Herrera, El Pozón y Bolívar.`,
        },
        {
          step: 'OUTCOMES',
          title: 'Resultados Logrados',
          desc: `${live.rutasActivadas} rutas de atención completadas y ${live.nuevosIngresos} nuevos ingresos al programa en el periodo.`,
        },
        {
          step: 'IMPACT',
          title: 'Impacto Observado',
          desc: `Mejora promedio de +${live.variacionIPSC} puntos en el Protección Index a los 90 días de acompañamiento.`,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-pink-300 gap-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-bold">Cargando métricas de impacto desde MongoDB Atlas...</span>
      </div>
    );
  }

  if (!live) {
    return (
      <div className="p-8 text-center text-pink-300 space-y-2">
        <BarChart3 className="w-10 h-10 mx-auto opacity-40" />
        <p className="text-sm font-bold">No hay datos de impacto disponibles aún.</p>
        <p className="text-xs opacity-70">Se publicarán cuando el sistema acumule mediciones suficientes.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      {/* HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-[#E12880] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          SENDA IMPACT ENGINE — DATOS EN VIVO
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Teoría del Cambio e Indicadores de Impacto
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Medición rigurosa del valor social: de la inversión inicial al cambio observado en las vidas de las mujeres acompañadas. Cifras consultadas en tiempo real desde MongoDB Atlas.
        </p>
      </div>

      {/* CADENA DE VALOR */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-white text-lg">Cadena de Resultados Institucional</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {chain.map((c, idx) => (
            <div key={idx} className="bg-[#140320]/80 rounded-2xl border border-purple-900/40 p-4 space-y-2 shadow-md hover:border-pink-500/40 transition-all">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-950 text-[#E12880] border border-pink-800/40 block w-fit">
                {c.step}
              </span>
              <h4 className="font-extrabold text-white text-xs leading-tight">{c.title}</h4>
              <p className="text-[11px] text-pink-200/70 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CARDS DE COSTO EFECTIVIDAD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-2 shadow-md text-center">
          <span className="text-3xl font-black text-[#E12880]">${costoPorRuta} COP</span>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Costo por Ruta Completada</h4>
          <p className="text-[11px] text-pink-300/70">Inversión promedio por proceso de atención integral con cierre exitoso.</p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-2 shadow-md text-center">
          <span className="text-3xl font-black text-purple-400">+{live.variacionIPSC} Puntos</span>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Variación IPSC 90 Días</h4>
          <p className="text-[11px] text-pink-300/70">Incremento observado en autonomía y seguridad personal.</p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-2 shadow-md text-center">
          <span className="text-3xl font-black text-emerald-400">{tasaConclusion}%</span>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Cobertura de Rutas</h4>
          <p className="text-[11px] text-pink-300/70">Porcentaje de mujeres atendidas que recibieron una ruta completa.</p>
        </div>
      </div>

      {/* NOTA DE TRANSPARENCIA */}
      <div className="bg-blue-950/40 border border-blue-700/40 rounded-2xl p-4 text-xs text-blue-200 max-w-2xl mx-auto">
        <span className="font-extrabold text-blue-300 block mb-1">Nota de Transparencia del Observatorio:</span>
        Todas las cifras mostradas se originan en la base de datos MongoDB Atlas de la Fundación Senda Mujer.
        Los datos son agregados y anonimizados bajo Ley 1581 de 2012 y CONPES 4080.
      </div>
    </div>
  );
}
