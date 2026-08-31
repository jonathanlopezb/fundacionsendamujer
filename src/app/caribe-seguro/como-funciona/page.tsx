'use client';

/**
 * /caribe-seguro/como-funciona — Explicación del modelo y registro progresivo
 */

import React, { useState } from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { Shield, ChevronRight, CheckCircle2, UserPlus, Heart, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  { num: '01', title: 'ME CONOZCO', desc: 'Identificación inicial de capacidades, contexto territorial y conocimientos de derechos.' },
  { num: '02', title: 'IDENTIFICO MIS NECESIDADES', desc: 'Evaluación voluntaria del IPSC en 10 dimensiones sin diagnóstico clínico obligatorio.' },
  { num: '03', title: 'ENCUENTRO MI RUTA', desc: 'Conexión directa con la oferta de salud, jurídica, psicosocial o de protección institucional.' },
  { num: '04', title: 'RECIBO ACOMPAÑAMIENTO', desc: 'Atención personalizada por el equipo profesional de la Fundación Senda Mujer.' },
  { num: '05', title: 'HAGO SEGUIMIENTO', desc: 'Monitoreo longitudinal a los 30, 90 y 180 días con alertas tempranas.' },
  { num: '06', title: 'MIDO MI PROGRESO', desc: 'Visualización clara del incremento en autonomía y protección personal en el portal.' },
  { num: '07', title: 'FORTALEZCO MI AUTONOMÍA', desc: 'Acceso a capital semilla, formación en Senda Academia y liderazgo comunitario.' },
];

export default function ComoFuncionaPage() {
  const [selectedGoal, setSelectedGoal] = useState<string[]>([]);
  const [registered, setRegistered] = useState(false);
  const [participantCode, setParticipantCode] = useState('');

  const goalsOptions = [
    'Quiero aprender y capacitarme',
    'Quiero fortalecer mi seguridad personal',
    'Necesito orientación jurídica',
    'Necesito acompañamiento psicosocial',
    'Quiero emprender y lograr autonomía económica',
    'Quiero ser lideresa comunitaria en mi barrio',
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoal.includes(goal)) {
      setSelectedGoal(selectedGoal.filter((g) => g !== goal));
    } else {
      setSelectedGoal([...selectedGoal, goal]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `CSM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setParticipantCode(randomCode);
    setRegistered(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* HERO */}
        <div className="text-center space-y-4">
          <span className="bg-[#E12880] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
            MODELO DE ACOMPAÑAMIENTO
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#52166F]">
            ¿Cómo funciona Caribe Seguro?
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Un itinerario transparente y voluntario para mujeres en el Caribe colombiano. Sin afiliaciones restrictivas: te acompañas a tu propio ritmo.
          </p>
        </div>

        {/* FLUJO DE 7 PASOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-pink-100 p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl font-black text-[#E12880]">{s.num}</span>
              <h3 className="font-extrabold text-[#52166F] text-xs tracking-wider">{s.title}</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* REGISTRO PROGRESIVO — ÚNETE A CARIBE SEGURO */}
        <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E12880]">REGISTRO VOLUNTARIO</span>
            <h2 className="text-2xl font-black text-[#52166F]">Únete a Caribe Seguro</h2>
            <p className="text-xs text-slate-500">
              Selecciona los objetivos que deseas alcanzar. Solo te solicitaremos los datos necesarios según tu elección.
            </p>
          </div>

          {registered ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black text-emerald-900">¡Bienvenida a Caribe Seguro!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Tu código de registro confidencial es: <strong className="font-mono text-base">{participantCode}</strong>. Consérvalo para consultar tus servicios en el portal.
              </p>
              <div className="pt-2">
                <Link
                  href="/portal-beneficiaria"
                  className="bg-emerald-600 text-white font-extrabold px-6 py-2.5 rounded-full text-xs hover:bg-emerald-700 transition-colors inline-block"
                >
                  Ir al Portal de Beneficiarias
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">¿Qué buscas en la plataforma hoy? (Puedes marcar varias)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {goalsOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleGoal(opt)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        selectedGoal.includes(opt)
                          ? 'border-[#E12880] bg-pink-50 text-[#52166F]'
                          : 'border-pink-100 bg-white text-slate-600 hover:border-pink-200'
                      }`}
                    >
                      {selectedGoal.includes(opt) ? '✓ ' : '+ '} {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={selectedGoal.length === 0}
                  className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3.5 rounded-full text-xs shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Registrarme en Caribe Seguro
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
