import { NextRequest, NextResponse } from 'next/server';
import { requireCrmAuth } from '@/lib/crm/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Schema, model, models, Document } from 'mongoose';

// ── Inline models ────────────────────────────────────────────────────
interface IProvider extends Document {
  code: string;
  name: string;
  nit: string;
  contactName?: string;
  phone?: string;
  email?: string;
  category: string;
  status: 'ACTIVO' | 'INACTIVO';
  notes?: string;
}

interface IContract extends Document {
  code: string;
  providerId: string;
  providerName: string;
  description: string;
  startDate: string;
  endDate?: string;
  totalAmount: number;
  amountPaid: number;
  status: 'VIGENTE' | 'VENCIDO' | 'CANCELADO' | 'FINALIZADO';
}

interface IProviderPayment extends Document {
  code: string;
  providerId: string;
  providerName: string;
  contractId?: string;
  description: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: 'PENDIENTE' | 'PAGADO' | 'RECHAZADO';
}

const ProviderSchema = new Schema<IProvider>({
  code:        { type: String, unique: true, required: true },
  name:        { type: String, required: true },
  nit:         { type: String, required: true },
  contactName: String,
  phone:       String,
  email:       String,
  category:    { type: String, default: 'General' },
  status:      { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  notes:       String,
}, { timestamps: true });

const ContractSchema = new Schema<IContract>({
  code:         { type: String, unique: true, required: true },
  providerId:   { type: String, required: true },
  providerName: { type: String, required: true },
  description:  { type: String, required: true },
  startDate:    { type: String, required: true },
  endDate:      String,
  totalAmount:  { type: Number, default: 0 },
  amountPaid:   { type: Number, default: 0 },
  status:       { type: String, enum: ['VIGENTE', 'VENCIDO', 'CANCELADO', 'FINALIZADO'], default: 'VIGENTE' },
}, { timestamps: true });

const ProviderPaymentSchema = new Schema<IProviderPayment>({
  code:         { type: String, unique: true, required: true },
  providerId:   { type: String, required: true },
  providerName: { type: String, required: true },
  contractId:   String,
  description:  { type: String, required: true },
  amount:       { type: Number, required: true },
  paymentDate:  { type: String, required: true },
  method:       { type: String, default: 'Transferencia' },
  status:       { type: String, enum: ['PENDIENTE', 'PAGADO', 'RECHAZADO'], default: 'PENDIENTE' },
}, { timestamps: true });

const Provider        = models.CrmProvider        ?? model<IProvider>('CrmProvider', ProviderSchema);
const Contract        = models.CrmContract        ?? model<IContract>('CrmContract', ContractSchema);
const ProviderPayment = models.CrmProviderPayment ?? model<IProviderPayment>('CrmProviderPayment', ProviderPaymentSchema);

async function getNextCode(prefix: string): Promise<string> {
  const Counter = models.CrmCounter ?? model('CrmCounter', new Schema({ _id: String, seq: { type: Number, default: 0 } }));
  const year = new Date().getFullYear();
  const key = `${prefix}-${year}`;
  const doc = await Counter.findByIdAndUpdate(key, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return `${prefix}-${year}-${String(doc.seq).padStart(4, '0')}`;
}

// ── GET ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const entity = searchParams.get('entity') ?? 'providers';
    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status');
    const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));

    if (entity === 'providers') {
      const filter: Record<string, unknown> = {};
      if (status) filter.status = status;
      if (search) filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nit: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
      ];
      const total = await Provider.countDocuments(filter);
      const providers = await Provider.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
      return NextResponse.json({ providers, total, page, limit });
    }

    if (entity === 'contracts') {
      const filter: Record<string, unknown> = {};
      if (status) filter.status = status;
      const providerId = searchParams.get('providerId');
      if (providerId) filter.providerId = providerId;
      const total = await Contract.countDocuments(filter);
      const contracts = await Contract.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
      return NextResponse.json({ contracts, total, page, limit });
    }

    if (entity === 'payments') {
      const filter: Record<string, unknown> = {};
      if (status) filter.status = status;
      const providerId = searchParams.get('providerId');
      if (providerId) filter.providerId = providerId;
      const total = await ProviderPayment.countDocuments(filter);
      const payments = await ProviderPayment.find(filter).sort({ paymentDate: -1 }).skip((page - 1) * limit).limit(limit).lean();
      const summary = await ProviderPayment.aggregate([
        { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]);
      return NextResponse.json({ payments, total, page, limit, summary });
    }

    return NextResponse.json({ error: 'Entity desconocida' }, { status: 400 });
  } catch (error) {
    console.error('[proveedores GET]', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { action } = body;

    if (action === 'CREATE_PROVIDER') {
      const { name, nit, contactName, phone, email, category, notes } = body;
      if (!name || !nit) return NextResponse.json({ error: 'Nombre y NIT requeridos' }, { status: 400 });
      const code = await getNextCode('PRV');
      const provider = await Provider.create({ code, name, nit, contactName, phone, email, category: category ?? 'General', notes });
      return NextResponse.json({ success: true, provider });
    }

    if (action === 'UPDATE_PROVIDER') {
      const { providerId, ...updates } = body;
      delete updates.action;
      const provider = await Provider.findByIdAndUpdate(providerId, updates, { new: true });
      return NextResponse.json({ success: true, provider });
    }

    if (action === 'DELETE_PROVIDER') {
      await Provider.findByIdAndDelete(body.providerId);
      return NextResponse.json({ success: true });
    }

    if (action === 'CREATE_CONTRACT') {
      const { providerId, providerName, description, startDate, endDate, totalAmount } = body;
      if (!providerId || !description || !startDate) return NextResponse.json({ error: 'Faltan datos del contrato' }, { status: 400 });
      const code = await getNextCode('CTR');
      const contract = await Contract.create({ code, providerId, providerName, description, startDate, endDate, totalAmount: Number(totalAmount ?? 0) });
      return NextResponse.json({ success: true, contract });
    }

    if (action === 'UPDATE_CONTRACT_STATUS') {
      const { contractId, newStatus } = body;
      const contract = await Contract.findByIdAndUpdate(contractId, { status: newStatus }, { new: true });
      return NextResponse.json({ success: true, contract });
    }

    if (action === 'CREATE_PAYMENT') {
      const { providerId, providerName, contractId, description, amount, paymentDate, method } = body;
      if (!providerId || !amount || !paymentDate) return NextResponse.json({ error: 'Proveedor, monto y fecha son requeridos' }, { status: 400 });
      const code = await getNextCode('PAG');
      const payment = await ProviderPayment.create({
        code, providerId, providerName, contractId,
        description: description ?? 'Pago a proveedor',
        amount: Number(amount),
        paymentDate,
        method: method ?? 'Transferencia',
        status: 'PENDIENTE',
      });
      if (contractId) {
        await Contract.findByIdAndUpdate(contractId, { $inc: { amountPaid: Number(amount) } });
      }
      return NextResponse.json({ success: true, payment });
    }

    if (action === 'UPDATE_PAYMENT_STATUS') {
      const { paymentId, newStatus } = body;
      const payment = await ProviderPayment.findByIdAndUpdate(paymentId, { status: newStatus }, { new: true });
      return NextResponse.json({ success: true, payment });
    }

    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 });
  } catch (error) {
    console.error('[proveedores POST]', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
