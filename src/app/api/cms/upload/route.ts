/**
 * POST /api/cms/upload
 *
 * Upload pipeline profesional:
 *   1. Valida sesión CMS
 *   2. Lee el archivo desde multipart/form-data O raw body
 *   3. Intenta subir a Vercel Blob (CDN público)
 *   4. Fallback garantizado: guarda en MongoDB como Data URI si Blob no está disponible
 */

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';
import { getVercelBlobToken } from '@/lib/blob-token';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── 1. Autenticación ────────────────────────────────────────────────────────
  const session = readCmsSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
    return NextResponse.json(
      { error: 'Acceso no autorizado. Inicia sesión en el CMS para subir archivos.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryFilename = searchParams.get('filename') || 'senda-upload.jpg';

  try {
    // ── 2. Lectura del archivo ───────────────────────────────────────────────
    let fileBuffer: Buffer;
    let filename = queryFilename;
    let contentType = 'image/jpeg';

    const reqContentType = request.headers.get('content-type') || '';

    if (reqContentType.startsWith('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file || file.size === 0) {
        return NextResponse.json({ error: 'No se encontró un archivo válido en el formulario.' }, { status: 400 });
      }
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Solo se permiten archivos de imagen (JPG, PNG, WebP, GIF, SVG).' }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'La imagen supera el límite de 10 MB.' }, { status: 400 });
      }
      filename = file.name || filename;
      contentType = file.type;
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      const ab = await request.arrayBuffer();
      if (!ab || ab.byteLength === 0) {
        return NextResponse.json({ error: 'El cuerpo del request está vacío.' }, { status: 400 });
      }
      if (ab.byteLength > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'La imagen supera el límite de 10 MB.' }, { status: 400 });
      }
      fileBuffer = Buffer.from(ab);
      contentType = reqContentType || 'image/jpeg';
    }

    // ── 3. Sanitización del nombre de archivo ────────────────────────────────
    const sanitized = filename
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.\-_]/g, '')
      .replace(/-{2,}/g, '-')
      .substring(0, 100);

    const blobPath = `cms/${Date.now()}-${sanitized}`;

    // ── 4. Intento Vercel Blob ───────────────────────────────────────────────
    const token = getVercelBlobToken();

    if (token) {
      try {
        const blobResult = await put(blobPath, fileBuffer, {
          access: 'public',
          contentType,
          token,
        });

        return NextResponse.json({
          success: true,
          provider: 'vercel-blob',
          url: blobResult.url,
          pathname: blobResult.pathname,
          contentType: blobResult.contentType,
          size: fileBuffer.byteLength,
        });
      } catch (blobError: any) {
        // Loguear pero no detener — el fallback garantiza continuidad
        console.error('[upload] Vercel Blob falló, usando fallback:', {
          code: blobError?.code,
          message: blobError?.message,
          status: blobError?.status,
        });
      }
    }

    // ── 5. Fallback garantizado: Data URI guardado en MongoDB ────────────────
    // Convertimos a base64 y retornamos el Data URI directamente.
    // El PUT /api/cms/images lo persiste en MongoDB.
    const dataUri = `data:${contentType};base64,${fileBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      provider: token ? 'data-uri-fallback' : 'data-uri-no-token',
      url: dataUri,
      pathname: blobPath,
      contentType,
      size: fileBuffer.byteLength,
      note: token
        ? 'Vercel Blob no disponible en este momento; imagen guardada como Data URI en MongoDB.'
        : 'BLOB_READ_WRITE_TOKEN no detectado; imagen guardada como Data URI en MongoDB.',
    });
  } catch (error: any) {
    console.error('[upload] Error inesperado:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al procesar la imagen.' },
      { status: 500 }
    );
  }
}
