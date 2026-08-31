'use client';

/**
 * /caribe-seguro/impacto — SENDA Impact Engine
 *
 * Cadena de Valor: INPUT -> ACTIVITIES -> OUTPUTS -> OUTCOMES -> IMPACT
 * Indicadores Pre/Post y Costo-Efectividad.
 */

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
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
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="bg-[#E12880] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
            SENDA IMPACT ENGINE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#52166F]">
            Teoría del Cambio e Indicadores de Impacto
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Medición rigurosa del valor social: de la inversión inicial al cambio observado en las vidas de las mujeres acompañadas.
          </p>
        </div>

        {/* CADENA DE VALOR */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-[#52166F] text-lg">Cadena de Resultados Institucional</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {CHAIN.map((c, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-pink-100 p-4 space-y-2 shadow-sm">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-[#E12880] block w-fit">
                  {c.step}
                </span>
                <h4 className="font-extrabold text-[#52166F] text-xs leading-tight">{c.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CARDS DE COSTO EFECTIVIDAD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-2 shadow-sm text-center">
            <span className="text-3xl font-black text-[#E12880]">$401.785 COP</span>
            <h4 className="font-extrabold text-[#52166F] text-xs uppercase tracking-wider">Costo por Ruta Completada</h4>
            <p className="text-[11px] text-slate-500">Inversión promedio por proceso de atención integral con cierre exitoso.</p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-2 shadow-sm text-center">
            <span className="text-3xl font-black text-purple-600">+2.4 Puntos</span>
            <h4 className="font-extrabold text-[#52166F] text-xs uppercase tracking-wider">Variación IPSC 90 Días</h4>
            <p className="text-[11px] text-slate-500">Incremento observado en autonomía y seguridad personal.</p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-2 shadow-sm text-center">
            <span className="text-3xl font-black text-emerald-600">75.6%</span>
            <h4 className="font-extrabold text-[#52166F] text-xs uppercase tracking-wider">Tasa de Conclusión de Rutas</h4>
            <p className="text-[11px] text-slate-500">Porcentaje de rutas que alcanzan su objetivo sin abandono.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
