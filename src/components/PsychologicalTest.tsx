'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, ArrowRight, ArrowLeft, Heart, User, Phone, MapPin, Stethoscope, Scale, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export default function PsychologicalTest() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    age: '',
    neighborhood: '',
    q1: 'medio', // Nivel de ansiedad o tristeza
    q2: 'no', // Situación de violencia o agresión
    q3: 'ninguna', // Situación de embarazo
    q4: 'ninguna', // Necesidad jurídica
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionSelect = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName || 'Anonima',
          phone: formData.phone || '3000000000',
          email: formData.email,
          age: formData.age || '22',
          neighborhood: formData.neighborhood || 'Cartagena',
          answers: {
            q1: formData.q1,
            q2: formData.q2,
            q3: formData.q3,
            q4: formData.q4,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setStep(4); // Show diagnostic result step
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Error enviando triaje:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Test Container Card */}
      <div className="bg-white rounded-3xl border border-pink-200 shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            <span>SendaEval — Triaje Psicosocial & Asignación Profesional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Test Psicológico & Diagnóstico de Vulnerabilidad
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-2 max-w-2xl">
            Este cuestionario confidencial ayuda a evaluar tus necesidades emocionales, de salud sexual/reproductiva, médicas y jurídicas para asignarte prioridad con el especialista correspondiente en Cartagena.
          </p>

          {/* Step Progress */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-pink-200">
              <span>Paso {step} de 3</span>
              <div className="w-48 bg-pink-900/50 rounded-full h-2 overflow-hidden border border-pink-400/30">
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Personal Contact Info */}
        {step === 1 && (
          <div className="p-6 sm:p-10 space-y-6">
            <h3 className="text-lg font-bold text-senda-purple flex items-center gap-2">
              <User className="w-5 h-5 text-senda-pink" />
              Paso 1: Información de Contacto Seguro (Confidencial)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tu Nombre o Seudónimo *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Ej: María / Anónima"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 300 123 4567"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Edad *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ej: 21"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Barrio o Zona de Cartagena</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="Ej: Olaya Herrera, Pozón, Manga, Nelson Mandela..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-pink-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (formData.patientName && formData.phone) setStep(2);
                  else alert('Por favor ingresa tu nombre y teléfono de contacto.');
                }}
                className="bg-senda-pink hover:bg-senda-pink-dark text-white font-extrabold px-8 py-3 rounded-full text-sm shadow-md flex items-center space-x-2"
              >
                <span>Continuar a Preguntas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Psychological & Health Assessment Questions */}
        {step === 2 && (
          <div className="p-6 sm:p-10 space-y-8">
            <h3 className="text-lg font-bold text-senda-purple flex items-center gap-2">
              <Brain className="w-5 h-5 text-senda-pink" />
              Paso 2: Evaluación Psicosocial & Estado Emocional
            </h3>

            {/* Q1 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                1. ¿Cómo describirías tu nivel actual de angustia, angustia o tristeza?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'bajo', label: 'Bajo / Estable', desc: 'Me siento tranquila' },
                  { value: 'alto', label: 'Moderado a Alto', desc: 'Ansiedad constante' },
                  { value: 'muy_alto', label: 'Muy Alto / Crisis', desc: 'Sensación de abrumación' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleOptionSelect('q1', opt.value)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      formData.q1 === opt.value
                        ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink'
                        : 'border-slate-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-senda-purple">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                2. ¿Has enfrentado o estás viviendo situaciones de violencia sexual o física?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'no', label: 'No actualmente', desc: 'No estoy expuesta a agresiones' },
                  { value: 'si_reciente', label: 'Evento Reciente', desc: 'Sucedió recientemente' },
                  { value: 'si_frecuente', label: 'Riesgo / Amenaza Activa', desc: 'Convivo con el agresor' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleOptionSelect('q2', opt.value)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      formData.q2 === opt.value
                        ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink'
                        : 'border-slate-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-senda-purple">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-pink-100 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-senda-pink hover:bg-senda-pink-dark text-white font-extrabold px-8 py-3 rounded-full text-sm shadow-md flex items-center space-x-2"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reproductive Health & Legal Needs */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            <h3 className="text-lg font-bold text-senda-purple flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-senda-pink" />
              Paso 3: Necesidades de Salud Reproductive y Asesoría Jurídica
            </h3>

            {/* Q3 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                3. Respecto a tu situación actual de maternidad o embarazo:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'ninguna', label: 'No aplica / No embarazada', desc: 'Busco apoyo psicológico o laboral' },
                  { value: 'embarazo_no_planeado', label: 'Embarazo No Planeado', desc: 'Deseo conocer mis alternativas integrales' },
                  { value: 'embarazo_deseado_apoyo', label: 'Embarazo Deseado', desc: 'Requiero kit maternal y nutrición' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleOptionSelect('q3', opt.value)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      formData.q3 === opt.value
                        ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink'
                        : 'border-slate-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-senda-purple">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                4. ¿Requieres asesoría legal o medidas de protección?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'ninguna', label: 'No por ahora', desc: 'No requiero abogado' },
                  { value: 'denuncia_vbg', label: 'Asesoría de Denuncia', desc: 'Saber cómo denunciar ante Fiscalía/Comisaría' },
                  { value: 'medidas_proteccion', label: 'Medidas de Protección Urgentes', desc: 'Protección para mí o mis hijos' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleOptionSelect('q4', opt.value)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      formData.q4 === opt.value
                        ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink'
                        : 'border-slate-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-senda-purple">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-pink-100 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-senda-pink to-senda-purple text-white font-extrabold px-10 py-3.5 rounded-full text-sm shadow-lg hover:shadow-glow transition-all flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Procesando Diagnóstico...</span>
                ) : (
                  <>
                    <span>Generar Reporte Diagnóstico</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Results & Referral Report Card */}
        {step === 4 && result && (
          <div className="p-6 sm:p-10 space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl p-6 border border-pink-200">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-senda-purple uppercase tracking-wider">
                    Paciente: {result.patientName}
                  </span>
                  <h3 className="text-2xl font-extrabold text-senda-purple-dark mt-1">
                    Diagnóstico de Triaje Psicosocial
                  </h3>
                </div>

                <div className={`px-4 py-1.5 rounded-full font-bold text-xs ${
                  result.overallRiskLevel === 'EMERGENCIA_CRÍTICA'
                    ? 'bg-red-500 text-white animate-pulse'
                    : result.overallRiskLevel === 'ALTO'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  PRIORIDAD: {result.overallRiskLevel}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                  <span className="text-xs text-slate-500">Área Asignada de Primera Atención:</span>
                  <div className="font-extrabold text-base text-senda-pink mt-1 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-senda-purple" />
                    {result.primaryDepartment}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                  <span className="text-xs text-slate-500">Programa Recomendado:</span>
                  <div className="font-extrabold text-xs text-senda-purple mt-1">
                    {result.recommendedProgram}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-senda-purple text-white p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-base text-amber-300">
                Siguiente Paso Recomendado:
              </h4>
              <p className="text-xs text-pink-100 leading-relaxed">
                Tu caso ha quedado registrado en nuestro sistema confidencial. Puedes agendar directamente una consulta presencial o virtual con nuestro profesional en {result.primaryDepartment}.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href={`/agendar-cita?especialidad=${encodeURIComponent(result.primaryDepartment)}&nombre=${encodeURIComponent(result.patientName)}`}
                  className="bg-amber-400 text-senda-purple-dark font-extrabold px-6 py-3 rounded-full text-xs hover:bg-amber-300 transition-all flex items-center gap-2"
                >
                  <span>Agendar Cita en {result.primaryDepartment}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/573176575800?text=Hola,%20acabo%20de%20realizar%20el%20test%20psicológico%20en%20la%20fundación.%20Mi%20nombre%20es%20${encodeURIComponent(result.patientName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-full text-xs hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  <span>Contactar WhatsApp Directo Cartagena</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
