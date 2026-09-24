'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon, Plus, FolderPlus, Trash2, Edit3, Upload,
  CheckCircle2, AlertTriangle, Sparkles, X, MapPin, Calendar, Users
} from 'lucide-react';

export default function CmsGalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modales
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Formulario nueva foto
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('Febrero 2026');
  const [location, setLocation] = useState('Cartagena de Indias');
  const [participants, setParticipants] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  // Formulario nueva categoría
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        fetch('/api/cms/gallery/categories'),
        fetch('/api/cms/gallery/items'),
      ]);
      const catsData = await catsRes.json();
      const itemsData = await itemsRes.json();

      if (catsData.categories) {
        setCategories(catsData.categories);
        if (!category && catsData.categories.length > 0) {
          setCategory(catsData.categories[0].name);
        }
      }
      if (itemsData.items) {
        setItems(itemsData.items);
      }
    } catch (err: any) {
      setError('Error al cargar datos de la galería.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Subir archivo a Vercel Blob
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/cms/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Error al subir imagen');
      setImageUrl(data.url);
      setSuccessMsg('¡Imagen cargada exitosamente a Blob!');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Blob');
    } finally {
      setUploading(false);
    }
  };

  // Guardar nueva foto
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description || !imageUrl) {
      setError('Por favor completa los campos requeridos (Título, Categoría, Descripción e Imagen).');
      return;
    }
    setSavingPhoto(true);
    setError('');
    try {
      const res = await fetch('/api/cms/gallery/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          imageUrl,
          date,
          location,
          participants,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al guardar foto');
      setSuccessMsg('¡Foto y descripción agregadas a la galería exitosamente!');
      setShowPhotoModal(false);
      setTitle('');
      setDescription('');
      setImageUrl('');
      setParticipants('');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la foto.');
    } finally {
      setSavingPhoto(false);
    }
  };

  // Crear categoría
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setSavingCat(true);
    setError('');
    try {
      const res = await fetch('/api/cms/gallery/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, description: newCatDesc }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al crear categoría');
      setSuccessMsg(`Categoría "${newCatName}" creada.`);
      setShowCategoryModal(false);
      setNewCatName('');
      setNewCatDesc('');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error al crear categoría.');
    } finally {
      setSavingCat(false);
    }
  };

  // Eliminar foto
  const handleDeletePhoto = async (id: string, photoTitle: string) => {
    if (!confirm(`¿Deseas eliminar la foto "${photoTitle}" de la galería?`)) return;
    try {
      const res = await fetch(`/api/cms/gallery/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Foto eliminada correctamente.');
        loadData();
      }
    } catch {
      setError('Error al eliminar foto.');
    }
  };

  // Eliminar categoría
  const handleDeleteCategory = async (id: string, catName: string) => {
    if (id.startsWith('def-')) {
      alert('Las categorías predeterminadas del sistema no se eliminan.');
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/cms/gallery/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Categoría "${catName}" eliminada.`);
        loadData();
      }
    } catch {
      setError('Error al eliminar categoría.');
    }
  };

  const filteredItems = selectedCategory === 'Todas'
    ? items
    : items.filter((it) => it.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Cabecera y Botones de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-pink-300 font-bold text-xs uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4 text-pink-400" />
            Galería Fotográfica & Actividades
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Gestor de Fotos y Categorías</h2>
          <p className="text-xs text-purple-300/70 mt-1">
            Agrega nuevas fotos con descripciones detalladas y organiza las categorías temáticas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700/60 text-purple-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-pink-400" /> Nueva Categoría
          </button>
          <button
            type="button"
            onClick={() => {
              if (categories.length > 0 && !category) setCategory(categories[0].name);
              setShowPhotoModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-700/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Agregar Foto
          </button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Categorías (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('Todas')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === 'Todas'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
              : 'text-purple-300/70 hover:text-white hover:bg-purple-900/30'
          }`}
        >
          Todas ({items.length})
        </button>
        {categories.map((c) => (
          <div
            key={c.id || c.name}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === c.name
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'bg-[#240a38]/60 text-purple-300/70 hover:text-white border border-purple-800/40'
            }`}
          >
            <span className="cursor-pointer" onClick={() => setSelectedCategory(c.name)}>
              {c.name}
            </span>
            {!c.isDefault && (
              <button
                type="button"
                onClick={() => handleDeleteCategory(c.id, c.name)}
                className="text-rose-400/60 hover:text-rose-300 ml-1"
                title="Eliminar categoría"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Grid de Fotos de la Galería */}
      {loading ? (
        <div className="py-20 text-center text-purple-300">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Cargando fotos de la galería…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-[#240a38]/40 border border-purple-800/40 rounded-3xl p-8">
          <ImageIcon className="w-10 h-10 text-purple-400/40 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No hay fotos en esta categoría</h3>
          <p className="text-xs text-purple-300/60 mt-1">Haz clic en &quot;Agregar Foto&quot; para subir la primera imagen.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id || item._id}
              className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all hover:border-pink-500/40 group"
            >
              <div>
                {/* Imagen */}
                <div className="relative aspect-[16/10] w-full bg-[#160224] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-pink-300 text-[10px] font-bold border border-pink-500/30">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Contenido & Descripción */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                  <p className="text-xs text-purple-200/80 leading-relaxed">{item.description}</p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-purple-300/70 border-t border-purple-800/40">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-pink-400" /> {item.location}
                      </span>
                    )}
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" /> {item.date}
                      </span>
                    )}
                    {item.participants && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-400" /> {item.participants}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón eliminar */}
              <div className="px-5 py-3 bg-[#180426]/60 border-t border-purple-800/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(item.id || item._id, item.title)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Agregar Foto con Descripción */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#240a38] border border-purple-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Agregar Nueva Foto a la Galería</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Título de la Actividad o Jornada <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Jornada Médica Integral en Arroz Barato"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Categoría <span className="text-pink-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-pink-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Fecha
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Ej. Febrero 2026"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Descripción Detallada <span className="text-pink-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe las acciones realizadas, personas beneficiadas y el impacto comunitario..."
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/30 outline-none focus:border-pink-500 resize-none"
                />
              </div>

              {/* Subida de Imagen */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                    Imagen (Blob o URL) <span className="text-pink-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-bold text-pink-300 hover:text-white flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> {uploading ? 'Subiendo…' : 'Subir a Blob'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... o sube una imagen"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500 font-mono"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Ubicación / Barrio
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Barrio Nelson Mandela"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Beneficiarias Atendidas
                  </label>
                  <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="Ej. 120 mujeres y familias"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingPhoto || uploading}
                  className="px-5 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-700/30 flex items-center gap-1.5"
                >
                  {savingPhoto ? 'Guardando…' : 'Guardar en Galería'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear Categoría */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#240a38] border border-purple-700 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Crear Nueva Categoría</h3>
              </div>
              <button onClick={() => setShowCategoryModal(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Nombre de la Categoría <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej. Brigadas de Emergencia"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Descripción (Opcional)
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Breve propósito de esta categoría"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingCat}
                  className="px-5 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-700/30"
                >
                  {savingCat ? 'Creando…' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
