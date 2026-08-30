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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" style={{ background: 'rgba(5,5,10,0.92)', backdropFilter: 'blur(14px)' }}>
      <div className="w-full max-w-5xl h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-fadeIn"
        style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.12)' }}>

        {/* Top Player Bar */}
        <div className="px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-4 shrink-0"
          style={{ background: '#141422', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
              S
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{course.title}</h3>
              <p className="text-[10px] text-gray-400 truncate">Lección activa: {activeLesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <span className="font-bold">{progressPercent}% Completado</span>
            </div>

            {progressPercent >= 80 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all animate-pulse"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Ver Certificado</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Player & Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">

          {/* Video Player Section */}
          <div className="lg:col-span-8 flex flex-col bg-black/80 relative overflow-y-auto">
            {/* Simulated Video Frame */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-purple-950/60 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center shadow-inner group border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              
              <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-md">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}>
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                    Senda Video HD 1080p
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-2">
                    {activeLesson.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Duración: {activeLesson.duration} • Instructora: {course.instructor}
                  </p>
                </div>
              </div>

              {/* Fake Video Player Controls */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <Play className="w-4 h-4 cursor-pointer text-white hover:text-cyan-400" />
                  <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                  <span className="text-[10px] font-mono text-gray-400">03:42 / {activeLesson.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">1.0x</span>
                  <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>

            {/* Lesson Details & Completion Action */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div>
                  <h3 className="text-base font-bold text-white">{activeLesson.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Módulo de aprendizaje práctico interactivo.</p>
                </div>

                <button
                  onClick={() => toggleLessonComplete(activeLesson.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md hover:opacity-90'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedLessons.includes(activeLesson.id) ? 'Lección Completada ✓' : 'Marcar Lección Como Vistas'}</span>
                </button>
              </div>

              {/* Tab selector */}
              <div className="flex border-b text-xs font-semibold gap-6" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`pb-2 transition-colors border-b-2 ${activeTab === 'lessons' ? 'border-cyan-400 text-white font-bold' : 'border-transparent text-gray-400'}`}
                >
                  Contenido del Curso
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`pb-2 transition-colors border-b-2 ${activeTab === 'resources' ? 'border-cyan-400 text-white font-bold' : 'border-transparent text-gray-400'}`}
                >
                  Recursos PDF & Guías
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-2 transition-colors border-b-2 ${activeTab === 'quiz' ? 'border-cyan-400 text-white font-bold' : 'border-transparent text-gray-400'}`}
                >
                  Evaluación / Quiz
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'resources' && (
                <div className="space-y-2 pt-2 animate-fadeIn">
                  <p className="text-xs text-gray-300">Descarga el material complementario para estudiar fuera de línea:</p>
                  {[
                    { title: 'Guía Práctica del Módulo.pdf', size: '2.4 MB' },
                    { title: 'Plantilla de Trabajo Excel.xlsx', size: '1.1 MB' },
                    { title: 'Resumen de Conceptos Clave.pdf', size: '850 KB' },
                  ].map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>{res.title}</span>
                      </div>
                      <button onClick={() => alert(`Descargando ${res.title}`)} className="text-cyan-400 hover:underline flex items-center gap-1 font-bold">
                        <Download className="w-3.5 h-3.5" /> {res.size}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-3 pt-2 animate-fadeIn">
                  <p className="text-xs text-gray-300">Demuestra tus conocimientos para desbloquear el certificado:</p>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <p className="text-xs font-bold text-white">Pregunta 1: ¿Cuál es el primer paso según el protocolo SENDA?</p>
                    <div className="space-y-2 text-xs text-gray-300">
                      {['A. Identificar la situación de vulnerabilidad y la red de apoyo', 'B. Ignorar el proceso y continuar', 'C. Esperar 30 días sin acción'].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setQuizScore(100)}
                          className="w-full text-left p-2.5 rounded-xl border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {quizScore !== null && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        ¡Respuesta Correcta! Calificación: {quizScore}/100. Has aprobado la evaluación.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l flex flex-col min-h-0 overflow-y-auto"
            style={{ background: '#12121e', borderColor: 'rgba(255,255,255,0.08)' }}>
            
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">Programa de Estudio</span>
              <span className="text-[10px] text-gray-400">{completedLessons.length}/{totalLessons} Lecciones</span>
            </div>

            <div className="divide-y divide-white/5 flex-1">
              {course.modules.map((mod, mIdx) => (
                <div key={mIdx} className="p-3 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
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
                              ? 'bg-purple-950/60 text-white border border-purple-500/40 font-bold'
                              : 'hover:bg-white/5 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0 font-mono">{les.duration}</span>
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
