'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { CalendarDays, PlusCircle, MapPin, Users, QrCode, CheckCircle2, X } from 'lucide-react';

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
        setSelectedPersonId('');
        openAttendanceModal(selectedOp);
        fetchOperations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-rose-400" />
            Operaciones Territoriales & Talleres
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Jornadas de salud, talleres formativos y registro de asistencia presencial / QR en territorio.
          </p>
        </div>

        {can('operations.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Programar Operación</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500 text-xs animate-pulse">Cargando jornadas...</div>
        ) : operations.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
            No hay operaciones territoriales programadas en el momento.
          </div>
        ) : (
          operations.map((op) => (
            <div key={op._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-400">{op.operationNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {op.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">{op.name}</h3>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {op.location}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Fecha: {new Date(op.date).toLocaleDateString('es-CO')}</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {op.actualParticipants} / {op.expectedParticipants}
                  </span>
                </div>
                <button
                  onClick={() => openAttendanceModal(op)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-rose-400" />
                  <span>Control de Asistencia ({op.actualParticipants})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Programar Operación */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Programar Operación Territorial
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOperation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre de la Jornada / Taller *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller de Patronaje y Corte Mandela"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Actividad</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="WORKSHOP">Taller Formativo</option>
                    <option value="TRAINING">Capacitación Técnica</option>
                    <option value="MEDICAL_DAY">Jornada de Salud</option>
                    <option value="LEGAL_DAY">Jornada Jurídica</option>
                    <option value="HOME_VISIT">Visitas de Campo</option>
                    <option value="AID_DELIVERY">Entrega de Ayudas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ubicación / Sede *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Centro Comunitario Nelson Mandela"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Control de Asistencia */}
      {attendanceModalOpen && selectedOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-rose-400" />
                  Asistencia: {selectedOp.name}
                </h2>
                <span className="text-[11px] text-slate-400">{selectedOp.operationNumber}</span>
              </div>
              <button onClick={() => setAttendanceModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterAttendance} className="space-y-3 mb-4 pb-4 border-b border-slate-800">
              <label className="block text-slate-300 font-semibold text-xs">Registrar Asistente</label>
              <div className="flex gap-2">
                <select
                  required
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                >
                  <option value="">Seleccione participante...</option>
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
                <button type="submit" className="px-3 py-2 bg-rose-600 font-bold text-white text-xs rounded-xl flex-shrink-0">
                  Check-in
                </button>
              </div>
            </form>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-slate-300">Asistentes Confirmados ({attendances.length})</h4>
              {attendances.length === 0 ? (
                <div className="py-4 text-center text-slate-500">No hay asistencias registradas aún.</div>
              ) : (
                attendances.map((a) => (
                  <div key={a._id} className="p-2.5 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800">
                    <div>
                      <span className="font-bold text-white block">{a.personName}</span>
                      <span className="text-[10px] text-slate-500">{a.personCode}</span>
                    </div>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {new Date(a.checkInAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
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
