import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsAlly from '@/lib/models/CmsAlly';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para editar aliados.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();

    await connectToDatabase();
    const ally = await CmsAlly.findById(id);
    if (!ally) {
      return NextResponse.json({ success: false, error: 'Aliado no encontrado.' }, { status: 404 });
    }

    if (body.name) ally.name = String(body.name).trim();
    if (body.acronym !== undefined) ally.acronym = String(body.acronym).trim();
    if (body.category) ally.category = body.category;
    if (body.categoryLabel) ally.categoryLabel = String(body.categoryLabel).trim();
    if (body.logoUrl) ally.logoUrl = String(body.logoUrl).trim();
    if (body.website !== undefined) ally.website = String(body.website).trim();
    if (body.phone !== undefined) ally.phone = String(body.phone).trim();
    if (body.description !== undefined) ally.description = String(body.description).trim();
    if (body.scope !== undefined) ally.scope = String(body.scope).trim();
    if (body.isFeaturedInHome !== undefined) ally.isFeaturedInHome = Boolean(body.isFeaturedInHome);
    if (body.order !== undefined) ally.order = Number(body.order);
    if (body.status && ['ACTIVO', 'INACTIVO'].includes(body.status)) ally.status = body.status;

    await ally.save();

    return NextResponse.json({ success: true, message: 'Aliado actualizado exitosamente.', ally });
  } catch (error: any) {
    console.error('Error al editar aliado:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para eliminar aliados.' },
        { status: 403 }
      );
    }

    const { id } = params;
    await connectToDatabase();
    await CmsAlly.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Aliado eliminado exitosamente.' });
  } catch (error: any) {
    console.error('Error al eliminar aliado:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
