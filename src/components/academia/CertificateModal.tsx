'use client';
import React, { useRef } from 'react';
import { X, Award, Download, Share2, ShieldCheck, CheckCircle2, QrCode, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl animate-fadeIn"
        style={{ background: '#12121c', border: '1px solid rgba(255,255,255,0.12)' }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full transition-colors z-20"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-300"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>¡Felicitaciones! Certificación Oficial Obtenida</span>
          </div>
          <h3 className="text-xl font-black text-white">Certificado Digital Verificable</h3>
        </div>

        {/* CERTIFICATE DISPLAY BOX */}
        <div className="relative rounded-2xl p-6 sm:p-8 border shadow-2xl text-center space-y-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #181528 0%, #0d1222 100%)',
            borderColor: 'rgba(124,58,237,0.4)',
            boxShadow: '0 0 40px rgba(124,58,237,0.15)'
          }}>

          {/* Background watermark seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none opacity-5 flex items-center justify-center">
            <Award className="w-60 h-60 text-purple-400" />
          </div>

          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="text-left">
              <span className="font-extrabold text-sm text-white tracking-wide">Senda</span>
              <span className="font-extrabold text-sm tracking-wide text-cyan-400">Academia</span>
              <p className="text-[9px] uppercase tracking-widest text-purple-300">Fundación Senda Mujer • Cartagena</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-400">ID: {certId}</span>
            </div>
          </div>

          <div className="space-y-2 py-2">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Otorga el presente Certificado de Acreditación a:</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300">
              {userName}
            </h2>
            <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed pt-1">
              Por haber completado con éxito la ruta de aprendizaje y evaluaciones correspondientes al programa formativo:
            </p>
            <h4 className="text-lg font-bold text-white pt-1">
              "{courseTitle}"
            </h4>
            <span className="inline-block text-[10px] font-bold px-3 py-0.5 rounded-full text-cyan-300"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              {courseCategory}
            </span>
          </div>

          {/* Certificate footer with signatures and QR */}
          <div className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="text-left space-y-1">
              <div className="font-semibold text-white">Dra. Sorelvis Caldera</div>
              <div className="text-[10px] text-gray-400">Directora Ejecutiva — Fundación Senda Mujer</div>
              <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Firma Digital Verificada
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
              <QrCode className="w-9 h-9 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-[9px] font-bold text-gray-300 uppercase">Verificación QR</div>
                <div className="text-[8px] text-gray-500">Expedición: {issueDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => alert(`Certificado ${certId} listo para descarga en formato PDF`)}
            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            <Download className="w-4 h-4" />
            <span>Descargar Certificado (PDF)</span>
          </button>

          <button
            onClick={() => alert('Enlace de certificación copiado al portapapeles')}
            className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-semibold text-gray-300 transition-all flex items-center justify-center gap-2"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir en LinkedIn</span>
          </button>
        </div>

      </div>
    </div>
  );
}
