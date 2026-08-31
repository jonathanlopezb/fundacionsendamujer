'use client';

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import ObservatorioPublico from '@/components/caribe-seguro/ObservatorioPublico';

export default function ObservatorioPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <ObservatorioPublico showHeader={true} />
      </main>
    </div>
  );
}
