'use client';

/**
 * CaribeSeguroTopbar.tsx — Barra Superior del Dashboard Workspace
 *
 * Muestra el estado del sistema en producción, búsqueda de expediente/servicio,
 * notificaciones del sistema de deterioro y perfiles de acceso.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, Bell, Shield, Heart, User, Lock, ExternalLink, CheckCircle2,
  Sparkles, RefreshCw
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebarMobile?: () => void;
}

export default function CaribeSeguroTopbar({ onToggleSidebarMobile }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-[#140320]/80 backdrop-blur-xl border-b border-purple-900/40 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* LADO IZQUIERDO: ESTADO EN VIVO Y BÚSQUEDA */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Producción Activa — MongoDB Senda</span>
        </div>

        <div className="relative hidden lg:block w-64 xl:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar código (SM-8842), ruta o servicio..."
            className="w-full bg-purple-950/40 border border-purple-800/40 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-pink-300/40 focus:outline-none focus:ring-2 focus:ring-[#E12880]"
          />
        </div>
      </div>

      {/* LADO DERECHO: ACCESOS Y NOTIFICACIONES */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* NOTIFICACIONES */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 flex items-center justify-center text-pink-200 transition-colors relative cursor-pointer"
            title="Notificaciones de Señales y Alertas"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#E12880] absolute top-2 right-2 ring-2 ring-[#140320]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1C052B] border border-purple-800/60 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-xs animate-fadeIn">
              <div className="flex justify-between items-center border-b border-purple-900/40 pb-2">
                <span className="font-extrabold text-white">Alertas del Sistema</span>
                <span className="text-[10px] font-bold text-pink-400 bg-pink-950 px-2 py-0.5 rounded-full">2 Activas</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 space-y-1">
                  <div className="flex justify-between items-center font-bold text-amber-300 text-[11px]">
                    <span>Alerta Amarilla SM-3921</span>
                    <span className="text-[9px] text-slate-400">Hace 3 días</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">Deterioro en dimensión Seguridad Física. Revisión recomendada.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 space-y-1">
                  <div className="flex justify-between items-center font-bold text-rose-300 text-[11px]">
                    <span>Alerta Roja SM-5510</span>
                    <span className="text-[9px] text-slate-400">Ayer</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">Escalado a Capital Semilla y Casa Refugio Violeta.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCESO PORTAL BENEFICIARIA */}
        <Link
          href="/portal-beneficiaria"
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#3B0852] font-black text-xs px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Portal Beneficiaria</span>
        </Link>

        {/* VOLVER AL SITIO WEB PRINCIPAL */}
        <Link
          href="/"
          className="bg-purple-950/60 hover:bg-purple-900 border border-purple-800/50 text-pink-300 hover:text-white font-bold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Volver a la web principal de la Fundación Senda Mujer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Volver a Web Principal</span>
        </Link>

        {/* ACCESO PANEL ADMINISTRATIVO */}
        <Link
          href="/admin"
          className="bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 text-pink-200 hover:text-white font-bold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden md:inline">Panel Profesional</span>
        </Link>
      </div>
    </header>
  );
}
