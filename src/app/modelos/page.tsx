import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Scale, BriefcaseBusiness, CheckCircle2, Scissors, Sprout, Fish, CakeSlice, Palette, Bird } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Modelos de Acompañamiento | CAM & THEMIS',
  description:
    'Conoce los modelos CAM (Capacitación, Acompañamiento, Mercadeo) y THEMIS (orientación jurídica con enfoque de género) de la Fundación Senda Mujer.',
  openGraph: {
    title: 'Modelos de Acompañamiento CAM & THEMIS | Fundación Senda Mujer',
    description:
      'Transformamos las necesidades de cada mujer en rutas de orientación, fortalecimiento y acceso a oportunidades.',
    url: 'https://fundacionsendamujer.org/modelos',
  },
};

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const CAM_PASOS = [
  { n: '01', title: 'Escuchamos', desc: 'Conocemos los recursos, intereses y capacidades de cada mujer.' },
  { n: '02', title: 'Identificamos', desc: 'Definimos prioridades y oportunidades en conjunto.' },
  { n: '03', title: 'Acompañamos', desc: 'Brindamos acompañamiento y orientación continua.' },
  { n: '04', title: 'Hacemos seguimiento', desc: 'Evaluamos avances y definimos nuevas metas.' },
];

const LINEAS: { nombre: string; slug: string; bg: string; icon: React.ElementType; tagline: string }[] = [
  { nombre: 'Confección y modistería', slug: 'confeccion', bg: 'from-pink-600 to-rose-500', icon: Scissors, tagline: 'Diseño y talento' },
  { nombre: 'Huertas', slug: 'huerta', bg: 'from-emerald-600 to-green-500', icon: Sprout, tagline: 'Sembramos vida' },
  { nombre: 'Piscicultura', slug: 'piscicultura', bg: 'from-sky-600 to-blue-500', icon: Fish, tagline: 'Agua y futuro' },
  { nombre: 'Repostería', slug: 'reposteria', bg: 'from-amber-500 to-orange-400', icon: CakeSlice, tagline: 'Creatividad que endulza' },
  { nombre: 'Artesanías', slug: 'artesanias', bg: 'from-violet-600 to-purple-500', icon: Palette, tagline: 'Tradición y valor' },
  { nombre: 'Avicultura', slug: 'avicultura', bg: 'from-yellow-500 to-lime-400', icon: Bird, tagline: 'Nutrición y bienestar' },
];

const MERCADO_PASOS = [
  { label: 'Aprendemos', emoji: '📚', color: 'bg-[#451D42]' },
  { label: 'Producimos', emoji: '⚙️', color: 'bg-[#B72D78]' },
  { label: 'Presentamos', emoji: '🎯', color: 'bg-[#657C3A]' },
  { label: 'Comercializamos', emoji: '🛒', color: 'bg-[#C47E1A]' },
];

const THEMIS_PRINCIPIOS = [
  { n: '01', title: 'Información clara', desc: 'Información jurídica comprensible, sin tecnicismos que excluyan.' },
  { n: '02', title: 'Decisiones informadas', desc: 'Las opciones se explican sin presiones para que la mujer decida libremente.' },
  { n: '03', title: 'Confidencialidad', desc: 'Procesos sin revictimización y con plena protección de la privacidad.' },
  { n: '04', title: 'Articulación con rutas', desc: 'Conexión con las rutas competentes para el acceso efectivo a la justicia.' },
];

const CAM_PILARES = [
  {
    key: 'Capacitación',
    tagline: 'Aprender también es abrir nuevas posibilidades',
    desc: 'Formación técnica, empresarial y en habilidades blandas para que cada mujer domine su línea productiva y encuentre su camino.',
    bg: 'from-[#B72D78] to-[#8a1f57]',
    num: '01',
  },
  {
    key: 'Acompañamiento',
    tagline: 'Juntas en cada paso del proceso',
    desc: 'Cada proceso necesita orientación y continuidad. Acompañamos de forma integral: técnica, psicosocial y organizativa.',
    bg: 'from-[#451D42] to-[#2d1230]',
    num: '02',
  },
  {
    key: 'Mercadeo',
    tagline: 'Una capacidad se fortalece cuando encuentra mercado',
    desc: 'Estrategias de comercialización, canales de venta, marca y conexión con compradores para que el trabajo de cada mujer tenga valor real.',
    bg: 'from-[#657C3A] to-[#4a5a29]',
    num: '03',
  },
];

