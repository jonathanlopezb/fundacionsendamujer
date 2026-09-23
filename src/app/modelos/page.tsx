'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Sprout,
  Fish,
  CakeSlice,
  Palette,
  Bird,
  Users,
  RotateCcw,
  Building2,
  TrendingUp,
  ShieldCheck,
  Leaf,
  HeartHandshake,
  ChevronRight,
  Star,
  ArrowRight,
} from 'lucide-react';

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const LINEAS = [
  {
    id: 1,
    nombre: 'Confección',
    tagline: 'Diseño, talento y oportunidades',
    color: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-200',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    badgeColor: 'bg-pink-500',
    icon: Scissors,
    recursos: [
      'Máquinas de coser, fileteadoras y recubridora',
      'Telas, hilos y suministros',
      'Moldes y herramientas de patronaje',
      'Mesa de corte y plancha industrial',
      'Capacitación en diseño y comercialización',
    ],
  },
  {
    id: 2,
    nombre: 'Huerta',
    tagline: 'Sembramos vida',
    color: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-500',
    icon: Sprout,
    recursos: [
      'Herramientas agrícolas y semillas',
      'Sistema de riego y sustratos',
      'Compostaje y fertilizantes',
      'Camas de cultivo, mallas y tanques',
      'Infraestructura productiva completa',
    ],
  },
  {
    id: 3,
    nombre: 'Piscicultura',
    tagline: 'Agua, alimento y futuro',
    color: 'from-sky-500 to-blue-600',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    badgeColor: 'bg-sky-500',
    icon: Fish,
    recursos: [
      'Estanques y sistemas de agua',
      'Alevinos y alimentación',
      'Equipos de monitoreo',
      'Redes y herramientas de captura',
      'Área de procesamiento y empaque',
    ],
  },
  {
    id: 4,
    nombre: 'Repostería',
    tagline: 'Creatividad que endulza vidas',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeColor: 'bg-amber-500',
    icon: CakeSlice,
    recursos: [
      'Hornos, batidoras y utensilios',
      'Ingredientes e insumos premium',
      'Moldes y decoración especializada',
      'Formación en recetas, empaque y venta',
      'Desarrollo de productos locales',
    ],
  },
  {
    id: 5,
    nombre: 'Artesanías',
    tagline: 'Tradición, cultura y valor',
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    badgeColor: 'bg-violet-500',
    icon: Palette,
    recursos: [
      'Materiales (fibras, maderas, semillas)',
      'Herramientas y equipos básicos',
      'Diseño y desarrollo de productos',
      'Técnicas artesanales certificadas',
      'Estrategias de comercialización',
    ],
  },
  {
    id: 6,
    nombre: 'Avicultura',
    tagline: 'Nutrición y bienestar',
    color: 'from-yellow-400 to-lime-500',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    badgeColor: 'bg-yellow-500',
    icon: Bird,
    recursos: [
      'Infraestructura de galpones',
      'Pollitas ponedoras certificadas',
      'Alimentación y bebederos',
      'Equipos de manejo y bioseguridad',
      'Producción y comercialización de huevos',
    ],
  },
];

