'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  FileCheck2,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowLeft,
  Loader2,
  Lock,
  ExternalLink,
} from 'lucide-react';

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

function VerificationContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || searchParams.get('hash') || '';

  const [searchTerm, setSearchTerm] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const verifyCertificate = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const isHash = term.length > 15 && !term.startsWith('CERT');
      const param = isHash ? `hash=${encodeURIComponent(term.trim())}` : `code=${encodeURIComponent(term.trim())}`;
      const res = await fetch(`/api/verificar-certificado?${param}`);
      const data = await res.json();

      if (res.ok && data.certificate) {
        setResult(data.certificate);
      } else {
        setResult(null);
        setError(data.error || 'No se encontró ningún certificado tributario con ese código.');
      }
    } catch (err) {
      setError('Error al consultar el servicio de verificación.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      verifyCertificate(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCertificate(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.jpg" alt="Fundación Senda Mujer" className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity" />
            <div>
              <span className="font-bold text-sm text-white tracking-wide block">FUNDACIÓN SENDA MUJER</span>
              <span className="text-[10px] text-rose-400 font-semibold tracking-wider block">PORTAL OFICIAL DE VERIFICACIÓN DIAN</span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Banner de Verificación */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Sistema de Trazabilidad y Autenticidad Fiscal RTE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verificación Pública de Certificados Tributarios
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Consulte la autenticidad y los datos oficiales de los certificados de donación emitidos por la Fundación Senda Mujer conforme al Régimen Tributario Especial (Art. 125-1 a 125-5 del Estatuto Tributario).
          </p>
        </div>

        {/* Buscador */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/90 focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <Search className="w-5 h-5 absolute left-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Ingrese consecutivo (ej. CERT-RTE-2026-00001) o Hash..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-32 py-3.5 text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Verificar</span>
            </button>
          </div>
        </form>

        {/* Resultados de Verificación */}
        {loading && (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Consultando registros tributarios oficiales...</p>
          </div>
        )}

        {searched && !loading && error && (
          <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-red-950/40 border border-red-800/60 text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-red-300">Certificado No Encontrado</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">{error}</p>
            <p className="text-[11px] text-slate-500 font-mono">
              Verifique que el consecutivo oficial o el código hash coincidan exactamente con el impreso en el documento.
            </p>
          </div>
        )}

        {searched && !loading && result && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Status Header */}
            <div className={`p-6 border-b ${
              result.status === 'EMITIDO'
                ? 'bg-emerald-950/40 border-emerald-800/60'
                : 'bg-red-950/40 border-red-800/60'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    result.status === 'EMITIDO'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {result.status === 'EMITIDO' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                      result.status === 'EMITIDO' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {result.status === 'EMITIDO' ? 'CERTIFICADO VÁLIDO Y AUTÉNTICO' : 'DOCUMENTO ANULADO'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-mono font-black text-white">{result.code}</h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Año Gravable</span>
                  <span className="text-sm font-bold text-white font-mono">{result.fiscalYear}</span>
                </div>
              </div>

              {result.status === 'ANULADO' && (
                <div className="mt-4 p-3 rounded-xl bg-red-900/30 border border-red-700/40 text-xs text-red-200 space-y-1">
                  <p className="font-bold">Motivo de Anulación Registrado:</p>
                  <p className="text-slate-300 italic">&ldquo;{result.voidReason}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Datos Oficiales Validados */}
            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Donante / Razón Social</span>
                  <p className="font-bold text-sm text-white">{result.donorName}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{result.donorDocumentType} {result.donorDocumentNumber}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Valor Donado Certificado</span>
                  <p className="font-black text-base text-emerald-400 font-mono">{COP(result.amount)}</p>
                  <p className="text-slate-400 text-[10px] uppercase font-medium truncate" title={result.amountInWords}>
                    {result.amountInWords}
                  </p>
                </div>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                <div className="p-3.5 bg-slate-950/40 flex items-center justify-between">
                  <span className="text-slate-400">Fecha de la Donación:</span>
                  <span className="font-semibold text-white font-mono">{result.donationDate}</span>
                </div>
                <div className="p-3.5 bg-slate-950/40 flex items-center justify-between">
                  <span className="text-slate-400">Fecha de Expedición DIAN:</span>
                  <span className="font-semibold text-white font-mono">{result.issueDate}</span>
                </div>
                <div className="p-3.5 bg-slate-950/40 flex items-center justify-between">
                  <span className="text-slate-400">Modalidad:</span>
                  <span className="font-semibold text-white">{result.donationType} ({result.donationMethod})</span>
                </div>
                <div className="p-3.5 bg-slate-950/40 space-y-1">
                  <span className="text-slate-400 block">Destinación Social (Actividad Meritoria):</span>
                  <p className="font-bold text-rose-400">{result.destinationProgram}</p>
                </div>
              </div>

              {/* Datos de la Entidad Emisora */}
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                  <span>Entidad Emisora Calificada</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-0.5">
                  <p className="font-bold text-white">{result.issuerName} · NIT {result.issuerNit}</p>
                  <p className="text-slate-400 text-[10px]">{result.issuerRteStatus}</p>
                  <p className="text-slate-400 text-[10px]">
                    Firmado por: <strong>{result.issuerLegalRep}</strong> y <strong>{result.issuerAccountant} ({result.issuerAccountantTp})</strong>
                  </p>
                </div>
              </div>

              {/* Hash Criptográfico */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[10px]">
                <span className="text-slate-500 uppercase block font-bold">Código Criptográfico de Verificación SHA-256</span>
                <span className="text-slate-300 break-all">{result.verificationCode}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Fundación Senda Mujer · NIT 901.789.456-1 · Cartagena de Indias, Colombia</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Certificados emitidos bajo el amparo de los Artículos 125-1 a 125-5 del Estatuto Tributario y Decreto 2150 de 2017.
        </p>
      </footer>
    </div>
  );
}

export default function VerificarCertificadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-rose-500 mr-2" />
        Cargando portal de verificación...
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}
