import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
  title: 'Portal de Beneficiarias | Fundación Senda Mujer — Cartagena',
  description: 'Portal confidencial y seguro para la gestión integral de beneficiarias de la Fundación Senda Mujer. Expediente, citas médicas, visitas domiciliarias, metas y capital semilla.',
};

export default function BeneficiariaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDF8FA] text-slate-800 antialiased">
      {children}
    </div>
  );
}
