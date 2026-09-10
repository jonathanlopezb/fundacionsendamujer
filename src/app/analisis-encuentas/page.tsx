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
  Activity, ArrowUpRight, ChevronRight, Sparkles, FileText,
  Search, X, Table, BookOpen, UserCheck, Phone, MapPin, Calendar, FileSpreadsheet, Trash2
} from 'lucide-react';
import { exportSurveysToExcel } from '@/lib/excelExport';

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
  visitDate?: string;
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

  /* B.1 Citas por Especialidad & Salud de la Mujer */
  needsGynecology?: boolean;
  gynecologySymptoms?: string;
  needsGeneralMedicine?: boolean;
  generalMedicineReason?: string;
  needsPediatrics?: boolean;
  pediatricsReason?: string;
  needsDental?: boolean;
  dentalReason?: string;
  needsPsychology?: boolean;
  psychologyReason?: string;
  needsNutrition?: boolean;
  nutritionReason?: string;

  hasSTIHistoryOrSymptoms?: boolean;
  stiSymptomsDetails?: string;
  lastPapSmear: string;
  familyPlanningMethod: string;
  desiresFamilyPlanningCounseling: boolean;
  vaginalInfectionSymptoms?: boolean;
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
  interestedPrograms?: string[];
  assignedPrograms?: string[];
  hasCaregiverBurnout?: boolean;
  hasSexualViolenceIndicator?: boolean;
  hasTeenPregnancy?: boolean;
  hasChildMalnutrition?: boolean;
  knowsRightsAndRoutes?: boolean;
  hasMedidaProteccion?: boolean;
  interestInTraining?: boolean;
  hasSmartphoneAccess?: boolean;
  createdAt?: string;
}

const PALETTE = ['#E12880', '#9333EA', '#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#6366F1'];

