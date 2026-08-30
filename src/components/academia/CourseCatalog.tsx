'use client';
import React, { useState } from 'react';
import { BookOpen, Star, Clock, Lock, Play, Award, Sparkles, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import CoursePlayerModal, { CourseData } from './CoursePlayerModal';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
}

const COURSES: CourseData[] = [
  {
    id: 'course-1',
    title: 'De la Idea al Negocio: Plan Financiero para Emprendedoras',
    instructor: 'Dra. Sorelvis Murillo',
    category: 'Autonomía Financiera',
    modules: [
      {
        title: 'Fundamentos del Emprendimiento Femenino',
        lessons: [
          { id: '1-1', title: '1.1 Definición de la Idea de Negocio', duration: '12 min', isPreview: true },
          { id: '1-2', title: '1.2 Costos Fijos vs. Variables', duration: '18 min' },
          { id: '1-3', title: '1.3 Elaboración de Presupuesto Inicial', duration: '22 min' },
        ],
      },
      {
        title: 'Estrategia de Ventas y Canales Digitales',
        lessons: [
          { id: '1-4', title: '2.1 Definición de Precio de Venta', duration: '15 min' },
          { id: '1-5', title: '2.2 Microcréditos y Gestión de Capital', duration: '20 min' },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Ventas en WhatsApp Business & Marketing Digital',
    instructor: 'Mg. Karen Ramos',
    category: 'Autonomía Financiera',
    modules: [
      {
        title: 'Configuración de WhatsApp Business',
        lessons: [
          { id: '2-1', title: '1.1 Catálogo de Productos Móvil', duration: '14 min', isPreview: true },
          { id: '2-2', title: '1.2 Mensajes Automatizados de Bienvenida', duration: '16 min' },
        ],
      },
      {
        title: 'Redes Sociales para Emprendedoras',
        lessons: [
          { id: '2-3', title: '2.1 Creación de Contenido en Canva', duration: '25 min' },
          { id: '2-4', title: '2.2 Estrategia de Publicaciones en Instagram', duration: '20 min' },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Derechos Humanos y Ley 1257 en Colombia',
    instructor: 'Abg. Carlos Mendoza',
    category: 'Derechos & Liderazgo',
    modules: [
      {
        title: 'Marco Normativo de la Ley 1257',
        lessons: [
          { id: '3-1', title: '1.1 Definición de Tipos de Violencia', duration: '15 min', isPreview: true },
          { id: '3-2', title: '1.2 Rutas de Atención Institucional en Cartagena', duration: '24 min' },
        ],
      },
      {
        title: 'Mecanismos de Protección Urgente',
        lessons: [
          { id: '3-3', title: '2.1 Redacción de Tutela para Salud y Vida', duration: '28 min' },
          { id: '3-4', title: '2.2 Medidas de Alejamiento Defensoriales', duration: '20 min' },
        ],
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Salud Sexual, Reproductiva y Sentencia C-055',
    instructor: 'Dra. María Patricia Gómez',
    category: 'Salud & Bienestar',
    modules: [
      {
        title: 'Derechos Reproductivos en Colombia',
        lessons: [
          { id: '4-1', title: '1.1 Entendiendo la Sentencia C-055', duration: '18 min', isPreview: true },
          { id: '4-2', title: '1.2 Métodos Anticonceptivos de Larga Duración', duration: '22 min' },
        ],
      },
      {
        title: 'Prevención de ITS y Autocuidado',
        lessons: [
          { id: '4-3', title: '2.1 Profilaxis de Emergencia', duration: '16 min' },
          { id: '4-4', title: '2.2 Bienestar Ginecológico Integral', duration: '20 min' },
        ],
      },
    ],
  },
  {
    id: 'course-5',
    title: 'Computación Básica e Inteligencia Artificial para la Vida',
    instructor: 'Ing. Alejandro Silva',
    category: 'Habilidades Digitales',
    modules: [
      {
        title: 'Uso de Herramientas Digitales Diarias',
        lessons: [
          { id: '5-1', title: '1.1 Navegación Segura e Email', duration: '15 min', isPreview: true },
          { id: '5-2', title: '1.2 Introducción a ChatGPT para Emprendimientos', duration: '25 min' },
        ],
      },
    ],
  },
];

export default function CourseCatalog({ user, onOpenAuth }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  const categories = ['Todos', 'Autonomía Financiera', 'Derechos & Liderazgo', 'Salud & Bienestar', 'Habilidades Digitales'];

  const filteredCourses = selectedCategory === 'Todos'
    ? COURSES
    : COURSES.filter((c) => c.category === selectedCategory);

  const handleLaunchCourse = (course: CourseData) => {
    if (!user) {
      onOpenAuth();
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">

      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-[#52166F]/80 border border-pink-400/30 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Catálogo Formativo Institucional</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Rutas de Aprendizaje SendaAcademia
        </h2>
        <p className="text-sm sm:text-base text-pink-100/80 leading-relaxed">
          Explora los programas formativos diseñados por la Fundación Senda Mujer para potenciar la autonomía económica, los derechos humanos y la salud en Cartagena.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white shadow-lg border border-pink-400/40 scale-[1.02]'
                : 'bg-[#270538] text-pink-200/80 hover:bg-[#3B0852] hover:text-white border border-pink-500/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

          return (
            <div
              key={course.id}
              className="bg-gradient-to-b from-[#270538] to-[#3B0852] border border-pink-500/30 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-pink-400 hover:shadow-2xl hover:-translate-y-1.5 group relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-pink-200 bg-[#52166F] border border-pink-400/30">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>4.9</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-pink-100/70">
                  Instructora: <strong className="text-amber-300 font-extrabold">{course.instructor}</strong>
                </p>

                {/* Modules breakdown */}
                <div className="space-y-2 pt-3 border-t border-pink-500/20">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-pink-200">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#E12880]" /> {course.modules.length} Módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-300" /> {totalLessons} Lecciones
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {course.modules.flatMap((m) => m.lessons).slice(0, 2).map((les, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-pink-100 bg-black/20 p-2.5 rounded-xl border border-white/5">
                        <span className="truncate pr-2">{les.title}</span>
                        {!user ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="pt-6">
                {user ? (
                  <button
                    onClick={() => handleLaunchCourse(course)}
                    className="w-full py-3.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#52166F] border border-pink-400/40 shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-amber-300" />
                    <span>Acceder al Aula Virtual</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-3.5 rounded-full text-xs font-extrabold text-amber-300 bg-[#52166F] border border-pink-400/30 hover:bg-[#3B0852] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Iniciar Sesión para Acceder</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {selectedCourse && user && (
        <CoursePlayerModal
          course={selectedCourse}
          userName={user.name}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
}
