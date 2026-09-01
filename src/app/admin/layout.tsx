import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sistema de Historia Clínica Electrónica (EHR) | Fundación Senda Mujer',
  description: 'Plataforma Médica y Sistema EHR de Historia Clínica Electrónica de la Fundación Senda Mujer en Cartagena.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0218] text-slate-100 antialiased font-sans">
      {children}
    </div>
  );
}
