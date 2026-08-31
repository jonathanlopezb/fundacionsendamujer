'use client';

/**
 * CaribeSeguroLayout — Layout Independiente del Micrositio Caribe Seguro
 *
 * Transforma el programa Caribe Seguro en un workspace/dashboard autónomo,
 * con navegación lateral colapsable, topbar de producción y diseño visual de alto nivel.
 */

import React, { useState } from 'react';
import CaribeSeguroSidebar from '@/components/caribe-seguro/CaribeSeguroSidebar';
import CaribeSeguroTopbar from '@/components/caribe-seguro/CaribeSeguroTopbar';

export default function CaribeSeguroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0218] text-white flex flex-col font-sans selection:bg-[#E12880] selection:text-white">
      {/* MENÚ LATERAL AUTÓNOMO */}
      <CaribeSeguroSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* WORKSPACE PRINCIPAL CON MARGEN ADAPTATIVO */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'pl-20' : 'pl-72'
        }`}
      >
        {/* CABECERA SUPERIOR */}
        <CaribeSeguroTopbar />

        {/* CONTENIDO DE CADA PÁGINA DEL MICROSITIO */}
        <main className="flex-1 bg-gradient-to-b from-[#140320] via-[#1C052B] to-[#0F0218] min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
