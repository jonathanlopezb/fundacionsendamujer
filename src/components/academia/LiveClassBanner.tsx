'use client';
import React, { useState, useEffect } from 'react';
import { Zap, Users, Star, ArrowRight, MessageCircle, Mic2, Share2 } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
}

const LIVE_EVENT = {
  title: 'Masterclass: Emprendimiento Digital desde Cero para Mujeres en Cartagena',
  instructor: 'Dra. Sorelvis Caldera',
  role: 'Directora Fundación Senda Mujer',
  date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 2d 4h from now
  attendees: 348,
  topic: 'Autonomía Financiera',
};

const LIVE_CHAT = [
  { user: 'María L.', msg: 'Esto es exactamente lo que necesitaba! 🙌', time: '10:42' },
  { user: 'Ana R.', msg: '¿Dónde consigo la plantilla del plan financiero?', time: '10:43' },
  { user: 'Valentina', msg: 'Muchas gracias Dra. Sorelvis!', time: '10:44' },
  { user: 'Carmen P.', msg: 'Excelente clase, muy clara 💜', time: '10:45' },
  { user: 'Luisa M.', msg: 'Pregunta: ¿hay versión grabada?', time: '10:46' },
];

function useCountdown(target: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function TimeUnit({ val, label }: { val: number; label: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-2xl font-black text-white"
        style={{ background: 'rgba(124,58,237,0.35)', border: '1px solid rgba(124,58,237,0.5)' }}>
        {String(val).padStart(2, '0')}
      </div>
      <p className="text-[9px] sm:text-[10px] mt-1 uppercase tracking-widest" style={{ color: '#7c3aed' }}>{label}</p>
    </div>
  );
}

export default function LiveClassBanner({ user, onOpenAuth }: Props) {
  const countdown = useCountdown(LIVE_EVENT.date);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState(LIVE_CHAT);

  const sendMsg = () => {
    if (!chatMsg.trim() || !user) return;
    setChatMessages(prev => [...prev, { user: user.name, msg: chatMsg, time: new Date().toTimeString().slice(0, 5) }]);
    setChatMsg('');
  };

  return (
    <section className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #130d2a 50%, #0a1628 100%)' }}>
      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Event Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                PRÓXIMA CLASE EN VIVO
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                {LIVE_EVENT.topic}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {LIVE_EVENT.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                {LIVE_EVENT.instructor[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{LIVE_EVENT.instructor}</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>{LIVE_EVENT.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ color: '#9ca3af' }}>
              <Users className="w-4 h-4" />
              <span><strong className="text-white">{LIVE_EVENT.attendees}</strong> estudiantes inscritas</span>
              <Star className="w-4 h-4 ml-2" style={{ color: '#fbbf24' }} />
              <span className="text-white font-bold">4.9</span>
            </div>

            {/* Countdown */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7280' }}>Inicia en:</p>
              <div className="flex gap-3">
                <TimeUnit val={countdown.d} label="Días" />
                <TimeUnit val={countdown.h} label="Horas" />
                <TimeUnit val={countdown.m} label="Min" />
                <TimeUnit val={countdown.s} label="Seg" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {user ? (
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  <Mic2 className="w-4 h-4" /> Reservar Mi Lugar
                </button>
              ) : (
                <button onClick={onOpenAuth}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  <Zap className="w-4 h-4" /> Registrarme y Reservar
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>
          </div>

          {/* Right: Live Chat Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#141420', border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* Chat header */}
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ background: 'rgba(124,58,237,0.15)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" style={{ color: '#a78bfa' }} />
                  <span className="text-xs font-bold text-white">Chat en Vivo</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                  🔴 PRÓXIMAMENTE
                </span>
              </div>
              {/* Messages */}
              <div className="p-4 space-y-3 h-52 overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: `hsl(${(m.user.charCodeAt(0) * 37) % 360},60%,45%)` }}>
                      {m.user[0]}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold" style={{ color: '#a78bfa' }}>{m.user} </span>
                      <span className="text-[10px]" style={{ color: '#6b7280' }}>{m.time}</span>
                      <p className="text-xs mt-0.5" style={{ color: '#d1d5db' }}>{m.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                {user ? (
                  <div className="flex gap-2">
                    <input
                      value={chatMsg}
                      onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMsg()}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 text-xs px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <button onClick={sendMsg}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                      →
                    </button>
                  </div>
                ) : (
                  <button onClick={onOpenAuth}
                    className="w-full text-xs py-2 rounded-lg font-semibold transition-all"
                    style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                    Inicia sesión para participar en el chat
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
