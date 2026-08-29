'use client';

import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, User, Brain, ShieldAlert,
  Stethoscope, Heart, CheckCircle2, Phone, MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

const STEPS = [
  { id: 1, title: 'Información de Contacto', icon: User },
  { id: 2, title: 'Bienestar Emocional', icon: Brain },
  { id: 3, title: 'Situación de Riesgo', icon: ShieldAlert },
  { id: 4, title: 'Salud Reproductiva', icon: Stethoscope },
  { id: 5, title: 'Autonomía & Red de Apoyo', icon: Heart },
];

const OPT = (value: string, label: string, desc: string) => ({ value, label, desc });

const QUESTIONS: Record<number, { key: string; question: string; opts: ReturnType<typeof OPT>[] }[]> = {
  2: [
    {
      key: 'q_tristeza', question: '1. ¿Con qué frecuencia has sentido tristeza profunda o desesperanza en las últimas 2 semanas?',
      opts: [OPT('nunca', 'Nunca / Raramente', 'Me siento bien en general'), OPT('a_veces', 'Algunos días', 'Días difíciles pero manejables'), OPT('frecuente', 'La mayoría de días', 'Tristeza constante'), OPT('casi_siempre', 'Casi todos los días', 'Siento que no puedo más')],
    },
    {
      key: 'q_ansiedad', question: '2. ¿Has experimentado ataques de pánico, angustia intensa o miedo que no puedes controlar?',
      opts: [OPT('no', 'No / Raramente', 'Sin episodios de pánico'), OPT('leve', 'Ocasionalmente', 'Una o dos veces al mes'), OPT('moderado', 'Con frecuencia', 'Varias veces por semana'), OPT('severo', 'Casi siempre', 'Interfiere con mi vida diaria')],
    },
    {
      key: 'q_sueno', question: '3. ¿Cómo está siendo tu sueño últimamente?',
      opts: [OPT('bien', 'Duermo bien', 'Sin problemas para dormir'), OPT('irregular', 'Irregular', 'A veces no puedo dormir'), OPT('mal', 'Duermo poco', 'Menos de 5 horas por noche'), OPT('muy_mal', 'No puedo dormir', 'Insomnio severo o pesadillas')],
    },
    {
      key: 'q_pensamientos', question: '4. ¿Has tenido pensamientos de hacerte daño o de que sería mejor no estar aquí?',
      opts: [OPT('no', 'No, nunca', 'Sin pensamientos de autolesión'), OPT('pasado', 'En el pasado, no ahora', 'Pensamientos superados'), OPT('a_veces', 'A veces los tengo', 'Pensamientos ocasionales'), OPT('frecuente', 'Con frecuencia', 'Necesito apoyo urgente')],
    },
    {
      key: 'q_aislamiento', question: '5. ¿Te has sentido sola o aislada de tus seres queridos y actividades que antes disfrutabas?',
      opts: [OPT('no', 'No me siento sola', 'Tengo apoyo suficiente'), OPT('poco', 'Un poco', 'Algo de aislamiento'), OPT('mucho', 'Bastante', 'Siento que nadie me entiende'), OPT('total', 'Completamente aislada', 'Sin ninguna red de apoyo')],
    },
  ],
  3: [
    {
      key: 'q_violencia_tipo', question: '6. ¿Estás viviendo o has vivido alguna forma de violencia?',
      opts: [OPT('no', 'No actualmente', 'No estoy expuesta a violencia'), OPT('psicologica', 'Violencia psicológica/verbal', 'Insultos, control, humillaciones'), OPT('fisica', 'Violencia física', 'Golpes, empujones u otras agresiones'), OPT('sexual', 'Violencia sexual', 'Agresión o abuso sexual')],
    },
    {
      key: 'q_agresor_cerca', question: '7. ¿El agresor o persona que te hace daño convive contigo o está cerca?',
      opts: [OPT('no_aplica', 'No aplica', 'No tengo agresor activo'), OPT('lejos', 'Está lejos / No hay contacto', 'No hay riesgo inmediato'), OPT('contacto', 'Tenemos contacto esporádico', 'Riesgo moderado'), OPT('convive', 'Convive conmigo', 'Riesgo inminente')],
    },
    {
      key: 'q_denuncia', question: '8. ¿Has podido denunciar o buscar ayuda legal por la situación de violencia?',
      opts: [OPT('no_aplica', 'No aplica', 'No hay situación de violencia'), OPT('si', 'Sí, ya denuncié', 'Ya tomé acción legal'), OPT('quiero', 'Quiero hacerlo pero no sé cómo', 'Necesito orientación'), OPT('no_puedo', 'No puedo o tengo miedo', 'Siento que no es seguro denunciar')],
    },
    {
      key: 'q_hijos', question: '9. ¿Tienes hijos o niños a tu cargo que también estén en situación de riesgo?',
      opts: [OPT('no', 'No tengo hijos', 'Sin menores a cargo'), OPT('seguros', 'Sí, pero están seguros', 'Menores protegidos'), OPT('riesgo', 'Están en situación de riesgo', 'Menores en vulnerabilidad'), OPT('separados', 'Estoy separada de mis hijos', 'Separación forzada')],
    },
    {
      key: 'q_medidas', question: '10. ¿Tienes medidas de protección activas o acceso a refugio seguro?',
      opts: [OPT('no_aplica', 'No las necesito', 'Situación estable'), OPT('si', 'Sí tengo medidas activas', 'Protección legal vigente'), OPT('tramitando', 'Las estoy tramitando', 'En proceso'), OPT('ninguna', 'No tengo ninguna', 'Sin protección formal')],
    },
  ],
  4: [
    {
      key: 'q_embarazo', question: '11. ¿Cuál es tu situación actual respecto al embarazo?',
      opts: [OPT('ninguna', 'No estoy embarazada', 'No aplica'), OPT('planeado', 'Embarazo deseado y planificado', 'Necesito acompañamiento prenatal'), OPT('no_planeado', 'Embarazo no planeado', 'Necesito conocer mis opciones'), OPT('violacion', 'Embarazo producto de violencia', 'Necesito atención urgente e integral')],
    },
    {
      key: 'q_salud_sexual', question: '12. ¿Has tenido acceso a salud sexual y reproductiva en el último año?',
      opts: [OPT('si', 'Sí, atención completa', 'Controles al día'), OPT('parcial', 'Parcialmente', 'Algunos controles'), OPT('no', 'No he podido acceder', 'Barreras de acceso'), OPT('nunca', 'Nunca he recibido atención', 'Sin acceso histórico')],
    },
    {
      key: 'q_enfermedad', question: '13. ¿Padeces alguna condición médica crónica o tienes una situación de salud urgente?',
      opts: [OPT('no', 'No, estoy bien', 'Sin condiciones crónicas'), OPT('controlada', 'Sí, pero está controlada', 'En tratamiento'), OPT('sin_tratar', 'Sí, sin tratar por falta de acceso', 'Necesito atención médica'), OPT('urgente', 'Tengo una urgencia médica', 'Requiero atención inmediata')],
    },
    {
      key: 'q_iss', question: '14. ¿Tienes acceso a seguridad social o servicios de salud?',
      opts: [OPT('si', 'Sí, estoy afiliada', 'Con cobertura de salud'), OPT('parcial', 'Cobertura parcial', 'Acceso limitado'), OPT('no', 'No estoy afiliada', 'Sin cobertura'), OPT('desconoce', 'No sé cómo acceder', 'Necesito orientación')],
    },
  ],
  5: [
    {
      key: 'q_red_apoyo', question: '15. ¿Cuentas con personas cercanas (familia, amigas, vecinas) que puedan apoyarte?',
      opts: [OPT('fuerte', 'Sí, tengo una red de apoyo sólida', 'Apoyo familiar y social'), OPT('poca', 'Poca gente de confianza', 'Red de apoyo limitada'), OPT('nadie', 'No tengo a nadie', 'Aislamiento total'), OPT('peligro', 'Mi familia también representa riesgo', 'Entorno familiar hostil')],
    },
    {
      key: 'q_economia', question: '16. ¿Cuál es tu situación económica actual?',
      opts: [OPT('estable', 'Estable, con ingresos regulares', 'Independencia económica'), OPT('vulnerable', 'Ingresos irregulares o insuficientes', 'Vulnerabilidad económica'), OPT('sin_ingresos', 'Sin ingresos propios, dependo de otro', 'Dependencia económica'), OPT('critica', 'Situación crítica, necesito apoyo urgente', 'Emergencia económica')],
    },
    {
      key: 'q_vivienda', question: '17. ¿Tu situación de vivienda es segura y estable?',
      opts: [OPT('segura', 'Sí, vivienda propia o arrendada segura', 'Vivienda estable'), OPT('prestada', 'Vivo en casa de familiares o amigos', 'Vivienda inestable'), OPT('riesgo', 'Vivo con el agresor', 'Vivienda de riesgo'), OPT('sin_techo', 'Estoy en situación de calle o refugio', 'Sin vivienda')],
    },
    {
      key: 'q_proyecto_vida', question: '18. ¿Tienes metas o un proyecto de vida que deseas construir?',
      opts: [OPT('claro', 'Sí, tengo metas claras', 'Proyecto de vida definido'), OPT('vago', 'Tengo ideas pero no sé por dónde empezar', 'Orientación necesaria'), OPT('bloqueada', 'No puedo pensar en el futuro por la situación actual', 'Bloqueada por crisis'), OPT('ninguno', 'No tengo esperanza de futuro', 'Necesito apoyo emocional urgente')],
    },
  ],
};

