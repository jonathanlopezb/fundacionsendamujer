'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface ProgramItem {
  id: string;
  number: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeTextColor: string;
  summary: string;
  image: string;
  imageAlt: string;
  impactStatistic: string;
  details: string[];
}

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'programa-1',
    number: '01',
    title: 'Mujer Acompañada',
    badge: 'Atención Social Inicial',
    badgeBg: 'bg-pink-100/90',
    badgeTextColor: 'text-pink-900',
    summary: 'Atención social inicial, valoración de vulnerabilidad y mapa de redes de contención familiar por trabajadoras sociales expertas.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Atención psicosocial y acompañamiento humano a mujeres',
    impactStatistic: '+450 mujeres orientadas en Cartagena',
    details: [
      'Entrevista social profunda, confidencial y sin juzgamientos.',
      'Identificación de factores de vulnerabilidad y riesgos sociofamiliares.',
      'Caracterización socioeconómica y mapeo de redes de apoyo territorial.',
      'Plan de acompañamiento individualizado con seguimiento quincenal.',
    ],
  },
  {
    id: 'programa-2',
    number: '02',
    title: 'Víctimas de Violencia Sexual',
    badge: 'Acompañamiento de Caso',
    badgeBg: 'bg-purple-100/90',
    badgeTextColor: 'text-purple-900',
    summary: 'Acompañamiento humano integral para evitar que la mujer enfrente sola las instituciones judiciales y de salud tras sufrir violencia.',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Acompañamiento seguro y confidencial para víctimas de violencia',
    impactStatistic: '100% activación de ruta de salud y legal',
    details: [
      'Atención médica de urgencia para profilaxis post-exposición (PEP e ITS).',
      'Acompañamiento presencial ante Fiscalía General, Comisarías e ICBF.',
      'Atención psicológica de contención de crisis y trauma.',
      'Garantía estricta de no revictimización y trato humano respetuoso.',
    ],
  },
  {
    id: 'programa-3',
    number: '03',
    title: 'Contención Psicosocial',
    badge: 'Salud Mental & Emocional',
    badgeBg: 'bg-sky-100/90',
    badgeTextColor: 'text-sky-900',
    summary: 'Espacios seguros individuales y grupales de sanación emocional, superación de duelo y reconstrucción de la autoestima.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Círculo de apoyo psicosocial y salud mental entre mujeres',
    impactStatistic: '92% de reducción en sintomatología de estrés',
    details: [
      'Sesiones individuales de psicoterapia clínica.',
      'Círculos de la palabra y grupos de apoyo mutuo en Cartagena.',
      'Herramientas prácticas para gestión de la ansiedad y el duelo.',
      'Fortalecimiento de la autonomía personal y toma de decisiones.',
    ],
  },
  {
    id: 'programa-4',
    number: '04',
    title: 'Ruta de Salud y Derechos',
    badge: 'Salud Sexual & C-055',
    badgeBg: 'bg-emerald-100/90',
    badgeTextColor: 'text-emerald-900',
    summary: 'Orientación integral para el acceso oportuno, informado, seguro y confidencial a servicios de salud ginecológica y reproductiva.',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Atención ginecológica y médica profesional en Cartagena',
    impactStatistic: 'Red de IPS y profesionales médicas aliadas',
    details: [
      'Información veraz sobre las Sentencias Constitucionales C-055/2022 y C-355/2006.',
      'Articulación con brigadas médicas y ginecológicas en territorio.',
      'Tamizaje preventivo en citologías, ITS y planificación familiar.',
      'Valoración en odontología preventiva y medicina general.',
    ],
  },
  {
    id: 'programa-5',
    number: '05',
    title: 'Embarazo con Apoyo',
    badge: 'Maternidad Elegida',
    badgeBg: 'bg-amber-100/90',
    badgeTextColor: 'text-amber-900',
    summary: 'Acompañamiento integral para las mujeres que deciden continuar con el embarazo: controles prenatales, nutrición y entrega de kits.',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Madre gestante acompañada con amor y apoyo integral',
    impactStatistic: '+180 kits maternales y nutricionales entregados',
    details: [
      'Preparación para el parto, lactancia materna y puerperio seguro.',
      'Apoyo nutricional con suplementos y mercados familiares.',
      'Orientación sobre opciones de adopción o fortalecimiento familiar.',
      'Red de pediatría para el primer año de vida del bebé.',
    ],
  },
  {
    id: 'programa-6',
    number: '06',
    title: 'Mujer y Justicia',
    badge: 'Asesoría Jurídica VBG',
    badgeBg: 'bg-violet-100/90',
    badgeTextColor: 'text-violet-900',
    summary: 'Orientación legal, denuncias de violencia intrafamiliar, fijación de alimentos y consecución de medidas de protección efectivas.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Asesoría jurídica y defensa legal de derechos de las mujeres',
    impactStatistic: '+310 medidas de protección tramitadas',
    details: [
      'Red de abogadas y consultorios jurídicos de universidades aliadas.',
      'Representación en procesos de alimentos, custodia y visitas.',
      'Trámite de tutelas por barreras de acceso a salud y SISBÉN.',
      'Acompañamiento en titulación de vivienda y derechos sobre el predio.',
    ],
  },
  {
    id: 'programa-7',
    number: '07',
    title: 'Proyecto de Vida & Autonomía',
    badge: 'Autonomía Económica',
    badgeBg: 'bg-fuchsia-100/90',
    badgeTextColor: 'text-fuchsia-900',
    summary: 'Capacitación en artes, oficios, habilidades digitales y capital semilla para romper el ciclo de violencia mediante la independencia económica.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Mujeres emprendedoras en talleres de capacitación y empleo',
    impactStatistic: '65 emprendimientos productivos activos',
    details: [
      'Talleres certificados en confección textil, estética y gastronomía.',
      'Formación en finanzas comunitarias y microcréditos.',
      'Bolsa de empleo y vinculación comercial en Cartagena y Mamonal.',
      'Mentoría de negocio y seguimiento para la sostenibilidad del hogar.',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block bg-pink-100 border border-pink-200 text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            Nuestra Estrategia Integral de Impacto
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-senda-purple-dark tracking-tight leading-tight">
            Los 7 Programas de la <br />
            <span className="bg-gradient-to-r from-senda-pink via-purple-600 to-senda-purple-dark bg-clip-text text-transparent">
              Fundación Senda Mujer
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Un modelo continuo de acompañamiento con evidencia fotográfica e impacto tangible: desde la contención inicial de crisis hasta la independencia económica y autonomía plena.
          </p>
        </div>

        {/* Grid of Programs with Real Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((prog) => {
            const isExpanded = expandedId === prog.id;

            return (
              <div
                key={prog.id}
                id={prog.id}
                className="bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5"
              >
                {/* Visual Header with Program Photo */}
                <div className="relative w-full h-52 overflow-hidden bg-slate-900">
                  <Image
                    src={prog.image}
                    alt={prog.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  {/* Floating Number & Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${prog.badgeBg} ${prog.badgeTextColor} shadow-sm backdrop-blur-md`}>
                      {prog.badge}
                    </span>
                    <span className="text-white font-mono font-black text-sm bg-black/50 px-2.5 py-0.5 rounded-lg border border-white/20">
                      #{prog.number}
                    </span>
                  </div>

                  {/* Impact Statistic Banner over Image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-extrabold text-amber-300 drop-shadow-md block">
                      {prog.impactStatistic}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-extrabold text-senda-purple-dark leading-snug group-hover:text-senda-pink transition-colors">
                      {prog.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {prog.summary}
                    </p>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="space-y-2.5 pt-4 mt-2 border-t border-pink-100 text-xs text-slate-700 animate-fadeIn">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          Acciones & Cobertura Garantizada:
                        </span>
                        {prog.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span className="leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Controls */}
                  <div className="pt-4 mt-4 border-t border-pink-50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(prog.id)}
                      className="text-xs font-bold text-senda-purple hover:text-senda-pink transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-pink-50"
                    >
                      {isExpanded ? 'Ver menos' : 'Conocer detalles'}
                    </button>

                    <Link
                      href={`/agendar-cita?programa=${encodeURIComponent(prog.title)}`}
                      className="text-xs font-extrabold text-white bg-gradient-to-r from-senda-pink to-senda-purple hover:from-senda-purple hover:to-senda-pink px-4 py-2 rounded-xl shadow-xs transition-all hover:shadow-md"
                    >
                      Solicitar Atención
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
