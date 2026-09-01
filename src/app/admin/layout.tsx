import React from 'react';
import { Metadata } from 'next';
import AdminPortalHeader from '@/components/AdminPortalHeader';

export const metadata: Metadata = {
  title: 'Portal Profesional & Gestión | Fundación Senda Mujer — Cartagena',
  description: 'Consola administrativa y de gestión de historias clínicas multidisciplinarias para la Fundación Senda Mujer en Cartagena.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDF8FA] text-slate-800 antialiased flex flex-col font-sans">
      <AdminPortalHeader />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-[#180325] text-pink-200 py-6 border-t border-pink-500/20 text-center text-xs space-y-1">
        <p className="font-extrabold text-white">Fundación Senda Mujer • Dirección Ejecutiva: Dra. Sorelvis Murillo (+57 301 469 2095)</p>
        <p className="text-[10px] text-pink-300/70">Cartagena de Indias, Colombia • Protegido bajo Ley 1581 de 2012 de Habeas Data</p>
      </footer>
    </div>
  );
}
