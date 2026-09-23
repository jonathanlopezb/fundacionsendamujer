import { CMS_DEFAULT_SECTIONS, CmsImageItem } from './cms-defaults';

const DEFAULT_MAP = new Map<string, CmsImageItem>();
CMS_DEFAULT_SECTIONS.forEach((item) => {
  DEFAULT_MAP.set(item.sectionKey, item);
});

export function getCmsDefaultImage(sectionKey: string): CmsImageItem {
  return (
    DEFAULT_MAP.get(sectionKey) || {
      sectionKey,
      page: 'Inicio',
      title: sectionKey,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=85',
      altText: 'Fundación Senda Mujer',
      recommendedSize: '1200x800px',
      aspectRatio: '3:2',
    }
  );
}
