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
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  module: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Panel General', href: '/crm', icon: LayoutDashboard, module: 'dashboard' },
  { label: 'Personas', href: '/crm/personas', icon: Users, module: 'personas' },
  { label: 'Hogares', href: '/crm/hogares', icon: Home, module: 'hogares' },
  { label: 'Casos y Expedientes', href: '/crm/casos', icon: FileHeart, module: 'casos' },
  { label: 'Programas (CAM/THEMIS)', href: '/crm/programas', icon: Layers, module: 'programas' },
  { label: 'Operaciones y Eventos', href: '/crm/operaciones', icon: CalendarDays, module: 'operaciones' },
  { label: 'Donantes y Fondos', href: '/crm/donantes', icon: HeartHandshake, module: 'donantes' },
  { label: 'Finanzas y Gastos', href: '/crm/finanzas', icon: DollarSign, module: 'finanzas' },
  { label: 'Voluntariado', href: '/crm/voluntarios', icon: UserCheck, module: 'voluntarios' },
  { label: 'Subvenciones', href: '/crm/subvenciones', icon: Award, module: 'subvenciones' },
  { label: 'Activos y Ayudas', href: '/crm/activos', icon: Package, module: 'activos' },
  { label: 'Tareas y Alertas', href: '/crm/tareas', icon: CheckSquare, module: 'tareas' },
  { label: 'Impacto Social', href: '/crm/impacto', icon: BarChart3, module: 'impacto' },
  { label: 'Configuración y Roles', href: '/crm/configuracion', icon: Settings, module: 'configuracion' },
];

function CrmNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isFirstRun, logout, canAccess } = useCrmAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Escuchar tecla ESC para salida rápida de emergencia / modo camuflaje
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Redireccionar instantáneamente al buscador general de Google o portada neutral
        window.location.href = 'https://www.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Si está en setup o login, no mostrar la barra lateral
  const isAuthRoute = pathname === '/crm/login' || pathname === '/crm/setup';

  if (isAuthRoute) {
    return null;
  }

  // Si no está autenticado y terminó de cargar
  if (!loading && !user && !isFirstRun) {
    router.push('/crm/login');
    return null;
  }

  if (isFirstRun) {
    router.push('/crm/setup');
    return null;
  }

  const roleLabelMap: Record<string, { label: string; color: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'bg-purple-600 text-white' },
    DIRECTORA: { label: 'Directora', color: 'bg-rose-600 text-white' },
    COORDINADOR: { label: 'Coordinador(a)', color: 'bg-indigo-600 text-white' },
    TRABAJADOR_SOCIAL: { label: 'Trabajo Social', color: 'bg-amber-600 text-white' },
    PSICOLOGO: { label: 'Psicología', color: 'bg-emerald-600 text-white' },
    ABOGADO: { label: 'Asesoría Jurídica', color: 'bg-blue-600 text-white' },
    GESTOR_PROGRAMAS: { label: 'Gestión Programas', color: 'bg-teal-600 text-white' },
    GESTOR_DONANTES: { label: 'Recaudación', color: 'bg-pink-600 text-white' },
    GESTOR_FINANCIERO: { label: 'Finanzas', color: 'bg-cyan-600 text-white' },
    VOLUNTARIO: { label: 'Voluntariado', color: 'bg-lime-700 text-white' },
    CONSULTA: { label: 'Solo Consulta', color: 'bg-slate-600 text-white' },
  };

  const currentRoleInfo = user ? roleLabelMap[user.role] || { label: user.role, color: 'bg-slate-600 text-white' } : null;

  const accessibleNavItems = NAV_ITEMS.filter((item) => canAccess(item.module));

  return (
    <>
      {/* Barra superior Mobile */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-white text-sm shadow-md">
            SM
          </div>
          <span className="font-bold text-sm tracking-tight">Senda CRM</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => (window.location.href = 'https://www.google.com')}
            className="px-2 py-1 bg-red-600/90 text-white text-xs font-semibold rounded flex items-center gap-1 shadow hover:bg-red-700"
            title="Salida rápida de emergencia"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            ESC
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop y Drawer Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link href="/crm" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                SM
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
                  CRM Senda Mujer
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Sistema Operativo Social</span>
              </div>
            </Link>
            <button
              onClick={() => (window.location.href = 'https://www.google.com')}
              className="hidden lg:flex px-1.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-900/50 bg-red-950/40 rounded hover:bg-red-900/60 transition-colors"
              title="Salida rápida de emergencia (Presiona tecla ESC)"
            >
              [ESC]
            </button>
          </div>

          {/* User Role Card */}
          {user && (
            <div className="mx-3 my-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-inner">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-semibold text-xs border border-slate-600">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded font-medium ${currentRoleInfo?.color}`}>
                    {currentRoleInfo?.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items List */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
            {accessibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/crm' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/50 hover:border-rose-900/50 rounded-lg text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmAuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
        <CrmNavigation />
        <main className="flex-1 lg:pl-64 min-w-0 flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </CrmAuthProvider>
  );
}
