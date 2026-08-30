import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ProgramsGrid from '@/components/ProgramsGrid';
import CartagenaDirectory from '@/components/CartagenaDirectory';
import DonationCalculator from '@/components/DonationCalculator';
import SendaUniversalModule from '@/components/SendaUniversalModule';
import CharlaDelDia from '@/components/CharlaDelDia';
import { BrainCircuit, ShieldCheck, Heart, Calendar, ArrowRight, UserCheck, Stethoscope, Smile, Scale, Brain, Globe, Compass, Workflow, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 1.5. CHARLA DEL DÍA (Featured Video Section) */}
      <CharlaDelDia />

      {/* 1.8. SENDA UNIVERSAL FLAGSHIP SYSTEM OPERATIVO */}
      <section className="bg-slate-950/5 py-4">
        <SendaUniversalModule />
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
                Realiza nuestro **Test Psicológico & Triaje de Vulnerabilidad (SendaEval)**. El sistema evalúa tu situación en 4 áreas y te asigna directamente con la profesional correspondiente en Cartagena.
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

      {/* 6. Donation Platform Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <DonationCalculator />
      </section>

    </div>
  );
}
