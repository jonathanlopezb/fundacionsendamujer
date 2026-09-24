import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsGalleryItem from '@/lib/models/CmsGalleryItem';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_GALLERY_ITEMS = [
  {
    id: 'def-1',
    category: 'Salud & Ginecología',
    title: 'Jornada Médica y Tamizaje Ginecológico en Arroz Barato',
    date: 'Febrero 2026',
    location: 'Sector La Pista, Arroz Barato — Localidad 3',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    description: 'Atención médica integral, tomas de citología cérvico-uterina, asesoría en métodos anticonceptivos y entrega de medicamentos esenciales para más de 120 mujeres y familias.',
    participants: '124 mujeres atendidas',
    order: 1,
  },
  {
    id: 'def-2',
    category: 'Maternidad con Apoyo',
    title: 'Entrega de Kits Materno-Nutricionales y Taller de Lactancia',
    date: 'Enero 2026',
    location: 'Sede Fundación Senda Mujer Cartagena',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    description: 'Dotación de pañales, cobijas, suplementos vitamínicos y acompañamiento psicoafectivo para madres gestantes y lactantes en situación de extrema vulnerabilidad.',
    participants: '48 madres y bebés',
    order: 2,
  },
  {
    id: 'def-3',
    category: 'Capacitación & Emprendimiento',
    title: 'Graduación Taller de Confección Textil y Patronaje Digital',
    date: 'Enero 2026',
    location: 'Casa de Justicia Chiquinquirá — Cartagena',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    description: 'Entrega de certificados técnicos avalados y máquinas de coser como capital semilla para consolidar microemprendimientos comunitarios independientes.',
    participants: '32 mujeres graduadas',
    order: 3,
  },
  {
    id: 'def-4',
    category: 'Derechos & Protección',
    title: 'Círculo Comunitario de Prevención de Violencias Basadas en Género',
    date: 'Diciembre 2025',
    location: 'Barrio Nelson Mandela — Localidad 4',
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
    description: 'Encuentro con lideresas comunitarias para socializar rutas de denuncia ante comisarías, Fiscalía y activación de medidas cautelares de protección sin costo.',
    participants: '85 lideresas y jóvenes',
    order: 4,
  },
  {
    id: 'def-5',
    category: 'Salud Mental',
    title: 'Círculos de Sanación Emocional y Apoyo entre Pares',
    date: 'Noviembre 2025',
    location: 'Barrio El Pozón — Cartagena',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    description: 'Espacio guiado por psicólogas clínicas voluntarias para el manejo del duelo, superación del trauma y reconstrucción de la autoestima personal.',
    participants: '60 participantes',
    order: 5,
  },
  {
    id: 'def-6',
    category: 'Infancia & Bienestar',
    title: 'Brigada Odontológica Infantil y Vacunación PAI',
    date: 'Octubre 2025',
    location: 'Comunidad de Mamonal y Bahía',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    description: 'Jornada de profilaxis dental, aplicación de flúor y puesta al día del esquema de vacunación para niños y niñas de familias vulnerables.',
    participants: '95 niños y niñas',
    order: 6,
  },
];

// GET: Obtener todas las fotos de la galería
export async function GET() {
  try {
    await connectToDatabase();
    const items = await CmsGalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        items: DEFAULT_GALLERY_ITEMS,
      });
    }

    return NextResponse.json({
      success: true,
      items: items.map((it: any) => ({
        id: it._id,
        title: it.title,
        category: it.category,
        description: it.description,
        imageUrl: it.imageUrl,
        date: it.date,
        location: it.location,
        participants: it.participants,
        altText: it.altText,
        order: it.order,
      })),
    });
  } catch (error: any) {
    console.error('Error al obtener fotos de galería:', error);
    return NextResponse.json({
      success: true,
      items: DEFAULT_GALLERY_ITEMS,
    });
  }
}

// POST: Agregar nueva foto con descripción y categoría (Admin)
export async function POST(req: NextRequest) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para agregar fotos a la galería.' },
        { status: 403 }
      );
    }

    const { title, category, description, imageUrl, date, location, participants, altText, order } =
      await req.json();

    if (!title || !category || !description || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Título, categoría, descripción e imagen son requeridos.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newItem = await CmsGalleryItem.create({
      title: String(title).trim(),
      category: String(category).trim(),
      description: String(description).trim(),
      imageUrl: String(imageUrl).trim(),
      date: date ? String(date).trim() : 'Reciente',
      location: location ? String(location).trim() : 'Cartagena de Indias',
      participants: participants ? String(participants).trim() : '',
      altText: altText ? String(altText).trim() : String(title).trim(),
      order: Number(order) || 0,
      updatedBy: session.fullName || session.username,
    });

    return NextResponse.json({
      success: true,
      message: 'Foto agregada a la galería exitosamente.',
      item: {
        id: newItem._id,
        title: newItem.title,
        category: newItem.category,
        description: newItem.description,
        imageUrl: newItem.imageUrl,
        date: newItem.date,
        location: newItem.location,
        participants: newItem.participants,
        altText: newItem.altText,
        order: newItem.order,
      },
    });
  } catch (error: any) {
    console.error('Error al agregar foto de galería:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
