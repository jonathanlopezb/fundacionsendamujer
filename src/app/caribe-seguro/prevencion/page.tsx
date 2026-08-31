'use client';

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { ShieldAlert, BookOpen, Users, Sparkles } from 'lucide-react';

export default function PrevencionPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="bg-amber-500 text-[#3B0852] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
            PREVENCIÓN COMUNITARIA
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#52166F]">
            Herramientas de Prevención Territorial
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Estrategias comunitarias para la detección temprana de señales de vulnerabilidad y empoderamiento en barrios de Cartagena y municipios de Bolívar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#E12880]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#52166F] text-base">Círculos de Cuidado Comunitario</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Redes vecinales en Olaya Herrera, El Pozón y Nelson Mandela para la alerta y protección mutua.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#52166F] text-base">Talleres de Seguridad Digital</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capacitación en uso seguro de redes sociales, protección de cuentas y prevención de ciberacoso.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#52166F] text-base">Caribe Safe Signals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistema de detección de deterioro con revisión obligatoria por parte del equipo profesional de Senda Mujer.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
