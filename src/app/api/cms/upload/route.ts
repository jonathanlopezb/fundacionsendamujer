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

    const blobToken =
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_TOKEN ||
      process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

    // 1. Intentar subir directamente a Vercel Blob
    try {
      const blob = await put(finalFilename, fileBuffer, {
        access: 'public',
        contentType,
        token: blobToken || undefined,
      });

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        downloadUrl: blob.downloadUrl,
        provider: 'vercel-blob',
      });
    } catch (blobErr: any) {
      console.warn('⚠️ Subida a Vercel Blob falló o token no configurado:', blobErr?.message);

      // 2. Fallback real: Retornar el archivo del usuario codificado en Base64
      // De esta forma siempre se almacena y visualiza la foto REAL que el usuario subió.
      const base64Url = `data:${contentType};base64,${fileBuffer.toString('base64')}`;

      return NextResponse.json({
        url: base64Url,
        pathname: finalFilename,
        contentType,
        provider: 'base64-fallback',
        warning: 'BLOB_READ_WRITE_TOKEN no configurado en Vercel. Se guardó la imagen real en base de datos.',
      });
    }
  } catch (error: any) {
    console.error('Error al procesar subida de imagen:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
}
