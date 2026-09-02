'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, Info, EyeOff } from 'lucide-react';
import Link from 'next/link';
import PortalDashboard from '@/components/PortalDashboard';

const DEMO_USERS: Record<string, { pin: string; name: string; code: string; docId: string; program: string; specialist: string; sendaIndex: number; assignedCourses: number[]; completedCourses: number[]; }> = {
  '1047892411': {
    pin: '1234',
    name: 'Maria Alejandra Torres',
    code: 'SM-8842',
    docId: '1.047.892.411',
    program: 'Programa 4 — Ruta de Salud y Derechos Reproductivos',
    specialist: 'Dra. Elena Ruiz — Ginecologia',
    sendaIndex: 34,
    assignedCourses: [1, 2, 3, 4],
    completedCourses: [1, 2],
  },
  '1098765432': {
    pin: '5678',
    name: 'Luz Dary Paternina',
    code: 'SM-9201',
    docId: '1.098.765.432',
    program: 'Programa 2 — Atencion a Victimas de Violencia',
    specialist: 'Lic. Claudia Morales — Psicologia',
    sendaIndex: 58,
    assignedCourses: [1, 4, 5, 6],
    completedCourses: [1],
  },
  'SM-8842': {
    pin: '1234',
    name: 'Maria Alejandra Torres',
    code: 'SM-8842',
    docId: '1.047.892.411',
    program: 'Programa 4 — Ruta de Salud y Derechos Reproductivos',
    specialist: 'Dra. Elena Ruiz — Ginecologia',
    sendaIndex: 34,
    assignedCourses: [1, 2, 3, 4],
    completedCourses: [1, 2],
  },
};

export default function IngresarPage() {
  const [documentId, setDocumentId] = useState('');
  const [pin, setPin] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<typeof DEMO_USERS[string] | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!accepted) { 
      setError('Debes aceptar la autorizacion de datos personales (Ley 1581 de 2012).'); 
      setLoading(false);
      return; 
    }

    try {
      // Intentar validar contra base de datos
      const res = await fetch('/api/beneficiary/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNumber: documentId.trim(), password: pin.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        // Convertir respuesta de BD a formato esperado por PortalDashboard
        setUser({
          pin: pin.trim(),
          name: data.user.patientName,
          code: data.user.patientCode,
          docId: data.user.documentNumber,
          program: 'Programa Caribe Seguro para Mujeres',
          specialist: 'Equipo Multidisciplinario',
          sendaIndex: 65,
          assignedCourses: [1, 2, 3],
          completedCourses: [],
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Error conectando con BD, usando demo users:', err);
    }

    // Fallback: validar con DEMO_USERS
    const found = DEMO_USERS[documentId.trim()];
    if (!found || found.pin !== pin.trim()) {
      setError('Credenciales incorrectas. Demo: Cedula 1047892411 / PIN 1234');
      setLoading(false);
      return;
    }
    setUser(found);
    setLoading(false);
  };

  const fillDemo = () => { setDocumentId('1047892411'); setPin('1234'); setAccepted(true); };

  if (user) return <PortalDashboard user={user} onLogout={() => setUser(null)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">

        {/* Demo Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-extrabold text-amber-700">Usuarios Demo Disponibles</p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              Demo 1: <strong>1047892411</strong> / PIN <strong>1234</strong> — Maria Alejandra Torres<br/>
              Demo 2: <strong>1098765432</strong> / PIN <strong>5678</strong> — Luz Dary Paternina
            </p>
          </div>
          <button onClick={fillDemo} className="bg-amber-400 hover:bg-amber-500 text-[#3B0852] font-extrabold text-[10px] px-3 py-1.5 rounded-full cursor-pointer shrink-0">
            Autocompletar
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-pink-200 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Lock className="w-8 h-8 text-amber-300" />
            </div>
            <h1 className="text-2xl font-extrabold">Acceso Seguro</h1>
            <p className="text-xs text-pink-100 mt-1">Portal Confidencial — Fundacion Senda Mujer</p>
            <span className="inline-block mt-3 bg-emerald-500/20 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-400/30">
              SSL Cifrado • Habeas Data Protegido
            </span>
          </div>

          <form onSubmit={handleLogin} className="p-7 space-y-5">
            {error && <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">{error}</div>}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Cedula o Codigo de Expediente *</label>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Ej: 1047892411 o SM-8842"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Clave PIN Secreta *</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm bg-pink-50/30"
              />
              <p className="text-[10px] text-slate-400 mt-1">Olvidé mi PIN — Contactar a Dra. Sorelvis (+57 301 469 2095)</p>
            </div>

            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="w-4 h-4 text-[#E12880] rounded mt-0.5 cursor-pointer" />
                <span className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                  Autorizo a la <strong>Fundacion Senda Mujer</strong> el tratamiento confidencial de mis datos bajo la <strong>Ley 1581 de 2012</strong>.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Validando credenciales...' : 'Ingresar a Mi Portal Seguro'}
            </button>

            <div className="flex items-center justify-between text-[11px]">
              <Link href="/portal-beneficiaria" className="text-slate-500 hover:text-slate-700 font-bold">
                Volver
              </Link>
              <Link href="/senda-sos" className="text-red-600 font-bold hover:underline inline-flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Necesito ayuda urgente
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
