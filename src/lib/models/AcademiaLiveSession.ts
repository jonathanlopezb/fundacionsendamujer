import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveChatMessage {
  id: string;
  senderName: string; // Anonymous/safe display name e.g. "Laura G." or "Usuario Senda #4821"
  senderAvatar?: string;
  message: string;
  timestamp: Date;
  isHost?: boolean;
}

export interface IAcademiaLiveSession extends Document {
  title: string;
  subtitle?: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar?: string;
  category: string;
  scheduledDate: string; // e.g. "Hoy - 5:00 p.m." or ISO
  scheduledTime: string;
  durationMinutes: number;
  status: 'UPCOMING' | 'LIVE' | 'RECORDED';
  viewersCount: number;
  registeredCount: number;
  streamUrl?: string;
  recordingUrl?: string;
  chatMessages: ILiveChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const LiveChatMessageSchema = new Schema<ILiveChatMessage>({
  id: { type: String, required: true },
  senderName: { type: String, required: true },
  senderAvatar: String,
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isHost: { type: Boolean, default: false },
}, { _id: false });

const AcademiaLiveSessionSchema = new Schema<IAcademiaLiveSession>({
  title: { type: String, required: true },
  subtitle: String,
  instructor: { type: String, required: true },
  instructorRole: { type: String, default: 'Docente Fundación Senda Mujer' },
  instructorAvatar: String,
  category: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, default: '5:00 p.m. - 6:30 p.m.' },
  durationMinutes: { type: Number, default: 90 },
  status: { type: String, enum: ['UPCOMING', 'LIVE', 'RECORDED'], default: 'LIVE' },
  viewersCount: { type: Number, default: 1240 },
  registeredCount: { type: Number, default: 480 },
  streamUrl: String,
  recordingUrl: String,
  chatMessages: { type: [LiveChatMessageSchema], default: [] },
}, { timestamps: true, collection: 'academia_live_sessions' });

export default mongoose.models.AcademiaLiveSession || mongoose.model<IAcademiaLiveSession>('AcademiaLiveSession', AcademiaLiveSessionSchema);
