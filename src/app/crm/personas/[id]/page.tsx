'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCrmAuth } from '@/lib/crm/client';
import {
  ArrowLeft,
  User,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileHeart,
  Layers,
  Package,
  CalendarDays,
  PlusCircle,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function CrmPersonaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { can } = useCrmAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'casos' | 'programas' | 'ayudas' | 'asistencias'>('casos');
  const [unmasked, setUnmasked] = useState(false);

  useEffect(() => {
    async function fetchPersona() {
      try {
        setLoading(true);
        const res = await fetch(`/api/crm/people/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error al consultar persona:', err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchPersona();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-slate-900 rounded w-32" />
        <div className="h-40 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-96 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  const person = data?.person;
  if (!person) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <p>No se encontró la persona solicitada.</p>
        <Link href="/crm/personas" className="text-rose-400 underline mt-2 inline-block">
          Volver al directorio
        </Link>
      </div>
    );
  }

  const cases = data?.cases || [];
  const enrollments = data?.enrollments || [];
  const aidDeliveries = data?.aidDeliveries || [];
  const attendances = data?.attendances || [];

  const displayName = person.protectedIdentity && !unmasked ? person.pseudonym || 'Identidad Protegida' : `${person.firstName} ${person.lastName}`;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/crm/personas"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Directorio</span>
        </Link>
      </div>

      {/* Header Profile 360° Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-rose-500/20 flex-shrink-0">
              {person.firstName[0]}
              {person.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">{displayName}</h1>
                <span className="font-mono text-xs text-rose-400 font-semibold px-2 py-0.5 bg-rose-500/10 rounded border border-rose-500/20">
                  {person.code}
                </span>
                {person.protectedIdentity && (
                  <button
                    onClick={() => setUnmasked(!unmasked)}
                    className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                    title="Revelar/Ocultar nombre real (acción auditada)"
                  >
                    {unmasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{unmasked ? 'Ocultar Identidad' : 'Revelar Identidad Real'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {person.documentType} {unmasked || !person.protectedIdentity ? person.documentNumber : '••••••••'}
                </span>
                {person.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {person.phone}
                  </span>
                )}
                {person.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {person.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {person.address?.neighborhood || person.address?.city || 'Cartagena'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {person.roles?.map((r: string) => (
                  <span
                    key={r}
                    className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-200 rounded-md border border-slate-700"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 self-start">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Habeas Data Ley 1581</span>
            </div>
            <p className="text-[11px]">
              Consentimiento: <strong>{person.habeasDataConsent?.granted ? 'Autorizado' : 'Pendiente'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('casos')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'casos'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileHeart className="w-3.5 h-3.5" />
          <span>Casos y Expedientes ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programas')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'programas'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Líneas CAM & Programas ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ayudas')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'ayudas'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Ayudas & Kits Recibidos ({aidDeliveries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('asistencias')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'asistencias'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Asistencias ({attendances.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'casos' && (
          <div className="space-y-3">
            {cases.length === 0 ? (
              <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                Esta persona no tiene casos ni expedientes abiertos actualmente.
              </div>
            ) : (
              cases.map((c: any) => (
                <Link
                  key={c._id}
                  href={`/crm/casos/${c._id}`}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl block transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{c.caseNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">
                        {c.status}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-400">{c.type}</span>
                    </div>
                    <span className="text-xs text-slate-400">{c.responsibleUserName || 'Asignado'}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{c.openingReason}</p>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'programas' && (
          <div className="space-y-3">
            {enrollments.length === 0 ? (
              <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                No hay inscripciones registradas en programas productivos para esta persona.
              </div>
            ) : (
              enrollments.map((e: any) => (
                <div key={e._id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{e.productiveLine || 'Línea Productiva CAM'}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded font-medium">
                      {e.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Inscrita el: {new Date(e.enrolledAt).toLocaleDateString('es-CO')}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'ayudas' && (
          <div className="space-y-3">
            {aidDeliveries.length === 0 ? (
              <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                No hay entregas de ayudas registradas para esta persona.
              </div>
            ) : (
              aidDeliveries.map((a: any) => (
                <div key={a._id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{a.type}</span>
                    <p className="text-[11px] text-slate-400">
                      Cantidad: {a.quantity} · Valor: ${Number(a.value || 0).toLocaleString('es-CO')} COP
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Entregado
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'asistencias' && (
          <div className="space-y-3">
            {attendances.length === 0 ? (
              <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                No hay asistencias a jornadas registradas.
              </div>
            ) : (
              attendances.map((att: any) => (
                <div key={att._id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-200">Asistencia confirmada ({att.method})</span>
                  <span className="text-slate-400">{new Date(att.checkInAt).toLocaleDateString('es-CO')}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
