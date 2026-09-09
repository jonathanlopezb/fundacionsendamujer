'use client';

/**
 * CaribeSeguroSidebar.tsx — Menú Lateral Innovador del Micrositio Caribe Seguro
 *
 * Menú lateral desplegable con diseño glassmorphic en tonos violeta, magenta y ámbar neon.
 * Incluye acceso rápido a las 12 secciones del ecosistema, indicador SOS de emergencia
 * y botón de salida rápida discreta.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, LayoutDashboard, HelpCircle, ShieldCheck, ShieldAlert,
  Route, PhoneCall, GraduationCap, Users, TrendingUp, BarChart3,
  Award, Globe, BookOpen, ChevronLeft, ChevronRight, LogOut, Lock, ExternalLink
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const MENU_GROUPS = [
  {
    title: 'OPERACIÓN Y COMANDO',
    items: [
      { href: '/caribe-seguro', label: 'Centro de Control', icon: LayoutDashboard },
      { href: '/caribe-seguro/como-funciona', label: '¿Cómo Funciona?', icon: HelpCircle },
    ],
  },
  {
    title: 'PROTECCIÓN Y RESPUESTA',
    items: [
      { href: '/caribe-seguro/proteccion', label: 'Mi Plan de Protección', icon: ShieldCheck },
      { href: '/caribe-seguro/prevencion', label: 'Prevención Comunitaria', icon: ShieldAlert },
      { href: '/caribe-seguro/rutas', label: 'Rutas de Atención', icon: Route },
      { href: '/caribe-seguro/sos', label: 'SENDA SOS (Emergencias 24/7)', icon: PhoneCall, highlight: true },
    ],
  },
  {
    title: 'RED Y CAPACIDADES',
    items: [
      { href: '/caribe-seguro/academia', label: 'Senda Academia', icon: GraduationCap },
      { href: '/caribe-seguro/red', label: 'Red Profesional', icon: Users },
    ],
  },
  {
    title: 'EVIDENCIA E IMPACTO',
    items: [
      { href: '/caribe-seguro/impacto', label: 'Motor de Impacto & KPIs', icon: TrendingUp },
      { href: '/caribe-seguro/observatorio', label: 'Observatorio en Vivo', icon: BarChart3 },
      { href: '/caribe-seguro/aliados', label: 'Caribe Seguro Certificado', icon: Award },
    ],
  },
  {
    title: 'INCIDENCIA Y COOPERACIÓN',
    items: [
      { href: '/caribe-seguro/cooperacion', label: 'Sala de Datos & Cooperación', icon: Globe },
      { href: '/caribe-seguro/investigacion', label: 'Laboratorio de Política', icon: BookOpen },
    ],
  },
];

export default function CaribeSeguroSidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const handleQuickExit = () => {
    // Salida rápida discreta redirigiendo a Google Weather / Noticias
    window.location.href = 'https://www.google.com/search?q=clima+cartagena';
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0F0218]/95 backdrop-blur-xl border-r border-purple-900/40 text-white flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* HEADER SIDEBAR */}
      <div className="p-4 border-b border-purple-900/40 flex items-center justify-between">
        <Link href="/caribe-seguro" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E12880] via-[#52166F] to-amber-400 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#180325] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          {!collapsed && (
            <div className="animate-fadeIn">
              <span className="font-black text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-amber-200 block leading-tight">
                CARIBE SEGURO
              </span>
              <span className="text-[10px] text-pink-300 font-extrabold uppercase tracking-widest block">
                MICROSITIO SENDA
              </span>
            </div>
          )}
        </Link>

        {/* BOTÓN COLAPSAR */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/30 text-pink-200 transition-colors cursor-pointer shrink-0"
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* MENÚ DE SECCIONES SCROLLABLE */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {MENU_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 text-[9px] font-black tracking-widest uppercase text-pink-400/70">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-extrabold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-lg shadow-pink-900/30 border border-pink-500/30'
                        : item.highlight
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/80 animate-pulse'
                        : 'text-pink-100/70 hover:bg-purple-900/30 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-amber-300'
                          : item.highlight
                          ? 'text-rose-400'
                          : 'text-pink-300/80 group-hover:text-amber-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER SIDEBAR — WIDGET SOS Y SALIDA DISCRETA */}
      <div className="p-3 border-t border-purple-900/40 space-y-2 bg-[#140320]">
        {!collapsed ? (
          <div className="space-y-2">
            <Link
              href="/caribe-seguro/sos"
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce text-amber-300" />
              <span>ACTIVAR SENDA SOS</span>
            </Link>

            <button
              type="button"
              onClick={handleQuickExit}
              className="w-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-[11px] py-1.5 px-3 rounded-xl border border-slate-700/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Salida Rápida Discreta
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/caribe-seguro/sos"
              title="SENDA SOS Emergencias"
              className="w-10 h-10 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse"
            >
              <PhoneCall className="w-5 h-5 text-amber-300" />
            </Link>

            <button
              type="button"
              onClick={handleQuickExit}
              title="Salida Rápida Discreta"
              className="w-10 h-10 rounded-2xl bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700/50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
