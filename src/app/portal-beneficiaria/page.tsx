import Link from 'next/link';
import { Lock, ShieldAlert, GraduationCap, HeartPulse, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Portal Beneficiarias — Fundacion Senda Mujer',
  description: 'Acceso seguro al portal de beneficiarias. Academia de formacion y gestion de acompanamiento integral.',
};

export default function PortalBeneficiariaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8FA] via-pink-50 to-purple-50">

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center gap-8">

        {/* Badge */}
        <span className="bg-[#52166F]/10 text-[#52166F] font-extrabold text-xs px-4 py-2 rounded-full border border-[#52166F]/20 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          Portal Seguro — Solo Beneficiarias Registradas
        </span>

        {/* Title */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3B0852] leading-tight">
            Tu Portal de
            <span className="text-[#E12880]"> Acompanamiento </span>
            Integral
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
            Accede a tu academia de formacion, gestion de citas, seguimientos psicologicos, documentos y tu expediente personal. Todo en un solo lugar, seguro y confidencial.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { icon: GraduationCap, label: 'Academia y Cursos', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { icon: HeartPulse, label: 'Gestion Medica y Psicologica', color: 'bg-pink-50 text-pink-700 border-pink-200' },
            { icon: Lock, label: 'Documentos Cifrados', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { icon: ShieldAlert, label: 'Acceso 24/7', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          ].map(({ icon: Icon, label, color }) => (
            <span key={label} className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border ${color}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          ))}
        </div>

        {/* Main CTA */}
        <Link
          href="/portal-beneficiaria/ingresar"
          className="group bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold px-10 py-5 rounded-full text-lg shadow-2xl hover:shadow-[#E12880]/40 hover:scale-105 transition-all flex items-center gap-3"
        >
          <Lock className="w-5 h-5" />
          Ingresar al Portal de Beneficiarias
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-xs text-slate-500 max-w-sm">
          Protegido con cifrado SSL. Tus datos son tratados bajo la <strong>Ley 1581 de 2012</strong> de Habeas Data de Colombia.
        </p>

        {/* Emergency strip */}
        <div className="w-full max-w-lg bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-sm text-red-700">Necesitas ayuda urgente?</p>
              <p className="text-[11px] text-red-500">Sin registro requerido — Acceso inmediato</p>
            </div>
          </div>
          <Link
            href="/senda-sos"
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-full text-xs transition-all shrink-0 shadow-md"
          >
            SENDA SOS
          </Link>
        </div>
      </div>
    </div>
  );
}
