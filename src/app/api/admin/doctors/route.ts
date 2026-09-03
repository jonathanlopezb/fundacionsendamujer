import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DoctorProfile from '@/lib/models/DoctorProfile';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';
import { hashPassword, normalizeDocumentNumber } from '@/lib/password';

export async function GET() {
  try {
    try {
      await connectToDatabase();
      await seedCaribeSeguroData();

      const doctors = await DoctorProfile.find({}).select('-passwordHash').sort({ createdAt: -1 }).lean();
      if (doctors && doctors.length > 0) {
        return NextResponse.json({ success: true, doctors });
      }
    } catch (dbErr) {
      console.warn('MongoDB fallback for doctors list:', dbErr);
    }

    return NextResponse.json({ success: true, doctors: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.documentNumber || !body.password || !body.name || !body.specialty || !body.email) {
      return NextResponse.json({ success: false, error: 'Nombre, cédula, especialidad, correo y contraseña son requeridos' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const doctor = await DoctorProfile.create({
        id: body.id || `PROF-${Date.now()}`,
        name: body.name,
        firstName: body.firstName,
        lastName: body.lastName,
        documentType: body.documentType || 'CC',
        documentNumber: normalizeDocumentNumber(body.documentNumber),
        birthDate: body.birthDate,
        publicName: body.publicName,
        role: body.role || 'MEDICO',
        roleTitle: body.roleTitle,
        specialty: body.specialty,
        code: body.code || `${(body.role || 'MED').slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        rethus: body.rethus || '',
        professionalCard: body.professionalCard,
        issuingEntity: body.issuingEntity,
        institutionName: body.institutionName,
        organizationType: body.organizationType,
        city: body.city,
        department: body.department,
        municipalities: body.municipalities || [],
        modalities: body.modalities || [],
        services: body.services || [],
        population: body.population || [],
        availability: body.availability,
        urgentCases: Boolean(body.urgentCases),
        yearsExperience: body.yearsExperience,
        bio: body.bio,
        consentsAccepted: body.consentsAccepted === true,
        verificationStatus: 'PENDIENTE',
        email: body.email,
        passwordHash: await hashPassword(body.password),
        phone: body.phone || '+57 300 000 0000',
        avatarBg: body.avatarBg || 'bg-emerald-600',
        badgeColor: body.badgeColor || 'bg-emerald-100 text-emerald-800 border-emerald-300',
        status: body.status || 'ACTIVO',
      });

      const safeDoctor = doctor.toObject();
      delete safeDoctor.passwordHash;
      return NextResponse.json({ success: true, doctor: safeDoctor });
    } catch (dbErr) {
      console.warn('MongoDB fallback save for doctor:', dbErr);
      const { password: _password, ...safeBody } = body;
      return NextResponse.json({ success: false, error: 'No fue posible guardar el profesional en MongoDB.' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
