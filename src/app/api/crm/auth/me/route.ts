import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCrmRequestSession } from '@/lib/crm/auth';
import { CrmUser } from '@/lib/crm/models';
import { ROLE_PERMISSIONS } from '@/lib/crm/permissions';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userCount = await CrmUser.countDocuments();

    if (userCount === 0) {
      return NextResponse.json({
        isFirstRun: true,
        authenticated: false,
        user: null,
      });
    }

    const session = getCrmRequestSession(req);

    if (!session) {
      return NextResponse.json({
        isFirstRun: false,
        authenticated: false,
        user: null,
      });
    }

    // Consultar datos actualizados del usuario
    const userDoc = await CrmUser.findById(session.userId).select('-passwordHash');

    if (!userDoc || userDoc.status !== 'ACTIVE') {
      return NextResponse.json({
        isFirstRun: false,
        authenticated: false,
        user: null,
      });
    }

    const permissions = ROLE_PERMISSIONS[userDoc.role as keyof typeof ROLE_PERMISSIONS] || [];

    return NextResponse.json({
      isFirstRun: false,
      authenticated: true,
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        phone: userDoc.phone,
        documentNumber: userDoc.documentNumber,
        specialty: userDoc.specialty,
        scopes: userDoc.scopes,
        permissions,
      },
    });
  } catch (error: any) {
    console.error('Error en /api/crm/auth/me:', error);
    return NextResponse.json(
      { error: 'Error al consultar estado de sesión', authenticated: false },
      { status: 500 }
    );
  }
}
