import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademiaEnrollment extends Document { learnerId: string; courseSlug: string; completedLessonIds: string[]; scores: { assessmentId: string; score: number; passed: boolean; takenAt: Date }[]; notes: { lessonId: string; body: string }[]; status: 'ACTIVE' | 'COMPLETED'; }
const SchemaDef = new Schema<IAcademiaEnrollment>({ learnerId: { type: String, required: true, index: true }, courseSlug: { type: String, required: true, index: true }, completedLessonIds: { type: [String], default: [] }, scores: { type: [{ assessmentId: String, score: Number, passed: Boolean, takenAt: Date }], default: [] }, notes: { type: [{ lessonId: String, body: String }], default: [] }, status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' } }, { timestamps: true, collection: 'academia_enrollments' });
SchemaDef.index({ learnerId: 1, courseSlug: 1 }, { unique: true });
export default mongoose.models.AcademiaEnrollment || mongoose.model<IAcademiaEnrollment>('AcademiaEnrollment', SchemaDef);
