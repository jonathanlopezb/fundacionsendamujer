import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get('filename') || 'archivo-upload.jpg';

  try {
    let fileBuffer: Buffer | null = null;
    let filename = rawFilename;
    let contentType = 'image/jpeg';

    const reqContentType = request.headers.get('content-type') || '';

    if (reqContentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No se encontró archivo en el formulario' }, { status: 400 });
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

    const sanitizedFilename = filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');

    const finalFilename = `uploads/${Date.now()}-${sanitizedFilename}`;

    const blobToken =
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_TOKEN;

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
    });
  } catch (error: any) {
    console.error('Blob upload error:', error);
    return NextResponse.json({ error: error.message || 'Error al subir archivo a Blob' }, { status: 500 });
  }
}
