import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { programs } from '@/lib/programs';

export default function ProgramsGrid() {
  return <section className="bg-[#f4eee7] py-16 sm:py-24"><div className="senda-shell">
    <div className="mb-10 max-w-2xl"><p className="senda-eyebrow">Acompañamiento integral</p><h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#26231f] sm:text-5xl">Un programa para cada momento del camino.</h2><p className="mt-5 text-sm leading-7 text-[#6c665f]">Conoce qué hacemos, cómo funciona cada ruta y una galería ilustrativa de las acciones que hacen parte del acompañamiento.</p></div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{programs.map((program) => <article key={program.slug} className="group overflow-hidden rounded-[22px] border border-[#ddd4ca] bg-[#fffdf9] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden"><Image src={program.image} alt={program.imageAlt} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"/><div className="absolute inset-0 bg-gradient-to-t from-[#2d2528]/70 to-transparent"/><span className="absolute bottom-4 left-5 font-mono text-xs font-bold tracking-[.16em] text-white">{program.number}</span><span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6e3f58] backdrop-blur">{program.focus}</span></div>
      <div className="p-6"><h3 className="font-serif text-2xl font-semibold leading-tight text-[#26231f]">{program.title}</h3><p className="mt-3 min-h-[64px] text-sm leading-6 text-[#6c665f]">{program.summary}</p><Link href={`/programas/${program.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#6e3f58] transition group-hover:text-[#e12880]">Conocer el programa <ArrowUpRight className="h-4 w-4"/></Link></div>
    </article>)}</div>
  </div></section>;
}
