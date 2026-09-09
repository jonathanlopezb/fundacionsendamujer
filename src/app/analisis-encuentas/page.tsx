'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  Users, HeartPulse, Scale, DollarSign, Eye, RefreshCw, Filter,
  ShieldAlert, AlertTriangle, CheckCircle2, Download, Building,
  Droplet, Home, GraduationCap, Briefcase, Stethoscope, Baby,
  Activity, ArrowUpRight, ChevronRight, Sparkles, FileText
} from 'lucide-react';

/* ── Interfaces ──────────────────────────────────────────────────────────── */
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
  contactPhone?: string;
  landmark?: string;

  /* Sección A */
  householdSize: number;
  minorCount: number;
  allDocumentsValid: boolean;
  documentsIssue?: string;
  allNNASchooled: boolean;
  schoolDropoutReason?: string;
  hasDisabledMember: boolean;
  disabledDetails?: string;
  hasElderlyMember: boolean;
  elderlyCount: number;
  rooms: number;
  overcrowdingNotes?: string;

  /* Sección B */
  allEPSAffiliated: boolean;
  epsRegime?: string;
  nonAffiliatedReason?: string;
  hasPregnantOrLactating: boolean;
  prenatalCareStatus?: string;
  vaccinesUpToDate: boolean;
  vaccineCardAvailable: boolean;
  hasChronicDisease: boolean;
  chronicDiseaseDetails?: string;
  hasEDAParasites: boolean;
  edaDetails?: string;
  dentalCarePending: boolean;
  healthcareAccessDifficulty: boolean;
  healthcareAccessDetails?: string;
  waterSource: 'ACUEDUCTO' | 'PILA_PUBLICA' | 'CARROTANQUE' | 'POZO' | 'OTRO';
  psychologicalSupportNeeded: boolean;
  psychologicalSupportWho?: string;

  /* B.1 Gineco & ITS */
  hasSTIHistoryOrSymptoms: boolean;
  stiSymptomsDetails?: string;
  lastPapSmear: string;
  familyPlanningMethod: string;
  desiresFamilyPlanningCounseling: boolean;
  vaginalInfectionSymptoms: boolean;
  breastSelfExamTrained: boolean;
  hasMammographyOrUltrasoundNeeded: boolean;

  /* Sección C */
  hasFamilyProcess: boolean;
  familyProcessDetails?: string;
  hasVIFVBG: boolean;
  vifComplaintFiled?: boolean;
  vifProcessStatus?: string;
  housingType: 'PROPIA' | 'ARRENDADA' | 'FAMILIAR' | 'OTRA';
  hasHousingDocument: boolean;
  hasDebtOrProcess: boolean;
  debtDetails?: string;
  needsPensionOrSubsidy: boolean;
  pensionDetails?: string;
  hasUrgentCase: boolean;
  urgentCaseDescription?: string;

  /* Sección D */
  incomeSource?: string;
  receivesSubsidies: boolean;
  subsidiesDetails?: string;
  hasJobSeeker: boolean;
  jobSearchDifficulty?: string;
  hasRecentGraduate: boolean;
  graduateStatus?: string;

  /* Sección E */
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO';
  observedRiskIndicators?: string;
  authorizedRecontact: boolean;
  collectorObservations?: string;
  activateImmediateRoute: boolean;
  immediateRouteType?: string;

  needs: string[];
  priority: 'NORMAL' | 'PRIORITARIA' | 'INMEDIATA';
  householdMembers?: HouseholdMember[];
  createdAt: string;
}

const PALETTE = ['#E12880', '#9333EA', '#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#6366F1'];

