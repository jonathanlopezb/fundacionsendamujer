import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmUser } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';
import { hashPassword } from '@/lib/password';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'users.manage');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const users = await CrmUser.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error al listar usuarios CRM:', error);
    return NextResponse.json({ error: 'Error al consultar usuarios' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'users.manage');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, email, password, role, phone, documentNumber, specialty, scopes } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nombre, email, contraseña y rol son obligatorios' },
        { status: 400 }
      );
    }

    const existing = await CrmUser.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un usuario registrado con este correo electrónico.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await CrmUser.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      phone: phone?.trim(),
      documentNumber: documentNumber?.trim(),
      specialty: specialty?.trim(),
      scopes: {
        programIds: scopes?.programIds || [],
        projectIds: scopes?.projectIds || [],
      },
      status: 'ACTIVE',
      mfaEnabled: false,
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_USER',
      'CrmUser',
      newUser._id.toString(),
      { createdEmail: newUser.email, assignedRole: newUser.role },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    console.error('Error al crear usuario CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al crear usuario' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'users.manage');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, role, status, scopes, password, name, phone, specialty } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const userToUpdate = await CrmUser.findById(id);
    if (!userToUpdate) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Proteger contra auto-bloqueo del super admin
    if (userToUpdate.role === 'SUPER_ADMIN' && status === 'INACTIVE' && auth.user.userId === id) {
      return NextResponse.json(
        { error: 'No puedes desactivar tu propia cuenta de Super Administrador.' },
        { status: 400 }
      );
    }

    if (name) userToUpdate.name = name.trim();
    if (phone !== undefined) userToUpdate.phone = phone.trim();
    if (specialty !== undefined) userToUpdate.specialty = specialty.trim();
    if (role) userToUpdate.role = role;
    if (status) userToUpdate.status = status;
    if (scopes) userToUpdate.scopes = scopes;

    if (password && password.trim().length >= 8) {
      userToUpdate.passwordHash = await hashPassword(password);
    }

    await userToUpdate.save();

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'UPDATE_USER',
      'CrmUser',
      userToUpdate._id.toString(),
      { updatedEmail: userToUpdate.email, newRole: userToUpdate.role, newStatus: userToUpdate.status },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
    });
  } catch (error: any) {
    console.error('Error al actualizar usuario CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar usuario' }, { status: 500 });
  }
}
