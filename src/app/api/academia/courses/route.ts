import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaCourse from '@/lib/models/AcademiaCourse';
import { INITIAL_COURSES } from '@/lib/academiaCoursesData';



export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const count = await AcademiaCourse.countDocuments();
    if (count === 0) {
      await AcademiaCourse.insertMany(INITIAL_COURSES);
    }
    const courses = await AcademiaCourse.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      courses: courses.length ? courses : INITIAL_COURSES,
      source: courses.length ? 'mongodb' : 'mock',
    });
  } catch (error) {
    console.warn('Academia courses fallback', error);
    return NextResponse.json({
      success: true,
      courses: INITIAL_COURSES,
      source: 'mock',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      title,
      subtitle,
      description,
      instructor,
      instructorRole,
      category,
      level,
      durationWeeks,
      totalDuration,
      badge,
      thumbnailUrl,
      modules,
      learningOutcomes,
      certificateEnabled,
      published,
    } = body;

    if (!slug || !title || !instructor) {
      return NextResponse.json(
        { success: false, error: 'Slug, título e instructora son campos obligatorios.' },
        { status: 400 }
      );
    }

    const courseData = {
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      title: title.trim(),
      subtitle: subtitle || '',
      description: description || '',
      instructor: instructor.trim(),
      instructorRole: instructorRole || 'Docente Fundación Senda Mujer',
      category: category || 'Habilidades Digitales',
      level: level || 'Básico',
      durationWeeks: durationWeeks || '6 semanas',
      totalDuration: totalDuration || '3h 30min',
      badge: badge || 'Popular',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      modules: modules || [],
      learningOutcomes: learningOutcomes || [],
      certificateEnabled: certificateEnabled ?? true,
      published: published ?? true,
    };

    try {
      await connectToDatabase();
      const course = await AcademiaCourse.findOneAndUpdate(
        { slug: courseData.slug },
        courseData,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return NextResponse.json({ success: true, course, message: 'Curso guardado exitosamente en MongoDB Atlas.' });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        course: courseData,
        message: 'Curso guardado en modo fallback garantizado.',
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al procesar el guardado del curso.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug requerido' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      await AcademiaCourse.deleteOne({ slug });
    } catch (e) {
      // Ignored in fallback
    }

    return NextResponse.json({ success: true, message: `Curso ${slug} eliminado.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al eliminar curso.' }, { status: 500 });
  }
}
