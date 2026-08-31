/**
 * RouteEngine Model — Caribe Seguro Route Engine
 *
 * Trazabilidad de rutas de atención institucionales y medición de tiempos
 * (time_to_orientation, time_to_activation, time_to_service).
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IRouteEngine extends Document {
  routeId: string;
  participantId: string;
  anonymizedCode: string;
  serviceName: string;
  institutionName: string;
  priority: 'ALTA' | 'MEDIA' | 'EMERGENCIA';
  status: 'PENDING' | 'ACTIVATED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVIEW';
  requestedAt: Date;
  orientedAt?: Date | null;
  activatedAt?: Date | null;
  completedAt?: Date | null;
  notes?: string;
}

const RouteEngineSchema = new Schema<IRouteEngine>(
  {
    routeId: { type: String, required: true, unique: true },
    participantId: { type: String, required: true },
    anonymizedCode: { type: String, required: true },
    serviceName: { type: String, required: true },
    institutionName: { type: String, required: true },
    priority: { type: String, enum: ['ALTA', 'MEDIA', 'EMERGENCIA'], default: 'MEDIA' },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVATED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NEEDS_REVIEW'],
      default: 'PENDING',
    },
    requestedAt: { type: Date, default: Date.now },
    orientedAt: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true, collection: 'caribe_routes' }
);

export default mongoose.models.RouteEngine ||
  mongoose.model<IRouteEngine>('RouteEngine', RouteEngineSchema);
