import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = readCmsSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_TOKEN;

  if (!token) {
    return NextResponse.json({
      connected: false,
      message: 'BLOB_READ_WRITE_TOKEN no está definido en variables de entorno.',
    });
  }

  try {
    const result = await list({ token, limit: 5 });
    return NextResponse.json({
      connected: true,
      message: 'Conexión con Vercel Blob establecida correctamente.',
      blobCount: result.blobs.length,
      blobs: result.blobs.map((b) => ({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      message: error.message || 'Error al conectar con Vercel Blob SDK.',
      errorDetails: error.name || 'BlobError',
    });
  }
}
