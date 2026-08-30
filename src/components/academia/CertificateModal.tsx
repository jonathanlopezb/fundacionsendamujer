'use client';
import React from 'react';
import { X, Download, Share2, ShieldCheck, QrCode, Sparkles } from 'lucide-react';

interface Props {
  userName: string;
  courseTitle: string;
  courseCategory: string;
  onClose: () => void;
}

export default function CertificateModal({ userName, courseTitle, courseCategory, onClose }: Props) {
  const issueDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const certId = `SENDA-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-2xl animate-fadeIn bg-[#180325] border border-pink-500/30">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-pink-200 hover:text-white p-2 rounded-full transition-colors bg-white/10 z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-[#52166F]/80 border border-pink-400/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>¡Felicitaciones! Certificación Oficial Obtenida</span>
          </div>
          <h3 className="text-xl font-black text-white">Certificado Digital Verificable</h3>
        </div>

        {/* CERTIFICATE DISPLAY BOX */}
        <div className="relative rounded-2xl p-5 sm:p-8 border border-pink-400/40 shadow-2xl text-center space-y-5 overflow-hidden bg-gradient-to-b from-[#270538] via-[#3B0852] to-[#180325]">

          <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
            <div className="text-left flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Fundación Senda Mujer"
                className="h-7 sm:h-9 w-auto object-contain"
              />
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 border-l border-pink-500/30 pl-2">SendaAcademia</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-pink-200/80">ID: {certId}</span>
            </div>
          </div>

          <div className="space-y-2 py-2">
            <p className="text-xs text-pink-200 uppercase tracking-widest font-semibold">Otorga la presente Certificación de Acreditación a:</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300">
              {userName}
            </h2>
            <p className="text-xs text-pink-100 max-w-md mx-auto leading-relaxed pt-1">
              Por haber completado con éxito la ruta de aprendizaje y evaluaciones correspondientes al programa formativo:
            </p>
            <h4 className="text-lg font-extrabold text-white pt-1">
              "{courseTitle}"
            </h4>
            <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full text-pink-200 bg-[#52166F] border border-pink-400/30">
              {courseCategory}
            </span>
          </div>

          {/* Certificate footer with signatures and QR */}
          <div className="pt-4 border-t border-pink-500/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="text-left space-y-1">
              <div className="font-extrabold text-amber-300">Dra. Sorelvis Murillo</div>
              <div className="text-[10px] text-pink-200">Directora Ejecutiva — Fundación Senda Mujer</div>
              <div className="text-[9px] text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Firma Digital Verificada (+57 301 469 2095)
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-pink-500/20">
              <QrCode className="w-9 h-9 text-amber-300 shrink-0" />
              <div className="text-left">
                <div className="text-[9px] font-extrabold text-white uppercase">Verificación QR</div>
                <div className="text-[8px] text-pink-200">Expedición: {issueDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => alert(`Certificado ${certId} listo para descarga en formato PDF`)}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#52166F] border border-pink-400/40 shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Descargar Certificado (PDF)</span>
          </button>

          <button
            onClick={() => alert('Enlace de certificación copiado al portapapeles')}
            className="w-full sm:w-auto py-3.5 px-5 rounded-full text-xs font-extrabold text-pink-200 bg-[#52166F] hover:bg-[#3B0852] border border-pink-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>Compartir en LinkedIn</span>
          </button>
        </div>

      </div>
    </div>
  );
}
