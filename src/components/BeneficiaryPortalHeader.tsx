'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldAlert, EyeOff, LogOut, ShieldCheck, Globe, GraduationCap } from 'lucide-react';

interface Props {
  user: { name: string; code: string; sendaIndex: number; docId: string } | null;
  onLogout: () => void;
  onSOS: () => void;
  onIncognito: () => void;
}

export default function BeneficiaryPortalHeader({ user, onLogout, onSOS, onIncognito }: Props) {
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
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                Portal de Beneficiarias
              </span>
            </div>
            <p className="text-[10px] text-pink-200/70 hidden sm:block">
              Fundación Senda Mujer • Cartagena | Ley 1581 de 2012
            </p>
          </div>
        </div>

        {/* Center/Right: External Links & User Info */}
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

          {user && (
            <div className="flex items-center gap-2 bg-[#270538] border border-pink-500/30 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#E12880] to-amber-400 flex items-center justify-center font-black text-xs text-white">
                {user.name[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white max-w-[110px] truncate">{user.name}</p>
                <p className="text-[9px] text-amber-300 font-mono">{user.code}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={onIncognito}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
            title="Modo Incógnito [ESC]"
          >
            <EyeOff className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Incógnito</span>
          </button>

          <button
            onClick={onSOS}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md animate-pulse"
            title="Pánico SOS 24/7"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {user && (
            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-pink-400/20"
              title="Cerrar Sesión Segura"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}

          {/* Back to main site */}
          <Link
            href="/"
            className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-pink-200 hover:text-white px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-pink-500/20"
          >
            <Globe className="w-3.5 h-3.5 text-pink-300" />
            <span>Sitio Web ↗</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
