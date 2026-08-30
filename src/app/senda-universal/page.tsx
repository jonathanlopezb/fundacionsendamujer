import React from 'react';
import { Metadata } from 'next';
import SendaUniversalModule from '@/components/SendaUniversalModule';

export const metadata: Metadata = {
  title: 'SENDA Universal — El Sistema Operativo de Derechos de las Mujeres',
  description: 'Tecnología disruptiva de descubrimiento de derechos, políticas públicas, rutas de atención, observatorio de brechas de género y gemelo digital social.',
};

export default function SendaUniversalPage() {
  return (
    <main className="min-h-screen bg-slate-950/5 py-8">
      <SendaUniversalModule />
    </main>
  );
}
