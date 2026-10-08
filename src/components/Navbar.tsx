'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
  onOpenSOS: () => void;
  onOpenIncognito?: () => void;
}

export default function Navbar({ onOpenSOS, onOpenIncognito }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programasOpen, setProgramasOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const programasRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage, t } = useLanguage();

  // Inicializar modo oscuro desde localStorage / preferencia del sistema
  useEffect(() => {
    const stored = localStorage.getItem('senda-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('senda-theme', next ? 'dark' : 'light');
  };

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

  const navItems = [
    { href: '/#necesidades', label: t('nav.help') },
    { href: '/#programas', label: t('nav.how_we_help') },
    { href: '/modelos', label: t('nav.models') },
    { href: '/#senda-caribe', label: t('nav.senda_caribe') },
    { href: '/#impacto', label: t('nav.impact') },
    { href: '/#historias', label: t('nav.stories') },
    { href: '/nosotros', label: t('nav.about') },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''} ${isDark ? 'bg-[#1a0d2e]/95 border-[#3b1f52]/80' : 'bg-[#fbf8f3]/95 border-[#ddd4ca]/80'} backdrop-blur-md border-b`}>

      {/* ── Top Emergency & Portals Bar ── */}
      <div className="bg-[#312826] text-[#f9f2eb] text-xs py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-extrabold text-[10px] uppercase tracking-wider">
              Cartagena 24/7
            </span>
            <span className="text-[#d6c4bb] font-medium">
              {t('nav.top_emergency')}
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
              {t('nav.top_incognito')}
            </button>

            <span className="text-white/30">|</span>

            <Link
              href="/academia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e7c49c] hover:text-white text-[11px] font-extrabold transition-all"
            >
              {t('nav.top_academia')}
            </Link>

            <Link
              href="/portal-beneficiaria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f3d9de] hover:text-white text-[11px] font-extrabold transition-all"
            >
              {t('nav.top_user_portal')}
            </Link>

            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c4d9c8] hover:text-white text-[11px] font-extrabold transition-all"
            >
              {t('nav.top_pro_portal')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between gap-4">

        {/* Logo — se adapta al modo día/noche */}
        <Link href="/" className="flex items-center shrink-0 group h-16 sm:h-20 lg:h-24 py-1">
          <img
            src={isDark ? '/logo-white.jpg' : '/logo.png'}
            alt="Fundación Senda Mujer"
            className="h-full w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 text-[13px] font-bold text-[#544e48]" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-[#6E3F58] transition-colors ${isDark ? 'text-slate-200 hover:text-white' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Language Switcher ES | EN */}
          <button
            type="button"
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-all cursor-pointer ${
              isDark
                ? 'bg-purple-950/80 border-purple-700 text-pink-300 hover:bg-purple-900'
                : 'bg-[#EEE6DF] border-[#ddd4ca] text-[#6E3F58] hover:bg-[#E6D8CE]'
            }`}
            title="Cambiar idioma / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-[#E12880]" />
            <span>{language === 'es' ? 'ES | EN' : 'EN | ES'}</span>
          </button>

          {/* Toggle día/noche */}
          <button
            type="button"
            onClick={toggleDark}
            className={`p-2 rounded-full border transition-all cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' : 'bg-[#f0ebe5] border-[#ddd4ca] text-slate-600 hover:bg-[#e6ddd6]'}`}
            title={isDark ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenSOS}
            className="bg-[#2a2523] hover:bg-[#4e2c40] text-white font-extrabold px-3.5 py-2 rounded-full text-[11px] shadow-md transition-all cursor-pointer"
            title="Activa modo camuflaje de emergencia [ESC]"
          >
            {t('nav.sos')}
          </button>

          <Link href="/donar" className="bg-[#EEE6DF] text-[#6E3F58] font-bold px-5 py-2.5 rounded-full hover:bg-[#E6D8CE] transition-all text-xs">
            {t('nav.donate')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Language Switcher Mobile */}
          <button
            type="button"
            onClick={toggleLanguage}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold transition-all cursor-pointer ${
              isDark ? 'bg-purple-950 border-purple-700 text-pink-300' : 'bg-[#EEE6DF] border-[#ddd4ca] text-[#6E3F58]'
            }`}
          >
            {language.toUpperCase()}
          </button>

          {/* Toggle día/noche móvil */}
          <button
            type="button"
            onClick={toggleDark}
            className={`p-1.5 rounded-full border transition-all cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-[#f0ebe5] border-[#ddd4ca] text-slate-600'}`}
            title={isDark ? 'Modo Día' : 'Modo Noche'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onOpenSOS}
            className="px-3 py-1.5 bg-red-600 rounded-full text-white text-xs font-black animate-pulse cursor-pointer"
            title="SOS"
          >
            {t('nav.sos')}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-pink-300 hover:bg-slate-800' : 'text-[#52166F] hover:bg-pink-50'}`}
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
          <aside className={`absolute right-0 top-0 flex h-[100dvh] w-full flex-col overflow-y-auto px-5 pb-6 pt-5 shadow-2xl animate-mobile-drawer ${isDark ? 'bg-[#1a0d2e]' : 'bg-[#fbf8f3]'}`}>
            <div className="mb-5 flex items-center justify-between border-b border-pink-100 pb-4">
              <div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#E12880]">Fundación Senda Mujer</p><h2 className={`mt-1 text-lg font-black ${isDark ? 'text-white' : 'text-[#52166F]'}`}>Menú principal</h2></div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" className={`grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-[#E12880] ${isDark ? 'bg-slate-800 text-pink-300 hover:bg-slate-700' : 'bg-slate-100 text-[#52166F] hover:bg-pink-50'}`}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 space-y-1" aria-label="Navegación móvil">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark ? 'text-pink-200 hover:bg-slate-800 hover:text-white' : 'text-[#52166F] hover:bg-pink-50 hover:text-[#E12880]'}`}
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
                <span>{t('nav.donate')}</span>
              </Link>

              <div className="mt-4 space-y-2 border-t border-pink-100 pt-4">
                <Link
                  href="/agendar-cita"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold text-sm shadow-md"
                >
                  {t('nav.appointment')}
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onOpenIncognito ? onOpenIncognito() : onOpenSOS(); }}
                  className="w-full text-center py-3 rounded-full bg-slate-800 text-white font-extrabold text-sm cursor-pointer"
                >
                  {t('nav.top_incognito')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onOpenSOS(); }}
                  className="w-full text-center py-3 rounded-full bg-red-600 text-white font-extrabold text-sm shadow-md cursor-pointer"
                >
                  {t('nav.sos_action')}
                </button>
              </div>
            </nav>
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-[10px] leading-relaxed text-slate-400">{t('nav.esc_hint')}</p>
          </aside>
        </div>
      )}
    </header>
  );
}
