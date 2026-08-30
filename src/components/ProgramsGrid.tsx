'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RiPlantLine, 
  RiShieldCrossLine, 
  RiBrainLine, 
  RiStethoscopeLine, 
  RiHeartPulseLine, 
  RiScales3Line, 
  RiGraduationCapLine,
  RiArrowRightLine,
  RiCheckDoubleLine
} from 'react-icons/ri';
import { 
  HiOutlineSparkles, 
  HiChevronDown, 
  HiChevronUp 
} from 'react-icons/hi2';
import { IconType } from 'react-icons';

export interface ProgramItem {
  id: string;
  number: string;
  title: string;
  icon: IconType;
  badge: string;
  color: string;
  badgeBg: string;
  badgeTextColor: string;
  bgColor: string;
  borderColor: string;
  summary: string;
  details: string[];
}

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'programa-1',
    number: '01',
    title: 'Programa 1 — Mujer Acompañada',
    icon: RiPlantLine,
    badge: 'Atención Social Inicial',
    color: 'from-pink-500 via-rose-500 to-pink-600',
    badgeBg: 'bg-pink-100/80',
    badgeTextColor: 'text-pink-800',
    bgColor: 'bg-pink-50/50',
    borderColor: 'border-pink-200/80',
    summary: 'Atención social inicial y valoración integral de cada caso por trabajadora social experta.',
    details: [
      'Entrevista social profunda y confidencial.',
      'Identificación de factores de vulnerabilidad y riesgos sociofamiliares.',
      'Caracterización socioeconómica y mapeo de redes de apoyo.',
      'Elaboración de un plan de acompañamiento individualizado.',
      'Seguimiento continuo durante todo el proceso de fortalecimiento.',
    ],
  },
  {
    id: 'programa-2',
    number: '02',
    title: 'Programa 2 — Mujeres Víctimas de Violencia Sexual',
    icon: RiShieldCrossLine,
    badge: 'Acompañamiento de Caso',
    color: 'from-purple-600 via-indigo-600 to-purple-800',
    badgeBg: 'bg-purple-100/80',
    badgeTextColor: 'text-purple-800',
    bgColor: 'bg-purple-50/50',
    borderColor: 'border-purple-200/80',
    summary: 'Orientación estratégica y acompañamiento para la activación efectiva de rutas institucionales.',
    details: [
      'Acompañamiento para víctimas de acceso carnal violento, abusos y VBG.',
      'Acompañante de caso para evitar que la víctima enfrente sola las instituciones.',
      'Articulación con Fiscalía General, ICBF, Comisarías de Familia y Salud.',
      'Garantía de no revictimización y trato humano respetuoso.',
    ],
  },
  {
    id: 'programa-3',
    number: '03',
    title: 'Programa 3 — Contención y Acompañamiento Psicosocial',
    icon: RiBrainLine,
    badge: 'Salud Mental & Emocional',
    color: 'from-sky-500 via-blue-600 to-cyan-700',
    badgeBg: 'bg-sky-100/80',
    badgeTextColor: 'text-sky-800',
    bgColor: 'bg-sky-50/50',
    borderColor: 'border-sky-200/80',
    summary: 'Profesionales aliados en psicología, trabajo social y orientación familiar.',
    details: [
      'Atención psicológica individual y contención de crisis.',
      'Grupos de apoyo y contención emocional entre pares.',
      'Fortalecimiento de la autoestima y prevención de la revictimización.',
      'Construcción guiada del proyecto de vida personal.',
    ],
  },
  {
    id: 'programa-4',
    number: '04',
    title: 'Programa 4 — Ruta de Salud y Derechos Reproductivos',
    icon: RiStethoscopeLine,
    badge: 'Jurisprudencia C-055 / C-355',
    color: 'from-emerald-500 via-teal-600 to-emerald-700',
    badgeBg: 'bg-emerald-100/80',
    badgeTextColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200/80',
    summary: 'Orientación para el acceso oportuno, informado, seguro y confidencial a servicios de salud sexual.',
    details: [
      'Información clara sobre las opciones legales bajo Sentencias C-055 de 2022 y C-355 de 2006.',
      'Red de IPS y profesionales de la salud aliados en Cartagena.',
      'Garantía de confidencialidad absoluta y respeto a la decisión de la mujer.',
      'Atención médica general y dental preventiva.',
    ],
  },
  {
    id: 'programa-5',
    number: '05',
    title: 'Programa 5 — Embarazo con Apoyo',
    icon: RiHeartPulseLine,
    badge: 'Maternidad Elegida',
    color: 'from-amber-500 via-orange-500 to-amber-600',
    badgeBg: 'bg-amber-100/80',
    badgeTextColor: 'text-amber-800',
    bgColor: 'bg-amber-50/50',
    borderColor: 'border-amber-200/80',
    summary: 'Acompañamiento integral para las mujeres que deciden continuar con el embarazo.',
    details: [
      'Preparación integral para la maternidad y talleres de cuidado prenatal.',
      'Apoyo en nutrición y entrega de kits de maternidad con aliados.',
      'Orientación sobre opciones de adopción o redes de fortalecimiento familiar.',
      'Acompañamiento en el posparto y articulación a programas sociales.',
    ],
  },
  {
    id: 'programa-6',
    number: '06',
    title: 'Programa 6 — Mujer y Justicia',
    icon: RiScales3Line,
    badge: 'Asesoría Jurídica VBG',
    color: 'from-violet-600 via-fuchsia-600 to-purple-800',
    badgeBg: 'bg-violet-100/80',
    badgeTextColor: 'text-violet-800',
    bgColor: 'bg-violet-50/50',
    borderColor: 'border-violet-200/80',
    summary: 'Orientación legal, denuncias de violencia y protección de derechos con abogados aliados.',
    details: [
      'Orientación en denuncias por violencia sexual e intrafamiliar.',
      'Solicitud y seguimiento de medidas de protección efectivas en Cartagena.',
      'Restablecimiento de derechos e intermediación ante entidades públicas.',
      'Red de abogados pro-bono y consultorios jurídicos de universidades aliadas.',
    ],
  },
  {
    id: 'programa-7',
    number: '07',
    title: 'Programa 7 — Proyecto de Vida',
    icon: RiGraduationCapLine,
    badge: 'Autonomía Económica',
    color: 'from-pink-600 via-purple-600 to-slate-900',
    badgeBg: 'bg-fuchsia-100/80',
    badgeTextColor: 'text-fuchsia-900',
    bgColor: 'bg-fuchsia-50/50',
    borderColor: 'border-fuchsia-200/80',
    summary: 'Educación, empleo y emprendimiento para garantizar la independencia y futuro de la mujer.',
    details: [
      'Capacitación técnica en artes, oficios y habilidades digitales.',
      'Bolsa de empleo inclusivo en alianza con comercios de Cartagena.',
      'Capital semilla y asesoría para micronegocios y emprendimientos.',
      'Modelo de seguimiento a largo plazo para asegurar la sostenibilidad económica.',
    ],
  },
];

