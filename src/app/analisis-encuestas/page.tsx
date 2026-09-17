'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Activity, ArrowUpRight, BarChart3, Building2, Calendar, CheckCircle2,
  ChevronRight, ClipboardList, FileText, HeartPulse, Home, MapPinned,
  RefreshCw, Scale, ShieldAlert, Users,
} from 'lucide-react';

type Tab = 'PANORAMA' | 'PERSONAS' | 'SALUD' | 'DERECHOS' | 'CONDICIONES' | 'JORNADA' | 'SEGUIMIENTO' | 'INFORME';

interface Survey {
  surveyCode: string;
  barrio: string;
  fieldZone?: string;
  visitDate?: string;
  createdAt?: string;
  householdSize: number;
  minorCount: number;
  elderlyCount: number;
  rooms: number;
  householdMembers?: Array<{ age: number; relationship: string; documentType: string }>;
  allDocumentsValid: boolean;
  allNNASchooled: boolean;
  hasDisabledMember: boolean;
  hasElderlyMember: boolean;
  allEPSAffiliated: boolean;
  hasPregnantOrLactating: boolean;
  vaccinesUpToDate: boolean;
  hasChronicDisease: boolean;
  dentalCarePending: boolean;
  healthcareAccessDifficulty: boolean;
  waterSource: string;
  psychologicalSupportNeeded: boolean;
  needsGynecology: boolean;
  needsGeneralMedicine: boolean;
  needsPediatrics: boolean;
  needsDental: boolean;
  needsPsychology: boolean;
  needsNutrition: boolean;
  hasSTIHistoryOrSymptoms: boolean;
  vaginalInfectionSymptoms: boolean;
  hasSexualViolenceIndicator: boolean;
  hasFamilyProcess: boolean;
  hasVIFVBG: boolean;
  hasMedidaProteccion: boolean;
  hasDebtOrProcess: boolean;
  needsPensionOrSubsidy: boolean;
  needsLegalCounseling: boolean;
  needsCivicRegistration: boolean;
  hasUrgentCase: boolean;
  housingType: string;
  hasHousingDocument: boolean;
  hasJobSeeker: boolean;
  receivesSubsidies: boolean;
  priority: 'NORMAL' | 'PRIORITARIA' | 'INMEDIATA';
  needs?: string[];
}

interface AnalyticsMetrics {
  total: number; people: number; minors: number; medical: number; legal: number; protection: number; social: number;
  immediate: number; priority: number; noEps: number; chronic: number; access: number; violence: number; family: number;
  documentation: number; employment: number; food: number; water: number; overcrowding: number; attended: number;
}

const nav: Array<{ id: Tab; label: string; icon: typeof BarChart3 }> = [
  { id: 'PANORAMA', label: 'Panorama', icon: BarChart3 },
  { id: 'PERSONAS', label: 'Personas y hogares', icon: Users },
  { id: 'SALUD', label: 'Salud', icon: HeartPulse },
  { id: 'DERECHOS', label: 'Derechos y protección', icon: Scale },
  { id: 'CONDICIONES', label: 'Condiciones de vida', icon: Home },
  { id: 'JORNADA', label: 'Atención de la jornada', icon: Activity },
  { id: 'SEGUIMIENTO', label: 'Seguimiento', icon: ShieldAlert },
  { id: 'INFORME', label: 'Informe', icon: FileText },
];

const count = (surveys: Survey[], predicate: (survey: Survey) => boolean) => surveys.filter(predicate).length;
const pct = (value: number, total: number) => total ? Math.round((value / total) * 100) : 0;
const hasNeed = (survey: Survey, need: string) => survey.needs?.includes(need) ?? false;
const needsLegalOrientation = (survey: Survey) => survey.needsLegalCounseling || hasNeed(survey, 'familia') || hasNeed(survey, 'tramites');