/* ─── COMPONENTE ────────────────────────────────────────────────────────── */

export default function ModelosPage() {
  return (
    <div className="bg-[#F7F0E8] text-[#2E2630]">

      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="senda-shell grid min-h-[90vh] items-center gap-8 py-16 lg:grid-cols-2 lg:py-0">

          {/* Left copy */}
          <div className="relative z-10 py-16 lg:py-28">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#B72D78]">
              Cómo acompañamos
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] text-[#2E2630] sm:text-6xl lg:text-[4.5rem]">
              Dos modelos.{' '}
              <span className="text-[#451D42]">Una ruta de acompañamiento.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#5a4f58]">
              En Fundación Senda Mujer transformamos las necesidades de cada mujer
              en rutas de orientación, fortalecimiento y acceso a oportunidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#cam"
                className="inline-flex items-center gap-2 rounded-full bg-[#451D42] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#B72D78] hover:shadow-lg"
              >
                Conocer CAM <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#themis"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#451D42] px-6 py-3 text-sm font-semibold text-[#451D42] transition hover:bg-[#451D42] hover:text-white"
              >
                Conocer THEMIS <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right — editorial visual */}
          <div className="relative hidden lg:flex lg:h-full lg:items-stretch">
            <div className="relative w-full overflow-hidden rounded-bl-[4rem] bg-gradient-to-br from-[#451D42] via-[#6e2a5f] to-[#B72D78]">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              {/* Center badge */}
              <div className="flex h-full min-h-[90vh] flex-col items-center justify-center gap-8 px-12 text-center">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
                  <p className="font-serif text-4xl font-bold text-white">
                    "Mujeres que transforman comunidades"
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-white/30" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Fundación Senda Mujer</p>
                    <div className="h-px flex-1 bg-white/30" />
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-3">
                  {['Acompañamos', 'Protegemos', 'Formamos', 'Transformamos'].map((word) => (
                    <div key={word} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/90">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaf decoration right */}
        <div className="pointer-events-none absolute -right-12 bottom-0 top-0 hidden w-8 items-center justify-center lg:flex">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-[#B72D78]/10 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. SELECTOR MODELOS
      ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#ddd4ca] bg-white py-10">
        <div className="senda-shell">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-[#B72D78]">Nuestros modelos</p>
          <p className="mb-8 text-center text-sm text-[#5a4f58]">Dos caminos, un mismo propósito: tu bienestar y autonomía.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="#cam" className="group flex items-center gap-4 rounded-2xl border-2 border-[#451D42]/15 bg-[#F7F0E8] p-5 transition hover:border-[#B72D78] hover:bg-white hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#451D42]">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B72D78]">Modelo CAM</p>
                <p className="font-semibold text-[#2E2630]">Capacitación · Acompañamiento · Mercadeo</p>
              </div>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-[#451D42] transition group-hover:translate-x-1" />
            </a>
            <a href="#themis" className="group flex items-center gap-4 rounded-2xl border-2 border-[#451D42]/15 bg-[#F7F0E8] p-5 transition hover:border-[#B72D78] hover:bg-white hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#203c3d]">
                <Scale className="h-6 w-6 text-[#d9b991]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B72D78]">Modelo THEMIS</p>
                <p className="font-semibold text-[#2E2630]">Acompañamiento jurídico con enfoque de género</p>
              </div>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-[#451D42] transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. MODELO CAM — HEADER + TRES PILARES EDITORIALES
      ══════════════════════════════════════════════════════════ */}
      <section id="cam" className="scroll-mt-20 py-20 sm:py-28">
        <div className="senda-shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Modelo CAM</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#2E2630] sm:text-5xl">
                Capacitación · Acompañamiento · Mercadeo
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#5a4f58]">
                Un modelo que fortalece conocimientos, acompaña procesos y conecta
                capacidades con oportunidades reales de mercado.
              </p>
            </div>
          </div>

          {/* Tres pilares — editorial layout */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {CAM_PILARES.map((pilar) => (
              <div key={pilar.key} className="group">
                {/* Visual block */}
                <div className={`relative flex h-48 items-end overflow-hidden rounded-2xl bg-gradient-to-br ${pilar.bg} p-6`}>
                  <div className="absolute right-4 top-4 text-6xl font-black text-white/10">{pilar.num}</div>
                  <div>
                    <p className="text-lg font-black text-white">{pilar.key}</p>
                    <p className="mt-0.5 text-xs text-white/70">{pilar.tagline}</p>
                  </div>
                </div>
                {/* Text below */}
                <div className="mt-4 px-1">
                  <p className="text-sm leading-7 text-[#5a4f58]">{pilar.desc}</p>
                  <div className="mt-3 h-px w-12 rounded-full bg-[#B72D78] transition-all duration-300 group-hover:w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. CÓMO FUNCIONA CAM — TIMELINE
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#451D42] py-20 sm:py-24">
        <div className="senda-shell">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Proceso CAM</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">¿Cómo funciona CAM?</h2>
          <p className="mt-1 text-sm text-white/50">Un proceso cercano, humano y estructurado.</p>

          {/* Desktop */}
          <div className="mt-12 hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {CAM_PASOS.map((paso, i) => (
              <div key={paso.n} className="relative">
                {i < CAM_PASOS.length - 1 && (
                  <div className="absolute left-12 right-0 top-5 h-px bg-white/15" />
                )}
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#451D42] text-xs font-black text-white">
                  {paso.n}
                </div>
                <h3 className="font-bold text-white">{paso.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{paso.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="mt-8 space-y-0 lg:hidden">
            {CAM_PASOS.map((paso, i) => (
              <div key={paso.n} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/25 text-xs font-black text-white">
                    {paso.n}
                  </div>
                  {i < CAM_PASOS.length - 1 && <div className="my-1 h-8 w-px bg-white/15" />}
                </div>
                <div className="pb-4 pt-1">
                  <p className="font-bold text-white">{paso.title}</p>
                  <p className="mt-0.5 text-sm text-white/55">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. LÍNEAS PRODUCTIVAS — GALERÍA EDITORIAL
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="senda-shell">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Líneas productivas</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">
            Capacidades que se convierten en oportunidades
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#5a4f58]">
            Seis líneas de formación, producción y comercialización para que cada
            mujer encuentre su camino hacia la autonomía económica.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {LINEAS.map((linea) => {
              const Icon = linea.icon;
              return (
                <div
                  key={linea.slug}
                  className="group relative aspect-square overflow-hidden rounded-2xl"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${linea.bg}`} />
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                  />
                  {/* Icon large bg */}
                  <div className="absolute right-4 top-4 opacity-20 transition-transform duration-500 group-hover:scale-125">
                    <Icon className="h-20 w-20 text-white" />
                  </div>
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="mt-2 text-base font-bold leading-tight text-white">{linea.nombre}</p>
                    <p className="mt-0.5 text-xs text-white/70">{linea.tagline}</p>
                    {/* Hover reveal */}
                    <div className="mt-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-[10px] text-white/70">Formación · Producción · Comercialización →</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. DEL APRENDIZAJE AL MERCADO
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#ddd4ca] bg-[#F7F0E8] py-20 sm:py-24">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Ruta productiva</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">Del aprendizaje al mercado</h2>
            <p className="mt-3 text-sm leading-7 text-[#5a4f58]">
              Una ruta que transforma conocimiento en capacidad y capacidad en oportunidades reales.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MERCADO_PASOS.map((paso, i) => (
              <div key={paso.label} className="relative flex flex-col items-center text-center">
                {i < MERCADO_PASOS.length - 1 && (
                  <div className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-5rem)] border-t-2 border-dashed border-[#B72D78]/30 lg:block" />
                )}
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${paso.color} text-2xl shadow-md`}>
                  {paso.emoji}
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-wider text-[#451D42]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-1 font-semibold text-[#2E2630]">{paso.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. MODELO THEMIS
      ══════════════════════════════════════════════════════════ */}
      <section id="themis" className="scroll-mt-20 bg-white py-20 sm:py-28">
        <div className="senda-shell grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* Left — visual */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#203c3d] to-[#0f2425] p-10">
              <div
                className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
              />
              <Scale className="relative h-16 w-16 text-[#d9b991]" />
              <p className="relative mt-6 font-serif text-3xl font-semibold text-white">
                Orientación jurídica con enfoque de género y derechos.
              </p>
              <p className="relative mt-4 text-sm leading-7 text-white/60">
                Para que cada mujer pueda consultar sus derechos, tomar decisiones
                libres e informadas y acceder a rutas de protección y justicia.
              </p>
              <div className="relative mt-8 grid grid-cols-2 gap-3">
                {['Confidencialidad', 'No revictimización', 'Enfoque de género', 'Articulación de rutas'].map((tag) => (
                  <div key={tag} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — principios */}
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Modelo THEMIS</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] text-[#2E2630] sm:text-5xl">
              Acompañamiento jurídico con enfoque de género y derechos.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5a4f58]">
              THEMIS guía la orientación jurídica para que la información sea clara,
              las opciones se expliquen sin presiones y el acceso a la justicia
              no produzca nuevas formas de daño.
            </p>
            <div className="mt-8 space-y-3">
              {THEMIS_PRINCIPIOS.map((p) => (
                <div key={p.n} className="flex gap-4 rounded-2xl border border-[#ddd4ca] bg-[#F7F0E8] p-4 transition hover:border-[#B72D78]/30 hover:shadow-sm">
                  <span className="mt-0.5 text-xs font-black text-[#ddd4ca]">{p.n}</span>
                  <div>
                    <p className="font-semibold text-[#2E2630]">{p.title}</p>
                    <p className="mt-0.5 text-sm text-[#5a4f58]">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. DOS MODELOS QUE SE COMPLEMENTAN
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#ddd4ca] bg-[#F7F0E8] py-20 sm:py-24">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Visión integral</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">Dos modelos que se complementan</h2>
            <p className="mt-4 text-sm leading-7 text-[#5a4f58]">
              Algunas necesidades requieren fortalecer capacidades. Otras requieren orientación para ejercer
              derechos. En Senda Mujer, ambos caminos pueden formar parte de un acompañamiento integral.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-[#451D42] p-8 text-white">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#B72D78]">
                <BriefcaseBusiness className="h-5 w-5 text-white" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B72D78]">CAM</p>
              <h3 className="mt-2 font-serif text-xl font-semibold">Fortalecimiento de capacidades</h3>
              <ul className="mt-4 space-y-2">
                {['Capacitación técnica y práctica', 'Acompañamiento al proceso', 'Mercadeo y comercialización', 'Autonomía económica'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#B72D78]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-[#203c3d] p-8 text-white">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9b991]/20">
                <Scale className="h-5 w-5 text-[#d9b991]" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#d9b991]">THEMIS</p>
              <h3 className="mt-2 font-serif text-xl font-semibold">Orientación para ejercer derechos</h3>
              <ul className="mt-4 space-y-2">
                {['Orientación jurídica accesible', 'Decisiones libres e informadas', 'Confidencialidad y no revictimización', 'Articulación con rutas y redes'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#d9b991]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. CTA FINAL
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="senda-shell">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Estamos para acompañarte</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">
              ¿Cuál es tu siguiente paso?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5a4f58]">
              Elige el camino que más se adapta a lo que necesitas hoy.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { href: '/ayuda', emoji: '🙋‍♀️', label: 'Necesito orientación', sub: 'Accede a nuestros servicios de acompañamiento', accent: '#B72D78' },
              { href: '/programas', emoji: '📋', label: 'Quiero conocer los programas', sub: 'Explora nuestra oferta de formación y apoyo', accent: '#451D42' },
              { href: '/contacto', emoji: '💚', label: 'Quiero apoyar a Senda Mujer', sub: 'Súmate a nuestra misión de transformación', accent: '#657C3A' },
            ].map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#ddd4ca] bg-[#F7F0E8] p-6 text-center transition hover:border-transparent hover:bg-white hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F0E8] text-2xl shadow-sm transition group-hover:scale-110">
                  {cta.emoji}
                </div>
                <p className="font-semibold text-[#2E2630]">{cta.label}</p>
                <p className="text-xs text-[#5a4f58]">{cta.sub}</p>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cta.accent }}>
                  Ir <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
