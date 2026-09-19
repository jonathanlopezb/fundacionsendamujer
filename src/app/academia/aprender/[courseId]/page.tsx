'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Play,
  CheckCircle2,
  Lock,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  Sparkles,
  Volume2,
  Maximize2,
  BookOpen,
  Check,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import { INITIAL_COURSES } from '@/lib/academiaCoursesData';
import SendaTutorPanel from '@/components/academia/SendaTutorPanel';

export default function CourseLearningPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = (params?.courseId as string) || 'marketing-digital-emprendedoras';

  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'materials' | 'tutor' | 'transcript' | 'notes'>('content');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<'0.75x' | '1x' | '1.25x' | '1.5x' | '2x'>('1x');

  useEffect(() => {
    const savedUser = localStorage.getItem('senda_academia_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({ name: 'Laura Gómez Rodríguez', email: 'laura.gomez@sendamujer.org' });
    }

    // Fetch course details
    fetch(`/api/academia/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.course) {
          setCourse(data.course);
          const firstLesson = data.course.modules?.[0]?.lessons?.[0];
          if (firstLesson) {
            setActiveLesson(firstLesson);
            setCompletedLessonIds([firstLesson.id]);
          }
        }
      })
      .catch(() => {
        const fallback = INITIAL_COURSES.find((c) => c.slug === courseId) || INITIAL_COURSES[0];
        setCourse(fallback);
        setActiveLesson(fallback.modules[0].lessons[0]);
        setCompletedLessonIds([fallback.modules[0].lessons[0].id]);
      });
  }, [courseId]);

  if (!course || !activeLesson) {
    return (
      <div className="min-h-screen bg-[#0c0414] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          <p className="text-xs text-pink-200">Cargando aula virtual...</p>
        </div>
      </div>
    );
  }

  const allLessons: any[] = course.modules?.flatMap((m: any) => m.lessons || []) || [];
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

  const handleToggleComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => prev.filter((id) => id !== lessonId));
    } else {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      if (nextLesson) {
        setActiveLesson(nextLesson);
      }
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setSavedNotes((prev) => [noteText.trim(), ...prev]);
    setNoteText('');
  };

  return (
    <div className="min-h-screen bg-[#0c0414] text-slate-100 flex flex-col">
      
      {/* Top Learning Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#160623]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Back Link & Course Info */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/academia"
            className="flex items-center gap-1 text-xs font-bold text-pink-200 hover:text-white bg-white/[0.06] hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a Cursos</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/10 shrink-0 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-black text-white truncate">
              {course.title}
            </h1>
            <p className="text-[10px] text-pink-200/70 truncate">
              {activeLesson.title}
            </p>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Progress Bar Header */}
          <div className="hidden md:flex items-center gap-2 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
            <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-extrabold text-amber-300 text-[11px]">{progressPercent}% completado</span>
          </div>

          {/* Assessment & Certificate Buttons */}
          <Link
            href={`/academia/evaluacion/${course.slug}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#E12880] to-[#7B1FA2] hover:opacity-90 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Presentar Evaluación</span>
          </Link>

          {progressPercent >= 60 && (
            <Link
              href={`/academia/certificados/${course.slug}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-900" />
              <span>Ver Certificado</span>
            </Link>
          )}

        </div>

      </header>

      {/* Main Learning Workspace matching Blueprint Vista Curso */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Player & Tab Details (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* HD Video Player Container */}
          <div className="bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            
            <div className="relative aspect-video w-full bg-black">
              <video
                key={activeLesson.id}
                className="w-full h-full object-cover"
                controls
                playsInline
                poster={course.thumbnailUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'}
              >
                <source
                  src={activeLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  type="video/mp4"
                />
                Tu navegador no soporta reproducción de video.
              </video>

              {/* Badge Overlay */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-pink-300 border border-white/10 pointer-events-none">
                Senda Video HD · Aula Virtual
              </div>
            </div>

            {/* Custom Bottom Player Info Bar matching Mockup */}
            <div className="p-4 bg-[#14061f] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-amber-300">
                  12:34 / {activeLesson.duration || '45:30'}
                </span>
                <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5 border border-white/10">
                  {(['0.75x', '1x', '1.25x', '1.5x', '2x'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        playbackSpeed === spd ? 'bg-pink-600 text-white' : 'text-pink-200/60 hover:text-white'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {prevLesson && (
                  <button
                    onClick={() => setActiveLesson(prevLesson)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 text-pink-200 transition-colors"
                  >
                    ← Anterior
                  </button>
                )}
                {nextLesson && (
                  <button
                    onClick={() => {
                      if (!completedLessonIds.includes(activeLesson.id)) {
                        setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
                      }
                      setActiveLesson(nextLesson);
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:scale-105 transition-transform"
                  >
                    Siguiente clase →
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Lesson Title, Outcomes & Toggle Action */}
          <div className="bg-[#180727] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                  {course.category} · Módulo de Formación
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {activeLesson.title}
                </h2>
                <p className="text-xs text-pink-200/70 mt-1">
                  Instructora: <strong className="text-pink-100">{course.instructor}</strong> · Duración estimada: {activeLesson.duration}
                </p>
              </div>

              <button
                onClick={() => handleToggleComplete(activeLesson.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg ${
                  completedLessonIds.includes(activeLesson.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white hover:scale-105'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>{completedLessonIds.includes(activeLesson.id) ? 'Lección Completada ✓' : 'Marcar como Vista'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
              {activeLesson.description ||
                'En esta clase aprenderás los conceptos fundamentales y cómo aplicarlos paso a paso en tu emprendimiento o proyecto productivo en el territorio.'}
            </p>
          </div>

          {/* Tabs Selector matching Blueprint (Contenido, Materiales, SendaTutor, Transcripción, Notas) */}
          <div className="bg-[#180727] border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none text-xs font-bold">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-2 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'content' ? 'border-pink-500 text-pink-300' : 'border-transparent text-pink-200/60 hover:text-white'
                }`}
              >
                Objetivos de Aprendizaje
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-2 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'materials' ? 'border-amber-400 text-amber-300' : 'border-transparent text-pink-200/60 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Materiales & Descargables</span>
              </button>
              <button
                onClick={() => setActiveTab('tutor')}
                className={`pb-2 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'tutor' ? 'border-pink-500 text-pink-300' : 'border-transparent text-pink-200/60 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Preguntar a SendaTutor AI</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'notes' ? 'border-pink-500 text-pink-300' : 'border-transparent text-pink-200/60 hover:text-white'
                }`}
              >
                Mis Notas Personales
              </button>
            </div>

            {/* Tab: Objetivos */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Lo que dominarás en este curso:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(course.learningOutcomes || [
                    'Identificar oportunidades de negocio',
                    'Calcular costos y presupuesto real',
                    'Crear contenidos de venta en WhatsApp y redes',
                    'Medir resultados para certificar tu avance',
                  ]).map((outcome: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-pink-100 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Materiales y Descargables */}
            {activeTab === 'materials' && (
              <div className="space-y-3">
                <p className="text-xs text-pink-200/80">
                  Descarga los recursos de trabajo para estudiar fuera de línea y aplicar en tu negocio:
                </p>
                <div className="space-y-2">
                  {[
                    { title: 'Guía Práctica del Módulo de Marketing.pdf', size: '2.4 MB', type: 'PDF' },
                    { title: 'Plantilla de Presupuesto y Costos.xlsx', size: '1.2 MB', type: 'Excel' },
                    { title: 'Checklist de WhatsApp Business Pro.pdf', size: '890 KB', type: 'PDF' },
                    { title: 'Resumen de Conceptos Clave y Glosario.pdf', size: '650 KB', type: 'PDF' },
                  ].map((res, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#230935] border border-pink-500/20 text-xs text-pink-100 hover:border-pink-400/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300 font-bold text-[10px]">
                          {res.type}
                        </div>
                        <div>
                          <p className="font-bold text-white">{res.title}</p>
                          <p className="text-[10px] text-pink-200/60">{res.size} · Documento oficial Senda</p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Descargando ${res.title}...`)}
                        className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: SendaTutor AI */}
            {activeTab === 'tutor' && (
              <div className="space-y-4">
                <SendaTutorPanel courseTitle={course.title} />
              </div>
            )}

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Escribe tus apuntes, dudas o ideas clave sobre esta lección..."
                    rows={3}
                    className="w-full p-3.5 rounded-xl bg-[#230935] border border-pink-500/20 text-xs text-white placeholder-pink-200/40 focus:outline-none focus:border-pink-400"
                  />
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:opacity-90"
                  >
                    Guardar nota privada
                  </button>
                </div>

                {savedNotes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[11px] font-bold text-pink-300 uppercase tracking-wider">Tus notas guardadas:</h4>
                    {savedNotes.map((nt, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-pink-100">
                        {nt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Course Syllabus Sidebar (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          <div className="bg-[#180727] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Programa de Estudio
              </h3>
              <p className="text-[10px] text-pink-200/60">
                {completedLessonIds.length} de {totalLessons} lecciones vistas
              </p>
            </div>
            <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
              {progressPercent}%
            </span>
          </div>

          {/* Module Accordions matching Blueprint */}
          <div className="space-y-3">
            {course.modules?.map((mod: any, mIdx: number) => (
              <div
                key={mIdx}
                className="bg-[#180727] border border-white/10 rounded-2xl overflow-hidden shadow-md"
              >
                <div className="p-3.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-black text-pink-200">
                    {mod.title}
                  </span>
                  <span className="text-[10px] text-pink-200/50 font-mono">
                    {mod.lessons?.length || 0} lecciones
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  {mod.lessons?.map((les: any) => {
                    const isCompleted = completedLessonIds.includes(les.id);
                    const isActive = activeLesson.id === les.id;

                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white font-bold shadow-md shadow-pink-600/30'
                            : isCompleted
                            ? 'bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                            : 'hover:bg-white/5 text-pink-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-pink-200/50 shrink-0 font-mono">
                          {les.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Callout Banner */}
          <div className="bg-gradient-to-br from-[#2a0c3d] to-[#160623] border border-pink-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-300" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Certificación Oficial
              </h4>
            </div>
            <p className="text-xs text-pink-100/80 leading-relaxed">
              Al completar las lecciones, presenta la evaluación final para obtener tu certificado con código QR verificable.
            </p>
            <Link
              href={`/academia/evaluacion/${course.slug}`}
              className="w-full py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-900 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Ir a la Evaluación del Curso</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </main>

    </div>
  );
}
