'use client';

/**
 * /caribe-seguro/cooperacion — Cooperation Hub & Data Room Institucional
 *
 * Presentación de proyectos para la cooperación internacional (ONU Mujeres, APC Colombia, ENCI),
 * ODS relacionados (ODS 5, ODS 10, ODS 16) y Bóveda Segura de Documentos.
 */

import React, { useState } from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { Globe, ShieldCheck, Download, Lock, FileText, CheckCircle2, ChevronRight, Building } from 'lucide-react';

const DOCUMENTS = [
  { code: 'DOC-2026-001', title: 'Teoría del Cambio Programa Caribe Seguro 2026-2028', cat: 'Teoría del Cambio', size: '2.4 MB', role: 'DONOR_VIEWER' },
  { code: 'DOC-2026-002', title: 'Presupuesto General y Contrapartidas ENCI 2026', cat: 'Presupuesto', size: '1.8 MB', role: 'DONOR_VIEWER' },
  { code: 'DOC-2026-003', title: 'Manual Metodológico del Índice IPSC de 10 Dimensiones', cat: 'Metodología', size: '3.1 MB', role: 'RESEARCHER' },
  { code: 'DOC-2026-004', title: 'Informe de Auditoría y Verificación de Habeas Data Ley 1581', cat: 'Auditoría', size: '1.1 MB', role: 'SUPER_ADMIN' },
];

const ODS_ITEMS = [
  { num: '5', name: 'Igualdad de Género', desc: 'Eliminar todas las formas de violencia contra las mujeres y niñas.' },
  { num: '10', name: 'Reducción de las Desigualdades', desc: 'Promover la inclusión social, económica y política de todas las personas.' },
  { num: '16', name: 'Paz, Justicia e Instituciones Sólidas', desc: 'Garantizar el acceso a la justicia y crear instituciones eficaces e inclusivas.' },
];

export default function CooperacionPage() {
  const [accessRequested, setAccessRequested] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* HERO */}
        <div className="bg-gradient-to-r from-[#180325] via-[#3B0852] to-[#52166F] text-white rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[10px] uppercase tracking-widest">
            <Globe className="w-4 h-4" /> CARIBE SEGURO COOPERATION HUB
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">
            Cooperación Internacional y Alianzas Estratégicas
          </h1>
          <p className="text-xs sm:text-sm text-pink-200 max-w-3xl leading-relaxed">
            Plataforma de datos de impacto, sostenibilidad y gobernanza diseñada para agencias de cooperación, organizaciones de la sociedad civil y multilaterales.
          </p>
        </div>

        {/* ALINEACIÓN CON ODS */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-[#52166F]">Alineación con Objetivos de Desarrollo Sostenible (ODS)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ODS_ITEMS.map((ods) => (
              <div key={ods.num} className="bg-white rounded-2xl border border-pink-100 p-5 space-y-2 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#E12880] text-white font-black text-lg flex items-center justify-center">
                  {ods.num}
                </div>
                <h3 className="font-extrabold text-[#52166F] text-sm">{ods.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ods.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DATA ROOM INSTITUCIONAL */}
        <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pink-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#E12880] font-black text-[10px] uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" /> BÓVEDA PRIVADA DE DOCUMENTACIÓN
              </div>
              <h2 className="text-xl font-black text-[#52166F]">Data Room Caribe Seguro</h2>
            </div>
            <button
              type="button"
              onClick={() => setAccessRequested(true)}
              className="bg-[#52166F] text-white font-extrabold px-5 py-2.5 rounded-full text-xs hover:bg-[#3B0852] transition-colors cursor-pointer"
            >
              Solicitar Acceso Institucional
            </button>
          </div>

          {accessRequested && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 font-semibold">
              ℹ️ Tu solicitud de credenciales para la bóveda ha sido enviada al área de Cooperación Internacional de la Fundación Senda Mujer.
            </div>
          )}

          <div className="space-y-3">
            {DOCUMENTS.map((doc) => (
              <div key={doc.code} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{doc.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {doc.cat}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-[#52166F] text-xs sm:text-sm">{doc.title}</h4>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">{doc.size}</span>
                  <button
                    type="button"
                    onClick={() => alert(`Descargando documento ${doc.code}...`)}
                    className="bg-[#E12880] text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
