/**
 * ImpactMetric Model — SENDA Impact Engine
 *
 * Clasificación formal: INPUT -> ACTIVITY -> OUTPUT -> OUTCOME -> IMPACT
 * Métricas Pre/Post e Indicadores de Costo-Efectividad.
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactMetric extends Document {
  metricCode: string;
  metricType: 'INPUT' | 'ACTIVITY' | 'OUTPUT' | 'OUTCOME' | 'IMPACT';
  title: string;
  value: number;
  unit: string;
  baselineValue?: number | null;
  endlineValue?: number | null;
  costPerUnit?: number | null;
  period: string;
}

const ImpactMetricSchema = new Schema<IImpactMetric>(
  {
    metricCode: { type: String, required: true, unique: true },
    metricType: {
      type: String,
      enum: ['INPUT', 'ACTIVITY', 'OUTPUT', 'OUTCOME', 'IMPACT'],
      required: true,
    },
    title: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    baselineValue: { type: Number, default: null },
    endlineValue: { type: Number, default: null },
    costPerUnit: { type: Number, default: null },
    period: { type: String, default: '2026' },
  },
  { timestamps: true, collection: 'caribe_impact_metrics' }
);

export default mongoose.models.ImpactMetric ||
  mongoose.model<IImpactMetric>('ImpactMetric', ImpactMetricSchema);
