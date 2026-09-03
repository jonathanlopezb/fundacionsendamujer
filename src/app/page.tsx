import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import FounderGreeting from '@/components/FounderGreeting';
import ProgramsGrid from '@/components/ProgramsGrid';
import CartagenaDirectory from '@/components/CartagenaDirectory';
import DonationCalculator from '@/components/DonationCalculator';
import SendaUniversalModule from '@/components/SendaUniversalModule';
import AlliesSection from '@/components/AlliesSection';
import { BrainCircuit, ShieldCheck, Heart, Calendar, ArrowRight, UserCheck, Stethoscope, Smile, Scale, Brain, Globe, Compass, Workflow, Zap } from 'lucide-react';

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

  return (
    <div className="space-y-16 pb-16" itemScope itemType="https://schema.org/NGO">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 1.2. SALUDO Y MENSAJE DE BIENVENIDA DE LA FUNDADORA */}
      <FounderGreeting />

      {/* 1.8. SENDA UNIVERSAL FLAGSHIP SYSTEM OPERATIVO — SÍNTESIS EJECUTIVA DE ALTA VELOCIDAD */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-br from-slate-900 via-[#3B0852] to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-purple-800/30 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  Sistema Operativo Institucional
                </span>
                <span className="bg-white/10 text-pink-200 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  CONPES 4080 • Ley 1257 • Política SSR 2026-2035
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                🌍 SENDA Universal: El Sistema Operativo de Derechos de las Mujeres
              </h2>

              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-3xl">
                Plataforma tecnológica de descubrimiento de derechos, políticas públicas territoriales y rutas de atención garantizadas en Cartagena y Colombia. Evalúa barreras institucionales, simula gemelos digitales de rutas clínicas/jurídicas y genera tu diagnóstico en tiempo real.
              </p>

              {/* Feature Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Workflow className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Motor de Políticas IA</h4>
                    <p className="text-[10px] text-purple-200/70">Groq LLM & Algoritmo CONPES</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-4 h-4 text-pink-300" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Test Diagnóstico</h4>
                    <p className="text-[10px] text-purple-200/70">Mapeo de derechos en 4 pasos</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Gemelo Digital Social</h4>
                    <p className="text-[10px] text-purple-200/70">Simulación de tiempos e ID Anónima</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right CTA Box */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4 backdrop-blur-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-pink-500 rounded-2xl flex items-center justify-center text-slate-950 font-extrabold shadow-lg">
                <Globe className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Ingreso al Sistema Operativo</h3>
                <p className="text-xs text-purple-200/80 mt-1">
                  Acceso completo a los 9 módulos interactivos, simuladores y motor de derechos.
                </p>
              </div>

              <Link
                href="/senda-universal"
                className="w-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-extrabold text-sm py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Ingresar al Sistema Operativo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Quick Triage Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" /> Evaluación Confidencial Gratuita
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                ¿Necesitas orientación psicológica, médica o jurídica urgente?
              </h2>
              <p className="text-xs sm:text-sm text-pink-100 leading-relaxed max-w-2xl">
                Realiza nuestro <strong>Test Psicológico y Triaje de Vulnerabilidad (SendaEval)</strong>. El sistema evalúa tu situación en 4 áreas y te asigna directamente con la profesional correspondiente en Cartagena.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                href="/triaje-psicologico"
                className="bg-amber-400 hover:bg-amber-300 text-senda-purple-dark font-extrabold text-sm px-6 py-4 rounded-full text-center shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <BrainCircuit className="w-5 h-5 text-senda-purple" />
                <span>Iniciar Test Psicológico</span>
              </Link>
              
              <Link
                href="/agendar-cita"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm px-6 py-3.5 rounded-full text-center transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4 text-pink-200" />
                <span>Agendar Cita Directa</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 7 Core Programs Grid */}
      <ProgramsGrid />

      {/* 4. Multidisciplinary Specialties Ribbon */}
      <section className="bg-white py-16 border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
              Atención Integral en Cartagena
            </span>
            <h2 className="text-3xl font-extrabold text-senda-purple-dark">
              Nuestras 5 Especialidades de Acompañamiento
            </h2>
            <p className="text-sm text-slate-600">
              Contamos con profesionales graduadas y aliadas en Cartagena para brindarte atención digna y sin costo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: 'Psicología & Mente', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Odontología Integral', icon: Smile, color: 'text-sky-600', bg: 'bg-sky-50' },
              { title: 'Medicina General', icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Asesoría Jurídica', icon: Scale, color: 'text-amber-600', bg: 'bg-amber-50' },
              { title: 'Trabajo Social', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
            ].map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div key={idx} className={`${spec.bg} p-6 rounded-3xl border border-slate-100 space-y-3 hover:shadow-md transition-shadow text-center`}>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Icon className={`w-6 h-6 ${spec.color}`} />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800">{spec.title}</h3>
                  <Link
                    href={`/agendar-cita?especialidad=${encodeURIComponent(spec.title)}`}
                    className="text-xs font-bold text-senda-pink hover:underline inline-flex items-center gap-1"
                  >
                    <span>Solicitar cita</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Cartagena Emergency Directory Section */}
      <section className="bg-pink-50/40 py-16">
        <CartagenaDirectory />
      </section>

      {/* 5.5. Institutional Allies & Network Section */}
      <AlliesSection />

      {/* 6. Donation Platform Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <DonationCalculator />
      </section>

    </div>
  );
}
