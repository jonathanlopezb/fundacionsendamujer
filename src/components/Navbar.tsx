'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenSOS: () => void;
  onOpenIncognito?: () => void;
}

const PROGRAMAS = [
  { label: 'Mujer Acompañada', href: '/programas#programa-1' },
  { label: 'Víctimas Violencia Sexual', href: '/programas#programa-2' },
  { label: 'Contención Psicosocial', href: '/programas#programa-3' },
  { label: 'Ruta de Salud & Derechos', href: '/programas#programa-4' },
  { label: 'Embarazo con Apoyo', href: '/programas#programa-5' },
  { label: 'Mujer y Justicia', href: '/programas#programa-6' },
  { label: 'Proyecto de Vida', href: '/programas#programa-7' },
];

export default function Navbar({ onOpenSOS, onOpenIncognito }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programasOpen, setProgramasOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const programasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (programasRef.current && !programasRef.current.contains(e.target as Node)) {
        setProgramasOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'} bg-white/97 backdrop-blur-md border-b border-pink-100`}>

      {/* ── Top Emergency & Portals Bar ── */}
      <div className="bg-[#312826] text-[#f9f2eb] text-xs py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-extrabold text-[10px] uppercase tracking-wider">
              Cartagena 24/7
            </span>
            <span className="text-[#d6c4bb] font-medium">
              Línea Púrpura Nacional:
            </span>
            <a href="tel:155" className="font-extrabold text-[#e7c49c] hover:text-white transition-colors">
              155
            </a>
            <span className="text-white/30">|</span>
            <a href="tel:+573014692095" className="font-bold text-[#f9f2eb] hover:text-[#e7c49c] transition-colors">
              +57 301 469 2095
            </a>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onOpenIncognito || onOpenSOS}
              className="inline-block text-[11px] font-extrabold text-[#d6c4bb] hover:text-[#e7c49c] transition-colors cursor-pointer px-1 py-0.5"
              title="Modo Incógnito — Protege tu privacidad de navegación"
            >
              Modo Incógnito
            </button>

            <span className="text-white/30">|</span>

            <Link
              href="/academia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e7c49c] hover:text-white text-[11px] font-extrabold transition-all"
            >
              SendaAcademia ↗
            </Link>

            <Link
              href="/portal-beneficiaria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f3d9de] hover:text-white text-[11px] font-extrabold transition-all"
            >
              Portal Usuarias ↗
            </Link>

            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c4d9c8] hover:text-white text-[11px] font-extrabold transition-all"
            >
              Portal Profesional ↗
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
          <img
            src="/logo.png"
            alt="Fundación Senda Mujer"
            className="h-9 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#52166F]">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">
            Inicio
          </Link>
          <Link href="/#necesidades" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">
            Necesito ayuda
          </Link>
          <Link href="/nosotros" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">
            Nosotros
          </Link>

          {/* Programas Mega-Dropdown */}
          <div ref={programasRef} className="relative">
            <button
              type="button"
              onClick={() => setProgramasOpen(!programasOpen)}
              className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all flex items-center gap-1 cursor-pointer"
            >
              Programas
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${programasOpen ? 'rotate-180' : ''}`} />
            </button>

            {programasOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-pink-100 p-3 z-50 animate-fadeIn">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 mb-2">
                  7 Programas Integrales
                </p>
                {PROGRAMAS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setProgramasOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#E12880] transition-colors"
                  >
                    {p.label}
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-pink-50">
                  <Link
                    href="/programas"
                    onClick={() => setProgramasOpen(false)}
                    className="block px-3 py-1.5 text-xs font-extrabold text-[#E12880] hover:text-[#52166F] transition-colors"
                  >
                    Ver todos los programas →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/senda-universal" className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-extrabold transition-all hover:shadow-sm">
            SENDA Universal
          </Link>

          <Link href="/caribe-seguro" className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#3B0852] to-[#52166F] text-amber-300 font-extrabold transition-all hover:shadow-sm">
            Senda Caribe
          </Link>

          <Link href="/triaje-psicologico" className="px-3 py-2 rounded-lg hover:bg-pink-50 text-[#E12880] transition-all">
            Test Psicológico
          </Link>

          <Link href="/galeria" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">
            Galería
          </Link>

          <Link href="/#aliados" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">
            Aliados
          </Link>

          {/* Botón Donar conservando su icono de corazón */}
          <Link href="/donar" className="px-3.5 py-2 rounded-lg hover:bg-amber-50 text-amber-600 font-extrabold flex items-center gap-1.5 transition-all">
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Donar</span>
          </Link>
        </nav>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSOS}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3.5 py-2 rounded-full text-[11px] shadow-md transition-all cursor-pointer animate-pulse-glow"
            title="Activa modo camuflaje de emergencia [ESC]"
          >
            SOS
          </button>

          <Link
            href="/agendar-cita"
            className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all text-xs"
          >
            Agendar Cita
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSOS}
            className="px-3 py-1.5 bg-red-600 rounded-full text-white text-xs font-black animate-pulse cursor-pointer"
            title="SOS"
          >
            SOS
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#52166F] hover:bg-pink-50 transition-colors cursor-pointer"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menú principal">
          <button type="button" aria-label="Cerrar menú" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
          <aside className="absolute right-0 top-0 flex h-full w-full flex-col overflow-y-auto bg-white px-5 pb-6 pt-5 shadow-2xl animate-mobile-drawer sm:w-[420px]">
            <div className="mb-5 flex items-center justify-between border-b border-pink-100 pb-4">
              <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#E12880]">Fundación Senda Mujer</p><h2 className="mt-1 text-lg font-black text-[#52166F]">Menú principal</h2></div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-[#52166F] transition-colors hover:bg-pink-50 hover:text-[#E12880]"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 space-y-1" aria-label="Navegación móvil">
              {[
            { href: '/', label: 'Inicio' },
            { href: '/#necesidades', label: 'Necesito ayuda' },
            { href: '/senda-universal', label: 'SENDA Universal (Sistema Operativo)' },
            { href: '/caribe-seguro', label: 'Senda Caribe (Protección territorial)' },
            { href: '/academia', label: 'SendaAcademia (Plataforma EdTech) ↗' },
            { href: '/portal-beneficiaria', label: 'Portal de Gestión de Usuarias' },
            { href: '/admin', label: 'Portal de Gestión de Profesionales' },
            { href: '/programas', label: '7 Programas Integrales' },
            { href: '/triaje-psicologico', label: 'Test Psicológico SENDA EVAL' },
            { href: '/galeria', label: 'Galería de Impacto Social' },
            { href: '/#aliados', label: 'Nuestros Aliados Institucionales' },
              ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-bold text-sm text-[#52166F] transition-all hover:bg-pink-50 hover:text-[#E12880]"
            >
              {item.label}
            </Link>
              ))}

              <Link
            href="/donar"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-extrabold text-sm text-amber-600 hover:bg-amber-50"
          >
            <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Donar</span>
              </Link>

              <div className="mt-4 space-y-2 border-t border-pink-100 pt-4">
            <Link
              href="/agendar-cita"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-3 rounded-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold text-sm shadow-md"
            >
              Agendar Cita Médica
            </Link>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenIncognito ? onOpenIncognito() : onOpenSOS(); }}
              className="w-full text-center py-3 rounded-full bg-slate-800 text-white font-extrabold text-sm cursor-pointer"
            >
              Modo Incógnito
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenSOS(); }}
              className="w-full text-center py-3 rounded-full bg-red-600 text-white font-extrabold text-sm shadow-md cursor-pointer"
            >
              ACTIVAR CAMUFLAJE SOS [ESC]
              </button>
              </div>
            </nav>
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-[10px] leading-relaxed text-slate-400">Presiona <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">Esc</kbd> o el botón cerrar para volver al sitio.</p>
          </aside>
        </div>
      )}
    </header>
  );
}
