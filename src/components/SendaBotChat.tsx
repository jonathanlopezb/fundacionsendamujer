'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BrainCircuit, Bot, User, Minimize2 } from 'lucide-react';

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

  // Close on Escape key or click outside
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
          content: 'Recuerda que nuestro canal directo de atención en Cartagena está activo 24/7 en el **317 657 5800** o Línea Púrpura **155**.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999]">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-senda-pink via-rose-500 to-senda-purple text-white p-3.5 sm:p-4 rounded-full shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group relative border border-pink-300/30 cursor-pointer"
          aria-label="Abrir Chat SendaBot"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
          <Bot className="w-6 h-6 text-white" />
          <span className="hidden sm:inline text-xs font-extrabold tracking-wide pr-1">
            Asistente Virtual 24/7
          </span>
        </button>
      )}

      {/* Floating Modal Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="bg-white rounded-3xl border border-pink-200 shadow-2xl w-[92vw] max-w-[400px] h-[520px] sm:h-[560px] flex flex-col overflow-hidden animate-fadeIn transition-all duration-300"
        >
          {/* Top Bar with explicit close buttons */}
          <div className="bg-gradient-to-r from-senda-purple-dark to-senda-purple text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-senda-pink rounded-xl">
                <Bot className="w-5 h-5 text-white" />
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
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-pink-50/30 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-senda-pink text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[84%] leading-relaxed break-words ${
                    msg.role === 'user'
                      ? 'bg-senda-purple text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-pink-100 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-senda-purple-dark flex items-center justify-center shrink-0 mt-1 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-[11px] p-2">
                <Sparkles className="w-4 h-4 text-senda-pink animate-spin" />
                <span>SendaBot redactando respuesta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="p-2.5 bg-white border-t border-pink-100 flex gap-1.5 overflow-x-auto text-[10px] font-bold text-senda-purple no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => handleSend('Quiero agendar cita de Ginecología o Medicina')}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full shrink-0"
            >
              🩺 Cita Ginecología
            </button>
            <button
              type="button"
              onClick={() => handleSend('Tengo un embarazo no planeado, ¿qué alternativas tengo?')}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full shrink-0"
            >
              🌸 Embarazo No Planeado
            </button>
            <button
              type="button"
              onClick={() => handleSend('Sufro de violencia de género, ¿dónde acudo en Cartagena?')}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2.5 py-1 rounded-full shrink-0"
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
            className="p-3 bg-white border-t border-pink-100 flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje seguro aquí..."
              className="flex-1 bg-pink-50/50 px-4 py-2.5 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-xs"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-senda-pink hover:bg-senda-pink-dark text-white p-2.5 rounded-full disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
