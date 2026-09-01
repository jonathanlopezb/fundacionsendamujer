import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DoctorProfile from '@/lib/models/DoctorProfile';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function GET() {
  try {
    try {
      await connectToDatabase();
      await seedCaribeSeguroData();

      const doctors = await DoctorProfile.find({}).sort({ createdAt: -1 }).lean();
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

    try {
      await connectToDatabase();
      const doctor = await DoctorProfile.create({
        id: body.id || `PROF-${Date.now()}`,
        name: body.name,
        role: body.role || 'MEDICO',
        roleTitle: body.roleTitle,
        specialty: body.specialty,
        code: body.code || `MED-${Math.floor(1000 + Math.random() * 9000)}`,
        rethus: body.rethus,
        email: body.email,
        phone: body.phone || '+57 300 000 0000',
        avatarBg: body.avatarBg || 'bg-emerald-600',
        badgeColor: body.badgeColor || 'bg-emerald-100 text-emerald-800 border-emerald-300',
        status: body.status || 'ACTIVO',
      });

      return NextResponse.json({ success: true, doctor });
    } catch (dbErr) {
      console.warn('MongoDB fallback save for doctor:', dbErr);
      return NextResponse.json({ success: true, doctor: body, isDemoFallback: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
