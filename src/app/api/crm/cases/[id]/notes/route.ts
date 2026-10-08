import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmCase, CrmCaseNote } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireCrmAuth(req, 'cases.notes_write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const caseDoc = await CrmCase.findById(params.id);

    if (!caseDoc) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { kind = 'SESSION_NOTE', body: noteBody, visibilityRoles = [] } = body;

    if (!noteBody || !noteBody.trim()) {
      return NextResponse.json({ error: 'El contenido de la nota no puede estar vacío' }, { status: 400 });
    }

    const note = await CrmCaseNote.create({
      caseId: caseDoc._id.toString(),
      authorId: auth.user.userId,
      authorName: auth.user.name,
      authorRole: auth.user.role,
      kind,
      body: noteBody.trim(),
      visibilityRoles,
      classification: 'RESTRICTED',
    });

    // Actualizar fecha de último seguimiento en el caso
    caseDoc.lastFollowUpAt = new Date();
    await caseDoc.save();

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_CASE_NOTE',
      'CrmCaseNote',
      note._id.toString(),
      { caseId: caseDoc._id.toString(), caseNumber: caseDoc.caseNumber, kind },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Nota confidencial agregada al expediente',
      note,
    });
  } catch (error: any) {
    console.error('Error al registrar nota de caso CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al guardar nota' }, { status: 500 });
  }
}