function computeResult(answers: Record<string, string>) {
  const critical = ['q_pensamientos:frecuente', 'q_agresor_cerca:convive', 'q_embarazo:violacion', 'q_proyecto_vida:ninguno'];
  const high = ['q_tristeza:casi_siempre', 'q_ansiedad:severo', 'q_violencia_tipo:sexual', 'q_violencia_tipo:fisica', 'q_economia:critica'];

  const isCritical = critical.some((c) => { const [k, v] = c.split(':'); return answers[k] === v; });
  const isHigh = high.some((c) => { const [k, v] = c.split(':'); return answers[k] === v; });

  if (isCritical) return { level: 'EMERGENCIA_CRÍTICA', color: 'red', score: 90, dept: 'Psicología & Crisis', program: 'Programa 2 — Atención a Víctimas de Violencia Sexual' };
  if (isHigh) return { level: 'ALTO_RIESGO', color: 'orange', score: 65, dept: 'Trabajo Social & Psicología', program: 'Programa 1 — Mujer Acompañada' };

  const negatives = Object.values(answers).filter((v) => ['mucho', 'total', 'frecuente', 'mal', 'muy_mal', 'no', 'sin_ingresos', 'nadie'].includes(v)).length;
  if (negatives >= 5) return { level: 'VULNERABILIDAD_MODERADA', color: 'yellow', score: 40, dept: 'Orientación & Seguimiento', program: 'Programa 3 — Contención Psicosocial' };
  return { level: 'ORIENTACIÓN', color: 'green', score: 18, dept: 'Proyecto de Vida', program: 'Programa 7 — Proyecto de Vida' };
}

