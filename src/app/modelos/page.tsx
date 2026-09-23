import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Scale, BriefcaseBusiness, CheckCircle2 } from 'lucide-react';

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

/* ─── PALETA TOKENS ─────────────────────────────────────────────────────── */
// --senda-plum: #451D42 | --senda-magenta: #B72D78 | --senda-cream: #F7F0E8
// --senda-green: #657C3A | --senda-text: #2E2630   | --senda-white: #FFFFFF

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const CAM_PASOS = [
  { n: '01', title: 'Escuchamos', desc: 'Conocemos los recursos, intereses y capacidades de cada mujer.' },
  { n: '02', title: 'Identificamos', desc: 'Definimos prioridades y oportunidades en conjunto.' },
  { n: '03', title: 'Acompañamos', desc: 'Ofrecemos acompañamiento y brindamos orientación continua.' },
  { n: '04', title: 'Hacemos seguimiento', desc: 'Evaluamos avances y nuevas metas con cada mujer.' },
];

const LINEAS = [
  { nombre: 'Confección y modistería', slug: 'confeccion', color: '#B72D78', icon: '✂️' },
  { nombre: 'Huertas', slug: 'huerta', color: '#657C3A', icon: '🌱' },
  { nombre: 'Piscicultura', slug: 'piscicultura', color: '#2D7AB7', icon: '🐟' },
  { nombre: 'Repostería', slug: 'reposteria', color: '#C47E1A', icon: '🧁' },
  { nombre: 'Artesanías', slug: 'artesanias', color: '#7B3AC4', icon: '🎨' },
  { nombre: 'Avicultura', slug: 'avicultura', color: '#C4A41A', icon: '🐔' },
];

const MERCADO_PASOS = [
  { label: 'Aprendemos', emoji: '📚' },
  { label: 'Producimos', emoji: '⚙️' },
  { label: 'Presentamos', emoji: '🎯' },
  { label: 'Comercializamos', emoji: '🛒' },
];

const THEMIS_PRINCIPIOS = [
  { n: '01', title: 'Información clara', desc: 'Información jurídica comprensible, sin tecnicismos que excluyan.' },
  { n: '02', title: 'Decisiones informadas', desc: 'Las opciones se explican sin presiones para que la mujer decida libremente.' },
  { n: '03', title: 'Confidencialidad', desc: 'Procesos sin revictimización y con plena protección de la privacidad.' },
  { n: '04', title: 'Articulación con rutas', desc: 'Conexión con las rutas competentes para el acceso efectivo a la justicia.' },
];

const CAM_PILARES = [
  { key: 'Capacitación', tagline: 'Aprender es abrir posibilidades', color: '#B72D78' },
  { key: 'Acompañamiento', tagline: 'Juntas en cada paso', color: '#451D42' },
  { key: 'Mercadeo', tagline: 'Un producto, una oportunidad', color: '#657C3A' },
];

/* ─── COMPONENTE ────────────────────────────────────────────────────────── */

