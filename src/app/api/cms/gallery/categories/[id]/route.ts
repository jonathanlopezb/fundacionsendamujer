import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsGalleryCategory from '@/lib/models/CmsGalleryCategory';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para eliminar categorías.' },
        { status: 403 }
      );
    }

    const { id } = params;

    await connectToDatabase();
    await CmsGalleryCategory.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Categoría eliminada exitosamente.' });
  } catch (error: any) {
    console.error('Error al eliminar categoría de galería:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
