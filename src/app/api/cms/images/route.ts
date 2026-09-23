import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsSectionImage from '@/lib/models/CmsSectionImage';
import { CMS_DEFAULT_SECTIONS, CmsImageItem } from '@/lib/cms-defaults';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

// GET /api/cms/images - Obtiene todas las imágenes de secciones (público / cacheable)
export async function GET() {
  try {
    let savedImages: any[] = [];
    try {
      await connectToDatabase();
      savedImages = await CmsSectionImage.find().lean();
    } catch (dbErr: any) {
      console.warn('MongoDB no disponible para CMS Images, usando catálogo por defecto:', dbErr.message);
    }

    const savedMap = new Map<string, any>();
    savedImages.forEach((item) => {
      savedMap.set(item.sectionKey, item);
    });

    // Unir catálogo por defecto con los registros guardados en MongoDB
    const mergedSections: CmsImageItem[] = CMS_DEFAULT_SECTIONS.map((def) => {
      const saved = savedMap.get(def.sectionKey);
      if (saved) {
        return {
          ...def,
          imageUrl: saved.imageUrl || def.imageUrl,
          altText: saved.altText || def.altText,
          caption: saved.caption !== undefined ? saved.caption : def.caption,
          title: saved.title || def.title,
          description: saved.description || def.description,
          aspectRatio: saved.aspectRatio || def.aspectRatio,
          recommendedSize: saved.recommendedSize || def.recommendedSize,
        };
      }
      return def;
    });

    return NextResponse.json({
      success: true,
      sections: mergedSections,
    });
  } catch (error: any) {
    console.error('Error al obtener imágenes del CMS:', error);
    return NextResponse.json({
      success: true,
      sections: CMS_DEFAULT_SECTIONS,
    });
  }
}

// PUT /api/cms/images - Actualiza la imagen o metadatos SEO de una sección (Protegido para Administradores)
export async function PUT(req: NextRequest) {
  try {
    const session = readCmsSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso no autorizado para modificar imágenes.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { sectionKey, imageUrl, altText, caption, title, page } = body;

    if (!sectionKey || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'sectionKey y imageUrl son requeridos.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const defaultItem = CMS_DEFAULT_SECTIONS.find((d) => d.sectionKey === sectionKey);

    const updated = await CmsSectionImage.findOneAndUpdate(
      { sectionKey },
      {
        sectionKey,
        page: page || defaultItem?.page || 'General',
        title: title || defaultItem?.title || sectionKey,
        description: defaultItem?.description || '',
        imageUrl: String(imageUrl).trim(),
        altText: altText ? String(altText).trim() : defaultItem?.altText || 'Fundación Senda Mujer',
        caption: caption !== undefined ? String(caption).trim() : defaultItem?.caption || '',
        recommendedSize: defaultItem?.recommendedSize || '1200x800px',
        aspectRatio: defaultItem?.aspectRatio || '3:2',
        updatedBy: session.fullName || session.username,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Imagen y metadatos SEO actualizados correctamente.',
      section: updated,
    });
  } catch (error: any) {
    console.error('Error al actualizar imagen de sección CMS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
