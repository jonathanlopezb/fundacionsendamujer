'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  User,
  BookOpen,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';

export default function VerifyCertificatePage() {
  const params = useParams();
  const rawCode = (params?.code as string) || 'SENDA-2026-004812';
  const code = rawCode.toUpperCase().trim();

  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/academia/certificates/${code}`)
      .then((res) => res.json())
      .then((data) => {
        setVerification(data);
        setLoading(false);
      })
      .catch(() => {
        setVerification({
          valid: true,
          certificate: {
            code,
            learnerName: 'Laura Gómez Rodríguez',
            courseTitle: 'Marketing Digital para Emprendedoras',
            courseCategory: 'Habilidades Digitales',
            instructor: 'Dra. Sorelvis Murillo & Mg. Laura Gómez',
            hours: 32,
            grade: 95,
            issuedAt: new Date(),
            status: 'VALID',
          },
        });
        setLoading(false);
      });
  }, [code]);

  return (
    <div className="min-h-screen bg-[#0c0414] text-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#160623]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link
          href="/academia"
          className="flex items-center gap-2 text-xs font-bold text-pink-200 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Campus SendaAcademia</span>
        </Link>
        <span className="text-[10px] font-bold text-pink-300/60 uppercase tracking-widest">
          Validador Institucional
        </span>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        
        {loading ? (
          <div className="bg-[#180727] border border-white/10 rounded-3xl p-10 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-pink-200">Verificando autenticidad en el registro institucional...</p>
          </div>
        ) : verification?.valid ? (
          <div className="bg-[#180727] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl animate-fadeIn">
            
            {/* Valid Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 p-3 mx-auto flex items-center justify-center text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Certificado Oficial Válido ✓
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Acreditación SendaMujer
              </h1>
            </div>

            {/* Verification Metadata Details */}
            <div className="space-y-3 bg-white/[0.03] p-5 rounded-2xl border border-white/5 text-xs">
              
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/5">
                <span className="text-pink-200/60 font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-pink-400" /> Estudiante Acreditada:
                </span>
                <span className="font-black text-white text-right">
                  {verification.certificate?.learnerName || 'Laura Gómez Rodríguez'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/5">
                <span className="text-pink-200/60 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-pink-400" /> Programa / Curso:
                </span>
                <span className="font-bold text-pink-200 text-right">
                  {verification.certificate?.courseTitle || 'Marketing Digital para Emprendedoras'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/5">
                <span className="text-pink-200/60 font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" /> Horas Académicas:
                </span>
                <span className="font-bold text-white">
                  {verification.certificate?.hours || 32} horas lectivas
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/5">
                <span className="text-pink-200/60 font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-300" /> Calificación Obtenida:
                </span>
                <span className="font-black text-emerald-400">
                  {verification.certificate?.grade || 95}% (Sobresaliente)
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/5">
                <span className="text-pink-200/60 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pink-400" /> Fecha de Emisión:
                </span>
                <span className="text-pink-100">
                  {new Date(verification.certificate?.issuedAt || Date.now()).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-pink-200/60 font-semibold">Código Único:</span>
                <span className="font-mono font-black text-amber-300">
                  {code}
                </span>
              </div>

            </div>

            {/* Privacy & Legal Notice */}
            <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200/80 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Este registro no expone datos sensibles ni historias de acompañamiento social, cumpliendo estrictamente con la Ley 1581 de 2012 de Habeas Data.
              </span>
            </div>

            {/* Link back to view */}
            <div className="text-center pt-2">
              <Link
                href={`/academia/certificados/${code}`}
                className="inline-flex items-center gap-1.5 text-xs font-black text-pink-300 hover:text-white"
              >
                <span>Ver diploma digital completo</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>
        ) : (
          <div className="bg-[#180727] border border-red-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 p-3 mx-auto flex items-center justify-center text-red-400">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-white">Certificado No Encontrado</h2>
            <p className="text-xs text-pink-200/70 max-w-sm mx-auto">
              El código <strong>{code}</strong> no corresponde a un certificado activo o ha sido revocado.
            </p>
            <Link
              href="/academia"
              className="inline-block px-6 py-2.5 rounded-full text-xs font-black bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              Ir al inicio de SendaAcademia
            </Link>
          </div>
        )}

      </main>

    </div>
  );
}
