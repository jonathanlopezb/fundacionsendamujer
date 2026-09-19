'use client';
import React, { useState, useEffect } from 'react';
import { Radio, Users, Send, MessageSquare, Calendar, Clock, Sparkles, CheckCircle2, ShieldCheck, Play } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
}

export default function SendaLiveSection({ user, onOpenAuth }: Props) {
  const [session, setSession] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [reservedIds, setReservedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/academia/live')
      .then((res) => res.json())
      .then((data) => {
        if (data?.liveSession) {
          setSession(data.liveSession);
          setChatMessages(data.liveSession.chatMessages || []);
        }
        if (data?.upcomingSessions) {
          setUpcoming(data.upcomingSessions);
        }
      })
      .catch(() => undefined);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    const safeName = user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1] ? user.name.split(' ')[1][0] + '.' : 'S.');
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: safeName,
      message: inputMessage.trim(),
      timestamp: new Date(),
      isHost: false,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    try {
      setIsSending(true);
      await fetch('/api/academia/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: safeName,
          message: newMsg.message,
        }),
      });
    } catch (err) {
      // Handled in client state
    } finally {
      setIsSending(false);
    }
  };

  const handleReserve = (id: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (reservedIds.includes(id)) {
      setReservedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setReservedIds((prev) => [...prev, id]);
    }
  };

  return (
    <section id="live" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-red-300 bg-red-950/80 border border-red-500/40 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span>SendaLive · Aulas en Directo</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Clases y Masterclasses en Vivo
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/70 mt-1 max-w-2xl">
            Aprende en tiempo real con docentes expertas, haz tus preguntas en directo y participa en dinámicas grupales.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-pink-200/80 bg-white/[0.04] px-4 py-2 rounded-full border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Espacio seguro y moderado por Fundación Senda</span>
        </div>
      </div>

      {/* Main Live Broadcast & Chat Grid matching Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#160623] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Video Stream Area (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-black/80 relative">
          
          {/* Stream Player */}
          <div className="relative aspect-video w-full bg-[#0a0210] overflow-hidden group">
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
            >
              <source
                src={session?.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                type="video/mp4"
              />
              Tu navegador no soporta video streaming.
            </video>

            {/* Live Indicator Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white flex items-center gap-1.5 shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                LIVE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                {session?.viewersCount ? `${(session.viewersCount / 1000).toFixed(1)}k` : '1.2k'} espectadoras
              </span>
            </div>
          </div>

          {/* Stream Footer Info */}
          <div className="p-4 sm:p-6 bg-[#1c082b] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">
                {session?.category || 'Habilidades Digitales'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {session?.title || 'Marketing Digital en Vivo: Estrategias de Cierre de Ventas'}
              </h3>
              <p className="text-xs text-pink-200/70">
                Instructora: <strong className="text-amber-300">{session?.instructor || 'Mg. Laura Gómez Rodríguez'}</strong> · {session?.scheduledTime || 'Hoy 5:00 p.m. - 6:30 p.m.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => alert('¡Te has conectado al audio de la sala en vivo!')}
                className="px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Ver pantalla completa
              </button>
            </div>
          </div>

        </div>

        {/* Live Chat Area (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col h-[480px] lg:h-auto bg-[#1a0726] border-t lg:border-t-0 lg:border-l border-white/10">
          
          {/* Chat Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-black text-white">Chat de la Clase</span>
            </div>
            <span className="text-[10px] font-bold text-pink-200/60 bg-white/5 px-2 py-0.5 rounded-full">
              Moderado
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-1 text-xs animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className={`font-black ${msg.isHost ? 'text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded text-[10px]' : 'text-pink-300'}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-[9px] text-pink-200/40">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-pink-100/90 bg-white/[0.04] p-2.5 rounded-xl border border-white/5 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#12031a] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={user ? "Escribe un comentario o pregunta..." : "Inicia sesión para participar en el chat"}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white/[0.06] border border-white/10 text-white placeholder-pink-200/40 focus:outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              disabled={isSending}
              aria-label="Enviar mensaje"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white hover:opacity-90 transition-opacity flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* Upcoming Live Classes Schedule Cards */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-pink-400" />
          <span>Próximas Clases en Directo</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcoming.map((item) => {
            const isReserved = reservedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-[#1b082a] border border-white/10 hover:border-pink-400/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-bold border border-pink-500/20">
                      {item.category}
                    </span>
                    <span className="text-amber-300 font-black flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.date} · {item.time}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-pink-200/70">
                    Docente: <strong className="text-pink-100">{item.instructor}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-pink-200/60">
                    {item.registered + (isReserved ? 1 : 0)} inscritas
                  </span>
                  <button
                    onClick={() => handleReserve(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isReserved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {isReserved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cupo Reservado</span>
                      </>
                    ) : (
                      <span>Reservar cupo</span>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
