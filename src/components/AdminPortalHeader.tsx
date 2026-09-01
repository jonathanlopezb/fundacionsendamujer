'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldAlert, LogOut, Globe, GraduationCap, Stethoscope, Shield, Activity, Users } from 'lucide-react';

interface Props {
  onLogout?: () => void;
  onSOS?: () => void;
}

export default function AdminPortalHeader({ onLogout, onSOS }: Props) {
  const triggerSOS = () => {
    if (onSOS) {
      onSOS();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  };

  return (
    <header className="bg-[#180325] text-white border-b border-pink-500/30 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Fundación Senda Mujer"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="h-6 w-[1px] bg-pink-500/30 hidden sm:block" />
          <div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-amber-300" />
              <span className="font-black text-xs sm:text-sm text-white tracking-wide">
                Portal Profesional & Ejecutivo
              </span>
            </div>
            <p className="text-[10px] text-pink-200/70 hidden sm:block">
              Fundación Senda Mujer • Cartagena | Gestión de Expedientes Ley 1581
            </p>
          </div>
        </div>

        {/* Right: Quick Access Links & Session Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Link to SendaAcademia */}
          <a
            href="/academia"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full text-amber-300 bg-[#52166F] hover:bg-[#3B0852] border border-pink-400/30 transition-all shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>SendaAcademia ↗</span>
          </a>

          {/* Link to Beneficiary Portal */}
          <a
            href="/portal-beneficiaria"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full text-pink-200 bg-pink-900/40 hover:bg-pink-900/60 border border-pink-400/30 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-pink-300" />
            <span>Portal Usuarias ↗</span>
          </a>

          {/* Action buttons */}
          <button
            onClick={triggerSOS}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#180325] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Modo Camuflaje [ESC]"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">Camuflaje [ESC]</span>
          </button>

          {/* Back to main site */}
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-bold text-pink-200 hover:text-white px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-pink-500/20"
          >
            <Globe className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">Sitio Web ↗</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
