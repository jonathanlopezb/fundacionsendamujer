import { NextRequest, NextResponse } from 'next/server';
import { requireCrmAuth } from '@/lib/crm/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Schema, model, models, Document } from 'mongoose';

// ── Payroll model ────────────────────────────────────────────────────
interface IPayrollItem {
  employeeName: string;
  role: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
}

interface IPayroll extends Document {
  code: string;
  period: string;
  periodLabel: string;
  payDate: string;
  status: 'BORRADOR' | 'APROBADA' | 'PAGADA' | 'CANCELADA';
  totalGross: number;
  totalNet: number;
  employeeCount: number;
  items: IPayrollItem[];
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollItemSchema = new Schema<IPayrollItem>({
  employeeName: { type: String, required: true },
  role:         { type: String, default: '' },
  baseSalary:   { type: Number, default: 0 },
  bonuses:      { type: Number, default: 0 },
  deductions:   { type: Number, default: 0 },
  netPay:       { type: Number, default: 0 },
}, { _id: false });

const PayrollSchema = new Schema<IPayroll>({
  code:          { type: String, unique: true, required: true },
  period:        { type: String, required: true },
  periodLabel:   { type: String, required: true },
  payDate:       { type: String, required: true },
  status:        { type: String, enum: ['BORRADOR', 'APROBADA', 'PAGADA', 'CANCELADA'], default: 'BORRADOR' },
  totalGross:    { type: Number, default: 0 },
  totalNet:      { type: Number, default: 0 },
  employeeCount: { type: Number, default: 0 },
  items:         [PayrollItemSchema],
  notes:         { type: String },
  createdBy:     { type: String, required: true },
}, { timestamps: true });

const Payroll = models.CrmPayroll ?? model<IPayroll>('CrmPayroll', PayrollSchema);

// Counter helper
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
    const status = searchParams.get('status');
    const period = searchParams.get('period');
    const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (period) filter.period = period;

    const total    = await Payroll.countDocuments(filter);
    const payrolls = await Payroll.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const stats = await Payroll.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalNet' } } },
    ]);

    return NextResponse.json({ payrolls, total, page, limit, stats });
  } catch (error) {
    console.error('[nominas GET]', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;
  const { user } = auth;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { action } = body;

    if (action === 'CREATE') {
      const { period, periodLabel, payDate, items = [], notes } = body;
      if (!period || !payDate) {
        return NextResponse.json({ error: 'Periodo y fecha de pago son requeridos' }, { status: 400 });
      }

      const enrichedItems: IPayrollItem[] = (items as Partial<IPayrollItem>[]).map((it) => {
        const baseSalary  = Number(it.baseSalary  ?? 0);
        const bonuses     = Number(it.bonuses     ?? 0);
        const deductions  = Number(it.deductions  ?? 0);
        const netPay      = baseSalary + bonuses - deductions;
        return {
          employeeName: it.employeeName ?? '',
          role:         it.role ?? '',
          baseSalary,
          bonuses,
          deductions,
          netPay,
        };
      });

      const totalGross    = enrichedItems.reduce((s: number, i: IPayrollItem) => s + i.baseSalary + i.bonuses, 0);
      const totalNet      = enrichedItems.reduce((s: number, i: IPayrollItem) => s + i.netPay, 0);
      const employeeCount = enrichedItems.length;

      const code = await getNextCode('NOM');
      const payroll = await Payroll.create({
        code,
        period,
        periodLabel: periodLabel ?? period,
        payDate,
        status: 'BORRADOR',
        totalGross,
        totalNet,
        employeeCount,
        items: enrichedItems,
        notes,
        createdBy: user.userId,
      });

      return NextResponse.json({ success: true, payroll });
    }

    if (action === 'UPDATE_STATUS') {
      const { payrollId, newStatus } = body;
      if (!payrollId || !newStatus) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
      const updated = await Payroll.findByIdAndUpdate(payrollId, { status: newStatus }, { new: true });
      return NextResponse.json({ success: true, payroll: updated });
    }

    if (action === 'ADD_EMPLOYEE') {
      const { payrollId, employee } = body;
      const payroll = await Payroll.findById(payrollId);
      if (!payroll) return NextResponse.json({ error: 'Nómina no encontrada' }, { status: 404 });

      const baseSalary = Number(employee.baseSalary ?? 0);
      const bonuses    = Number(employee.bonuses    ?? 0);
      const deductions = Number(employee.deductions ?? 0);
      const netPay     = baseSalary + bonuses - deductions;
      payroll.items.push({ employeeName: employee.employeeName, role: employee.role ?? '', baseSalary, bonuses, deductions, netPay });
      payroll.totalGross    = payroll.items.reduce((s: number, i: IPayrollItem) => s + i.baseSalary + i.bonuses, 0);
      payroll.totalNet      = payroll.items.reduce((s: number, i: IPayrollItem) => s + i.netPay, 0);
      payroll.employeeCount = payroll.items.length;
      await payroll.save();

      return NextResponse.json({ success: true, payroll });
    }

    if (action === 'DELETE') {
      await Payroll.findByIdAndDelete(body.payrollId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 });
  } catch (error) {
    console.error('[nominas POST]', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
