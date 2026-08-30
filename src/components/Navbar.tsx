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

          <div className="flex items-center gap-3">
            {/* Incognito Mode */}
            <button
              type="button"
              onClick={onOpenIncognito || onOpenSOS}
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-pink-200 hover:text-amber-300 transition-colors cursor-pointer"
              title="Modo Incógnito — Protege tu privacidad"
            >
              <EyeOff className="w-3 h-3" />
              <span>Modo Incógnito</span>
            </button>
            <span className="text-pink-400 hidden sm:inline">|</span>
            <Link href="/admin" className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-pink-200 hover:text-white transition-colors">
              <UserCog className="w-3 h-3 text-emerald-400" />
              <span>Panel Profesional</span>
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

          {/* Portal Dropdown */}
          <div ref={portalRef} className="relative">
            <button
              type="button"
              onClick={() => { setPortalOpen(!portalOpen); setProgramasOpen(false); }}
              className="px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-[#E12880] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
          {/* 1. SendaAcademia */}
          <Link
            href="/academia"
            className="px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-700 font-extrabold flex items-center gap-1.5 transition-all"
            title="Formación, cursos y capacitaciones (Beneficiarias y Profesionales)"
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>SendaAcademia</span>
          </Link>

          {/* 2. Portal de Gestión de Usuaria */}
          <Link
            href="/portal-beneficiaria"
            className="px-3 py-2 rounded-lg hover:bg-pink-50 text-[#E12880] font-extrabold flex items-center gap-1.5 transition-all"
            title="Expediente confidencial y agendamiento de citas para beneficiarias"
          >
            <Lock className="w-4 h-4 text-[#E12880]" />
            <span>Portal Usuarias</span>
          </Link>

          {/* 3. Portal de Gestión de Profesionales */}
          <Link
            href="/admin"
            className="px-3 py-2 rounded-lg hover:bg-purple-50 text-[#52166F] font-extrabold flex items-center gap-1.5 transition-all"
            title="Acceso exclusivo a médicos, psicólogas, abogadas y trabajadoras sociales"
          >
            <UserCog className="w-4 h-4 text-purple-700" />
            <span>Portal Profesional</span>
          </Link>

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
          {[
            { href: '/', label: '🏠 Inicio' },
            { href: '/senda-universal', label: '🌍 SENDA Universal (Sistema Operativo)' },
            { href: '/academia', label: '🎓 1. SendaAcademia (Cursos & Formación)' },
            { href: '/portal-beneficiaria', label: '🔒 2. Portal de Gestión de Usuarias' },
            { href: '/admin', label: '👩‍⚕️ 3. Portal de Gestión de Profesionales' },
            { href: '/programas', label: '7 Programas Integrales' },
            { href: '/triaje-psicologico', label: 'Test Psicológico SENDA EVAL' },
            { href: '/ruta-cartagena', label: 'Ruta de Emergencia Cartagena' },
            { href: '/donar', label: 'Portal de Donaciones' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-pink-50 ${item.accent ? 'text-[#E12880]' : item.amber ? 'text-amber-600' : 'text-[#52166F]'}`}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-pink-100 space-y-2">
            <Link
              href="/portal-beneficiaria"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl bg-pink-50 border border-pink-100 font-bold text-sm text-[#52166F]"
            >
              <Lock className="w-4 h-4 text-amber-500" />
              Portal Beneficiaria — SendaPass
            </Link>
            <Link
              href="/admin"
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
