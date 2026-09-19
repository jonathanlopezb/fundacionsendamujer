import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaEnrollment from '@/lib/models/AcademiaEnrollment';
import AcademiaCertificate from '@/lib/models/AcademiaCertificate';

const MOCK_STUDENTS = [
  {
    id: 'CSM-2026-0048',
    name: 'Laura Gómez Rodríguez',
    email: 'laura.gomez@sendamujer.org',
    enrolledCourse: 'Marketing Digital para Emprendedoras',
    courseSlug: 'marketing-digital-emprendedoras',
    progress: 100,
    grade: 95,
    status: 'COMPLETED',
    certificateCode: 'SENDA-2026-004812',
    lastActive: new Date(Date.now() - 3600000),
  },
  {
    id: 'CSM-2026-0112',
    name: 'Ana María Torres',
    email: 'ana.torres@gmail.com',
    enrolledCourse: 'Emprendimiento Femenino: De la Idea al Negocio',
    courseSlug: 'emprendimiento-femenino-idea-al-negocio',
    progress: 60,
    grade: 85,
    status: 'ACTIVE',
    certificateCode: null,
    lastActive: new Date(Date.now() - 7200000),
  },
  {
    id: 'CSM-2026-0245',
    name: 'Carmen Cecilia Pérez',
    email: 'carmen.perez@sendamujer.org',
    enrolledCourse: 'Liderazgo y Comunicación Asertiva',
    courseSlug: 'liderazgo-comunicacion-asertiva',
    progress: 80,
    grade: 90,
    status: 'ACTIVE',
    certificateCode: null,
    lastActive: new Date(Date.now() - 14400000),
  },
  {
    id: 'CSM-2026-0389',
    name: 'Valentina Morales',
    email: 'valentina.m@gmail.com',
    enrolledCourse: 'Diseño de Contenido para Redes en Canva',
    courseSlug: 'diseno-contenido-redes-canva',
    progress: 100,
    grade: 98,
    status: 'COMPLETED',
    certificateCode: 'SENDA-2026-003891',
    lastActive: new Date(Date.now() - 86400000),
  },
  {
    id: 'CSM-2026-0412',
    name: 'Claudia Patricia Ramos',
    email: 'claudia.ramos@outlook.com',
    enrolledCourse: 'Derechos Humanos y Ley 1257 en Colombia',
    courseSlug: 'derechos-humanos-ley-1257',
    progress: 45,
    grade: 75,
    status: 'ACTIVE',
    certificateCode: null,
    lastActive: new Date(Date.now() - 172800000),
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    const enrollments = await AcademiaEnrollment.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      students: enrollments.length ? enrollments : MOCK_STUDENTS,
      source: enrollments.length ? 'mongodb' : 'mock',
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      students: MOCK_STUDENTS,
      source: 'mock',
    });
  }
}
