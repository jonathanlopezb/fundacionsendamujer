import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = readCmsSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
    return NextResponse.json(
      { error: 'Acceso no autorizado para subir archivos al almacenamiento Blob.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryFilename = searchParams.get('filename');

  try {
    let fileBuffer: Buffer | null = null;
    let filename = queryFilename || 'senda-upload.jpg';
    let contentType = 'image/jpeg';

    const reqContentType = request.headers.get('content-type') || '';

    if (reqContentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No se encontró ningún archivo en el formulario' }, { status: 400 });
      }
      filename = file.name || filename;
      contentType = file.type || contentType;
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      const arrayBuffer = await request.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        return NextResponse.json({ error: 'El archivo está vacío' }, { status: 400 });
      }
      fileBuffer = Buffer.from(arrayBuffer);
      contentType = reqContentType || contentType;
    }

    // Sanitizar nombre de archivo
    const sanitizedFilename = filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');

    const finalFilename = `cms/${Date.now()}-${sanitizedFilename}`;

    // Si no está configurado el token de Vercel Blob en local, retornar fallback
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN no detectado en variables de entorno. Retornando URL simulada.');
      return NextResponse.json({
        url: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85&upload=${Date.now()}`,
        pathname: finalFilename,
        contentType,
        isMock: true,
        message: 'Modo local sin token BLOB_READ_WRITE_TOKEN. Configure BLOB_READ_WRITE_TOKEN en Vercel para almacenamiento permanente.',
      });
    }

    const blob = await put(finalFilename, fileBuffer, {
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
