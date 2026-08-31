'use client';

import React from 'react';
import ObservatorioPublico from '@/components/caribe-seguro/ObservatorioPublico';

export default function ObservatorioPage() {
  return (
    <div className="p-4 sm:p-8 space-y-6 animate-fadeIn">
      <ObservatorioPublico showHeader={true} />
    </div>
  );
}
