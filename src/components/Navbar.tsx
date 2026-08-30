'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldAlert, Calendar, PhoneCall, Menu, X, Heart,
  BookOpen, Lock, Stethoscope, UserCog, ChevronDown, MapPin,
  GraduationCap, Users, Scale, EyeOff, Globe, ArrowRight,
  AlertTriangle, Shield, BrainCircuit, Compass, Workflow,
} from 'lucide-react';

interface NavbarProps {
  onOpenSOS: () => void;
  onOpenIncognito?: () => void;
}

const PROGRAMAS = [
  { icon: '🌷', label: 'Mujer Acompañada', href: '/programas#programa-1' },
  { icon: '🕊️', label: 'Víctimas Violencia Sexual', href: '/programas#programa-2' },
  { icon: '🧠', label: 'Contención Psicosocial', href: '/programas#programa-3' },
  { icon: '⚕️', label: 'Ruta de Salud & Derechos', href: '/programas#programa-4' },
  { icon: '🤰', label: 'Embarazo con Apoyo', href: '/programas#programa-5' },
  { icon: '👩‍⚖️', label: 'Mujer y Justicia', href: '/programas#programa-6' },
  { icon: '🎓', label: 'Proyecto de Vida', href: '/programas#programa-7' },
];

const PORTAL_LINKS = [
  { icon: Globe, label: 'SENDA Universal', desc: 'Sistema Operativo de Derechos', href: '/senda-universal', color: 'text-purple-700' },
  { icon: Lock, label: 'Mi Expediente Seguro', desc: 'Accede a tu historial confidencial', href: '/portal-beneficiaria', color: 'text-[#E12880]' },
  { icon: GraduationCap, label: 'SendaAcademia', desc: 'Cursos y material de formación', href: '/academia', color: 'text-amber-600' },
  { icon: Stethoscope, label: 'Agendar Cita Médica', desc: 'Ginecología, Psicología, Odontología', href: '/agendar-cita', color: 'text-emerald-600' },
  { icon: BrainCircuit, label: 'Test Psicológico', desc: 'Evaluación de bienestar SENDA EVAL', href: '/triaje-psicologico', color: 'text-purple-600' },
];

