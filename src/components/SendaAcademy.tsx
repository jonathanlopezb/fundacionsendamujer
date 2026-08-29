'use client';

import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, Award, BookOpen, Clock, Sparkles, FileCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const MODULES = [
  {
    id: 1,
    title: 'Módulo 1: Ginecología Preventiva & Derechos Reproductivos',
    duration: '25 min',
    instructor: 'Dra. Elena Ruiz — Ginecóloga Especialista',
    desc: 'Conoce a fondo tu anatomía, salud sexual, señales de alarma y la jurisprudencia colombiana (Sentencias C-055 de 2022 y C-355 de 2006).',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video embed
    completed: true,
  },
  {
    id: 2,
    title: 'Módulo 2: Confección & Patronaje Textil Básico',
    duration: '40 min',
    instructor: 'Instructora Carmen Lora — SENA Aliado',
    desc: 'Fundamentos de toma de medidas, trazado de patrones y costura a máquina para iniciar tu propia línea de ropa.',
    completed: true,
  },
  {
    id: 3,
    title: 'Módulo 3: Marketing Digital & WhatsApp Business Cartagena',
    duration: '30 min',
    instructor: 'Lic. Mateo Gómez — Marketing Digital',
    desc: 'Estrategias sencillas para vender por redes sociales y atender a tus clientes de Cartagena desde tu celular.',
    completed: false,
  },
  {
    id: 4,
    title: 'Módulo 4: Prevención de VBG & Autonomía Jurídica',
    duration: '35 min',
    instructor: 'Dra. Patricia Herrera — Abogada VBG',
    desc: 'Cómo identificar la violencia psicológica o económica y activar las medidas de protección ante comisarías y fiscalía.',
    completed: false,
  },
];

export default function SendaAcademy() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleGenerateCertificate = () => {
    setShowCertificate(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-amber-400 text-senda-purple-dark font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <BookOpen className="w-4 h-4" />
            SendaAcademia Virtual
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Academia de Capacitación & Formación Femenina
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Formación virtual gratuita en ginecología preventiva, derechos sexuales, emprendimiento y costura con certificación oficial para las beneficiarias de Cartagena.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Video Player & Active Lesson Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-xl relative flex items-center justify-center border border-slate-800">
            {/* Embedded Video Simulator */}
            <div className="w-full h-full bg-gradient-to-br from-senda-purple-dark to-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="p-4 bg-senda-pink/20 rounded-full border border-senda-pink/40 animate-pulse">
                <PlayCircle className="w-16 h-16 text-senda-pink" />
              </div>
              <h3 className="font-extrabold text-lg text-white max-w-md">
                {activeModule.title}
              </h3>
              <p className="text-xs text-pink-200">{activeModule.instructor} • {activeModule.duration}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="bg-pink-100 text-senda-pink text-xs font-extrabold px-3 py-1 rounded-full">
                Lección en Curso
              </span>
              <span className="text-xs font-bold text-slate-500">Duración: {activeModule.duration}</span>
            </div>

            <h2 className="text-xl font-extrabold text-senda-purple-dark">{activeModule.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{activeModule.desc}</p>
            
            <div className="pt-4 border-t border-pink-100 flex justify-between items-center">
              <span className="text-xs font-bold text-senda-purple">Impartido por: {activeModule.instructor}</span>
              <button
                onClick={handleGenerateCertificate}
                className="bg-amber-400 hover:bg-amber-300 text-senda-purple-dark font-extrabold px-5 py-2 rounded-full text-xs shadow-sm flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Generar Certificado</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Modules Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-extrabold text-base text-senda-purple-dark flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Temario del Curso (4 Módulos)
          </h3>

          <div className="space-y-3">
            {MODULES.map((mod) => {
              const isSelected = activeModule.id === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 cursor-pointer ${
                    isSelected
                      ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink shadow-sm'
                      : 'border-slate-200 hover:border-pink-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase text-senda-purple">
                      {mod.duration}
                    </span>
                    {mod.completed && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 leading-snug">{mod.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Certificate Modal */}
          {showCertificate && (
            <div className="bg-gradient-to-br from-senda-purple to-senda-purple-dark text-white p-6 rounded-3xl shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center space-x-2 text-amber-300">
                <Award className="w-6 h-6" />
                <span className="font-extrabold text-sm">Certificado de Capacitación</span>
              </div>
              <p className="text-xs text-pink-100">
                Se certifica que la beneficiaria ha aprobado satisfactoriamente los módulos de formación en <strong>Salud Reproductiva, Ginecología Preventiva y Emprendimiento</strong> de la Fundación Senda Mujer Cartagena.
              </p>
              <button
                onClick={() => setShowCertificate(false)}
                className="w-full bg-white text-senda-purple font-extrabold py-2 rounded-full text-xs hover:bg-pink-100 transition-colors"
              >
                Cerrar Certificado
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
