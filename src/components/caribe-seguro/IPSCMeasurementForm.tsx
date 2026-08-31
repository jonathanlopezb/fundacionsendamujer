'use client';

/**
 * IPSCMeasurementForm — Formulario de medición del Índice de Protección Senda-Caribe
 *
 * Implementa las 10 dimensiones del Blueprint cap. 7 con sliders visuales.
 * Incluye salvaguardas éticas explícitas (Blueprint 7.3):
 * - No sugiere predicciones
 * - Requiere confirmación de consentimiento activo
 * - Muestra aviso de revisión profesional obligatoria cuando aplica
 * - El submit no activa acciones automáticas sobre la beneficiaria
 */

import React, { useState } from 'react';
import {
  Shield, Wifi, Coins, Users, Scale, Heart, Brain, BookOpen,
  Zap, Link2, CheckCircle2, AlertTriangle, Info, Send, ChevronDown, ChevronUp
} from 'lucide-react';

interface DimensionConfig {
  key: string;
  label: string;
  question: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'seguridadFisica',
    label: 'Seguridad Física',
    question: '¿La mujer cuenta hoy con un lugar seguro para pasar la noche?',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  {
    key: 'seguridadDigital',
    label: 'Seguridad Digital',
    question: '¿Sabe identificar y protegerse de formas de violencia facilitada por tecnología?',
    icon: <Wifi className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    key: 'autonomiaEconomica',
    label: 'Autonomía Económica',
    question: '¿Cuenta con una fuente de ingresos propia o en desarrollo activo?',
    icon: <Coins className="w-5 h-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    key: 'redDeApoyo',
    label: 'Red de Apoyo',
    question: '¿Tiene al menos una persona o institución a quien acudir en caso de riesgo?',
    icon: <Users className="w-5 h-5" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    key: 'accesoAJusticia',
    label: 'Acceso a Justicia',
    question: '¿Conoce y ha podido activar, si lo desea, una ruta de denuncia o medida de protección?',
    icon: <Scale className="w-5 h-5" />,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    key: 'accesoASalud',
    label: 'Acceso a Salud',
    question: '¿Tiene acceso efectivo a los servicios de salud física, sexual y reproductiva que requiere?',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  {
    key: 'bienestarPsicosocial',
    label: 'Bienestar Psicosocial',
    question: '¿Cómo describe su propio bienestar emocional en las últimas semanas?',
    icon: <Brain className="w-5 h-5" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  {
    key: 'conocimientoDerechos',
    label: 'Conocimiento de Derechos',
    question: '¿Puede nombrar al menos las rutas y derechos básicos que la asisten?',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    key: 'capacidadRespuesta',
    label: 'Capacidad de Respuesta',
    question: '¿Sabría qué hacer, concretamente, ante una nueva situación de riesgo?',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    key: 'continuidadAcompanamiento',
    label: 'Continuidad del Acompañamiento',
    question: '¿Ha mantenido contacto sostenido con la Fundación o con la red de apoyo activada?',
    icon: <Link2 className="w-5 h-5" />,
    color: 'text-[#52166F]',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
];

const SCORE_LABELS: Record<number, string> = {
  0: 'Situación crítica',
  1: 'Muy precaria',
  2: 'Muy precaria',
  3: 'En desarrollo',
  4: 'En desarrollo',
  5: 'Parcial',
  6: 'Avanzando',
  7: 'Avanzando',
  8: 'Estable',
  9: 'Fortalecida',
  10: 'Plena autonomía',
};

function getScoreColor(score: number): string {
  if (score <= 2) return 'text-red-600';
  if (score <= 4) return 'text-orange-500';
  if (score <= 6) return 'text-amber-500';
  if (score <= 8) return 'text-emerald-600';
  return 'text-green-600';
}

function getBarColor(score: number): string {
  if (score <= 2) return 'bg-red-500';
  if (score <= 4) return 'bg-orange-400';
  if (score <= 6) return 'bg-amber-400';
  if (score <= 8) return 'bg-emerald-500';
  return 'bg-green-500';
}

interface FormState {
  beneficiaryInternalCode: string;
  measurementPeriod: string;
  appliedBy: string;
  appliedByRole: string;
  consentimientoActivo: boolean;
  dimensions: Record<string, { score: number; notes: string }>;
}

interface IPSCMeasurementFormProps {
  onSuccess?: (result: { ipscTotal: number; alert: any }) => void;
  defaultCode?: string;
}

export default function IPSCMeasurementForm({ onSuccess, defaultCode }: IPSCMeasurementFormProps) {
  const [form, setForm] = useState<FormState>({
    beneficiaryInternalCode: defaultCode || '',
    measurementPeriod: 'ingreso',
    appliedBy: '',
    appliedByRole: 'psicologa',
    consentimientoActivo: false,
    dimensions: Object.fromEntries(
      DIMENSIONS.map((d) => [d.key, { score: 5, notes: '' }])
    ),
  });

  const [expandedDim, setExpandedDim] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const ipscTotal =
    Object.values(form.dimensions).reduce((sum, d) => sum + d.score, 0) /
    DIMENSIONS.length;

  const handleScoreChange = (key: string, score: number) => {
    setForm((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [key]: { ...prev.dimensions[key], score },
      },
    }));
  };

  const handleNotesChange = (key: string, notes: string) => {
    setForm((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [key]: { ...prev.dimensions[key], notes },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.beneficiaryInternalCode.trim()) {
      setError('Ingresa el código interno de la beneficiaria.');
      return;
    }
    if (!form.appliedBy.trim()) {
      setError('Ingresa el nombre del profesional que aplica la medición.');
      return;
    }
    if (!form.consentimientoActivo) {
      setError('Confirma que el consentimiento informado está activo (Ley 1581/2012).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/caribe-seguro/ipsc/measure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al guardar.');

      setResult(data);
      if (onSuccess) onSuccess({ ipscTotal: data.measurement.ipscTotal, alert: data.alert });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        {/* Resultado */}
        <div className={`rounded-3xl p-8 border-2 text-center space-y-4 ${
          result.alert?.level === 'roja'
            ? 'bg-red-50 border-red-300'
            : result.alert?.level === 'amarilla'
            ? 'bg-amber-50 border-amber-300'
            : 'bg-emerald-50 border-emerald-300'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
            result.alert ? 'bg-amber-100' : 'bg-emerald-100'
          }`}>
            {result.alert ? (
              <AlertTriangle className={`w-8 h-8 ${result.alert.level === 'roja' ? 'text-red-600' : 'text-amber-600'}`} />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">IPSC Registrado</p>
            <p className={`text-5xl font-black mt-1 ${getScoreColor(result.measurement.ipscTotal)}`}>
              {result.measurement.ipscTotal.toFixed(1)}
              <span className="text-2xl text-slate-400 font-normal">/10</span>
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {SCORE_LABELS[Math.round(result.measurement.ipscTotal)]}
            </p>
            {result.measurement.deltaFromPrevious !== null && (
              <p className={`text-sm font-bold mt-1 ${
                result.measurement.deltaFromPrevious >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {result.measurement.deltaFromPrevious >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(result.measurement.deltaFromPrevious).toFixed(1)} pts respecto a medición anterior
              </p>
            )}
          </div>

          {result.alert && (
            <div className={`p-4 rounded-2xl border text-left space-y-2 ${
              result.alert.level === 'roja' ? 'bg-red-100 border-red-300' : 'bg-amber-100 border-amber-300'
            }`}>
              <p className={`font-extrabold text-sm flex items-center gap-2 ${
                result.alert.level === 'roja' ? 'text-red-800' : 'text-amber-800'
              }`}>
                <AlertTriangle className="w-4 h-4" />
                Alerta {result.alert.level === 'roja' ? '🔴 Roja — Revisión Prioritaria' : '🟡 Amarilla — Acompañamiento'}
              </p>
              <ul className="space-y-1">
                {result.alert.signals.map((s: string, i: number) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-bold text-slate-600 italic border-t border-current/20 pt-2">
                ⚠️ La decisión de cómo actuar corresponde siempre al equipo profesional.
              </p>
            </div>
          )}

          {result.measurement.professionalReviewRequired && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-semibold flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              Esta medición requiere revisión por un profesional antes de ser comunicada a la beneficiaria.
            </div>
          )}
        </div>

        <button
          onClick={() => setResult(null)}
          className="w-full bg-gradient-to-r from-[#3B0852] to-[#52166F] text-white font-extrabold py-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          Registrar Nueva Medición
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Aviso ético prominente */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 space-y-1">
          <p className="font-extrabold">Límite ético del IPSC (Blueprint Cap. 7.3)</p>
          <p>Este índice mide el resultado del acompañamiento, no diagnostica ni predice violencia. La participación es voluntaria y revocable. Toda variación relevante debe ser revisada por un profesional antes de comunicarse a la beneficiaria.</p>
        </div>
      </div>

      {/* Datos de la medición */}
      <div className="bg-white rounded-2xl border border-pink-200 p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-[#52166F] text-base">Datos de la Medición</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
              Código Interno de la Beneficiaria *
              <span className="text-[10px] font-normal text-slate-400 ml-1">(ej: SM-8842)</span>
            </label>
            <input
              type="text"
              value={form.beneficiaryInternalCode}
              onChange={(e) => setForm((p) => ({ ...p, beneficiaryInternalCode: e.target.value }))}
              placeholder="SM-XXXX"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Momento de Medición *</label>
            <select
              value={form.measurementPeriod}
              onChange={(e) => setForm((p) => ({ ...p, measurementPeriod: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880] bg-white"
            >
              <option value="ingreso">Ingreso (Primera medición)</option>
              <option value="30d">Seguimiento 30 días</option>
              <option value="90d">Seguimiento 90 días</option>
              <option value="180d">Seguimiento 180 días</option>
              <option value="seguimiento_especial">Seguimiento especial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Profesional que Aplica *</label>
            <input
              type="text"
              value={form.appliedBy}
              onChange={(e) => setForm((p) => ({ ...p, appliedBy: e.target.value }))}
              placeholder="Nombre completo del profesional"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Rol del Profesional *</label>
            <select
              value={form.appliedByRole}
              onChange={(e) => setForm((p) => ({ ...p, appliedByRole: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880] bg-white"
            >
              <option value="psicologa">Psicóloga</option>
              <option value="trabajadora_social">Trabajadora Social</option>
              <option value="abogada">Abogada</option>
              <option value="coordinadora">Coordinadora</option>
              <option value="medica">Médica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vista previa del IPSC total */}
      <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <p className="text-xs text-pink-200 font-bold uppercase tracking-wider">IPSC Actual (Vista Previa)</p>
          <p className="text-4xl font-black mt-1">
            {ipscTotal.toFixed(1)}<span className="text-xl font-normal text-pink-200">/10</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-pink-300">Dimensiones completadas</p>
          <p className="text-2xl font-extrabold">{DIMENSIONS.length}/10</p>
        </div>
      </div>

      {/* Las 10 dimensiones */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-[#52166F] text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E12880]" />
          Las 10 Dimensiones del IPSC
        </h3>

        {DIMENSIONS.map((dim) => {
          const score = form.dimensions[dim.key]?.score ?? 5;
          const isExpanded = expandedDim === dim.key;

          return (
            <div key={dim.key} className={`rounded-2xl border-2 overflow-hidden transition-all ${dim.border} ${dim.bg}`}>
              {/* Header de dimensión */}
              <button
                type="button"
                onClick={() => setExpandedDim(isExpanded ? null : dim.key)}
                className="w-full p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm ${dim.color}`}>
                    {dim.icon}
                  </div>
                  <div className="text-left">
                    <p className={`font-extrabold text-sm ${dim.color}`}>{dim.label}</p>
                    <p className="text-[10px] text-slate-500 max-w-xs truncate">{dim.question}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</p>
                    <p className="text-[10px] text-slate-400">{SCORE_LABELS[score]}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Barra de progreso siempre visible */}
              <div className="px-4 pb-2">
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getBarColor(score)}`}
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
              </div>

              {/* Controles expandidos */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/40 pt-3">
                  <p className="text-xs text-slate-600 font-semibold italic">"{dim.question}"</p>

                  {/* Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>0 — Crítica</span>
                      <span className={`font-black text-sm ${getScoreColor(score)}`}>{score} — {SCORE_LABELS[score]}</span>
                      <span>10 — Plena</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={score}
                      onChange={(e) => handleScoreChange(dim.key, parseInt(e.target.value))}
                      className="w-full h-3 rounded-full cursor-pointer accent-[#E12880]"
                    />
                    <div className="flex gap-1.5">
                      {Array.from({ length: 11 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleScoreChange(dim.key, i)}
                          className={`flex-1 h-7 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            score === i
                              ? `${getBarColor(i)} text-white shadow-sm`
                              : 'bg-white text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notas del profesional */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Observaciones del profesional (opcional, confidencial):
                    </label>
                    <textarea
                      value={form.dimensions[dim.key]?.notes || ''}
                      onChange={(e) => handleNotesChange(dim.key, e.target.value)}
                      placeholder="Contexto clínico o social relevante para esta dimensión..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-white bg-white/80 text-xs focus:outline-none focus:ring-1 focus:ring-[#E12880] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Consentimiento */}
      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consentimientoActivo}
            onChange={(e) => setForm((p) => ({ ...p, consentimientoActivo: e.target.checked }))}
            className="w-4 h-4 mt-0.5 accent-[#E12880] cursor-pointer"
          />
          <span className="text-xs text-slate-700 leading-relaxed font-semibold">
            Confirmo que la beneficiaria tiene <strong>consentimiento informado activo y vigente</strong> para esta medición, conforme al Anexo H del proyecto institucional y a la <strong>Ley 1581 de 2012</strong>. La participación es voluntaria y revocable en cualquier momento.
          </span>
        </label>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? 'Guardando medición...' : `Registrar Medición IPSC — ${ipscTotal.toFixed(1)}/10`}
      </button>

      <p className="text-center text-[10px] text-slate-400">
        Los datos individuales del IPSC se tratan como datos sensibles bajo Ley 1581/2012.
        Nunca se publican resultados individuales identificables.
      </p>
    </form>
  );
}