export default function Navbar({ onOpenSOS, onOpenIncognito }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programasOpen, setProgramasOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const programasRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (programasRef.current && !programasRef.current.contains(e.target as Node)) setProgramasOpen(false);
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) setPortalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'} bg-white/97 backdrop-blur-md border-b border-pink-100`}>

      {/* ── Top Emergency Bar ── */}
      <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">

          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-amber-400 text-[#3B0852] font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" /> Cartagena 24/7
            </span>
            <span className="hidden md:inline text-pink-100 font-medium">
              Línea Púrpura Nacional:
            </span>
            <a href="tel:155" className="font-extrabold text-amber-300 hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> 155
            </a>
            <span className="text-pink-300 hidden md:inline">|</span>
            <a href="tel:3176575800" className="font-bold text-pink-100 hover:text-amber-300 transition-colors hidden md:inline">
              +57 317 657 5800
            </a>
          </div>

          {/* Top Portals & Incognito Bar */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Modo Incógnito Button */}
            <button
              type="button"
              onClick={onOpenIncognito || onOpenSOS}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-extrabold text-pink-200 hover:text-amber-300 transition-colors cursor-pointer px-2 py-0.5 rounded-full hover:bg-white/10"
              title="Modo Incógnito — Protege tu privacidad de navegación"
            >
              <EyeOff className="w-3.5 h-3.5 text-pink-300" />
              <span>Modo Incógnito</span>
            </button>

            <span className="text-pink-400/60 hidden sm:inline">|</span>

            {/* 1. SendaAcademia */}
            <Link
              href="/academia"
              className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-[11px] font-extrabold px-2.5 py-1 rounded-full transition-all shadow-xs"
              title="Cursos, talleres y capacitaciones de formación"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>SendaAcademia</span>
            </Link>

            {/* 2. Portal Usuarias (Abre en pestaña nueva con control de sesión por pestaña) */}
            <Link
              href="/portal-beneficiaria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/30 text-[11px] font-extrabold px-2.5 py-1 rounded-full transition-all shadow-xs"
              title="Expediente confidencial (Abre en ventana independiente con auto-cierre de sesión)"
            >
              <Lock className="w-3.5 h-3.5 text-pink-300" />
              <span>Portal Usuarias ↗</span>
            </Link>

            {/* 3. Portal Profesional (Abre en pestaña nueva con control de sesión por pestaña) */}
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-purple-500/30 hover:bg-purple-500/40 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold px-2.5 py-1 rounded-full transition-all shadow-xs"
              title="Panel profesional (Abre en ventana independiente con auto-cierre de sesión)"
            >
              <UserCog className="w-3.5 h-3.5 text-emerald-300" />
              <span>Portal Profesional ↗</span>
            </Link>

          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
          <div className="relative w-40 h-11 sm:w-52 sm:h-13 transition-transform group-hover:scale-[1.02]">
            <Image src="/logo.png" alt="Fundación Senda Mujer" fill className="object-contain" priority />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#52166F]">

          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">Inicio</Link>
          <Link href="/nosotros" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all">Nosotros</Link>

          {/* Programas Mega-Dropdown */}
          <div ref={programasRef} className="relative">
            <button
              type="button"
              onClick={() => { setProgramasOpen(!programasOpen); setPortalOpen(false); }}
              className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all flex items-center gap-1 cursor-pointer"
            >
              Programas
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${programasOpen ? 'rotate-180' : ''}`} />
            </button>

            {programasOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-pink-100 p-3 z-50 animate-fadeIn">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 mb-2">7 Programas Integrales</p>
                {PROGRAMAS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setProgramasOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pink-50 transition-all group"
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-[#E12880] transition-colors">{p.label}</span>
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-pink-50">
                  <Link href="/programas" onClick={() => setProgramasOpen(false)} className="flex items-center justify-between px-3 py-2 text-xs font-extrabold text-[#E12880] hover:text-[#52166F] transition-colors">
                    Ver todos los programas <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>


          {/* SENDA Universal Flagship */}
          <Link href="/senda-universal" className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-extrabold flex items-center gap-1.5 transition-all hover:shadow-sm">
            <Globe className="w-3.5 h-3.5 text-purple-700" />
            <span>SENDA Universal</span>
          </Link>
          <Link href="/triaje-psicologico" className="px-3 py-2 rounded-lg hover:bg-pink-50 text-[#E12880] flex items-center gap-1 transition-all">
            <BrainCircuit className="w-3.5 h-3.5 text-[#E12880]" />
            Test Psicológico
          </Link>
          <Link href="/ruta-cartagena" className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] flex items-center gap-1 transition-all">
            <MapPin className="w-3.5 h-3.5" />
            Ruta Cartagena
          </Link>
          <Link href="/donar" className="px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-600 font-bold flex items-center gap-1 transition-all">
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Donar
          </Link>
        </nav>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          {/* SOS Panic Button — always visible, pulsing */}
          <button
            type="button"
            onClick={onOpenSOS}
            className="relative flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-2 rounded-full text-[11px] shadow-md transition-all cursor-pointer animate-pulse-glow"
            title="Activa modo camuflaje de emergencia [ESC]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS</span>
          </button>

          <Link
            href="/agendar-cita"
            className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Cita</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSOS}
            className="p-2 bg-red-600 rounded-full text-white animate-pulse cursor-pointer"
            title="SOS"
          >
            <ShieldAlert className="w-5 h-5" />
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
        <div className="lg:hidden bg-white border-t border-pink-100 px-5 py-5 space-y-1 shadow-xl animate-fadeIn">
          {([
            { href: '/', label: '🏠 Inicio' },
            { href: '/senda-universal', label: '🌍 SENDA Universal (Sistema Operativo)' },
            { href: '/academia', label: '🎓 1. SendaAcademia (Cursos & Formación)' },
            { href: '/portal-beneficiaria', label: '🔒 2. Portal de Gestión de Usuarias' },
            { href: '/admin', label: '👩‍⚕️ 3. Portal de Gestión de Profesionales' },
            { href: '/programas', label: '7 Programas Integrales' },
            { href: '/triaje-psicologico', label: 'Test Psicológico SENDA EVAL' },
            { href: '/ruta-cartagena', label: 'Ruta de Emergencia Cartagena' },
            { href: '/donar', label: 'Portal de Donaciones' },
          ] as Array<{ href: string; label: string; accent?: boolean; amber?: boolean }>).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-bold text-sm text-[#52166F] transition-all hover:bg-pink-50 hover:text-[#E12880]"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-pink-100 space-y-2">
            <Link
              href="/portal-beneficiaria"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl bg-pink-50 border border-pink-100 font-bold text-sm text-[#52166F]"
            >
              <Lock className="w-4 h-4 text-amber-500" />
              Portal Beneficiaria — SendaPass ↗
            </Link>
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-sm text-slate-700"
            >
              <UserCog className="w-4 h-4 text-emerald-500" />
              Panel Profesional
            </Link>
            <Link
              href="/agendar-cita"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Agendar Cita Médica
            </Link>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenIncognito ? onOpenIncognito() : onOpenSOS(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-800 text-white font-extrabold text-sm cursor-pointer"
            >
              <EyeOff className="w-4 h-4" />
              Modo Incógnito
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenSOS(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-red-600 text-white font-extrabold text-sm shadow-md cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" />
              ACTIVAR CAMUFLAJE SOS [ESC]
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
