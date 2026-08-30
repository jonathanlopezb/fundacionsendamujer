'use client';
import React, { useState, useEffect } from 'react';
import { Zap, Users, Star, ArrowRight, MessageCircle, Mic2, Share2, Shield, HeartHandshake } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
}

const LIVE_EVENT = {
  title: 'Masterclass: Emprendimiento Digital & Autonomía Financiera para Mujeres en Cartagena',
  instructor: 'Dra. Sorelvis Caldera',
  role: 'Directora Fundación Senda Mujer • Cel: 301 469 2095',
  date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
  attendees: 420,
  topic: 'Ruta 1: Autonomía Financiera',
};

const LIVE_CHAT = [
  { user: 'María L. (Cartagena)', msg: '¡Excelente iniciativa de la Fundación Senda Mujer!', time: '10:42' },
  { user: 'Ana R. (El Pozón)', msg: '¿Dónde descargamos el formato de presupuesto?', time: '10:43' },
  { user: 'Dra. Sorelvis', msg: '¡Bienvenidas todas! El material estará disponible al finalizar.', time: '10:44' },
  { user: 'Carmen P. (Olaya)', msg: 'Gracias por esta masterclass tan clara 💜', time: '10:45' },
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
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black text-amber-300 bg-[#52166F]/80 border border-pink-400/40 shadow-lg">
        {String(val).padStart(2, '0')}
      </div>
      <p className="text-[9px] sm:text-[10px] mt-1 font-extrabold uppercase tracking-widest text-pink-200">{label}</p>
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#270538] via-[#3B0852] to-[#180325] border-b border-pink-500/20">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none bg-radial-gradient opacity-20 blur-3xl bg-[#E12880]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl bg-[#52166F]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Event Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white bg-red-600 border border-red-400 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
                TRANSMISIÓN EN VIVO 🔴
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#E12880]/20 text-pink-200 border border-[#E12880]/40">
                {LIVE_EVENT.topic}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {LIVE_EVENT.title}
            </h1>

            <div className="flex items-center gap-3 bg-[#52166F]/50 p-3 rounded-2xl border border-pink-400/20 w-fit">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E12880] to-amber-400 flex items-center justify-center font-extrabold text-white text-sm shrink-0">
                S
              </div>
              <div>
                <p className="text-xs font-extrabold text-amber-300">{LIVE_EVENT.instructor}</p>
                <p className="text-[11px] text-pink-100">{LIVE_EVENT.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-pink-200">
              <Users className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white font-extrabold">{LIVE_EVENT.attendees}</strong> usuarias inscritas en Cartagena y Bolívar</span>
              <Star className="w-4 h-4 ml-2 fill-amber-400 text-amber-400" />
              <span className="text-white font-extrabold">4.9 / 5.0</span>
            </div>

            {/* Countdown */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest mb-3 text-pink-200">La Masterclass inicia en:</p>
              <div className="flex gap-3">
                <TimeUnit val={countdown.d} label="Días" />
                <TimeUnit val={countdown.h} label="Horas" />
                <TimeUnit val={countdown.m} label="Min" />
                <TimeUnit val={countdown.s} label="Seg" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {user ? (
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#52166F] border border-pink-400/40 shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                  <Mic2 className="w-4 h-4 text-amber-300" /> Reservar Mi Cupo Gratuito
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#52166F] border border-pink-400/40 shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" /> Registrarme y Reservar Cupo
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Live Chat Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-[#3B0852]/90 border border-pink-500/30 backdrop-blur-md">
              {/* Chat header */}
              <div className="px-4 py-3 flex items-center justify-between bg-[#52166F]/80 border-b border-pink-500/20">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-extrabold text-white">Chat en Vivo de Usuarias Senda</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-400 text-[#3B0852]">
                  SENDA LIVE
                </span>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 h-56 overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-[#E12880]">
                      {m.user[0]}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-300">{m.user} </span>
                      <span className="text-[10px] text-pink-300/60">{m.time}</span>
                      <p className="text-xs mt-0.5 text-white">{m.msg}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-pink-500/20 bg-[#270538]">
                {user ? (
                  <div className="flex gap-2">
                    <input
                      value={chatMsg}
                      onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMsg()}
                      placeholder="Escribe tu mensaje o pregunta..."
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-full text-white placeholder-pink-200/50 bg-[#3B0852] border border-pink-500/30 focus:outline-none"
                    />
                    <button
                      onClick={sendMsg}
                      className="px-4 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#E12880] hover:bg-[#c81e6f] transition-all cursor-pointer"
                    >
                      Enviar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="w-full text-xs py-2.5 rounded-full font-extrabold text-amber-300 bg-[#52166F] border border-pink-400/30 hover:bg-[#3B0852] transition-all cursor-pointer"
                  >
                    Inicia sesión para participar en el chat en vivo
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
