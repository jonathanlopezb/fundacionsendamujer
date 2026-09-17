'use client';

import { FormEvent, useState } from 'react';
import { KeyRound, Loader2, LockKeyhole, X } from 'lucide-react';

export default function SurveyAnalysisAccess() {
  const [open, setOpen] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/survey-analysis/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ accessKey }),
      });
      const result = await response.json();
      setAccessKey('');

      if (!response.ok) {
        setError(result.message || 'No fue posible validar la llave.');
        return;
      }

      window.location.assign('/analisis-encuentas/privado');
    } catch {
      setError('No fue posible conectar con el acceso privado.');
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-900 shadow-sm transition hover:border-violet-400 hover:bg-violet-50">
      <KeyRound className="h-4 w-4" /> Acceso privado
    </button>
    {open && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="analysis-access-title">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-violet-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-800"><LockKeyhole className="h-5 w-5" /></div>
          <button type="button" onClick={() => { setOpen(false); setError(''); setAccessKey(''); }} className="rounded-md p-1 text-slate-500 hover:bg-slate-100" aria-label="Cerrar"><X className="h-5 w-5" /></button>
        </div>
        <h2 id="analysis-access-title" className="mt-5 text-xl font-bold tracking-normal text-slate-950">Fichas protegidas</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Acceso restringido a información identificable y seguimiento operativo.</p>
        <label className="mt-5 block text-sm font-semibold text-slate-800" htmlFor="analysis-access-key">Llave de acceso</label>
        <input id="analysis-access-key" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} type="password" autoComplete="current-password" required className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none ring-violet-500 focus:ring-2" />
        {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}
        <button disabled={submitting} type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-900 disabled:cursor-wait disabled:opacity-70">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />} Ingresar de forma segura
        </button>
      </form>
    </div>}
  </>;
}
