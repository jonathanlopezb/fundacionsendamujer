'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BrainCircuit, Bot, User, Minimize2, Sparkles, PhoneCall } from 'lucide-react';
import { RiRobot2Fill, RiSendPlaneFill, RiSparklesLine, RiMessage3Fill } from 'react-icons/ri';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SendaBotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '🌷 Hola, soy **SendaBot**, tu asistente confidencial de la Fundación Senda Mujer en Cartagena. Estoy aquí para escucharte, orientarte sobre tus derechos (Sentencias C-055/2022 y C-355/2006), ginecología, odontología y guiarte de forma 100% segura. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'Hola, estoy aquí contigo.' }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Recuerda que nuestro canal directo de atención en Cartagena está activo 24/7 en el **301 469 2095** o Línea Púrpura **155**.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[999999] pointer-events-auto">
      
      {/* Floating Trigger Button for Desktop & Mobile */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-senda-pink via-rose-500 to-senda-purple text-white px-4 py-3 sm:px-5 sm:py-4 rounded-full shadow-2xl hover:shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 group relative border border-pink-300/40 cursor-pointer"
          aria-label="Abrir Chat SendaBot AI"
        >
          {/* Glowing Ping Dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-ping pointer-events-none" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full pointer-events-none" />
          
          <RiRobot2Fill className="w-6 h-6 text-white shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-extrabold tracking-wide text-white whitespace-nowrap">
            SendaBot AI <span className="hidden xs:inline bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-md ml-1 font-extrabold uppercase">24/7</span>
          </span>
        </button>
      )}

      {/* Floating Modal Window with Safe Mobile Sizing */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="bg-white rounded-3xl border border-pink-200/90 shadow-2xl w-[94vw] max-w-[420px] max-h-[85vh] h-[520px] sm:h-[560px] flex flex-col overflow-hidden animate-fadeIn transition-all duration-300 relative"
        >
          {/* Top Bar with explicit close button */}
          <div className="bg-gradient-to-r from-senda-purple-dark via-[#52166F] to-senda-purple text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-senda-pink rounded-xl shadow-sm">
                <RiRobot2Fill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  SendaBot AI
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <span className="text-[10px] text-pink-200 block">Atención Confidencial Cartagena</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-colors text-white cursor-pointer"
                title="Minimizar / Cerrar Chat"
                aria-label="Cerrar Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-pink-50/40 to-purple-50/20 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-senda-pink text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <RiRobot2Fill className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[86%] leading-relaxed break-words text-xs ${
                    msg.role === 'user'
                      ? 'bg-senda-purple text-white rounded-tr-none shadow-sm font-medium'
                      : 'bg-white text-slate-800 border border-pink-100 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4 text-slate-950" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-[11px] p-2 bg-white/60 rounded-xl border border-pink-100 w-fit">
                <Sparkles className="w-4 h-4 text-senda-pink animate-spin" />
                <span className="font-semibold">SendaBot redactando respuesta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="p-2 sm:p-2.5 bg-white border-t border-pink-100 flex gap-1.5 overflow-x-auto text-[10px] font-bold text-senda-purple scrollbar-none shrink-0">
            <button
              type="button"
              onClick={() => handleSend('Quiero agendar cita de Ginecología o Medicina')}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full shrink-0 transition-colors"
            >
              🩺 Cita Ginecología
            </button>
            <button
              type="button"
              onClick={() => handleSend('Tengo un embarazo no planeado, ¿qué alternativas tengo?')}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full shrink-0 transition-colors"
            >
              🌸 Embarazo No Planeado
            </button>
            <button
              type="button"
              onClick={() => handleSend('Sufro de violencia de género, ¿dónde acudo en Cartagena?')}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full shrink-0 transition-colors"
            >
              🕊️ Ruta Violencia Cartagena
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-pink-100 flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje seguro aquí..."
              className="flex-1 bg-pink-50/60 px-4 py-2.5 rounded-full border border-pink-200/80 focus:outline-none focus:ring-2 focus:ring-senda-pink text-xs text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-senda-pink hover:bg-senda-pink-dark text-white p-2.5 rounded-full disabled:opacity-50 transition-all shadow-sm cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
            >
              <RiSendPlaneFill className="w-4 h-4 text-white" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
