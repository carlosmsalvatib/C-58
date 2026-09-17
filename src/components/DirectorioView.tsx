import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Cliente } from '../types';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Building2,
  Tag,
  Download,
  Eye,
  X,
  Briefcase,
  CheckCircle,
} from 'lucide-react';

export const DirectorioView: React.FC = () => {
  const { clientes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('todas');
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);

  // Extract unique industries
  const industries = useMemo(() => {
    const list = Array.from(new Set(clientes.map(c => c.industria).filter(Boolean)));
    return ['todas', ...list];
  }, [clientes]);

  // Filtered list
  const filtered = useMemo(() => {
    return clientes.filter(c => {
      const matchSearch =
        c.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.servicios_ofrecidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchIndustry =
        selectedIndustry === 'todas' || c.industria === selectedIndustry;

      return matchSearch && matchIndustry;
    });
  }, [clientes, searchTerm, selectedIndustry]);

  const handleExportCSV = () => {
    const headers = ['Identificación', 'Nombre Completo', 'Empresa', 'Industria', 'Teléfono', 'Email', 'Dirección', 'Servicios Ofrecidos', 'Status'];
    const rows = filtered.map(c => [
      `"${c.identificacion}"`,
      `"${c.nombre_completo}"`,
      `"${c.nombre_empresa}"`,
      `"${c.industria}"`,
      `"${c.telefono}"`,
      `"${c.email}"`,
      `"${c.direccion}"`,
      `"${c.servicios_ofrecidos.replace(/"/g, '""')}"`,
      `"${c.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `directorio_codigo58_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div id="directorio-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-teal-600" />
            Directorio de Emprendedores
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Buscador integral con contacto directo vía WhatsApp, llamada telefónica y portafolio de servicios.
          </p>
        </div>
        <button
          id="export-directorio-csv"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Exportar Directorio (CSV)
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            id="search-directorio-input"
            type="text"
            placeholder="Buscar por nombre, Cédula/RIF, empresa o servicio..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="w-full md:w-56">
          <select
            id="filter-directorio-industria"
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>
                {ind === 'todas' ? 'Todas las industrias' : ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              {/* Header inside card */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 font-mono mb-1">
                    {c.identificacion}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {c.nombre_completo}
                  </h3>
                  <p className="text-xs font-medium text-teal-700 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    {c.nombre_empresa}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    c.status === 'activo'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'en_consulta'
                      ? 'bg-amber-100 text-amber-800'
                      : c.status === 'en_legalizacion'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              {/* Industry badge */}
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-50 text-slate-600 border border-slate-100 font-medium">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {c.industria}
                </span>
              </div>

              {/* Address */}
              <div className="text-xs text-slate-500 flex items-start gap-1.5 line-clamp-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{c.direccion}</span>
              </div>

              {/* Services offered snippet */}
              <div className="bg-teal-50/60 p-2.5 rounded-lg border border-teal-100/60 text-xs">
                <div className="font-semibold text-teal-900 flex items-center gap-1 mb-1">
                  <Briefcase className="w-3 h-3 text-teal-600" />
                  Servicios que ofrece:
                </div>
                <p className="text-teal-800 text-[11px] line-clamp-2 leading-relaxed">
                  {c.servicios_ofrecidos || 'No especificados.'}
                </p>
              </div>
            </div>

            {/* Direct contact bar */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(c.telefono)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Contactar por WhatsApp"
                  className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>

                {/* Call */}
                <a
                  href={`tel:${c.telefono}`}
                  title="Llamar directamente"
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${c.email}`}
                  title="Enviar correo"
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white transition shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* View dossier */}
              <button
                onClick={() => setViewingCliente(c)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver Ficha
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            No se encontraron emprendedores coincidentes con los criterios de búsqueda.
          </div>
        )}
      </div>

      {/* Modal: Ficha Detallada del Emprendedor */}
      {viewingCliente && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingCliente(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {viewingCliente.identificacion}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {viewingCliente.nombre_completo}
              </h3>
              <p className="text-sm font-medium text-teal-700">
                {viewingCliente.nombre_empresa} &bull; <span className="text-slate-500">{viewingCliente.industria}</span>
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Teléfono</span>
                  <span className="font-semibold text-slate-900">{viewingCliente.telefono}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Correo Electrónico</span>
                  <span className="font-semibold text-slate-900 truncate block">{viewingCliente.email}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dirección Física</span>
                <span className="text-slate-800">{viewingCliente.direccion}</span>
              </div>

              <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100">
                <span className="text-teal-900 block text-[10px] uppercase font-semibold">Portafolio / Catálogo de Servicios</span>
                <p className="mt-1 text-slate-800 leading-relaxed font-medium">
                  {viewingCliente.servicios_ofrecidos}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">Fecha de Registro en Código-58</span>
                <span className="font-semibold text-slate-700">{viewingCliente.fecha_registro}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2 justify-end">
              <button
                onClick={() => setViewingCliente(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cerrar
              </button>
              <a
                href={`https://wa.me/${cleanPhoneForWhatsApp(viewingCliente.telefono)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
