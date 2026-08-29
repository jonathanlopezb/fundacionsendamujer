import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename es requerido' }, { status: 400 });
  }

  try {
    if (!request.body) {
      return NextResponse.json({ error: 'El archivo está vacío' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Mock upload fallback response if Vercel Blob token is not configured yet
      return NextResponse.json({
        url: `https://blob.vercel-storage.com/mock-upload-${Date.now()}-${filename}`,
        pathname: filename,
        contentType: 'application/octet-stream',
        isMock: true,
      });
    }

    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error('Blob upload error:', error);
    return NextResponse.json({ error: error.message || 'Error al subir archivo' }, { status: 500 });
  }
}
