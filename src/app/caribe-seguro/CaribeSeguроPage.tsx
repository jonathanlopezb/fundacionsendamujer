'use client';

/**
 * CaribeSeguroCommandCenter — Dashboard Principal del Micrositio Caribe Seguro
 *
 * Command Center con métricas en tiempo real, widgets interactivos del Observatorio,
 * Mapa Territorial, Sello Certified y Policy Lab.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield, TrendingUp, MapPin, Award, ChevronRight, BarChart3,
  Lock, Eye, FileText, Globe, Zap, Heart, CheckCircle2, Users, ArrowUpRight, Sparkles
} from 'lucide-react';
import ObservatorioPublico from '@/components/caribe-seguro/ObservatorioPublico';
import MapaCaribeSeguro from '@/components/caribe-seguro/MapaCaribeSeguro';
import CertifiedCaribeSeguro from '@/components/caribe-seguro/CertifiedCaribeSeguro';
import PolicyLabCaribeSeguro from '@/components/caribe-seguro/PolicyLabCaribeSeguro';

const STAT_CARDS = [
  { label: 'Mujeres Acompañadas', val: '148', sub: '+32 este trimestre', icon: Users, color: 'from-[#E12880] to-rose-600' },
  { label: 'Variación IPSC (90d)', val: '+2.4 Puntos', sub: 'Autonomía y protección', icon: TrendingUp, color: 'from-purple-600 to-indigo-600' },
  { label: 'Rutas Completadas', val: '112', sub: '75.6% de efectividad', icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
  { label: 'Fondo Capital Semilla', val: '$45M COP', sub: '2026 asignados', icon: Award, color: 'from-amber-400 to-yellow-500' },
];

export default function CaribeSeguроPage() {
  const [activeTab, setActiveTab] = useState<'observatorio' | 'mapa' | 'certificacion' | 'policylab'>('observatorio');

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-fadeIn">
      {/* COMMAND CENTER HERO */}
      <div className="bg-gradient-to-br from-[#1F0433] via-[#3B0852] to-[#52166F] border border-purple-800/50 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E12880]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-[#3B0852] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Shield className="w-3 h-3" /> COMMAND CENTER DE INNOVACIÓN SOCIAL
              </span>
              <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> FASES 1, 2 Y 3 ACTIVAS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Caribe Seguro
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-200 to-pink-400 text-2xl sm:text-3xl font-bold mt-1">
                De la alerta a la protección. Del resultado a la evidencia.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
              Plataforma territorial de protección, acompañamiento psicosocial, red de respuesta y medición de resultados longitudinales para mujeres en el Caribe colombiano.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <Link
              href="/caribe-seguro/como-funciona"
              className="bg-gradient-to-r from-[#E12880] to-[#52166F] hover:opacity-95 text-white font-black text-xs px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Registro Progresivo
            </Link>
            <Link
              href="/caribe-seguro/sos"
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-amber-300" /> SENDA SOS
            </Link>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-purple-800/40 relative z-10">
          {STAT_CARDS.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className="bg-[#140320]/60 backdrop-blur-md border border-purple-800/40 rounded-2xl p-4 space-y-1 hover:border-pink-500/40 transition-all">
                <div className="flex items-center justify-between text-pink-300">
                  <span className="text-[11px] font-bold text-slate-300">{st.label}</span>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${st.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white">{st.val}</p>
                <p className="text-[10px] text-pink-300/70 font-semibold">{st.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* WORKSPACE SECCIONES Y PESTAÑAS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {[
              { id: 'observatorio', label: '1. Observatorio en Vivo', icon: BarChart3 },
              { id: 'mapa', label: '2. Mapa de Servicios', icon: MapPin },
              { id: 'certificacion', label: '3. Caribe Safe Certified', icon: Award },
              { id: 'policylab', label: '4. Policy Lab & Alianzas', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-lg shadow-pink-950/50 border border-pink-500/40'
                      : 'bg-purple-950/40 text-pink-200/80 hover:bg-purple-900/40 hover:text-white border border-purple-900/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-pink-300'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENIDO */}
        <div className="space-y-6">
          {activeTab === 'observatorio' && (
            <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6">
              <ObservatorioPublico showHeader={false} />
            </div>
          )}

          {activeTab === 'mapa' && (
            <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6">
              <MapaCaribeSeguro />
            </div>
          )}

          {activeTab === 'certificacion' && (
            <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6">
              <CertifiedCaribeSeguro />
            </div>
          )}

          {activeTab === 'policylab' && (
            <div className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6">
              <PolicyLabCaribeSeguro />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
