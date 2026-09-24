import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';
import { getVercelBlobToken } from '@/lib/blob-token';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = readCmsSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
    return NextResponse.json(
      { error: 'Acceso no autorizado. Inicia sesión en el CMS para subir archivos.' },
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
    const blobToken = getVercelBlobToken();

    // 1. Si tenemos token de Vercel Blob, intentamos subir directamente al Blob CDN
    if (blobToken) {
      try {
        const blob = await put(finalFilename, fileBuffer, {
          access: 'public',
          contentType,
          token: blobToken,
        });

        return NextResponse.json({
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
          downloadUrl: blob.downloadUrl,
          provider: 'vercel-blob',
        });
      } catch (blobErr: any) {
        console.warn('Error subiendo a Vercel Blob, recurriendo a almacenamiento en MongoDB:', blobErr);
      }
    }

    // 2. Fallback garantizado: Codificar en Data URI optimizado para guardarlo directamente en MongoDB
    const base64String = fileBuffer.toString('base64');
    const dataUri = `data:${contentType};base64,${base64String}`;

    return NextResponse.json({
      url: dataUri,
      pathname: finalFilename,
      contentType,
      provider: blobToken ? 'inline-fallback' : 'mongodb-direct',
      message: blobToken
        ? 'Vercel Blob reportó un error; la imagen se guardó de forma segura directamente en la base de datos.'
        : 'Imagen procesada y guardada exitosamente en la base de datos.',
    });
  } catch (error: any) {
    console.error('Error al procesar la imagen:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error al procesar la imagen.',
        details: error.name || 'UploadError',
      },
      { status: 500 }
    );
  }
}