export default function AnalisisEncuestasPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [barrio, setBarrio] = useState('TODOS');
  const [tab, setTab] = useState<Tab>('PANORAMA');

  async function loadSurveys() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ view: 'analysis' });
      if (barrio !== 'TODOS') params.set('barrio', barrio);
      const response = await fetch(`/api/community-surveys?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible actualizar el diagnóstico.');
      setSurveys(Array.isArray(data.surveys) ? data.surveys : []);
    } catch (loadError) {
      setSurveys([]);
      setError(loadError instanceof Error ? loadError.message : 'No fue posible actualizar el diagnóstico.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSurveys(); }, [barrio]);

  const barrios = useMemo(() => Array.from(new Set(surveys.map(s => s.barrio).filter(Boolean))).sort(), [surveys]);
  const metrics = useMemo(() => {
    const total = surveys.length;
    const medical = count(surveys, s => s.needsGeneralMedicine || s.needsGynecology || s.needsPediatrics || s.needsDental || s.needsPsychology || s.needsNutrition || s.hasChronicDisease || s.dentalCarePending || s.hasSTIHistoryOrSymptoms || s.vaginalInfectionSymptoms || s.healthcareAccessDifficulty || hasNeed(s, 'salud'));
    const legal = count(surveys, needsLegalOrientation);
    const protection = count(surveys, s => s.hasVIFVBG || s.hasSexualViolenceIndicator || s.hasMedidaProteccion || s.hasUrgentCase || s.priority === 'INMEDIATA' || hasNeed(s, 'violencia'));
    const social = count(surveys, s => s.hasJobSeeker || s.waterSource !== 'ACUEDUCTO' || !s.hasHousingDocument || hasNeed(s, 'empleo') || hasNeed(s, 'vivienda'));
    return {
      total, people: surveys.reduce((sum, s) => sum + (s.householdSize || 0), 0), minors: surveys.reduce((sum, s) => sum + (s.minorCount || 0), 0),
      medical, legal, protection, social, immediate: count(surveys, s => s.priority === 'INMEDIATA'), priority: count(surveys, s => s.priority === 'PRIORITARIA'),
      noEps: count(surveys, s => !s.allEPSAffiliated), chronic: count(surveys, s => s.hasChronicDisease), access: count(surveys, s => s.healthcareAccessDifficulty),
      violence: count(surveys, s => s.hasVIFVBG || s.hasSexualViolenceIndicator || hasNeed(s, 'violencia')), family: count(surveys, s => s.hasFamilyProcess || hasNeed(s, 'familia')),
      documentation: count(surveys, s => !s.allDocumentsValid || s.needsCivicRegistration || hasNeed(s, 'documentacion') || hasNeed(s, 'tramites')), employment: count(surveys, s => s.hasJobSeeker || hasNeed(s, 'empleo')),
      food: count(surveys, s => hasNeed(s, 'subsidios') || s.needsNutrition), water: count(surveys, s => s.waterSource !== 'ACUEDUCTO'),
      overcrowding: count(surveys, s => s.rooms > 0 && (s.householdSize / s.rooms) >= 3), attended: count(surveys, s => s.needsGeneralMedicine || s.needsGynecology || s.needsPediatrics || s.needsDental || s.needsPsychology || s.needsNutrition || s.needsLegalCounseling),
    };
  }, [surveys]);

  const needs = [
    { label: 'Salud', value: metrics.medical, color: 'bg-[#8b6ce5]' },
    { label: 'Empleo e ingresos', value: metrics.employment, color: 'bg-[#e12880]' },
    { label: 'Orientación jurídica', value: metrics.legal, color: 'bg-[#e78b83]' },
    { label: 'Protección', value: metrics.protection, color: 'bg-[#f0b459]' },
    { label: 'Condiciones de vida', value: metrics.social, color: 'bg-[#63b6af]' },
  ].sort((a, b) => b.value - a.value);
  const lastUpdate = surveys[0]?.createdAt || surveys[0]?.visitDate;

  return <div className="min-h-screen bg-[#f8f8fc] text-[#20234a]">
    <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[238px_1fr]">
      <aside className="border-b border-[#e7e6f0] bg-white p-5 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2.5"><Image src="/logo.png" alt="Fundación Senda Mujer" width={120} height={64} className="h-10 w-auto object-contain" /><span className="h-7 border-l border-[#ddd9ed]" /><span className="text-[10px] font-bold leading-4 text-[#6a6386]">Diagnóstico<br />territorial</span></div>
        <nav className="mt-8 flex gap-1 overflow-x-auto lg:block lg:space-y-1" aria-label="Secciones del informe">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors lg:w-full ${tab === id ? 'bg-[#eeeafa] text-[#523a9a]' : 'text-[#67617b] hover:bg-[#f6f4fb]'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
        <div className="mt-8 hidden rounded-lg bg-[#f7eef6] p-4 lg:block"><p className="text-xs font-bold text-[#6e3f58]">Datos que se convierten en acciones</p><p className="mt-1 text-[11px] leading-5 text-[#766d7d]">Información territorial para orientar una atención más efectiva y una vida más digna.</p></div>
      </aside>

      <section className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e6f0] bg-white px-5 py-3.5 sm:px-8"><div className="text-xs font-medium text-[#77708c]"><span className="font-bold text-[#5d427e]">Navegación territorial</span><span className="mx-2 text-[#c4bfd0]">/</span>Análisis de encuestas</div><div className="flex items-center gap-2 text-xs text-[#77708c]"><Calendar className="h-3.5 w-3.5" />{lastUpdate ? `Actualizado ${new Date(lastUpdate).toLocaleDateString('es-CO')}` : 'Sin registros aún'}</div></header>
        <main className="p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#7b64a7]">Jornada cívica y médica</p><h1 className="mt-2 text-3xl font-bold tracking-normal text-[#24264e] sm:text-4xl">Diagnóstico territorial</h1><p className="mt-2 text-sm text-[#6d6880]">Arroz Barato, Derechos y Vida Digna · Caracterización social, sanitaria y de necesidades de atención.</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#6d6880]"><span className="rounded-md bg-[#f1eff8] px-2.5 py-1">{barrio === 'TODOS' ? 'Cobertura general' : barrio}</span><span className="rounded-md bg-[#f1eff8] px-2.5 py-1">Datos agregados y anonimizados</span></div></div><div className="flex flex-wrap gap-2"><select value={barrio} onChange={e => setBarrio(e.target.value)} className="rounded-lg border border-[#dedbe9] bg-white px-3 py-2.5 text-xs font-bold text-[#514b64] outline-none focus:ring-2 focus:ring-[#8b6ce5]"><option value="TODOS">Todos los territorios</option>{barrios.map(item => <option key={item}>{item}</option>)}</select><button onClick={loadSurveys} className="inline-flex items-center gap-2 rounded-lg border border-[#dedbe9] bg-white px-3 py-2.5 text-xs font-bold text-[#514b64] hover:bg-[#f8f7fb]"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />Actualizar</button><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-[#5e429d] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#4d357f]"><FileText className="h-3.5 w-3.5" />Generar informe</button></div></div>

          {error && <div className="mt-6 rounded-lg border border-[#f3c9c4] bg-[#fff5f3] p-4 text-sm text-[#a13e36]">{error}</div>}
          {loading ? <LoadingState /> : <Dashboard tab={tab} metrics={metrics} needs={needs} surveys={surveys} />}
        </main>
      </section>
    </div>
  </div>;
}

function Dashboard({ tab, metrics, needs, surveys }: { tab: Tab; metrics: AnalyticsMetrics; needs: Array<{ label: string; value: number; color: string }>; surveys: Survey[] }) {
  const total = metrics.total;
  const cards = [
    ['Hogares', metrics.total, 'Caracterizados', Building2], ['Personas', metrics.people, 'Identificadas', Users], ['Atención en salud', metrics.medical, `${pct(metrics.medical, total)}% de hogares`, HeartPulse], ['Orientación jurídica', metrics.legal, `${pct(metrics.legal, total)}% de hogares`, Scale], ['Protección', metrics.protection, `${pct(metrics.protection, total)}% de hogares`, ShieldAlert], ['Seguimiento', metrics.immediate + metrics.priority, 'Prioridad inmediata o prioritaria', ClipboardList],
  ] as const;
  if (tab === 'PANORAMA') return <div className="mt-8 space-y-6"><section className="grid grid-cols-2 gap-3 lg:grid-cols-6">{cards.map(([label, value, note, Icon]) => <MetricCard key={label} label={label} value={value} note={note} icon={Icon} />)}</section><div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><Panel title="¿Qué necesidades encontramos?" subtitle="Hogares con necesidad identificada durante la jornada"><Bars items={needs} total={total} /></Panel><Panel title="Hallazgos clave" subtitle="Lectura basada únicamente en la caracterización registrada"><div className="space-y-4"><Finding number="01" text={`La atención en salud es la necesidad más frecuente: ${metrics.medical} hogares (${pct(metrics.medical, total)}%).`} /><Finding number="02" text={`${metrics.legal} hogares requieren orientación jurídica, cívica o familiar.`} /><Finding number="03" text={`${metrics.protection} hogares presentan una situación que requiere una ruta de protección o acompañamiento.`} /></div></Panel></div><div className="grid gap-6 lg:grid-cols-2"><Panel title="Distribución territorial" subtitle="Participación por territorio, sin exponer ubicaciones de hogares"><Territory surveys={surveys} total={total} /></Panel><Panel title="Próximo paso institucional" subtitle="Acciones sugeridas a partir de los registros"><div className="grid gap-3 sm:grid-cols-2"><Action label="Jornada de salud" value={metrics.medical} /><Action label="Orientación jurídica" value={metrics.legal} /><Action label="Seguimiento de protección" value={metrics.protection} /><Action label="Gestión social" value={metrics.social} /></div></Panel></div></div>;
  if (tab === 'PERSONAS') return <Section title="¿Quiénes viven en el territorio?" subtitle="Composición agregada de personas y hogares"><Stats rows={[["Personas identificadas", metrics.people], ["Niños, niñas y adolescentes", metrics.minors], ["Hogares con personas mayores", count(surveys, s => s.hasElderlyMember || s.elderlyCount > 0)], ["Hogares con discapacidad", count(surveys, s => s.hasDisabledMember)], ["Hogares con NNA no escolarizados", count(surveys, s => !s.allNNASchooled)]]} total={total} /></Section>;
  if (tab === 'SALUD') return <Section title="Salud del territorio" subtitle="Necesidades de atención identificadas durante la jornada"><Stats rows={[["Medicina general", count(surveys, s => s.needsGeneralMedicine)], ["Ginecología", count(surveys, s => s.needsGynecology)], ["Pediatría", count(surveys, s => s.needsPediatrics)], ["Psicología", count(surveys, s => s.needsPsychology || s.psychologicalSupportNeeded)], ["Sin afiliación completa a EPS", metrics.noEps], ["Con enfermedad crónica", metrics.chronic], ["Con barreras de acceso", metrics.access]]} total={total} /></Section>;
  if (tab === 'DERECHOS') return <Section title="Derechos y protección" subtitle="Necesidades jurídicas y situaciones que requieren acompañamiento"><Stats rows={[["Orientación jurídica, cívica o familiar", metrics.legal], ["Familia y custodia", metrics.family], ["Documentación y trámites", metrics.documentation], ["Violencias y VBG", metrics.violence], ["Medidas de protección", count(surveys, s => s.hasMedidaProteccion)], ["Casos urgentes", metrics.immediate]]} total={total} /></Section>;
  if (tab === 'CONDICIONES') return <Section title="¿Cómo viven los hogares?" subtitle="Principales determinantes sociales identificados"><Stats rows={[["Búsqueda de empleo", metrics.employment], ["Necesidades alimentarias o nutricionales", metrics.food], ["Sin acceso continuo a acueducto", metrics.water], ["Hacinamiento estimado", metrics.overcrowding], ["Sin documento de vivienda", count(surveys, s => !s.hasHousingDocument)], ["Hogares sin subsidios", count(surveys, s => !s.receivesSubsidies)]]} total={total} /></Section>;
  if (tab === 'JORNADA') return <Section title="¿Qué ocurrió durante la jornada?" subtitle="Solicitudes y necesidades de atención registradas"><Stats rows={[["Hogares con atención en salud", metrics.medical], ["Hogares con orientación jurídica", metrics.legal], ["Necesidades de atención identificadas", metrics.attended], ["Rutas de protección requeridas", metrics.protection], ["Registros con prioridad inmediata", metrics.immediate]]} total={total} /></Section>;
  if (tab === 'SEGUIMIENTO') return <Section title="¿Qué requiere acción posterior?" subtitle="Vista agregada para priorizar equipos y rutas; las fichas individuales deben gestionarse en un entorno autenticado."><div className="grid gap-4 md:grid-cols-3"><PriorityCard label="Inmediata" value={metrics.immediate} tone="rose" /><PriorityCard label="Prioritaria" value={metrics.priority} tone="amber" /><PriorityCard label="Preventiva" value={count(surveys, s => s.priority === 'NORMAL')} tone="emerald" /></div></Section>;
  return <Section title="Generar informe territorial" subtitle="Una lectura ejecutiva de la jornada, lista para presentar o entregar."><div className="grid gap-4 md:grid-cols-2"><Report title="Informe ejecutivo" text="Panorama, hallazgos principales, necesidades y acciones a priorizar." /><Report title="Informe de jornada" text="Caracterización, solicitudes, rutas requeridas y próximos pasos." /><Report title="Informe técnico" text="Indicadores agregados por salud, derechos, protección y condiciones de vida." /><Report title="Resumen comunitario" text="Una versión clara para compartir hallazgos sin datos personales." /></div></Section>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <section className="rounded-xl border border-[#e7e5ee] bg-white p-5 shadow-[0_6px_20px_rgba(58,48,82,.04)]"><h2 className="text-base font-bold text-[#292a52]">{title}</h2><p className="mt-1 text-xs text-[#787289]">{subtitle}</p><div className="mt-6">{children}</div></section>; }
function MetricCard({ label, value, note, icon: Icon }: { label: string; value: number; note: string; icon: typeof Users }) { return <div className="rounded-xl border border-[#e7e5ee] bg-white p-4 shadow-[0_5px_15px_rgba(58,48,82,.035)]"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-bold text-[#67617b]">{label}</p><Icon className="h-4 w-4 text-[#8b6ce5]" /></div><p className="mt-3 text-3xl font-bold text-[#292a52]">{value}</p><p className="mt-1 text-[10px] text-[#8a8496]">{note}</p></div>; }
function Bars({ items, total }: { items: Array<{ label: string; value: number; color: string }>; total: number }) { return <div className="space-y-4">{items.map(item => <div key={item.label}><div className="mb-1.5 flex justify-between text-xs"><span className="font-bold text-[#514b64]">{item.label}</span><span className="text-[#7a7489]">{item.value} hogares · {pct(item.value, total)}%</span></div><div className="h-2 rounded-full bg-[#efedf5]"><div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct(item.value, total)}%` }} /></div></div>)}</div>; }
function Finding({ number, text }: { number: string; text: string }) { return <div className="flex gap-3 border-b border-[#eeeaf2] pb-4 last:border-0 last:pb-0"><span className="text-xs font-bold text-[#8b6ce5]">{number}</span><p className="text-sm leading-6 text-[#59536a]">{text}</p></div>; }
function Territory({ surveys, total }: { surveys: Survey[]; total: number }) { const data = Array.from(new Set(surveys.map(s => s.barrio))).map(name => ({ name, value: count(surveys, s => s.barrio === name) })).sort((a, b) => b.value - a.value); return data.length ? <Bars items={data.map((item, index) => ({ ...item, label: item.name, color: ['bg-[#8b6ce5]', 'bg-[#e12880]', 'bg-[#63b6af]', 'bg-[#f0b459]'][index % 4] }))} total={total} /> : <p className="text-sm text-[#77708c]">Aún no hay territorios registrados.</p>; }
function Action({ label, value }: { label: string; value: number }) { return <div className="rounded-lg bg-[#f7f5fb] p-4"><p className="text-2xl font-bold text-[#593f95]">{value}</p><p className="mt-1 text-xs font-bold text-[#625b71]">{label}</p></div>; }
function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <div className="mt-8"><div className="max-w-2xl"><h2 className="text-2xl font-bold text-[#292a52]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#6d6880]">{subtitle}</p></div><div className="mt-6 rounded-xl border border-[#e7e5ee] bg-white p-5 shadow-[0_6px_20px_rgba(58,48,82,.04)]">{children}</div></div>; }
function Stats({ rows, total }: { rows: Array<[string, number]>; total: number }) { return <div className="space-y-4">{rows.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><div><div className="flex justify-between gap-3 text-xs"><span className="font-bold text-[#514b64]">{label}</span><span className="text-[#77708c]">{value} hogares · {pct(value, total)}%</span></div><div className="mt-2 h-2 rounded-full bg-[#efedf5]"><div className="h-2 rounded-full bg-[#8b6ce5]" style={{ width: `${pct(value, total)}%` }} /></div></div></div>)}</div>; }
function PriorityCard({ label, value, tone }: { label: string; value: number; tone: 'rose' | 'amber' | 'emerald' }) { const styles = { rose: 'border-[#f6d1d3] bg-[#fff7f7] text-[#b44954]', amber: 'border-[#f2dfb4] bg-[#fffbf2] text-[#a9761c]', emerald: 'border-[#cbe8dc] bg-[#f5fcf8] text-[#2d8b68]' }; return <div className={`rounded-xl border p-5 ${styles[tone]}`}><p className="text-3xl font-bold">{value}</p><p className="mt-2 text-xs font-bold">Prioridad {label.toLowerCase()}</p></div>; }
function Report({ title, text }: { title: string; text: string }) { return <button onClick={() => window.print()} className="group rounded-xl border border-[#e7e5ee] p-5 text-left transition-shadow hover:shadow-[0_10px_24px_rgba(58,48,82,.08)]"><FileText className="h-5 w-5 text-[#8b6ce5]" /><h3 className="mt-6 text-base font-bold text-[#292a52]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6d6880]">{text}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#5e429d]">Preparar vista <ChevronRight className="h-3.5 w-3.5" /></span></button>; }
function LoadingState() { return <div className="mt-8 grid min-h-[380px] place-items-center rounded-xl border border-[#e7e5ee] bg-white"><div className="text-center"><RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#8b6ce5]" /><p className="mt-3 text-sm font-bold text-[#625b71]">Actualizando diagnóstico territorial...</p></div></div>; }