export default function ProgramsGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-pink-50/30 to-white relative" id="programas-seccion">
      
      {/* Decorative Subtle Background Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-pink-300/10 via-purple-300/10 to-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-pink-100/80 border border-pink-200 text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <HiOutlineSparkles className="w-4 h-4 text-senda-pink" />
            <span>Nuestra Estrategia Integral de Impacto</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-senda-purple-dark tracking-tight leading-tight">
            Los 7 Programas de la <br />
            <span className="bg-gradient-to-r from-senda-pink via-purple-600 to-senda-purple-dark bg-clip-text text-transparent">
              Fundación Senda Mujer
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Un modelo continuo de atención desde la contención inicial hasta la plena autonomía económica y proyecto de vida de cada mujer y niña en Cartagena.
          </p>
        </div>

        {/* Grid of Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((prog) => {
            const IconComponent = prog.icon;
            const isExpanded = expandedId === prog.id;

            return (
              <div
                key={prog.id}
                id={prog.id}
                className={`bg-white rounded-3xl border ${prog.borderColor} p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden`}
              >
                {/* Number Badge Background */}
                <span className="absolute top-4 right-6 text-5xl font-black text-pink-100/70 pointer-events-none group-hover:text-pink-200/90 transition-colors">
                  {prog.number}
                </span>

                <div className="space-y-4">
                  
                  {/* Icon Badge & Category Pill */}
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.color} text-white shadow-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${prog.badgeBg} ${prog.badgeTextColor} border border-black/5 inline-block`}>
                        {prog.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-xl font-extrabold text-senda-purple-dark leading-snug group-hover:text-senda-pink transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {prog.summary}
                  </p>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="space-y-2 pt-4 border-t border-pink-100 text-xs text-slate-700 animate-fadeIn">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                        Acciones & Cobertura Garantizada:
                      </span>
                      {prog.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <RiCheckDoubleLine className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-5 mt-6 border-t border-pink-50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleExpand(prog.id)}
                    className="text-xs font-bold text-senda-purple hover:text-senda-pink flex items-center gap-1 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-pink-50"
                  >
                    <span>{isExpanded ? 'Ver menos' : 'Ver detalle completo'}</span>
                    {isExpanded ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                  </button>

                  <Link
                    href={`/agendar-cita?programa=${encodeURIComponent(prog.title)}`}
                    className="text-xs font-extrabold text-white bg-gradient-to-r from-senda-pink to-senda-purple hover:from-senda-purple hover:to-senda-pink px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1 hover:shadow-md"
                  >
                    <span>Solicitar</span>
                    <RiArrowRightLine className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
