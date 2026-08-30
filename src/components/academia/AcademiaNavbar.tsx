'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, BookOpen, GraduationCap, Flame, LogOut, User, ChevronDown, Zap } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export default function AcademiaNavbar({ user, onOpenAuth, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/academia" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">Senda</span>
            <span className="font-bold text-sm tracking-tight" style={{ color: '#06b6d4' }}>Academia</span>
          </div>
        </Link>

        {/* Search — hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Buscar cursos, temas, instructoras..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
          />
        </div>

        {/* Center Nav — Desktop */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {['Cursos', 'Rutas', 'En Vivo', 'Comunidad'].map((item) => (
            <button key={item}
              className="px-3 py-2 rounded-lg transition-colors hover:text-white"
              style={{ color: '#9ca3af' }}>
              {item}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
            EN VIVO
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-xs text-white font-semibold hidden sm:block max-w-[80px] truncate">{user.name}</span>
                <Flame className="w-3.5 h-3.5" style={{ color: '#f97316' }} />
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-2xl overflow-hidden z-50"
                  style={{ background: '#141420', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px]" style={{ color: '#6b7280' }}>{user.email}</p>
                  </div>
                  {[
                    { icon: User, label: 'Mi Perfil' },
                    { icon: BookOpen, label: 'Mis Cursos' },
                    { icon: GraduationCap, label: 'Mis Certificados' },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors text-left hover:text-white"
                      style={{ color: '#9ca3af' }}>
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                  <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <button onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 transition-colors text-left">
                      <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold px-3 py-2 rounded-lg transition-colors hidden sm:block"
                style={{ color: '#9ca3af' }}>
                Ingresar
              </button>
              <button onClick={() => onOpenAuth('register')}
                className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Unirme Gratis
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
