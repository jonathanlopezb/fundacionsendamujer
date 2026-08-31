import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DataRoomDocument from '@/lib/models/DataRoomDocument';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function GET() {
  try {
    await connectToDatabase();
    await seedCaribeSeguroData();
    const docs = await DataRoomDocument.find().sort({ docCode: 1 });
    return NextResponse.json({ success: true, count: docs.length, data: docs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
