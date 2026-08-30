import React from 'react';
import { Metadata } from 'next';
import SendaWizard from '@/components/SendaWizard';

export const metadata: Metadata = {
  title: 'SENDA Universal — Diagnóstico de Derechos Paso a Paso',
  description: 'Sistema Operativo de Derechos de las Mujeres. 12 pasos guiados, código protegido temporal y plan de acción personalizado con normas legales colombianas.',
};

export default function SendaUniversalPage() {
  return (
    <main className="min-h-screen">
      <SendaWizard />
    </main>
  );
}
