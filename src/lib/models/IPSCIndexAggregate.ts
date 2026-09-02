import mongoose, { Schema, Document } from 'mongoose';

export interface IIPSCIndexAggregate extends Document {
  period: string; // ej: 2026-Q3
  territorialUnit: string; // ej: Olaya Herrera, Cartagena
  sampleSize: number; // k>=5 obligado
  averageIPSC: number;
  medianIPSC: number;
  dimensionsAverage: Record<string, number>;
  activeRoutesCount: number;
  isK5Satisfied: boolean;
  generatedAt: Date;
}

const IPSCIndexAggregateSchema = new Schema<IPSCIndexAggregate>(
  {
    period: { type: String, required: true },
    territorialUnit: { type: String, required: true },
    sampleSize: { type: Number, required: true },
    averageIPSC: { type: Number, required: true },
    medianIPSC: { type: Number, required: true },
    dimensionsAverage: { type: Schema.Types.Mixed, required: true },
    activeRoutesCount: { type: Number, default: 0 },
    isK5Satisfied: { type: Boolean, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.IPSCIndexAggregate ||
  mongoose.model<IPSCIndexAggregate>('IPSCIndexAggregate', IPSCIndexAggregateSchema);
