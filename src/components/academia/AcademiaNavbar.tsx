'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, GraduationCap, Flame, LogOut, User, ChevronDown, Zap, BookOpen, Shield, Globe } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export default function AcademiaNavbar({ user, onOpenAuth, onLogout }: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#270538]/95 backdrop-blur-md border-b border-pink-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Institutional Logo & SendaAcademia Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center group">
            <div className="relative w-36 h-10 sm:w-44 sm:h-11 transition-transform group-hover:scale-[1.02]">
              <Image src="/logo.png" alt="Fundación Senda Mujer" fill className="object-contain" priority />
            </div>
          </Link>
          <div className="h-6 w-[1px] bg-pink-500/30 hidden sm:block" />
          <Link href="/academia" className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#E12880]/30 to-[#52166F]/50 border border-[#E12880]/40 text-pink-200 text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>SendaAcademia</span>
          </Link>
        </div>

        {/* Search — hidden on small mobile */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/70" />
          <input
            type="text"
            placeholder="Buscar cursos, clases en vivo, instructoras..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full text-white placeholder-pink-200/50 bg-[#3B0852]/80 border border-pink-500/30 focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-950/80 border border-red-500/40 text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
            CLASES EN VIVO 🔴
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#52166F]/80 border border-pink-400/30 hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#E12880] to-amber-400 flex items-center justify-center text-xs font-extrabold text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-xs text-white font-bold hidden sm:block max-w-[90px] truncate">{user.name}</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <ChevronDown className="w-3 h-3 text-pink-200" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden z-50 bg-[#270538] border border-pink-500/30 animate-fadeIn">
                  <div className="p-3 border-b border-pink-500/20 bg-[#3B0852]/60">
                    <p className="text-xs font-extrabold text-white">{user.name}</p>
                    <p className="text-[10px] text-pink-200/70 truncate">{user.email}</p>
                  </div>
                  {[
                    { icon: User, label: 'Mi Expediente Educativo' },
                    { icon: BookOpen, label: 'Mis Cursos Activos' },
                    { icon: GraduationCap, label: 'Mis Certificados' },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-pink-100 hover:bg-[#52166F] hover:text-amber-300 transition-colors text-left cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-pink-300" /> {label}
                    </button>
                  ))}
                  <div className="border-t border-pink-500/20">
                    <button onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-300 hover:bg-red-950/50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-bold text-pink-100 hover:text-amber-300 px-3 py-2 transition-colors hidden sm:block cursor-pointer"
              >
                Ingresar
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:from-[#c81e6f] hover:to-[#3B0852] text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-pink-400/30"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Registrarme Gratis</span>
              </button>
            </>
          )}

          {/* Link back to Main Foundation Site */}
          <Link
            href="/"
            className="hidden lg:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-pink-200 border border-pink-200/20 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all"
            title="Volver a la página principal institucional"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Web Principal ↗</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
