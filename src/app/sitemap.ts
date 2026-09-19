import type { MetadataRoute } from 'next';

const BASE_URL = 'https://fundacionsendamujer.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/nosotros',
    '/programas',
    ...['mujer-acompanada','violencia-sexual','contencion-psicosocial','salud-y-derechos','embarazo-con-apoyo','mujer-y-justicia','proyecto-de-vida-y-autonomia'].map((slug) => `/programas/${slug}`),
    '/senda-universal',
    '/triaje-psicologico',
    '/agendar-cita',
    '/ruta-cartagena',
    '/mapa-caribe-seguro',
    '/donar',
    '/proyecto-de-vida',
    '/academia',
    '/caribe-seguro',
    '/observatorio',
    '/galeria',
    '/senda-sos',
    '/certificacion',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
