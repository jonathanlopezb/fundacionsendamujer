'use client';

/**
 * CaribeSeguroHeader.tsx — Barra de Navegación del Ecosistema Caribe Seguro
 *
 * Conecta las 12 subrutas del programa institucional con acceso rápido a SENDA SOS.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Phone, BarChart3, MapPin, Award, Globe, Heart, FileText, Users, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { href: '/caribe-seguro', label: 'Inicio' },
  { href: '/caribe-seguro/como-funciona', label: '¿Cómo funciona?' },
  { href: '/caribe-seguro/proteccion', label: 'Protección' },
  { href: '/caribe-seguro/prevencion', label: 'Prevención' },
  { href: '/caribe-seguro/rutas', label: 'Rutas' },
  { href: '/caribe-seguro/sos', label: 'SENDA SOS', alert: true },
  { href: '/caribe-seguro/academia', label: 'Academia' },
  { href: '/caribe-seguro/red', label: 'Red Profesional' },
  { href: '/caribe-seguro/impacto', label: 'Impacto' },
  { href: '/caribe-seguro/observatorio', label: 'Observatorio' },
  { href: '/caribe-seguro/aliados', label: 'Aliados & Sello' },
  { href: '/caribe-seguro/cooperacion', label: 'Cooperación' },
  { href: '/caribe-seguro/investigacion', label: 'Investigación' },
];

export default function CaribeSeguroHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-[#180325] text-white border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/caribe-seguro" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E12880] to-[#52166F] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="font-black text-sm tracking-wide block leading-none text-white">CARIBE SEGURO</span>
            <span className="text-[10px] text-pink-300 font-bold block mt-0.5">FUNDACIÓN SENDA MUJER</span>
          </div>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            if (link.alert) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse shadow-sm"
                >
                  <Phone className="w-3 h-3" /> {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white font-black shadow-xs'
                    : 'text-pink-100/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA BROWSER ACCESO BENEFICIARIAS */}
        <div className="flex items-center gap-2">
          <Link
            href="/portal-beneficiaria"
            className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#3B0852] font-black text-xs px-4 py-2 rounded-full hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current" /> Mi Portal
          </Link>
        </div>
      </div>

      {/* MENÚ MÓVIL / SCROLLABLE SECUNDARIO */}
      <div className="lg:hidden bg-[#3B0852] px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/10 text-xs">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
              pathname === link.href ? 'bg-[#E12880] text-white' : 'text-pink-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
