'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Printer,
  Ban,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  QrCode,
  FileText,
  User,
  Shield,
  Loader2,
} from 'lucide-react';
import { useCrmAuth } from '@/lib/crm/client';
import { useCrmTheme } from '@/lib/crm/theme';

interface TaxCertificate {
  _id: string;
  code: string;
  fiscalYear: number;
  issueDate: string;
  issuerName: string;
  issuerNit: string;
  issuerRteStatus: string;
  issuerLegalRep: string;
  issuerAccountant: string;
  issuerAccountantTp: string;
  donorName: string;
  donorDocumentType: string;
  donorDocumentNumber: string;
  donorAddress?: string;
  donorCity?: string;
  donorEmail?: string;
  donorPhone?: string;
  donationType: 'DINERO' | 'ESPECIE' | 'SERVICIOS' | 'OTRO';
  donationMethod: string;
  donationDate: string;
  amount: number;
  currency: string;
  amountInWords: string;
  destinationProgram: string;
  speciesDescription?: string;
  statuteArticles: string;
  noConsiderationClause: boolean;
  meritoriousActivity: string;
  verificationCode: string;
  qrPayload: string;
  status: 'EMITIDO' | 'ANULADO' | 'BORRADOR';
  voidReason?: string;
  voidedAt?: string;
  voidedBy?: string;
  createdByName: string;
  createdAt: string;
}

const PROGRAMS_LIST = [
  'Atención Psicosocial y Jurídica Integral a Mujeres',
  'Ruta de Protección y Casas Refugio',
  'Capacitación Laboral y Emprendimiento Femenino',
  'Fortalecimiento Comunitario y Liderazgo de Género',
  'Fondo de Emergencia y Asistencia Humanitaria Inmediata',
  'Prevención de Violencias Basadas en Género (VBG)',
  'Fondo General de Sostenibilidad Institucional',
];

