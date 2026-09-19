import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface IAcademiaCommunityPost extends Document {
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  title?: string;
  content: string;
  category: 'Todos' | 'Discusiones' | 'Grupos' | 'Mentorías';
  groupName?: string;
  groupMembers?: string;
  likes: number;
  commentsCount: number;
  comments: ICommunityComment[];
  pinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommunityComment>({
  id: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: String,
  authorRole: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
}, { _id: false });

const AcademiaCommunityPostSchema = new Schema<IAcademiaCommunityPost>({
  authorName: { type: String, required: true },
  authorAvatar: String,
  authorRole: { type: String, default: 'Estudiante Senda' },
  title: String,
  content: { type: String, required: true },
  category: { type: String, enum: ['Todos', 'Discusiones', 'Grupos', 'Mentorías'], default: 'Discusiones' },
  groupName: { type: String, default: 'Emprendimiento Femenino' },
  groupMembers: { type: String, default: '1.2k miembros' },
  likes: { type: Number, default: 12 },
  commentsCount: { type: Number, default: 4 },
  comments: { type: [CommentSchema], default: [] },
  pinned: { type: Boolean, default: false },
}, { timestamps: true, collection: 'academia_community_posts' });

export default mongoose.models.AcademiaCommunityPost || mongoose.model<IAcademiaCommunityPost>('AcademiaCommunityPost', AcademiaCommunityPostSchema);
