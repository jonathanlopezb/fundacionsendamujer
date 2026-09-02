import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DoctorProfile from '@/lib/models/DoctorProfile';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Correo y contraseña son requeridos' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verificación especial para Administrador del Sistema
    if (cleanEmail === 'admin.senda@sendamujer.org' && password === 'senda2026') {
      return NextResponse.json({
        success: true,
        professional: {
          id: 'PROF-ADMIN',
          name: 'Dra. Sorelvis Murillo (Administración)',
          role: 'ADMIN_SISTEMA',
          roleTitle: 'Directora Ejecutiva & Administradora del Sistema',
          specialty: 'Gestión Global, Creación de Médicos, Citas & Pacientes',
          code: 'ADMIN-001',
          rethus: 'DIR-EJECUTIVA-2026',
          email: 'admin.senda@sendamujer.org',
          phone: '+57 301 469 2095',
          avatarBg: 'bg-amber-600',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          status: 'ACTIVO',
        },
      });
    }

    try {
      await connectToDatabase();
      await seedCaribeSeguroData();

      const doctor = await DoctorProfile.findOne({ email: cleanEmail }).lean() as any;

      if (doctor) {
        if (password === 'senda2026') {
          return NextResponse.json({ success: true, professional: doctor });
        } else {
          return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
        }
      }
    } catch (dbErr) {
      console.warn('Fallback login MongoDB:', dbErr);
    }

    // Si el usuario ingresa con contraseña demo por defecto 'senda2026'
    if (password === 'senda2026') {
      const roleName = cleanEmail.includes('elena')
        ? 'MEDICO'
        : cleanEmail.includes('patricia')
        ? 'JURIDICO'
        : cleanEmail.includes('claudia')
        ? 'PSICOLOGO'
        : 'TRABAJO_SOCIAL';

      return NextResponse.json({
        success: true,
        professional: {
          id: `PROF-${Date.now()}`,
          name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          role: roleName,
          roleTitle: `Profesional en ${roleName}`,
          specialty: 'Atención Multidisciplinaria Senda',
          code: `${roleName.slice(0, 3)}-2026`,
          rethus: 'RETHUS-VERIFICADO-2026',
          email: cleanEmail,
          phone: '+57 300 000 0000',
          avatarBg: 'bg-emerald-600',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          status: 'ACTIVO',
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
