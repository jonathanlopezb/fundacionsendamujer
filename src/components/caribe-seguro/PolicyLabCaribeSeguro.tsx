'use client';

/**
 * PolicyLabCaribeSeguro.tsx — Fase 3: Senda Policy Lab
 *
 * Módulo de investigación, publicaciones académicas y convenios con universidades
 * e interlocución con la Cancillería y APC Colombia.
 */

import React from 'react';
import { BookOpen, Globe, Landmark, ShieldCheck, Download, ExternalLink, FileText } from 'lucide-react';

const PUBLICATIONS = [
  {
    title: 'Medición Longitudinal del Riesgo en el Caribe Colombiano',
    author: 'Fundación Senda Mujer & Universidad de Cartagena',
    date: 'Agosto 2026',
    desc: 'Análisis metodológico de las 10 dimensiones del IPSC aplicado a 148 mujeres acompañadas en Bolívar.',
    type: 'Policy Paper',
  },
  {
    title: 'De la Alerta a la Protección: Evaluación del Código Rosa en Salud',
    author: 'Senda Policy Lab & Mesa Estratégica Feminicidios',
    date: 'Junio 2026',
    desc: 'Estudio de tiempos de respuesta institucionales en comisarías y centros de salud de la Localidad 2 de Cartagena.',
    type: 'Informe Técnico',
  },
  {
    title: 'Autonomía Económica como Factor Insumergible de Protección',
    author: 'Fundación Senda Mujer & Red de Cooperación ENCI',
    date: 'Mayo 2026',
    desc: 'Evaluación del impacto del Fondo Capital Semilla ($2.500.000 COP) en la sostenibilidad de proyectos de vida.',
    type: 'Investigación Aplicada',
  },
];

export default function PolicyLabCaribeSeguro() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#180325] via-[#3B0852] to-[#52166F] text-white rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[10px] uppercase tracking-widest">
          <Globe className="w-4 h-4" /> Fase 3 — Incidencia en Políticas Públicas
        </div>
        <h2 className="text-2xl font-black">Senda Policy Lab & Investigaciones</h2>
        <p className="text-xs text-pink-200 leading-relaxed max-w-2xl">
          Laboratorio de políticas públicas que transforma la evidencia empírica del IPSC y del Observatorio en recomendaciones legislativas, convenios académicos y cooperación internacional feminista.
        </p>
      </div>

      {/* Convenios y Alianzas */}
      <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-black text-[#52166F] text-lg flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#E12880]" />
          Marcos de Cooperación e Interlocución
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1 text-center">
            <span className="text-2xl">🏛️</span>
            <h4 className="font-extrabold text-xs text-[#52166F]">Cancillería de Colombia</h4>
            <p className="text-[10px] text-slate-500">Observatorio de Mujeres, Paz y Seguridad</p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1 text-center">
            <span className="text-2xl">🌐</span>
            <h4 className="font-extrabold text-xs text-[#52166F]">APC Colombia</h4>
            <p className="text-[10px] text-slate-500">Estrategia Nacional de Cooperación Internacional (ENCI)</p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1 text-center">
            <span className="text-2xl">🎓</span>
            <h4 className="font-extrabold text-xs text-[#52166F]">Red Universitaria Bolívar</h4>
            <p className="text-[10px] text-slate-500">Convenios de pasantía e investigación aplicada</p>
          </div>
        </div>
      </div>

      {/* Publicaciones */}
      <div className="space-y-4">
        <h3 className="font-black text-[#52166F] text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E12880]" />
          Publicaciones y Policy Papers Recientes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PUBLICATIONS.map((pub, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-pink-100 p-5 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {pub.type}
                </span>
                <h4 className="font-extrabold text-xs text-[#52166F] leading-tight">{pub.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{pub.desc}</p>
              </div>

              <div className="pt-3 border-t border-pink-50 flex justify-between items-center text-[10px] text-slate-400">
                <span>{pub.date}</span>
                <button
                  type="button"
                  onClick={() => alert(`Descargando ${pub.title}...`)}
                  className="font-bold text-[#E12880] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Descargar PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
