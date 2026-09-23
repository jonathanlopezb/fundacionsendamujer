import type { Metadata, Viewport } from 'next';
import './globals.css';
import SiteShell from '@/components/SiteShell';

const siteUrl = 'https://fundacionsendamujer.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Fundación Senda Mujer | Mujeres, derechos y acompañamiento en Cartagena', template: '%s | Fundación Senda Mujer' },
  description: 'Fundación Senda Mujer acompaña a mujeres y niñas en Cartagena con orientación social, psicológica, médica, jurídica y oportunidades de autonomía.',
  applicationName: 'Fundación Senda Mujer',
  alternates: { canonical: '/', languages: { 'es-CO': '/' } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', locale: 'es_CO', url: siteUrl, siteName: 'Fundación Senda Mujer', title: 'Fundación Senda Mujer | Mujeres, derechos y acompañamiento en Cartagena', description: 'Acompañamiento integral para mujeres y niñas en Cartagena. Acompañamos · Protegemos · Transformamos.', images: [{ url: `${siteUrl}/logo.png`, width: 1200, height: 630, alt: 'Fundación Senda Mujer — Acompañamos, Protegemos, Transformamos' }] },
  twitter: { card: 'summary_large_image', title: 'Fundación Senda Mujer', description: 'Acompañamiento integral para mujeres y niñas en Cartagena. Acompañamos · Protegemos · Transformamos.', images: [`${siteUrl}/logo.png`] },
  icons: { icon: '/logo.png', apple: '/logo.png' },
};

export const viewport: Viewport = { themeColor: '#52166F', width: 'device-width', initialScale: 1 };

const structuredData = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'NGO', '@id': `${siteUrl}/#organization`, name: 'Fundación Senda Mujer', alternateName: 'Senda Mujer', url: siteUrl, logo: `${siteUrl}/logo.png`, description: 'Fundación que acompaña, protege y fortalece integralmente a mujeres y niñas.', telephone: '+57 301 469 2095', address: { '@type': 'PostalAddress', addressLocality: 'Cartagena de Indias', addressRegion: 'Bolívar', addressCountry: 'CO' }, areaServed: [{ '@type': 'City', name: 'Cartagena de Indias' }, { '@type': 'Country', name: 'Colombia' }] },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Fundación Senda Mujer', alternateName: 'Senda Mujer', publisher: { '@id': `${siteUrl}/#organization` }, inLanguage: 'es-CO' },
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-CO" className="scroll-smooth"><body className="bg-[#FDF8FA] text-slate-800 antialiased min-h-screen flex flex-col justify-between"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /><SiteShell>{children}</SiteShell></body></html>;
}
