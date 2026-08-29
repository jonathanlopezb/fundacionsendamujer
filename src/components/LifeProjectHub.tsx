'use client';

import React, { useState } from 'react';
import { GraduationCap, Briefcase, Rocket, Award, CheckCircle, ArrowRight, Sparkles, DollarSign } from 'lucide-react';

const COURSES = [
  {
    id: 1,
    title: 'Taller de Confección & Diseño Textil',
    hours: '40 Horas',
    schedule: 'Sábados Mañana',
    partner: 'SENA & Fundación Senda Mujer',
    desc: 'Aprende patronaje, corte y confección para crear tu propia marca de vestuario o uniformes.',
  },
  {
    id: 2,
    title: 'Marketing Digital & Ventas por Redes',
    hours: '30 Horas',
    schedule: 'Modalidad Híbrida',
    partner: 'Aliados Tecnológicos Cartagena',
    desc: 'Crea tu catálogo digital en Instagram y WhatsApp Business para vender tus productos.',
  },
  {
    id: 3,
    title: 'Auxiliar Administrativo & Servicio al Cliente',
    hours: '60 Horas',
    schedule: 'Entre Semana (Tarde)',
    partner: 'Comercios Aliados Centro Histórico',
    desc: 'Formación práctica con oportunidad de vinculación en hoteles y negocios locales.',
  },
];

const JOBS = [
  {
    role: 'Auxiliar de Recepción y Atención',
    company: 'Hotel Boutique Cartagena',
    zone: 'Centro Histórico',
    salary: 'SMLV + Prestaciones',
  },
  {
    role: 'Operaria de Confección Textil',
    company: 'Taller de Moda Caribe',
    zone: 'Pie de la Popa',
    salary: 'SMLV + Bonificaciones',
  },
  {
    role: 'Gestora de Redes y Atención Digital',
    company: 'Agencia de Servicios',
    zone: 'Teletrabajo / Remoto',
    salary: 'Medio Tiempo Flexible',
  },
];

export default function LifeProjectHub() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Programa 7 — Proyecto de Vida
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ruta de Autonomía Económica & Futuro Digno
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Acompañamos a las mujeres más allá del momento crítico, capacitándolas en oficios productivos, conectándolas con empleo digno y financiando sus emprendimientos en Cartagena.
          </p>
        </div>
      </div>

      {/* 5-Step Passport Progress Bar */}
      <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-senda-purple flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Pasaporte de Dignidad — Las 5 Fases de Transformación
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Triaje e Ingreso', status: 'Completado' },
            { step: '02', title: 'Atención Salud & Mente', status: 'Completado' },
            { step: '03', title: 'Protección Jurídica', status: 'En Proceso' },
            { step: '04', title: 'Capacitación Técnica', status: 'Próximo' },
            { step: '05', title: 'Autonomía Económica', status: 'Meta' },
          ].map((item, idx) => (
            <div key={idx} className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 relative space-y-1">
              <span className="text-xs font-black text-senda-pink">{item.step}</span>
              <div className="font-bold text-xs text-slate-800">{item.title}</div>
              <span className="text-[10px] text-emerald-600 font-extrabold block">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cursos & Capacitaciones */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-extrabold text-senda-purple-dark flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-senda-pink" />
            Talleres de Capacitación Gratuita en Cartagena
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <span className="bg-pink-100 text-senda-pink text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {course.hours} • {course.schedule}
                </span>
                <h4 className="font-bold text-base text-senda-purple-dark mt-3 mb-2">{course.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{course.desc}</p>
                <span className="text-[11px] text-slate-500 font-semibold block">Convenio: {course.partner}</span>
              </div>

              <button
                onClick={() => setSelectedCourse(course.id)}
                className="w-full bg-senda-pink hover:bg-senda-pink-dark text-white font-extrabold py-2.5 rounded-full text-xs transition-colors"
              >
                Inscribirme al Taller
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs & Capital Semilla */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Job Board */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-lg text-senda-purple-dark flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-500" />
            Bolsa de Empleo Inclusivo en Cartagena
          </h3>
          <p className="text-xs text-slate-600">
            Vacantes exclusivas con comercios y empresas aliadas comprometidas con la equidad de género.
          </p>

          <div className="space-y-3 pt-2">
            {JOBS.map((job, idx) => (
              <div key={idx} className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{job.role}</h4>
                  <span className="text-[11px] text-slate-500">{job.company} • {job.zone}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {job.salary}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Capital Semilla */}
        <div className="bg-gradient-to-br from-senda-purple to-senda-purple-dark text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
          <h3 className="font-extrabold text-lg text-amber-300 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            Fondo Capital Semilla & Micronegocios
          </h3>
          <p className="text-xs text-pink-100 leading-relaxed">
            Financiamos herramientas, insumos y materia prima para las mujeres graduadas de nuestros talleres que deseen lanzar su negocio propio en Cartagena.
          </p>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-xs space-y-2">
            <div className="flex justify-between font-bold">
              <span>Monto Máximo de Apoyo:</span>
              <span className="text-amber-300">$2.500.000 COP</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Requisito:</span>
              <span>Aprobar Taller de Formación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
