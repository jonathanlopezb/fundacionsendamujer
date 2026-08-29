'use client';

import React from 'react';
import ProgramsGrid from '@/components/ProgramsGrid';

export default function ProgramasPage() {
  return (
    <div className="py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto px-6 space-y-4">
        <span className="bg-senda-purple-light text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
          Portafolio de Atención Integral
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-senda-purple-dark">
          Los 7 Programas Fundamentales
        </h1>
        <p className="text-sm text-slate-600">
          Diseñados para cubrir desde la atención social inicial y contención de crisis, hasta la protección legal, salud dental/médica, embarazo asistido y proyecto de vida.
        </p>
      </div>

      <ProgramsGrid />
    </div>
  );
}
