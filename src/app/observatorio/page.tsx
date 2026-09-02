import React from 'react';
import ObservatorioPublico from '@/components/caribe-seguro/ObservatorioPublico';

export const metadata = {
  title: 'Observatorio Caribe Seguro | Fundación Senda Mujer',
  description: 'Indicadores agregados de protección (IPSC), impacto territorial y evidencia institucional en Cartagena y Bolívar.',
};

export default function ObservatorioPage() {
  return (
    <main className="min-h-screen bg-[#0F0218] text-white">
      <ObservatorioPublico />
    </main>
  );
}
