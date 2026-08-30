import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'SendaAcademia — Plataforma de Formación & Emprendimiento | Fundación Senda Mujer',
  description: 'Plataforma de formación digital de la Fundación Senda Mujer en Cartagena. Cursos certificados en emprendimiento, derechos humanos, salud integral y habilidades digitales.',
};

export default function AcademiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased min-h-screen text-slate-100"
        style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", background: '#180325' }}
      >
        {children}
      </body>
    </html>
  );
}
