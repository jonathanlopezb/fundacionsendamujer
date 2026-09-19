import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface IAssessmentQuestion {
  id: string;
  question: string;
  options: IAssessmentOption[];
  explanation: string;
  points?: number;
}

export interface IAcademiaAssessment extends Document {
  courseSlug: string;
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore: number; // percentage, e.g. 70
  questions: IAssessmentQuestion[];
  isPretest?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IAssessmentOption>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { _id: false });

const QuestionSchema = new Schema<IAssessmentQuestion>({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [OptionSchema], default: [] },
  explanation: { type: String, default: '' },
  points: { type: Number, default: 10 },
}, { _id: false });

const AcademiaAssessmentSchema = new Schema<IAcademiaAssessment>({
  courseSlug: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  durationMinutes: { type: Number, default: 20 },
  passingScore: { type: Number, default: 70 },
  questions: { type: [QuestionSchema], default: [] },
  isPretest: { type: Boolean, default: false },
}, { timestamps: true, collection: 'academia_assessments' });

export default mongoose.models.AcademiaAssessment || mongoose.model<IAcademiaAssessment>('AcademiaAssessment', AcademiaAssessmentSchema);