export default function ModelosPage() {
  return (
    <div className="bg-[#F7F0E8] text-[#2E2630]">

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F7F0E8]">
        <div className="senda-shell grid min-h-[85vh] items-center gap-8 py-16 lg:grid-cols-2 lg:py-0">
          {/* Left copy */}
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#B72D78]">
              Cómo acompañamos
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] text-[#2E2630] sm:text-6xl lg:text-7xl">
              Dos modelos.{' '}
              <br />
              <span className="text-[#451D42]">Una ruta de acompañamiento.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#5a4f58]">
              En Fundación Senda Mujer transformamos las necesidades de cada mujer
              en rutas de orientación, fortalecimiento y acceso a oportunidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#cam"
                className="inline-flex items-center gap-2 rounded-full bg-[#451D42] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B72D78]"
              >
                Conocer CAM <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#themis"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#451D42] bg-transparent px-6 py-3 text-sm font-semibold text-[#451D42] transition hover:bg-[#451D42] hover:text-white"
              >
                Conocer THEMIS <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right photo */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl lg:aspect-auto lg:h-[80vh]">
              <Image
                src="/hero-modelos.jpg"
                alt="Mujer siendo acompañada por equipo de Senda Mujer"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#451D42]/40 via-transparent to-transparent" />
              {/* Badge sobre la foto */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-4 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#B72D78]">Mujeres que transforman comunidades</p>
                <p className="mt-0.5 text-sm text-[#2E2630]">Acompañamos · Protegemos · Transformamos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaf decoration */}
        <div className="pointer-events-none absolute -right-8 top-20 opacity-10">
          <svg width="160" height="280" viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 0C80 0 160 80 160 160C160 220 120 280 80 280C40 280 0 220 0 160C0 80 80 0 80 0Z" fill="#451D42"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. SELECTOR DE MODELOS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#ddd4ca] bg-white py-10">
        <div className="senda-shell">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-[#B72D78]">
            Nuestros modelos
          </p>
          <p className="mb-8 text-center text-sm text-[#5a4f58]">
            Dos caminos, un mismo propósito: tu bienestar y autonomía.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* CAM card */}
            <a
              href="#cam"
              className="group flex items-center gap-4 rounded-2xl border-2 border-[#451D42]/20 bg-[#F7F0E8] p-5 transition hover:border-[#B72D78] hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#451D42]">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#B72D78]">Modelo CAM</p>
                <p className="font-semibold text-[#2E2630]">Capacitación · Acompañamiento · Mercadeo</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#451D42] transition group-hover:translate-x-1" />
            </a>
            {/* THEMIS card */}
            <a
              href="#themis"
              className="group flex items-center gap-4 rounded-2xl border-2 border-[#451D42]/20 bg-[#F7F0E8] p-5 transition hover:border-[#B72D78] hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#203c3d]">
                <Scale className="h-6 w-6 text-[#d9b991]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#B72D78]">Modelo THEMIS</p>
                <p className="font-semibold text-[#2E2630]">Acompañamiento jurídico</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#451D42] transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. MODELO CAM — INTRO + TRES PILARES
      ═══════════════════════════════════════════════════════════════ */}
      <section id="cam" className="scroll-mt-24 py-20 sm:py-28">
        <div className="senda-shell">
          {/* Header */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Modelo CAM</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#2E2630] sm:text-5xl">
                Capacitación · Acompañamiento · Mercadeo
              </h2>
              <p className="mt-4 text-base leading-7 text-[#5a4f58]">
                Un modelo que fortalece conocimientos, acompaña procesos y conecta
                capacidades con oportunidades reales de mercado.
              </p>
            </div>
            <div className="flex justify-end">
              <div className="rounded-2xl border border-[#ddd4ca] bg-white px-6 py-4">
                <p className="font-serif text-2xl font-bold italic text-[#B72D78]">
                  "Mujeres que transforman comunidades"
                </p>
                <p className="mt-1 text-xs text-[#5a4f58]">— Fundación Senda Mujer</p>
              </div>
            </div>
          </div>

          {/* 3 pilares editoriales */}
          <div className="mt-16 grid gap-0 divide-y divide-[#ddd4ca] sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {CAM_PILARES.map((pilar, i) => (
              <div key={pilar.key} className="group relative overflow-hidden bg-white p-8 transition hover:z-10 hover:shadow-xl sm:first:rounded-l-3xl sm:last:rounded-r-3xl">
                {/* Photo placeholder (tinted background) */}
                <div
                  className="mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl"
                  style={{ background: `${pilar.color}18` }}
                >
                  <Image
                    src={`/cam-${['capacitacion', 'acompanamiento', 'mercadeo'][i]}.jpg`}
                    alt={pilar.key}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs font-black text-[#ddd4ca]">0{i + 1}</span>
                <h3
                  className="mt-1 font-serif text-2xl font-semibold"
                  style={{ color: pilar.color }}
                >
                  {pilar.key}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5a4f58]">{pilar.tagline}</p>
                <div
                  className="mt-4 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ background: pilar.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. CÓMO FUNCIONA CAM — TIMELINE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#451D42] py-20 sm:py-24">
        <div className="senda-shell">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Proceso CAM</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            ¿Cómo funciona CAM?
          </h2>
          <p className="mt-2 text-sm text-white/60">Un proceso cercano, humano y estructurado.</p>

          {/* Desktop timeline */}
          <div className="mt-12 hidden lg:block">
            <div className="relative">
              {/* Línea conectora */}
              <div className="absolute left-0 right-0 top-6 h-px bg-white/20" />
              <div className="grid grid-cols-4 gap-6">
                {CAM_PASOS.map((paso) => (
                  <div key={paso.n} className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-[#451D42] text-sm font-black text-white">
                      {paso.n}
                    </div>
                    <h3 className="text-base font-bold text-white">{paso.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{paso.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="mt-10 space-y-6 lg:hidden">
            {CAM_PASOS.map((paso, i) => (
              <div key={paso.n} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/30 text-xs font-black text-white">
                    {paso.n}
                  </div>
                  {i < CAM_PASOS.length - 1 && (
                    <div className="mt-2 h-full w-px bg-white/20" />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="font-bold text-white">{paso.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. LÍNEAS PRODUCTIVAS — GALERÍA EDITORIAL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="senda-shell">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Líneas productivas</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">
            Capacidades que se convierten en oportunidades
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#5a4f58]">
            Seis líneas de formación, producción y comercialización diseñadas para que
            cada mujer encuentre su camino hacia la autonomía.
          </p>

          {/* Photo grid 2×3 */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {LINEAS.map((linea) => (
              <div
                key={linea.slug}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                {/* Photo */}
                <Image
                  src={`/linea-${linea.slug}.jpg`}
                  alt={linea.nombre}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Default overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 group-hover:pb-12">
                  <div
                    className="mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: linea.color }}
                  >
                    <span>{linea.icon}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{linea.nombre}</p>
                </div>
                {/* Hover CTA */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-[10px] text-white/80">Formación · Producción · Comercialización</p>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-white">
                    Conocer más <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. DEL APRENDIZAJE AL MERCADO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F7F0E8] py-20 sm:py-24">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Ruta productiva</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">
              Del aprendizaje al mercado
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5a4f58]">
              Una ruta que transforma conocimiento en capacidad y capacidad en oportunidades reales.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MERCADO_PASOS.map((paso, i) => (
              <div key={paso.label} className="relative flex flex-col items-center text-center">
                {/* Connector */}
                {i < MERCADO_PASOS.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-[#B72D78]/30 lg:block" />
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#B72D78]/30 bg-white text-2xl shadow-sm">
                  {paso.emoji}
                </div>
                <div className="absolute left-[calc(50%+1.5rem)] top-7 hidden items-center lg:flex">
                  <div className="h-px w-8 bg-[#B72D78]/30" />
                  <ArrowRight className="h-3 w-3 text-[#B72D78]/50" />
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-wider text-[#451D42]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-1 font-semibold text-[#2E2630]">{paso.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. MODELO THEMIS
      ═══════════════════════════════════════════════════════════════ */}
      <section id="themis" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="senda-shell grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Photo */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src="/themis-acompanamiento.jpg"
                alt="Acompañamiento jurídico THEMIS"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#203c3d]/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Modelo THEMIS</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] text-[#2E2630] sm:text-5xl">
              Acompañamiento jurídico con enfoque de género y derechos.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5a4f58]">
              Brindamos orientación jurídica accesible, con enfoque de género y rutas
              de atención para que cada mujer pueda consultar sus derechos y tomar
              decisiones libres e informadas.
            </p>

            <div className="mt-8 space-y-4">
              {THEMIS_PRINCIPIOS.map((p) => (
                <div key={p.n} className="flex gap-4 rounded-2xl border border-[#ddd4ca] bg-[#F7F0E8] p-4">
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

      {/* ═══════════════════════════════════════════════════════════════
          8. DOS MODELOS QUE SE COMPLEMENTAN
      ═══════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#ddd4ca] bg-[#F7F0E8] py-20 sm:py-24">
        <div className="senda-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">Visión integral</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">
              Dos modelos que se complementan
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5a4f58]">
              Algunas necesidades requieren fortalecer capacidades. Otras requieren orientación
              para ejercer derechos. En Senda Mujer, ambos caminos pueden formar parte
              de un acompañamiento integral.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {/* CAM */}
            <div className="rounded-3xl bg-[#451D42] p-8 text-white">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#B72D78]">
                <BriefcaseBusiness className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B72D78]">CAM</p>
              <h3 className="mt-2 font-serif text-xl font-semibold">Fortalecimiento de capacidades</h3>
              <ul className="mt-4 space-y-2">
                {['Capacitación técnica y práctica', 'Acompañamiento al proceso', 'Mercadeo y comercialización', 'Fortalecimiento de capacidades'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#B72D78]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* THEMIS */}
            <div className="rounded-3xl bg-[#203c3d] p-8 text-white">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9b991]/20">
                <Scale className="h-5 w-5 text-[#d9b991]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#d9b991]">THEMIS</p>
              <h3 className="mt-2 font-serif text-xl font-semibold">Orientación para ejercer derechos</h3>
              <ul className="mt-4 space-y-2">
                {['Orientación jurídica accesible', 'Decisiones informadas', 'Confidencialidad y no revictimización', 'Articulación con rutas y redes'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#d9b991]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. CTA FINAL — TU SIGUIENTE PASO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="senda-shell">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B72D78]">
              Estamos para acompañarte
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2E2630] sm:text-4xl">
              ¿Cuál es tu siguiente paso?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5a4f58]">
              Elige el camino que más se adapta a lo que necesitas hoy.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Link
              href="/ayuda"
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#ddd4ca] bg-[#F7F0E8] p-6 text-center transition hover:border-[#B72D78] hover:bg-white hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B72D78]/10 text-2xl transition group-hover:bg-[#B72D78]/20">
                🙋‍♀️
              </div>
              <p className="font-semibold text-[#2E2630]">Necesito orientación</p>
              <p className="text-xs text-[#5a4f58]">Accede a nuestros servicios de acompañamiento</p>
              <ArrowRight className="h-4 w-4 text-[#B72D78] transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/programas"
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#451D42] bg-[#451D42] p-6 text-center text-white transition hover:bg-[#B72D78]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
                📋
              </div>
              <p className="font-semibold">Quiero conocer los programas</p>
              <p className="text-xs text-white/70">Explora nuestra oferta de formación y apoyo</p>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contacto"
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#ddd4ca] bg-[#F7F0E8] p-6 text-center transition hover:border-[#657C3A] hover:bg-white hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#657C3A]/10 text-2xl transition group-hover:bg-[#657C3A]/20">
                💚
              </div>
              <p className="font-semibold text-[#2E2630]">Quiero apoyar a Senda Mujer</p>
              <p className="text-xs text-[#5a4f58]">Súmate a nuestra misión de transformación</p>
              <ArrowRight className="h-4 w-4 text-[#657C3A] transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
