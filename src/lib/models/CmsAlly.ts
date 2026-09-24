import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICmsAlly extends Document {
  name: string;
  acronym?: string;
  category: 'public' | 'health' | 'ngo' | 'academic' | 'private' | 'social';
  categoryLabel: string;
  logoUrl: string;
  website?: string;
  phone?: string;
  description: string;
  scope: string;
  isFeaturedInHome: boolean;
  order: number;
  status: 'ACTIVO' | 'INACTIVO';
  createdAt: Date;
  updatedAt: Date;
}

const CmsAllySchema = new Schema<ICmsAlly>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del aliado es obligatorio'],
      trim: true,
    },
    acronym: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['public', 'health', 'ngo', 'academic', 'private', 'social'],
      default: 'ngo',
    },
    categoryLabel: {
      type: String,
      trim: true,
      default: 'Organización Social',
    },
    logoUrl: {
      type: String,
      required: [true, 'El logo o imagen del aliado es obligatorio'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    scope: {
      type: String,
      trim: true,
      default: 'Cartagena / Bolívar',
    },
    isFeaturedInHome: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVO', 'INACTIVO'],
      default: 'ACTIVO',
    },
  },
  {
    timestamps: true,
  }
);

const CmsAlly: Model<ICmsAlly> =
  mongoose.models.CmsAlly || mongoose.model<ICmsAlly>('CmsAlly', CmsAllySchema);

export default CmsAlly;