export default function AnalisisEncuestasPage() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('TODOS');
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'DEMOGRAFIA' | 'SALUD_EPIDEMIOLOGIA' | 'JURIDICO_PROTECCION' | 'ECONOMICO_SOCIAL' | 'RIESGOS_CASOS'>('GLOBAL');

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

  /* ── Métricas Globales Calculadas ───────────────────────────────────────── */
  const metrics = useMemo(() => {
    const totalHogares = surveys.length;
    const totalPersonas = surveys.reduce((acc, s) => acc + (s.householdSize || 0), 0);
    const totalMenores = surveys.reduce((acc, s) => acc + (s.minorCount || 0), 0);
    const totalAdultosMayores = surveys.reduce((acc, s) => acc + (s.elderlyCount || (s.hasElderlyMember ? 1 : 0)), 0);
    const personasConDiscapacidad = surveys.filter(s => s.hasDisabledMember).length;

    /* Saneamiento y Vivienda */
    const hacinamientoHogares = surveys.filter(s => (s.householdSize / Math.max(s.rooms || 1, 1)) > 3).length;
    const sinAcueducto = surveys.filter(s => s.waterSource !== 'ACUEDUCTO').length;
    const sinTituloVivienda = surveys.filter(s => !s.hasHousingDocument).length;

    /* Salud General & Niñez */
    const sinEPS = surveys.filter(s => !s.allEPSAffiliated).length;
    const conEnfermedadCronica = surveys.filter(s => s.hasChronicDisease).length;
    const ninosInfeccionEda = surveys.filter(s => s.hasEDAParasites).length;
    const vacunasIncompletas = surveys.filter(s => !s.vaccinesUpToDate).length;
    const apoyoPsicologico = surveys.filter(s => s.psychologicalSupportNeeded).length;

    /* Salud Sexual y Reproductiva */
    const gestantesLactantes = surveys.filter(s => s.hasPregnantOrLactating).length;
    const sospechaITS = surveys.filter(s => s.hasSTIHistoryOrSymptoms).length;
    const infeccionVaginal = surveys.filter(s => s.vaginalInfectionSymptoms).length;
    const citologiaCritica = surveys.filter(s => s.lastPapSmear === 'MAS_3_ANOS' || s.lastPapSmear === 'NUNCA').length;
    const demandaPlanificacion = surveys.filter(s => s.desiresFamilyPlanningCounseling).length;
    const sinAutoexamenMama = surveys.filter(s => !s.breastSelfExamTrained).length;

    /* Jurídico & Familia */
    const casosVIF = surveys.filter(s => s.hasVIFVBG).length;
    const procesosAlimentos = surveys.filter(s => s.hasFamilyProcess).length;
    const deudasEmbargos = surveys.filter(s => s.hasDebtOrProcess).length;
    const tramitesPensionales = surveys.filter(s => s.needsPensionOrSubsidy).length;

    /* Económico & Educación */
    const desercionEscolar = surveys.filter(s => !s.allNNASchooled).length;
    const indocumentados = surveys.filter(s => !s.allDocumentsValid).length;
    const buscandoEmpleo = surveys.filter(s => s.hasJobSeeker).length;
    const jovenesEgresadosDesocupados = surveys.filter(s => s.hasRecentGraduate).length;
    const recibenSubsidios = surveys.filter(s => s.receivesSubsidies).length;

    /* Clasificación de Prioridad */
    const prioridadInmediata = surveys.filter(s => s.priority === 'INMEDIATA' || s.hasUrgentCase).length;
    const prioridadAlta = surveys.filter(s => s.priority === 'PRIORITARIA').length;
    const prioridadNormal = surveys.filter(s => s.priority === 'NORMAL' && !s.hasUrgentCase).length;

    /* Datos para Gráficos Recharts */
    const priorityChartData = [
      { name: 'Inmediata', value: prioridadInmediata, color: '#F43F5E' },
      { name: 'Prioritaria', value: prioridadAlta, color: '#F59E0B' },
      { name: 'Normal', value: prioridadNormal, color: '#10B981' },
    ];

    const waterChartData = [
      { name: 'Acueducto', value: surveys.filter(s => s.waterSource === 'ACUEDUCTO').length },
      { name: 'Carrotanque', value: surveys.filter(s => s.waterSource === 'CARROTANQUE').length },
      { name: 'Pila Pública', value: surveys.filter(s => s.waterSource === 'PILA_PUBLICA').length },
      { name: 'Pozo/Otro', value: surveys.filter(s => s.waterSource === 'POZO' || s.waterSource === 'OTRO').length },
    ];

    const housingChartData = [
      { name: 'Propia', value: surveys.filter(s => s.housingType === 'PROPIA').length },
      { name: 'Arrendada', value: surveys.filter(s => s.housingType === 'ARRENDADA').length },
      { name: 'Familiar', value: surveys.filter(s => s.housingType === 'FAMILIAR').length },
      { name: 'Otra tenencia', value: surveys.filter(s => s.housingType === 'OTRA').length },
    ];

    const healthDeficitData = [
      { area: 'Sin EPS', cantidad: sinEPS },
      { area: 'Crónicos (HTA/DBT)', cantidad: conEnfermedadCronica },
      { area: 'EDA/Parásitos NNA', cantidad: ninosInfeccionEda },
      { area: 'Apoyo Psicológico', cantidad: apoyoPsicologico },
      { area: 'Citología Vencida/Nunca', cantidad: citologiaCritica },
      { area: 'Demanda Anticoncepción', cantidad: demandaPlanificacion },
    ];

    const legalVulnerabilityData = [
      { category: 'VIF / Género', total: casosVIF },
      { category: 'Alimentos / Custodia', total: procesosAlimentos },
      { category: 'Deudas / Embargos', total: deudasEmbargos },
      { category: 'Subsidio / Pensión', total: tramitesPensionales },
      { category: 'Sin Documentos', total: indocumentados },
      { category: 'Deserción Escolar', total: desercionEscolar },
    ];

    return {
      totalHogares,
      totalPersonas,
      totalMenores,
      totalAdultosMayores,
      personasConDiscapacidad,
      hacinamientoHogares,
      sinAcueducto,
      sinTituloVivienda,
      sinEPS,
      conEnfermedadCronica,
      ninosInfeccionEda,
      vacunasIncompletas,
      apoyoPsicologico,
      gestantesLactantes,
      sospechaITS,
      infeccionVaginal,
      citologiaCritica,
      demandaPlanificacion,
      sinAutoexamenMama,
      casosVIF,
      procesosAlimentos,
      deudasEmbargos,
      tramitesPensionales,
      desercionEscolar,
      indocumentados,
      buscandoEmpleo,
      jovenesEgresadosDesocupados,
      recibenSubsidios,
      prioridadInmediata,
      prioridadAlta,
      prioridadNormal,
      priorityChartData,
      waterChartData,
      housingChartData,
      healthDeficitData,
      legalVulnerabilityData,
    };
  }, [surveys]);

  /* Exportación de Datos en Formato CSV */
  const exportToCSV = () => {
    if (surveys.length === 0) return;
    const headers = [
      'Codigo_Encuesta', 'Barrio', 'Manzana', 'Tamano_Hogar', 'Menores', 'Prioridad',
      'Sin_EPS', 'Enfermedad_Cronica', 'EDA_Parasitos', 'Sospecha_ITS', 'Citologia',
      'VIF_Genero', 'Alimentos_Custodia', 'Sin_Acueducto', 'Hacinamiento', 'Ingresos_Fuente'
    ];
    const rows = surveys.map(s => [
      s.surveyCode,
      `"${s.barrio}"`,
      `"${s.manzana || ''}"`,
      s.householdSize,
      s.minorCount,
      s.priority,
      s.allEPSAffiliated ? 'NO' : 'SI',
      s.hasChronicDisease ? 'SI' : 'NO',
      s.hasEDAParasites ? 'SI' : 'NO',
      s.hasSTIHistoryOrSymptoms ? 'SI' : 'NO',
      s.lastPapSmear,
      s.hasVIFVBG ? 'SI' : 'NO',
      s.hasFamilyProcess ? 'SI' : 'NO',
      s.waterSource !== 'ACUEDUCTO' ? 'SI' : 'NO',
      (s.householdSize / Math.max(s.rooms || 1, 1)) > 3 ? 'SI' : 'NO',
      `"${s.incomeSource || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Censo_FundacionSendaMujer_${selectedBarrio}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans">
      
      {/* ── Barra Superior de Control y Filtros ─────────────────────────── */}
      <div className="bg-[#130324] border border-purple-800/60 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              Observatorio Social & Censo Multidimensional
            </span>
            <span className="text-xs text-purple-300">· Fundación Senda Mujer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Diagnóstico Comunitario & Inteligencia Territorial
          </h2>
          <p className="text-xs text-purple-200/70 max-w-2xl">
            Procesamiento analítico de determinantes sociales de la salud, brechas jurídicas, seguridad alimentaria, saneamiento y alertas críticas para el comité técnico intersectorial.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Selector de Barrio */}
          <div className="flex items-center gap-2 bg-purple-950/70 border border-purple-700/70 rounded-2xl px-3.5 py-2 text-xs font-bold shadow-inner">
            <Filter className="w-3.5 h-3.5 text-pink-400" />
            <select
              value={selectedBarrio}
              onChange={(e) => setSelectedBarrio(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="TODOS" className="bg-[#130324]">Todos los barrios ({surveys.length})</option>
              <option value="Arroz Barato" className="bg-[#130324]">Arroz Barato (Localidad 3)</option>
              <option value="Nelson Mandela" className="bg-[#130324]">Nelson Mandela (Localidad 4)</option>
            </select>
          </div>

          <button
            onClick={fetchSurveys}
            disabled={loading}
            className="flex items-center gap-1.5 bg-purple-900/60 hover:bg-purple-800/80 text-white font-bold text-xs px-3.5 py-2 rounded-2xl border border-purple-700/60 shadow-sm transition-all cursor-pointer"
            title="Recargar datos de MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />
            <span>Sincronizar</span>
          </button>

          <button
            onClick={exportToCSV}
            disabled={surveys.length === 0}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-4 py-2 rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
            title="Exportar base de datos a Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* ── Panel de 6 Tarjetas de Indicadores Macro ────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-4 shadow-lg">
          <span className="text-[10px] font-black uppercase text-purple-400 block tracking-wider">Hogares Censados</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{metrics.totalHogares}</p>
          <span className="text-[10px] text-purple-300/70 mt-1 block">{metrics.totalPersonas} personas</span>
        </div>

        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-4 shadow-lg">
          <span className="text-[10px] font-black uppercase text-pink-400 block tracking-wider">Infancia & NNA</span>
          <p className="text-2xl sm:text-3xl font-black text-pink-200 mt-1">{metrics.totalMenores}</p>
          <span className="text-[10px] text-pink-300/70 mt-1 block">{metrics.desercionEscolar} no escolarizados</span>
        </div>

        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-4 shadow-lg">
          <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">Brecha en Salud</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-200 mt-1">{metrics.sinEPS + metrics.conEnfermedadCronica}</p>
          <span className="text-[10px] text-amber-300/70 mt-1 block">{metrics.sinEPS} sin afiliación EPS</span>
        </div>

        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-4 shadow-lg">
          <span className="text-[10px] font-black uppercase text-sky-400 block tracking-wider">Déficit Agua / San.</span>
          <p className="text-2xl sm:text-3xl font-black text-sky-200 mt-1">{metrics.sinAcueducto}</p>
          <span className="text-[10px] text-sky-300/70 mt-1 block">{metrics.hacinamientoHogares} en hacinamiento</span>
        </div>

        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-4 shadow-lg">
          <span className="text-[10px] font-black uppercase text-indigo-400 block tracking-wider">Alerta Jurídica VIF</span>
          <p className="text-2xl sm:text-3xl font-black text-indigo-200 mt-1">{metrics.casosVIF}</p>
          <span className="text-[10px] text-indigo-300/70 mt-1 block">{metrics.procesosAlimentos} proc. de alimentos</span>
        </div>

        <div className="bg-[#150426] border border-rose-500/40 rounded-3xl p-4 shadow-lg">
          <span className="text-[10px] font-black uppercase text-rose-400 block tracking-wider">Riesgo Inmediato</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-200 mt-1">{metrics.prioridadInmediata}</p>
          <span className="text-[10px] text-rose-300/70 mt-1 block">Rutas de urgencia activas</span>
        </div>
      </div>

      {/* ── Navegación Temática por Pestañas del Dashboard ─────────────── */}
      <div className="flex items-center gap-2 border-b border-purple-800/50 pb-2 overflow-x-auto">
        {[
          { id: 'GLOBAL', label: '🌐 Panorama Global & Prioridades' },
          { id: 'DEMOGRAFIA', label: '👥 Demografía & Hábitat' },
          { id: 'SALUD_EPIDEMIOLOGIA', label: '🩺 Salud Integral & Epidemiología' },
          { id: 'JURIDICO_PROTECCION', label: '⚖️ Derechos, VBG & Familia' },
          { id: 'ECONOMICO_SOCIAL', label: '💼 Empleo & Desigualdad' },
          { id: 'RIESGOS_CASOS', label: '🚨 Matriz de Casos de Urgencia' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA 1: PANORAMA GLOBAL & PRIORIDADES
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'GLOBAL' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Gráfico 1: Triage de Prioridad */}
            <div className="lg:col-span-5 bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Triaje & Nivel de Prioridad del Censo
                </h3>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Protocolo Senda</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {metrics.priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18052e', borderColor: '#7c3aed', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-purple-800/40">
                <div className="bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-rose-300 block">Inmediata</span>
                  <span className="text-base font-black text-rose-200">{metrics.prioridadInmediata}</span>
                </div>
                <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-300 block">Prioritaria</span>
                  <span className="text-base font-black text-amber-200">{metrics.prioridadAlta}</span>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-300 block">Normal</span>
                  <span className="text-base font-black text-emerald-200">{metrics.prioridadNormal}</span>
                </div>
              </div>
            </div>

            {/* Gráfico 2: Radar de Vulnerabilidad Multidimensional */}
            <div className="lg:col-span-7 bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-400" />
                  Magnitud de Necesidades Críticas Detectadas
                </h3>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Censo Terreno</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.healthDeficitData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e1052" />
                    <XAxis dataKey="area" tick={{ fill: '#d8b4fe', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fill: '#d8b4fe', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#18052e', borderColor: '#7c3aed', borderRadius: '1rem', color: '#fff' }} />
                    <Bar dataKey="cantidad" fill="#ec4899" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-purple-200/75 leading-relaxed bg-purple-950/40 p-3.5 rounded-2xl border border-purple-800/50">
                📌 <strong>Conclusión Técnica:</strong> El {metrics.totalHogares > 0 ? Math.round(((metrics.sinEPS + metrics.citologiaCritica + metrics.casosVIF) / Math.max(metrics.totalHogares, 1)) * 10) : 0}% de la población presenta vulnerabilidades cruzadas entre salud no resuelta y violencia intrafamiliar. Se requiere intervención coordinada entre DADIS, Comisarías de Familia y la Fundación Senda Mujer.
              </p>
            </div>
          </div>

          {/* Matriz Ejecutiva para Toma de Decisiones */}
          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white">Recomendaciones Estratégicas para el Comité Interinstitucional</h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-purple-200">
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-pink-300 font-black text-sm block">1. Despliegue Médico & Saneamiento</strong>
                <p className="leading-relaxed">
                  Garantizar abastecimiento de <strong>Sales de Rehidratación Oral (SRO)</strong> y antiparasitarios debido a los {metrics.ninosInfeccionEda} hogares infantiles con EDA, directamente asociados al {metrics.totalHogares > 0 ? Math.round((metrics.sinAcueducto / metrics.totalHogares) * 100) : 0}% sin acceso a acueducto continuo.
                </p>
              </div>

              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-amber-300 font-black text-sm block">2. Mesa de Protección y VBG</strong>
                <p className="leading-relaxed">
                  Activar de oficio la <strong>Patrulla Púrpura</strong> y comisarías de familia para los {metrics.casosVIF} casos de violencia de género detectados, asegurando medidas de protección inmediatas y traslado seguro si existe riesgo vital.
                </p>
              </div>

              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-emerald-300 font-black text-sm block">3. Titulación & Formalización</strong>
                <p className="leading-relaxed">
                  Aprovechar el Decreto 0971 de 2025 para agilizar la titulación predial individual en los {metrics.sinTituloVivienda} hogares sin escrituras, mitigando el riesgo de desalojo forzoso y permitiendo acceso a subsidios de mejoramiento.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA 2: DEMOGRAFÍA & HÁBITAT
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'DEMOGRAFIA' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid lg:grid-cols-12 gap-6">

            {/* Gráfico: Tenencia de Vivienda */}
            <div className="lg:col-span-6 bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-400" />
                Régimen de Tenencia de la Vivienda
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.housingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e1052" />
                    <XAxis dataKey="name" tick={{ fill: '#d8b4fe', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#d8b4fe', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#18052e', borderColor: '#7c3aed', borderRadius: '1rem', color: '#fff' }} />
                    <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-purple-300/80">
                {metrics.sinTituloVivienda} hogares no cuentan con escrituras o título formal de propiedad ({metrics.totalHogares > 0 ? Math.round((metrics.sinTituloVivienda / metrics.totalHogares) * 100) : 0}% de precariedad de tenencia).
              </p>
            </div>

            {/* Gráfico: Fuentes de Agua para Consumo */}
            <div className="lg:col-span-6 bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-400" />
                Acceso al Agua Potable y Saneamiento
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.waterChartData}
                      cx="50%"
                      cy="50%"
                      label
                    >
                      {metrics.waterChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#18052e', borderColor: '#7c3aed', borderRadius: '1rem', color: '#fff', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-purple-300/80">
                El abastecimiento por carrotanque y pila pública predomina en sectores no consolidados, elevando la incidencia de parásitos e infecciones dérmicas en menores.
              </p>
            </div>

          </div>

          {/* Tarjetas Demográficas Detalladas */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-pink-300 tracking-wider">Hacinamiento Crítico</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.hacinamientoHogares}</p>
              <p className="text-xs text-purple-300/70 mt-1">Más de 3 personas por habitación</p>
            </div>

            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Adultos Mayores</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.totalAdultosMayores}</p>
              <p className="text-xs text-purple-300/70 mt-1">Población de 65+ años en el censo</p>
            </div>

            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">Personas con Discapacidad</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.personasConDiscapacidad}</p>
              <p className="text-xs text-purple-300/70 mt-1">Requieren ayudas técnicas y valoración</p>
            </div>

            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-sky-300 tracking-wider">Deserción Escolar NNA</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.desercionEscolar}</p>
              <p className="text-xs text-purple-300/70 mt-1">Menores fuera del sistema educativo</p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA 3: SALUD INTEGRAL & EPIDEMIOLOGÍA
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'SALUD_EPIDEMIOLOGIA' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-[#150426] border border-rose-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">Sospecha o Síntomas ITS</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.sospechaITS}</p>
              <p className="text-xs text-rose-200/80 mt-1">Requieren tratamiento sindrómico inmediato</p>
            </div>

            <div className="bg-[#150426] border border-pink-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider">Citología Crítica</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.citologiaCritica}</p>
              <p className="text-xs text-pink-200/80 mt-1">+3 años de vencimiento o nunca realizada</p>
            </div>

            <div className="bg-[#150426] border border-amber-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Enfermedades Crónicas</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.conEnfermedadCronica}</p>
              <p className="text-xs text-amber-200/80 mt-1">Hipertensión, Diabetes, EPOC</p>
            </div>

            <div className="bg-[#150426] border border-purple-500/40 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Salud Mental / Psicosocial</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.apoyoPsicologico}</p>
              <p className="text-xs text-purple-200/80 mt-1">Solicitan contención emocional y terapia</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Dotación Médica Requerida */}
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                Guía de Suministros Farmacéuticos & Clínicos
              </h3>
              <ul className="space-y-2.5 text-xs text-purple-200/90 leading-relaxed">
                <li className="flex items-start gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Salud Sexual:</strong> Kits de citología ({metrics.citologiaCritica * 2} unidades recomendadas), espéculos desechables, preservativos y aplicadores de implantes subdérmicos ({metrics.demandaPlanificacion} usuarias interesadas).</span>
                </li>
                <li className="flex items-start gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Pediatría:</strong> Sales de rehidratación oral (SRO), antiparasitarios pediátricos (Albendazol) y vacunas biológicas de refuerzo para niños con esquema incompleto ({metrics.vacunasIncompletas} casos).</span>
                </li>
                <li className="flex items-start gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Medicina Interna:</strong> Tensiómetros, glucómetros, tiras reactivas e hipoglicemiantes/antihipertensivos para los {metrics.conEnfermedadCronica} adultos crónicos censados.</span>
                </li>
                <li className="flex items-start gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Prevención Cáncer de Mama:</strong> Se detectaron {metrics.sinAutoexamenMama} hogares que desconocen el autoexamen de mama; se programan 4 talleres formativos grupales.</span>
                </li>
              </ul>
            </div>

            {/* Listado de Casos de Alerta Epidemiológica */}
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-400" />
                Hogares con Alertas Clínicas Prioritarias
              </h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
                {surveys.filter(s => s.hasSTIHistoryOrSymptoms || s.hasPregnantOrLactating || s.hasEDAParasites).map((s) => (
                  <div key={s._id} className="bg-purple-950/50 border border-purple-800/60 rounded-2xl p-3 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-pink-300">{s.surveyCode}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {s.hasSTIHistoryOrSymptoms ? 'Sospecha ITS' : s.hasPregnantOrLactating ? 'Gestante/Lactante' : 'EDA Infantil'}
                      </span>
                    </div>
                    <p className="text-purple-200">
                      <strong>Ubicación:</strong> {s.barrio} {s.manzana ? `· Mz ${s.manzana}` : ''}
                    </p>
                    {s.stiSymptomsDetails && (
                      <p className="text-[11px] text-rose-200 italic bg-rose-950/40 p-2 rounded-xl">
                        "{s.stiSymptomsDetails}"
                      </p>
                    )}
                    <p className="text-[10px] text-purple-400">
                      EPS: {s.allEPSAffiliated ? 'Afiliado' : 'Sin EPS'} · Agua: {s.waterSource}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA 4: JURÍDICO, PROTECCIÓN & FAMILIA
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'JURIDICO_PROTECCION' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Gráfico: Vulnerabilidades Jurídicas */}
            <div className="lg:col-span-6 bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-400" />
                Matriz de Conflictividad & Demandas Jurídicas
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.legalVulnerabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e1052" />
                    <XAxis dataKey="category" tick={{ fill: '#d8b4fe', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fill: '#d8b4fe', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#18052e', borderColor: '#7c3aed', borderRadius: '1rem', color: '#fff' }} />
                    <Bar dataKey="total" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rutas Institucionales de Urgencia */}
            <div className="lg:col-span-6 bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Rutas de Protección Activadas
              </h3>

              <div className="space-y-3">
                <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-xs font-black text-rose-300">
                    <span>Violencia Intrafamiliar y de Género</span>
                    <span>{metrics.casosVIF} casos</span>
                  </div>
                  <p className="text-xs text-rose-200/80">
                    Requieren medidas cautelares de desalojo del agresor y protección policial inmediata con la Casa de Justicia Chiquinquirá.
                  </p>
                </div>

                <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-xs font-black text-amber-300">
                    <span>Procesos de Alimentos & Custodia</span>
                    <span>{metrics.procesosAlimentos} casos</span>
                  </div>
                  <p className="text-xs text-amber-200/80">
                    Atención prioritaria en la Mesa 1 con defensoras públicas para fijación de cuota alimentaria a menores.
                  </p>
                </div>

                <div className="bg-purple-950/30 border border-purple-800/40 p-4 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-xs font-black text-purple-300">
                    <span>Sin Documento de Identidad Vigente</span>
                    <span>{metrics.indocumentados} hogares</span>
                  </div>
                  <p className="text-xs text-purple-200/80">
                    Articulación con Registraduría Nacional para expedición de tarjetas de identidad y cédulas a población migrante o vulnerable.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA 5: EMPLEO & DESIGUALDAD SOCIAL
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'ECONOMICO_SOCIAL' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-pink-300 tracking-wider">Buscando Empleo Activo</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.buscandoEmpleo}</p>
              <p className="text-xs text-purple-300/70 mt-1">Personas en desempleo abierto</p>
            </div>

            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Jóvenes Desocupados</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.jovenesEgresadosDesocupados}</p>
              <p className="text-xs text-purple-300/70 mt-1">Bachilleres sin estudio ni trabajo</p>
            </div>

            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">Subsidios Estatales</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.recibenSubsidios}</p>
              <p className="text-xs text-purple-300/70 mt-1">Renta Ciudadana / Familias en Acción</p>
            </div>

            <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-black uppercase text-sky-300 tracking-wider">Trámites Pensionales</span>
              <p className="text-3xl font-black text-white mt-1">{metrics.tramitesPensionales}</p>
              <p className="text-xs text-purple-300/70 mt-1">Adultos mayores sin pensión contributiva</p>
            </div>
          </div>

          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white">Estrategia de Autonomía Económica — Programa 7 Senda</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Para erradicar la dependencia que perpetúa el maltrato, se vinculan las beneficiarias identificadas a los talleres productivos de la Fundación:
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
                <strong className="text-pink-300 font-bold block mb-1">Confección Textil & Moda Sostenible</strong>
                <p className="text-purple-300/80">32 cupos con máquinas de coser y convenio de maquila con empresas locales de Cartagena.</p>
              </div>
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
                <strong className="text-amber-300 font-bold block mb-1">Bolsa de Empleo Inclusivo</strong>
                <p className="text-purple-300/80">Articulación con comercios y empresas del sector Mamonal para jóvenes recién egresados.</p>
              </div>
              <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-800">
                <strong className="text-emerald-300 font-bold block mb-1">Microcréditos y Capital Semilla</strong>
                <p className="text-purple-300/80">Fondos no reembolsables para negocios de comida comunitaria, artesanías y belleza.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA 6: MATRIZ DE CASOS DE URGENCIA
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'RIESGOS_CASOS' && (
        <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Fichas con Clasificación INMEDIATA o Alerta de Riesgo Alto
              </h3>
              <p className="text-xs text-purple-300/70">
                Atención preferente y remisión expedita por los equipos psicosociales y médicos.
              </p>
            </div>
            <span className="text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full">
              {metrics.prioridadInmediata} casos críticos
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-purple-200">
              <thead className="bg-purple-950/80 text-purple-300 uppercase font-black text-[10px] tracking-wider border-b border-purple-800">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Barrio / Sector</th>
                  <th className="p-3">Familia</th>
                  <th className="p-3">Motivo de Urgencia</th>
                  <th className="p-3">Ruta Asignada</th>
                  <th className="p-3">Prioridad</th>
                  <th className="p-3">Encuestador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {surveys.filter(s => s.priority === 'INMEDIATA' || s.hasUrgentCase || s.riskLevel === 'ALTO').map((s) => (
                  <tr key={s._id} className="hover:bg-purple-900/25 transition-colors">
                    <td className="p-3 font-mono font-bold text-pink-300">{s.surveyCode}</td>
                    <td className="p-3 font-bold text-white">{s.barrio} {s.manzana ? `· Mz ${s.manzana}` : ''}</td>
                    <td className="p-3">{s.householdSize} personas ({s.minorCount} NNA)</td>
                    <td className="p-3 max-w-xs">
                      {s.urgentCaseDescription || s.observedRiskIndicators || (s.hasVIFVBG ? 'Violencia Intrafamiliar Activa' : 'Riesgo Crítico')}
                    </td>
                    <td className="p-3">
                      <span className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                        {s.immediateRouteType || 'Comisaría / IPS'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-black text-[10px] px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {s.priority}
                      </span>
                    </td>
                    <td className="p-3 text-purple-400">
                      {s.collectorName || 'E-01'}
                    </td>
                  </tr>
                ))}
                {surveys.filter(s => s.priority === 'INMEDIATA' || s.hasUrgentCase || s.riskLevel === 'ALTO').length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-purple-300/60">
                      No hay casos calificados en prioridad inmediata bajo este filtro.
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
