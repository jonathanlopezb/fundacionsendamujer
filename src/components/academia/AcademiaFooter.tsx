'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Heart, ShieldCheck, Globe, PhoneCall } from 'lucide-react';

export default function AcademiaFooter() {
  return (
    <footer className="border-t border-pink-500/20 py-12 px-4 sm:px-8 text-pink-200/80 text-xs bg-[#14021f]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="relative w-36 h-9">
            <Image src="/logo.png" alt="Fundación Senda Mujer" fill className="object-contain" />
          </div>
          <div className="h-6 w-[1px] bg-pink-500/30" />
          <div>
            <div className="font-extrabold text-white">SendaAcademia</div>
            <div className="text-[10px] text-pink-200/60">Plataforma Educativa de la Fundación Senda Mujer • Cartagena</div>
          </div>
        </div>

        {/* Center credits */}
        <div className="flex items-center gap-2 text-center text-[11px]">
          <span>Dirección Ejecutiva: Dra. Sorelvis Caldera (+57 301 469 2095)</span>
        </div>

        {/* Back to main site link */}
        <div>
          <Link
            href="/"
            className="text-xs font-extrabold px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5 text-amber-300 bg-[#52166F] hover:bg-[#3B0852] border border-pink-400/30 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ir al Sitio Institucional Senda Mujer ↗</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
