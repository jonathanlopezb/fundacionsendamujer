import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaCourse from '@/lib/models/AcademiaCourse';
import { isSuperAdminSession } from '@/lib/admin-auth';

const MOCK_COURSES = [{ slug: 'idea-al-negocio', title: 'De la Idea al Negocio', subtitle: 'Convierte una idea en un proyecto viable', instructor: 'Dra. Sorelvis Murillo', category: 'Autonomía Financiera', level: 'Básico', published: true, certificateEnabled: true, learningOutcomes: ['Identificar una oportunidad de negocio', 'Calcular costos y precio de venta', 'Crear un presupuesto'], lessons: [{ id: '1-1', title: 'Mi idea de negocio', duration: '12 min' }, { id: '1-2', title: 'Mis números', duration: '18 min' }] }];

export async function GET() {
  try { await connectToDatabase(); const courses = await AcademiaCourse.find({ published: true }).sort({ createdAt: -1 }).lean(); return NextResponse.json({ success: true, courses: courses.length ? courses : MOCK_COURSES, source: courses.length ? 'mongodb' : 'mock' }); }
  catch (error) { console.warn('Academia courses fallback', error); return NextResponse.json({ success: true, courses: MOCK_COURSES, source: 'mock' }); }
}

export async function POST(req: NextRequest) {
  if (!isSuperAdminSession()) return NextResponse.json({ success: false, error: 'Solo el SuperAdministrador puede publicar cursos.' }, { status: 403 });
  try { const body = await req.json(); if (!body.slug || !body.title || !body.instructor) return NextResponse.json({ success: false, error: 'slug, title e instructor son requeridos.' }, { status: 400 }); await connectToDatabase(); const course = await AcademiaCourse.findOneAndUpdate({ slug: body.slug }, body, { new: true, upsert: true, setDefaultsOnInsert: true }); return NextResponse.json({ success: true, course }); }
  catch (error) { console.warn('Academia course write fallback', error); return NextResponse.json({ success: false, error: 'No fue posible guardar el curso. Verifica la conexión a MongoDB.' }, { status: 503 }); }
}
