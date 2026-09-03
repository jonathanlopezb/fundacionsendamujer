'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CamouflageOverlay from '@/components/CamouflageOverlay';
import SendaBotChat from '@/components/SendaBotChat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = usePathname();

  // Determine if current route is an independent microsite (Admin, Portal Beneficiarias, SendaAcademia, or CaribeSeguro)
  const isStandaloneMicrosite =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/portal-beneficiaria') ||
    pathname?.startsWith('/academia') ||
    pathname?.startsWith('/caribe-seguro');

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <title>Fundación Senda Mujer — Acompañamos, Protegemos, Transformamos | Cartagena</title>
        <meta
          name="description"
          content="Fundación para el acompañamiento, protección y fortalecimiento integral de mujeres y niñas en situación de vulnerabilidad en Cartagena, Colombia. Atención en Psicología, Odontología, Medicina General y Asesoría Jurídica."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#52166F" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CO" />
        <meta property="og:site_name" content="Fundación Senda Mujer" />
        <meta property="og:title" content="Fundación Senda Mujer | Acompañamiento integral en Cartagena" />
        <meta property="og:description" content="Orientación, protección, salud, apoyo psicológico y asesoría jurídica para mujeres y niñas en Cartagena y Colombia." />
        <meta property="og:url" content="https://fundacionsendamujer.vercel.app/" />
        <meta property="og:image" content="https://fundacionsendamujer.vercel.app/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fundación Senda Mujer | Acompañamiento integral" />
        <meta name="twitter:description" content="Conoce tus derechos, encuentra rutas de atención y recibe acompañamiento integral en Cartagena." />
        <meta name="twitter:image" content="https://fundacionsendamujer.vercel.app/logo.png" />
        <link rel="canonical" href="https://fundacionsendamujer.vercel.app/" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="bg-[#FDF8FA] text-slate-800 antialiased min-h-screen flex flex-col justify-between">
        
        {/* Camouflage / Incognito Overlay */}
        <CamouflageOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
        />

        {/* Global Navigation — Rendered ONLY for main site, hidden for independent microsites */}
        {!isStandaloneMicrosite && (
          <Navbar 
            onOpenSOS={() => setIsOverlayOpen(true)} 
            onOpenIncognito={() => setIsOverlayOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Floating AI Chat Assistant — Rendered on main site */}
        {!isStandaloneMicrosite && <SendaBotChat />}

        {/* Global Footer — Rendered ONLY for main site, hidden for independent microsites */}
        {!isStandaloneMicrosite && <Footer />}
      </body>
    </html>
  );
}
