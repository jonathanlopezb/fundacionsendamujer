'use client';
import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Shield, Award, Download, RefreshCw, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface StepAnswer { [key: string]: string }

const STEPS = [
  {
    id: 1, title: '¿Cuántos años tienes?', pillar: 'Identidad & Ciclo de Vida',
    advice: 'Tu edad determina los derechos prioritarios y los programas a los que puedes acceder por ley.',
    options: ['Menor de 18 años', '18 – 28 años', '29 – 45 años', '46 – 60 años', 'Más de 60 años'],
    key: 'edad',
  },
  {
    id: 2, title: '¿Cuál es tu situación actual más urgente?', pillar: 'Diagnóstico de Necesidad',
    advice: 'Identifica la dimensión de mayor urgencia para activar la ruta de atención correcta.',
    options: ['Violencia de pareja o familiar', 'Embarazo sin apoyo', 'Sin empleo ni ingresos', 'Problemas de salud sin atención', 'Asuntos legales o jurídicos', 'Bienestar emocional / salud mental'],
    key: 'urgencia',
  },
  {
    id: 3, title: '¿Tienes hijos o dependientes a cargo?', pillar: 'Red de Cuidado',
    advice: 'El sistema de cuidado garantizado por el Estado colombiano (CONPES 4080) prioriza madres con dependientes.',
    options: ['No tengo hijos', '1 hijo/a', '2 hijos/as', '3 o más hijos/as', 'Cuido a un adulto mayor'],
    key: 'cuidado',
  },
  {
    id: 4, title: '¿Cuál es tu situación económica actual?', pillar: 'Autonomía Económica',
    advice: 'La autonomía económica es un derecho fundamental (Eje 1 CONPES 4080). Determina tu nivel de acceso prioritario.',
    options: ['Sin ningún ingreso', 'Ingresos informales ocasionales', 'Empleo formal', 'Microempresaria / emprendedora', 'Subsidio del Estado'],
    key: 'economia',
  },
  {
    id: 5, title: '¿Tienes vivienda segura?', pillar: 'Seguridad Habitacional',
    advice: 'La vivienda digna es un derecho constitucional en Colombia. Si no la tienes, hay rutas de acceso prioritarias.',
    options: ['Sí, vivienda propia', 'Sí, arriendo estable', 'Con familia o amigos', 'Vivienda insegura o en riesgo', 'Sin vivienda'],
    key: 'vivienda',
  },
  {
    id: 6, title: '¿Has sufrido algún tipo de violencia?', pillar: 'Protección & Seguridad',
    advice: 'La Ley 1257 de 2008 garantiza medidas de protección inmediatas. No estás sola.',
    options: ['No', 'Violencia física', 'Violencia psicológica', 'Violencia económica', 'Violencia sexual', 'Múltiples formas de violencia'],
    key: 'violencia',
  },
  {
    id: 7, title: '¿Accedes actualmente a servicios de salud?', pillar: 'Salud & Derechos SSR',
    advice: 'La Política SSR 2026–2035 garantiza atención en salud sexual y reproductiva sin barreras.',
    options: ['Sí, tengo EPS activa', 'Solo medicina de urgencias', 'Por el SISBEN', 'No tengo acceso a salud', 'Estoy en control prenatal'],
    key: 'salud',
  },
  {
    id: 8, title: '¿Cuál es tu nivel educativo actual?', pillar: 'Educación & Formación',
    advice: 'SendaAcademia y los programas SENA aliados ofrecen formación gratuita según tu nivel.',
    options: ['Sin estudios', 'Primaria incompleta/completa', 'Bachillerato incompleto/completo', 'Técnica o tecnológica', 'Universidad'],
    key: 'educacion',
  },
  {
    id: 9, title: '¿Con qué red de apoyo cuentas?', pillar: 'Red de Apoyo Social',
    advice: 'Una red de apoyo fuerte reduce el riesgo de vulneración. Podemos ayudarte a construirla.',
    options: ['Familia cercana', 'Amigos/vecinos de confianza', 'Organización comunitaria', 'Solo instituciones', 'Ninguna red de apoyo'],
    key: 'redApoyo',
  },
  {
    id: 10, title: '¿Has tenido contacto con instituciones del Estado?', pillar: 'Acceso Institucional',
    advice: 'Identificamos las barreras institucionales que has enfrentado para proponer rutas alternativas.',
    options: ['Nunca he buscado ayuda institucional', 'Sí, con buena respuesta', 'Sí, pero sin atención adecuada', 'Fui revictimizada en la institución', 'No supe a dónde ir'],
    key: 'institucional',
  },
  {
    id: 11, title: '¿Qué esperas lograr en los próximos 3 meses?', pillar: 'Proyecto de Vida',
    advice: 'Tu meta orienta el tipo de acompañamiento que te asignamos en Senda.',
    options: ['Estabilidad económica', 'Seguridad personal y familiar', 'Terminar mis estudios', 'Iniciar mi propio negocio', 'Sanar emocionalmente', 'Conocer mis derechos'],
    key: 'meta',
  },
  {
    id: 12, title: '¿Estás en Cartagena o área Caribe?', pillar: 'Geolocalización de Servicios',
    advice: 'La cobertura territorial determina las rutas presenciales y virtuales disponibles para ti.',
    options: ['Cartagena (Pie de la Popa, Manga)', 'Cartagena (Olaya, La Candelaria)', 'Barranquilla', 'Sincelejo / Montería', 'Otra ciudad colombiana', 'Zona rural'],
    key: 'ubicacion',
  },
];

