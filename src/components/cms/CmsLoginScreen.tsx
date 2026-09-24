'use client';

import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertTriangle, Shield, ArrowRight } from 'lucide-react';

interface CmsLoginScreenProps {
  onSuccess: (user: any) => void;
}

export default function CmsLoginScreen({ onSuccess }: CmsLoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciales inválidas.');
      }

      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1f062e] to-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <div className="absolute top-5 left-5">
        <a
          href="/"
          className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
        >
          ← Regresar al sitio
        </a>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            Panel CMS · Fundación Senda Mujer
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Gestión de Imágenes y Contenidos
          </h1>
          <p className="text-purple-300/70 text-xs mt-1.5">
            Ingresa con tus credenciales de administrador autorizadas
          </p>
        </div>

        <div className="bg-[#240a38]/90 backdrop-blur-xl border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin.senda o correo"
                  className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-700/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Ingresar al Panel
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <a
              href="/"
              className="text-xs text-purple-300/60 hover:text-pink-300 transition-colors"
            >
              ← Volver al sitio web principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
