'use client';

import React from 'react';
import { ShieldAlert, BookOpen, Users, Sparkles } from 'lucide-react';

export default function PrevencionPage() {
  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-amber-400 text-[#3B0852] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          PREVENCIÓN COMUNITARIA
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Herramientas de Prevención Territorial
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Estrategias comunitarias para la detección temprana de señales de vulnerabilidad y empoderamiento en barrios de Cartagena y municipios de Bolívar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-pink-950/60 border border-pink-700/50 flex items-center justify-center text-[#E12880]">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Círculos de Cuidado Comunitario</h3>
          <p className="text-xs text-pink-200/70 leading-relaxed">
            Redes vecinales en Olaya Herrera, El Pozón y Nelson Mandela para la alerta y protección mutua.
          </p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-700/50 flex items-center justify-center text-amber-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Talleres de Seguridad Digital</h3>
          <p className="text-xs text-pink-200/70 leading-relaxed">
            Capacitación en uso seguro de redes sociales, protección de cuentas y prevención de ciberacoso.
          </p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-center text-purple-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-base">Caribe Safe Signals</h3>
          <p className="text-xs text-pink-200/70 leading-relaxed">
            Sistema de detección de deterioro con revisión obligatoria por parte del equipo profesional de Senda Mujer.
          </p>
        </div>
      </div>
    </div>
  );
}
