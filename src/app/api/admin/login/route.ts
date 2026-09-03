import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DoctorProfile from '@/lib/models/DoctorProfile';
import { normalizeDocumentNumber, verifyPassword } from '@/lib/password';
import { createAdminSession, COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/admin-auth';

function authenticatedResponse(professional: Record<string, unknown>) {
  const response = NextResponse.json({ success: true, professional });
  response.cookies.set(COOKIE_NAME, createAdminSession({ professionalId: String(professional.id), role: String(professional.role) }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const { documentNumber, password } = await req.json();

    if (!documentNumber || !password) {
      return NextResponse.json({ success: false, error: 'Cédula y contraseña son requeridas' }, { status: 400 });
    }

    const cleanDocumentNumber = normalizeDocumentNumber(documentNumber);

    // Verificación especial para Administrador del Sistema
    if (cleanDocumentNumber === '1000000001' && password === (process.env.ADMIN_DEMO_PASSWORD || 'senda2026')) {
      return authenticatedResponse({
          id: 'PROF-ADMIN',
          name: 'Dra. Sorelvis Murillo (Administración)',
          role: 'ADMIN_SISTEMA',
          roleTitle: 'Directora Ejecutiva & Administradora del Sistema',
          specialty: 'Gestión Global, Creación de Médicos, Citas & Pacientes',
          code: 'ADMIN-001',
          documentType: 'CC',
          documentNumber: cleanDocumentNumber,
          rethus: 'DIR-EJECUTIVA-2026',
          email: 'admin.senda@sendamujer.org',
          phone: '+57 301 469 2095',
          avatarBg: 'bg-amber-600',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          status: 'ACTIVO',
      });
    }

    try {
      await connectToDatabase();
      const doctor = await DoctorProfile.findOne({ documentNumber: cleanDocumentNumber }).select('+passwordHash').lean() as any;

      if (doctor) {
        const validPassword = doctor.passwordHash
          ? await verifyPassword(password, doctor.passwordHash)
          : false;
        if (!validPassword) return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
        const { passwordHash: _passwordHash, ...safeDoctor } = doctor;
        return authenticatedResponse(safeDoctor);
      }
    } catch (dbErr) {
      console.warn('Fallback login MongoDB:', dbErr);
    }

    return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
