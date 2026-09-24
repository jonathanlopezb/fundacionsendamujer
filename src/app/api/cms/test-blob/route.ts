/**
 * GET /api/cms/test-blob
 *
 * Diagnóstico exhaustivo del estado de Vercel Blob Storage.
 * Requiere sesión CMS activa.
 */

import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';
import { getVercelBlobToken } from '@/lib/blob-token';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = readCmsSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = getVercelBlobToken();

  // Variables de entorno disponibles (solo nombres, sin valores)
  const allKeys = Object.keys(process.env);
  const relevantKeys = allKeys.filter((k) =>
    k.includes('BLOB') || k.includes('VERCEL_BLOB') || k.includes('STORAGE')
  );

  if (!token) {
    return NextResponse.json({
      connected: false,
      tokenFound: false,
      message:
        'No se detectó un token de Vercel Blob válido en las variables de entorno de este runtime. ' +
        'Verifica que BLOB_READ_WRITE_TOKEN esté configurado en el proyecto y que el último despliegue sea posterior a esa configuración.',
      envKeysDetected: relevantKeys,
      runtime: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        vercelEnv: process.env.VERCEL_ENV || 'local',
        region: process.env.VERCEL_REGION || 'unknown',
      },
      howToFix: [
        '1. Abre Vercel → Storage → fundacionsendamujer-blob',
        '2. Pestaña "Projects" → Connect Project → selecciona fundacionsendamujer',
        '3. Vercel inyectará BLOB_READ_WRITE_TOKEN automáticamente en el next deploy',
        '4. Haz un redeploy desde Vercel o empuja un commit nuevo',
      ],
    });
  }

  try {
    const result = await list({ token, limit: 10 });

    return NextResponse.json({
      connected: true,
      tokenFound: true,
      tokenMasked: `${token.substring(0, 20)}…`,
      message: '✅ Conexión exitosa con Vercel Blob Storage.',
      blobCount: result.blobs.length,
      hasMore: result.hasMore,
      blobs: result.blobs.map((b) => ({
        url: b.url,
        pathname: b.pathname,
        size: `${(b.size / 1024).toFixed(1)} KB`,
        uploadedAt: b.uploadedAt,
      })),
      envKeysDetected: relevantKeys,
      runtime: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        vercelEnv: process.env.VERCEL_ENV || 'local',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      tokenFound: true,
      tokenMasked: `${token.substring(0, 20)}…`,
      message: `Token encontrado pero la llamada al SDK falló: ${error.message || 'Error desconocido'}`,
      errorCode: error?.status || error?.code || 'UNKNOWN',
      envKeysDetected: relevantKeys,
    });
  }
}
