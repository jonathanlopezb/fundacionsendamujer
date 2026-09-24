'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  HeartHandshake, Plus, Trash2, Edit3, Upload, CheckCircle2,
  AlertTriangle, ExternalLink, Globe, Phone, X, Sparkles, Building2
} from 'lucide-react';

export default function CmsAlliesManager() {
  const [allies, setAllies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulario nuevo aliado
  const [name, setName] = useState('');
  const [acronym, setAcronym] = useState('');
  const [category, setCategory] = useState('ngo');
  const [categoryLabel, setCategoryLabel] = useState('Organización Social');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('Cartagena / Bolívar');
  const [isFeaturedInHome, setIsFeaturedInHome] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAllies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/allies');
      const data = await res.json();
      if (data.allies) {
        setAllies(data.allies);
      }
    } catch (err: any) {
      setError('Error al cargar aliados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllies();
  }, []);

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
      if (!res.ok || data.error) throw new Error(data.error || 'Error al subir logo');
      setLogoUrl(data.url);
      setSuccessMsg('¡Logo cargado exitosamente a Blob!');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Blob');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAlly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoUrl) {
      setError('Por favor indica el Nombre y el Logo del aliado.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/cms/allies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          acronym,
          category,
          categoryLabel,
          logoUrl,
          website,
          phone,
          description,
          scope,
          isFeaturedInHome,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al registrar aliado');
      setSuccessMsg(`¡Aliado "${name}" registrado exitosamente!`);
      setShowModal(false);
      setName('');
      setAcronym('');
      setLogoUrl('');
      setWebsite('');
      setPhone('');
      setDescription('');
      loadAllies();
    } catch (err: any) {
      setError(err.message || 'Error al registrar aliado.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlly = async (id: string, allyName: string) => {
    if (id.startsWith('def-')) {
      alert('Los aliados fundacionales predeterminados no se pueden eliminar.');
      return;
    }
    if (!confirm(`¿Estás seguro de que deseas eliminar al aliado "${allyName}"?`)) return;
    try {
      const res = await fetch(`/api/cms/allies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Aliado "${allyName}" eliminado.`);
        loadAllies();
      }
    } catch {
      setError('Error al eliminar aliado.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-pink-300 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4 text-pink-400" />
            Red de Alianzas Institucionales
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Gestor de Aliados Estratégicos</h2>
          <p className="text-xs text-purple-300/70 mt-1">
            Agrega nuevos aliados, sube sus logos oficiales y define su visibilidad en el sitio web.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-700/30 flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Agregar Nuevo Aliado
        </button>
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

      {/* Grid de Aliados */}
      {loading ? (
        <div className="py-20 text-center text-purple-300">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Cargando aliados…</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allies.map((ally) => (
            <div
              key={ally.id || ally._id}
              className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all hover:border-pink-500/40"
            >
              <div>
                {/* Logo y Badges */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-24 h-16 rounded-xl bg-white p-2 flex items-center justify-center border border-purple-800/60 overflow-hidden shrink-0">
                    <img
                      src={ally.logoUrl}
                      alt={`Logo de ${ally.name}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                      {ally.categoryLabel || ally.category}
                    </span>
                    {ally.isFeaturedInHome && (
                      <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                        ★ Visible en Inicio
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{ally.name}</h3>
                {ally.description && (
                  <p className="text-xs text-purple-200/80 mt-1.5 leading-relaxed">{ally.description}</p>
                )}

                <div className="pt-3 mt-3 border-t border-purple-800/40 space-y-1 text-[11px] text-purple-300/70">
                  {ally.website && (
                    <a
                      href={ally.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-pink-300 hover:text-white transition-colors"
                    >
                      <Globe className="w-3 h-3" /> {ally.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {ally.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-emerald-400" /> {ally.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-4 mt-4 border-t border-purple-800/40 flex justify-end">
                {!ally.id?.startsWith('def-') && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAlly(ally.id || ally._id, ally.name)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Agregar Nuevo Aliado */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#240a38] border border-purple-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Registrar Nuevo Aliado</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlly} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Nombre de la Institución u Organización <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Universidad de Cartagena"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const labels: Record<string, string> = {
                        public: 'Sector Público & DDHH',
                        health: 'Salud & Medicina',
                        academic: 'Academia & Formación',
                        ngo: 'Organización Social',
                        private: 'Empresa Aliada',
                        social: 'Colectivo Comunitario',
                      };
                      setCategoryLabel(labels[e.target.value] || 'Organización Aliada');
                    }}
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-pink-500"
                  >
                    <option value="public">Sector Público & DDHH</option>
                    <option value="health">Salud & Medicina</option>
                    <option value="academic">Academia & Formación</option>
                    <option value="ngo">Organización Social (ONG)</option>
                    <option value="private">Empresa con Propósito</option>
                    <option value="social">Colectivo Comunitario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Sigla / Acrónimo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={acronym}
                    onChange={(e) => setAcronym(e.target.value)}
                    placeholder="Ej. UNICARTAGENA"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                    Logo Oficial (Blob o URL) <span className="text-pink-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-bold text-pink-300 hover:text-white flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> {uploading ? 'Subiendo…' : 'Subir Logo a Blob'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... o sube el archivo PNG/JPG"
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

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Descripción del Convenio / Acompañamiento
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe cómo se articula con las rutas de atención y los programas de Senda..."
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-purple-100 placeholder-purple-400/30 outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Sitio Web Oficial (Opcional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Teléfono / Canal de Contacto
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. (605) 600 0000"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-purple-200 font-bold">
                  <input
                    type="checkbox"
                    checked={isFeaturedInHome}
                    onChange={(e) => setIsFeaturedInHome(e.target.checked)}
                    className="accent-pink-500 w-4 h-4 rounded"
                  />
                  <span>Mostrar en la sección destacada de Aliados de la Home Page y Nosotros</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-700/30"
                >
                  {saving ? 'Guardando…' : 'Registrar Aliado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