export default function PsychologicalTest() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ name: '', phone: '', age: '', neighborhood: '', email: '' });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const select = (key: string, val: string) => setAnswers((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientName: contact.name || 'Anónima', phone: contact.phone, email: contact.email, age: contact.age, neighborhood: contact.neighborhood, answers }),
      });
    } catch (_) {}
    const res = computeResult(answers);
    setResult(res);
    setStep(6);
    confetti({ particleCount: res.color === 'green' ? 100 : 30, spread: 70, origin: { y: 0.6 } });
    setSubmitting(false);
  };

  const stepQs = QUESTIONS[step] || [];
  const allAnswered = stepQs.every((q) => answers[q.key]);
  const progress = ((step - 1) / 5) * 100;

  const levelStyles: Record<string, string> = {
    red: 'bg-red-500 animate-pulse',
    orange: 'bg-amber-500',
    yellow: 'bg-yellow-400 text-slate-800',
    green: 'bg-emerald-500',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-pink-200 shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            <span>SENDA EVAL — Evaluación Psicosocial Integral</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Test de Bienestar & Diagnóstico de Vulnerabilidad</h2>
          <p className="text-xs text-pink-100 mt-2 max-w-2xl">Evaluación confidencial de 18 preguntas para orientarte hacia el apoyo que necesitas. Puedes usar un seudónimo.</p>
          {step < 6 && (
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-pink-200 font-bold">
                <span>Paso {step} de 5 — {STEPS[step - 1]?.title}</span>
                <span>{Math.round(progress)}% completado</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-2 pt-1">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${step === s.id ? 'bg-amber-400 text-[#3B0852]' : step > s.id ? 'bg-white/20 text-white' : 'bg-white/10 text-pink-300'}`}>
                      <Icon className="w-3 h-3" />{s.id}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Contact */}
        {step === 1 && (
          <div className="p-6 sm:p-10 space-y-6">
            <h3 className="text-lg font-bold text-[#52166F] flex items-center gap-2"><User className="w-5 h-5 text-[#E12880]" />Información de Contacto (Opcional)</h3>
            <p className="text-xs text-slate-500">Puedes usar un seudónimo. Tus datos son estrictamente confidenciales.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Tu nombre o seudónimo', key: 'name', placeholder: 'Ej: María / Anónima', type: 'text' },
                { label: 'Teléfono / WhatsApp', key: 'phone', placeholder: 'Ej: 300 123 4567', type: 'tel' },
                { label: 'Edad', key: 'age', placeholder: 'Ej: 24', type: 'number' },
                { label: 'Barrio en Cartagena', key: 'neighborhood', placeholder: 'Ej: Olaya Herrera', type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={contact[f.key as keyof typeof contact]}
                    onChange={(e) => setContact({ ...contact, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30"
                  />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-pink-100 flex justify-end">
              <button onClick={() => setStep(2)} className="bg-[#E12880] text-white font-extrabold px-8 py-3 rounded-full text-sm shadow-md flex items-center gap-2 cursor-pointer hover:bg-[#c41070] transition-all">
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Steps 2–5: Questions */}
        {step >= 2 && step <= 5 && (
          <div className="p-6 sm:p-10 space-y-8">
            <h3 className="text-lg font-bold text-[#52166F] flex items-center gap-2">
              {React.createElement(STEPS[step - 1].icon, { className: 'w-5 h-5 text-[#E12880]' })}
              {STEPS[step - 1].title}
            </h3>
            {stepQs.map((q) => (
              <div key={q.key} className="space-y-3">
                <label className="block text-sm font-bold text-slate-800">{q.question}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.opts.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => select(q.key, opt.value)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${answers[q.key] === opt.value ? 'border-[#E12880] bg-pink-50 ring-2 ring-[#E12880]/30' : 'border-slate-200 hover:border-pink-200 bg-white'}`}
                    >
                      <div className="font-bold text-xs text-[#52166F]">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-6 border-t border-pink-100 flex justify-between items-center">
              <button onClick={() => setStep(step - 1)} className="text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer hover:text-slate-800">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              {step < 5 ? (
                <button
                  onClick={() => allAnswered && setStep(step + 1)}
                  disabled={!allAnswered}
                  className={`font-extrabold px-8 py-3 rounded-full text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all ${allAnswered ? 'bg-[#E12880] text-white hover:bg-[#c41070]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className={`font-extrabold px-10 py-3.5 rounded-full text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all ${allAnswered ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  {submitting ? 'Analizando...' : <><span>Generar Mi Diagnóstico</span><Sparkles className="w-4 h-4 text-amber-300" /></>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Result */}
        {step === 6 && result && (
          <div className="p-6 sm:p-10 space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl p-6 border border-pink-200 space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="text-xs font-bold text-[#52166F] uppercase tracking-wider">Diagnóstico SENDA EVAL</span>
                  <h3 className="text-2xl font-extrabold text-[#3B0852] mt-1">Resultado de tu Evaluación</h3>
                </div>
                <span className={`px-4 py-1.5 rounded-full font-extrabold text-xs text-white ${levelStyles[result.color]}`}>
                  {result.level.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-pink-100">
                  <span className="text-xs text-slate-500">SENDA Index Inicial</span>
                  <div className="text-3xl font-extrabold text-[#E12880] mt-1">{result.score}</div>
                  <div className="text-[10px] text-slate-400">/ 100 puntos</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-pink-100">
                  <span className="text-xs text-slate-500">Área Prioritaria</span>
                  <div className="font-extrabold text-sm text-[#52166F] mt-1">{result.dept}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-pink-100">
                  <span className="text-xs text-slate-500">Programa Recomendado</span>
                  <div className="font-bold text-xs text-[#52166F] mt-1">{result.program}</div>
                </div>
              </div>

              {result.color === 'red' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-extrabold text-red-700">Requieres atención inmediata</p>
                    <p className="text-xs text-red-600 mt-1">Por favor comunícate ahora con nuestra línea de crisis: <a href="tel:3176575800" className="font-extrabold underline">317 657 5800</a> o Línea Púrpura: <a href="tel:155" className="font-extrabold underline">155</a></p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#52166F] text-white p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-base text-amber-300">Tu Siguiente Paso:</h4>
              <p className="text-xs text-pink-100 leading-relaxed">Tu evaluación ha quedado registrada. Te conectamos con el equipo de {result.dept} en Cartagena para comenzar tu acompañamiento.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/agendar-cita?especialidad=${encodeURIComponent(result.dept)}&nombre=${encodeURIComponent(contact.name || 'Anónima')}`} className="bg-amber-400 text-[#3B0852] font-extrabold px-6 py-3 rounded-full text-xs hover:bg-amber-300 transition-all flex items-center gap-2">
                  Agendar Cita <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={`https://wa.me/573176575800?text=Hola,%20acabo%20de%20completar%20el%20test%20de%20bienestar%20SENDA%20EVAL.%20Mi%20nombre%20es%20${encodeURIComponent(contact.name || 'Anónima')}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-full text-xs hover:bg-emerald-600 transition-all flex items-center gap-2">
                  WhatsApp Cartagena
                </a>
                <button onClick={() => { setStep(1); setAnswers({}); setResult(null); }} className="bg-white/10 text-white font-bold px-6 py-3 rounded-full text-xs border border-white/20 hover:bg-white/20 cursor-pointer">
                  Reiniciar Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
