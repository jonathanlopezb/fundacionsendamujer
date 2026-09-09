'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HeartPulse, ShieldAlert, Users, Scale, AlertTriangle, CheckCircle2,
  Stethoscope, RefreshCw, BarChart2, TrendingUp, Sparkles, Filter,
  FileSpreadsheet, Activity, Baby, Eye, Droplet, UserCheck, ChevronRight
} from 'lucide-react';

interface HouseholdMember {
  fullName: string;
  age: number;
  relationship: string;
  documentType: string;
  documentNumber?: string;
}

interface SurveyData {
  _id: string;
  surveyCode: string;
  barrio: string;
  manzana?: string;
  visitDate: string;
  collectorName?: string;
  collectorCode?: string;
  fieldZone?: string;
  householdSize: number;
  minorCount: number;
  allEPSAffiliated: boolean;
  epsRegime?: string;
  hasPregnantOrLactating: boolean;
  vaccinesUpToDate: boolean;
  hasChronicDisease: boolean;
  hasEDAParasites: boolean;
  dentalCarePending: boolean;
  waterSource: string;
  psychologicalSupportNeeded: boolean;
  hasSTIHistoryOrSymptoms: boolean;
  stiSymptomsDetails?: string;
  lastPapSmear: string;
  familyPlanningMethod: string;
  desiresFamilyPlanningCounseling: boolean;
  vaginalInfectionSymptoms: boolean;
  breastSelfExamTrained: boolean;
  hasMammographyOrUltrasoundNeeded: boolean;
  hasFamilyProcess: boolean;
  hasVIFVBG: boolean;
  hasUrgentCase: boolean;
  urgentCaseDescription?: string;
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
  priority: 'NORMAL' | 'PRIORITARIA' | 'INMEDIATA';
  needs: string[];
  householdMembers?: HouseholdMember[];
  createdAt: string;
}

