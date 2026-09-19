'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  ChevronLeft,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Printer,
} from 'lucide-react';

export default function CertificatePage() {
  const params = useParams();
  const certificateId = (params?.id as string) || 'SENDA-2026-004812';

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('senda_academia_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser({ name: 'Laura Gómez Rodríguez', email: 'laura.gomez@sendamujer.org' });
    }
  }, []);

  const studentName = user?.name || 'Laura Gómez Rodríguez';
  const certCode = certificateId.startsWith('SENDA-') ? certificateId : 'SENDA-2026-004812';
  const verifyUrl = `https://fundacionsendamujer.org/academia/verificar/${certCode}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-slate-100 flex flex-col">
      
      {/* Top Header */}
      <header className="no-print sticky top-0 z-40 bg-[#160623]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/academia"
          className="flex items-center gap-1 text-xs font-bold text-pink-200 hover:text-white bg-white/[0.06] hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al campus</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-pink-100 border border-white/10 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </header>

      {/* Certificate Viewer matching Blueprint Vista Certificado */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center items-center">
        
        {/* Certificate Container with Royal / Academic Framing */}
        <div
          id="certificate-frame"
          className="w-full bg-white text-slate-900 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border-8 border-[#52166F]/20"
          style={{
            backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(225,40,128,0.06) 0%, transparent 60%), radial-gradient(circle at 0% 0%, rgba(82,22,111,0.06) 0%, transparent 60%)',
          }}
        >
          {/* Top Floral & Branding Ornament */}
          <div className="flex flex-col items-center text-center space-y-3">
            <img
              src="/logo.png"
              alt="Fundación Senda Mujer"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#52166F]">
                Fundación Senda Mujer
              </p>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                CERTIFICADO DE FINALIZACIÓN
              </h1>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="my-8 text-center space-y-4">
            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Se otorga con distinción académica a:
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-[#52166F] border-b-2 border-[#E12880]/30 pb-2 inline-block px-8">
              {studentName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
              Por haber completado satisfactoriamente el programa de formación integral en{' '}
              <strong className="text-slate-900 font-extrabold">Marketing Digital para Emprendedoras</strong>{' '}
              de la Fundación Senda Mujer, acreditando 32 horas lectivas y prácticas con un promedio sobresaliente.
            </p>
          </div>

          {/* Bottom Signatures & Seal */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 text-center sm:text-left">
            
            {/* Date & Location */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha de Emisión:</p>
              <p className="text-xs font-black text-slate-900">18 de septiembre de 2026</p>
              <p className="text-[10px] text-slate-400">Cartagena de Indias, Colombia</p>
            </div>

            {/* Signature Directora */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-lg text-slate-800 tracking-widest">Sorelvis Murillo</span>
              </div>
              <div className="w-36 h-[1.5px] bg-slate-400 mx-auto" />
              <p className="text-[11px] font-black text-slate-900">Dra. Sorelvis Murillo</p>
              <p className="text-[10px] text-slate-500 font-semibold">Directora General Senda Mujer</p>
            </div>

            {/* Gold Ribbon Badge & QR Verification */}
            <div className="flex items-center justify-center sm:justify-end gap-3">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Código Único:</p>
                <p className="text-[11px] font-mono font-black text-[#E12880]">{certCode}</p>
                <Link
                  href={`/academia/verificar/${certCode}`}
                  className="text-[10px] text-pink-600 font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Validar QR</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>

              {/* QR Code Graphic */}
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg p-1 flex items-center justify-center shadow-inner">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
            </div>

          </div>

        </div>

        {/* Verification Link Card */}
        <div className="no-print mt-6 bg-[#180727] border border-white/10 rounded-2xl p-4 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Certificado Oficial Verificable</p>
              <p className="text-[11px] text-pink-200/60">Cualquier persona o entidad puede comprobar la validez en línea.</p>
            </div>
          </div>

          <Link
            href={`/academia/verificar/${certCode}`}
            className="px-4 py-2 rounded-full text-xs font-black bg-white/10 hover:bg-white/20 text-white transition-all text-center"
          >
            Ver comprobación pública ↗
          </Link>
        </div>

      </main>

    </div>
  );
}
