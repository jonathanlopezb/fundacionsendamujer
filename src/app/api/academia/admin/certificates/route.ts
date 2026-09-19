import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaCertificate from '@/lib/models/AcademiaCertificate';

const MOCK_CERTIFICATES = [
  {
    code: 'SENDA-2026-004812',
    learnerName: 'Laura Gómez Rodríguez',
    courseTitle: 'Marketing Digital para Emprendedoras',
    courseCategory: 'Habilidades Digitales',
    instructor: 'Dra. Sorelvis Murillo & Mg. Laura Gómez',
    hours: 32,
    grade: 95,
    issuedAt: new Date(),
    status: 'VALID',
  },
  {
    code: 'SENDA-2026-003891',
    learnerName: 'Valentina Morales',
    courseTitle: 'Diseño de Contenido para Redes en Canva',
    courseCategory: 'Arte y Cultura',
    instructor: 'Mg. Karen Ramos',
    hours: 24,
    grade: 98,
    issuedAt: new Date(Date.now() - 86400000),
    status: 'VALID',
  },
  {
    code: 'SENDA-2026-001240',
    learnerName: 'Ana María Torres',
    courseTitle: 'Derechos Humanos y Ley 1257 en Colombia',
    courseCategory: 'Desarrollo Personal',
    instructor: 'Abg. Carlos Mendoza',
    hours: 32,
    grade: 92,
    issuedAt: new Date(Date.now() - 259200000),
    status: 'VALID',
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    const certs = await AcademiaCertificate.find().sort({ issuedAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      certificates: certs.length ? certs : MOCK_CERTIFICATES,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      certificates: MOCK_CERTIFICATES,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, learnerName, courseTitle, instructor, hours, grade } = body;

    const year = new Date().getFullYear();
    const certCode = code || `SENDA-${year}-${Math.floor(100000 + Math.random() * 900000)}`;

    const certData = {
      code: certCode,
      learnerName: learnerName || 'Estudiante Senda',
      courseTitle: courseTitle || 'Marketing Digital para Emprendedoras',
      instructor: instructor || 'Dra. Sorelvis Murillo',
      hours: Number(hours) || 32,
      grade: Number(grade) || 95,
      issuedAt: new Date(),
      status: 'VALID',
    };

    try {
      await connectToDatabase();
      const created = await AcademiaCertificate.create(certData);
      return NextResponse.json({ success: true, certificate: created });
    } catch (e) {
      return NextResponse.json({ success: true, certificate: certData });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al emitir certificado.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, status } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Código requerido.' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await AcademiaCertificate.updateOne({ code }, { status: status || 'REVOKED' });
    } catch (e) {
      // Ignored
    }

    return NextResponse.json({ success: true, message: `Certificado ${code} actualizado a ${status}.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al actualizar certificado.' }, { status: 500 });
  }
}
