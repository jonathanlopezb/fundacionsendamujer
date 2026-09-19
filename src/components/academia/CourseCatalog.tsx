'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, Clock, Lock, Play, Award, Sparkles, Filter, CheckCircle2, ChevronRight, Search, Zap } from 'lucide-react';
import { INITIAL_COURSES } from '@/app/api/academia/courses/route';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
  selectedCategoryProp?: string;
  searchQueryProp?: string;
}

export default function CourseCatalog({
  user,
  onOpenAuth,
  selectedCategoryProp,
  searchQueryProp,
}: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>(INITIAL_COURSES);
  const [selectedSortTab, setSelectedSortTab] = useState<'Todos' | 'Populares' | 'Recientes' | 'Más vistos'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryProp || 'Todos');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>(searchQueryProp || '');

  useEffect(() => {
    if (selectedCategoryProp) {
      setSelectedCategory(selectedCategoryProp);
    }
  }, [selectedCategoryProp]);

  useEffect(() => {
    if (searchQueryProp !== undefined) {
      setLocalSearch(searchQueryProp);
    }
  }, [searchQueryProp]);

  useEffect(() => {
    fetch('/api/academia/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data?.courses?.length) {
          setCourses(data.courses);
        }
      })
      .catch(() => undefined);
  }, []);

  const categories = [
    'Todos',
    'Desarrollo Personal',
    'Habilidades Digitales',
    'Emprendimiento',
    'Liderazgo',
    'Finanzas',
    'Arte y Cultura',
  ];

  // Filtering & Sorting
  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'Todos' ||
      course.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(course.category.toLowerCase());

    const matchesLevel =
      selectedLevel === 'Todos' || course.level === selectedLevel;

    const matchesSearch =
      !localSearch ||
      course.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      course.instructor.toLowerCase().includes(localSearch.toLowerCase()) ||
      course.category.toLowerCase().includes(localSearch.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (selectedSortTab === 'Populares') return (b.studentsCount || 0) - (a.studentsCount || 0);
    if (selectedSortTab === 'Más vistos') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    if (selectedSortTab === 'Recientes') return (b.slug || '').localeCompare(a.slug || '');
    return 0;
  });

  const handleCourseClick = (slug: string) => {
    if (!user) {
      onOpenAuth();
    } else {
      router.push(`/academia/aprender/${slug}`);
    }
  };

  return (
    <section id="cursos" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header with Title & Search on Tablet/Mobile */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-pink-300 bg-pink-500/10 border border-pink-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Marketplace Formativo Institucional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Explorar Todos los Cursos
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/70 mt-1 max-w-2xl">
            Programas con certificación oficial diseñados para el empoderamiento económico, digital y social.
          </p>
        </div>

        {/* Search Bar on Tablet & Mobile */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/60" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar por curso o tema..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.06] border border-white/10 text-white placeholder-pink-200/40 focus:outline-none focus:border-pink-400"
            />
          </div>
          <button
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
              showFiltersModal || selectedLevel !== 'Todos'
                ? 'bg-pink-600 text-white border-pink-400'
                : 'bg-white/[0.06] text-pink-200 border-white/10 hover:bg-white/10'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      {/* Sort Tabs matching Tablet view in blueprint */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['Todos', 'Populares', 'Recientes', 'Más vistos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedSortTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSortTab === tab
                  ? 'bg-white text-[#12031a] shadow-lg font-black'
                  : 'bg-white/[0.05] text-pink-100/70 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs text-pink-200/60 font-medium">
          Mostrando <strong className="text-white">{sortedCourses.length}</strong> cursos disponibles
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md border border-pink-400/30'
                : 'bg-[#1b0a26] text-pink-200/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid matching Blueprint */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedCourses.map((course) => {
          const totalLessons = course.modules?.reduce(
            (acc: number, m: any) => acc + (m.lessons?.length || 0),
            0
          ) || 6;

          return (
            <div
              key={course.slug || course.id}
              className="group bg-[#1a0726] border border-white/10 hover:border-pink-400/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-pink-900/20 hover:-translate-y-1 relative"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#2d0e3e]">
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge Tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                    course.badge === 'Popular'
                      ? 'bg-pink-600'
                      : course.badge === 'Nuevo'
                      ? 'bg-violet-600'
                      : 'bg-amber-500 text-slate-900'
                  }`}>
                    {course.badge || 'Popular'}
                  </span>
                </div>

                {/* Rating Overlay */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-extrabold text-amber-300 border border-white/10">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{course.rating || 4.9}</span>
                  <span className="text-[10px] text-pink-200/60 font-normal">({(course.reviewsCount || 1200) > 999 ? `${((course.reviewsCount || 1200)/1000).toFixed(1)}k` : course.reviewsCount})</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                    {course.category}
                  </span>
                  <h3 className="text-sm font-black text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-pink-100/60 line-clamp-2">
                    {course.subtitle || course.description}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-pink-200/70 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    {course.durationWeeks || course.totalDuration || '6 semanas'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-pink-400" />
                    {totalLessons} lecciones
                  </span>
                </div>

                {/* Action CTA: Opens Dedicated Route WITHOUT Popups */}
                <div className="pt-1">
                  <button
                    onClick={() => handleCourseClick(course.slug)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#7B1FA2] hover:from-[#c2185b] hover:to-[#4a148c] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:shadow-pink-600/30"
                  >
                    {user ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Entrar a la clase</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ver curso gratis</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {sortedCourses.length === 0 && (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <BookOpen className="w-12 h-12 text-pink-400/40 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No encontramos cursos con estos filtros</h4>
          <p className="text-xs text-pink-200/60 mt-1">Prueba seleccionando otra categoría o limpiando la búsqueda.</p>
          <button
            onClick={() => { setSelectedCategory('Todos'); setSelectedLevel('Todos'); setLocalSearch(''); }}
            className="mt-4 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20"
          >
            Restablecer filtros
          </button>
        </div>
      )}

    </section>
  );
}
