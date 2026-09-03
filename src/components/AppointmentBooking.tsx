'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, User, Phone, Mail, FileText, CheckCircle2, Sparkles, Stethoscope, Brain, Scale, Smile, HeartHandshake, Activity } from 'lucide-react';

const SPECIALTIES = [
  { id: 'Ginecología Especializada & Salud Reproductiva', label: 'Ginecología Especializada', icon: Activity, color: 'text-pink-600' },
  { id: 'Psicología & Salud Mental', label: 'Psicología & Salud Mental', icon: Brain, color: 'text-purple-600' },
  { id: 'Odontología Integral', label: 'Odontología Integral', icon: Smile, color: 'text-sky-600' },
  { id: 'Medicina General & Salud Reproductiva', label: 'Medicina General', icon: Stethoscope, color: 'text-emerald-600' },
  { id: 'Asesoría Jurídica & VBG', label: 'Asesoría Jurídica VBG', icon: Scale, color: 'text-amber-600' },
  { id: 'Trabajo Social', label: 'Trabajo Social', icon: HeartHandshake, color: 'text-rose-600' },
];

export default function AppointmentBooking() {
  const searchParams = useSearchParams();
  const defaultSpecialty = searchParams.get('especialidad') || 'Ginecología Especializada & Salud Reproductiva';
  const defaultName = searchParams.get('nombre') || '';

  const [formData, setFormData] = useState({
    fullName: defaultName,
    phone: '',
    email: '',
    specialty: defaultSpecialty,
    preferredDate: '',
    preferredTime: '09:00 AM',
    location: 'Sede Cartagena - Pie de la Popa / Manga',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (defaultSpecialty) {
      setFormData((prev) => ({ ...prev, specialty: defaultSpecialty }));
    }
  }, [defaultSpecialty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setTicket(data.appointment);
      } else {
        throw new Error(data.error || 'No fue posible registrar la solicitud.');
      }
    } catch (err) {
      console.error('Error agendando cita:', err);
      window.alert(err instanceof Error ? err.message : 'No fue posible registrar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-pink-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            <Calendar className="w-4 h-4" />
            <span>Sistema Multidisciplinario de Citas Gratuitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Agendamiento de Atención Especializada
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-2 max-w-2xl">
            Reserva tu atención confidencial presencial en Cartagena o teleorientación virtual con nuestro equipo de Ginecología, Psicología, Odontología, Medicina, Derecho o Trabajo Social.
          </p>
        </div>

        {ticket ? (
          /* Confirmation Ticket Card */
          <div className="p-8 sm:p-12 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-senda-purple-dark">
              ¡Cita Agendada Exitosamente!
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Hemos registrado tu solicitud. Te enviaremos la confirmación detallada a tu teléfono o WhatsApp.
            </p>

            <div className="bg-pink-50/70 rounded-2xl p-6 border border-pink-200 text-left max-w-md mx-auto space-y-3 text-xs">
              <div className="flex justify-between border-b border-pink-200 pb-2">
                <span className="text-slate-500 font-semibold">Paciente:</span>
                <span className="font-extrabold text-slate-800">{ticket.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-pink-200 pb-2">
                <span className="text-slate-500 font-semibold">Especialidad:</span>
                <span className="font-extrabold text-senda-pink">{ticket.specialty}</span>
              </div>
              <div className="flex justify-between border-b border-pink-200 pb-2">
                <span className="text-slate-500 font-semibold">Fecha & Hora:</span>
                <span className="font-bold text-slate-800">{ticket.preferredDate} - {ticket.preferredTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Sede:</span>
                <span className="font-bold text-senda-purple">{ticket.location}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center space-x-4">
              <button
                onClick={() => setTicket(null)}
                className="bg-senda-purple text-white font-extrabold px-6 py-2.5 rounded-full text-xs hover:bg-senda-purple-dark transition-all cursor-pointer"
              >
                Agendar otra cita
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            
            {/* Specialty Selection Tabs */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                1. Selecciona la Especialidad Requerida *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SPECIALTIES.map((spec) => {
                  const Icon = spec.icon;
                  const isSelected = formData.specialty === spec.id;

                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, specialty: spec.id })}
                      className={`p-3.5 rounded-2xl text-center border transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                        isSelected
                          ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink shadow-sm'
                          : 'border-slate-200 hover:border-pink-200 bg-white'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${spec.color}`} />
                      <span className="text-[11px] font-bold text-slate-800 leading-tight">
                        {spec.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ej: Laura Martínez"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 300 987 6543"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Preferida *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jornada Horaria Preferida *</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                >
                  <option value="08:00 AM">Mañana — 08:00 AM</option>
                  <option value="10:00 AM">Mañana — 10:00 AM</option>
                  <option value="02:00 PM">Tarde — 02:00 PM</option>
                  <option value="04:00 PM">Tarde — 04:00 PM</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Modalidad de Atención</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                >
                  <option value="Sede Cartagena - Pie de la Popa / Manga">
                    Presencial: Sede Fundación Senda Mujer Cartagena (Pie de la Popa)
                  </option>
                  <option value="Teleorientación Virtual Segura">
                    Virtual: Teleorientación Confidencial (WhatsApp / Llamada)
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas o Motivo de la Consulta (Opcional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Describe brevemente tus inquietudes (salud ginecológica, apoyo en embarazo, odontología...)"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-pink-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-senda-pink to-senda-purple text-white font-extrabold px-10 py-3.5 rounded-full text-sm shadow-lg hover:shadow-glow transition-all cursor-pointer"
              >
                {isSubmitting ? 'Confirmando Reserva...' : 'Confirmar Reserva de Cita'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
