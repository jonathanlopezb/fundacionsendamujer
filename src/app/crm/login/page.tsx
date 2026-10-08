'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCrmAuth } from '@/lib/crm/client';
import { Lock, Mail, LogIn, AlertCircle, Eye, EyeOff, Shield, ShieldAlert } from 'lucide-react';

export default function CrmLoginPage() {
  const router = useRouter();
  const { user, isFirstRun } = useCrmAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstRun) router.push('/crm/setup');
    else if (user) router.push('/crm');
  }, [isFirstRun, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/crm/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // Hard redirect para garantizar lectura del cookie de sesión
      window.location.href = '/crm';
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Panel izquierdo decorativo — solo visible en desktop */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative bg-gradient-to-br from-[#0d1117] via-rose-950/20 to-[#0b0f1a] flex-col justify-between p-12 overflow-hidden border-r border-slate-800/60">
        {/* Glow orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

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
          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
            Protegiendo vidas,<br />
            <span className="text-rose-400">construyendo futuro</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Plataforma integral de gestión social para la Fundación Senda Mujer. Cada dato protege a una mujer y su familia.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Shield, text: 'Gestión RBAC con 11 roles institucionales' },
              { icon: Lock,   text: 'Auditoría inmutable · Ley 1581/2012 Colombia' },
              { icon: ShieldAlert, text: 'Salida de emergencia disponible (tecla ESC)' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-rose-400" />
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-12 relative">
        {/* Glow orb mobile */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none lg:hidden" />

        {/* Logo solo en mobile */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-black text-white text-sm shadow-lg">
            SM
          </div>
          <div>
            <div className="text-sm font-bold text-white">CRM Senda Mujer</div>
            <div className="text-[10px] text-slate-500">Sistema Operativo Social</div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white">Iniciar Sesión</h1>
            <p className="text-sm text-slate-500 mt-1.5">Ingresa tus credenciales institucionales para acceder</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 p-4 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="usuario@fundacionsendamujer.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-10 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Acceder al Sistema</span>
                </>
              )}
            </button>
          </form>

          {/* Aviso de seguridad */}
          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <p className="text-center text-[11px] text-slate-600 leading-relaxed">
              Plataforma protegida con control de accesos por roles (RBAC), auditoría inmutable y cifrado de extremo a extremo.
              En caso de emergencia, presione <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono text-[10px]">ESC</kbd> para salida rápida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
