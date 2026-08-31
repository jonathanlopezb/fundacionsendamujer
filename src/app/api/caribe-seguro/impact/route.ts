import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ImpactMetric from '@/lib/models/ImpactMetric';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function GET() {
  try {
    await connectToDatabase();
    await seedCaribeSeguroData();
    const metrics = await ImpactMetric.find().sort({ metricCode: 1 });
    return NextResponse.json({ success: true, count: metrics.length, data: metrics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
