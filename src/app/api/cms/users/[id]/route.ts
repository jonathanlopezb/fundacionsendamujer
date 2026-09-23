import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsUser from '@/lib/models/CmsUser';
import { hashPassword } from '@/lib/password';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

// PUT /api/cms/users/[id] - Actualizar usuario
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Se requieren permisos de Super Administrador.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { fullName, email, role, status, newPassword, documentNumber } = body;

    await connectToDatabase();
    const user = await CmsUser.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado.' }, { status: 404 });
    }

    // Proteger al último super admin de ser degradado o desactivado
    if (user.role === 'SUPER_ADMIN' && (role !== 'SUPER_ADMIN' || status === 'INACTIVO')) {
      const superAdminsCount = await CmsUser.countDocuments({ role: 'SUPER_ADMIN', status: 'ACTIVO' });
      if (superAdminsCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'No se puede desactivar o degradar al único Super Administrador activo.' },
          { status: 400 }
        );
      }
    }

    if (fullName) user.fullName = String(fullName).trim();
    if (email) user.email = String(email).trim().toLowerCase();
    if (role && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role)) user.role = role;
    if (status && ['ACTIVO', 'INACTIVO'].includes(status)) user.status = status;
    if (documentNumber !== undefined) user.documentNumber = String(documentNumber).trim();

    if (newPassword && newPassword.length >= 6) {
      user.passwordHash = await hashPassword(newPassword);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error('Error al actualizar usuario CMS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/cms/users/[id] - Eliminar usuario
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = readCmsSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Se requieren permisos de Super Administrador.' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (session.userId === id) {
      return NextResponse.json(
        { success: false, error: 'No puedes eliminar tu propia cuenta en sesión activa.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await CmsUser.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado.' }, { status: 404 });
    }

    if (user.role === 'SUPER_ADMIN') {
      const superAdminsCount = await CmsUser.countDocuments({ role: 'SUPER_ADMIN' });
      if (superAdminsCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'No se puede eliminar el único Super Administrador del sistema.' },
          { status: 400 }
        );
      }
    }

    await CmsUser.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente.',
    });
  } catch (error: any) {
    console.error('Error al eliminar usuario CMS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