export default function AnalisisEncuestasPage() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('TODOS');
  const [activeTab, setActiveTab] = useState<
    'HOGARES' | 'INFORME_TECNICO' | 'GLOBAL' | 'DEMOGRAFIA' | 'SALUD_EPIDEMIOLOGIA' | 'JURIDICO_PROTECCION' | 'ECONOMICO_SOCIAL' | 'RIESGOS_CASOS'
  >('HOGARES');

  /* Estados de Filtros para Lista de Hogares */
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'TODAS' | 'INMEDIATA' | 'PRIORITARIA' | 'NORMAL'>('TODAS');
  const [tagFilter, setTagFilter] = useState<'TODAS' | 'MENORES' | 'GESTANTES' | 'DISCAPACIDAD' | 'MAYORES' | 'VIF' | 'SIN_EPS' | 'CRONICOS' | 'SIN_ACUEDUCTO'>('TODAS');
  const [selectedHousehold, setSelectedHousehold] = useState<SurveyData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchSurveys() {
    setLoading(true);
    setError('');
    try {
      const url = selectedBarrio === 'TODOS'
        ? '/api/community-surveys'
        : `/api/community-surveys?barrio=${encodeURIComponent(selectedBarrio)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && Array.isArray(data.surveys)) {
        setSurveys(data.surveys);
      } else {
        setSurveys([]);
        if (data.message) setError(data.message);
      }
    } catch {
      setSurveys([]);
      setError('Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSurveys();
  }, [selectedBarrio]);

  /* ── Eliminar Ficha Censal ────────────────────────────────────────────────── */
  async function handleDeleteHousehold(s: SurveyData) {
    const isConfirmed = window.confirm(
      `¿Confirmas la eliminación permanente de la ficha censal ${s.surveyCode} (${s.barrio})?\n\nEsta acción suprimirá todos los registros de los integrantes, diagnósticos y alertas asociados.`
    );
    if (!isConfirmed) return;

    setDeletingId(s._id);
    try {
      const res = await fetch(
        `/api/community-surveys?id=${encodeURIComponent(s._id)}&surveyCode=${encodeURIComponent(s.surveyCode)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'No fue posible eliminar la ficha del sistema.');
      }

      setSurveys((prev) => prev.filter((item) => item._id !== s._id && item.surveyCode !== s.surveyCode));

      if (selectedHousehold?._id === s._id || selectedHousehold?.surveyCode === s.surveyCode) {
        setSelectedHousehold(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la ficha censal.');
    } finally {
      setDeletingId(null);
    }
  }



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

    /* ── Demanda de Citas por Especialidad Médica ── */
    const citasGinecologia = surveys.filter(s => s.needsGynecology || (Array.isArray(s.needs) && s.needs.includes('ginecologia')) || s.lastPapSmear === 'MAS_3_ANOS' || s.lastPapSmear === 'NUNCA').length;
    const citasMedicinaGeneral = surveys.filter(s => s.needsGeneralMedicine || (Array.isArray(s.needs) && s.needs.includes('medicina_general')) || s.hasChronicDisease).length;
    const citasPediatria = surveys.filter(s => s.needsPediatrics || (Array.isArray(s.needs) && s.needs.includes('pediatria')) || (s.minorCount > 0 && s.hasEDAParasites)).length;
    const citasOdontologia = surveys.filter(s => s.needsDental || (Array.isArray(s.needs) && s.needs.includes('odontologia')) || s.dentalCarePending).length;
    const citasPsicologia = surveys.filter(s => s.needsPsychology || (Array.isArray(s.needs) && s.needs.includes('psicologia')) || s.psychologicalSupportNeeded || s.hasCaregiverBurnout).length;

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
      citasGinecologia,
      citasMedicinaGeneral,
      citasPediatria,
      citasOdontologia,
      citasPsicologia,
    };
  }, [surveys]);

  /* ── Barrios únicos encontrados en la base de datos ──────────────────── */
  const availableBarrios = useMemo(() => {
    const set = new Set<string>();
    surveys.forEach((s) => {
      if (s.barrio) set.add(s.barrio.trim());
    });
    return Array.from(set).sort();
  }, [surveys]);

  /* ── Filtrado Interactivo de la Lista Maestra de Hogares ─────────────── */
  const filteredHogares = useMemo(() => {
    return surveys.filter((s) => {
      // Filtro por texto de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = s.surveyCode?.toLowerCase().includes(q);
        const matchesBarrio = s.barrio?.toLowerCase().includes(q);
        const matchesManzana = s.manzana?.toLowerCase().includes(q);
        const matchesPhone = s.contactPhone?.toLowerCase().includes(q);
        const matchesLandmark = s.landmark?.toLowerCase().includes(q);
        const matchesMembers = s.householdMembers?.some((m) =>
          m.fullName?.toLowerCase().includes(q) || m.documentNumber?.toLowerCase().includes(q)
        );
        const matchesNotes = s.collectorObservations?.toLowerCase().includes(q) || s.urgentCaseDescription?.toLowerCase().includes(q);
        if (!matchesCode && !matchesBarrio && !matchesManzana && !matchesPhone && !matchesLandmark && !matchesMembers && !matchesNotes) {
          return false;
        }
      }

      // Filtro por Prioridad
      if (priorityFilter !== 'TODAS' && s.priority !== priorityFilter) {
        return false;
      }

      // Filtro por Etiquetas / Vulnerabilidades
      if (tagFilter === 'MENORES' && (s.minorCount || 0) === 0) return false;
      if (tagFilter === 'GESTANTES' && !s.hasPregnantOrLactating) return false;
      if (tagFilter === 'DISCAPACIDAD' && !s.hasDisabledMember) return false;
      if (tagFilter === 'MAYORES' && !s.hasElderlyMember && (s.elderlyCount || 0) === 0) return false;
      if (tagFilter === 'VIF' && !s.hasVIFVBG) return false;
      if (tagFilter === 'SIN_EPS' && s.allEPSAffiliated) return false;
      if (tagFilter === 'CRONICOS' && !s.hasChronicDisease) return false;
      if (tagFilter === 'SIN_ACUEDUCTO' && s.waterSource === 'ACUEDUCTO') return false;

      return true;
    });
  }, [surveys, searchQuery, priorityFilter, tagFilter]);

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
              {availableBarrios.map((b) => (
                <option key={b} value={b} className="bg-[#130324]">
                  {b}
                </option>
              ))}
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

          {/* Botón de Descarga en Microsoft Excel Real (.xls) */}
          <button
            onClick={() => exportSurveysToExcel(surveys, metrics, selectedBarrio)}
            disabled={surveys.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-50 border border-emerald-400/50"
            title="Exportar base de datos consolidada a Microsoft Excel (.xls con formato multihioja)"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-950" />
            <span>Descargar en Excel (.xls)</span>
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
          { id: 'HOGARES', label: `📋 Lista de Todos los Hogares (${surveys.length})` },
          { id: 'INFORME_TECNICO', label: '📖 Informe Cualitativo & Diagnóstico Escrito' },
          { id: 'GLOBAL', label: '🌐 Panorama Global & Prioridades' },
          { id: 'DEMOGRAFIA', label: '👥 Demografía & Hábitat' },
          { id: 'SALUD_EPIDEMIOLOGIA', label: '🩺 Salud Integral & Epidemiología' },
          { id: 'JURIDICO_PROTECCION', label: '⚖️ Derechos, VBG & Familia' },
          { id: 'ECONOMICO_SOCIAL', label: '💼 Empleo & Desigualdad' },
          { id: 'RIESGOS_CASOS', label: `🚨 Matriz Casos Urgentes (${metrics.prioridadInmediata})` },
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
          PESTAÑA: LISTA MAESTRA DE TODOS LOS HOGARES
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'HOGARES' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Cabecera de la sección con buscador y filtros */}
          <div className="bg-[#150426] border border-purple-800/60 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                  <Table className="w-5 h-5 text-pink-400" />
                  Directorio Integral de Hogares Censados
                </h3>
                <p className="text-xs text-purple-200/70 mt-1">
                  Registro individualizado de cada vivienda caracterizada en terreno con su composición familiar, perfil clínico, estado jurídico y nivel de triaje.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-purple-900/60 text-purple-200 border border-purple-700/60 px-3 py-1 rounded-full text-xs font-bold">
                  {filteredHogares.length} de {surveys.length} hogares filtrados
                </span>
                <button
                  onClick={() => exportSurveysToExcel(surveys, metrics, selectedBarrio)}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
              </div>
            </div>

            {/* Buscador en Vivo */}
            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código de ficha (CS-ARZ-001), nombre de miembro familiar, cédula, manzana, teléfono u observaciones..."
                className="w-full bg-[#0d021a] border border-purple-800/80 rounded-2xl pl-11 pr-10 py-3 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Píldoras de Filtro por Prioridad */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mr-1">Prioridad:</span>
              {[
                { id: 'TODAS', label: 'Todas las prioridades' },
                { id: 'INMEDIATA', label: '🚨 Inmediata (Riesgo Vital)', color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' },
                { id: 'PRIORITARIA', label: '⚠️ Prioritaria (Intervención)', color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' },
                { id: 'NORMAL', label: '✅ Normal (Preventiva)', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriorityFilter(p.id as any)}
                  className={`px-3 py-1 rounded-xl font-bold border transition-all cursor-pointer ${
                    priorityFilter === p.id
                      ? 'bg-pink-600 border-pink-400 text-white shadow-md'
                      : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:border-purple-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Píldoras de Filtro por Etiquetas / Vulnerabilidades */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-purple-900/40">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mr-1">Filtro Temático:</span>
              {[
                { id: 'TODAS', label: 'Todas las condiciones' },
                { id: 'MENORES', label: '👶 Con Menores (NNA)' },
                { id: 'GESTANTES', label: '🤰 Gestantes / Lactantes' },
                { id: 'DISCAPACIDAD', label: '♿ Discapacidad' },
                { id: 'MAYORES', label: '👵 Adultos Mayores' },
                { id: 'VIF', label: '🛡️ Alerta Violencia VIF' },
                { id: 'SIN_EPS', label: '❌ Sin Afiliación EPS' },
                { id: 'CRONICOS', label: '🩺 Enfermos Crónicos' },
                { id: 'SIN_ACUEDUCTO', label: '💧 Sin Red Acueducto' },
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setTagFilter(tag.id as any)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    tagFilter === tag.id
                      ? 'bg-purple-600 border-purple-400 text-white shadow'
                      : 'bg-purple-950/25 border-purple-800/40 text-purple-300 hover:text-white'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Listado de Hogares */}
          <div className="bg-[#150426] border border-purple-800/60 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-purple-200">
                <thead className="bg-[#1a0530] text-purple-300 uppercase font-black text-[10px] tracking-wider border-b border-purple-800">
                  <tr>
                    <th className="p-3.5">Ficha / Barrio</th>
                    <th className="p-3.5">Persona Referente & Miembros</th>
                    <th className="p-3.5">Hábitat & Agua</th>
                    <th className="p-3.5">Salud & Niñez</th>
                    <th className="p-3.5">Protección & Riesgo</th>
                    <th className="p-3.5">Citas Solicitadas</th>
                    <th className="p-3.5 text-center">Triaje</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/40">
                  {filteredHogares.map((s) => {
                    const primaryMember = s.householdMembers && s.householdMembers.length > 0 ? s.householdMembers[0] : null;
                    return (
                      <tr key={s._id} className="hover:bg-purple-900/20 transition-colors">
                        {/* Ficha / Barrio */}
                        <td className="p-3.5 align-top">
                          <span className="font-mono font-black text-pink-300 block text-[11px]">{s.surveyCode}</span>
                          <span className="text-white font-bold block mt-0.5">{s.barrio}</span>
                          <span className="text-[10px] text-purple-400 block">{s.manzana || 'Mz Sin N°'} {s.fieldZone ? `· ${s.fieldZone}` : ''}</span>
                          {s.contactPhone && (
                            <span className="text-[10px] text-purple-300 flex items-center gap-1 mt-1 font-mono">
                              <Phone className="w-2.5 h-2.5 text-emerald-400" /> {s.contactPhone}
                            </span>
                          )}
                        </td>

                        {/* Persona Referente & Miembros */}
                        <td className="p-3.5 align-top max-w-xs">
                          {primaryMember ? (
                            <div>
                              <strong className="text-white block font-bold text-xs">{primaryMember.fullName}</strong>
                              <span className="text-[10px] text-purple-300 block">
                                {primaryMember.relationship} · {primaryMember.age} años {primaryMember.documentNumber ? `· ${primaryMember.documentType} ${primaryMember.documentNumber}` : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-purple-400 italic">No especificado</span>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px]">
                            <span className="bg-purple-950/70 border border-purple-800 text-purple-200 px-2 py-0.5 rounded-md font-bold">
                              {s.householdSize} hab.
                            </span>
                            {s.minorCount > 0 && (
                              <span className="bg-pink-950/60 border border-pink-800 text-pink-300 px-2 py-0.5 rounded-md font-bold">
                                {s.minorCount} menores
                              </span>
                            )}
                            {(s.elderlyCount > 0 || s.hasElderlyMember) && (
                              <span className="bg-amber-950/60 border border-amber-800 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                                {s.elderlyCount || 1} 65+ años
                              </span>
                            )}
                            {s.hasDisabledMember && (
                              <span className="bg-sky-950/60 border border-sky-800 text-sky-300 px-2 py-0.5 rounded-md font-bold">
                                Discapacidad
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Hábitat & Agua */}
                        <td className="p-3.5 align-top">
                          <span className="text-white font-medium block">
                            Tenencia: <strong className="text-purple-200">{s.housingType || 'Arrendada'}</strong>
                          </span>
                          <span className="text-[10px] text-purple-300 block">
                            Título: {s.hasHousingDocument ? 'Escritura sí' : 'Sin título formal'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-1 border ${
                            s.waterSource === 'ACUEDUCTO'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                              : 'bg-sky-950/60 text-sky-300 border-sky-700'
                          }`}>
                            💧 {s.waterSource}
                          </span>
                        </td>

                        {/* Salud & Gineco/ITS */}
                        <td className="p-3.5 align-top">
                          <span className="block text-[11px]">
                            EPS: <strong className={s.allEPSAffiliated ? 'text-emerald-300' : 'text-rose-400'}>{s.allEPSAffiliated ? 'Afiliado' : 'Sin EPS'}</strong>
                          </span>
                          {s.hasChronicDisease && (
                            <span className="text-[10px] text-amber-300 block mt-0.5">
                              ⚠️ Crónico: {s.chronicDiseaseDetails?.slice(0, 30) || 'Sí'}...
                            </span>
                          )}
                          {s.hasEDAParasites && (
                            <span className="text-[10px] text-rose-300 block mt-0.5">
                              🦠 EDA/Parásitos NNA
                            </span>
                          )}
                          {s.hasPregnantOrLactating && (
                            <span className="text-[10px] text-pink-300 font-bold block mt-0.5">
                              🤰 Gestante / Lactante
                            </span>
                          )}
                          {(s.lastPapSmear === 'MAS_3_ANOS' || s.lastPapSmear === 'NUNCA') && (
                            <span className="text-[10px] text-rose-300 bg-rose-950/40 border border-rose-800/60 px-1.5 py-0.5 rounded-md inline-block mt-1">
                              Citología: {s.lastPapSmear === 'NUNCA' ? 'Nunca' : '+3 años vencida'}
                            </span>
                          )}
                          {s.hasSTIHistoryOrSymptoms && (
                            <span className="text-[10px] text-rose-300 bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded-md font-bold block mt-1">
                              Sospecha ITS
                            </span>
                          )}
                        </td>

                        {/* Protección & Riesgo */}
                        <td className="p-3.5 align-top max-w-xs">
                          {s.hasVIFVBG ? (
                            <span className="bg-rose-950/70 border border-rose-700 text-rose-200 px-2 py-0.5 rounded-md font-bold text-[10px] block">
                              🛡️ Alerta VIF Activa
                            </span>
                          ) : (
                            <span className="text-[10px] text-purple-400 block">Sin alerta de violencia</span>
                          )}
                          {s.hasFamilyProcess && (
                            <span className="text-[10px] text-amber-300 block mt-1">
                              ⚖️ Alimentos / Custodia
                            </span>
                          )}
                          {s.urgentCaseDescription && (
                            <p className="text-[10px] text-rose-200 italic mt-1 line-clamp-2 bg-rose-950/30 p-1.5 rounded-lg border border-rose-900/50">
                              "{s.urgentCaseDescription}"
                            </p>
                          )}
                        </td>

                        {/* Citas Médicas Solicitadas */}
                        <td className="p-3.5 align-top">
                          <div className="flex flex-col gap-1 text-[10px]">
                            {(s.needsGynecology || s.lastPapSmear === 'MAS_3_ANOS' || s.lastPapSmear === 'NUNCA' || (Array.isArray(s.needs) && s.needs.includes('ginecologia'))) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 w-fit" title={s.gynecologySymptoms || 'Ginecología y Citología'}>
                                🌸 Ginecología
                              </span>
                            )}
                            {(s.needsGeneralMedicine || s.hasChronicDisease || (Array.isArray(s.needs) && s.needs.includes('medicina_general'))) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 w-fit" title={s.generalMedicineReason || 'Medicina General'}>
                                🩺 Med. General
                              </span>
                            )}
                            {(s.needsPediatrics || (s.minorCount > 0 && s.hasEDAParasites) || (Array.isArray(s.needs) && s.needs.includes('pediatria'))) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 w-fit" title={s.pediatricsReason || 'Pediatría'}>
                                👶 Pediatría
                              </span>
                            )}
                            {(s.needsDental || s.dentalCarePending || (Array.isArray(s.needs) && s.needs.includes('odontologia'))) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 w-fit" title={s.dentalReason || 'Odontología'}>
                                🦷 Odontología
                              </span>
                            )}
                            {(s.needsPsychology || s.psychologicalSupportNeeded || s.hasCaregiverBurnout || (Array.isArray(s.needs) && s.needs.includes('psicologia'))) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 w-fit" title={s.psychologyReason || 'Psicología'}>
                                🧠 Psicología
                              </span>
                            )}
                            {(!s.needsGynecology && !s.needsGeneralMedicine && !s.needsPediatrics && !s.needsDental && !s.needsPsychology && s.lastPapSmear !== 'MAS_3_ANOS' && s.lastPapSmear !== 'NUNCA' && !s.hasChronicDisease && !s.dentalCarePending) && (
                              <span className="text-purple-400/60 italic text-[10px]">Triage en evento</span>
                            )}
                          </div>
                        </td>

                        {/* Triaje */}
                        <td className="p-3.5 align-top text-center">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border inline-block ${
                            s.priority === 'INMEDIATA'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                              : s.priority === 'PRIORITARIA'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          }`}>
                            {s.priority}
                          </span>
                        </td>

                        {/* Botón Acción */}
                        <td className="p-3.5 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedHousehold(s)}
                              className="bg-purple-900/60 hover:bg-pink-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl border border-purple-700 hover:border-pink-500 transition-all cursor-pointer whitespace-nowrap shadow-sm"
                            >
                              Ver Ficha
                            </button>
                            <button
                              onClick={() => handleDeleteHousehold(s)}
                              disabled={deletingId === s._id}
                              className="bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white p-1.5 rounded-xl border border-rose-800/60 hover:border-rose-500 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                              title={`Eliminar ficha ${s.surveyCode}`}
                            >
                              <Trash2 className={`w-3.5 h-3.5 ${deletingId === s._id ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredHogares.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-purple-300/70 space-y-3">
                        {surveys.length === 0 ? (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800 flex items-center justify-center mx-auto text-2xl">
                              📋
                            </div>
                            <p className="text-base font-bold text-white">No hay fichas censales registradas en la base de datos todavía.</p>
                            <p className="text-xs text-purple-300/70 max-w-md mx-auto">
                              Las encuestas que se diligencien desde el formulario en terreno se almacenarán automáticamente en MongoDB y aparecerán aquí en tiempo real.
                            </p>
                            <Link
                              href="/encuestas"
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg transition-all"
                            >
                              <span>Diligenciar Nueva Ficha en Terreno</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </>
                        ) : (
                          <>
                            <p className="text-base font-bold text-white">No se encontraron hogares con los filtros aplicados.</p>
                            <p className="text-xs">Prueba borrando el texto de búsqueda o cambiando la condición de filtro.</p>
                            <button
                              onClick={() => { setSearchQuery(''); setPriorityFilter('TODAS'); setTagFilter('TODAS'); }}
                              className="bg-purple-800 text-white px-4 py-1.5 rounded-xl text-xs font-bold mt-2 cursor-pointer"
                            >
                              Restablecer Filtros
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          PESTAÑA: INFORME CUALITATIVO & DIAGNÓSTICO ESCRITO ("LETRAS Y DEMÁS")
      ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'INFORME_TECNICO' && (
        <div className="space-y-6 animate-fadeIn text-purple-100">
          
          {/* Portada Ejecutiva del Informe Escrito */}
          <div className="bg-[#150426] border border-purple-800/60 rounded-3xl p-8 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                Dictamen Técnico Comunitario
              </span>
              <span className="text-xs text-purple-300">· Fundación Senda Mujer</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Diagnóstico Situacional & Pericial de la Comunidad de Arroz Barato
            </h3>
            <p className="text-xs text-purple-300 leading-relaxed max-w-3xl">
              Análisis descriptivo y cualitativo de la caracterización censal casa a casa realizada en la Localidad 3 (Industrial y de la Bahía) de Cartagena de Indias. Fundamento probatorio para articulación con Alcaldía Mayor, DADIS, Corvivienda y Cooperación Internacional.
            </p>
          </div>

          {/* Capítulo I: Hábitat y Saneamiento */}
          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <Home className="w-5 h-5 text-pink-400" />
              Capítulo I — Diagnóstico Territorial, Déficit Habitacional y Crisis del Agua Potable
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-purple-200/90 leading-relaxed text-justify">
              <p>
                El barrio <strong>Arroz Barato</strong>, situado en el cono sur de la Localidad Industrial y de la Bahía de Cartagena, se caracteriza por una marcada fragmentación urbana y segregación socioespacial. Los sectores de mayor precariedad identificados durante la jornada —particularmente <em>El Manantial</em>, <em>La Loma</em> y <em>La Laguna</em>— presentan un modelo de asentamiento informal consolidado sobre terrenos no aptos para el desarrollo urbano formal, carentes de redes maestras de acueducto y alcantarillado.
              </p>
              <p>
                El censo evidenció que el <strong>{metrics.totalHogares > 0 ? Math.round((metrics.sinAcueducto / metrics.totalHogares) * 100) : 0}% de los hogares censados</strong> no cuenta con conexión intradomiciliaria de agua potable de forma regular, dependiendo exclusivamente del suministro esporádico mediante carrotanques y pilones comunitarios. Esta dinámica obliga a las familias a almacenar el agua en tanques plásticos y pimpinas a la intemperie sin protocolos de desinfección ni cloración.
              </p>
              <p>
                Este factor hidrosanitario se correlaciona directamente con la alta tasa de morbilidad infantil detectada: <strong>{metrics.ninosInfeccionEda} hogares reportaron niños menores de 5 años con Enfermedad Diarreica Aguda (EDA) y parasitosis recurrente</strong>, constituyendo un foco infeccioso continuo que frena el desarrollo pondoestatural de la primera infancia.
              </p>
              <p>
                En materia de tenencia de la vivienda, <strong>{metrics.sinTituloVivienda} de las familias caracterizadas no poseen escritura pública ni título traslaticio de dominio</strong>, manteniéndose en condición de posesión quieta o tenencia familiar precaria. Este escenario perpetúa el riesgo de desalojo forzoso y bloquea el acceso a subsidios distritales de mejoramiento de vivienda básica.
              </p>
            </div>
          </div>

          {/* Capítulo II: Epidemiología y Ginecología */}
          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
              Capítulo II — Perfil Epidemiológico Comunitario, Rezago Ginecológico e ITS
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-purple-200/90 leading-relaxed text-justify">
              <p>
                El tamizaje clínico arrojó una preocupante barrera de acceso estructural a los servicios de salud preventiva. En la esfera de salud sexual y reproductiva de las mujeres del barrio, se encontró que <strong>{metrics.citologiaCritica} mujeres registran su citología cervicouterina vencida por más de tres años o afirman no habérsela practicado nunca en su vida</strong>. Este indicador sitúa a la población femenina de Arroz Barato en un rango de vulnerabilidad máxima frente al carcinoma invasor de cuello uterino.
              </p>
              <p>
                Asimismo, se registraron <strong>{metrics.sospechaITS} hogares con síntomas evidentes o antecedentes de Infecciones de Transmisión Sexual (ITS)</strong> (secreciones mucopurulentas, úlceras y dolor pélvico no tratado), sin que exista un esquema de tratamiento sindrómico administrado por las Entidades Promotoras de Salud (EPS). Las barreras manifestadas incluyen la lejanía de los centros asistenciales de segundo nivel, la escasez de citas especializadas y el estigma social.
              </p>
              <p>
                En cuanto a la salud materna, se identificaron <strong>{metrics.gestantesLactantes} mujeres en estado de gestación o lactancia</strong>, detectándose casos críticos de gestantes sin control prenatal regular durante el segundo y tercer trimestre. Esto exige la entrega inmediata de micronutrientes (ácido fólico, carbonato de calcio y sulfato ferroso) y la activación de la ruta de urgencia obstétrica con la red distrital del DADIS.
              </p>
              <p>
                En la población adulta, predominan las <strong>enfermedades crónicas no transmisibles ({metrics.conEnfermedadCronica} casos)</strong>, principalmente hipertensión arterial no controlada y diabetes mellitus tipo 2, agravadas por la interrupción en el suministro de fármacos antihipertensivos e hipoglicemiantes.
              </p>
            </div>
          </div>

          {/* Capítulo III: Violencia de Género y Protección */}
          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <Scale className="w-5 h-5 text-purple-400" />
              Capítulo III — Criminología Social, Violencia Basada en Género (VBG) y Protección Familiar
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-purple-200/90 leading-relaxed text-justify">
              <p>
                En el marco de la <strong>Ley 1257 de 2008</strong> y los protocolos del Sistema Operativo Social Caribe Seguro, el censo identificó <strong>{metrics.casosVIF} hogares bajo situaciones activas de Violencia Intrafamiliar y Violencia Basada en Género (VIF/VBG)</strong>. La tipología recurrente abarca agresiones físicas reiteradas, violencia verbal sistemática, aislamiento coercitivo y violencia económica extrema.
              </p>
              <p>
                Un hallazgo neurálgico radica en la <em>cifra negra</em> o subregistro de denuncias: la mayoría de las víctimas cohabitan en el mismo perímetro con el agresor o dependen financieramente de este para la subsistencia de sus hijos menores, lo que inhibe la instauración de denuncias penales en Fiscalía o comisarías por fundado temor a represalias letales.
              </p>
              <p>
                Para los <strong>{metrics.prioridadInmediata} casos tipificados bajo triaje INMEDIATO</strong>, la Fundación Senda Mujer activó el protocolo de emergencia con la Patrulla Púrpura de la Policía Metropolitana y las defensoras públicas de la Casa de Justicia Chiquinquirá, garantizando solicitud de órdenes de alejamiento, medidas de desalojo del victimario y valoración para cupos en la Red de Casas de Refugio.
              </p>
              <p>
                En el ámbito de la niñez y la familia, se detectaron <strong>{metrics.procesosAlimentos} casos de inasistencia alimentaria</strong> y disputas de custodia sin resolución legal, dejando a decenas de menores en estado de indefensión material y sin cuota alimentaria garantizada.
              </p>
            </div>
          </div>

          {/* Capítulo IV: Plan Interinstitucional */}
          <div className="bg-[#150426] border border-purple-800/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Capítulo IV — Matriz de Compromisos y Hoja de Ruta Interinstitucional
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-purple-200">
              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-pink-300 font-bold text-sm block">1. Mesa de Salud Sexual y Niñez (DADIS & ESE Cartagena de Indias)</strong>
                <p>
                  Despliegue de un equipo móvil extramural para realizar 200 tomas citológicas, vacunación PAI casa a casa, desparasitación masiva infantil con albendazol y suministro de métodos anticonceptivos de larga duración (implantes subdérmicos).
                </p>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-amber-300 font-bold text-sm block">2. Protección Inmediata a Mujeres (Comisarías & Policía Nacional)</strong>
                <p>
                  Instalación de la Mesa Territorial de Género con asignación de medidas de protección urgentes a los casos de VBG identificados, patrullajes preventivos y articulación con la Fiscalía Seccional Bolívar para acelerar órdenes de captura.
                </p>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-emerald-300 font-bold text-sm block">3. Titulación & Aguas de Cartagena (Corvivienda & Alcaldía)</strong>
                <p>
                  Inclusión prioritaria de los sectores El Manantial y La Loma en el plan maestro de saneamiento y titulación predial masiva bajo el Decreto 0971 de 2025, garantizando acometidas comunitarias de agua segura.
                </p>
              </div>

              <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-800 space-y-2">
                <strong className="text-sky-300 font-bold text-sm block">4. Autonomía Económica Senda Mujer</strong>
                <p>
                  Vinculación de las 45 mujeres cabeza de hogar en pobreza extrema a los talleres de confección textil, marroquinería y emprendimiento de la Fundación Senda Mujer, rompiendo la dependencia económica causante de violencia.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}



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

      {/* ─────────────────────────────────────────────────────────────────
          MODAL: FICHA TÉCNICA DETALLADA DE HOGAR (CENSO FAMILIAR)
      ───────────────────────────────────────────────────────────────── */}
      {selectedHousehold && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#130324] border border-purple-600/80 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Cabecera del Modal */}
            <div className="bg-[#1c0634] p-5 border-b border-purple-800/80 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-black text-pink-300 text-sm bg-pink-500/10 border border-pink-500/30 px-2.5 py-0.5 rounded-lg">
                    {selectedHousehold.surveyCode}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    selectedHousehold.priority === 'INMEDIATA'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/60'
                      : selectedHousehold.priority === 'PRIORITARIA'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                  }`}>
                    Triaje: {selectedHousehold.priority}
                  </span>
                  <span className="text-xs text-purple-300">
                    Riesgo: <strong className="text-white">{selectedHousehold.riskLevel}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Ficha Familiar Integral · {selectedHousehold.barrio} {selectedHousehold.manzana ? `· ${selectedHousehold.manzana}` : ''}
                </h3>
              </div>

              <button
                onClick={() => setSelectedHousehold(null)}
                className="text-purple-400 hover:text-white bg-purple-950/60 hover:bg-purple-900 p-2 rounded-2xl border border-purple-800 transition-colors"
                title="Cerrar ficha"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con Scroll de la Ficha */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-purple-200">
              
              {/* Bloque 1: Localización & Contacto */}
              <div className="bg-[#18052e] border border-purple-800/60 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-pink-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  1. Localización, Entorno & Referencia de Contacto
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Barrio & Zona</span>
                    <p className="text-white font-bold">{selectedHousehold.barrio} {selectedHousehold.fieldZone ? `· ${selectedHousehold.fieldZone}` : ''}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Manzana / Sector</span>
                    <p className="text-white font-bold">{selectedHousehold.manzana || 'No registrada'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Teléfono de Enlace</span>
                    <p className="text-emerald-300 font-mono font-bold">{selectedHousehold.contactPhone || 'No reportado'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Punto de Referencia / Dirección</span>
                    <p className="text-white">{selectedHousehold.landmark || 'Sin punto de referencia exacto'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Encuestador Responsable</span>
                    <p className="text-white">{selectedHousehold.collectorName || 'Equipo Territorio'} ({selectedHousehold.collectorCode || 'E-01'})</p>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Composición Familiar e Integrantes */}
              <div className="bg-[#18052e] border border-purple-800/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-purple-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    2. Composición Familiar & Censo Nominal de Miembros
                  </h4>
                  <span className="text-[10px] bg-purple-900/60 px-2.5 py-0.5 rounded-full font-bold text-purple-200">
                    {selectedHousehold.householdSize} personas ({selectedHousehold.minorCount} NNA)
                  </span>
                </div>

                {selectedHousehold.householdMembers && selectedHousehold.householdMembers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-purple-950/70 text-purple-400 uppercase text-[9px] font-black border-b border-purple-800">
                        <tr>
                          <th className="p-2">Nombre Completo</th>
                          <th className="p-2">Parentesco</th>
                          <th className="p-2">Edad</th>
                          <th className="p-2">Documento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/40">
                        {selectedHousehold.householdMembers.map((m, idx) => (
                          <tr key={idx} className="hover:bg-purple-900/20">
                            <td className="p-2 font-bold text-white">{m.fullName}</td>
                            <td className="p-2 text-purple-300">{m.relationship}</td>
                            <td className="p-2 font-mono">{m.age} años</td>
                            <td className="p-2 font-mono text-purple-300">
                              {m.documentType} {m.documentNumber || 'Sin número'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-purple-400 italic">No se diligenció la lista nominal individual de este hogar.</p>
                )}

                <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-purple-900/40 text-[11px]">
                  <div>
                    <span className="text-purple-400 font-bold">Documentos al día: </span>
                    <span className={selectedHousehold.allDocumentsValid ? 'text-emerald-300' : 'text-rose-400 font-bold'}>
                      {selectedHousehold.allDocumentsValid ? 'Sí' : `No (${selectedHousehold.documentsIssue || 'Indocumentados'})`}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-bold">Escolarización NNA: </span>
                    <span className={selectedHousehold.allNNASchooled ? 'text-emerald-300' : 'text-rose-400 font-bold'}>
                      {selectedHousehold.allNNASchooled ? 'Todos escolarizados' : `Deserción (${selectedHousehold.schoolDropoutReason || 'Sin cupo'})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloque 3: Diagnóstico Habitacional y Agua */}
              <div className="bg-[#18052e] border border-purple-800/60 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-sky-300 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-sky-400" />
                  3. Hábitat, Tenencia y Acceso al Agua Potable
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Régimen Tenencia</span>
                    <p className="text-white font-bold">{selectedHousehold.housingType || 'Arrendada'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Título de Propiedad</span>
                    <p className={selectedHousehold.hasHousingDocument ? 'text-emerald-300 font-bold' : 'text-amber-400 font-bold'}>
                      {selectedHousehold.hasHousingDocument ? 'Posee Escritura' : 'Sin Escritura / Posesión'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Fuente de Agua</span>
                    <p className={selectedHousehold.waterSource === 'ACUEDUCTO' ? 'text-emerald-300 font-bold' : 'text-sky-300 font-bold'}>
                      {selectedHousehold.waterSource}
                    </p>
                  </div>
                  <div className="sm:col-span-3 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/60">
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Condiciones de Hacinamiento</span>
                    <p className="text-purple-200 mt-0.5">
                      {selectedHousehold.rooms || 1} habitaciones para {selectedHousehold.householdSize} personas. {selectedHousehold.overcrowdingNotes || ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque 4: Salud Integral, Ginecológica e ITS */}
              <div className="bg-[#18052e] border border-purple-800/60 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-emerald-300 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  4. Perfil Epidemiológico, Ginecológico y Salud Sexual
                </h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Aseguramiento EPS</span>
                    <p className={selectedHousehold.allEPSAffiliated ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>
                      {selectedHousehold.allEPSAffiliated ? `Afiliado (${selectedHousehold.epsRegime || 'Subsidiado'})` : 'Sin Afiliación'}
                    </p>
                    {selectedHousehold.nonAffiliatedReason && (
                      <span className="text-[10px] text-rose-300 italic">{selectedHousehold.nonAffiliatedReason}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Enfermedades Crónicas</span>
                    <p className={selectedHousehold.hasChronicDisease ? 'text-amber-300 font-bold' : 'text-purple-300'}>
                      {selectedHousehold.chronicDiseaseDetails || (selectedHousehold.hasChronicDisease ? 'Sí presenta' : 'Ninguna')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">EDA Infantil / Parásitos</span>
                    <p className={selectedHousehold.hasEDAParasites ? 'text-rose-400 font-bold' : 'text-purple-300'}>
                      {selectedHousehold.hasEDAParasites ? `Sí: ${selectedHousehold.edaDetails || 'Infección activa'}` : 'Sin reporte'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Citología de Cuello Uterino</span>
                    <p className={selectedHousehold.lastPapSmear === 'MAS_3_ANOS' || selectedHousehold.lastPapSmear === 'NUNCA' ? 'text-rose-400 font-bold' : 'text-emerald-300'}>
                      {selectedHousehold.lastPapSmear === 'MAS_3_ANOS' ? '+3 años vencida' : selectedHousehold.lastPapSmear === 'NUNCA' ? 'Nunca realizada' : selectedHousehold.lastPapSmear}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Sospecha / Síntomas ITS</span>
                    <p className={selectedHousehold.hasSTIHistoryOrSymptoms ? 'text-rose-400 font-bold' : 'text-purple-300'}>
                      {selectedHousehold.hasSTIHistoryOrSymptoms ? `Alerta ITS: ${selectedHousehold.stiSymptomsDetails || 'Sintomática'}` : 'Sin sospecha'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Planificación Familiar</span>
                    <p className="text-purple-200">
                      Método: {selectedHousehold.familyPlanningMethod} {selectedHousehold.desiresFamilyPlanningCounseling ? '· Desea asesoría' : ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Gestante / Lactante</span>
                    <p className={selectedHousehold.hasPregnantOrLactating ? 'text-pink-300 font-bold' : 'text-purple-300'}>
                      {selectedHousehold.hasPregnantOrLactating ? `Sí (${selectedHousehold.prenatalCareStatus || 'En proceso'})` : 'No'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Autoexamen Mama</span>
                    <p className={selectedHousehold.breastSelfExamTrained ? 'text-emerald-300' : 'text-amber-400 font-bold'}>
                      {selectedHousehold.breastSelfExamTrained ? 'Capacitada' : 'Desconoce la técnica'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Apoyo Psicosocial</span>
                    <p className={selectedHousehold.psychologicalSupportNeeded ? 'text-pink-300 font-bold' : 'text-purple-300'}>
                      {selectedHousehold.psychologicalSupportNeeded ? `Requerido: ${selectedHousehold.psychologicalSupportWho || 'Familiar'}` : 'No solicitado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque 5: Jurídico, VBG y Protección */}
              <div className="bg-[#18052e] border border-purple-800/60 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  5. Protección de Derechos, Violencia VBG & Situación Familiar
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-900/60">
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Violencia Intrafamiliar (VIF/VBG)</span>
                    <p className={selectedHousehold.hasVIFVBG ? 'text-rose-300 font-bold mt-1' : 'text-purple-300 mt-1'}>
                      {selectedHousehold.hasVIFVBG ? `Alerta Activa (${selectedHousehold.vifProcessStatus || 'Sin medida de protección previa'})` : 'Sin antecedentes de violencia reportados'}
                    </p>
                  </div>

                  <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-900/60">
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Proceso de Alimentos / Custodia</span>
                    <p className={selectedHousehold.hasFamilyProcess ? 'text-amber-300 font-bold mt-1' : 'text-purple-300 mt-1'}>
                      {selectedHousehold.familyProcessDetails || (selectedHousehold.hasFamilyProcess ? 'Inasistencia alimentaria pendiente' : 'Sin trámite judicial')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Sustento / Fuente de Ingresos</span>
                    <p className="text-white font-medium">{selectedHousehold.incomeSource || 'Economía popular e informal'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-purple-400 block uppercase font-bold">Ruta Inmediata Activada</span>
                    <p className="text-amber-300 font-bold">{selectedHousehold.immediateRouteType || 'Atención en Jornada Comunitaria'}</p>
                  </div>
                </div>
              </div>

              {/* Bloque 6: Observaciones de Campo */}
              <div className="bg-[#18052e] border border-purple-800/60 rounded-2xl p-4 space-y-2">
                <h4 className="font-black text-sm text-amber-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  6. Observaciones de Campo del Encuestador
                </h4>
                <p className="text-xs text-purple-200/90 leading-relaxed italic bg-purple-950/50 p-3 rounded-xl border border-purple-900/60">
                  &quot;{selectedHousehold.collectorObservations || selectedHousehold.urgentCaseDescription || 'Ficha validada sin novedades adicionales.'}&quot;
                </p>
              </div>

              {/* Bloque 7: Citas Médicas Especializadas Solicitadas */}
              <div className="bg-[#18052e] border border-pink-800/50 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-pink-300 flex items-center gap-2">
                  <span className="text-base">🩺</span>
                  7. Citas Médicas Especializadas Solicitadas & Motivo de Consulta
                </h4>
                <p className="text-[10px] text-purple-300/70">
                  Especialidades requeridas por el hogar para la jornada de salud comunitaria, con sus respectivos motivos o síntomas informados:
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(selectedHousehold.needsGynecology || selectedHousehold.lastPapSmear === 'MAS_3_ANOS' || selectedHousehold.lastPapSmear === 'NUNCA') && (
                    <div className="bg-pink-950/30 border border-pink-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🌸</span>
                        <span className="text-xs font-black text-pink-200">Ginecología / Citología</span>
                        <span className="text-[9px] bg-pink-500/30 text-pink-200 px-1.5 py-0.5 rounded font-bold ml-auto">Requerida</span>
                      </div>
                      <p className="text-[11px] text-purple-200 mt-1.5">
                        {selectedHousehold.gynecologySymptoms || (selectedHousehold.lastPapSmear === 'MAS_3_ANOS' ? 'Tamizaje cervical urgente: citología vencida hace más de 3 años' : selectedHousehold.lastPapSmear === 'NUNCA' ? 'Primera citología: nunca se ha realizado el examen' : 'Consulta ginecológica general preventiva')}
                      </p>
                    </div>
                  )}

                  {(selectedHousehold.needsGeneralMedicine || selectedHousehold.hasChronicDisease) && (
                    <div className="bg-purple-950/40 border border-purple-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🩺</span>
                        <span className="text-xs font-black text-purple-200">Medicina General</span>
                        <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded font-bold ml-auto">Requerida</span>
                      </div>
                      <p className="text-[11px] text-purple-200 mt-1.5">
                        {selectedHousehold.generalMedicineReason || selectedHousehold.chronicDiseaseDetails || 'Revisión y control médico preventivo'}
                      </p>
                    </div>
                  )}

                  {(selectedHousehold.needsPediatrics || (selectedHousehold.minorCount > 0 && selectedHousehold.hasEDAParasites)) && (
                    <div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">👶</span>
                        <span className="text-xs font-black text-amber-200">Pediatría</span>
                        <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-bold ml-auto">Requerida</span>
                      </div>
                      <p className="text-[11px] text-amber-100 mt-1.5">
                        {selectedHousehold.pediatricsReason || selectedHousehold.edaDetails || `Control de crecimiento y desarrollo (${selectedHousehold.minorCount} menor${selectedHousehold.minorCount !== 1 ? 'es' : ''} en el hogar)`}
                      </p>
                    </div>
                  )}

                  {(selectedHousehold.needsDental || selectedHousehold.dentalCarePending) && (
                    <div className="bg-cyan-950/30 border border-cyan-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🦷</span>
                        <span className="text-xs font-black text-cyan-200">Odontología</span>
                        <span className="text-[9px] bg-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded font-bold ml-auto">Requerida</span>
                      </div>
                      <p className="text-[11px] text-cyan-100 mt-1.5">
                        {selectedHousehold.dentalReason || 'Atención en salud oral y profilaxis comunitaria'}
                      </p>
                    </div>
                  )}

                  {(selectedHousehold.needsPsychology || selectedHousehold.psychologicalSupportNeeded || selectedHousehold.hasCaregiverBurnout) && (
                    <div className="bg-sky-950/30 border border-sky-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🧠</span>
                        <span className="text-xs font-black text-sky-200">Psicología & Apoyo Emocional</span>
                        <span className="text-[9px] bg-sky-500/30 text-sky-200 px-1.5 py-0.5 rounded font-bold ml-auto">Requerida</span>
                      </div>
                      <p className="text-[11px] text-sky-100 mt-1.5">
                        {selectedHousehold.psychologyReason || (selectedHousehold.hasCaregiverBurnout ? 'Sobrecarga extrema en labores de cuidado no remunerado' : 'Acompañamiento psicosocial')}
                      </p>
                    </div>
                  )}

                  {selectedHousehold.needsNutrition && (
                    <div className="bg-emerald-950/30 border border-emerald-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🥗</span>
                        <span className="text-xs font-black text-emerald-200">Nutrición & Dietética</span>
                        <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-bold ml-auto">Requerida</span>
                      </div>
                      <p className="text-[11px] text-emerald-100 mt-1.5">
                        {selectedHousehold.nutritionReason || 'Evaluación de seguridad alimentaria y estado nutricional'}
                      </p>
                    </div>
                  )}

                  {!selectedHousehold.needsGynecology && !selectedHousehold.needsGeneralMedicine && !selectedHousehold.needsPediatrics && !selectedHousehold.needsDental && !selectedHousehold.needsPsychology && !selectedHousehold.needsNutrition && selectedHousehold.lastPapSmear !== 'MAS_3_ANOS' && selectedHousehold.lastPapSmear !== 'NUNCA' && !selectedHousehold.hasChronicDisease && !selectedHousehold.dentalCarePending && !selectedHousehold.psychologicalSupportNeeded && (
                    <div className="sm:col-span-2 text-center py-4 bg-purple-950/30 rounded-xl border border-purple-900/50">
                      <p className="text-xs text-purple-300/80">No se registraron solicitudes específicas de citas previas. Se realizará triaje preventivo al ingreso de la jornada.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Pie del Modal */}
            <div className="bg-[#1c0634] p-4 border-t border-purple-800/80 flex items-center justify-between gap-4">
              <span className="text-[10px] text-purple-400">
                Fundación Senda Mujer · Registro confidencial Ley 1581 de 2012
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteHousehold(selectedHousehold)}
                  disabled={deletingId === selectedHousehold._id}
                  className="bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-rose-800/80 hover:border-rose-500 shadow disabled:opacity-50"
                  title="Eliminar permanentemente esta ficha del sistema"
                >
                  <Trash2 className={`w-3.5 h-3.5 ${deletingId === selectedHousehold._id ? 'animate-spin' : ''}`} />
                  <span>Eliminar Ficha</span>
                </button>
                <button
                  onClick={() => exportSurveysToExcel([selectedHousehold], metrics, selectedHousehold.barrio)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Exportar este Hogar a Excel</span>
                </button>
                <button
                  onClick={() => setSelectedHousehold(null)}
                  className="bg-purple-900/60 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
