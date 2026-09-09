import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityIdentity extends Document {
  surveyCode: string;
  fullName: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PPT' | 'OTRO';
  documentNumber: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood: string;
}

const CommunityIdentitySchema = new Schema<ICommunityIdentity>({
  surveyCode: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  documentType: { type: String, required: true, enum: ['CC', 'CE', 'TI', 'PPT', 'OTRO'] },
  documentNumber: { type: String, required: true, trim: true, maxlength: 30 },
  phone: { type: String, required: true, trim: true, maxlength: 25 },
  email: { type: String, trim: true, maxlength: 120 },
  address: { type: String, required: true, trim: true, maxlength: 180 },
  neighborhood: { type: String, required: true, trim: true, maxlength: 80 },
}, { timestamps: true, collection: 'community_identities' });

export default mongoose.models.CommunityIdentity || mongoose.model<ICommunityIdentity>('CommunityIdentity', CommunityIdentitySchema);