function generateCode(answers: StepAnswer): string {
  const hash = Object.values(answers).join('').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hex = hash.toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  return `SENDA-${hex}`;
}

function buildReport(answers: StepAnswer, code: string) {
  const actions: { priority: string; area: string; action: string; norm: string }[] = [];

  if (answers.violencia && answers.violencia !== 'No') {
    actions.push({ priority: '🔴 URGENTE', area: 'Protección', action: 'Solicitar Medida de Protección en Comisaría de Familia o Casa de Justicia Chiquinquirá. Línea 155 activa 24/7.', norm: 'Ley 1257/2008' });
  }
  if (answers.salud === 'Estoy en control prenatal' || answers.urgencia === 'Embarazo sin apoyo') {
    actions.push({ priority: '🔴 URGENTE', area: 'Salud Materna', action: 'Inscripción inmediata en control prenatal IPS Cartagena + Programa Embarazo con Apoyo Senda.', norm: 'Ley 2244/2022 Parto Digno' });
  }
  if (answers.salud === 'No tengo acceso a salud') {
    actions.push({ priority: '🟠 PRIORIDAD', area: 'Salud SSR', action: 'Afiliación al SISBEN y EPS subsidiada. Atención gratuita en ESE Hospital Local Cartagena.', norm: 'Política SSR 2026-2035' });
  }
  if (answers.economia === 'Sin ningún ingreso') {
    actions.push({ priority: '🟠 PRIORIDAD', area: 'Autonomía Económica', action: 'Inscripción en Renta Ciudadana prioritaria + Taller de Emprendimiento SendaAutonomía + Capital Semilla.', norm: 'CONPES 4080 Eje 1' });
  }
  if (answers.cuidado && answers.cuidado !== 'No tengo hijos') {
    actions.push({ priority: '🟠 PRIORIDAD', area: 'Cuidado Infantil', action: 'Cupo prioritario en CDI (Centro de Desarrollo Infantil) + Red de Nutrición ICBF Cartagena.', norm: 'Política Nacional del Cuidado' });
  }
  if (answers.vivienda === 'Sin vivienda' || answers.vivienda === 'Vivienda insegura o en riesgo') {
    actions.push({ priority: '🟠 PRIORIDAD', area: 'Vivienda', action: 'Inscripción en subsidio de vivienda prioritario y albergue temporal de la Fundación.', norm: 'Art. 51 Constitución' });
  }
  if (answers.educacion && !['Universidad', 'Técnica o tecnológica'].includes(answers.educacion)) {
    actions.push({ priority: '🟡 RECOMENDADO', area: 'Formación', action: 'Matrícula gratuita en cursos SendaAcademia: Ginecología, Patronaje Textil, Finanzas, Marketing Digital.', norm: 'CONPES 4080 Eje 2' });
  }
  if (answers.institucional === 'Fui revictimizada en la institución') {
    actions.push({ priority: '🟡 RECOMENDADO', area: 'Acceso Institucional', action: 'Acompañamiento de caso por Trabajadora Social Senda en toda gestión institucional. No irás sola.', norm: 'Ley 1257/2008 Art. 8' });
  }
  if (answers.urgencia === 'Asuntos legales o jurídicos') {
    actions.push({ priority: '🟡 RECOMENDADO', area: 'Asesoría Jurídica', action: 'Consultoría Jurídica Gratuita con abogada aliada Senda + Defensoría del Pueblo Cartagena.', norm: 'Ley 1257/2008' });
  }
  if (actions.length < 3) {
    actions.push({ priority: '🟢 PREVENTIVO', area: 'Bienestar Integral', action: 'Inscripción al Programa de Fortalecimiento Emocional y Proyecto de Vida Senda Mujer.', norm: 'CONPES 4080' });
  }

  return { code, actions, generatedAt: new Date().toLocaleDateString('es-CO') };
}

