'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, MessageSquare, Phone, EyeOff, X, ArrowRight, AlertTriangle,
} from 'lucide-react';
import CamouflageOverlay from '@/components/CamouflageOverlay';

type Mode = null | 'help_now' | 'cant_talk' | 'can_write';
type RiskLevel = null | 'red' | 'orange' | 'yellow';

const EMERGENCY_NUMBERS = [
  { label: 'Linea Purpura Nacional', number: '155', desc: 'Atencion a mujeres victimas de violencia' },
  { label: 'Policia Nacional', number: '123', desc: 'Emergencias en Colombia' },
  { label: 'Fundacion Senda Mujer', number: '+57 317 657 5800', href: 'tel:3176575800', desc: 'Linea directa Cartagena 24/7' },
  { label: 'Fiscalia General', number: '122', desc: 'Denuncia de violencia sexual y VBG' },
  { label: 'ICBF', number: '141', desc: 'Proteccion de menores de edad' },
];

const QUICK_SITUATIONS = [
  { label: 'Estoy embarazada y tengo miedo', risk: 'red' as RiskLevel },
  { label: 'Mi pareja esta aqui y tengo miedo', risk: 'red' as RiskLevel },
  { label: 'Sufri una agresion sexual', risk: 'red' as RiskLevel },
  { label: 'Necesito orientacion psicologica', risk: 'orange' as RiskLevel },
  { label: 'Necesito ayuda legal', risk: 'orange' as RiskLevel },
  { label: 'Quiero conocer mis derechos', risk: 'yellow' as RiskLevel },
];

