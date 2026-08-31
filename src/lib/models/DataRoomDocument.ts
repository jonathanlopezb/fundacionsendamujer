/**
 * DataRoomDocument Model — Bóveda de Documentación para Cooperantes
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IDataRoomDocument extends Document {
  docCode: string;
  title: string;
  category: 'PROYECTO' | 'PRESUPUESTO' | 'TEORIA_CAMBIO' | 'AUDITORIA' | 'METODOLOGIA' | 'EVIDENCIA';
  restrictedRole: string[];
  fileUrl: string;
  fileSize: string;
  version: string;
}

const DataRoomDocumentSchema = new Schema<IDataRoomDocument>(
  {
    docCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['PROYECTO', 'PRESUPUESTO', 'TEORIA_CAMBIO', 'AUDITORIA', 'METODOLOGIA', 'EVIDENCIA'],
      required: true,
    },
    restrictedRole: [{ type: String }],
    fileUrl: { type: String, required: true },
    fileSize: { type: String, default: '1.2 MB' },
    version: { type: String, default: '2026.1' },
  },
  { timestamps: true, collection: 'caribe_dataroom' }
);

export default mongoose.models.DataRoomDocument ||
  mongoose.model<IDataRoomDocument>('DataRoomDocument', DataRoomDocumentSchema);
