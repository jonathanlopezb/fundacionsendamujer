import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunitySurvey extends Document {
  surveyCode: string;
  collectorCode?: string;
  fieldZone?: string;
  householdSize: number;
  minorCount: number;
  needs: string[];
  priority: 'NORMAL' | 'PRIORITARIA' | 'INMEDIATA';
  consentGranted: boolean;
  createdAt: Date;
}

const CommunitySurveySchema = new Schema<ICommunitySurvey>({
  surveyCode: { type: String, required: true, unique: true },
  collectorCode: { type: String, trim: true, maxlength: 30 },
  fieldZone: { type: String, trim: true, maxlength: 50 },
  householdSize: { type: Number, required: true, min: 1, max: 30 },
  minorCount: { type: Number, required: true, min: 0, max: 30 },
  needs: [{ type: String }],
  priority: { type: String, enum: ['NORMAL', 'PRIORITARIA', 'INMEDIATA'], required: true },
  consentGranted: { type: Boolean, required: true },
}, { timestamps: true, collection: 'community_surveys' });

export default mongoose.models.CommunitySurvey || mongoose.model<ICommunitySurvey>('CommunitySurvey', CommunitySurveySchema);
