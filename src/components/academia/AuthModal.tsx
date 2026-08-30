'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { X, Lock, Mail, User, Zap, Shield, Sparkles } from 'lucide-react';

interface Props {
  mode: 'login' | 'register';
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) return;
    const displayName = mode === 'register' ? name : (email.split('@')[0] || 'Usuaria Senda');
    onLogin(displayName, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl animate-fadeIn bg-[#180325] border border-pink-500/30">
        
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none bg-radial-gradient opacity-30 blur-2xl bg-[#E12880]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-pink-200 hover:text-white p-2 rounded-full transition-colors bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-3 mb-6">
          <div className="relative w-36 h-9">
            <Image src="/logo.png" alt="Fundación Senda Mujer" fill className="object-contain" priority />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-[#52166F]/80 border border-pink-400/30">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>SendaAcademia Pass</span>
          </div>

          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}
          </h2>
          <p className="text-xs text-pink-200/80">
            {mode === 'login'
              ? 'Accede a tus lecciones, certificados y clases en vivo.'
              : 'Únete a más de 1,450 usuarias activas en Cartagena.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-pink-100 block mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/70" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María Josefa López"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-pink-200/40 bg-[#3B0852] border border-pink-500/30 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-pink-100 block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-pink-200/40 bg-[#3B0852] border border-pink-500/30 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-pink-100 block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-pink-200/40 bg-[#3B0852] border border-pink-500/30 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#52166F] border border-pink-400/40 shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{mode === 'login' ? 'Acceder a Mi Aula Virtual' : 'Completar Registro Gratuito'}</span>
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 pt-4 border-t border-pink-500/20 text-center text-xs text-pink-200">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta aún?{' '}
              <button onClick={() => onSwitchMode('register')} className="font-extrabold text-amber-300 hover:underline cursor-pointer">
                Regístrate gratis
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => onSwitchMode('login')} className="font-extrabold text-amber-300 hover:underline cursor-pointer">
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-pink-200/70">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Acceso 100% Gratuito y Confidencial • Fundación Senda Mujer</span>
        </div>

      </div>
    </div>
  );
}
