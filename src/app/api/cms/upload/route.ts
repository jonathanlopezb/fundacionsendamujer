import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/avif',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = readCmsSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
    return NextResponse.json(
      { error: 'Acceso no autorizado para subir archivos al almacenamiento Blob.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get('filename') || 'senda-imagen.jpg';

  // Sanitizar nombre de archivo
  const sanitizedFilename = rawFilename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');

  const finalFilename = `cms/${Date.now()}-${sanitizedFilename}`;

  try {
    if (!request.body) {
      return NextResponse.json({ error: 'El archivo está vacío' }, { status: 400 });
    }

    const contentType = request.headers.get('content-type') || 'application/octet-stream';

    // Si no está configurado el token de Vercel Blob en local, retornar mock funcional
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN no detectado. Retornando URL de subida simulada.');
      return NextResponse.json({
        url: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85&mock=${Date.now()}`,
        pathname: finalFilename,
        contentType,
        isMock: true,
        message: 'Modo local sin token BLOB_READ_WRITE_TOKEN. Configure la variable en Vercel para almacenamiento permanente.',
      });
    }

    const blob = await put(finalFilename, request.body, {
      access: 'public',
      contentType,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error: any) {
    console.error('Error al subir imagen a Blob:', error);
    return NextResponse.json(
      { error: error.message || 'Error al subir la imagen al almacenamiento Blob' },
      { status: 500 }
    );
  }
}
