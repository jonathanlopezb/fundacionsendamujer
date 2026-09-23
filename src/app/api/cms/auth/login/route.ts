import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsUser from '@/lib/models/CmsUser';
import { verifyPassword } from '@/lib/password';
import { createCmsSession, CMS_COOKIE_NAME, CMS_SESSION_TTL_SECONDS } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario/correo y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanIdentifier = String(username).trim().toLowerCase();

    const user = await CmsUser.findOne({
      $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }],
    }).select('+passwordHash');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas o usuario no encontrado.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVO') {
      return NextResponse.json(
        { success: false, error: 'Esta cuenta ha sido desactivada por un Super Administrador.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas o contraseña incorrecta.' },
        { status: 401 }
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const sessionToken = createCmsSession({
      userId: String(user._id),
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
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
    console.error('Error en login CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar el inicio de sesión.' },
      { status: 500 }
    );
  }
}
