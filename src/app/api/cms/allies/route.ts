import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsAlly from '@/lib/models/CmsAlly';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_ALLIES_DATA = [
  {
    id: 'def-1',
    name: 'Defensoría del Pueblo — Regional Bolívar',
    acronym: 'DP-BOL',
    category: 'public',
    categoryLabel: 'Sector Público & Derechos Humanos',
    logoUrl: '/defensoria.png',
    website: 'https://www.defensoria.gov.co',
    description: 'Organismo constitucional de protección y promoción de los Derechos Humanos. Articulación directa para tutelas, amparo y acompañamiento a víctimas de VBG.',
    scope: 'Departamental Bolívar',
    isFeaturedInHome: true,
    order: 1,
    status: 'ACTIVO',
  },
  {
    id: 'def-2',
    name: 'Profamilia — Cartagena',
    acronym: 'PROFAMILIA',
    category: 'health',
    categoryLabel: 'Salud Sexual y Reproductiva',
    logoUrl: '/profamilia.jpg',
    website: 'https://profamilia.org.co',
    description: 'Atención integral en salud sexual, reproductiva, anticoncepción moderna, tamizajes de citología y consultas ginecológicas prioritarias.',
    scope: 'Nacional & Local',
    isFeaturedInHome: true,
    order: 2,
    status: 'ACTIVO',
  },
  {
    id: 'def-3',
    name: 'SENA — Servicio Nacional de Aprendizaje',
    acronym: 'SENA',
    category: 'academic',
    categoryLabel: 'Formación Técnica & Empleo',
    logoUrl: '/sena.png',
    website: 'https://www.sena.edu.co',
    description: 'Cursos técnicos, talleres de emprendimiento, confección textil y programas formativos para la autonomía económica de mujeres en Cartagena.',
    scope: 'Nacional & Regional',
    isFeaturedInHome: true,
    order: 3,
    status: 'ACTIVO',
  },
];

// GET: Obtener todos los aliados
export async function GET() {
  try {
    await connectToDatabase();
    const allies = await CmsAlly.find().sort({ order: 1, createdAt: -1 }).lean();

    if (allies.length === 0) {
      return NextResponse.json({
        success: true,
        allies: DEFAULT_ALLIES_DATA,
      });
    }

    return NextResponse.json({
      success: true,
      allies: allies.map((a: any) => ({
        id: a._id,
        name: a.name,
        acronym: a.acronym,
        category: a.category,
        categoryLabel: a.categoryLabel,
        logoUrl: a.logoUrl,
        website: a.website,
        phone: a.phone,
        description: a.description,
        scope: a.scope,
        isFeaturedInHome: a.isFeaturedInHome,
        order: a.order,
        status: a.status,
      })),
    });
  } catch (error: any) {
    console.error('Error al obtener aliados:', error);
    return NextResponse.json({
      success: true,
      allies: DEFAULT_ALLIES_DATA,
    });
  }
}

// POST: Agregar nuevo aliado (Admin)
export async function POST(req: NextRequest) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para agregar aliados.' },
        { status: 403 }
      );
    }

    const {
      name,
      acronym,
      category,
      categoryLabel,
      logoUrl,
      website,
      phone,
      description,
      scope,
      isFeaturedInHome,
      order,
    } = await req.json();

    if (!name || !logoUrl) {
      return NextResponse.json(
        { success: false, error: 'Nombre y Logo del aliado son obligatorios.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const ally = await CmsAlly.create({
      name: String(name).trim(),
      acronym: acronym ? String(acronym).trim() : '',
      category: category || 'ngo',
      categoryLabel: categoryLabel ? String(categoryLabel).trim() : 'Organización Aliada',
      logoUrl: String(logoUrl).trim(),
      website: website ? String(website).trim() : '',
      phone: phone ? String(phone).trim() : '',
      description: description ? String(description).trim() : '',
      scope: scope ? String(scope).trim() : 'Cartagena / Bolívar',
      isFeaturedInHome: isFeaturedInHome ?? true,
      order: Number(order) || 0,
      status: 'ACTIVO',
    });

    return NextResponse.json({
      success: true,
      message: 'Aliado institucional registrado exitosamente.',
      ally: {
        id: ally._id,
        name: ally.name,
        acronym: ally.acronym,
        category: ally.category,
        categoryLabel: ally.categoryLabel,
        logoUrl: ally.logoUrl,
        website: ally.website,
        phone: ally.phone,
        description: ally.description,
        scope: ally.scope,
        isFeaturedInHome: ally.isFeaturedInHome,
        order: ally.order,
        status: ally.status,
      },
    });
  } catch (error: any) {
    console.error('Error al registrar aliado:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