export default function AnalisisEncuestasPage() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('TODOS');
  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'GINECOLOGIA' | 'SALUD_GENERAL' | 'JURIDICO' | 'CASOS'>('RESUMEN');

  async function fetchSurveys() {
    setLoading(true);
    setError('');
    try {
      const url = selectedBarrio === 'TODOS'
        ? '/api/community-surveys'
        : `/api/community-surveys?barrio=${encodeURIComponent(selectedBarrio)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener encuestas');
      setSurveys(data.surveys || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSurveys();
  }, [selectedBarrio]);

  /* ── Métricas Agregadas ────────────────────────────────────────────── */
  const totalSurveys = surveys.length;
  const totalPeople = surveys.reduce((acc, s) => acc + (s.householdSize || 0), 0);
  const totalMinors = surveys.reduce((acc, s) => acc + (s.minorCount || 0), 0);

  /* Ginecología & ITS */
  const stiCases = surveys.filter(s => s.hasSTIHistoryOrSymptoms).length;
  const vaginalInfectionCases = surveys.filter(s => s.vaginalInfectionSymptoms).length;
  const desiresPlanning = surveys.filter(s => s.desiresFamilyPlanningCounseling).length;
  const papDelayedOrNever = surveys.filter(s => s.lastPapSmear === 'MAS_3_ANOS' || s.lastPapSmear === 'NUNCA').length;
  const mammographyNeeded = surveys.filter(s => s.hasMammographyOrUltrasoundNeeded).length;
  const breastExamUntrained = surveys.filter(s => !s.breastSelfExamTrained).length;
  const pregnantCount = surveys.filter(s => s.hasPregnantOrLactating).length;

  /* Salud General */
  const noEPSCount = surveys.filter(s => !s.allEPSAffiliated).length;
  const chronicCount = surveys.filter(s => s.hasChronicDisease).length;
  const edaParasitesCount = surveys.filter(s => s.hasEDAParasites).length;
  const dentalCount = surveys.filter(s => s.dentalCarePending).length;
  const mentalHealthCount = surveys.filter(s => s.psychologicalSupportNeeded).length;

  /* Jurídico & Riesgo */
  const vifCount = surveys.filter(s => s.hasVIFVBG).length;
  const urgentCount = surveys.filter(s => s.hasUrgentCase || s.priority === 'INMEDIATA').length;
  const priorityCount = surveys.filter(s => s.priority === 'PRIORITARIA').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

      {/* ── Banner de Control y Filtros ───────────────────────────────── */}
      <div className="bg-[#170529] border border-purple-800/50 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Inteligencia Comunitaria
            </span>
            <span className="text-purple-300 text-xs">· Planificación de Jornada Médica</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Consolidado Epidemiológico & Caracterización
          </h2>
          <p className="text-xs text-purple-200/70 max-w-2xl mt-1">
            Análisis de alertas en salud sexual y reproductiva (ITS, citologías, planificación), morbilidad crónica, saneamiento y rutas de protección para los médicos especialistas y ginecólogos.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Selector de Barrio */}
          <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-700/60 rounded-2xl px-3 py-2 text-xs font-bold">
            <Filter className="w-3.5 h-3.5 text-pink-400" />
            <select
              value={selectedBarrio}
              onChange={(e) => setSelectedBarrio(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="TODOS" className="bg-[#170529]">Todos los barrios</option>
              <option value="Arroz Barato" className="bg-[#170529]">Arroz Barato</option>
              <option value="Nelson Mandela" className="bg-[#170529]">Nelson Mandela</option>
            </select>
          </div>

          <button
            onClick={fetchSurveys}
            disabled={loading}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* ── KPIs Principales ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#150426] border border-purple-800/40 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hogares Censados</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalSurveys}</p>
          <p className="text-[11px] text-purple-300/70 mt-1">{totalPeople} personas · {totalMinors} menores</p>
        </div>

        <div className="bg-[#150426] border border-rose-500/30 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gineco / ITS Prioritarias</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-200">{stiCases + vaginalInfectionCases}</p>
          <p className="text-[11px] text-rose-300/80 mt-1">{stiCases} sospecha ITS · {vaginalInfectionCases} inf. vaginal</p>
        </div>

        <div className="bg-[#150426] border border-amber-500/30 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citología Crítica / Nunca</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-200">{papDelayedOrNever}</p>
          <p className="text-[11px] text-amber-300/80 mt-1">Requieren tamizaje cérvico-uterino</p>
        </div>

        <div className="bg-[#150426] border border-emerald-500/30 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Casos Urgentes / Inmediatos</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-200">{urgentCount}</p>
          <p className="text-[11px] text-emerald-300/80 mt-1">Rutas inmediatas activadas o alerta</p>
        </div>
      </div>

      {/* ── Tabs de Navegación del Dashboard ─────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-purple-800/40 pb-2 overflow-x-auto">
        {[
          { id: 'RESUMEN', label: '📊 Resumen General' },
          { id: 'GINECOLOGIA', label: '🌸 Ginecología & ITS (Brief Médico)' },
          { id: 'SALUD_GENERAL', label: '⚕️ Salud, Crónicos & Niñez' },
          { id: 'JURIDICO', label: '⚖️ Protección & Familia' },
          { id: 'CASOS', label: '📋 Detalle de Fichas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: RESUMEN GENERAL ───────────────────────────────────── */}
      {activeTab === 'RESUMEN' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Brief para Médicos Líderes */}
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-pink-300 font-extrabold text-xs uppercase tracking-wider">
                <Stethoscope className="w-4 h-4" />
                <span>Brief Epidemiológico Preliminar</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Hipótesis de Demanda Médica para la Jornada
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Con base en las <strong>{totalSurveys} fichas levantadas</strong>, el equipo coordinador recomienda dotar prioritariamente los siguientes suministros y perfiles profesionales:
              </p>

              <div className="space-y-3 pt-2">
                <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs text-purple-200 font-bold">1. Ginecología & Citologías</span>
                  <span className="text-xs font-black text-pink-300">{papDelayedOrNever + stiCases} pacientes proyectadas</span>
                </div>
                <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs text-purple-200 font-bold">2. Pediatría (EDA/Parásitos/Vacunación)</span>
                  <span className="text-xs font-black text-amber-300">{edaParasitesCount} hogares afectados</span>
                </div>
                <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs text-purple-200 font-bold">3. Medicina Interna / Enfermedades Crónicas</span>
                  <span className="text-xs font-black text-purple-300">{chronicCount} pacientes con HTA/Diabetes</span>
                </div>
                <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs text-purple-200 font-bold">4. Contención Psicológica y Emocional</span>
                  <span className="text-xs font-black text-emerald-300">{mentalHealthCount} solicitudes de apoyo</span>
                </div>
              </div>
            </div>

            {/* Clasificación de Prioridad */}
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Niveles de Priorización de Hogares</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Distribución de Riesgo Comunitario
              </h3>

              <div className="space-y-4 pt-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-rose-300">Inmediata (Riesgo Crítico / Urgencia)</span>
                    <span className="text-white">{urgentCount} ({totalSurveys ? Math.round((urgentCount / totalSurveys) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-3 overflow-hidden border border-purple-800">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${totalSurveys ? (urgentCount / totalSurveys) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-amber-300">Prioritaria (Gineco, VIF o Crónicos)</span>
                    <span className="text-white">{priorityCount} ({totalSurveys ? Math.round((priorityCount / totalSurveys) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-3 overflow-hidden border border-purple-800">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalSurveys ? (priorityCount / totalSurveys) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-300">Normal (Atención Regular en Brigada)</span>
                    <span className="text-white">{totalSurveys - urgentCount - priorityCount} ({totalSurveys ? Math.round(((totalSurveys - urgentCount - priorityCount) / totalSurveys) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-3 overflow-hidden border border-purple-800">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${totalSurveys ? ((totalSurveys - urgentCount - priorityCount) / totalSurveys) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-purple-950/60 border border-purple-800 text-xs text-purple-200">
                💡 Los casos calificados en <strong>INMEDIATA</strong> activan remisión con la Comisaría de Familia, ICBF o IPS aliada antes del día central del evento.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 2: GINECOLOGÍA & ITS ─────────────────────────────────── */}
      {activeTab === 'GINECOLOGIA' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#150426] border border-rose-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">Riesgo ITS Detectado</span>
              <p className="text-3xl font-black text-white mt-1">{stiCases}</p>
              <p className="text-xs text-rose-200/80 mt-1">Hogares con síntomas compatibles o antecedente de ITS</p>
            </div>

            <div className="bg-[#150426] border border-pink-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">Demanda Planificación Familiar</span>
              <p className="text-3xl font-black text-white mt-1">{desiresPlanning}</p>
              <p className="text-xs text-pink-200/80 mt-1">Mujeres solicitando inicio o cambio de método anticonceptivo</p>
            </div>

            <div className="bg-[#150426] border border-amber-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Rezago en Citologías</span>
              <p className="text-3xl font-black text-white mt-1">{papDelayedOrNever}</p>
              <p className="text-xs text-amber-200/80 mt-1">Citología superior a 3 años o nunca realizada en la vida</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recomendaciones Ginecológicas */}
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Guía de Insumos para Ginecología & Enfermería
              </h3>
              <ul className="space-y-2.5 text-xs text-purple-200/85">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Especuloscopios y fijadores de citología:</strong> Garantizar al menos {papDelayedOrNever * 2} kits de toma citológica con láminas portaobjetos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tratamiento sindrómico de ITS:</strong> Antibióticos y antimicóticos de amplio espectro (Metronidazol, Fluconazol, Azitromicina, Penicilina Benzatínica) según protocolo DADIS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Métodos anticonceptivos de barrera e implantes:</strong> Disponibilidad para inserción de implantes subdérmicos (Jadelle/Implanon) para las {desiresPlanning} solicitudes identificadas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Capacitación en Autoexamen de Mama:</strong> Se detectaron {breastExamUntrained} hogares sin entrenamiento en prevención de cáncer de mama.</span>
                </li>
              </ul>
            </div>

            {/* Listado de Casos de Síntomas ITS */}
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Casos Registrados con Alerta Ginecológica / ITS
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {surveys.filter(s => s.hasSTIHistoryOrSymptoms || s.vaginalInfectionSymptoms).map((s) => (
                  <div key={s._id} className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-pink-300">{s.surveyCode}</span>
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                        {s.hasSTIHistoryOrSymptoms ? 'Sospecha ITS' : 'Infección Vaginal'}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200">
                      <strong>Barrio:</strong> {s.barrio} {s.manzana ? `· Mz ${s.manzana}` : ''}
                    </p>
                    {s.stiSymptomsDetails && (
                      <p className="text-[11px] text-rose-200 italic bg-rose-950/30 p-2 rounded-xl border border-rose-800/30">
                        "{s.stiSymptomsDetails}"
                      </p>
                    )}
                    <p className="text-[10px] text-purple-400">
                      Citología: <strong>{s.lastPapSmear}</strong> · Planificación: <strong>{s.familyPlanningMethod}</strong>
                    </p>
                  </div>
                ))}
                {surveys.filter(s => s.hasSTIHistoryOrSymptoms || s.vaginalInfectionSymptoms).length === 0 && (
                  <p className="text-xs text-purple-300/60 text-center py-6">No hay casos ginecológicos prioritarios registrados en este filtro.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SALUD GENERAL & MORBILIDAD ────────────────────────── */}
      {activeTab === 'SALUD_GENERAL' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">Sin Afiliación EPS</span>
              <p className="text-3xl font-black text-white mt-1">{noEPSCount}</p>
              <p className="text-xs text-purple-300/70 mt-1">Activan Mesa de SISBÉN / EPS</p>
            </div>
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Enfermedades Crónicas</span>
              <p className="text-3xl font-black text-white mt-1">{chronicCount}</p>
              <p className="text-xs text-purple-300/70 mt-1">HTA, Diabetes, EPOC</p>
            </div>
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">EDA / Parasitosis Niñez</span>
              <p className="text-3xl font-black text-white mt-1">{edaParasitesCount}</p>
              <p className="text-xs text-purple-300/70 mt-1">Demanda de sales y antiparasitarios</p>
            </div>
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-300">Apoyo Psicológico</span>
              <p className="text-3xl font-black text-white mt-1">{mentalHealthCount}</p>
              <p className="text-xs text-purple-300/70 mt-1">Tamizaje SendaEval solicitado</p>
            </div>
          </div>

          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Previsión Farmacéutica y de Especialistas</h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-purple-200">
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-800/60 space-y-2">
                <p className="font-bold text-pink-300">Categorías terapéuticas críticas a solicitar al DADIS / IPS:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sales de rehidratación oral (SRO) en cantidad elevada por rezago de saneamiento.</li>
                  <li>Antiparasitarios pediátricos y adultos (Albendazol / Nitazoxanida).</li>
                  <li>Antihipertensivos de primera línea (Losartán, Amlodipino, Enalapril).</li>
                  <li>Hipoglicemiantes orales (Metformina, Glibenclamida).</li>
                </ul>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-800/60 space-y-2">
                <p className="font-bold text-amber-300">Equipo Médico Requerido en Terreno:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>2 Médicos Generales (Triage y consulta resolutiva).</li>
                  <li>1 Especialista en Ginecología / Salud Sexual.</li>
                  <li>1 Pediatra (alta proporción infantil censada).</li>
                  <li>1 Odontóloga (limpiezas y valoraciones).</li>
                  <li>2 Psicólogas / Trabajadoras Sociales (tamizaje y contención).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: JURÍDICO & PROTECCIÓN ─────────────────────────────── */}
      {activeTab === 'JURIDICO' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#150426] border border-rose-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">Violencia Intrafamiliar / Género</span>
              <p className="text-3xl font-black text-white mt-1">{vifCount}</p>
              <p className="text-xs text-rose-200/80 mt-1">Activan Mesa de Protección y Denuncia</p>
            </div>
            <div className="bg-[#150426] border border-amber-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Procesos de Alimentos & Custodia</span>
              <p className="text-3xl font-black text-white mt-1">{surveys.filter(s => s.hasFamilyProcess).length}</p>
              <p className="text-xs text-amber-200/80 mt-1">Mesa 1 de Familia y Menores</p>
            </div>
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">Legalización de Predio / Vivienda</span>
              <p className="text-3xl font-black text-white mt-1">{surveys.filter(s => s.needs.includes('vivienda')).length}</p>
              <p className="text-xs text-purple-300/70 mt-1">Post-legalización Decreto 0971/2025</p>
            </div>
          </div>

          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Organización de Mesas Cívicas y Jurídicas</h3>
            <p className="text-xs text-purple-200/80">
              Cada mesa contará con un formato de compromiso de gestión y acompañamiento durante 60 días posteriores al evento:
            </p>
            <div className="grid md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
                <strong className="block text-pink-300 mb-1">Mesa 1 · Alimentos & Familia</strong>
                <p className="text-purple-300/70">Fijación de cuota, custodia y régimen de visitas con defensoras públicas.</p>
              </div>
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
                <strong className="block text-rose-300 mb-1">Mesa 2 · Violencia & Protección</strong>
                <p className="text-purple-300/70">Articulación con Comisaría de Familia, Policía y medidas cautelares de protección.</p>
              </div>
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
                <strong className="block text-amber-300 mb-1">Mesa 3 · Vivienda & Predios</strong>
                <p className="text-purple-300/70">Orientación en escrituración individual, titulación y subsidios de mejoramiento.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: DETALLE DE FICHAS ─────────────────────────────────── */}
      {activeTab === 'CASOS' && (
        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Registro de Fichas de Campo</h3>
            <span className="text-xs text-purple-300">{surveys.length} registradas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-purple-200">
              <thead className="bg-purple-950/70 text-purple-300 uppercase font-black text-[10px] tracking-wider border-b border-purple-800">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Barrio / Mz</th>
                  <th className="p-3">Hogar / NNA</th>
                  <th className="p-3">Gineco / ITS</th>
                  <th className="p-3">Citología</th>
                  <th className="p-3">Prioridad</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {surveys.map((s) => (
                  <tr key={s._id} className="hover:bg-purple-900/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-pink-300">{s.surveyCode}</td>
                    <td className="p-3 font-bold text-white">{s.barrio} {s.manzana ? `· Mz ${s.manzana}` : ''}</td>
                    <td className="p-3">{s.householdSize} personas ({s.minorCount} NNA)</td>
                    <td className="p-3">
                      {s.hasSTIHistoryOrSymptoms ? (
                        <span className="text-rose-300 font-bold bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                          Síntomas ITS
                        </span>
                      ) : s.vaginalInfectionSymptoms ? (
                        <span className="text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          Infección
                        </span>
                      ) : (
                        <span className="text-emerald-400">Sin reporte</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.lastPapSmear === 'NUNCA' || s.lastPapSmear === 'MAS_3_ANOS'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-purple-950 text-purple-300'
                      }`}>
                        {s.lastPapSmear}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`font-black text-[10px] px-2.5 py-1 rounded-full ${
                        s.priority === 'INMEDIATA'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : s.priority === 'PRIORITARIA'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {s.priority}
                      </span>
                    </td>
                    <td className="p-3 text-purple-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {surveys.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-purple-300/60">
                      No hay registros de caracterización para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
