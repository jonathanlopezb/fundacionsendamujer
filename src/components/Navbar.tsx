'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert, Calendar, PhoneCall, Menu, X, Heart, Sparkles, UserCheck, BookOpen, Image as ImageIcon, Lock, Stethoscope, UserCog } from 'lucide-react';

interface NavbarProps {
  onOpenSOS: () => void;
}

export default function Navbar({ onOpenSOS }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all">
      {/* Top Emergency & Cartagena Bar */}
      <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white text-xs py-2 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="bg-amber-400 text-senda-purple-dark font-extrabold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            Cartagena 24/7
          </span>
          <span className="hidden md:inline text-pink-100">
            Línea Púrpura Cartagena & Urgencias Ginecológicas:
          </span>
          <a
            href="tel:3176575800"
            className="font-bold underline flex items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <PhoneCall className="w-3 h-3" /> 317 657 5800 / 155
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/portal-beneficiaria"
            className="hidden sm:flex items-center space-x-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Mi Expediente Confidencial</span>
          </Link>
          <Link href="/portal-beneficiaria"
            className="hidden sm:flex items-center space-x-1 text-[11px] font-bold text-pink-200 hover:text-white transition-colors"
          >
            <UserCog className="w-3 h-3 text-emerald-400" />
            <span>Panel Profesional</span>
          </Link>
          <Link
            href="/admin"
            className="hidden sm:flex items-center space-x-1 text-[11px] font-bold text-pink-200 hover:text-white transition-colors"
          >
            <UserCog className="w-3 h-3 text-emerald-400" />
            <span>Panel Profesional</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-44 h-12 sm:w-56 sm:h-14 transition-transform group-hover:scale-[1.02]">
            <Image
              src="/logo.png"
              alt="Fundación Senda Mujer"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-5 text-xs font-bold text-senda-purple">
          <Link href="/" className="hover:text-senda-pink transition-colors">
            Inicio
          </Link>
          <Link href="/nosotros" className="hover:text-senda-pink transition-colors">
            Nosotros
          </Link>
          <Link href="/programas" className="hover:text-senda-pink transition-colors">
            Programas (7)
          </Link>
          <Link href="/triaje-psicologico" className="text-senda-pink hover:underline flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Test Psicológico
          </Link>
          <Link href="/galeria" className="hover:text-senda-pink flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-senda-purple" />
            Galería
          </Link>
          <Link href="/donar" className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Donar
          </Link>
        </nav>

        {/* CTA Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link
            href="/agendar-cita"
            className="bg-gradient-to-r from-senda-pink to-senda-purple text-white font-bold px-5 py-2.5 rounded-full shadow-glass-pink hover:shadow-glow transition-all flex items-center space-x-2 text-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Cita Ginecología / Médica</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-senda-purple hover:bg-pink-50 transition-colors cursor-pointer"
            aria-label="Abrir Menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-pink-100 px-6 py-6 space-y-4 shadow-xl font-medium text-senda-purple text-sm">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-senda-pink"
          >
            Inicio
          </Link>
          <Link
            href="/nosotros"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-senda-pink"
          >
            Nosotros
          </Link>
          <Link
            href="/programas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-senda-pink"
          >
            Los 7 Programas Integrales
          </Link>
          <Link
            href="/triaje-psicologico"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold text-senda-pink flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Test Psicológico & Triaje
          </Link>
          <Link
            href="/portal-beneficiaria"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-bold text-senda-purple flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-500" />
            Portal de Beneficiarias (SendaPass)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-slate-700 flex items-center gap-2"
          >
            <UserCog className="w-4 h-4 text-emerald-600" />
            Panel Profesional & Gestión
          </Link>
          <Link
            href="/galeria"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 hover:text-senda-pink flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-senda-purple" />
            Galería de Actividades Cartagena
          </Link>
          <Link
            href="/donar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-amber-600 font-bold flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
            Portal de Donaciones
          </Link>

          <div className="pt-4 border-t border-pink-100 flex flex-col space-y-3">
            <Link
              href="/agendar-cita"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-senda-pink text-white font-bold py-3 rounded-full text-center shadow-md flex items-center justify-center space-x-2 text-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita (Ginecología, Medicina, Odontología)</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSOS();
              }}
              className="bg-amber-400 text-senda-purple-dark font-extrabold py-3 rounded-full text-center flex items-center justify-center space-x-2 text-xs cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>ACTIVAR CAMUFLAJE SOS [ESC]</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