export default function SendaSOS() {
  const [mode, setMode] = useState<Mode>(null);
  const [risk, setRisk] = useState<RiskLevel>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [camouflageOpen, setCamouflageOpen] = useState(false);

  // ESC key -> show CamouflageOverlay instead of leaving the site
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !camouflageOpen) {
        setCamouflageOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [camouflageOpen]);

  const handleSend = () => setSent(true);

  return (
    <>
      {/* Camouflage Overlay — shows Senda Bienestar page; closing it returns to SENDA SOS */}
      <CamouflageOverlay
        isOpen={camouflageOpen}
        onClose={() => setCamouflageOpen(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#3B0852] via-[#52166F] to-[#E12880] flex items-center justify-center px-4 py-8">

        {/* Quick Exit Button — top right, always visible */}
        <button
          onClick={() => setCamouflageOpen(true)}
          className="fixed top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white font-extrabold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 border border-white/30 backdrop-blur-sm transition-all cursor-pointer"
          title="Ocultar pantalla rapidamente [ESC]"
        >
          <EyeOff className="w-4 h-4" />
          OCULTAR PANTALLA [ESC]
        </button>

        <div className="w-full max-w-lg space-y-6">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto border border-white/20 backdrop-blur-sm">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">SENDA SOS</h1>
            <p className="text-pink-100 text-sm max-w-sm mx-auto leading-relaxed">
              Estas en un espacio seguro. No necesitas registrarte.<br />
              <strong className="text-amber-300">Que esta pasando?</strong>
            </p>
          </div>

          {/* Mode Selection */}
          {!mode && !risk && (
            <div className="space-y-3">
              <button
                onClick={() => setMode('help_now')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-5 px-6 rounded-2xl text-base shadow-2xl flex items-center gap-4 cursor-pointer transition-all border-2 border-red-400"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold">NECESITO AYUDA AHORA</div>
                  <div className="text-xs text-red-200 font-normal mt-0.5">Peligro inminente - Accion inmediata</div>
                </div>
              </button>

              <button
                onClick={() => setMode('cant_talk')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-5 px-6 rounded-2xl text-base shadow-xl flex items-center gap-4 cursor-pointer transition-all border-2 border-amber-400"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold">NO PUEDO HABLAR</div>
                  <div className="text-xs text-amber-100 font-normal mt-0.5">El agresor esta cerca - Solo veo opciones</div>
                </div>
              </button>

              <button
                onClick={() => setMode('can_write')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-extrabold py-5 px-6 rounded-2xl text-base shadow-xl flex items-center gap-4 cursor-pointer transition-all border-2 border-white/20 backdrop-blur-sm"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold">PUEDO ESCRIBIR</div>
                  <div className="text-xs text-pink-200 font-normal mt-0.5">Cuentame que esta pasando</div>
                </div>
              </button>
            </div>
          )}

          {/* Mode: Help Now */}
          {mode === 'help_now' && (
            <div className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> MODO PROTECCION ACTIVADO
                </h2>
                <button onClick={() => setMode(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-600">Cual es tu situacion?</p>
              <div className="space-y-2">
                {QUICK_SITUATIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setRisk(s.risk)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-sm font-bold text-red-800 cursor-pointer transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-extrabold text-slate-700 mb-2">Lineas de Emergencia:</p>
                {EMERGENCY_NUMBERS.slice(0, 3).map((n) => (
                  <a key={n.number} href={n.href || `tel:${n.number}`} className="flex items-center gap-2 py-1.5 text-sm font-bold text-red-700 hover:text-red-900">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{n.label}: <strong>{n.number}</strong></span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Mode: Can't Talk */}
          {mode === 'cant_talk' && (
            <div className="bg-white rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-amber-700 flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Contacto Silencioso
                </h2>
                <button onClick={() => setMode(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Si no puedes hablar, <strong>envianos un mensaje de WhatsApp</strong>. Solo escribe <strong>1</strong> si estas en peligro inmediato.
              </p>
              <a
                href="https://wa.me/573176575800?text=1"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl text-center text-base shadow-lg transition-all"
              >
                Enviar 1 por WhatsApp - Estoy en peligro
              </a>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-bold text-amber-700 mb-2">Codigo de respuesta segura:</p>
                <p className="text-xs text-amber-600">1 = Peligro inmediato - 2 = Necesito ayuda - 3 = Estoy bien</p>
              </div>
              <div className="space-y-2">
                {EMERGENCY_NUMBERS.slice(0, 3).map((n) => (
                  <a key={n.number} href={n.href || `tel:${n.number}`} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-100">
                    <span>{n.label}</span>
                    <span className="text-amber-600">{n.number}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Mode: Can Write */}
          {mode === 'can_write' && !sent && (
            <div className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[#52166F] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#E12880]" /> Cuentame que esta pasando
                </h2>
                <button onClick={() => setMode(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500">No tienes que explicarlo todo. Escribe lo que puedas. Es confidencial.</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Puedes escribir aqui... Mi pareja me lastimo, no se que hacer..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#E12880] text-sm resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`flex-1 font-extrabold py-3 rounded-full text-sm transition-all flex items-center justify-center gap-2 ${message.trim() ? 'bg-[#E12880] text-white hover:bg-[#c41070] cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Enviar a Equipo Senda <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/573176575800?text=${encodeURIComponent(message || 'Necesito ayuda')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 text-white font-extrabold px-4 py-3 rounded-full text-xs hover:bg-emerald-600 transition-all flex items-center gap-1"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Sent confirmation */}
          {mode === 'can_write' && sent && (
            <div className="bg-white rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-[#52166F]">Mensaje Recibido</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Nuestro equipo en Cartagena revisara tu mensaje. Te contactaremos lo antes posible.</p>
              <a href="tel:3176575800" className="block bg-[#E12880] text-white font-extrabold py-3 rounded-full text-sm hover:bg-[#c41070] transition-all">
                Llamar Ahora: 317 657 5800
              </a>
            </div>
          )}

          {/* Risk Detail */}
          {risk && (
            <div className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-[#52166F]">Tu Siguiente Paso</h2>
                <button onClick={() => { setRisk(null); setMode(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {risk === 'red' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-extrabold text-red-700 mb-2">Situacion de riesgo detectada</p>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Llama ahora a la Linea Purpura <strong>155</strong> o a nuestra linea directa <strong>317 657 5800</strong>. Si estas en peligro inmediato, llama al <strong>123</strong>.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {EMERGENCY_NUMBERS.map((n) => (
                  <a key={n.number} href={n.href || `tel:${n.number}`} className="flex items-center justify-between py-3 px-4 rounded-xl bg-pink-50 border border-pink-100 hover:bg-pink-100 transition-all">
                    <div>
                      <div className="text-xs font-extrabold text-[#52166F]">{n.label}</div>
                      <div className="text-[10px] text-slate-500">{n.desc}</div>
                    </div>
                    <span className="font-extrabold text-[#E12880] text-sm">{n.number}</span>
                  </a>
                ))}
              </div>
              <a
                href="/portal-beneficiaria"
                className="block w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3 rounded-full text-sm text-center hover:shadow-lg transition-all"
              >
                Acceder a Mi Portal de Acompanamiento
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-pink-200 space-y-2 pb-4">
            <p>Fundacion Senda Mujer - Cartagena de Indias</p>
            <p>Esta pagina es completamente confidencial.</p>
            <button
              onClick={() => setCamouflageOpen(true)}
              className="inline-flex items-center gap-1.5 text-pink-300 hover:text-white underline cursor-pointer font-bold transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Ocultar esta pantalla rapidamente
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
