import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaCommunityPost from '@/lib/models/AcademiaCommunityPost';

const INITIAL_POSTS = [
  {
    _id: 'post-1',
    authorName: 'Ana Torres',
    authorRole: 'Emprendedora Caribe · Cartagena',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    title: 'Estrategias de marketing digital en negocios gastronómicos',
    content: '¿Alguien ha aplicado estrategias de marketing digital en su negocio gastronómico o de repostería? ¿Qué resultados han tenido con promociones en WhatsApp Business?',
    category: 'Discusiones',
    groupName: 'Emprendimiento Femenino',
    groupMembers: 'Más de 1.2k miembros',
    likes: 12,
    commentsCount: 4,
    comments: [
      {
        id: 'c-1',
        authorName: 'Karen Ramos',
        authorRole: 'Instructora Senda',
        content: '¡Hola Ana! En negocios de alimentos funciona excelente crear promociones con combos semanales y fotos reales con buena luz natural.',
        createdAt: new Date(Date.now() - 3600000),
        likes: 3,
      },
      {
        id: 'c-2',
        authorName: 'María L.',
        authorRole: 'Estudiante',
        content: 'A mí me funcionó enviar el menú en PDF todos los lunes a las 9am con las recomendaciones de la chef.',
        createdAt: new Date(Date.now() - 7200000),
        likes: 2,
      },
    ],
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    _id: 'post-2',
    authorName: 'Valentina Morales',
    authorRole: 'Diseñadora & Emprendedora Textil',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Recomendaciones de paletas de color en Canva',
    content: 'Acabo de terminar el módulo 2 de Canva y diseñé el nuevo logo de mi taller de confecciones. Me gustaría recibir feedback de las compañeras de la comunidad.',
    category: 'Grupos',
    groupName: 'Habilidades Digitales',
    groupMembers: '890 miembros',
    likes: 19,
    commentsCount: 6,
    comments: [],
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    _id: 'post-3',
    authorName: 'Claudia Patricia',
    authorRole: 'Líder Comunitaria',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    title: 'Sesiones de Mentoría para postulación a fondos',
    content: 'Recuerden que los días jueves a las 4:00 p.m. tenemos la sala de mentoría grupal para revisar presupuestos de proyectos productivos.',
    category: 'Mentorías',
    groupName: 'Mentorías & Acompañamiento',
    groupMembers: '650 miembros',
    likes: 28,
    commentsCount: 8,
    comments: [],
    createdAt: new Date(Date.now() - 86400000),
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const count = await AcademiaCommunityPost.countDocuments();
    if (count === 0) {
      await AcademiaCommunityPost.insertMany(INITIAL_POSTS);
    }
    const posts = await AcademiaCommunityPost.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      posts: posts.length ? posts : INITIAL_POSTS,
    });
  } catch (error) {
    console.warn('Academia community posts fallback', error);
    return NextResponse.json({
      success: true,
      posts: INITIAL_POSTS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authorName, content, category, groupName } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: 'El contenido es requerido' }, { status: 400 });
    }

    const newPost = {
      authorName: authorName || 'Usuario Senda #4821',
      authorRole: 'Miembro de la Comunidad',
      content,
      category: category || 'Discusiones',
      groupName: groupName || 'Emprendimiento Femenino',
      groupMembers: '1.2k miembros',
      likes: 1,
      commentsCount: 0,
      comments: [],
      createdAt: new Date(),
    };

    try {
      await connectToDatabase();
      const created = await AcademiaCommunityPost.create(newPost);
      return NextResponse.json({ success: true, post: created });
    } catch (dbErr) {
      return NextResponse.json({ success: true, post: { ...newPost, _id: `post-${Date.now()}` } });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al publicar' }, { status: 500 });
  }
}
