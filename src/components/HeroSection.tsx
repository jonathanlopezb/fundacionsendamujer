import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fcf9f6] py-12 sm:py-16 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b991] to-transparent" />
      <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-[#ead9cb]/60 blur-3xl" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-black uppercase tracking-[.16em] text-senda-pink">Cartagena · Bolívar · Colombia</p>
            <h1 className="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-.045em] leading-[.98] text-senda-purple-dark">
              Ninguna mujer debería enfrentar <span className="font-serif font-medium italic text-senda-pink">sola</span> su camino.
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
              Acompañamiento gratuito, confidencial e integral para mujeres y niñas que necesitan apoyo psicológico, médico, jurídico o social.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="#necesidades" className="inline-flex items-center justify-center rounded-full bg-senda-pink px-7 py-4 text-sm font-black text-white shadow-glass-pink hover:bg-senda-pink-dark hover:-translate-y-0.5 transition-all">Necesito ayuda <span className="ml-2">→</span></Link>
              <Link href="/triaje-psicologico" className="inline-flex items-center justify-center rounded-full border border-[#d9c8bd] bg-white px-7 py-4 text-sm font-black text-senda-purple-dark hover:border-senda-pink hover:text-senda-pink transition-colors">Hacer test psicológico</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-[.08em] text-slate-500"><span className="text-senda-pink">● Gratuito</span><span>● Confidencial</span><span>● Sin juzgamiento</span></div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#ead9cb] to-[#d6e1d5] blur-xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-3 shadow-2xl">
              <div className="relative h-[380px] sm:h-[460px] overflow-hidden rounded-[1.25rem] bg-[#806b60]">
                <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=85" alt="Acompañamiento humano y profesional de Fundación Senda Mujer" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#281f20]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-white"><span className="text-[10px] font-black uppercase tracking-[.14em] text-[#f0d2a7]">Atención territorial</span><p className="mt-2 max-w-xs text-lg font-bold leading-snug">Personas que acompañan a personas.</p></div>
              </div>
              <div className="absolute -bottom-4 -left-3 sm:-left-8 max-w-[260px] rounded-2xl border border-[#e7ddd5] bg-white px-5 py-4 shadow-xl"><div className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" /><div><p className="text-xs font-black text-slate-800">Atención cercana</p><p className="mt-1 text-[11px] leading-relaxed text-slate-500">Rutas claras y seguimiento profesional cuando lo necesites.</p></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
