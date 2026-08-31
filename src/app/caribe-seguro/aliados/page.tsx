'use client';

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import CertifiedCaribeSeguro from '@/components/caribe-seguro/CertifiedCaribeSeguro';

export default function AliadosPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <CertifiedCaribeSeguro />
      </main>
    </div>
  );
}
