import type { MetadataRoute } from 'next';

const BASE_URL = 'https://fundacionsendamujer.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/nosotros',
    '/programas',
    '/senda-universal',
    '/triaje-psicologico',
    '/agendar-cita',
    '/ruta-cartagena',
    '/mapa-caribe-seguro',
    '/donar',
    '/proyecto-de-vida',
    '/academia',
    '/caribe-seguro',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
