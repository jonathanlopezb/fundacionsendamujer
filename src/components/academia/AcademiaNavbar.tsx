'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Flame, LogOut, User, ChevronDown, Zap, BookOpen, Radio, Users, Award, ExternalLink } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

export default function AcademiaNavbar({
  user,
  activeTab = 'Inicio',
  onSelectTab,
  onOpenAuth,
  onLogout,
  onSearch,
}: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navTabs = [
    { id: 'Inicio', label: 'Inicio', href: '/academia' },
    { id: 'Cursos', label: 'Cursos', href: '/academia#cursos' },
    { id: 'En vivo', label: 'En vivo', href: '/academia#live', badge: 'LIVE' },
    { id: 'Comunidad', label: 'Comunidad', href: '/academia#comunidad' },
    { id: 'Recursos', label: 'Recursos', href: '/academia#recursos' },
  ];

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#14061f]/95 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/academia" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Fundación Senda Mujer"
              className="h-12 sm:h-15 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md py-0.5"
            />
          </Link>


          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E12880] to-[#6A1B9A] text-white shadow-md shadow-pink-500/25'
                      : 'text-pink-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-500 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

          {/* Search, Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative items-center">
            <Search className="absolute left-3 w-4 h-4 text-pink-300/60 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar curso, lección o tema..."
              className="w-56 xl:w-64 pl-9 pr-4 py-1.5 rounded-full text-xs bg-white/[0.06] border border-white/10 text-white placeholder-pink-200/40 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all"
            />
          </form>

          {/* Mobile Search Toggle Button */}
          <button
            aria-label="Buscar en la academia"
            onClick={() => {
              const query = prompt('¿Qué curso o tema deseas buscar?');
              if (query && onSearch) onSearch(query);
            }}
            className="lg:hidden p-2 rounded-full text-pink-200/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            aria-label="Notificaciones"
            onClick={() => alert('Tienes 2 eventos en vivo programados esta semana.')}
            className="relative p-2 rounded-full text-pink-200/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#14061f]" />
          </button>

          {/* User Auth or Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 rounded-full bg-white/[0.07] border border-white/15 hover:border-pink-400/50 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E12880] to-amber-400 flex items-center justify-center text-xs font-black text-white shadow-sm shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-[100px] truncate hidden xs:inline-block">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-pink-200/70 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl overflow-hidden z-50 bg-[#1d0a2d] border border-pink-500/30 animate-fadeIn">
                  <div className="p-3.5 border-b border-white/10 bg-white/[0.03]">
                    <p className="text-xs font-extrabold text-white">{user.name}</p>
                    <p className="text-[10px] text-pink-200/70 truncate">{user.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { handleTabClick('Cursos'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-pink-100 hover:bg-white/10 hover:text-pink-300 rounded-xl transition-colors text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-pink-400" /> Mis Cursos en Progreso
                    </button>
                    <button
                      onClick={() => { handleTabClick('Recursos'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-pink-100 hover:bg-white/10 hover:text-amber-300 rounded-xl transition-colors text-left"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Mis Certificados
                    </button>
                    <Link
                      href="/academia/admin"
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-pink-100 hover:bg-white/10 hover:text-pink-300 rounded-xl transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 text-pink-400" /> Panel Académico / Admin
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-white/10">
                    <button
                      onClick={() => { onLogout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-300 hover:bg-red-950/40 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-bold text-pink-100 hover:text-pink-300 px-2 sm:px-3 py-1.5 transition-colors cursor-pointer"
              >
                Ingresar
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-gradient-to-r from-[#E12880] to-[#7B1FA2] hover:from-[#c2185b] hover:to-[#4a148c] text-white font-extrabold text-xs px-3 sm:px-4 py-2 rounded-full shadow-lg shadow-pink-600/30 transition-all flex items-center gap-1.5 cursor-pointer border border-pink-300/30 hover:scale-105 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Registrarme Gratis</span>
                <span className="sm:hidden">Registro</span>
              </button>
            </div>
          )}

          {/* Main Website Link */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-pink-200/70 hover:text-white bg-white/[0.04] hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all"
            title="Volver a la Fundación"
          >
            <span>Web Senda</span>
            <ExternalLink className="w-3 h-3 text-pink-300" />
          </Link>
        </div>


      </div>
    </header>
  );
}
