'use client';
import React, { useState } from 'react';
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
    const displayName = mode === 'register' ? name : (email.split('@')[0] || 'Estudiante');
    onLogin(displayName, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl animate-fadeIn"
        style={{ background: '#12121c', border: '1px solid rgba(255,255,255,0.12)' }}>
        
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-purple-300"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>SendaAcademia Pass</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}
          </h2>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            {mode === 'login'
              ? 'Accede a tus lecciones, certificados y clases en vivo.'
              : 'Únete a más de 1,450 estudiantes activas en Cartagena.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María Josefa López"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-300 block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-300 block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg hover:opacity-90 mt-2 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            <Zap className="w-4 h-4" />
            <span>{mode === 'login' ? 'Acceder a Mi Aula Virtual' : 'Completar Registro Gratuito'}</span>
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 pt-4 border-t text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#9ca3af' }}>
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta aún?{' '}
              <button onClick={() => onSwitchMode('register')} className="font-bold text-cyan-400 hover:underline">
                Regístrate gratis
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => onSwitchMode('login')} className="font-bold text-purple-400 hover:underline">
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Acceso 100% Gratuito y Confidencial • Fundación Senda Mujer</span>
        </div>

      </div>
    </div>
  );
}