const IMPACTO = [
  { icon: ShieldCheck, label: 'Seguridad alimentaria', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { icon: TrendingUp, label: 'Generación de ingresos', color: 'text-pink-600', bg: 'bg-pink-100' },
  { icon: Users, label: 'Fortalecimiento comunitario', color: 'text-violet-600', bg: 'bg-violet-100' },
  { icon: Leaf, label: 'Uso responsable de recursos', color: 'text-green-600', bg: 'bg-green-100' },
  { icon: Star, label: 'Desarrollo sostenible', color: 'text-amber-600', bg: 'bg-amber-100' },
];

const INFRAESTRUCTURA = [
  'Espacios de trabajo adecuados',
  'Herramientas y equipos especializados',
  'Capacitación técnica y financiera',
  'Mobiliario y tecnología',
  'Seguridad industrial',
  'Acompañamiento psicosocial',
];

const ROTACION = [
  'Cada mujer elige su línea principal',
  'Rotación planificada por las demás áreas',
  'Formación integral y especializada',
  'Acompañamiento psicosocial continuo',
  'Trabajo en equipo y emprendimiento',
];

const PILARES_CAM = [
  {
    key: 'Capacitación',
    desc: 'Formación técnica, empresarial y en habilidades blandas para que cada mujer domine su línea productiva.',
    icon: HeartHandshake,
    color: 'from-pink-500 to-rose-500',
  },
  {
    key: 'Producción',
    desc: 'Implementación práctica con infraestructura real: equipos, insumos y espacios de trabajo dignos.',
    icon: Building2,
    color: 'from-violet-500 to-purple-600',
  },
  {
    key: 'Comercialización',
    desc: 'Estrategias de mercado, canales de venta, marca personal y conexión con compradores reales.',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'Autonomía',
    desc: 'Empoderamiento financiero, toma de decisiones y construcción de un proyecto de vida sostenible.',
    icon: Star,
    color: 'from-amber-400 to-orange-500',
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */

export default function ModelosPage() {
  const [activeLinea, setActiveLinea] = useState<number | null>(null);

  return (
    <div className="bg-[#fbf8f3] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6e3f58] via-[#9b3066] to-[#c73b86] pb-24 pt-20 sm:pt-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-pink-300/10 blur-3xl" />

        <div className="senda-shell relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-100 backdrop-blur-sm">
              Modelo Productivo ·&nbsp;<span className="text-white">CAM</span>
            </span>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Mujeres que construyen{' '}
              <span className="text-pink-200">oportunidades</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-pink-100/90">
              Un programa productivo, formativo y sostenible que integra seis líneas productivas,
              para que <strong className="text-white">60 mujeres</strong> desarrollen habilidades,
              generen ingresos y construyan un futuro más independiente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Formación', 'Producción', 'Comercialización', 'Autonomía'].map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#lineas"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#9b3066] shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
              >
                Ver líneas productivas <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#impacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Ver impacto <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right — stats card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-200">Alcance del programa</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { value: '60', label: 'Mujeres beneficiadas', sub: 'por rotación activa' },
                  { value: '6', label: 'Líneas productivas', sub: 'especializadas' },
                  { value: '4', label: 'Pilares del modelo', sub: 'CAM integrado' },
                  { value: '100%', label: 'Libre elección', sub: 'de línea principal' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold text-pink-100">{stat.label}</p>
                    <p className="text-[10px] text-pink-200/70">{stat.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-pink-400/20 to-rose-400/20 p-4">
                <p className="text-sm font-semibold text-white">🌟 Mujeres que transforman comunidades</p>
                <p className="mt-1 text-xs text-pink-100/80">Acompañamos · Protegemos · Transformamos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 20C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#fbf8f3" />
          </svg>
        </div>
      </section>

      {/* ── PILARES CAM ───────────────────────────────────────────────────── */}
      <section className="senda-section">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="senda-eyebrow">Modelo CAM</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#26231f] sm:text-5xl">
              Los cuatro pilares que mueven el modelo
            </h2>
            <p className="mt-4 text-base leading-7 text-[#6c665f]">
              Capacitación, Producción, Comercialización y Autonomía: una cadena de valor diseñada
              para transformar la vida de cada mujer y su comunidad.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILARES_CAM.map((pilar, i) => {
              const Icon = pilar.icon;
              return (
                <div
                  key={pilar.key}
                  className="group relative overflow-hidden rounded-3xl border border-[#ddd4ca] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pilar.color} shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-black text-[#ddd4ca]">0{i + 1}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-[#26231f]">{pilar.key}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6c665f]">{pilar.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${pilar.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LÍNEAS PRODUCTIVAS ────────────────────────────────────────────── */}
      <section id="lineas" className="scroll-mt-24 bg-[#f4eee7] py-20 sm:py-28">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="senda-eyebrow">Nuestras líneas productivas</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#26231f] sm:text-5xl">
              Seis caminos hacia la independencia
            </h2>
            <p className="mt-4 text-base leading-7 text-[#6c665f]">
              Cada línea es un ecosistema completo: equipos, formación, acompañamiento y mercado.
              Haz clic en cada una para conocer sus recursos.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LINEAS.map((linea) => {
              const Icon = linea.icon;
              const isActive = activeLinea === linea.id;
              return (
                <button
                  key={linea.id}
                  onClick={() => setActiveLinea(isActive ? null : linea.id)}
                  className={`group w-full rounded-3xl border-2 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isActive ? `${linea.borderColor} shadow-lg` : 'border-transparent'
                  }`}
                >
                  {/* Card header gradient */}
                  <div className={`flex items-center gap-4 rounded-t-3xl bg-gradient-to-r ${linea.color} p-5`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white/60">0{linea.id}</span>
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Línea
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white">{linea.nombre}</h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className={`text-sm font-semibold bg-gradient-to-r ${linea.color} bg-clip-text text-transparent`}>
                      {linea.tagline}
                    </p>

                    <div
                      className={`mt-4 overflow-hidden transition-all duration-500 ${
                        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6c665f]">Recursos disponibles</p>
                      <ul className="space-y-2">
                        {linea.recursos.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-[#26231f]">
                            <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-br ${linea.color}`} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-xs text-[#6c665f] transition-all group-hover:text-[#9b3066]">
                      <span>{isActive ? 'Ocultar detalle' : 'Ver recursos disponibles'}</span>
                      <ChevronRight className={`h-3 w-3 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ROTACIÓN 60 MUJERES ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6e3f58]/5 via-transparent to-pink-100/30" />

        <div className="senda-shell relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Big number visual */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-dashed border-[#9b3066]/30 sm:h-80 sm:w-80">
                {/* Inner card */}
                <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#6e3f58] to-[#c73b86] shadow-2xl sm:h-56 sm:w-56">
                  <RotateCcw className="mb-1 h-8 w-8 text-pink-200" />
                  <p className="text-5xl font-black text-white sm:text-6xl">60</p>
                  <p className="text-sm font-semibold text-pink-200">mujeres</p>
                </div>
              </div>
              {/* Orbiting labels */}
              {LINEAS.slice(0, 6).map((l, i) => {
                const angle = (i / 6) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const radius = 155;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const Icon = l.icon;
                return (
                  <div
                    key={l.id}
                    className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    <Icon className="h-5 w-5 text-[#9b3066]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="senda-eyebrow">Rotación y libre elección</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#26231f] sm:text-5xl">
              Un modelo diseñado para la equidad y la especialización
            </h2>
            <p className="mt-4 text-base leading-7 text-[#6c665f]">
              Las 60 mujeres del programa no están encasilladas en una sola actividad.
              El sistema de rotación garantiza que cada participante desarrolle habilidades
              en todas las líneas mientras profundiza en la que eligió como principal.
            </p>
            <ul className="mt-6 space-y-3">
              {ROTACION.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9b3066] to-[#c73b86]">
                    <ChevronRight className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-[#26231f]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── INFRAESTRUCTURA ───────────────────────────────────────────────── */}
      <section className="bg-[#203c3d] py-20 sm:py-24">
        <div className="senda-shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d9b991]">Infraestructura y apoyo</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Todo lo que necesitan para producir y crecer
            </h2>
            <p className="mt-4 text-base leading-7 text-[#d6e7e1]">
              La Fundación garantiza que cada mujer cuente con las herramientas, los espacios
              y el acompañamiento necesarios para que su trabajo sea digno, seguro y rentable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {INFRAESTRUCTURA.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10"
              >
                <div className="mb-2 h-1 w-8 rounded-full bg-[#d9b991]" />
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACTO ───────────────────────────────────────────────────────── */}
      <section id="impacto" className="scroll-mt-24 senda-section">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="senda-eyebrow">Impacto real</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#26231f] sm:text-5xl">
              Más que producción, una transformación de vida
            </h2>
            <p className="mt-4 text-base leading-7 text-[#6c665f]">
              El Modelo Productivo de la Fundación Senda Mujer genera impacto en cinco dimensiones
              que trascienden lo económico.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {IMPACTO.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group flex min-w-[200px] flex-1 flex-col items-center gap-3 rounded-3xl border border-[#ddd4ca] bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} transition group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <p className="text-sm font-bold text-[#26231f]">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA CIERRE ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6e3f58] via-[#9b3066] to-[#c73b86] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-pink-300/10 blur-3xl" />
        </div>

        <div className="senda-shell relative z-10 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-pink-200">Fundación Senda Mujer</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Más que un proyecto,<br />
              <span className="text-pink-200">una red de oportunidades</span>
            </h2>
            <p className="mt-6 text-lg font-semibold text-white/80">
              MUJERES FUERTES, COMUNIDADES MÁS GRANDES
            </p>
            <p className="mt-4 text-base leading-7 text-pink-100/80">
              Cada mujer que forma parte del programa no solo aprende un oficio:
              construye su autonomía, fortalece su comunidad y demuestra que el
              cambio comienza con oportunidades reales.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/programas"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#9b3066] shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Ver nuestros programas <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Contáctanos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Bottom pillars bar */}
            <div className="mt-16 flex flex-wrap justify-center gap-6 border-t border-white/20 pt-8">
              {['Capacitación', 'Producción', 'Comercialización', 'Autonomía'].map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-pink-300" />
                  <span className="text-sm font-semibold text-white/80">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
