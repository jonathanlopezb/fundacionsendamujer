import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmUser, CrmProgram, getNextSequence } from '@/lib/crm/models';
import { hashPassword } from '@/lib/password';
import { createCrmSessionToken, CRM_COOKIE_NAME, logCrmAudit } from '@/lib/crm/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const count = await CrmUser.countDocuments();
    return NextResponse.json({
      isFirstRun: count === 0,
      userCount: count,
    });
  } catch (error) {
    console.error('Error al verificar estado inicial de setup CRM:', error);
    return NextResponse.json({ error: 'Error al conectar a la base de datos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const count = await CrmUser.countDocuments();

    if (count > 0) {
      return NextResponse.json(
        { error: 'El sistema ya fue inicializado. El Super Administrador ya existe.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone, documentNumber, specialty } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, correo electrónico y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres para garantizar la seguridad.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const superAdmin = await CrmUser.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'SUPER_ADMIN',
      phone: phone?.trim(),
      documentNumber: documentNumber?.trim(),
      specialty: specialty?.trim() || 'Dirección de Tecnología y Sistema',
      scopes: {
        programIds: [],
        projectIds: [],
      },
      status: 'ACTIVE',
      mfaEnabled: true,
      lastLoginAt: new Date(),
    });

    // Inicializar programas base institucionales si no existen
    const existingPrograms = await CrmProgram.countDocuments();
    if (existingPrograms === 0) {
      await CrmProgram.create([
        {
          code: 'CAM',
          name: 'Centro de Apoyo a la Mujer (CAM)',
          description: 'Líneas de capacitación productiva y empoderamiento económico (Costura, Panadería, Sublimación, etc.).',
          objectives: ['Formación técnica vocacional', 'Emprendimiento y autonomía económica', 'Redes de sororidad comunitaria'],
          targetPopulation: 'Mujeres cabeza de hogar y sobrevivientes en Cartagena y Bolívar',
          status: 'ACTIVE',
        },
        {
          code: 'THEMIS',
          name: 'Ruta Jurídica y de Protección THEMIS',
          description: 'Acompañamiento legal especializado bajo la Ley 1257 de 2008, medidas de protección y asesoría jurídica.',
          objectives: ['Restitución de derechos', 'Representación en comisarías y fiscalía', 'Protección integral ante violencias'],
          targetPopulation: 'Mujeres y familias en riesgo de violencia de género',
          status: 'ACTIVE',
        },
        {
          code: 'CARIBE_SEGURO',
          name: 'Sistema Operativo Social Caribe Seguro',
          description: 'Atención multidisciplinaria territorial: visitas domiciliarias, salud reproductiva y contención psicosocial.',
          objectives: ['Visitas de campo', 'Entrega de ayudas humanitarias', 'Seguimiento familiar'],
          targetPopulation: 'Comunidades en condición de vulnerabilidad extrema',
          status: 'ACTIVE',
        },
      ]);
    }

    // Registrar log inmutable de auditoría
    await logCrmAudit(
      { userId: superAdmin._id.toString(), name: superAdmin.name, role: 'SUPER_ADMIN' },
      'SETUP_INITIAL_SUPER_ADMIN',
      'CrmUser',
      superAdmin._id.toString(),
      { email: superAdmin.email, action: 'Primer usuario Super Administrador creado exitosamente' },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    // Crear sesión y cookie
    const token = createCrmSessionToken({
      userId: superAdmin._id.toString(),
      email: superAdmin.email,
      name: superAdmin.name,
      role: 'SUPER_ADMIN',
      scopes: superAdmin.scopes,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Super Administrador configurado exitosamente.',
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
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
    console.error('Error al inicializar Super Admin CRM:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al registrar el Super Administrador' },
      { status: 500 }
    );
  }
}
