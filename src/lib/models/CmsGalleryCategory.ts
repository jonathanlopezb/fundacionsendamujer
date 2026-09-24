import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICmsGalleryCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CmsGalleryCategorySchema = new Schema<ICmsGalleryCategory>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CmsGalleryCategory: Model<ICmsGalleryCategory> =
  mongoose.models.CmsGalleryCategory ||
  mongoose.model<ICmsGalleryCategory>('CmsGalleryCategory', CmsGalleryCategorySchema);

export default CmsGalleryCategory;
