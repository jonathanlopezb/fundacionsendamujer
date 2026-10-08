'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCrmAuth } from '@/lib/crm/client';
import {
  ArrowLeft,
  FileHeart,
  User,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  FileText,
  Send,
  Lock,
  X,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

const CASE_STEPS = [
  { id: 'NEW', label: '1. Nuevo' },
  { id: 'ASSESSMENT', label: '2. Valoración' },
  { id: 'PLAN', label: '3. Plan' },
  { id: 'FOLLOW_UP', label: '4. Seguimiento' },
  { id: 'REFERRAL', label: '5. Remisión' },
  { id: 'CLOSED', label: '6. Cerrado' },
];

export default function CrmCasoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, can } = useCrmAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [noteKind, setNoteKind] = useState('SESSION_NOTE');
  const [noteBody, setNoteBody] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const [closureReason, setClosureReason] = useState('');
  const [outcome, setOutcome] = useState('');
  const [savingClose, setSavingClose] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchCaso = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/cases/${params.id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error al cargar caso:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCaso();
    }
  }, [params.id]);

  const handleStepChange = async (targetStatus: string) => {
    if (targetStatus === 'CLOSED') {
      setCloseModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/crm/cases/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.ok) {
        fetchCaso();
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;

    try {
      setSavingNote(true);
      const res = await fetch(`/api/crm/cases/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: noteKind, body: noteBody }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Error al guardar nota');
      }

      setNoteBody('');
      setNoteModalOpen(false);
      fetchCaso();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  const handleCloseCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closureReason.trim() || !outcome.trim()) return;

    try {
      setSavingClose(true);
      const res = await fetch(`/api/crm/cases/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CLOSED',
          closureReason,
          outcome,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Error al cerrar caso');
      }

      setCloseModalOpen(false);
      fetchCaso();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingClose(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-900 rounded w-32" />
        <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-96 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  const caseDoc = data?.case;
  const person = data?.person;
  const notes = data?.notes || [];

  if (!caseDoc) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <p>No se encontró el caso solicitado.</p>
        <Link href="/crm/casos" className="text-rose-400 underline mt-2 inline-block">
          Volver a casos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/crm/casos"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Expedientes</span>
        </Link>
      </div>

      {/* Header Case Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-rose-400 px-2.5 py-0.5 bg-rose-500/10 rounded-lg border border-rose-500/20">
                {caseDoc.caseNumber}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 font-semibold border border-slate-700">
                {caseDoc.type}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/80 text-red-300 font-bold border border-red-800/60">
                Prioridad: {caseDoc.priority}
              </span>
            </div>

            <h1 className="text-base font-bold text-white mt-2 flex items-center gap-2">
              <span>Titular:</span>
              {person ? (
                <Link
                  href={`/crm/personas/${person._id}`}
                  className="text-rose-300 hover:text-rose-200 underline"
                >
                  {person.protectedIdentity ? person.pseudonym || 'Identidad Protegida' : `${person.firstName} ${person.lastName}`} ({person.code})
                </Link>
              ) : (
                'Persona no vinculada'
              )}
            </h1>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{caseDoc.openingReason}</p>
          </div>

          <div className="flex flex-col gap-2 self-start">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>
                Profesional Responsable: <strong className="text-white">{caseDoc.responsibleUserName || 'Asignado'}</strong>
              </div>
              <div className="text-[11px]">
                Apertura: {new Date(caseDoc.openedAt).toLocaleDateString('es-CO')}
              </div>
              {caseDoc.closedAt && (
                <div className="text-[11px] text-emerald-400 font-semibold">
                  Cerrado el: {new Date(caseDoc.closedAt).toLocaleDateString('es-CO')}
                </div>
              )}
            </div>

            {can('cases.notes_write') && caseDoc.status !== 'CLOSED' && (
              <button
                onClick={() => setNoteModalOpen(true)}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Agregar Nota Confidencial</span>
              </button>
            )}
          </div>
        </div>

        {/* Case Stepper Workflow */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-3">Flujo del Ciclo de Vida del Caso:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {CASE_STEPS.map((step) => {
              const isCurrent = caseDoc.status === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  disabled={caseDoc.status === 'CLOSED' && step.id !== 'CLOSED'}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    isCurrent
                      ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Closure Banner if Closed */}
      {caseDoc.status === 'CLOSED' && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Caso Cerrado & Resuelto con Éxito</span>
          </div>
          <p className="text-slate-300">
            <strong>Motivo de Cierre:</strong> {caseDoc.closureReason}
          </p>
          <p className="text-slate-300">
            <strong>Impacto / Resultado Alcanzado:</strong> {caseDoc.outcome}
          </p>
        </div>
      )}

      {/* Confidential Notes Dossier Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Notas de Evolución & Sesiones Clínico-Jurídicas</h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800 font-mono font-semibold">
            CLASIFICACIÓN: RESTRICTED
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No hay notas confidenciales en este expediente aún.
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((n: any) => (
              <div
                key={n._id}
                className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 relative"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/50">
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-rose-300 font-mono">
                      {n.kind}
                    </span>
                    <span>{n.authorName} ({n.authorRole})</span>
                  </div>
                  <span className="text-[11px]">
                    {new Date(n.createdAt).toLocaleString('es-CO')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agregar Nota Confidencial */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Nueva Nota de Caso Confidencial
              </h3>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Actuación / Nota</label>
                <select
                  value={noteKind}
                  onChange={(e) => setNoteKind(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="SESSION_NOTE">Sesión de Acompañamiento / Terapia</option>
                  <option value="ASSESSMENT">Valoración Psicosocial o Jurídica</option>
                  <option value="LEGAL_ACTION">Actuación Legal (Medida de Protección / Denuncia)</option>
                  <option value="HOME_VISIT">Visita Domiciliaria Territorial</option>
                  <option value="FOLLOW_UP">Seguimiento Telefónico / Presencial</option>
                  <option value="INCIDENT">Reporte de Incidente / Alerta</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cuerpo de la Nota *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escriba la descripción detallada de la sesión o actuación confidencial..."
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingNote}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {savingNote ? 'Guardando...' : 'Guardar Nota en Expediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cerrar Caso */}
      {closeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Cierre Formal de Expediente
              </h3>
              <button
                onClick={() => setCloseModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCloseCase} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motivo de Cierre *</label>
                <select
                  required
                  value={closureReason}
                  onChange={(e) => setClosureReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="">Seleccione motivo...</option>
                  <option value="Cumplimiento exitoso de objetivos de acompañamiento">Cumplimiento exitoso de objetivos</option>
                  <option value="Medida de protección efectiva otorgada por comisaría">Medida de protección efectiva otorgada</option>
                  <option value="Graduación exitosa en programa de empoderamiento CAM">Graduación en programa CAM</option>
                  <option value="Remisión institucional completa y aceptada">Remisión institucional completa</option>
                  <option value="Retiro voluntario de la participante">Retiro voluntario de la participante</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resultado / Impacto Logrado *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detalle el impacto en la vida de la mujer, cambios en su autonomía, seguridad o bienestar familiar..."
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCloseModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {savingClose ? 'Cerrando...' : 'Confirmar Cierre de Caso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
