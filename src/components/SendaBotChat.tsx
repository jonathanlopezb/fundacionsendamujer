'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, BrainCircuit, User, Sparkles } from 'lucide-react';
import { RiRobot2Fill, RiSendPlaneFill } from 'react-icons/ri';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Parser Markdown inline — sin dependencias externas.
 * Convierte el texto del bot en JSX limpio:
 * **negrita**, *cursiva*, [link](url), - listas, líneas con salto de párrafo.
 */
function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      nodes.push(<span key={`br-${lineIdx}`} className="block h-2" />);
      return;
    }

    // Listas con - o *
    const isList = /^[-*]\s+/.test(trimmed);
    const content = isList ? trimmed.replace(/^[-*]\s+/, '') : trimmed;

    const parsed = parseInline(content, `${lineIdx}`);

    if (isList) {
      nodes.push(
        <div key={lineIdx} className="flex items-start gap-1.5 my-0.5">
          <span className="text-[#E12880] font-black mt-0.5 shrink-0">•</span>
          <span className="leading-relaxed">{parsed}</span>
        </div>
      );
    } else {
      nodes.push(
        <p key={lineIdx} className="leading-relaxed mb-1 last:mb-0">
          {parsed}
        </p>
      );
    }
  });

  return nodes;
}

/** Parsea negrita, cursiva y links dentro de una línea */
function parseInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Regex que captura **negrita**, *cursiva*, [texto](url) y 🔢 emojis
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    // Texto literal antes del match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    if (match[2]) {
      // **negrita**
      parts.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-extrabold text-[#52166F]">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *cursiva*
      parts.push(
        <em key={`${keyPrefix}-i${i}`} className="italic text-slate-600">
          {match[3]}
        </em>
      );
    } else if (match[4] && match[5]) {
      // [texto](url)
      parts.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E12880] underline underline-offset-2 hover:text-[#52166F] font-semibold"
        >
          {match[4]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
    i++;
  }

  // Resto del texto
  if (lastIndex < text.length) {
    parts.push(<span key={`${keyPrefix}-end`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key={`${keyPrefix}-raw`}>{text}</span>];
}

/** Burbuja de mensaje del bot con renderizado Markdown */
function BotMessage({ content }: { content: string }) {
  return <div className="text-xs text-slate-800 leading-relaxed">{parseMarkdown(content)}</div>;
}

export default function SendaBotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '🌷 Hola, soy **SendaBot**, tu asistente confidencial de la **Fundación Senda Mujer** en Cartagena.\n\nEstoy aquí para escucharte y orientarte sobre cualquier cosa que te preocupe: relaciones, salud emocional, derechos, embarazo, trabajo, crianza y más — de forma **gratuita y confidencial**.\n\n¿En qué puedo ayudarte hoy?',
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
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
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            data.reply ||
            'Recuerda que estamos contigo. Nuestro canal en Cartagena está activo **24/7**: **301 469 2095** o Línea Púrpura **155**.',
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'Nuestro canal directo en Cartagena está activo **24/7** en el **301 469 2095** o Línea Púrpura **155**. Estamos aquí contigo.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[999999] pointer-events-auto">

      {/* Botón flotante */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#E12880] via-rose-500 to-[#52166F] text-white px-4 py-3 sm:px-5 sm:py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 group relative border border-pink-300/40 cursor-pointer"
          aria-label="Abrir Chat SendaBot AI"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-ping pointer-events-none" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full pointer-events-none" />
          <RiRobot2Fill className="w-6 h-6 text-white shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-extrabold tracking-wide text-white whitespace-nowrap">
            SendaBot AI{' '}
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-md ml-1 font-extrabold uppercase">
              24/7
            </span>
          </span>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="bg-white rounded-3xl border border-pink-200/90 shadow-2xl w-[94vw] max-w-[420px] max-h-[85vh] h-[560px] sm:h-[600px] flex flex-col overflow-hidden animate-fadeIn transition-all duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-[#E12880] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#E12880] rounded-xl shadow-sm">
                <RiRobot2Fill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  SendaBot AI
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <span className="text-[10px] text-pink-200 block">
                  Orientación Confidencial · Cartagena
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-colors text-white cursor-pointer"
              aria-label="Cerrar Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 px-3.5 py-4 overflow-y-auto space-y-4 bg-gradient-to-b from-pink-50/50 to-purple-50/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#E12880] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <RiRobot2Fill className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`px-4 py-3 rounded-2xl max-w-[86%] break-words ${
                    msg.role === 'user'
                      ? 'bg-[#52166F] text-white rounded-tr-none shadow-sm text-xs font-medium leading-relaxed'
                      : 'bg-white border border-pink-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <BotMessage content={msg.content} />
                  ) : (
                    <span className="text-xs">{msg.content}</span>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-950" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-[11px] px-3 py-2 bg-white/80 rounded-xl border border-pink-100 w-fit shadow-sm">
                <Sparkles className="w-4 h-4 text-[#E12880] animate-spin" />
                <span className="font-semibold">SendaBot redactando respuesta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pills de acceso rápido */}
          <div className="px-3 py-2 bg-white border-t border-pink-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {[
              { label: '🩺 Cita Ginecología', msg: 'Quiero agendar cita de Ginecología' },
              { label: '🌸 Embarazo', msg: 'Tengo un embarazo no planeado' },
              { label: '🕊️ Violencia', msg: 'Sufro violencia de género en Cartagena' },
              { label: '🧠 Ansiedad', msg: 'Siento mucha ansiedad y no sé qué hacer' },
              { label: '💰 Emprender', msg: 'Quiero emprender pero no sé cómo' },
            ].map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleSend(pill.msg)}
                className="bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#52166F] text-[10px] font-bold px-3 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer whitespace-nowrap"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-pink-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje, estoy aquí para escucharte..."
              className="flex-1 bg-pink-50/60 px-4 py-2.5 rounded-full border border-pink-200/80 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-xs text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#E12880] hover:bg-[#c81e6e] text-white p-2.5 rounded-full disabled:opacity-40 transition-all shadow-sm cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
            >
              <RiSendPlaneFill className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
