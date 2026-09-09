import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import FounderGreeting from '@/components/FounderGreeting';
import ProgramsGrid from '@/components/ProgramsGrid';
import ActivityGallery from '@/components/ActivityGallery';
import CartagenaDirectory from '@/components/CartagenaDirectory';
import DonationCalculator from '@/components/DonationCalculator';
import AlliesSection from '@/components/AlliesSection';

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Fundación Senda Mujer',
    url: 'https://fundacionsendamujer.vercel.app/',
    logo: 'https://fundacionsendamujer.vercel.app/logo.png',
    description: 'Fundación que ofrece acompañamiento integral, orientación en derechos, salud, protección y autonomía para mujeres y niñas en Cartagena, Colombia.',
    areaServed: ['Cartagena de Indias', 'Bolívar', 'Colombia'],
    telephone: '+57 301 469 2095',
    sameAs: ['https://fundacionsendamujer.vercel.app/'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+57 301 469 2095',
      contactType: 'customer support',
      areaServed: 'CO',
      availableLanguage: 'Spanish',
    },
  };

  const SPECIALTIES = [
    {
      title: 'Psicología & Salud Mental',
      desc: 'Contención en crisis, superación del duelo, terapia individual y círculos de apoyo.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Ginecología & Salud Sexual',
      desc: 'Citologías, tamizaje de ITS, anticoncepción, ecografías y consulta prenatal.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Odontología Preventiva',
      desc: 'Profilaxis, salud oral materno-infantil y urgencias odontológicas.',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Medicina General',
      desc: 'Triage clínico, formulación, control de enfermedades crónicas y remisiones.',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Asesoría Jurídica',
      desc: 'Alimentos, custodia, medidas de protección contra violencia y titulación predial.',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-16 font-sans" itemScope itemType="https://schema.org/NGO">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      
      {/* 1. Hero Section con fotografía humana y mensaje central */}
      <HeroSection />

      {/* 1.2. Saludo y Mensaje de Bienvenida de la Fundadora */}
      <FounderGreeting />

      {/* 1.8. SENDA UNIVERSAL: SISTEMA OPERATIVO DE DERECHOS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-br from-slate-900 via-[#3B0852] to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-purple-800/30 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Sistema Operativo Institucional
                </span>
                <span className="bg-white/10 text-pink-200 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  CONPES 4080 · Ley 1257 · Política SSR
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                SENDA Universal: El Sistema Operativo de Derechos de las Mujeres
              </h2>

              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-3xl">
                Plataforma tecnológica de descubrimiento de derechos, políticas públicas territoriales y rutas de atención garantizadas en Cartagena y Colombia. Evalúa barreras institucionales, simula gemelos digitales de rutas clínicas y jurídicas, y genera tu diagnóstico en tiempo real.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                  <h4 className="font-black text-xs text-white">Motor de Políticas IA</h4>
                  <p className="text-[10px] text-purple-200/70 mt-0.5">Algoritmo CONPES & Derechos</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                  <h4 className="font-black text-xs text-white">Test Diagnóstico</h4>
                  <p className="text-[10px] text-purple-200/70 mt-0.5">Mapeo de vulnerabilidad guiado</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                  <h4 className="font-black text-xs text-white">Gemelo Digital Social</h4>
                  <p className="text-[10px] text-purple-200/70 mt-0.5">Simulación de tiempos e ID anónima</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4 backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                Acceso Total Gratuito
              </span>
              <h3 className="font-black text-lg text-white">
                Ingreso al Sistema Operativo
              </h3>
              <p className="text-xs text-purple-200/80">
                Acceso completo a los 9 módulos interactivos, simuladores y motor de derechos.
              </p>
              <Link
                href="/senda-universal"
                className="w-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-xl transition-all text-center"
              >
                Ingresar al Sistema Operativo →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Banner de Test Psicológico y Evaluación Rápida */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="bg-amber-400 text-senda-purple-dark font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Evaluación Confidencial Gratuita
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                ¿Necesitas orientación psicológica, médica o jurídica urgente?
              </h2>
              <p className="text-xs sm:text-sm text-pink-100 leading-relaxed max-w-2xl">
                Realiza nuestro <strong>Test Psicológico y Triaje de Vulnerabilidad (SendaEval)</strong>. El sistema evalúa tu situación de forma anónima y te asigna directamente con la profesional correspondiente en Cartagena.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/triaje-psicologico"
                className="bg-amber-400 hover:bg-amber-300 text-senda-purple-dark font-black text-xs sm:text-sm px-6 py-4 rounded-full text-center shadow-lg transition-transform active:scale-95"
              >
                Iniciar Test Psicológico
              </Link>
              
              <Link
                href="/agendar-cita"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full text-center transition-colors"
              >
                Agendar Cita Directa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Los 7 Programas con Imágenes Reales y Métricas */}
      <ProgramsGrid />

      {/* 4. SECCIÓN DESTACADA: 'LO QUE CONSTRUIMOS JUNTAS' (Galería de Actividades) */}
      <section className="bg-gradient-to-b from-white via-pink-50/30 to-white py-12 border-y border-pink-100">
        <ActivityGallery />
      </section>

      {/* 5. Nuestras 5 Especialidades Médicas y de Acompañamiento con Fotografía */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
              Atención Integral en Cartagena
            </span>
            <h2 className="text-3xl font-black text-senda-purple-dark tracking-tight">
              Nuestras 5 Especialidades de Cuidado
            </h2>
            <p className="text-sm text-slate-600">
              Contamos con profesionales graduadas y aliadas en Cartagena para brindarte atención digna, cálida y sin costo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {SPECIALTIES.map((spec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="relative w-full h-40 overflow-hidden bg-slate-900">
                  <Image
                    src={spec.image}
                    alt={spec.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </div>

                <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 leading-snug group-hover:text-senda-pink transition-colors">
                      {spec.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {spec.desc}
                    </p>
                  </div>

                  <Link
                    href={`/agendar-cita?especialidad=${encodeURIComponent(spec.title)}`}
                    className="text-xs font-black text-senda-pink hover:text-senda-purple transition-colors pt-2 border-t border-pink-50 block text-right"
                  >
                    Solicitar cita →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Directorio y Rutas Institucionales de Cartagena */}
      <section className="bg-pink-50/40 py-16">
        <CartagenaDirectory />
      </section>

      {/* 7. Aliados Institucionales y Red de Apoyo */}
      <AlliesSection />

      {/* 8. Calculadora de Donaciones y Apoyo */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <DonationCalculator />
      </section>

    </div>
  );
}
