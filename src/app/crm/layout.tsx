'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CrmAuthProvider,
  useCrmAuth,
} from '@/lib/crm/client';
import {
  LayoutDashboard,
  Users,
  Home,
  FileHeart,
  Layers,
  CalendarDays,
  HeartHandshake,
  DollarSign,
  UserCheck,
  Award,
  Package,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  Shield,
  Bell,
  Search,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  module: string;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Panel General',         href: '/crm',               icon: LayoutDashboard, module: 'dashboard',      group: 'Principal' },
  { label: 'Personas',              href: '/crm/personas',      icon: Users,           module: 'personas',       group: 'Atención Social' },
  { label: 'Hogares',               href: '/crm/hogares',       icon: Home,            module: 'hogares',        group: 'Atención Social' },
  { label: 'Casos y Expedientes',   href: '/crm/casos',         icon: FileHeart,       module: 'casos',          group: 'Atención Social' },
  { label: 'Programas',             href: '/crm/programas',     icon: Layers,          module: 'programas',      group: 'Programas' },
  { label: 'Operaciones y Eventos', href: '/crm/operaciones',   icon: CalendarDays,    module: 'operaciones',    group: 'Programas' },
  { label: 'Voluntariado',          href: '/crm/voluntarios',   icon: UserCheck,       module: 'voluntarios',    group: 'Programas' },
  { label: 'Donantes y Fondos',     href: '/crm/donantes',      icon: HeartHandshake,  module: 'donantes',       group: 'Finanzas' },
  { label: 'Finanzas y Gastos',     href: '/crm/finanzas',      icon: DollarSign,      module: 'finanzas',       group: 'Finanzas' },
  { label: 'Subvenciones',          href: '/crm/subvenciones',  icon: Award,           module: 'subvenciones',   group: 'Finanzas' },
  { label: 'Activos y Ayudas',      href: '/crm/activos',       icon: Package,         module: 'activos',        group: 'Operativo' },
  { label: 'Tareas y Alertas',      href: '/crm/tareas',        icon: CheckSquare,     module: 'tareas',         group: 'Operativo' },
  { label: 'Impacto Social',        href: '/crm/impacto',       icon: BarChart3,       module: 'impacto',        group: 'Análisis' },
  { label: 'Configuración',         href: '/crm/configuracion', icon: Settings,        module: 'configuracion',  group: 'Análisis' },
];

const GROUP_ORDER = ['Principal', 'Atención Social', 'Programas', 'Finanzas', 'Operativo', 'Análisis'];

const ROLE_MAP: Record<string, { label: string; color: string; dot: string }> = {
  SUPER_ADMIN:       { label: 'Super Administrador', color: 'text-purple-300 bg-purple-900/50 border-purple-700/50', dot: 'bg-purple-400' },
  DIRECTORA:         { label: 'Directora',           color: 'text-rose-300 bg-rose-900/50 border-rose-700/50',       dot: 'bg-rose-400' },
  COORDINADOR:       { label: 'Coordinador(a)',       color: 'text-indigo-300 bg-indigo-900/50 border-indigo-700/50', dot: 'bg-indigo-400' },
  TRABAJADOR_SOCIAL: { label: 'Trabajo Social',      color: 'text-amber-300 bg-amber-900/50 border-amber-700/50',    dot: 'bg-amber-400' },
  PSICOLOGO:         { label: 'Psicología',           color: 'text-emerald-300 bg-emerald-900/50 border-emerald-700/50', dot: 'bg-emerald-400' },
  ABOGADO:           { label: 'Asesoría Jurídica',   color: 'text-blue-300 bg-blue-900/50 border-blue-700/50',       dot: 'bg-blue-400' },
  GESTOR_PROGRAMAS:  { label: 'Gestión Programas',   color: 'text-teal-300 bg-teal-900/50 border-teal-700/50',       dot: 'bg-teal-400' },
  GESTOR_DONANTES:   { label: 'Recaudación',          color: 'text-pink-300 bg-pink-900/50 border-pink-700/50',       dot: 'bg-pink-400' },
  GESTOR_FINANCIERO: { label: 'Finanzas',             color: 'text-cyan-300 bg-cyan-900/50 border-cyan-700/50',       dot: 'bg-cyan-400' },
  VOLUNTARIO:        { label: 'Voluntariado',         color: 'text-lime-300 bg-lime-900/50 border-lime-700/50',       dot: 'bg-lime-400' },
  CONSULTA:          { label: 'Solo Consulta',        color: 'text-slate-300 bg-slate-800/50 border-slate-700/50',    dot: 'bg-slate-400' },
};

function CrmNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isFirstRun, logout, canAccess } = useCrmAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Salida rápida ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.href = 'https://www.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isAuthRoute = pathname === '/crm/login' || pathname === '/crm/setup';
  if (isAuthRoute) return null;

  // Loading screen — evita redirect prematuro
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0b0f1a] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-xl shadow-2xl shadow-rose-500/40">
              SM
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0b0f1a] animate-pulse" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-300 text-sm font-medium mb-1">
              <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
              Verificando sesión...
            </div>
            <p className="text-xs text-slate-500">CRM · Fundación Senda Mujer</p>
          </div>
        </div>
      </div>
    );
  }

  if (isFirstRun) { router.push('/crm/setup'); return null; }
  if (!user) { router.push('/crm/login'); return null; }

  const roleInfo = ROLE_MAP[user.role] || { label: user.role, color: 'text-slate-300 bg-slate-800/50 border-slate-700', dot: 'bg-slate-400' };
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  // Agrupar ítems accesibles
  const accessibleItems = NAV_ITEMS.filter(i => canAccess(i.module));
  const groupedItems = GROUP_ORDER.reduce((acc: Record<string, NavItem[]>, g) => {
    const items = accessibleItems.filter(i => i.group === g);
    if (items.length) acc[g] = items;
    return acc;
  }, {});

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + Emergency Exit */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
        <Link href="/crm" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
            SM
          </div>
          <div>
            <div className="text-[13px] font-bold text-white leading-tight">CRM Senda Mujer</div>
            <div className="text-[10px] text-slate-500 leading-tight">Sistema Operativo Social</div>
          </div>
        </Link>
        <button
          onClick={() => (window.location.href = 'https://www.google.com')}
          title="Salida rápida de emergencia (ESC)"
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-red-400/80 bg-red-950/40 border border-red-900/40 rounded-lg hover:bg-red-900/60 hover:text-red-300 transition-all"
        >
          <ShieldAlert className="w-3 h-3" />
          ESC
        </button>
      </div>

      {/* User Profile Card */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 border border-slate-600/50">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md border mt-0.5 ${roleInfo.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${roleInfo.dot}`} />
              {roleInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            <div className="px-2 pb-1.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {group}
            </div>
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/crm'
                  ? pathname === '/crm'
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all group ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-400/70 flex-shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: Logout + Shield */}
      <div className="px-4 py-3 border-t border-slate-800/80 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-900/60 rounded-lg border border-slate-800/60">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] text-slate-500">Auditoría activa · Ley 1581/2012</span>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/50 hover:border-rose-900/40 rounded-lg text-xs font-medium transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#0b0f1a] border-b border-slate-800 px-4 py-3">
        <Link href="/crm" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-xs">SM</div>
          <span className="text-sm font-bold text-white">Senda CRM</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (window.location.href = 'https://www.google.com')}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-900/40 rounded-md"
          >
            <ShieldAlert className="w-3 h-3" />
            ESC
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 bg-[#0b0f1a] border-r border-slate-800/80 flex-col">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0b0f1a] border-r border-slate-800 flex flex-col lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}

/* Top bar shown on dashboard pages (search + notifications) */
function CrmTopBar() {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/crm/login' || pathname === '/crm/setup';
  if (isAuthRoute) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-[#0b0f1a]/80 backdrop-blur-sm border-b border-slate-800/60 sticky top-0 z-30">
      <p className="text-xs text-slate-500 capitalize">{dateStr}</p>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar en el CRM..."
            className="pl-8 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 w-52 transition-all"
          />
        </div>
        <button className="relative p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const isAuthRoute = typeof window !== 'undefined'
    ? window.location.pathname === '/crm/login' || window.location.pathname === '/crm/setup'
    : false;

  return (
    <CrmAuthProvider>
      <div className="min-h-screen bg-[#0d1117] text-slate-100 antialiased">
        <CrmNavigation />
        <div className="lg:pl-60 flex flex-col min-h-screen">
          <CrmTopBar />
          <main className="flex-1 pt-14 lg:pt-0">
            <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </CrmAuthProvider>
  );
}
