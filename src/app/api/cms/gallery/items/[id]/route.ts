import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsGalleryItem from '@/lib/models/CmsGalleryItem';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para editar fotos.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();

    await connectToDatabase();
    const item = await CmsGalleryItem.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Foto no encontrada.' }, { status: 404 });
    }

    if (body.title) item.title = String(body.title).trim();
    if (body.category) item.category = String(body.category).trim();
    if (body.description) item.description = String(body.description).trim();
    if (body.imageUrl) item.imageUrl = String(body.imageUrl).trim();
    if (body.date !== undefined) item.date = String(body.date).trim();
    if (body.location !== undefined) item.location = String(body.location).trim();
    if (body.participants !== undefined) item.participants = String(body.participants).trim();
    if (body.altText !== undefined) item.altText = String(body.altText).trim();
    if (body.order !== undefined) item.order = Number(body.order);
    item.updatedBy = session.fullName || session.username;

    await item.save();

    return NextResponse.json({ success: true, message: 'Foto actualizada exitosamente.', item });
  } catch (error: any) {
    console.error('Error al editar foto de galería:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para eliminar fotos.' },
        { status: 403 }
      );
    }

    const { id } = params;
    await connectToDatabase();
    await CmsGalleryItem.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Foto eliminada de la galería exitosamente.' });
  } catch (error: any) {
    console.error('Error al eliminar foto de galería:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
