'use client';

/**
 * /caribe-seguro/impacto — SENDA Impact Engine
 *
 * Cadena de Valor: INPUT -> ACTIVITIES -> OUTPUTS -> OUTCOMES -> IMPACT
 * Indicadores Pre/Post y Costo-Efectividad.
 */

import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, CheckCircle2, ArrowRight } from 'lucide-react';

const CHAIN = [
  { step: 'INPUT', title: 'Recursos Invertidos', desc: '$45.000.000 COP aportados al Fondo Capital Semilla y operación psicosocial en 2026.' },
  { step: 'ACTIVITIES', title: 'Actividades Realizadas', desc: '18 talleres de autonomía económica y 420 citas de atención psicosocial y legal efectivas.' },
  { step: 'OUTPUTS', title: 'Cobertura Directa (Outputs)', desc: '148 mujeres acompañadas en Cartagena de Indias, Olaya Herrera, El Pozón y Bolívar.' },
  { step: 'OUTCOMES', title: 'Resultados Logrados (Outcomes)', desc: '112 rutas de atención completadas y 350 participaciones en formación comunitaria.' },
  { step: 'IMPACT', title: 'Impacto Observado', desc: 'Mejora promedio de +2.4 puntos en el Protección Index a los 90 días de acompañamiento.' },
];

export default function ImpactoPage() {
  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-[#E12880] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          SENDA IMPACT ENGINE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Teoría del Cambio e Indicadores de Impacto
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Medición rigurosa del valor social: de la inversión inicial al cambio observado en las vidas de las mujeres acompañadas.
        </p>
      </div>

      {/* CADENA DE VALOR */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-white text-lg">Cadena de Resultados Institucional</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CHAIN.map((c, idx) => (
            <div key={idx} className="bg-[#140320]/80 rounded-2xl border border-purple-900/40 p-4 space-y-2 shadow-md">
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
          <span className="text-3xl font-black text-[#E12880]">$401.785 COP</span>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Costo por Ruta Completada</h4>
          <p className="text-[11px] text-pink-300/70">Inversión promedio por proceso de atención integral con cierre exitoso.</p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-2 shadow-md text-center">
          <span className="text-3xl font-black text-purple-400">+2.4 Puntos</span>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Variación IPSC 90 Días</h4>
          <p className="text-[11px] text-pink-300/70">Incremento observado en autonomía y seguridad personal.</p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-2 shadow-md text-center">
          <span className="text-3xl font-black text-emerald-400">75.6%</span>
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Tasa de Conclusión de Rutas</h4>
          <p className="text-[11px] text-pink-300/70">Porcentaje de rutas que alcanzan su objetivo sin abandono.</p>
        </div>
      </div>
    </div>
  );
}
