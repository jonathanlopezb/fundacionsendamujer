'use client';

import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Lock, Mail, User, CheckCircle2, AlertTriangle, Sparkles, KeyRound } from 'lucide-react';

interface CmsSetupScreenProps {
  onSuccess: (user: any) => void;
}

export default function CmsSetupScreen({ onSuccess }: CmsSetupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !username || !password) {
      setError('Por favor diligencia todos los campos requeridos.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña del Super Administrador debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/cms/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
          documentNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al crear la cuenta de Super Administrador.');
      }

      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al inicializar el sistema.');
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

      <div className="w-full max-w-xl">
        {/* Banner de Bienvenida y Seguridad */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Configuración Inicial del Sistema
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Fundación Senda Mujer
          </h1>
          <p className="text-purple-200/80 text-sm mt-2 max-w-md mx-auto">
            Bienvenido/a al CMS oficial. Como es el primer acceso, crea la cuenta maestra del{' '}
            <strong className="text-pink-300">Super Administrador</strong> para asegurar el sistema.
          </p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-[#240a38]/90 backdrop-blur-xl border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-purple-800/40">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Alta del Primer Super Administrador</h2>
              <p className="text-xs text-purple-300/70">Este formulario se bloqueará permanentemente tras su creación</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Nombre y Apellidos <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Sorelvis Murillo Arreola"
                  className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                  Correo Electrónico <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sendamujer.org"
                    className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                  Usuario o Cédula <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin.senda"
                    className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                Documento de Identidad (Opcional)
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Cédula de Ciudadanía"
                className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                  Contraseña Maestra <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5 uppercase tracking-wider">
                  Confirmar Contraseña <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[50px] rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Crear Super Administrador y Acceder
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-800/40 flex items-center gap-2 text-[11px] text-purple-300/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cifrado scrypt con salting único · Almacenamiento seguro en MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
