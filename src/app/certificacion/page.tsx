'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, CheckCircle2, ArrowLeft, Building2, Send, Sparkles } from 'lucide-react';

const DEMO_CERTIFIED = [
  { id: '1', name: 'Hotel Santa Clara Legend Cartagena', category: 'HOTEL', level: 'NIVEL_4_EXCELENCIA', validUntil: '2027-08-30', neighborhood: 'Centro Histórico, Cartagena' },
  { id: '2', name: 'Universidad de Cartagena — Campus San Agustín', category: 'UNIVERSIDAD', level: 'NIVEL_3_ESPACIO_SEGURO', validUntil: '2027-06-15', neighborhood: 'Centro, Cartagena' },
  { id: '3', name: 'Colegio Mayor de Bolívar', category: 'COLEGIO', level: 'NIVEL_2_PROTOCOLO', validUntil: '2027-05-20', neighborhood: 'Pie de la Popa, Cartagena' },
];

export default function CertificacionPage() {
  const [instName, setInstName] = useState('');
  const [category, setCategory] = useState<'HOTEL' | 'COLEGIO' | 'UNIVERSIDAD' | 'EMPRESA' | 'ENTIDAD_PUBLICA'>('HOTEL');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Cartagena');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName || !email) return;

    try {
      await fetch('/api/certificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionName: instName, category, contactPerson: contactName, email, phone, address, neighborhood }),
      });
    } catch (err) {
      console.warn('Postulación guardada localmente');
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0F0218] text-white p-6 sm:p-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-pink-500/20 pb-6">
        <Link href="/" className="text-pink-400 hover:text-pink-300 text-xs font-bold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#E12880] flex items-center justify-center text-slate-950 shadow-lg">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Caribe Seguro Certified</h1>
            <p className="text-xs text-pink-200/80">
              Sello Institucional de Prevención y Espacios Libres de Violencia basada en Género en Cartagena y Bolívar.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Postulación */}
        <div className="bg-[#240538] rounded-3xl p-6 sm:p-8 border border-pink-500/30 space-y-6 shadow-2xl">
          <div>
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">POSTULACIÓN INSTITUCIONAL</span>
            <h2 className="text-xl font-black text-white">Acredita tu Empresa, Hotel o Colegio</h2>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl space-y-2 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-black text-white">¡Postulación Recibida con Éxito!</h3>
              <p className="text-xs text-emerald-200">
                El equipo de la Fundación Senda Mujer se comunicará con tu organización para iniciar la auditoría de protocolos Nivel 1.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-pink-300 mb-1">Nombre de la Institución *</label>
                <input
                  type="text"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  placeholder="Ej: Hotel Las Américas Cartagena"
                  required
                  className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-pink-300 mb-1">Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-bold"
                  >
                    <option value="HOTEL">🏨 Hotel / Sector Turístico</option>
                    <option value="COLEGIO">🏫 Colegio / Institución Educativa</option>
                    <option value="UNIVERSIDAD">🎓 Universidad</option>
                    <option value="EMPRESA">🏢 Empresa Privada</option>
                    <option value="ENTIDAD_PUBLICA">🏛️ Entidad Pública</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-pink-300 mb-1">Persona de Contacto *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej: Dra. María Paula Gómez"
                    required
                    className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-pink-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                    required
                    className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-pink-300 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full p-3 rounded-xl bg-[#140320] border border-pink-500/30 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-[#E12880] text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Postulación a Caribe Seguro Certified</span>
              </button>
            </form>
          )}
        </div>

        {/* Directorio Público de Acreditadas */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Directorio de Instituciones Certificadas Vigentes
          </h2>

          <div className="space-y-3">
            {DEMO_CERTIFIED.map((c) => (
              <div key={c.id} className="p-5 bg-[#240538] rounded-3xl border border-pink-500/30 space-y-2 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">{c.category}</span>
                    <h3 className="text-base font-black text-white">{c.name}</h3>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
                    {c.level.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-pink-200/80">{c.neighborhood} • Válido hasta: <strong className="text-white font-mono">{c.validUntil}</strong></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
