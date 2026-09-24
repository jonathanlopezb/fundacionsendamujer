'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Check, RefreshCw, Sparkles, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { CmsImageItem } from '@/lib/cms-defaults';

interface CmsImageCardProps {
  item: CmsImageItem;
  onSaveSuccess?: () => void;
}

export default function CmsImageCard({ item, onSaveSuccess }: CmsImageCardProps) {
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [altText, setAltText] = useState(item.altText);
  const [caption, setCaption] = useState(item.caption || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subir archivo a Vercel Blob
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Solo se permiten archivos de imagen (JPG, PNG, WebP, SVG, GIF).' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen supera el límite máximo de 10 MB.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/cms/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al subir la imagen.');
      }

      const uploadedUrl = data.url;
      setImageUrl(uploadedUrl);

      // Guardar automáticamente la nueva URL en MongoDB
      const saveRes = await fetch('/api/cms/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: item.sectionKey,
          imageUrl: uploadedUrl,
          altText,
          caption,
          page: item.page,
          title: item.title,
        }),
      });

      if (saveRes.ok) {
        setMessage({ type: 'success', text: '¡Imagen subida a Blob y guardada en MongoDB con éxito!' });
        if (onSaveSuccess) onSaveSuccess();
      } else {
        setMessage({ type: 'success', text: '¡Imagen cargada en Blob! Haz clic en Guardar Cambios para confirmar.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al conectar con el almacenamiento Blob.' });
    } finally {
      setUploading(false);
    }
  };

  // Guardar en MongoDB
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/cms/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: item.sectionKey,
          imageUrl,
          altText,
          caption,
          page: item.page,
          title: item.title,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar la imagen en la base de datos.');
      }

      setMessage({ type: 'success', text: '¡Cambios guardados en MongoDB exitosamente!' });
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'No se pudo guardar la configuración.' });
    } finally {
      setSaving(false);
    }
  };

  // Restaurar valor predeterminado
  const handleReset = () => {
    setImageUrl(item.imageUrl);
    setAltText(item.altText);
    setCaption(item.caption || '');
    setMessage({ type: 'success', text: 'Valores restablecidos a los predeterminados. Haz clic en Guardar para confirmar.' });
  };

  return (
    <div className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between transition-all hover:border-pink-500/40">
      <div>
        {/* Cabecera de la sección */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black uppercase tracking-wider mb-1">
              {item.page}
            </span>
            <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
            <p className="text-xs text-purple-300/70 mt-0.5 line-clamp-2">{item.description}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              {item.recommendedSize}
            </span>
          </div>
        </div>

        {/* Vista previa de la imagen */}
        <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-purple-700/50 bg-[#160224] mb-4 group shadow-inner">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-purple-400">
              <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
              <span className="text-xs">Sin imagen seleccionada</span>
            </div>
          )}

          {/* Overlay de subida rápida */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Reemplazar archivo
            </button>
            {imageUrl.startsWith('http') && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Ver imagen en tamaño completo"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          }}
        />

        {/* Inputs de configuración */}
        <div className="space-y-3">
          {/* URL de la Imagen */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                URL de la Imagen (Blob o CDN)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-[11px] font-bold text-pink-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Upload className="w-3 h-3" /> {uploading ? 'Subiendo…' : 'Subir a Blob'}
              </button>
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... o /archivo.png"
              className="w-full bg-[#160224] border border-purple-700/60 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl px-3 py-2 text-xs text-purple-100 placeholder-purple-400/30 outline-none transition-all font-mono"
            />
          </div>

          {/* Texto Alternativo SEO (alt) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" />
                Texto Alternativo SEO (`alt`)
              </label>
              <span className="text-[10px] text-purple-300/60">{altText.length} carac.</span>
            </div>
            <textarea
              rows={2}
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe claramente la imagen para Google y accesibilidad..."
              className="w-full bg-[#160224] border border-purple-700/60 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl px-3 py-2 text-xs text-purple-100 placeholder-purple-400/30 outline-none transition-all resize-none"
            />
          </div>

          {/* Pie de foto / Crédito */}
          <div>
            <label className="block text-[11px] font-bold text-purple-200 uppercase tracking-wider mb-1">
              Pie de Foto / Crédito (Opcional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ej. Dra. Sorelvis Murillo · Trabajadora Social"
              className="w-full bg-[#160224] border border-purple-700/60 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl px-3 py-2 text-xs text-purple-100 placeholder-purple-400/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`mt-3 p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-purple-800/40">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-purple-300/70 hover:text-white font-medium flex items-center gap-1 transition-colors px-2 py-1"
        >
          <RefreshCw className="w-3 h-3" /> Restaurar
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="px-4 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-pink-700/30 transition-all flex items-center gap-1.5"
        >
          {saving ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
