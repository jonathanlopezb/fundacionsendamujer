'use client';

/**
 * /caribe-seguro/proteccion — Mi Plan de Protección & 10 Dimensiones IPSC
 */

import React from 'react';
import { Shield, CheckCircle2, Heart, Award, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const DIMENSIONS = [
  { name: 'Seguridad Personal y Física', desc: 'Protocolos de autoprotección y espacios de acogida.' },
  { name: 'Red de Apoyo Comunitaria', desc: 'Vinculación a colectivos de mujeres y vecinas en Cartagena.' },
  { name: 'Autonomía Económica', desc: 'Fondo capital semilla, habilidades de ahorro e independencia financiera.' },
  { name: 'Acceso a Derechos', desc: 'Conocimiento y exigibilidad ante comisaría y entes de control.' },
  { name: 'Acceso a Servicios de Salud', desc: 'Código Rosa, salud mental y atención psicosocial.' },
  { name: 'Seguridad Digital', desc: 'Privacidad en dispositivos, redes sociales y mensajería.' },
  { name: 'Conocimiento de Rutas', desc: 'Dominio de las líneas de emergencia (125, 122, 155, 123).' },
  { name: 'Capacidad de Respuesta', desc: 'Planes de escape de emergencia y bolsas de resguardo.' },
  { name: 'Formación y Capacitación', desc: 'Certificaciones en Senda Academia.' },
  { name: 'Bienestar y Recuperación', desc: 'Sanación psicosocial y reconstrucción de proyecto de vida.' },
];

export default function ProteccionPage() {
  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-purple-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          SENDA ÍNDICE DE PROTECCIÓN
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Mi Plan de Protección
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Las 10 dimensiones fundamentales para medir y fortalecer el nivel de protección de cada participante de forma transparente y longitudinal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIMENSIONS.map((dim, idx) => (
          <div key={idx} className="bg-[#140320]/80 rounded-2xl border border-purple-900/40 p-5 space-y-2 hover:border-pink-500/40 transition-all shadow-md">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <Shield className="w-4 h-4 text-[#E12880]" />
              <span>{idx + 1}. {dim.name}</span>
            </div>
            <p className="text-xs text-pink-200/70 leading-relaxed">{dim.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#1E0430] via-[#3B0852] to-[#52166F] border border-purple-800/50 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">¿Deseas medir tu nivel de protección personal?</h2>
          <p className="text-xs text-pink-200">
            Accede a la herramienta voluntaria del IPSC para construir tu itinerario personalizado.
          </p>
        </div>
        <Link
          href="/triaje-psicologico"
          className="bg-[#E12880] hover:bg-pink-600 text-white font-extrabold px-6 py-3 rounded-full text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          Comenzar mi Evaluación IPSC <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
