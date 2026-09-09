'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Home,
  ShieldCheck,
  Menu,
  X,
  BarChart3,
  Stethoscope,
} from 'lucide-react';

/** Barrios activos en el módulo de encuestadoras */
const BARRIOS = [
  {
    slug: 'arroz-barato',
    nombre: 'Arroz Barato',
    localidad: 'Localidad 3 — Industrial y de la Bahía',
    estado: 'ACTIVO',
    descripcion: 'Jornada Cívica y Médica "Arroz Barato, Derechos y Vida Digna"',
    color: 'from-pink-600 to-purple-700',
    dot: 'bg-emerald-400',
  },
  {
    slug: 'nelson-mandela',
    nombre: 'Nelson Mandela',
    localidad: 'Localidad 4 — Industrial de Mamonal',
    estado: 'PRÓXIMO',
    descripcion: 'Jornada Cívica y Médica — Caracterización comunitaria',
    color: 'from-sky-600 to-indigo-700',
    dot: 'bg-amber-400',
  },
];

export default function EncuestasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0118] text-white flex">

      {/* ── Sidebar Desktop ──────────────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-300 bg-[#120225] border-r border-purple-900/50 ${
          sidebarOpen ? 'w-72' : 'w-20'
        } shrink-0 min-h-screen sticky top-0`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-purple-900/40">
          {sidebarOpen && (
            <Link href="/encuestas" className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-700 shadow">
                <ClipboardList className="h-4 w-4 text-amber-200" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-black tracking-widest text-white">ENCUESTAS</p>
                <p className="text-[9px] font-bold tracking-wider text-pink-300 truncate">
                  FUNDACIÓN SENDA MUJER
                </p>
              </div>
            </Link>
          )}
          {!sidebarOpen && (
            <Link href="/encuestas" className="mx-auto">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-700 shadow">
                <ClipboardList className="h-4 w-4 text-amber-200" />
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-1.5 rounded-lg hover:bg-purple-800/40 text-purple-300 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navegación Principal */}
        <div className="px-3 pt-4 pb-2 space-y-1.5">
          <Link
            href="/encuestas"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname === '/encuestas' || pathname.startsWith('/encuestas/arroz-barato') || pathname.startsWith('/encuestas/nelson-mandela')
                ? 'bg-purple-800/60 text-white'
                : 'text-purple-300 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            <Home className="h-4 w-4 shrink-0 text-pink-400" />
            {sidebarOpen && <span>Fichas de Campo</span>}
          </Link>

          <Link
            href="/analisis-encuentas"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname.startsWith('/analisis-encuentas')
                ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-md'
                : 'text-amber-300 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0 text-amber-300" />
            {sidebarOpen && (
              <div className="flex items-center justify-between flex-1">
                <span>Análisis Clínico & Censo</span>
                <span className="text-[9px] font-black bg-amber-400 text-purple-950 px-1.5 py-0.5 rounded-md">
                  BI
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Separador */}
        {sidebarOpen && (
          <p className="px-5 py-2 text-[9px] font-black uppercase tracking-widest text-purple-500">
            Barrios activos
          </p>
        )}

        {/* Lista de barrios */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto pb-4">
          {BARRIOS.map((b) => {
            const active = pathname.startsWith(`/encuestas/${b.slug}`);
            return (
              <Link
                key={b.slug}
                href={`/encuestas/${b.slug}`}
                className={`group flex items-start gap-3 px-3 py-3 rounded-2xl transition-all ${
                  active
                    ? 'bg-purple-800/70 border border-purple-600/50 shadow-lg'
                    : 'hover:bg-purple-900/40 border border-transparent'
                }`}
              >
                <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${b.dot} ring-2 ring-black/40`} />
                {sidebarOpen && (
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white leading-tight">{b.nombre}</p>
                    <p className="text-[10px] text-purple-300 leading-tight mt-0.5 truncate">
                      {b.localidad}
                    </p>
                    <span
                      className={`mt-1.5 inline-block text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full ${
                        b.estado === 'ACTIVO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.estado}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        {sidebarOpen && (
          <div className="border-t border-purple-900/40 px-4 py-4 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-purple-400">
              <Stethoscope className="h-3.5 w-3.5 text-pink-400 shrink-0" />
              <span>Soporte Médico & Ginecológico</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-purple-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Datos protegidos · Ley 1581/2012</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-purple-400">
              <MapPin className="h-3.5 w-3.5 text-pink-400 shrink-0" />
              <span>Cartagena de Indias, D.T. y C.</span>
            </div>
          </div>
        )}
      </aside>

      {/* ── Mobile overlay sidebar ───────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#120225] border-r border-purple-900/50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-purple-900/40">
              <Link href="/encuestas" className="flex items-center gap-2.5" onClick={() => setMobileSidebarOpen(false)}>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-700">
                  <ClipboardList className="h-4 w-4 text-amber-200" />
                </span>
                <div>
                  <p className="text-[11px] font-black tracking-widest text-white">ENCUESTAS</p>
                  <p className="text-[9px] font-bold tracking-wider text-pink-300">FUNDACIÓN SENDA MUJER</p>
                </div>
              </Link>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-purple-800/40 text-purple-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-3 pt-3 space-y-1.5">
              <Link
                href="/encuestas"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-purple-800/60 text-white"
              >
                <Home className="h-4 w-4 text-pink-400" />
                <span>Fichas de Campo</span>
              </Link>
              <Link
                href="/analisis-encuentas"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-700 text-white"
              >
                <BarChart3 className="h-4 w-4 text-amber-300" />
                <span>Análisis Clínico & Censo</span>
              </Link>
            </div>

            <p className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-purple-500">Barrios activos</p>
            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto pb-4">
              {BARRIOS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/encuestas/${b.slug}`}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-start gap-3 px-3 py-3 rounded-2xl border transition-all ${
                    pathname.startsWith(`/encuestas/${b.slug}`)
                      ? 'bg-purple-800/70 border-purple-600/50'
                      : 'border-transparent hover:bg-purple-900/40'
                  }`}
                >
                  <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${b.dot}`} />
                  <div>
                    <p className="text-sm font-black text-white">{b.nombre}</p>
                    <p className="text-[10px] text-purple-300">{b.localidad}</p>
                    <span className={`mt-1 inline-block text-[9px] font-black px-2 py-0.5 rounded-full ${
                      b.estado === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>{b.estado}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Área principal ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Topbar móvil */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#120225]/95 backdrop-blur border-b border-purple-900/50">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-purple-900/50 text-purple-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-pink-400" />
            <span className="text-sm font-black tracking-wide">ENCUESTAS & ANÁLISIS</span>
          </div>
          <Link
            href="/analisis-encuentas"
            className="rounded-full border border-amber-400/50 bg-amber-400/20 px-2.5 py-1 text-[9px] font-black tracking-wider text-amber-300"
          >
            ANALÍTICA
          </Link>
        </header>

        {/* Contenido */}
        <main className="flex-1 bg-gradient-to-b from-[#140320] via-[#1C052B] to-[#0F0218]">
          {children}
        </main>
      </div>
    </div>
  );
}
