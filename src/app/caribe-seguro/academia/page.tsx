'use client';

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { GraduationCap, Award, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AcademiaPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="bg-purple-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
            SENDA ACADEMIA
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#52166F]">
            Formación e Independencia Económica
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Programas educativos diseñados para fortalecer la autonomía financiera, el conocimiento de derechos y el liderazgo comunitario en el Caribe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm">
            <GraduationCap className="w-8 h-8 text-[#E12880]" />
            <h3 className="font-extrabold text-[#52166F] text-base">Autonomía y Finanzas Digitales</h3>
            <p className="text-xs text-slate-600">Presupuesto personal, bancarización y microemprendimiento sostenible.</p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm">
            <Award className="w-8 h-8 text-amber-500" />
            <h3 className="font-extrabold text-[#52166F] text-base">Certificación en Liderazgo</h3>
            <p className="text-xs text-slate-600">Capacitación de lideresas vecinales en prevención de violencias.</p>
          </div>

          <div className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h3 className="font-extrabold text-[#52166F] text-base">Derechos y Rutas de Exigibilidad</h3>
            <p className="text-xs text-slate-600">Módulo legal sobre Ley 1257 de 2008 y decretos reglamentarios.</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/academia"
            className="bg-[#52166F] text-white font-extrabold px-8 py-3.5 rounded-full text-xs hover:bg-[#3B0852] transition-colors inline-flex items-center gap-2"
          >
            Explorar Todos los Cursos de Senda Academia <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
