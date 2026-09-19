import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/academia' },
  title: 'SendaAcademia — Plataforma Educativa & Campus Digital | Fundación Senda Mujer',
  description: 'Plataforma educativa y LMS institucional de la Fundación Senda Mujer. Cursos certificados en marketing digital, emprendimiento, derechos humanos, salud integral y habilidades digitales.',
};

export default function AcademiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="antialiased min-h-screen text-slate-100 bg-[#0c0414]"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      {children}
    </div>
  );
}