export default function SendaWizard() {
  const [step, setStep] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<StepAnswer>({});
  const [finished, setFinished] = useState(false);
  const [report, setReport] = useState<ReturnType<typeof buildReport> | null>(null);
  const [code, setCode] = useState('');

  const current = STEPS[step - 1];
  const progress = step === 0 ? 0 : Math.round((step / 12) * 100);

  const handleAnswer = useCallback((key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < 12) {
      setStep(step + 1);
    } else {
      const generatedCode = generateCode(newAnswers);
      setCode(generatedCode);
      setReport(buildReport(newAnswers, generatedCode));
      setFinished(true);
    }
  }, [answers, step]);

  const handleReset = () => {
    setStep(0); setAnswers({}); setFinished(false); setReport(null); setCode('');
  };

  // ── INTRO ──
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#3B0852] to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-2">
            <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-extrabold px-4 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">
              Sistema Operativo de Derechos · SENDA Universal 2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Tu Diagnóstico de <span className="bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">Derechos</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              12 pasos guiados. Al finalizar recibirás tu <strong className="text-amber-300">Código Protegido Temporal</strong> y un <strong className="text-pink-300">Informe Personalizado de Acción</strong> con las rutas exactas que te corresponden por ley en Colombia.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { emoji: '🔒', label: 'Confidencial', sub: '100% anónimo' },
              { emoji: '⚡', label: '12 Pasos', sub: '~5 minutos' },
              { emoji: '📋', label: 'Informe Real', sub: 'Con normas legales' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <div className="text-2xl">{f.emoji}</div>
                <div className="text-white font-extrabold text-sm">{f.label}</div>
                <div className="text-slate-400 text-xs">{f.sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-base px-12 py-4 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            Comenzar mi Diagnóstico
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-slate-500 text-xs">No se requiere registro. Tus datos no se almacenan.</p>
        </div>
      </div>
    );
  }

  // ── FINISHED ──
  if (finished && report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#3B0852] to-slate-900 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Code Card */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest opacity-70">Tu Código de Expediente Protegido</p>
            <div className="text-4xl sm:text-6xl font-black tracking-widest font-mono">{report.code}</div>
            <p className="text-xs opacity-70">Generado el {report.generatedAt} · Válido 48 horas · Solo para uso personal</p>
            <div className="flex justify-center gap-3 pt-2 flex-wrap">
              <button className="bg-slate-950 text-white font-extrabold px-5 py-2 rounded-full text-xs flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                <Download className="w-4 h-4" /> Guardar Código
              </button>
              <button onClick={handleReset} className="bg-white/20 text-slate-950 font-extrabold px-5 py-2 rounded-full text-xs flex items-center gap-2 cursor-pointer hover:bg-white/30">
                <RefreshCw className="w-4 h-4" /> Nuevo Diagnóstico
              </button>
            </div>
          </div>

          {/* Report */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-600" />
                Informe de Derechos y Plan de Acción Personalizado
              </h2>
              <p className="text-xs text-slate-500 mt-1">Basado en tus 12 respuestas · Código: <strong className="font-mono text-purple-700">{report.code}</strong></p>
            </div>

            <div className="space-y-4">
              {report.actions.map((a, i) => (
                <div key={i} className={`p-4 rounded-2xl border-l-4 space-y-1 ${
                  a.priority.includes('URGENTE') ? 'border-red-500 bg-red-50' :
                  a.priority.includes('PRIORIDAD') ? 'border-amber-500 bg-amber-50' :
                  a.priority.includes('RECOMENDADO') ? 'border-blue-500 bg-blue-50' :
                  'border-emerald-500 bg-emerald-50'
                }`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-extrabold">{a.priority}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border">{a.norm}</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800">{a.area}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{a.action}</p>
                </div>
              ))}
            </div>

            {/* Summary of answers */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resumen de tu Diagnóstico
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {STEPS.map((s) => answers[s.key] && (
                  <div key={s.id} className="flex flex-col gap-0.5">
                    <span className="text-slate-500 font-bold">{s.pillar}</span>
                    <span className="text-slate-800">{answers[s.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#3B0852] to-[#E12880] text-white rounded-2xl p-5 text-center space-y-3">
              <p className="font-extrabold text-sm">¿Necesitas acompañamiento presencial en Cartagena?</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href="/portal-beneficiaria" target="_blank" className="bg-white text-[#3B0852] font-extrabold px-5 py-2 rounded-full text-xs hover:bg-pink-50">Portal Beneficiaria</a>
                <a href="/agendar-cita" className="bg-amber-400 text-slate-950 font-extrabold px-5 py-2 rounded-full text-xs hover:bg-amber-300">Agendar Cita Gratuita</a>
                <a href="tel:155" className="bg-red-500 text-white font-extrabold px-5 py-2 rounded-full text-xs hover:bg-red-600">🆘 Línea 155</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── WIZARD STEP ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#3B0852] to-slate-900 p-4 sm:p-8 flex items-start justify-center pt-8">
      <div className="max-w-2xl w-full space-y-6">

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Paso {step} de 12 · {current.pillar}</span>
            <span>{progress}% completado</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-pink-500 to-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all ${s.id < step ? 'bg-emerald-400' : s.id === step ? 'bg-pink-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] p-6 sm:p-8 space-y-2">
            <span className="text-amber-300 text-[11px] font-extrabold uppercase tracking-widest">Pilar {step} · {current.pillar}</span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{current.title}</h2>
          </div>

          {/* Advice box */}
          <div className="mx-6 mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">{current.advice}</p>
          </div>

          {/* Options */}
          <div className="p-6 sm:p-8 grid grid-cols-1 gap-3">
            {current.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(current.key, opt)}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-purple-500 hover:bg-purple-50 font-bold text-sm text-slate-800 transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>{opt}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Confidencial · Anónimo</span>
            </div>
          </div>
        </div>

        {/* Previously answered */}
        {Object.keys(answers).length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tus respuestas anteriores</p>
            <div className="flex flex-wrap gap-2">
              {STEPS.filter(s => answers[s.key]).map(s => (
                <span key={s.id} className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  ✓ {answers[s.key]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
