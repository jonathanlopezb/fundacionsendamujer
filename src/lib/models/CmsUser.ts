import mongoose, { Schema, Document, Model } from 'mongoose';

export type CmsUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
export type CmsUserStatus = 'ACTIVO' | 'INACTIVO';

export interface ICmsUser extends Document {
  fullName: string;
  email: string;
  username: string;
  documentNumber?: string;
  passwordHash: string;
  role: CmsUserRole;
  status: CmsUserStatus;
  lastLogin?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CmsUserSchema = new Schema<ICmsUser>(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre completo es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'El nombre de usuario o cédula es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    documentNumber: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      required: [true, 'El hash de contraseña es obligatorio'],
      select: false,
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
      default: 'ADMIN',
    },
    status: {
      type: String,
      enum: ['ACTIVO', 'INACTIVO'],
      default: 'ACTIVO',
    },
    lastLogin: {
      type: Date,
    },
    createdBy: {
      type: String,
      default: 'SISTEMA',
    },
  },
  {
    timestamps: true,
  }
);

// Prevenir recompilación del modelo en Next.js hot-reload
const CmsUser: Model<ICmsUser> =
  mongoose.models.CmsUser || mongoose.model<ICmsUser>('CmsUser', CmsUserSchema);

export default CmsUser;
