'use client';

/**
 * /caribe-seguro/investigacion — Senda Research & Policy Lab
 */

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import PolicyLabCaribeSeguro from '@/components/caribe-seguro/PolicyLabCaribeSeguro';

export default function InvestigacionPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <PolicyLabCaribeSeguro />
      </main>
    </div>
  );
}
