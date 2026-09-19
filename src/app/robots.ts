import type { MetadataRoute } from 'next';

const BASE_URL = 'https://fundacionsendamujer.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/portal-beneficiaria/', '/encuestas/', '/analisis-encuestas/', '/analisis-encuentas/'] }],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
