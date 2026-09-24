import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';
import { getVercelBlobToken, getAvailableEnvKeyNames } from '@/lib/blob-token';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = readCmsSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = getVercelBlobToken();
  const allEnvKeys = getAvailableEnvKeyNames();
  const relevantKeys = allEnvKeys.filter(
    (k) => k.includes('BLOB') || k.includes('VERCEL') || k.includes('STORAGE') || k.includes('TOKEN')
  );

  if (!token) {
    return NextResponse.json({
      connected: false,
      message:
        'No se detectó un token de Vercel Blob en las variables de entorno de este despliegue. Asegúrate de que BLOB_READ_WRITE_TOKEN esté configurado y que el proyecto haya sido redesplegado.',
      activeEnvKeys: relevantKeys,
      allKeysCount: allEnvKeys.length,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'local/custom',
    });
  }

  try {
    const result = await list({ token, limit: 10 });
    return NextResponse.json({
      connected: true,
      message: 'Conexión con Vercel Blob establecida correctamente.',
      tokenDetected: true,
      tokenMasked: `${token.substring(0, 18)}...`,
      blobCount: result.blobs.length,
      hasMore: result.hasMore,
      blobs: result.blobs.map((b) => ({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
      activeEnvKeys: relevantKeys,
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      message: error.message || 'Error al conectar con Vercel Blob SDK.',
      errorDetails: error.name || 'BlobError',
      tokenDetected: true,
      tokenMasked: `${token.substring(0, 18)}...`,
      activeEnvKeys: relevantKeys,
    });
  }
}
