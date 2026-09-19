'use client';
import React, { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Target } from 'lucide-react';

const QUESTION_BANK = [
  { question: '¿Cuál es el primer paso para validar una idea de negocio?', options: ['Definir el problema y la persona a quien sirve', 'Comprar publicidad', 'Solicitar un crédito', 'Contratar personal'], answer: 0 },
  { question: '¿Qué representa un costo variable?', options: ['Un costo que cambia con la producción', 'El arriendo mensual', 'La matrícula', 'Un certificado'], answer: 0 },
  { question: '¿Qué debe incluir un presupuesto inicial?', options: ['Ingresos, costos y flujo de caja', 'Solo el logo', 'Únicamente redes sociales', 'Ningún dato'], answer: 0 },
  { question: '¿Qué permite una evaluación final?', options: ['Medir los aprendizajes logrados', 'Reemplazar todas las clases', 'Eliminar la ruta', 'Ocultar el progreso'], answer: 0 },
  { question: '¿Qué habilita un certificado Senda?', options: ['Acreditar la finalización del curso', 'Acceder a historias clínicas', 'Modificar una ruta de protección', 'Compartir datos sensibles'], answer: 0 },
];

export default function AssessmentPanel({ courseSlug, onScore }: { courseSlug: string; onScore?: (score: number) => void }) {
  const [mode, setMode] = useState<'pretest' | 'postest'>('pretest'); const [index, setIndex] = useState(0); const [answers, setAnswers] = useState<number[]>([]); const [done, setDone] = useState(false);
  const questions = useMemo(() => [...QUESTION_BANK].sort(() => Math.random() - .5), [mode]); const current = questions[index];
  const answer = (value: number) => { const next = [...answers, value]; if (index === questions.length - 1) { const score = Math.round((next.filter((item, i) => item === questions[i].answer).length / questions.length) * 100); setAnswers(next); setDone(true); onScore?.(score); } else { setAnswers(next); setIndex(index + 1); } };
  if (done) { const score = Math.round((answers.filter((item, i) => item === questions[i].answer).length / questions.length) * 100); return <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" /><h4 className="mt-3 font-black text-white">{mode === 'pretest' ? 'Diagnóstico inicial completado' : 'Evaluación final completada'}</h4><p className="mt-2 text-3xl font-black text-amber-300">{score}%</p><p className="mt-1 text-xs text-slate-400">Resultado guardado en tu progreso educativo · {courseSlug}</p><button onClick={() => { setDone(false); setIndex(0); setAnswers([]); setMode(mode === 'pretest' ? 'postest' : 'pretest'); }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white"><RotateCcw className="h-3.5 w-3.5" /> Repetir</button></div>; }
  return <div className="space-y-4 rounded-2xl border border-fuchsia-300/15 bg-white/[.04] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Target className="h-4 w-4 text-amber-300" /><span className="text-xs font-black text-white">{mode === 'pretest' ? 'Pretest diagnóstico' : 'Postest de certificación'}</span></div><span className="text-[10px] font-bold text-slate-400">Pregunta {index + 1} de {questions.length}</span></div><p className="text-sm font-bold leading-6 text-white">{current.question}</p><div className="space-y-2">{current.options.map((option, i) => <button key={option} onClick={() => answer(i)} className="w-full rounded-xl border border-white/10 bg-black/10 p-3 text-left text-xs text-slate-300 transition hover:border-fuchsia-300/50 hover:bg-fuchsia-400/10">{option}</button>)}</div></div>;
}
