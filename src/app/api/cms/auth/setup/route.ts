import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsUser from '@/lib/models/CmsUser';
import { hashPassword } from '@/lib/password';
import { createCmsSession, CMS_COOKIE_NAME, CMS_SESSION_TTL_SECONDS } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // 🔒 Seguridad Crítica: Solo se permite ejecutar este endpoint si no existe ningún usuario en el CMS
    const existingCount = await CmsUser.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El sistema ya ha sido inicializado. El registro de bootstrap está bloqueado permanentemente.',
        },
        { status: 403 }
      );
    }

    const { fullName, email, username, password, documentNumber } = await req.json();

    if (!fullName || !email || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos obligatorios deben ser diligenciados.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La contraseña de Super Administrador debe tener al menos 8 caracteres.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const superAdmin = await CmsUser.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      username: cleanUsername,
      documentNumber: documentNumber ? String(documentNumber).trim() : '',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVO',
      lastLogin: new Date(),
      createdBy: 'BOOTSTRAP_INICIAL',
    });

    const sessionToken = createCmsSession({
      userId: String(superAdmin._id),
      fullName: superAdmin.fullName,
      email: superAdmin.email,
      username: superAdmin.username,
      role: superAdmin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: '¡Super Administrador creado exitosamente!',
      user: {
        id: superAdmin._id,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        username: superAdmin.username,
        role: superAdmin.role,
      },
    });

    response.cookies.set(CMS_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: CMS_SESSION_TTL_SECONDS,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error en bootstrap de Super Admin CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear Super Administrador inicial.' },
      { status: 500 }
    );
  }
}
