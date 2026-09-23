import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICmsSectionImage extends Document {
  sectionKey: string;      // Identificador único (ej: "home_hero", "nosotros_hero")
  page: string;            // Categoría/Página ("Inicio", "Nosotros", "Programas", "Donaciones", "Galería", "Caribe Seguro", "Aliados")
  title: string;           // Título legible de la sección
  description?: string;    // Breve descripción de la ubicación
  imageUrl: string;        // URL final de la imagen (Vercel Blob, CDN o ruta local)
  altText: string;         // Texto alternativo optimizado para SEO y accesibilidad
  caption?: string;        // Pie de foto o autor/crédito
  recommendedSize: string; // Tamaño y proporción sugerida (ej: "1200x800px (3:2)")
  aspectRatio: string;     // ej: "16:9", "3:2", "1:1", "4:3", "banner"
  updatedBy?: string;      // Usuario que realizó el último cambio
  createdAt: Date;
  updatedAt: Date;
}

const CmsSectionImageSchema = new Schema<ICmsSectionImage>(
  {
    sectionKey: {
      type: String,
      required: [true, 'El sectionKey es obligatorio'],
      unique: true,
      trim: true,
      index: true,
    },
    page: {
      type: String,
      required: [true, 'La página es obligatoria'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'La URL de la imagen es obligatoria'],
      trim: true,
    },
    altText: {
      type: String,
      required: [true, 'El texto alternativo SEO es obligatorio'],
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    recommendedSize: {
      type: String,
      default: '1200x800px',
    },
    aspectRatio: {
      type: String,
      default: '3:2',
    },
    updatedBy: {
      type: String,
      default: 'Super Administrador',
    },
  },
  {
    timestamps: true,
  }
);

const CmsSectionImage: Model<ICmsSectionImage> =
  mongoose.models.CmsSectionImage ||
  mongoose.model<ICmsSectionImage>('CmsSectionImage', CmsSectionImageSchema);

export default CmsSectionImage;
