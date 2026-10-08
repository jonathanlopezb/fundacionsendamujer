import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmUser } from '@/lib/crm/models';
import { verifyPassword } from '@/lib/password';
import { createCrmSessionToken, CRM_COOKIE_NAME, logCrmAudit } from '@/lib/crm/auth';
import { CrmRole } from '@/lib/crm/permissions';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Debe ingresar correo y contraseña' },
        { status: 400 }
      );
    }

    const user = await CrmUser.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifique el correo o contraseña.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Esta cuenta se encuentra inactiva o suspendida. Contacte al administrador.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      await logCrmAudit(
        null,
        'LOGIN_FAILED',
        'CrmUser',
        user._id.toString(),
        { email: user.email, reason: 'Contraseña incorrecta' },
        req.headers.get('x-forwarded-for') || '127.0.0.1'
      );

      return NextResponse.json(
        { error: 'Credenciales inválidas. Verifique el correo o contraseña.' },
        { status: 401 }
      );
    }

    // Actualizar último inicio de sesión
    user.lastLoginAt = new Date();
    await user.save();

    await logCrmAudit(
      { userId: user._id.toString(), name: user.name, role: user.role },
      'LOGIN_SUCCESS',
      'CrmUser',
      user._id.toString(),
      { email: user.email },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    const token = createCrmSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as CrmRole,
      scopes: user.scopes || { programIds: [], projectIds: [] },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        scopes: user.scopes,
      },
    });

    response.cookies.set(CRM_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error: any) {
    console.error('Error en login CRM:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al procesar inicio de sesión' },
      { status: 500 }
    );
  }
}
