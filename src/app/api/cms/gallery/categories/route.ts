import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsGalleryCategory from '@/lib/models/CmsGalleryCategory';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  'Salud & Ginecología',
  'Maternidad con Apoyo',
  'Capacitación & Emprendimiento',
  'Derechos & Protección',
  'Salud Mental',
  'Infancia & Bienestar',
];

// GET: Listar categorías
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await CmsGalleryCategory.find().sort({ order: 1, createdAt: 1 }).lean();

    if (categories.length === 0) {
      return NextResponse.json({
        success: true,
        categories: DEFAULT_CATEGORIES.map((name, i) => ({
          id: `def-${i}`,
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          order: i,
          isDefault: true,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      categories: categories.map((c: any) => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        order: c.order,
      })),
    });
  } catch (error: any) {
    console.error('Error al obtener categorías de galería:', error);
    return NextResponse.json({
      success: true,
      categories: DEFAULT_CATEGORIES.map((name, i) => ({
        id: `def-${i}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        order: i,
      })),
    });
  }
}

// POST: Crear categoría (Admin)
export async function POST(req: NextRequest) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para crear categorías.' },
        { status: 403 }
      );
    }

    const { name, description, order } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la categoría es requerido.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanName = String(name).trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const existing = await CmsGalleryCategory.findOne({
      $or: [{ name: cleanName }, { slug }],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una categoría con este nombre.' },
        { status: 400 }
      );
    }

    const category = await CmsGalleryCategory.create({
      name: cleanName,
      slug,
      description: description ? String(description).trim() : '',
      order: Number(order) || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Categoría creada exitosamente.',
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        order: category.order,
      },
    });
  } catch (error: any) {
    console.error('Error al crear categoría de galería:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
