'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flower2, Bird, Brain, Stethoscope, Baby, Scale, GraduationCap, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const PROGRAMS = [
  {
    id: 'programa-1',
    number: '01',
    title: 'Programa 1 — Mujer Acompañada',
    icon: Flower2,
    badge: 'Atención Social Inicial',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
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
    icon: Bird,
    badge: 'Acompañamiento de Caso',
    color: 'from-purple-600 to-indigo-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
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
    icon: Brain,
    badge: 'Salud Mental & Emocional',
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
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
    icon: Stethoscope,
    badge: 'Jurisprudencia C-055 / C-355',
    color: 'from-emerald-500 to-teal-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
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
    icon: Baby,
    badge: 'Maternidad Elegida',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
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
    icon: Scale,
    badge: 'Asesoría Jurídica VBG',
    color: 'from-violet-600 to-fuchsia-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
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
    icon: GraduationCap,
    badge: 'Autonomía Económica',
    color: 'from-pink-600 to-purple-800',
    bgColor: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-200',
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
    <section className="py-20 bg-gradient-to-b from-white via-pink-50/20 to-white relative" id="programas-seccion">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="bg-senda-purple-light text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            Nuestra Estrategia Integral de Impacto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-senda-purple-dark tracking-tight">
            Los 7 Programas de la <br />
            <span className="gradient-text-pink-purple">Fundación Senda Mujer</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Un modelo continuo de atención desde la contención inicial hasta la plena autonomía económica y proyecto de vida de cada mujer y niña en Cartagena.
          </p>
        </div>

        {/* Grid of Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((prog) => {
            const Icon = prog.icon;
            const isExpanded = expandedId === prog.id;

            return (
              <div
                key={prog.id}
                id={prog.id}
                className={`bg-white rounded-3xl border ${prog.borderColor} p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group overflow-hidden`}
              >
                {/* Number Badge Background */}
                <span className="absolute top-4 right-6 text-5xl font-black text-pink-100/60 pointer-events-none group-hover:text-pink-200/60 transition-colors">
                  {prog.number}
                </span>

                <div>
                  <div className="flex items-center space-x-3 mb-5">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${prog.color} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-senda-pink">
                        {prog.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-senda-purple-dark mb-3">
                    {prog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {prog.summary}
                  </p>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <ul className="space-y-2 mb-6 pt-4 border-t border-pink-100 text-xs text-slate-700 animate-fadeIn">
                      {prog.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(prog.id)}
                    className="text-xs font-bold text-senda-purple hover:text-senda-pink flex items-center space-x-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Ver menos' : 'Ver detalle completo'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <Link
                    href={`/agendar-cita?programa=${encodeURIComponent(prog.title)}`}
                    className="text-xs font-extrabold text-senda-pink hover:underline flex items-center space-x-1"
                  >
                    <span>Solicitar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
