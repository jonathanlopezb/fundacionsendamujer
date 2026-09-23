import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ChevronRight, 
  Scale, 
  BriefcaseBusiness, 
  Scissors, 
  Sprout, 
  Fish, 
  CakeSlice, 
  Palette, 
  Bird, 
  BookOpen, 
  Users, 
  ShoppingBag,
  FileText,
  ShieldCheck,
  Lock,
  Network,
  Plus
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Modelos de Acompañamiento | CAM y THEMIS',
  description:
    'Dos modelos, una ruta de acompañamiento: CAM (Capacitación, Acompañamiento y Mercadeo) y THEMIS (orientación jurídica con enfoque de género y derechos).',
  openGraph: {
    title: 'Modelos de Acompañamiento | Fundación Senda Mujer',
    description:
      'Transformamos las necesidades de cada mujer en rutas de orientación, fortalecimiento y acceso a oportunidades en Cartagena.',
    url: 'https://fundacionsendamujer.org/modelos',
    images: [{ url: 'https://fundacionsendamujer.org/logo.png', width: 1200, height: 630, alt: 'Fundación Senda Mujer' }],
  },
};

const CAM_PASOS = [
  { n: '01', title: 'Escuchamos', desc: 'Conocemos tus necesidades, intereses y capacidades.' },
  { n: '02', title: 'Identificamos', desc: 'Definimos prioridades y oportunidades.' },
  { n: '03', title: 'Acompañamos', desc: 'Activamos redes y brindamos orientación continua.' },
  { n: '04', title: 'Hacemos seguimiento', desc: 'Evaluamos avances y nuevos retos.' },
];

const LINEAS_PRODUCTIVAS = [
  {
    nombre: 'Confección y modistería',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    icon: Scissors,
    color: '#B72D78',
  },
  {
    nombre: 'Huertas',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
    icon: Sprout,
    color: '#657C3A',
  },
  {
    nombre: 'Piscicultura',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    icon: Fish,
    color: '#2D7AB7',
  },
  {
    nombre: 'Repostería',
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    icon: CakeSlice,
    color: '#C47E1A',
  },
  {
    nombre: 'Artesanías',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    icon: Palette,
    color: '#7B3AC4',
  },
  {
    nombre: 'Avicultura',
    img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    icon: Bird,
    color: '#C4A41A',
  },
];

const RUTA_MERCADO = [
  {
    titulo: 'Aprendemos',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    icon: BookOpen,
  },
  {
    titulo: 'Producimos',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    icon: Scissors,
  },
  {
    titulo: 'Presentamos',
    img: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=600&q=80',
    icon: ShoppingBag,
  },
  {
    titulo: 'Comercializamos',
    img: 'https://images.unsplash.com/photo-1556742049-0a67c5576a88?auto=format&fit=crop&w=600&q=80',
    icon: Users,
  },
];

const THEMIS_PRINCIPIOS = [
  { n: '01', title: 'Información jurídica comprensible', icon: FileText },
  { n: '02', title: 'Decisiones libres e informadas', icon: ShieldCheck },
  { n: '03', title: 'Confidencialidad y no revictimización', icon: Lock },
  { n: '04', title: 'Articulación con rutas competentes', icon: Network },
];

