import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaCourse from '@/lib/models/AcademiaCourse';
import { INITIAL_COURSES } from '../route';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectToDatabase();
    const course = await AcademiaCourse.findOne({
      $or: [{ slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
    }).lean();

    if (course) {
      return NextResponse.json({ success: true, course, source: 'mongodb' });
    }

    // Fallback to initial courses list
    const fallbackCourse = INITIAL_COURSES.find(
      (c) => c.slug === id || c.slug.includes(id) || id.includes(c.slug)
    ) || INITIAL_COURSES[0];

    return NextResponse.json({ success: true, course: fallbackCourse, source: 'mock' });
  } catch (error) {
    console.warn('Academia single course fetch fallback', error);
    const fallbackCourse = INITIAL_COURSES.find((c) => c.slug === id) || INITIAL_COURSES[0];
    return NextResponse.json({ success: true, course: fallbackCourse, source: 'mock' });
  }
}
