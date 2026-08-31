/**
 * AuditLog Model — Auditoría inmutable de acciones en el ecosistema
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  details: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, default: '' },
  },
  { timestamps: true, collection: 'caribe_audit_logs' }
);

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
