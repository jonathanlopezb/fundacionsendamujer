import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import RouteEngine from '@/lib/models/RouteEngine';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function GET() {
  try {
    await connectToDatabase();
    await seedCaribeSeguroData();
    const routes = await RouteEngine.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: routes.length, data: routes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
