'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AcademiaNavbar from '@/components/academia/AcademiaNavbar';
import CourseCatalog from '@/components/academia/CourseCatalog';
import SendaLiveSection from '@/components/academia/SendaLiveSection';
import CommunitySection from '@/components/academia/CommunitySection';
import MobileBottomNav from '@/components/academia/MobileBottomNav';
import AuthModal from '@/components/academia/AuthModal';
import AcademiaFooter from '@/components/academia/AcademiaFooter';
import CharlaDelDia from '@/components/CharlaDelDia';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  Radio,
  Award,
  HeartHandshake,
  Search,
  Star,
  Clock,
  Play,
  CheckCircle2,
  TrendingUp,
  Heart,
  Palette,
  Laptop,
  Sprout,
  Crown,
  Coins,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { INITIAL_COURSES } from '@/app/api/academia/courses/route';

export default function AcademiaMainPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Inicio');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const saved = localStorage.getItem('senda_academia_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('senda_academia_user', JSON.stringify(userData));
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('senda_academia_user');
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setActiveTab('Cursos');
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('Cursos');
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white pb-16 md:pb-0">
      
      {/* Navbar matching Blueprint */}
      <AcademiaNavbar
        user={user}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      {/* Main View Router depending on Active Tab */}
      <main className="flex-1">
        
        {/* TAB 1: INICIO (Default Landing matching Blueprint) */}
        {activeTab === 'Inicio' && (
          <>
            {/* Student Personalized Greeting on Mobile / Active User */}
            {user && (
              <section className="bg-gradient-to-r from-[#240833] via-[#1b0626] to-[#12031a] border-b border-white/10 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      <span>¡Hola, {user.name.split(' ')[0]}!</span>
                      <span className="text-xl">👋</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-pink-200/80 mt-0.5">
                      Tu progreso también es un acto de amor propio y autonomía.
                    </p>
                  </div>

                  {/* Progress bar card */}
                  <div className="bg-white/[0.05] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 min-w-[280px]">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-pink-200">Mi progreso</span>
                        <span className="text-amber-300">3 de 5 lecciones (60%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#E12880] to-amber-400 rounded-full w-[60%]" />
                      </div>
                    </div>
                    <Link
                      href="/academia/aprender/marketing-digital-emprendedoras"
                      className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white text-center hover:opacity-90 shadow-md"
                    >
                      Continuar clase
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Hero Section matching Blueprint Vista Escritorio */}
            <HeroSection
              onSearch={handleSearch}
              onOpenAuth={() => openAuth('register')}
              user={user}
            />

            {/* Category Circles matching Blueprint */}
            <CategoriesSection onSelectCategory={handleCategoryClick} />

            {/* Featured Courses matching Blueprint */}
            <FeaturedCoursesSection
              user={user}
              onOpenAuth={() => openAuth('login')}
              onViewAll={() => setActiveTab('Cursos')}
            />

            {/* Live Masterclass Preview Section */}
            <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-[#270838] to-[#12031a] border border-pink-500/30 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    TRANSMISIÓN EN VIVO AHORA
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Marketing Digital en Vivo: Estrategias de Cierre
                  </h3>
                  <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
                    Conéctate a nuestra masterclass interactiva con la instructora Laura Gómez. Resuelve dudas y descarga las plantillas de trabajo.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-pink-200/80">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-300" /> Hoy 5:00 p.m. - 6:30 p.m.</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-pink-400" /> +1,240 conectadas</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => setActiveTab('En vivo')}
                    className="px-6 py-3.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-xl hover:scale-105 transition-all text-center cursor-pointer"
                  >
                    Entrar a la sala en vivo 🔴
                  </button>
                  <button
                    onClick={() => setActiveTab('Cursos')}
                    className="px-6 py-3.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all text-center"
                  >
                    Explorar catálogo completo
                  </button>
                </div>
              </div>
            </section>

            {/* Charla del Día Component */}
            <CharlaDelDia />

            {/* Community Spotlight Banner */}
            <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
              <div className="bg-[#180727] border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-pink-400">
                    Red de Apoyo y Mentoring
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Más que una plataforma, es una comunidad
                  </h3>
                  <p className="text-xs sm:text-sm text-pink-100/70 max-w-lg">
                    Conoce a otras mujeres de Cartagena y Bolívar, comparte tus logros y recibe mentoría personalizada.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Comunidad')}
                  className="px-6 py-3 rounded-full text-xs font-black bg-white text-slate-900 hover:bg-pink-100 transition-all shrink-0 cursor-pointer"
                >
                  Unirme a la conversación
                </button>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: CURSOS (Full Catalog) */}
        {activeTab === 'Cursos' && (
          <CourseCatalog
            user={user}
            onOpenAuth={() => openAuth('login')}
            selectedCategoryProp={selectedCategory}
            searchQueryProp={searchQuery}
          />
        )}

        {/* TAB 3: EN VIVO (SendaLive Room) */}
        {activeTab === 'En vivo' && (
          <SendaLiveSection
            user={user}
            onOpenAuth={() => openAuth('login')}
          />
        )}

        {/* TAB 4: COMUNIDAD */}
        {activeTab === 'Comunidad' && (
          <CommunitySection
            user={user}
            onOpenAuth={() => openAuth('login')}
          />
        )}

        {/* TAB 5: RECURSOS / CERTIFICADOS */}
        {activeTab === 'Recursos' && (
          <ResourcesSection
            user={user}
            onOpenAuth={() => openAuth('login')}
          />
        )}

      </main>

      {/* Footer */}
      <AcademiaFooter />

      {/* Mobile Bottom Navigation matching Blueprint Vista Móvil */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuth={() => openAuth('login')}
        user={user}
      />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}

    </div>
  );
}

// ----------------------------------------------------
// SUB-COMPONENTS FOR INICIO
// ----------------------------------------------------

function HeroSection({
  onSearch,
  onOpenAuth,
  user,
}: {
  onSearch: (q: string) => void;
  onOpenAuth: () => void;
  user: any;
}) {
  const [localQuery, setLocalQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#160623] via-[#1b072c] to-[#0c0414] border-b border-white/10 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Heading, Search & Bullet Points (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-pink-300 bg-pink-500/10 border border-pink-500/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Aprende hoy, transforma mañana</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            Tu crecimiento <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              es nuestra misión
            </span>
          </h1>

          <p className="text-sm sm:text-base text-pink-100/80 max-w-xl leading-relaxed">
            Una plataforma educativa diseñada para potenciar tus habilidades, abrir nuevas oportunidades y construir el futuro que mereces.
          </p>

          {/* Big Search Bar matching Blueprint */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg bg-white/[0.08] backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl focus-within:border-pink-400 transition-all">
            <Search className="w-5 h-5 text-pink-300/70 ml-3 shrink-0" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="¿Qué curso te gustaría aprender hoy?"
              className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-white placeholder-pink-200/50 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {/* Quick Value Highlights List */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-pink-200/80 font-semibold">
            {[
              { label: 'Cursos en línea', icon: BookOpen },
              { label: 'Clases en vivo', icon: Radio },
              { label: 'Certificados oficiales', icon: Award },
              { label: 'Comunidad activa', icon: Users },
              { label: 'Mentorías 1 a 1', icon: HeartHandshake },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-xl border border-white/5">
                  <Icon className="w-4 h-4 text-pink-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Hero Graphic + Badge matching Blueprint (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border-2 border-pink-500/30 shadow-2xl bg-gradient-to-br from-[#270838] to-[#12031a]">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
              alt="Estudiante SendaMujer"
              className="w-full h-80 sm:h-96 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0414] via-transparent to-transparent" />

            {/* +50,000 Floating Badge matching Blueprint */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#1b072c]/90 backdrop-blur-md border border-pink-500/40 p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E12880] to-amber-400 flex items-center justify-center font-black text-slate-900 shadow-md shrink-0">
                +50k
              </div>
              <div>
                <p className="text-sm font-black text-white">+50,000 Mujeres</p>
                <p className="text-[11px] text-pink-200/70">ya están transformando sus vidas con Senda</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function CategoriesSection({
  onSelectCategory,
}: {
  onSelectCategory: (cat: string) => void;
}) {
  const categories = [
    { name: 'Desarrollo Personal', icon: Heart, color: 'from-pink-500 to-rose-600' },
    { name: 'Habilidades Digitales', icon: Laptop, color: 'from-blue-500 to-indigo-600' },
    { name: 'Emprendimiento', icon: Sprout, color: 'from-emerald-500 to-teal-600' },
    { name: 'Liderazgo', icon: Crown, color: 'from-violet-500 to-purple-600' },
    { name: 'Bienestar', icon: Sparkles, color: 'from-amber-400 to-orange-500' },
    { name: 'Finanzas', icon: Coins, color: 'from-cyan-500 to-blue-600' },
    { name: 'Arte y Cultura', icon: Palette, color: 'from-fuchsia-500 to-pink-600' },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Áreas de Formación Integral
        </h2>
        <p className="text-xs text-pink-200/70">
          Elige una categoría y comienza a desarrollar habilidades prácticas hoy mismo.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-[#180727] hover:bg-[#250a3b] border border-white/10 hover:border-pink-400/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} p-2.5 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-pink-100 group-hover:text-pink-300 transition-colors leading-tight">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedCoursesSection({
  user,
  onOpenAuth,
  onViewAll,
}: {
  user: any;
  onOpenAuth: () => void;
  onViewAll: () => void;
}) {
  const router = useRouter();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Cursos Destacados
          </h2>
          <p className="text-xs text-pink-200/70 mt-0.5">
            Los programas más cursados por nuestras estudiantes
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-bold text-pink-300 hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <span>Ver todos</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_COURSES.slice(0, 4).map((course) => (
          <div
            key={course.slug}
            className="group bg-[#1a0726] border border-white/10 hover:border-pink-400/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#2d0e3e]">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                  course.badge === 'Popular'
                    ? 'bg-pink-600'
                    : course.badge === 'Nuevo'
                    ? 'bg-violet-600'
                    : 'bg-amber-500 text-slate-900'
                }`}>
                  {course.badge}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-extrabold text-amber-300 border border-white/10">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>{course.rating}</span>
                <span className="text-[10px] text-pink-200/60 font-normal">({(course.reviewsCount / 1000).toFixed(1)}k)</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                  {course.category}
                </span>
                <h3 className="text-sm font-black text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug">
                  {course.title}
                </h3>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-pink-200/70 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  {course.durationWeeks}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-pink-400" />
                  {course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 4} lecciones
                </span>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                  } else {
                    router.push(`/academia/aprender/${course.slug}`);
                  }
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#E12880] to-[#7B1FA2] hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Entrar al aula virtual</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

function ResourcesSection({
  user,
  onOpenAuth,
}: {
  user: any;
  onOpenAuth: () => void;
}) {
  return (
    <section id="recursos" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-pink-300 bg-pink-500/10 border border-pink-500/20 mb-3">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Acreditaciones & Logros</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Tus Certificados y Logros
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/70 mt-1 max-w-2xl">
            Descarga tus diplomas oficiales, compártelos en redes profesionales y valida su autenticidad mediante código QR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a0726] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Marketing Digital para Emprendedoras</h3>
              <p className="text-xs text-pink-200/70">Acreditación de 32 horas · Código: SENDA-2026-004812</p>
            </div>
          </div>

          <p className="text-xs text-pink-100/80 leading-relaxed">
            Certificado oficial emitido por Fundación Senda Mujer con firma digital de la Dirección Académica.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/academia/certificados/SENDA-2026-004812"
              className="px-5 py-2.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:scale-105 transition-transform"
            >
              Ver e Imprimir Diploma
            </Link>
            <Link
              href="/academia/verificar/SENDA-2026-004812"
              className="px-4 py-2.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-pink-200 border border-white/10"
            >
              Verificar QR ↗
            </Link>
          </div>
        </div>

        <div className="bg-[#1a0726] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Emprendimiento Femenino (En progreso)</h3>
              <p className="text-xs text-pink-200/70">Avance actual: 60% completado</p>
            </div>
          </div>

          <p className="text-xs text-pink-100/80 leading-relaxed">
            Completa las 2 lecciones restantes y la evaluación para desbloquear tu segundo certificado.
          </p>

          <div className="pt-2">
            <Link
              href="/academia/aprender/emprendimiento-femenino-idea-al-negocio"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black bg-white/10 hover:bg-white/20 text-white"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continuar lecciones</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