const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function CertificadosDianPage() {
  const { user, can } = useCrmAuth();
  const { theme } = useCrmTheme();

  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  const [stats, setStats] = useState({ activeTotal: 0, activeCount: 0, voidedCount: 0, allCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<TaxCertificate | null>(null);
  const [voidTarget, setVoidTarget] = useState<TaxCertificate | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    donorName: '',
    donorDocumentType: 'NIT',
    donorDocumentNumber: '',
    donorAddress: '',
    donorCity: 'Cartagena de Indias, Bolívar',
    donorEmail: '',
    donorPhone: '',
    donationType: 'DINERO',
    donationMethod: 'TRANSFERENCIA',
    donationDate: new Date().toISOString().slice(0, 10),
    amount: '',
    currency: 'COP',
    amountInWords: '',
    destinationProgram: PROGRAMS_LIST[0],
    speciesDescription: '',
    fiscalYear: new Date().getFullYear(),
    issuerLegalRep: 'Dirección Ejecutiva Fundación Senda Mujer',
    issuerAccountant: 'Contaduría Pública & Revisoría Fiscal',
    issuerAccountantTp: 'T.P. 182492-T',
  });

  const printAreaRef = useRef<HTMLDivElement>(null);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (search) params.set('q', search);
      if (statusFilter) params.set('status', statusFilter);
      if (yearFilter) params.set('fiscalYear', yearFilter);

      const res = await fetch(`/api/crm/certificados?${params}`);
      const data = await res.json();
      setCertificates(data.certificates || []);
      setStats(data.stats || { activeTotal: 0, activeCount: 0, voidedCount: 0, allCount: 0 });
    } catch (err) {
      console.error('Error al cargar certificados:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, yearFilter]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Actualizar monto en letras al cambiar el valor
  const handleAmountChange = async (val: string) => {
    setForm(prev => ({ ...prev, amount: val }));
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      try {
        const res = await fetch('/api/crm/certificados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'CONVERT_WORDS', amount: num }),
        });
        const d = await res.json();
        if (d.words) {
          setForm(prev => ({ ...prev, amountInWords: d.words }));
        }
      } catch {
        // silent
      }
    }
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName || !form.donorDocumentNumber || !form.amount) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/crm/certificados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', ...form }),
      });
      const data = await res.json();
      if (data.success && data.certificate) {
        setShowCreateModal(false);
        setPreviewCert(data.certificate);
        fetchCertificates();
      } else {
        alert(data.error || 'Error al emitir el certificado');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoidCertificate = async () => {
    if (!voidTarget || !voidReason) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/crm/certificados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VOID',
          certificateId: voidTarget._id,
          voidReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVoidTarget(null);
        setVoidReason('');
        fetchCertificates();
      } else {
        alert(data.error || 'Error al anular certificado');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      {/* Estilos para impresión oficial DIAN - Hoja Carta Exacta (Letter Size) */}
      <style jsx global>{`
        @page {
          size: letter portrait;
          margin: 8mm 12mm 8mm 12mm;
        }
        @media print {
          html, body {
            background: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
            font-size: 11px !important;
          }
          body * {
            visibility: hidden;
          }
          #print-certificate-area, #print-certificate-area * {
            visibility: visible;
          }
          #print-certificate-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Certificados de Donación · DIAN RTE
              </h1>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Régimen Tributario Especial (Art. 125-1 a 125-5 E.T. y D.R. 2150/2017)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCertificates}
            className={`p-2 rounded-xl border transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700'
            }`}
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo Certificado DIAN
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/40 border-slate-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Total Donaciones Certificadas
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {COP(stats.activeTotal)}
          </p>
          <p className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> RTE DIAN Vigente
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/40 border-slate-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Certificados Emitidos
            </span>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {stats.activeCount}
          </p>
          <p className={`text-[11px] font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Válidos para deducción fiscal 25%
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/40 border-slate-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Año Fiscal / Gravable
            </span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {yearFilter || new Date().getFullYear()}
          </p>
          <p className="text-[11px] text-indigo-400 font-medium mt-1">
            Declaración E.S.A.L.
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/40 border-slate-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Certificados Anulados
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Ban className="w-4 h-4" />
            </span>
          </div>
          <p className={`text-2xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {stats.voidedCount}
          </p>
          <p className={`text-[11px] font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Auditados con causa legal
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-800/30 border-slate-700/50'
        }`}
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por donante, NIT, consecutivo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-slate-900/60 border-slate-700 text-slate-200 placeholder:text-slate-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border focus:outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-900/60 border-slate-700 text-slate-300'
            }`}
          >
            <option value="">Todos los estados</option>
            <option value="EMITIDO">Válidos (Emitidos)</option>
            <option value="ANULADO">Anulados</option>
          </select>

          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border focus:outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-900/60 border-slate-700 text-slate-300'
            }`}
          >
            <option value="2026">Año Gravable 2026</option>
            <option value="2025">Año Gravable 2025</option>
            <option value="2024">Año Gravable 2024</option>
          </select>
        </div>
      </div>

      {/* Certificates Table */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/30 border-slate-700/50'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b font-semibold uppercase tracking-wider ${
                  isLight
                    ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-400'
                }`}
              >
                <th className="py-3.5 px-4">Consecutivo</th>
                <th className="py-3.5 px-4">Donante / Razón Social</th>
                <th className="py-3.5 px-4">Documento / NIT</th>
                <th className="py-3.5 px-4">Fecha Donación</th>
                <th className="py-3.5 px-4">Valor Donado</th>
                <th className="py-3.5 px-4">Programa / Destino</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800'}`}>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500 mb-2" />
                    Cargando certificados tributarios...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-500 mb-2 opacity-40" />
                    No se encontraron certificados para los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                certificates.map(cert => (
                  <tr
                    key={cert._id}
                    className={`transition-colors ${
                      isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-800/40'
                    } ${cert.status === 'ANULADO' ? 'opacity-60' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-500">
                      {cert.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <span className={isLight ? 'text-slate-900' : 'text-white'}>
                        {cert.donorName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {cert.donorDocumentType} {cert.donorDocumentNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {cert.donationDate}
                    </td>
                    <td className={`py-3.5 px-4 font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      {COP(cert.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate" title={cert.destinationProgram}>
                      {cert.destinationProgram}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          cert.status === 'EMITIDO'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {cert.status === 'EMITIDO' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            EMITIDO
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            ANULADO
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isLight
                              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                          title="Ver e Imprimir Certificado Oficial"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {cert.status === 'EMITIDO' && (
                          <button
                            onClick={() => setVoidTarget(cert)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                            title="Anular Certificado (DIAN)"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODAL: Generar Nuevo Certificado RTE DIAN
      ══════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-slate-700 text-white'
            }`}
          >
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 backdrop-blur-md z-10 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-[#0f172a]/90 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Generar Certificado de Donación</h3>
                  <p className="text-xs text-slate-400">Régimen Tributario Especial (Art. 125-1 a 125-5 E.T.)</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCertificate} className="p-6 space-y-5">
              {/* Bloque Donante */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> 1. Datos del Donante
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nombre o Razón Social *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: INVERSIONES DEL CARIBE S.A.S."
                      value={form.donorName}
                      onChange={e => setForm({ ...form, donorName: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/30 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo Documento</label>
                    <select
                      value={form.donorDocumentType}
                      onChange={e => setForm({ ...form, donorDocumentType: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    >
                      <option value="NIT">NIT</option>
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PASAPORTE">Pasaporte</option>
                      <option value="TAX_ID">Tax ID (Extranjero)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Número de Documento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 900.123.456-7"
                      value={form.donorDocumentNumber}
                      onChange={e => setForm({ ...form, donorDocumentNumber: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/30 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ciudad / Municipio</label>
                    <input
                      type="text"
                      placeholder="Ej: Cartagena, Bolívar"
                      value={form.donorCity}
                      onChange={e => setForm({ ...form, donorCity: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="donaciones@empresa.com"
                      value={form.donorEmail}
                      onChange={e => setForm({ ...form, donorEmail: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Bloque Donación */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> 2. Detalle de la Donación y Destinación Social
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Valor en Números (COP) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ej: 5000000"
                      value={form.amount}
                      onChange={e => handleAmountChange(e.target.value)}
                      className={`w-full px-3.5 py-2 text-xs font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500/30 ${
                        isLight ? 'bg-slate-50 border-slate-200 text-emerald-700' : 'bg-slate-900 border-slate-700 text-emerald-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Fecha de la Donación *</label>
                    <input
                      type="date"
                      required
                      value={form.donationDate}
                      onChange={e => setForm({ ...form, donationDate: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo de Donación</label>
                    <select
                      value={form.donationType}
                      onChange={e => setForm({ ...form, donationType: e.target.value as any })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    >
                      <option value="DINERO">Dinero (Transferencia / PSE)</option>
                      <option value="ESPECIE">Bienes en Especie</option>
                      <option value="SERVICIOS">Servicios / Asesoría</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Valor en Letras (Automático) *</label>
                  <input
                    type="text"
                    required
                    readOnly
                    placeholder="CINCO MILLONES DE PESOS M/CTE."
                    value={form.amountInWords}
                    className={`w-full px-3.5 py-2 text-xs font-semibold rounded-xl border bg-slate-800/30 border-slate-700/60 text-slate-300`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Programa / Destino Social (Actividad Meritoria) *</label>
                  <select
                    value={form.destinationProgram}
                    onChange={e => setForm({ ...form, destinationProgram: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    {PROGRAMS_LIST.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {form.donationType === 'ESPECIE' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Descripción de Bienes en Especie y Avalúo *</label>
                    <textarea
                      rows={2}
                      placeholder="Describa los bienes donados, cantidad, estado y soporte de valoración..."
                      value={form.speciesDescription}
                      onChange={e => setForm({ ...form, speciesDescription: e.target.value })}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Bloque Legal DIAN */}
              <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-rose-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cláusula de Cumplimiento Legal DIAN
                </p>
                <p className="text-slate-400">
                  El certificado incluirá la declaración formal de no contraprestación directa ni indirecta y la acreditación de la Fundación Senda Mujer como entidad calificada en el Régimen Tributario Especial (RTE).
                </p>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck2 className="w-4 h-4" />}
                  Emitir y Firmar Certificado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: Visor e Impresión Oficial DIAN del Certificado
      ══════════════════════════════════════════════════════════ */}
      {previewCert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl flex flex-col my-auto">
            {/* Barra de Controles superior (no-print) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print rounded-t-3xl">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-rose-400" />
                <span className="font-bold text-sm">Vista Oficial de Certificado · {previewCert.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / Guardar PDF
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Documento Oficial Membretado DIAN - Ajustado a Hoja Carta (Letter Size) */}
            <div
              id="print-certificate-area"
              ref={printAreaRef}
              className="p-6 sm:p-10 space-y-4 text-slate-900 bg-white text-[11px] leading-relaxed max-w-[800px] mx-auto print:p-0 print:space-y-3"
            >
              {/* Membrete Oficial */}
              <div className="border-b-2 border-rose-600 pb-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Fundación Senda Mujer" className="h-10 w-auto object-contain" />
                    <div>
                      <h2 className="text-base font-black text-rose-900 tracking-tight leading-none">FUNDACIÓN SENDA MUJER</h2>
                      <p className="text-[11px] font-bold text-slate-700">NIT: {previewCert.issuerNit}</p>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-600 font-medium">
                    {previewCert.issuerRteStatus}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Sede Principal: Cartagena de Indias, Bolívar · Colombia · fundacionsendamujer.org
                  </p>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-[11px] rounded">
                    {previewCert.code}
                  </span>
                  <p className="text-[10px] text-slate-600">Año Gravable: <strong>{previewCert.fiscalYear}</strong></p>
                  <p className="text-[10px] text-slate-600">Fecha de Expedición: <strong>{previewCert.issueDate}</strong></p>
                  {previewCert.status === 'ANULADO' && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 border border-red-300 text-red-700 font-bold text-[9px] rounded">
                      DOCUMENTO ANULADO
                    </span>
                  )}
                </div>
              </div>

              {/* Título Principal */}
              <div className="text-center py-1 space-y-0.5">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  CERTIFICADO DE DONACIÓN PARA EFECTOS TRIBUTARIOS
                </h3>
                <p className="text-[10px] text-slate-600 font-medium italic">
                  Expedido en cumplimiento de los Artículos 125-1 a 125-5 del Estatuto Tributario y el Decreto 2150 de 2017
                </p>
              </div>

              {/* Declaración de la Representación Legal */}
              <div className="space-y-2.5 text-[10.5px] leading-normal text-slate-800 text-justify">
                <p>
                  El suscrito Representante Legal y Contador Público de la <strong>FUNDACIÓN SENDA MUJER</strong>, identificada con NIT <strong>{previewCert.issuerNit}</strong>, entidad sin ánimo de lucro calificada y perteneciente al <strong>RÉGIMEN TRIBUTARIO ESPECIAL (RTE)</strong> del impuesto sobre la renta:
                </p>

                <p className="text-center font-bold text-xs tracking-wider py-0.5 text-slate-900">
                  CERTIFICAN:
                </p>

                <p>
                  Que a título gratuito y sin que medie contraprestación alguna, se recibió una donación con el siguiente detalle:
                </p>

                {/* Cuadro de Datos del Donante y Donación */}
                <div className="border border-slate-300 rounded-lg overflow-hidden my-2">
                  <table className="w-full text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td className="py-1.5 px-3 font-bold text-slate-700 w-1/3">Donante / Razón Social:</td>
                        <td className="py-1.5 px-3 font-black text-slate-900">{previewCert.donorName}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-1.5 px-3 font-bold text-slate-700">Identificación / NIT:</td>
                        <td className="py-1.5 px-3 font-mono font-bold text-slate-900">{previewCert.donorDocumentType} {previewCert.donorDocumentNumber}</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td className="py-1.5 px-3 font-bold text-slate-700">Ciudad y Dirección:</td>
                        <td className="py-1.5 px-3 text-slate-800">{previewCert.donorCity} {previewCert.donorAddress ? `· ${previewCert.donorAddress}` : ''}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-1.5 px-3 font-bold text-slate-700">Fecha de la Donación:</td>
                        <td className="py-1.5 px-3 text-slate-800 font-mono">{previewCert.donationDate}</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td className="py-1.5 px-3 font-bold text-slate-700">Tipo y Modalidad:</td>
                        <td className="py-1.5 px-3 text-slate-800">{previewCert.donationType} ({previewCert.donationMethod})</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-1.5 px-3 font-bold text-slate-700">Monto Donado:</td>
                        <td className="py-1.5 px-3 font-black text-emerald-800 text-xs">{COP(previewCert.amount)}</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-1.5 px-3 font-bold text-slate-700">Valor en Letras:</td>
                        <td className="py-1.5 px-3 font-bold text-slate-900 uppercase">{previewCert.amountInWords}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Destinación y Cláusulas DIAN */}
                <div className="space-y-1.5 text-[10px]">
                  <p>
                    <strong>1. DESTINACIÓN SOCIAL:</strong> Los recursos donados fueron destinados exclusivamente a la ejecución del programa social: <em>&ldquo;{previewCert.destinationProgram}&rdquo;</em>, correspondiente a una actividad meritoria de interés general en beneficio de mujeres en condición de vulnerabilidad.
                  </p>
                  <p>
                    <strong>2. NO CONTRAPRESTACIÓN:</strong> Se certifica expresamente que la presente donación fue efectuada a título de mera liberalidad, sin que el donante ni personas vinculadas reciban ningún beneficio, contraprestación directa o indirecta por parte de la Fundación.
                  </p>
                  <p>
                    <strong>3. RÉGIMEN TRIBUTARIO ESPECIAL:</strong> La Fundación Senda Mujer se encuentra debidamente calificada y actualizada en el RTE de la DIAN conforme a la Ley 1819 de 2016 y el Decreto 2150 de 2017, habilitando el descuento tributario del Art. 257 del E.T.
                  </p>
                </div>
              </div>

              {/* Firmas Autorizadas */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center text-[10px]">
                <div className="space-y-0.5 border-t border-slate-800 pt-2">
                  <p className="font-bold text-slate-900">{previewCert.issuerLegalRep}</p>
                  <p className="text-[9.5px] text-slate-600 font-semibold">Representante Legal</p>
                  <p className="text-[9px] text-slate-500">Fundación Senda Mujer · NIT {previewCert.issuerNit}</p>
                </div>

                <div className="space-y-0.5 border-t border-slate-800 pt-2">
                  <p className="font-bold text-slate-900">{previewCert.issuerAccountant}</p>
                  <p className="text-[9.5px] text-slate-600 font-semibold">Contador Público / Revisor Fiscal</p>
                  <p className="text-[9px] text-slate-500">{previewCert.issuerAccountantTp}</p>
                </div>
              </div>

              {/* Pie de Página con Enlace de Verificación y QR */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-600 font-mono">
                <div className="space-y-0.5 max-w-[65%]">
                  <p className="font-bold text-slate-800 uppercase">CÓDIGO HASH DE VERIFICACIÓN DIAN:</p>
                  <p className="text-slate-600 text-[8.5px] break-all">{previewCert.verificationCode}</p>
                  <p className="text-[8.5px] text-slate-500 pt-0.5">
                    Verifique la veracidad y validez oficial de este documento en línea en:{' '}
                    <a
                      href={`https://fundacionsendamujer.org/verificar-certificado?code=${previewCert.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-700 font-bold underline"
                    >
                      fundacionsendamujer.org/verificar-certificado?code={previewCert.code}
                    </a>
                  </p>
                </div>

                <div className="text-right flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=65x65&data=${encodeURIComponent(
                      `https://fundacionsendamujer.org/verificar-certificado?code=${previewCert.code}`
                    )}`}
                    alt="QR Verificación"
                    className="w-14 h-14 border border-slate-300 rounded p-0.5 bg-white"
                  />
                  <div className="text-right">
                    <span className="block text-[8px] font-bold text-slate-500">ESCANEÉ EL QR</span>
                    <span className="block text-[8px] text-emerald-700 font-bold">AUTENTICIDAD DIAN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: Anular Certificado (Auditoría DIAN)
      ══════════════════════════════════════════════════════════ */}
      {voidTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-slate-700 text-white'
            }`}
          >
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Anulación de Certificado DIAN</h3>
                <p className="text-xs text-slate-400 font-mono">{voidTarget.code}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              La anulación de un certificado tributario queda registrada con fines de auditoría fiscal. Ingrese el motivo formal de la anulación:
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Motivo de Anulación *</label>
              <textarea
                rows={3}
                required
                placeholder="Ej: Corrección de NIT del donante / Reexpedición por error en monto..."
                value={voidReason}
                onChange={e => setVoidReason(e.target.value)}
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVoidTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleVoidCertificate}
                disabled={submitting || !voidReason.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-red-600/25 transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                Confirmar Anulación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
