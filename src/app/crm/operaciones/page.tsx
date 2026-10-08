'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  CalendarDays,
  PlusCircle,
  MapPin,
  Users,
  QrCode,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export default function CrmOperacionesPage() {
  const { can } = useCrmAuth();
  const [operations, setOperations] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState<any>(null);
  const [attendances, setAttendances] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'WORKSHOP',
    date: '',
    location: '',
    expectedParticipants: 20,
    plannedBudget: 0,
  });

  const [selectedPersonId, setSelectedPersonId] = useState('');

  const fetchOperations = async () => {
    try {
      setLoading(true);
      const [resOp, resPeo] = await Promise.all([
        fetch('/api/crm/operations'),
        fetch('/api/crm/people?limit=200'),
      ]);
      if (resOp.ok) {
        const jo = await resOp.json();
        setOperations(jo.operations || []);
      }
      if (resPeo.ok) {
        const jp = await resPeo.json();
        setPeople(jp.people || []);
        if (jp.people?.length > 0 && !selectedPersonId) {
          setSelectedPersonId(jp.people[0]._id);
        }
      }
    } catch (err) {
      console.error('Error al cargar operaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const handleCreateOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({ name: '', type: 'WORKSHOP', date: '', location: '', expectedParticipants: 20, plannedBudget: 0 });
        fetchOperations();
      }
    } catch (err) {
      console.error('Error creando operación:', err);
    }
  };

  const openAttendanceModal = async (op: any) => {
    setSelectedOp(op);
    setAttendanceModalOpen(true);
    try {
      const res = await fetch(`/api/crm/operations?operationId=${op._id}`);
      if (res.ok) {
        const j = await res.json();
        setAttendances(j.attendances || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonId || !selectedOp) return;

    try {
      const res = await fetch('/api/crm/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'attendance',
          operationId: selectedOp._id,
          personId: selectedPersonId,
          method: 'MANUAL',
        }),
      });
      if (res.ok) {
        const refresh = await fetch(`/api/crm/operations?operationId=${selectedOp._id}`);
        if (refresh.ok) {
          const j = await refresh.json();
          setAttendances(j.attendances || []);
        }
      }
    } catch (err) {
      console.error('Error registrando asistencia:', err);
    }
  };

  const typeLabels: Record<string, string> = {
    WORKSHOP: 'Taller / Capacitación',
    TRAINING: 'Formación Técnica',
    HOME_VISIT: 'Visita Domiciliaria',
    LEGAL_DAY: 'Brigada Jurídica (THEMIS)',
    MEDICAL_DAY: 'Jornada Psicosocial/Salud',
    COMMUNITY: 'Encuentro Comunitario',
    AID_DELIVERY: 'Entrega de Ayudas',
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Operaciones Territoriales & Eventos</h1>
          </div>
          <p className="text-xs text-slate-400">
            Jornadas comunitarias, talleres productivos, brigadas de salud/justicia y registro de asistencia.
          </p>
        </div>

        {can('operations.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Programar Operación</span>
          </button>
        )}
      </div>

      {/* ── Grid of Operations ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando operaciones territoriales...
          </div>
        ) : operations.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No hay operaciones o eventos programados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operations.map((op) => (
              <div
                key={op._id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {op.operationNumber || 'OP-2026'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{op.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2">{op.name}</h3>
                  <span className="text-[10px] text-rose-400 font-medium block mt-0.5">
                    {typeLabels[op.type] || op.type}
                  </span>

                  <div className="space-y-1 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{op.date ? new Date(op.date).toLocaleDateString('es-CO') : 'Fecha por definir'}</span>
                    </div>
                    {op.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{op.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Meta: {op.expectedParticipants || 20} part.</span>
                  <button
                    onClick={() => openAttendanceModal(op)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Users className="w-3 h-3" />
                    <span>Asistencia</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Nueva Operación ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Programar Jornada / Operación</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOperation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Actividad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller de Derechos Sexuales y Reproductivos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Evento</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="WORKSHOP">Taller / Capacitación</option>
                    <option value="TRAINING">Formación Técnica</option>
                    <option value="HOME_VISIT">Visita Domiciliaria</option>
                    <option value="LEGAL_DAY">Brigada Jurídica (THEMIS)</option>
                    <option value="MEDICAL_DAY">Jornada Psicosocial</option>
                    <option value="COMMUNITY">Encuentro Comunitario</option>
                    <option value="AID_DELIVERY">Entrega de Ayudas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lugar / Dirección</label>
                <input
                  type="text"
                  placeholder="Ej. Sede Senda Mujer o Barrio La Chinita"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta de Asistentes</label>
                <input
                  type="number"
                  min="1"
                  value={formData.expectedParticipants}
                  onChange={(e) => setFormData({ ...formData, expectedParticipants: parseInt(e.target.value) || 20 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  Guardar Operación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Asistencia ── */}
      {attendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white">Registro de Asistencia</h2>
                <p className="text-[11px] text-slate-400">{selectedOp?.name}</p>
              </div>
              <button onClick={() => setAttendanceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterAttendance} className="flex gap-2 mb-4">
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
              >
                {people.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.lastName} — {p.documentType} {p.documentNumberMasked || '•••'}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Registrar Check-in
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <span className="text-xs font-semibold text-slate-400 block">
                Asistencias confirmadas ({attendances.length}):
              </span>
              {attendances.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">Sin asistentes registrados aún.</div>
              ) : (
                attendances.map((att: any) => (
                  <div
                    key={att._id}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-white">{att.personName || 'Participante'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(att.checkInAt || att.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
