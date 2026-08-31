'use client';

/**
 * Página pública /caribe-seguro
 * Landing institucional + Observatorio integrado
 * El módulo más visible del Blueprint hacia cooperantes y aliados
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield, TrendingUp, Map, Award, ChevronRight, BarChart3,
  Lock, Eye, FileText, Globe, Zap, Heart, Users
} from 'lucide-react';
import ObservatorioPublico from '@/components/caribe-seguro/ObservatorioPublico';

const FASES = [
  {
    num: 1, label: 'Fase 1 — MVP Interno', status: 'activa',
    color: 'bg-emerald-500', items: [
      'Diseño y validación del IPSC con equipo profesional',
      'Instrumentación del Portal de Beneficiarias y SENDA EVAL',
      'Motor de medición longitudinal individual',
      'Sistema de señales de deterioro con escalación humana',
    ],
  },
  {
    num: 2, label: 'Fase 2 — Observatorio y Alertas', status: 'proxima',
    color: 'bg-amber-400', items: [
      'Observatorio Caribe Seguro con datos reales del sistema',
      'Motor de agregación anónima y aprobación de publicación',
      'Integración con Groq AI para análisis de señales',
      'Boletines periódicos en Vercel Blob Storage',
    ],
  },
  {
    num: 3, label: 'Fase 3 — Territorio y Certificación', status: 'futura',
    color: 'bg-slate-300', items: [
      'Mapa Caribe Seguro (servicios disponibles, sin ubicar víctimas)',
      'Caribe Seguro Certified — 4 niveles para empresas e instituciones',
      'Senda Policy Lab — convenios con universidades',
      'Interlocución con Cancillería y APC Colombia',
    ],
  },
];

const MODULES = [
  { icon: <Shield className="w-6 h-6" />, label: 'IPSC', desc: 'Índice de Protección Individual y Longitudinal', color: 'from-pink-500 to-rose-600' },
  { icon: <Zap className="w-6 h-6" />, label: 'Señales', desc: 'Sistema de Deterioro con Decisión Humana', color: 'from-amber-400 to-orange-500' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'Observatorio', desc: 'Tablero Público de Datos Agregados', color: 'from-purple-600 to-violet-700' },
  { icon: <Map className="w-6 h-6" />, label: 'Mapa', desc: 'Servicios y Brechas Territoriales', color: 'from-teal-500 to-emerald-600' },
  { icon: <Award className="w-6 h-6" />, label: 'Certificación', desc: 'Caribe Seguro Certified — 4 Niveles', color: 'from-amber-500 to-yellow-500' },
  { icon: <Globe className="w-6 h-6" />, label: 'Policy Lab', desc: 'Incidencia y Cooperación Internacional', color: 'from-blue-600 to-indigo-700' },
];

const ALLIES = [
  'Observatorio de Mujeres, Paz y Seguridad (Cancillería)',
  'APC Colombia — Cooperación Feminista ENCI 2023-2026',
  'Mesa Estratégica Feminicidios Cartagena y Bolívar',
  'Casa Refugio Violeta — Alcaldía de Cartagena',
  'ONU Mujeres — Oficina Regional Américas',
  'Universidades de Cartagena y Bolívar',
];

export default function CaribeSeguроPage() {
  const [activeTab, setActiveTab] = useState<'observatorio' | 'arquitectura' | 'aliados'>('observatorio');

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
            <span className="bg-amber-400 text-[#3B0852] font-extrabold text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> PROGRAMA INSIGNIA DE INNOVACIÓN
            </span>
            <span className="bg-white/10 border border-white/20 text-pink-200 font-bold text-[10px] px-4 py-1.5 rounded-full">
              Fase 1 — MVP Interno Activo
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-tight">
            Caribe Seguro
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300 text-3xl sm:text-4xl font-bold mt-2">
              De la alerta a la protección. Del resultado a la política pública.
            </span>
          </h1>

          <p className="text-lg text-pink-200 max-w-3xl mx-auto leading-relaxed">
            El primer sistema de medición longitudinal de protección a mujeres del Caribe colombiano. No sustituye lo que existe: integra lo que no existía.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('observatorio')}
              className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" /> Ver el Observatorio
            </button>
            <button
              onClick={() => setActiveTab('arquitectura')}
              className="bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Explorar Arquitectura
            </button>
          </div>
        </div>
      </section>

      {/* TESIS CENTRAL */}
      <section className="py-12 px-4 bg-white border-b border-pink-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">Tesis Central</p>
          <blockquote className="text-xl sm:text-2xl font-black text-[#52166F] leading-tight">
            "No basta con saber cuántas mujeres atendimos. Necesitamos demostrar, con datos propios y verificables, si una intervención concreta hizo que una mujer estuviera más protegida."
          </blockquote>
          <p className="text-sm text-slate-500">— Blueprint Caribe Seguro, Fundación Senda Mujer 2026</p>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#52166F]">Arquitectura de 14 Módulos</h2>
            <p className="text-sm text-slate-500 mt-1">8 módulos ya construidos · 6 módulos nuevos del Blueprint</p>
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

      {/* TABS */}
      <section className="py-6 px-4 border-t border-pink-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { id: 'observatorio', label: 'Observatorio', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'arquitectura', label: 'Hoja de Ruta', icon: <FileText className="w-4 h-4" /> },
            { id: 'aliados', label: 'Aliados Estratégicos', icon: <Globe className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#52166F] text-white shadow-md'
                  : 'bg-pink-50 text-slate-600 hover:bg-pink-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {activeTab === 'observatorio' && (
            <ObservatorioPublico showHeader={false} />
          )}

          {activeTab === 'arquitectura' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-[#52166F]">Hoja de Ruta por Fases</h3>
              <div className="space-y-5">
                {FASES.map((fase) => (
                  <div key={fase.num} className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${fase.color} flex items-center justify-center text-white font-extrabold text-lg shadow-sm`}>
                        {fase.num}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#52166F] text-base">{fase.label}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          fase.status === 'activa' ? 'bg-emerald-100 text-emerald-800' :
                          fase.status === 'proxima' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {fase.status === 'activa' ? '✅ En ejecución' : fase.status === 'proxima' ? '⏳ Próxima fase' : '📋 Planificada'}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-1.5 pl-13">
                      {fase.items.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-[#E12880] shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'aliados' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-[#52166F]">Actores Estratégicos Identificados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALLIES.map((ally, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E12880] to-[#52166F] flex items-center justify-center text-white font-extrabold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm font-bold text-slate-700">{ally}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900 font-semibold">
                💡 La recomendación del Blueprint: la primera conversación externa no es con un cooperante internacional, sino con la <strong>Mesa Estratégica de Cartagena</strong> y la <strong>Secretaría de Participación y Desarrollo Social</strong>, para validar el IPSC con quienes operan la Casa Refugio Violeta.
              </div>
            </div>
          )}

        </div>
      </section>

      {/* CTA SEGURIDAD */}
      <section className="py-10 px-4 bg-gradient-to-r from-[#3B0852] to-[#52166F] text-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Lock className="w-10 h-10 text-amber-300 shrink-0" />
            <div>
              <p className="font-extrabold text-base">Privacidad y Seguridad por Diseño</p>
              <p className="text-xs text-pink-200 mt-0.5">
                Ningún dato individual se publica. Mínimo de 5 casos por grupo. Cifrado en tránsito. Ley 1581/2012 Habeas Data.
              </p>
            </div>
          </div>
          <Link
            href="/portal-beneficiaria"
            className="bg-amber-400 text-[#3B0852] font-extrabold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-amber-300 transition-colors shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4" /> Portal de Beneficiarias
          </Link>
        </div>
      </section>

    </div>
  );
}
