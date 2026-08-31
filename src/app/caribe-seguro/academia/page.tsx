'use client';

import React from 'react';
import { GraduationCap, Award, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AcademiaPage() {
  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-purple-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          SENDA ACADEMIA
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Formación e Independencia Económica
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Programas educativos diseñados para fortalecer la autonomía financiera, el conocimiento de derechos y el liderazgo comunitario en el Caribe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
          <GraduationCap className="w-8 h-8 text-[#E12880]" />
          <h3 className="font-extrabold text-white text-base">Autonomía y Finanzas Digitales</h3>
          <p className="text-xs text-pink-200/70">Presupuesto personal, bancarización y microemprendimiento sostenible.</p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
          <Award className="w-8 h-8 text-amber-400" />
          <h3 className="font-extrabold text-white text-base">Certificación en Liderazgo</h3>
          <p className="text-xs text-pink-200/70">Capacitación de lideresas vecinales en prevención de violencias.</p>
        </div>

        <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <h3 className="font-extrabold text-white text-base">Derechos y Rutas de Exigibilidad</h3>
          <p className="text-xs text-pink-200/70">Módulo legal sobre Ley 1257 de 2008 y decretos reglamentarios.</p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/academia"
          className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-8 py-3.5 rounded-full text-xs hover:opacity-95 transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
        >
          Explorar Todos los Cursos de Senda Academia <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
