import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICmsGalleryItem extends Document {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  date?: string;
  location?: string;
  participants?: string;
  altText?: string;
  order: number;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CmsGalleryItemSchema = new Schema<ICmsGalleryItem>(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'La URL de la imagen es obligatoria'],
      trim: true,
    },
    date: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'Cartagena de Indias',
    },
    participants: {
      type: String,
      trim: true,
      default: '',
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    updatedBy: {
      type: String,
      default: 'Administrador',
    },
  },
  {
    timestamps: true,
  }
);

const CmsGalleryItem: Model<ICmsGalleryItem> =
  mongoose.models.CmsGalleryItem ||
  mongoose.model<ICmsGalleryItem>('CmsGalleryItem', CmsGalleryItemSchema);

export default CmsGalleryItem;
