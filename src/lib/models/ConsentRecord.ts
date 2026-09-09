/**
 * ConsentRecord Model — Ley 1581 (Habeas Data)
 *
 * Registro inmutable de consentimiento otorgado o revocado por finalidad.
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IConsentRecord extends Document {
  consentId: string;
  participantId: string;
  purpose: string;
  version: string;
  grantedAt: Date;
  revokedAt?: Date | null;
  status: 'CONCEDIDO' | 'REVOCADO';
  signatureData?: string;
  collectorCode?: string;
}

const ConsentRecordSchema = new Schema<IConsentRecord>(
  {
    consentId: { type: String, required: true, unique: true },
    participantId: { type: String, required: true },
    purpose: { type: String, required: true },
    version: { type: String, default: '1.0' },
    grantedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null },
    status: { type: String, enum: ['CONCEDIDO', 'REVOCADO'], default: 'CONCEDIDO' },
    signatureData: { type: String, select: false },
    collectorCode: { type: String, trim: true, maxlength: 30 },
  },
  { timestamps: true, collection: 'caribe_consents' }
);

export default mongoose.models.ConsentRecord ||
  mongoose.model<IConsentRecord>('ConsentRecord', ConsentRecordSchema);
