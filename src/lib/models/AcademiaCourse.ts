import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademiaLesson { id: string; title: string; duration: string; videoUrl?: string; transcript?: string; resources?: string[]; }
export interface IAcademiaCourse extends Document {
  slug: string; title: string; subtitle?: string; description?: string; instructor: string; category: string; level: string;
  thumbnailUrl?: string; lessons: IAcademiaLesson[]; learningOutcomes: string[]; certificateEnabled: boolean; published: boolean;
  routeSlug?: string; createdAt: Date; updatedAt: Date;
}

const LessonSchema = new Schema<IAcademiaLesson>({ id: String, title: String, duration: String, videoUrl: String, transcript: String, resources: [String] }, { _id: false });
const AcademiaCourseSchema = new Schema<IAcademiaCourse>({
  slug: { type: String, unique: true, required: true }, title: { type: String, required: true }, subtitle: String, description: String,
  instructor: { type: String, required: true }, category: { type: String, required: true }, level: { type: String, default: 'Básico' },
  thumbnailUrl: String, lessons: { type: [LessonSchema], default: [] }, learningOutcomes: { type: [String], default: [] },
  certificateEnabled: { type: Boolean, default: true }, published: { type: Boolean, default: false }, routeSlug: String,
}, { timestamps: true, collection: 'academia_courses' });

export default mongoose.models.AcademiaCourse || mongoose.model<IAcademiaCourse>('AcademiaCourse', AcademiaCourseSchema);
