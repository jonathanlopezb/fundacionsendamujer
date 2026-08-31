'use client';

/**
 * CertifiedCaribeSeguro.tsx — Fase 3: Sello de Certificación Caribe Seguro
 *
 * Evaluación y certificación para empresas, instituciones educativas y organizaciones
 * que adoptan protocolos de protección, igualdad y entornos seguros para mujeres en el Caribe.
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, Shield, Building2, Send, Sparkles, HelpCircle } from 'lucide-react';

const LEVELS = [
  {
    num: 1,
    title: 'Nivel 1 — Sensibilizada',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Empresas e instituciones que han capacitado al 100% de su personal en rutas de protección y no violencia contra las mujeres.',
    reqs: ['Taller obligatorio sobre violencia de género', 'Ruta interna de reporte rápido', 'Difusión de la Línea Rosa y Senda Mujer'],
  },
  {
    num: 2,
    title: 'Nivel 2 — Entorno Seguro',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'Protocolos activos de prevención del acoso laboral y sexual, además de canales confidenciales de denuncia.',
    reqs: ['Comité de convivencia con enfoque de género', 'Canal confidencial de denuncia verificado', 'Protocolo de actuación inmediata ante acoso'],
  },
  {
    num: 3,
    title: 'Nivel 3 — Liderazgo Activo',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    desc: 'Equidad salarial certificada, programas de autonomía económica para beneficiarias y paridad en cargos directivos.',
    reqs: ['Política de equidad salarial transparente', 'Programa de mentoría de liderazgo femenino', 'Convenio de vinculación laboral con Senda Mujer'],
  },
  {
    num: 4,
    title: 'Nivel 4 — Territorio Libre de Violencias',
    badge: 'bg-pink-100 text-pink-800 border-pink-300',
    desc: 'Máximo nivel de excelencia. Financiamiento directo a proyectos de vida y articulación activa con la Mesa Estratégica.',
    reqs: ['Aportes al Fondo Capital Semilla de Senda Mujer', 'Auditoría anual de impacto de género', 'Monitoreo longitudinal del IPSC Institucional'],
  },
];

export default function CertifiedCaribeSeguro() {
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [targetLevel, setTargetLevel] = useState('Nivel 1 — Sensibilizada');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !contactEmail) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#180325] via-[#3B0852] to-[#52166F] text-white rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[10px] uppercase tracking-widest">
          <Award className="w-4 h-4" /> Fase 3 — Sello Institucional y Empresarial
        </div>
        <h2 className="text-2xl font-black">Caribe Seguro Certified — 4 Niveles</h2>
        <p className="text-xs text-pink-200 leading-relaxed max-w-2xl">
          Acredita a organizaciones, universidades y empresas privadas en la región Caribe que implementan estándares rigurosos de no violencia, equidad salarial y entornos laborales seguros.
        </p>
      </div>

      {/* Grid de Niveles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LEVELS.map((lvl) => (
          <div key={lvl.num} className="bg-white rounded-3xl border border-pink-100 p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${lvl.badge}`}>
                  {lvl.title}
                </span>
                <span className="text-xs font-bold text-slate-400">Nivel {lvl.num}/4</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{lvl.desc}</p>

              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-extrabold text-[#52166F]">Requisitos de Acreditación:</p>
                {lvl.reqs.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de Solicitud de Certificación */}
      <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E12880]">SOLICITUD DE EVALUACIÓN</span>
          <h3 className="text-xl font-black text-[#52166F]">Solicita la Certificación Caribe Seguro para tu Empresa o Institución</h3>
          <p className="text-xs text-slate-500">
            Un profesional del equipo de la Fundación Senda Mujer realizará el diagnóstico inicial de tu organización.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-black text-emerald-900 text-lg">¡Solicitud recibida exitosamente!</h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              El equipo de la Fundación Senda Mujer revisará la postulación de <strong>{orgName}</strong> para la acreditación en <strong>{targetLevel}</strong>. Nos contactaremos al correo <strong>{contactEmail}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nombre de la Empresa u Organización *</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Ej: Universidad de Cartagena / Empresa S.A."
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E12880]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nivel Objetivo al que Postula *</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E12880] bg-white"
              >
                {LEVELS.map((l) => (
                  <option key={l.num} value={l.title}>{l.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nombre del Enlace Institucional *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nombre de la persona contacto"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E12880]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Correo Electrónico Corporativo *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contacto@organizacion.com"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E12880]"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3 rounded-full text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Enviar Solicitud de Diagnóstico Institucional
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
