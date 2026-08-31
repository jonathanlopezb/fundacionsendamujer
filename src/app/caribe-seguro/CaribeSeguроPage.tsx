'use client';

/**
 * Página pública /caribe-seguro
 * Landing institucional + Observatorio + Mapa + Certificación + Policy Lab
 * Ecosistema completo de 3 Fases activas para la Fundación Senda Mujer
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield, TrendingUp, MapPin, Award, ChevronRight, BarChart3,
  Lock, Eye, FileText, Globe, Zap, Heart, CheckCircle2, Building, Scale
} from 'lucide-react';
import ObservatorioPublico from '@/components/caribe-seguro/ObservatorioPublico';
import MapaCaribeSeguro from '@/components/caribe-seguro/MapaCaribeSeguro';
import CertifiedCaribeSeguro from '@/components/caribe-seguro/CertifiedCaribeSeguro';
import PolicyLabCaribeSeguro from '@/components/caribe-seguro/PolicyLabCaribeSeguro';

const FASES = [
  {
    num: 1, label: 'Fase 1 — MVP Interno & IPSC', status: 'activa',
    color: 'bg-emerald-500', items: [
      'Diseño y validación del IPSC con equipo profesional (10 dimensiones)',
      'Instrumentación del Portal de Beneficiarias y SENDA EVAL',
      'Motor de medición longitudinal individual (ingreso, 30d, 90d, 180d)',
      'Sistema de señales de deterioro con escalación humana obligatoria',
    ],
  },
  {
    num: 2, label: 'Fase 2 — Observatorio & Inteligencia', status: 'activa',
    color: 'bg-emerald-500', items: [
      'Observatorio Caribe Seguro con datos reales agregados de MongoDB',
      'Motor de agregación anónima y aprobación de publicación (min group = 5)',
      'Análisis de patrones de riesgo y fortalezas asistido por datos',
      'Reportes ejecutivos periódicos de impacto institucional',
    ],
  },
  {
    num: 3, label: 'Fase 3 — Territorio, Certificación & Policy Lab', status: 'activa',
    color: 'bg-emerald-500', items: [
      'Mapa Caribe Seguro de servicios en Cartagena y Bolívar (sin geolocalizar víctimas)',
      'Caribe Seguro Certified — Sello de 4 niveles para empresas e instituciones',
      'Senda Policy Lab — convenios con universidades e investigación en políticas públicas',
      'Interlocución estratégica con Cancillería y APC Colombia',
    ],
  },
];

const MODULES = [
  { icon: <Shield className="w-6 h-6" />, label: 'IPSC', desc: 'Índice de Protección Individual y Longitudinal', color: 'from-pink-500 to-rose-600' },
  { icon: <Zap className="w-6 h-6" />, label: 'Señales', desc: 'Sistema de Deterioro con Decisión Humana', color: 'from-amber-400 to-orange-500' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'Observatorio', desc: 'Tablero Público de Datos Agregados Reales', color: 'from-purple-600 to-violet-700' },
  { icon: <MapPin className="w-6 h-6" />, label: 'Mapa', desc: 'Directorio de Servicios y Cobertura Territorial', color: 'from-teal-500 to-emerald-600' },
  { icon: <Award className="w-6 h-6" />, label: 'Certificación', desc: 'Caribe Seguro Certified — Sello de 4 Niveles', color: 'from-amber-500 to-yellow-500' },
  { icon: <Globe className="w-6 h-6" />, label: 'Policy Lab', desc: 'Incidencia y Cooperación Internacional', color: 'from-blue-600 to-indigo-700' },
];

const ALLIES = [
  'Observatorio de Mujeres, Paz y Seguridad (Cancillería)',
  'APC Colombia — Cooperación Feminista ENCI 2023-2026',
  'Mesa Estratégica Feminicidios Cartagena y Bolívar',
  'Casa Refugio Violeta — Alcaldía de Cartagena',
  'ONU Mujeres — Oficina Regional Américas',
  'Red de Universidades de Cartagena y Bolívar',
];

export default function CaribeSeguроPage() {
  const [activeTab, setActiveTab] = useState<'observatorio' | 'mapa' | 'certificacion' | 'policylab' | 'hojaruta'>('observatorio');

  return (
    <div className="min-h-screen bg-[#FDF8FA]">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#180325] via-[#3B0852] to-[#52166F] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-amber-400 text-[#3B0852] font-extrabold text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Shield className="w-3 h-3" /> ECOSISTEMA DE INNOVACIÓN SOCIAL
            </span>
            <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> FASES 1, 2 Y 3 OPERATIVAS EN PRODUCCIÓN
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-tight">
            Caribe Seguro
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300 text-3xl sm:text-4xl font-bold mt-2">
              De la alerta a la protección. Del resultado a la política pública.
            </span>
          </h1>

          <p className="text-lg text-pink-200 max-w-3xl mx-auto leading-relaxed">
            El primer sistema de medición longitudinal de protección a mujeres del Caribe colombiano. Genera evidencia empírica real, empodera beneficiarias y conecta la oferta territorial.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('observatorio')}
              className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" /> Ver el Observatorio
            </button>
            <button
              onClick={() => setActiveTab('mapa')}
              className="bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4" /> Mapa de Servicios
            </button>
          </div>
        </div>
      </section>

      {/* TESIS CENTRAL */}
      <section className="py-12 px-4 bg-white border-b border-pink-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">Tesis Central Institucional</p>
          <blockquote className="text-xl sm:text-2xl font-black text-[#52166F] leading-tight">
            "No basta con saber cuántas mujeres atendimos. Necesitamos demostrar, con datos propios y verificables, si una intervención concreta hizo que una mujer estuviera más protegida."
          </blockquote>
          <p className="text-sm text-slate-500">— Programa Caribe Seguro, Fundación Senda Mujer 2026</p>
        </div>
      </section>

      {/* MÓDULOS DE ARQUITECTURA */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#52166F]">Arquitectura Tecnológica de Protección</h2>
            <p className="text-sm text-slate-500 mt-1">Componentes integrados para seguimiento individual, agregación pública e incidencia regional</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MODULES.map((mod, i) => (
              <div key={i} className="bg-white rounded-2xl border border-pink-100 p-4 text-center shadow-sm hover:shadow-md transition-all space-y-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mx-auto text-white shadow-sm`}>
                  {mod.icon}
                </div>
                <p className="font-extrabold text-sm text-[#52166F]">{mod.label}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BARRA DE NAVEGACIÓN ENTRE SECCIONES DEL MICROSITIO */}
      <section className="py-4 px-4 border-t border-b border-pink-100 sticky top-0 bg-white/95 backdrop-blur-md z-20 shadow-xs">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto justify-start sm:justify-center">
          {[
            { id: 'observatorio', label: '1. Observatorio en Vivo', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'mapa', label: '2. Mapa de Servicios', icon: <MapPin className="w-4 h-4" /> },
            { id: 'certificacion', label: '3. Certificación Certified', icon: <Award className="w-4 h-4" /> },
            { id: 'policylab', label: '4. Policy Lab & Alianzas', icon: <Globe className="w-4 h-4" /> },
            { id: 'hojaruta', label: '5. Hoja de Ruta Fases', icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-md'
                  : 'bg-pink-50 text-slate-700 hover:bg-pink-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* SECCIONES DEL MICROSITIO */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* TAB 1: OBSERVATORIO PÚBLICO */}
          {activeTab === 'observatorio' && (
            <ObservatorioPublico showHeader={true} />
          )}

          {/* TAB 2: MAPA DE SERVICIOS */}
          {activeTab === 'mapa' && (
            <MapaCaribeSeguro />
          )}

          {/* TAB 3: CERTIFICACIÓN */}
          {activeTab === 'certificacion' && (
            <CertifiedCaribeSeguro />
          )}

          {/* TAB 4: POLICY LAB */}
          {activeTab === 'policylab' && (
            <PolicyLabCaribeSeguro />
          )}

          {/* TAB 5: HOJA DE RUTA CON FASES COMPLETADAS */}
          {activeTab === 'hojaruta' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">ESTADO DE DESPLIEGUE</span>
                  <h3 className="text-2xl font-black text-[#52166F]">Hoja de Ruta Institucional Caribe Seguro</h3>
                  <p className="text-xs text-slate-500">
                    Las 3 fases fundamentales del ecosistema han sido instrumentadas y desplegadas en producción.
                  </p>
                </div>

                <div className="space-y-5">
                  {FASES.map((fase) => (
                    <div key={fase.num} className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-sm space-y-3 bg-emerald-50/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                          {fase.num}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#52166F] text-base">{fase.label}</h4>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ✅ Fase Operativa en Producción
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 pl-13">
                        {fase.items.map((item, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALIADOS ESTRATÉGICOS */}
              <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-4 shadow-sm">
                <h4 className="text-lg font-black text-[#52166F]">Ecosistema de Actores Estratégicos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ALLIES.map((ally, i) => (
                    <div key={i} className="bg-pink-50/40 rounded-2xl border border-pink-100 p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E12880] to-[#52166F] flex items-center justify-center text-white font-extrabold text-xs shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-xs font-bold text-slate-700">{ally}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* FOOTER Y PRIVACIDAD */}
      <section className="py-10 px-4 bg-gradient-to-r from-[#180325] via-[#3B0852] to-[#52166F] text-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Lock className="w-10 h-10 text-amber-300 shrink-0" />
            <div>
              <p className="font-extrabold text-base">Garantía Ética y Ley 1581 de 2012</p>
              <p className="text-xs text-pink-200 mt-0.5">
                Datos anonimizados y agregados. Ningún indicador expone la identidad o ubicación de las mujeres acompañadas.
              </p>
            </div>
          </div>
          <Link
            href="/portal-beneficiaria"
            className="bg-amber-400 text-[#3B0852] font-extrabold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-amber-300 transition-colors shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4" /> Acceso Beneficiarias
          </Link>
        </div>
      </section>

    </div>
  );
}
