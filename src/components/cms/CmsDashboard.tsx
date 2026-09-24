'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, Shield, Image as ImageIcon, Users, LogOut,
  ArrowLeft, CheckCircle2, Layers, Search, HeartHandshake,
  FolderTree, ExternalLink, Database, RefreshCw, AlertTriangle,
  TrendingUp
} from 'lucide-react';
import CmsImageCard from './CmsImageCard';
import CmsUserManager from './CmsUserManager';
import CmsGalleryManager from './CmsGalleryManager';
import CmsAlliesManager from './CmsAlliesManager';
import CmsStatsManager from './CmsStatsManager';
import { CmsImageItem, CMS_DEFAULT_SECTIONS } from '@/lib/cms-defaults';

interface CmsDashboardProps {
  currentUser: any;
  onLogout: () => void;
}

const PAGE_TABS = ['Todas', 'Inicio', 'Nosotros', 'Programas', 'Donaciones', 'Galería', 'Caribe Seguro', 'Aliados'] as const;

export default function CmsDashboard({ currentUser, onLogout }: CmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'stats' | 'gallery' | 'allies' | 'users' | 'seo' | 'diagnostico'>('images');
  const [selectedPage, setSelectedPage] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<CmsImageItem[]>(CMS_DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  // Diagnóstico Blob
  const [blobDiag, setBlobDiag] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  // Cargar imágenes guardadas
  const loadImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/images');
      const data = await res.json();
      if (res.ok && data.sections) {
        setSections(data.sections);
      }
    } catch (err) {
      console.warn('Usando catálogo local:', err);
    } finally {
      setLoading(false);
    }
  };

  const runBlobDiagnostic = async () => {
    try {
      setDiagLoading(true);
      const res = await fetch('/api/cms/test-blob');
      const data = await res.json();
      setBlobDiag(data);
    } catch (err: any) {
      setBlobDiag({ connected: false, message: err.message || 'Error de conexión' });
    } finally {
      setDiagLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Filtrado de imágenes
  const filteredSections = sections.filter((s) => {
    const matchesPage = selectedPage === 'Todas' || s.page === selectedPage;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.altText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#180426] to-slate-950 text-white font-sans antialiased">
      {/* ── Topbar de Control Exclusiva del CMS ───────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#1b052c]/95 backdrop-blur-xl border-b border-purple-800/60 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Logo & Info de Usuario */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-inner"
              title="Volver a la página pública"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Regresar al sitio
            </Link>

            <div className="h-6 w-px bg-purple-800/60 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-600/30">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">Panel CMS</span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] font-bold">
                    Fundación Senda Mujer
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/70">
                  {currentUser?.fullName} · <strong className="text-pink-300">{currentUser?.role === 'SUPER_ADMIN' ? 'Super Administrador' : 'Administrador'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Acciones de Sesión */}
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver en Vivo
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* ── Contenedor de Módulos ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Pestañas de Navegación del CMS */}
        <div className="flex items-center gap-2 border-b border-purple-800/60 pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Imágenes por Sección ({sections.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Cifras e Impacto
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <FolderTree className="w-4 h-4" /> Galería & Categorías
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('allies')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'allies'
                ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Red de Aliados
          </button>

          {currentUser?.role === 'SUPER_ADMIN' && (
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Users className="w-4 h-4" /> Usuarios del Sistema
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'seo'
                ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Guía SEO
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('diagnostico');
              runBlobDiagnostic();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'diagnostico'
                ? 'bg-pink-700 text-white shadow-lg shadow-pink-700/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Database className="w-4 h-4" /> Diagnóstico Blob
          </button>
        </div>

        {/* ── MÓDULO 1: IMÁGENES POR SECCIÓN ──────────────────────────────── */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            {/* Filtros por Página y Buscador */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {PAGE_TABS.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setSelectedPage(page)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedPage === page
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                        : 'text-purple-300/70 hover:text-white hover:bg-purple-900/30'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar sección o texto alt…"
                  className="w-full bg-[#180426] border border-purple-700/60 focus:border-pink-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-purple-400/40 outline-none"
                />
              </div>
            </div>

            {/* Grid de Secciones */}
            {loading ? (
              <div className="py-20 text-center text-purple-300">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs">Cargando catálogo de imágenes…</p>
              </div>
            ) : filteredSections.length === 0 ? (
              <div className="py-16 text-center bg-[#240a38]/40 border border-purple-800/40 rounded-3xl p-8">
                <ImageIcon className="w-10 h-10 text-purple-400/40 mx-auto mb-2" />
                <h3 className="text-base font-bold text-white">No se encontraron secciones</h3>
                <p className="text-xs text-purple-300/60 mt-1">Prueba seleccionando otra página o limpiando la búsqueda.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSections.map((item) => (
                  <CmsImageCard key={item.sectionKey} item={item} onSaveSuccess={loadImages} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MÓDULO: CIFRAS E IMPACTO ────────────────────────────────────── */}
        {activeTab === 'stats' && <CmsStatsManager />}

        {/* ── MÓDULO 2: GALERÍA & CATEGORÍAS ─────────────────────────────── */}
        {activeTab === 'gallery' && <CmsGalleryManager />}

        {/* ── MÓDULO 3: RED DE ALIADOS ────────────────────────────────────── */}
        {activeTab === 'allies' && <CmsAlliesManager />}

        {/* ── MÓDULO 4: USUARIOS DEL SISTEMA ──────────────────────────────── */}
        {activeTab === 'users' && currentUser?.role === 'SUPER_ADMIN' && (
          <CmsUserManager currentUser={currentUser} />
        )}

        {/* ── MÓDULO 5: GUÍA SEO ──────────────────────────────────────────── */}
        {activeTab === 'seo' && (
          <div className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-purple-800/40">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Mejores Prácticas SEO para Imágenes y Contenidos</h2>
                <p className="text-xs text-purple-300/70">
                  Optimización de visibilidad en motores de búsqueda para Fundación Senda Mujer
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-xs text-purple-200">
              <div className="bg-[#180426] border border-purple-800/60 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-pink-300 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Texto Alternativo (`alt`)
                </h3>
                <p className="leading-relaxed">
                  Describe en 1 o 2 frases qué ocurre en la imagen incluyendo palabras clave naturales como <em>Cartagena</em>, <em>mujeres</em>, <em>salud</em>, <em>derechos</em> o <em>acompañamiento</em>.
                </p>
                <div className="p-2.5 rounded-lg bg-purple-950/60 text-[11px] text-purple-300/80 font-mono">
                  ✅ Bueno: &ldquo;Jornada cívica y médica de salud en Arroz Barato, Cartagena&rdquo;
                  <br />
                  ❌ Evitar: &ldquo;foto1.jpg&rdquo; o &ldquo;imagen&rdquo;
                </div>
              </div>

              <div className="bg-[#180426] border border-purple-800/60 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-pink-300 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-pink-400" />
                  Formatos y Dimensiones
                </h3>
                <p className="leading-relaxed">
                  Utiliza preferiblemente formatos modernos como <strong>WebP</strong> o <strong>JPEG</strong> optimizado con una resolución proporcional a la tarjeta recomendada.
                </p>
                <ul className="list-disc pl-4 space-y-1 text-purple-300/90">
                  <li>Banners y Hero: 1200x800px (3:2 o 16:9)</li>
                  <li>Logos de Aliados: PNG transparente o SVG</li>
                  <li>Peso sugerido: Menos de 500 KB por imagen</li>
                </ul>
              </div>

              <div className="bg-[#180426] border border-purple-800/60 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-pink-300 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Privacidad y Consentimiento
                </h3>
                <p className="leading-relaxed">
                  Cumpliendo con la <strong>Ley 1581 de 2012</strong> y la protección integral a NNA, solo publica fotografías de beneficiarias y menores con autorización expresa firmada.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── MÓDULO 6: DIAGNÓSTICO VERCEL BLOB ───────────────────────────── */}
        {activeTab === 'diagnostico' && (
          <div className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Diagnóstico de Vercel Blob Storage</h2>
                  <p className="text-xs text-purple-300/70">
                    Comprueba la conexión con tu tienda <strong className="text-pink-300">fundacionsendamujer-blob</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={runBlobDiagnostic}
                disabled={diagLoading}
                className="px-4 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${diagLoading ? 'animate-spin' : ''}`} />
                {diagLoading ? 'Verificando…' : 'Volver a Probar'}
              </button>
            </div>

            {diagLoading ? (
              <div className="py-12 text-center text-purple-300 text-xs">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Consultando el SDK de Vercel Blob…
              </div>
            ) : blobDiag ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                    blobDiag.connected
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                  }`}
                >
                  {blobDiag.connected ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {blobDiag.connected ? 'Conexión Exitosa con Vercel Blob' : 'Error de Conexión con Blob'}
                    </h4>
                    <p className="mt-1 text-xs opacity-90">{blobDiag.message}</p>
                    {blobDiag.connected && (
                      <p className="mt-1 font-mono text-[11px] text-emerald-300">
                        Archivos actualmente en la tienda: <strong>{blobDiag.blobCount}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {blobDiag.blobs && blobDiag.blobs.length > 0 && (
                  <div className="bg-[#180426] border border-purple-800/60 rounded-2xl p-4 space-y-2">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Últimos archivos subidos a Vercel Blob:
                    </h4>
                    <div className="divide-y divide-purple-800/40 text-xs">
                      {blobDiag.blobs.map((b: any, idx: number) => (
                        <div key={idx} className="py-2 flex items-center justify-between gap-3">
                          <span className="font-mono text-pink-300 truncate max-w-sm">{b.pathname}</span>
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-300 hover:text-white text-[11px] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Ver archivo
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
