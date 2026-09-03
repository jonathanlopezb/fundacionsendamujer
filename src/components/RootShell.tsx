'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CamouflageOverlay from '@/components/CamouflageOverlay';
import SendaBotChat from '@/components/SendaBotChat';

export default function RootShell({ children }: { children: React.ReactNode }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = usePathname();
  const isStandaloneMicrosite =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/portal-beneficiaria') ||
    pathname?.startsWith('/academia') ||
    pathname?.startsWith('/caribe-seguro');

  return (
    <>
      <CamouflageOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
      {!isStandaloneMicrosite && <Navbar onOpenSOS={() => setIsOverlayOpen(true)} onOpenIncognito={() => setIsOverlayOpen(true)} />}
      <main className="flex-1">{children}</main>
      {!isStandaloneMicrosite && <SendaBotChat />}
      {!isStandaloneMicrosite && <Footer />}
    </>
  );
}
