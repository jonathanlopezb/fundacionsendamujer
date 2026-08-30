'use client';
import React, { useState } from 'react';
import { X, Play, CheckCircle2, Lock, FileText, Award, ChevronRight, HelpCircle, Download, Sparkles, Volume2, Maximize2 } from 'lucide-react';
import CertificateModal from './CertificateModal';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  isPreview?: boolean;
}

export interface CourseModule {
  title: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  title: string;
  instructor: string;
  category: string;
  modules: CourseModule[];
}

interface Props {
  course: CourseData;
  userName: string;
  onClose: () => void;
}

export default function CoursePlayerModal({ course, userName, onClose }: Props) {
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.modules[0]?.lessons[0] || { id: '1', title: 'Introducción', duration: '10 min' });
  const [completedLessons, setCompletedLessons] = useState<string[]>([course.modules[0]?.lessons[0]?.id || '1']);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'resources' | 'quiz'>('lessons');
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  const toggleLessonComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter((id) => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-fadeIn bg-[#180325] border border-pink-500/30">

        {/* Top Player Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-pink-500/20 flex items-center justify-between gap-4 shrink-0 bg-[#270538]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E12880] to-amber-400 flex items-center justify-center font-extrabold text-xs text-white shrink-0">
              S
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">{course.title}</h3>
              <p className="text-[10px] text-pink-200 truncate">Lección activa: {activeLesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-[#52166F] border border-pink-400/30 text-amber-300">
              <span className="font-extrabold">{progressPercent}% Completado</span>
            </div>

            {progressPercent >= 80 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#3B0852] bg-amber-400 hover:bg-amber-300 transition-all animate-pulse cursor-pointer shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>Ver Certificado</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-pink-200 hover:text-white p-2 rounded-full transition-colors bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">

          {/* Video Player Section */}
          <div className="lg:col-span-8 flex flex-col bg-black/90 relative overflow-y-auto">
            {/* Simulated Video Frame */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-[#3B0852] via-slate-950 to-[#180325] flex flex-col items-center justify-center p-6 text-center shadow-inner group border-b border-pink-500/20">
              
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 cursor-pointer bg-gradient-to-r from-[#E12880] to-[#52166F] border-2 border-amber-300">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                    Senda Video HD • Aula Virtual
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-white mt-2">
                    {activeLesson.title}
                  </h4>
                  <p className="text-xs text-pink-200/80 mt-1">
                    Duración: {activeLesson.duration} • Instructora: {course.instructor}
                  </p>
                </div>
              </div>

              {/* Fake Video Player Controls */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs text-pink-100">
                <div className="flex items-center gap-3">
                  <Play className="w-4 h-4 cursor-pointer text-amber-300 hover:text-white" />
                  <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                  <span className="text-[10px] font-mono text-pink-200">03:42 / {activeLesson.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">1.0x</span>
                  <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>

            {/* Lesson Details & Completion Action */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-500/20">
                <div>
                  <h3 className="text-base font-extrabold text-white">{activeLesson.title}</h3>
                  <p className="text-xs text-pink-200 mt-0.5">Módulo de aprendizaje práctico de la Fundación Senda Mujer.</p>
                </div>

                <button
                  onClick={() => toggleLessonComplete(activeLesson.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-[#E12880] to-[#52166F] text-white border border-pink-400/40 shadow-md hover:scale-[1.02]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{completedLessons.includes(activeLesson.id) ? 'Lección Completada ✓' : 'Marcar Lección Como Vista'}</span>
                </button>
              </div>

              {/* Tab selector */}
              <div className="flex border-b border-pink-500/20 text-xs font-extrabold gap-6">
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`pb-2 transition-colors border-b-2 ${activeTab === 'lessons' ? 'border-amber-400 text-amber-300' : 'border-transparent text-pink-200/70'}`}
                >
                  Contenido del Curso
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`pb-2 transition-colors border-b-2 ${activeTab === 'resources' ? 'border-amber-400 text-amber-300' : 'border-transparent text-pink-200/70'}`}
                >
                  Recursos PDF & Guías
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-2 transition-colors border-b-2 ${activeTab === 'quiz' ? 'border-amber-400 text-amber-300' : 'border-transparent text-pink-200/70'}`}
                >
                  Evaluación / Quiz
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'resources' && (
                <div className="space-y-2 pt-2 animate-fadeIn">
                  <p className="text-xs text-pink-200">Descarga el material complementario para estudiar fuera de línea:</p>
                  {[
                    { title: 'Guía Práctica del Módulo.pdf', size: '2.4 MB' },
                    { title: 'Plantilla de Trabajo Excel.xlsx', size: '1.1 MB' },
                    { title: 'Resumen de Conceptos Clave.pdf', size: '850 KB' },
                  ].map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#270538] border border-pink-500/20 text-xs text-pink-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#E12880]" />
                        <span>{res.title}</span>
                      </div>
                      <button onClick={() => alert(`Descargando ${res.title}`)} className="text-amber-300 hover:underline flex items-center gap-1 font-bold">
                        <Download className="w-3.5 h-3.5" /> {res.size}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-3 pt-2 animate-fadeIn">
                  <p className="text-xs text-pink-200">Demuestra tus conocimientos para desbloquear el certificado:</p>
                  <div className="p-4 rounded-2xl bg-[#270538] border border-pink-500/30 space-y-3">
                    <p className="text-xs font-bold text-white">Pregunta 1: ¿Cuál es el primer paso según el protocolo SENDA?</p>
                    <div className="space-y-2 text-xs text-pink-100">
                      {['A. Identificar la situación de vulnerabilidad y la red de apoyo', 'B. Ignorar el proceso y continuar', 'C. Esperar 30 días sin acción'].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setQuizScore(100)}
                          className="w-full text-left p-3 rounded-xl border border-pink-500/20 hover:border-amber-400 hover:bg-[#52166F] transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {quizScore !== null && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        ¡Respuesta Correcta! Calificación: {quizScore}/100. Has aprobado la evaluación.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-pink-500/20 flex flex-col min-h-0 overflow-y-auto bg-[#270538]/90">
            
            <div className="p-4 border-b border-pink-500/20 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-pink-200">Programa de Estudio</span>
              <span className="text-[10px] text-amber-300 font-bold">{completedLessons.length}/{totalLessons} Lecciones</span>
            </div>

            <div className="divide-y divide-pink-500/10 flex-1">
              {course.modules.map((mod, mIdx) => (
                <div key={mIdx} className="p-3 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-300/70 block">
                    Módulo {mIdx + 1}: {mod.title}
                  </span>

                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessons.includes(les.id);
                      const isActive = activeLesson.id === les.id;

                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#52166F] text-white border border-pink-400/40 font-bold'
                              : 'hover:bg-white/5 text-pink-100'
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
                          <span className="text-[10px] text-pink-300/60 shrink-0 font-mono">{les.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {showCertificate && (
        <CertificateModal
          userName={userName}
          courseTitle={course.title}
          courseCategory={course.category}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