export default function ModelosPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#2E2630] font-sans antialiased selection:bg-[#B72D78]/20">
      
      {/* ── 1. HERO ── */}
      <section className="relative overflow-hidden bg-[#FAF7F2] pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="senda-shell">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            
            {/* Texto Hero */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B72D78]">
                  CÓMO ACOMPAÑAMOS
                </span>
                <span className="h-px w-8 bg-[#B72D78]/40" />
              </div>
              
              <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[#2E2630] sm:text-5xl lg:text-6xl">
                Dos modelos.<br />
                <span className="text-[#451D42]">Una ruta de acompañamiento.</span>
              </h1>
              
              <p className="max-w-xl text-base leading-relaxed text-[#6B5D68] sm:text-lg">
                En Fundación Senda Mujer transformamos las necesidades de cada mujer en rutas de orientación, fortalecimiento y acceso a oportunidades.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#cam"
                  className="inline-flex items-center gap-2 rounded-full bg-[#451D42] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B72D78] hover:shadow"
                >
                  Conocer CAM <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#themis"
                  className="inline-flex items-center gap-2 rounded-full border border-[#451D42]/30 bg-transparent px-6 py-3.5 text-sm font-semibold text-[#451D42] transition hover:bg-[#451D42]/5"
                >
                  Conocer THEMIS <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Imagen Hero */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85"
                  alt="Mujeres en acompañamiento en Fundación Senda Mujer"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── 2. SELECTOR DE MODELOS ── */}
      <section className="border-y border-[#E8E0D7] bg-[#FAF7F2] py-8 lg:py-10">
        <div className="senda-shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-4">
              <h2 className="font-serif text-2xl font-bold text-[#2E2630]">Nuestros modelos</h2>
              <p className="mt-1 text-sm text-[#6B5D68]">Dos caminos, un mismo propósito: tu bienestar y autonomía.</p>
            </div>

            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              <a
                href="#cam"
                className="group flex items-center justify-between rounded-2xl border border-[#E8E0D7] bg-[#F4EDE4] p-4 transition hover:border-[#B72D78]/50 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#B72D78] text-white">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2E2630] group-hover:text-[#B72D78]">CAM</h3>
                    <p className="text-xs text-[#6B5D68]">Capacitación · Acompañamiento · Mercadeo</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#B72D78] transition group-hover:translate-x-1" />
              </a>

              <a
                href="#themis"
                className="group flex items-center justify-between rounded-2xl border border-[#E8E0D7] bg-[#451D42] p-4 text-white transition hover:bg-[#341332] hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">THEMIS</h3>
                    <p className="text-xs text-white/70">Acompañamiento jurídico</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/80 transition group-hover:translate-x-1" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. MODELO CAM: TRES PILARES ── */}
      <section id="cam" className="scroll-mt-16 py-16 lg:py-24">
        <div className="senda-shell">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B72D78]">
                MODELO CAM
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#2E2630] sm:text-4xl">
                Capacitación · Acompañamiento · Mercadeo
              </h2>
              <p className="mt-2 max-w-2xl text-base text-[#6B5D68]">
                Un modelo que fortalece conocimientos, acompaña procesos y conecta capacidades con oportunidades.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="font-serif italic text-xl text-[#8E2866] block">
                Mujeres que transforman comunidades ♡
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            {/* 01 Capacitación */}
            <div className="overflow-hidden rounded-3xl border border-[#E8E0D7] bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=800&q=80"
                  alt="Capacitación en Senda Mujer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B72D78] text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2E2630]">Capacitación</h3>
                    <p className="text-xs text-[#6B5D68]">Aprender para crecer.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 02 Acompañamiento */}
            <div className="overflow-hidden rounded-3xl border border-[#E8E0D7] bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=800&q=80"
                  alt="Acompañamiento en Senda Mujer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#657C3A] text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2E2630]">Acompañamiento</h3>
                    <p className="text-xs text-[#6B5D68]">Juntas en cada paso.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 03 Mercadeo */}
            <div className="overflow-hidden rounded-3xl border border-[#E8E0D7] bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80"
                  alt="Mercadeo y oportunidades en Senda Mujer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9E2A68] text-white">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2E2630]">Mercadeo</h3>
                    <p className="text-xs text-[#6B5D68]">Del producto a la oportunidad.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. ¿CÓMO FUNCIONA CAM? ── */}
      <section className="border-y border-[#E8E0D7] bg-[#F5EFE7] py-16 lg:py-20">
        <div className="senda-shell">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#2E2630]">¿Cómo funciona CAM?</h2>
            <p className="mt-1 text-sm text-[#6B5D68]">Un proceso cercano, humano y estructurado.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAM_PASOS.map((paso, idx) => (
              <div key={paso.n} className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B72D78] font-bold text-white shadow-sm">
                    {paso.n}
                  </div>
                  {idx < CAM_PASOS.length - 1 && (
                    <div className="hidden h-px flex-1 bg-[#B72D78]/30 lg:block" />
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#2E2630]">{paso.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B5D68]">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LÍNEAS PRODUCTIVAS (FOTOS REALES) ── */}
      <section className="py-16 lg:py-24">
        <div className="senda-shell">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#2E2630]">Líneas productivas</h2>
            <p className="mt-1 text-sm text-[#6B5D68]">Capacidades que se convierten en oportunidades.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LINEAS_PRODUCTIVAS.map((linea) => {
              const Icon = linea.icon;
              return (
                <div
                  key={linea.nombre}
                  className="group relative overflow-hidden rounded-3xl border border-[#E8E0D7] bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={linea.img}
                      alt={linea.nombre}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white shadow"
                      style={{ backgroundColor: linea.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-white drop-shadow-md text-sm sm:text-base">
                      {linea.nombre}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. DEL APRENDIZAJE AL MERCADO ── */}
      <section className="border-y border-[#E8E0D7] bg-[#F5EFE7] py-16 lg:py-20">
        <div className="senda-shell">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#2E2630]">Del aprendizaje al mercado</h2>
            <p className="mt-1 text-sm text-[#6B5D68]">
              Una ruta que transforma conocimiento en capacidad y capacidad en oportunidades.
            </p>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {RUTA_MERCADO.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.titulo} className="flex flex-col items-center">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E8E0D7] shadow-sm">
                    <Image
                      src={item.img}
                      alt={item.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#451D42] text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#2E2630]">{item.titulo}</span>
                    {idx < RUTA_MERCADO.length - 1 && (
                      <span className="text-[#B72D78] font-bold text-xs hidden lg:inline ml-2">→</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. MODELO THEMIS ── */}
      <section id="themis" className="scroll-mt-16 py-16 lg:py-24">
        <div className="senda-shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Columna Izquierda: Título y descripción */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B72D78]">
                MODELO THEMIS
              </span>
              <h2 className="font-serif text-3xl font-bold leading-tight text-[#2E2630] sm:text-4xl">
                Acompañamiento jurídico con enfoque de género y derechos.
              </h2>
              <p className="text-sm leading-relaxed text-[#6B5D68]">
                Brindamos orientación jurídica, acompañamiento integral y acceso a rutas de atención, para que cada mujer conozca sus derechos y pueda tomar decisiones libres e informadas.
              </p>
            </div>

            {/* Columna Centro: Foto Asesoría */}
            <div className="lg:col-span-4 relative">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md border border-[#E8E0D7]">
                <Image
                  src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1000&q=80"
                  alt="Asesoría jurídica THEMIS en Fundación Senda Mujer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </div>
            </div>

            {/* Columna Derecha: 4 Principios */}
            <div className="lg:col-span-3 space-y-4">
              {THEMIS_PRINCIPIOS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.n} className="flex items-start gap-3 rounded-2xl border border-[#E8E0D7] bg-white p-3.5 shadow-sm">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#451D42]/10 text-[#451D42]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#B72D78] uppercase">{p.n}</span>
                      <p className="text-xs font-semibold leading-tight text-[#2E2630]">{p.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. DOS MODELOS QUE SE COMPLEMENTAN ── */}
      <section className="border-t border-[#E8E0D7] bg-[#F5EFE7] py-16 lg:py-20">
        <div className="senda-shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-4 space-y-3">
              <h2 className="font-serif text-2xl font-bold text-[#2E2630] sm:text-3xl">
                Dos modelos que se complementan
              </h2>
              <p className="text-sm leading-relaxed text-[#6B5D68]">
                Algunas necesidades requieren fortalecer capacidades. Otras requieren orientación para ejercer derechos. En Senda Mujer, ambos caminos pueden formar parte de un acompañamiento integral.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-4">
              
              {/* Card CAM */}
              <div className="w-full rounded-3xl border border-[#E8E0D7] bg-[#FCEBF4] p-6 text-[#2E2630]">
                <div className="flex items-center gap-2 text-[#B72D78]">
                  <BriefcaseBusiness className="h-5 w-5" />
                  <span className="font-bold text-sm">CAM</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-[#523F4C]">
                  <li className="flex items-center gap-2"><span>•</span> Capacitación</li>
                  <li className="flex items-center gap-2"><span>•</span> Acompañamiento</li>
                  <li className="flex items-center gap-2"><span>•</span> Mercadeo</li>
                  <li className="font-semibold text-[#B72D78] pt-1">Fortalecimiento de capacidades</li>
                </ul>
              </div>

              {/* Plus separator */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#451D42] text-white">
                <Plus className="h-5 w-5" />
              </div>

              {/* Card THEMIS */}
              <div className="w-full rounded-3xl border border-[#E8E0D7] bg-[#EFEAF2] p-6 text-[#2E2630]">
                <div className="flex items-center gap-2 text-[#451D42]">
                  <Scale className="h-5 w-5" />
                  <span className="font-bold text-sm">THEMIS</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-[#443842]">
                  <li className="flex items-center gap-2"><span>•</span> Orientación jurídica</li>
                  <li className="flex items-center gap-2"><span>•</span> Información</li>
                  <li className="flex items-center gap-2"><span>•</span> Decisiones informadas</li>
                  <li className="font-semibold text-[#451D42] pt-1">Acceso a rutas</li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 9. CTA FINAL: ¿CUÁL ES TU SIGUIENTE PASO? ── */}
      <section className="bg-[#451D42] py-16 lg:py-20 text-white relative overflow-hidden">
        <div className="senda-shell text-center relative z-10">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">¿Cuál es tu siguiente paso?</h2>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/ayuda"
              className="inline-flex items-center gap-2 rounded-full bg-[#B72D78] px-6 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-[#9c2364]"
            >
              🙋‍♀️ Necesito orientación
            </Link>
            
            <Link
              href="/programas"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              📋 Quiero conocer los programas
            </Link>

            <Link
              href="/donar"
              className="inline-flex items-center gap-2 rounded-full bg-[#657C3A] px-6 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-[#52652e]"
            >
              💚 Quiero apoyar a Senda Mujer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
