import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsUser from '@/lib/models/CmsUser';
import { hashPassword } from '@/lib/password';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

// GET /api/cms/users - Listar usuarios del CMS (Solo SUPER_ADMIN)
export async function GET() {
  try {
    const session = readCmsSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Se requieren permisos de Super Administrador.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const users = await CmsUser.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      users: users.map((u: any) => ({
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        username: u.username,
        documentNumber: u.documentNumber,
        role: u.role,
        status: u.status,
        lastLogin: u.lastLogin,
        createdBy: u.createdBy,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error al listar usuarios CMS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/cms/users - Crear nuevo usuario (Solo SUPER_ADMIN)
export async function POST(req: NextRequest) {
  try {
    const session = readCmsSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado. Se requieren permisos de Super Administrador.' },
        { status: 403 }
      );
    }

    const { fullName, email, username, password, role, documentNumber, status } = await req.json();

    if (!fullName || !email || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email, usuario y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();

    const existingUser = await CmsUser.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un usuario con ese correo o nombre de usuario.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await CmsUser.create({
      fullName: String(fullName).trim(),
      email: cleanEmail,
      username: cleanUsername,
      documentNumber: documentNumber ? String(documentNumber).trim() : '',
      passwordHash,
      role: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role) ? role : 'ADMIN',
      status: status === 'INACTIVO' ? 'INACTIVO' : 'ACTIVO',
      createdBy: session.fullName || session.username,
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente.',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error al crear usuario CMS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
