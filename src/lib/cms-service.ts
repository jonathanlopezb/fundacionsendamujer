import { connectToDatabase } from '@/lib/mongodb';
import CmsSectionImage from '@/lib/models/CmsSectionImage';
import { CMS_DEFAULT_SECTIONS, CmsImageItem } from '@/lib/cms-defaults';

const DEFAULT_MAP = new Map<string, CmsImageItem>();
CMS_DEFAULT_SECTIONS.forEach((item) => {
  DEFAULT_MAP.set(item.sectionKey, item);
});

export async function getCmsImageMap(): Promise<Record<string, CmsImageItem>> {
  const result: Record<string, CmsImageItem> = {};

  // 1. Cargar predeterminados
  CMS_DEFAULT_SECTIONS.forEach((item) => {
    result[item.sectionKey] = { ...item };
  });

  // 2. Sobrescribir con MongoDB
  try {
    await connectToDatabase();
    const saved = await CmsSectionImage.find().lean();
    saved.forEach((item: any) => {
      const def = DEFAULT_MAP.get(item.sectionKey);
      result[item.sectionKey] = {
        sectionKey: item.sectionKey,
        page: item.page || def?.page || 'General',
        title: item.title || def?.title || item.sectionKey,
        description: def?.description || '',
        imageUrl: item.imageUrl || def?.imageUrl || '',
        altText: item.altText || def?.altText || 'Fundación Senda Mujer',
        caption: item.caption !== undefined ? item.caption : def?.caption,
        recommendedSize: def?.recommendedSize || '1200x800px',
        aspectRatio: def?.aspectRatio || '3:2',
      };
    });
  } catch (err: any) {
    console.warn('⚠️ No se pudo conectar a MongoDB para getCmsImageMap (usando defaults):', err.message);
  }

  return result;
}

export async function getCmsImage(sectionKey: string): Promise<CmsImageItem> {
  const def = DEFAULT_MAP.get(sectionKey) || {
    sectionKey,
    page: 'Inicio',
    title: sectionKey,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=85',
    altText: 'Fundación Senda Mujer',
    recommendedSize: '1200x800px',
    aspectRatio: '3:2',
  };

  try {
    await connectToDatabase();
    const item: any = await CmsSectionImage.findOne({ sectionKey }).lean();
    if (item && item.imageUrl) {
      return {
        ...def,
        imageUrl: item.imageUrl,
        altText: item.altText || def.altText,
        caption: item.caption !== undefined ? item.caption : def.caption,
        title: item.title || def.title,
      };
    }
  } catch {
    // Retornar fallback
  }

  return def;
}
