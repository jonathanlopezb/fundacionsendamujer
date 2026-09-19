import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademiaResource {
  title: string;
  url: string;
  type: 'pdf' | 'excel' | 'doc' | 'link';
  size?: string;
}

export interface IAcademiaLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  transcript?: string;
  resources?: IAcademiaResource[];
  isPreview?: boolean;
}

export interface IAcademiaModule {
  title: string;
  description?: string;
  lessons: IAcademiaLesson[];
}

export interface IAcademiaCourse extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  instructor: string;
  instructorRole?: string;
  instructorAvatar?: string;
  category: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  durationWeeks?: string;
  totalDuration?: string;
  rating?: number;
  reviewsCount?: number;
  studentsCount?: number;
  badge?: 'Popular' | 'Nuevo' | 'Destacado' | 'Gratis';
  thumbnailUrl?: string;
  videoPreviewUrl?: string;
  modules: IAcademiaModule[];
  learningOutcomes: string[];
  certificateEnabled: boolean;
  assessmentId?: string;
  published: boolean;
  routeSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IAcademiaResource>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'excel', 'doc', 'link'], default: 'pdf' },
  size: String,
}, { _id: false });

const LessonSchema = new Schema<IAcademiaLesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '15 min' },
  videoUrl: String,
  thumbnailUrl: String,
  description: String,
  transcript: String,
  resources: [ResourceSchema],
  isPreview: { type: Boolean, default: false },
}, { _id: false });

const ModuleSchema = new Schema<IAcademiaModule>({
  title: { type: String, required: true },
  description: String,
  lessons: { type: [LessonSchema], default: [] },
}, { _id: false });

const AcademiaCourseSchema = new Schema<IAcademiaCourse>({
  slug: { type: String, unique: true, required: true, index: true },
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  instructor: { type: String, required: true },
  instructorRole: { type: String, default: 'Docente Especialista Senda Mujer' },
  instructorAvatar: String,
  category: { type: String, required: true, index: true },
  level: { type: String, enum: ['Básico', 'Intermedio', 'Avanzado'], default: 'Básico' },
  durationWeeks: { type: String, default: '6 semanas' },
  totalDuration: { type: String, default: '3h 20min' },
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 128 },
  studentsCount: { type: Number, default: 420 },
  badge: { type: String, enum: ['Popular', 'Nuevo', 'Destacado', 'Gratis'], default: 'Popular' },
  thumbnailUrl: String,
  videoPreviewUrl: String,
  modules: { type: [ModuleSchema], default: [] },
  learningOutcomes: { type: [String], default: [] },
  certificateEnabled: { type: Boolean, default: true },
  assessmentId: String,
  published: { type: Boolean, default: true },
  routeSlug: String,
}, { timestamps: true, collection: 'academia_courses' });

export default mongoose.models.AcademiaCourse || mongoose.model<IAcademiaCourse>('AcademiaCourse', AcademiaCourseSchema);
