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
import { INITIAL_COURSES } from '@/lib/academiaCoursesData';

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
    <div className="min-h-screen bg-[#0c0414] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white pb-24 md:pb-0">
      
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

  const academicTopics = [
    'Habilidades Digitales',
    'Emprendimiento Sostenible',
    'Liderazgo & Comunicación',
    'Finanzas Prácticas',
    'Derechos & Ley 1257',
  ];

  return (
    <section className="relative overflow-hidden bg-[#0e0319] border-b border-white/10 pt-10 sm:pt-14 pb-14 sm:pb-18 px-4 sm:px-6 lg:px-8">
      {/* Background Academic Grid & Subtle Lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(#ec4899 1px, transparent 1px), radial-gradient(#8b5cf6 1px, #0e0319 1px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />
      <div className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[350px] bg-pink-600/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-[500px] h-[350px] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Academic Title, Institutional Pitch & Search (7 cols) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-pink-300 bg-pink-500/10 border border-pink-500/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span>Campus Virtual · Fundación Senda Mujer</span>
            <span className="text-white/30">|</span>
            <span className="text-amber-300 font-bold">Ciclo Académico 2026</span>
          </div>

          {/* Academic Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-black text-white tracking-tight leading-[1.12]">
              Formación Académica, <br />
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                Liderazgo y Certificación Oficial
              </span>
            </h1>
            <p className="text-sm sm:text-base text-pink-100/80 max-w-xl leading-relaxed font-normal pt-1">
              Plataforma de educación continua para mujeres en el Caribe colombiano. Cursos estructurados por módulos, evaluación por competencias, tutoría pedagógica y diplomas con código de verificación QR.
            </p>
          </div>

          {/* Academic Search Bar */}
          <div className="space-y-3 max-w-xl">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[#180727] p-2 rounded-2xl border-2 border-white/15 focus-within:border-pink-400 shadow-xl transition-all">
              <Search className="w-5 h-5 text-pink-300/70 ml-2.5 shrink-0" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Buscar programa académico, asignatura o módulo..."
                className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-pink-200/40 font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:opacity-90 hover:scale-[1.02] transition-transform cursor-pointer shrink-0"
              >
                Explorar Catálogo
              </button>
            </form>

            {/* Quick Academic Topic Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-pink-200/80">
              <span className="font-bold text-pink-400/90 mr-1">Rutas frecuentes:</span>
              {academicTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSearch(topic)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-pink-500/20 hover:text-white border border-white/10 transition-all cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Academic Pillars */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-white/10">
            <div className="space-y-0.5">
              <p className="text-base font-black text-white flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-pink-400" />
                <span>100% Libre</span>
              </p>
              <p className="text-[11px] text-pink-200/60 font-medium">Acceso becado y abierto</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-base font-black text-white flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Validez QR</span>
              </p>
              <p className="text-[11px] text-pink-200/60 font-medium">Verificación institucional</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-base font-black text-white flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>A tu ritmo</span>
              </p>
              <p className="text-[11px] text-pink-200/60 font-medium">Disponible las 24 horas</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-base font-black text-white flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>SendaTutor</span>
              </p>
              <p className="text-[11px] text-pink-200/60 font-medium">Asistente pedagógico IA</p>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Virtual Campus Dashboard Card (5 cols) */}
        <div className="lg:col-span-5 relative">
          
          {/* Dashboard Container with Academic Glassmorphism */}
          <div className="bg-[#150622]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
            
            {/* Top Student Credential Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E12880] to-[#7B1FA2] flex items-center justify-center text-white font-black text-sm shadow-md">
                  🎓
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-300">
                      Aula Virtual Activa
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      En Curso
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white">
                    {user ? user.name : 'Estudiante SendaMujer'}
                  </h3>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-pink-200/60 font-bold block">Matrícula 2026</span>
                <span className="text-[11px] font-mono text-amber-300 font-bold">CSM-2026-EST</span>
              </div>
            </div>

            {/* Current Enrolled Program Card */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-0.5 rounded-md font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Diplomado Principal
                </span>
                <span className="text-pink-200/70 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  32 Horas Académicas
                </span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  Marketing Digital para Emprendedoras
                </h4>
                <p className="text-xs text-pink-200/70 mt-0.5">
                  Docente: <strong className="text-pink-100">Mg. Laura Gómez Rodríguez</strong>
                </p>
              </div>

              {/* Curriculum Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-pink-200">Módulo 2: Estrategia de Contenidos</span>
                  <span className="text-amber-300">60% completado</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#E12880] via-purple-500 to-amber-400 rounded-full w-[60%]" />
                </div>
              </div>
            </div>

            {/* Academic Features Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white">4 Módulos en Video</p>
                  <p className="text-[10px] text-pink-200/60 truncate">7 Clases con material PDF</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-xl flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white">Certificado Digital</p>
                  <p className="text-[10px] text-pink-200/60 truncate">Emisión automática con QR</p>
                </div>
              </div>
            </div>

            {/* Enter Classroom Action Button */}
            <div className="pt-1">
              <Link
                href="/academia/aprender/marketing-digital-emprendedoras"
                className="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#E12880] to-[#7B1FA2] hover:opacity-95 shadow-xl shadow-pink-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Ingresar al Aula de Clases Virtual</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* SendaTutor AI Indicator */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-pink-200/70">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>SendaTutor IA pedagógico disponible</span>
              </span>
              <span className="text-emerald-400 font-bold">● En línea</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}



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
    { name: 'Desarrollo Personal', icon: Heart, bgClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30 group-hover:bg-rose-500 group-hover:text-white' },
    { name: 'Habilidades Digitales', icon: Laptop, bgClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white' },
    { name: 'Emprendimiento', icon: Sprout, bgClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white' },
    { name: 'Liderazgo', icon: Crown, bgClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white' },
    { name: 'Bienestar', icon: Sparkles, bgClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30 group-hover:bg-amber-500 group-hover:text-white' },
    { name: 'Finanzas', icon: Coins, bgClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-white' },
    { name: 'Arte y Cultura', icon: Palette, bgClass: 'bg-pink-500/20 text-pink-400 border-pink-500/30 group-hover:bg-pink-500 group-hover:text-white' },
  ];

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Áreas de Formación Integral
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/70 max-w-xl mx-auto">
          Explora nuestras 7 rutas de aprendizaje diseñadas para impulsar tu independencia económica y bienestar.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-[#180727]/90 hover:bg-[#280b3d] border border-white/10 hover:border-pink-400/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-pink-900/20 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-md ${cat.bgClass}`}>
                <Icon className="w-5 h-5" />
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
