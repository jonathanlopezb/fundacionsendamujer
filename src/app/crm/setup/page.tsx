'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Shield,
  Sparkles,
  UserCheck,
  Lock,
  Mail,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  Key,
  ShieldAlert,
} from 'lucide-react';

export default function CrmSetupPage() {
  const router = useRouter();
  const { refreshUser } = useCrmAuth();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    documentNumber: '',
    specialty: 'Dirección de Tecnología & Arquitectura',
  });

  useEffect(() => {
    async function checkSetupStatus() {
      try {
        const res = await fetch('/api/crm/auth/setup');
        const data = await res.json();
        if (!data.isFirstRun) {
          router.push('/crm/login');
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error('Error al verificar estado:', err);
        setChecking(false);
      }
    }
    checkSetupStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/crm/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al configurar el Super Administrador');
      }

      setSuccess(true);
      // Hard redirect para que el cookie de sesión sea leído correctamente en la carga fresca
      setTimeout(() => {
        window.location.href = '/crm';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-lg shadow-xl shadow-rose-500/25 animate-pulse">
            SM
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span>Verificando estado del CRM...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative bg-gradient-to-br from-[#0d1117] via-purple-950/20 to-[#0b0f1a] flex-col justify-between p-12 overflow-hidden border-r border-slate-800/60">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-rose-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-lg shadow-2xl shadow-rose-500/30">
            SM
          </div>
          <div>
            <div className="text-base font-bold text-white">CRM Senda Mujer</div>
            <div className="text-xs text-slate-500">Sistema Operativo Social</div>
          </div>
        </div>

        {/* Texto central */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Paso Único · Primer Despliegue
          </div>
          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
            Inicialización del<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">
              Super Administrador
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Esta cuenta maestra tendrá control total para gestionar roles, programas CAM/THEMIS, expedientes y módulos financieros.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Key,     text: 'Cifra y genera la primera clave maestra' },
              { icon: Layers,  text: 'Inicializa catálogos de programas y roles' },
              { icon: Shield,  text: 'Activa el registro inmutable de auditoría' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-600 relative z-10">
          © {new Date().getFullYear()} Fundación Senda Mujer · Barranquilla, Colombia
        </p>
      </div>

      {/* Panel derecho: Formulario */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-12 relative overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Crear Cuenta Maestra</h1>
            <p className="text-sm text-slate-500 mt-1">
              Completa los datos del primer Super Administrador de la Fundación
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>¡Super Administrador creado! Accediendo al CRM...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ana María Morales"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="admin@fundacionsendamujer.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Documento y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  No. Documento / Cédula
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="1047123456"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="+57 300 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Contraseña y Confirmación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Contraseña Maestra (mín 8) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Card de garantías */}
            <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Garantías del Sistema:
              </div>
              <p>• Cifrado criptográfico Scrypt + Salt con vector aleatorio.</p>
              <p>• Rastro inmutable de auditoría para cada operación (Ley 1581/2012).</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Inicializando sistema...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Inicializar Sistema & Crear Super Administrador</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
