'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, LogOut, Phone, ShieldAlert, Users } from 'lucide-react';

type Survey = {
  _id: string; surveyCode: string; barrio: string; fieldZone?: string; visitDate?: string; contactPhone?: string;
  householdSize?: number; minorCount?: number; priority?: 'NORMAL' | 'PRIORITARIA' | 'INMEDIATA'; needs?: string[];
  householdMembers?: { fullName?: string; age?: number; relationship?: string; documentType?: string; documentNumber?: string }[];
  authorizedRecontact?: boolean; activateImmediateRoute?: boolean; collectorObservations?: string;
};

const priorityStyle = { INMEDIATA: 'bg-rose-100 text-rose-800', PRIORITARIA: 'bg-amber-100 text-amber-800', NORMAL: 'bg-emerald-100 text-emerald-800' };
const priorityLabel = { INMEDIATA: 'Inmediata', PRIORITARIA: 'Prioritaria', NORMAL: 'Normal' };

export default function PrivateSurveyWorkspace() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/community-surveys?view=private', { credentials: 'same-origin' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'No fue posible cargar las fichas.');
        setSurveys(result.surveys || []);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedSurvey = useMemo(() => surveys.find((survey) => survey._id === selected), [selected, surveys]);

  async function logout() {
    await fetch('/api/survey-analysis/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.assign('/analisis-encuentas');
  }

  return <main className="min-h-screen bg-[#f7f7fb] px-4 py-7 text-slate-900 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">Datos sensibles / acceso temporal</p><h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">Fichas protegidas</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Consulta operativa para contacto, seguimiento y activación de rutas. No comparta ni exporte información identificable sin la autorización aplicable.</p></div>
        <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"><LogOut className="h-4 w-4" /> Cerrar acceso</button>
      </header>
      {loading ? <div className="flex min-h-[360px] items-center justify-center gap-3 text-sm text-slate-600"><Loader2 className="h-5 w-5 animate-spin text-violet-700" /> Cargando fichas autorizadas...</div> : error ? <p className="mt-8 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p> : <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-950">Registro de hogares</h2><p className="mt-1 text-xs text-slate-500">{surveys.length} fichas disponibles</p></div><ShieldAlert className="h-5 w-5 text-violet-700" /></div>
          <div className="divide-y divide-slate-100">{surveys.map((survey) => <button key={survey._id} onClick={() => setSelected(selected === survey._id ? null : survey._id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 py-4 text-left transition hover:bg-violet-50/45">
            <span><span className="block text-sm font-bold text-slate-900">{survey.surveyCode}</span><span className="mt-1 block text-xs text-slate-500">{survey.barrio}{survey.fieldZone ? ` · ${survey.fieldZone}` : ''}</span></span>
            <span className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityStyle[survey.priority || 'NORMAL']}`}>{priorityLabel[survey.priority || 'NORMAL']}</span><ChevronDown className={`h-4 w-4 text-slate-400 transition ${selected === survey._id ? 'rotate-180' : ''}`} /></span>
          </button>)}{surveys.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">Aún no hay fichas registradas.</p>}</div>
        </section>
        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">{selectedSurvey ? <>
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-700">Ficha seleccionada</p><h2 className="mt-2 text-lg font-bold text-slate-950">{selectedSurvey.surveyCode}</h2>
          <div className="mt-5 space-y-4 text-sm"><p><span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Contacto</span><span className="mt-1 inline-flex items-center gap-2 font-semibold text-slate-900"><Phone className="h-4 w-4 text-violet-700" />{selectedSurvey.contactPhone || 'No registrado'}</span></p><p><span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Hogar</span><span className="mt-1 inline-flex items-center gap-2 text-slate-800"><Users className="h-4 w-4 text-violet-700" />{selectedSurvey.householdSize || 0} personas, {selectedSurvey.minorCount || 0} menores</span></p><p><span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Necesidades</span><span className="mt-1 block leading-6 text-slate-800">{selectedSurvey.needs?.length ? selectedSurvey.needs.join(', ') : 'Sin necesidades registradas'}</span></p>{selectedSurvey.authorizedRecontact && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">Recontacto autorizado</p>}</div>
          <details className="mt-5 border-t border-slate-100 pt-4"><summary className="cursor-pointer text-sm font-bold text-violet-800">Ver integrantes del hogar</summary><div className="mt-3 space-y-2">{selectedSurvey.householdMembers?.map((member, index) => <p key={`${member.documentNumber}-${index}`} className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-700"><b className="text-slate-900">{member.fullName || 'Sin nombre'}</b><br />{member.relationship || 'Integrante'} · {member.age ?? 'Sin edad'} años<br />{member.documentType || 'Documento'}: {member.documentNumber || 'No registrado'}</p>)}</div></details>
        </> : <div className="flex min-h-[260px] items-center justify-center text-center text-sm leading-6 text-slate-500">Selecciona una ficha para ver la información necesaria para la atención y el seguimiento.</div>}</aside>
      </div>}
    </div>
  </main>;
}
