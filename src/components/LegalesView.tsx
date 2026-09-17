import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProcesoLegal, ProcesoLegalStatus, DocumentoLegal } from '../types';
import {
  Scale,
  Plus,
  FileCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  Clock,
  X,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

export const LegalesView: React.FC = () => {
  const {
    procesosLegales,
    addProcesoLegal,
    updateProcesoLegal,
    documentosLegales,
    addDocumentoLegal,
    updateDocumentoStatus,
    clientes,
    currentUser,
  } = useApp();

  const [modalNewProceso, setModalNewProceso] = useState(false);
  const [selectedProcesoForDocs, setSelectedProcesoForDocs] = useState<ProcesoLegal | null>(null);

  // New legal process state
  const [newProceso, setNewProceso] = useState({
    cliente_id: clientes[0]?.id || 1,
    tipo_proceso: 'Registro de Marca',
    nombre_comercial: '',
    documento_identidad: '',
    estado: 'Ingreso inicial de expediente',
    observaciones: '',
    status: 'pendiente' as ProcesoLegalStatus,
  });

  // New doc state
  const [newDocData, setNewDocData] = useState({
    tipo_documento: 'Acta Constitutiva',
    nombre_archivo: '',
  });

  const handleCreateProceso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProceso.nombre_comercial) {
      alert('Ingrese el nombre comercial o denominación jurídica');
      return;
    }

    const cliente = clientes.find(c => c.id === Number(newProceso.cliente_id));

    addProcesoLegal({
      cliente_id: Number(newProceso.cliente_id),
      gestor_id: currentUser.id,
      tipo_proceso: newProceso.tipo_proceso,
      nombre_comercial: newProceso.nombre_comercial,
      documento_identidad: newProceso.documento_identidad || cliente?.identificacion || 'V-00000000',
      estado: newProceso.estado,
      observaciones: newProceso.observaciones,
      status: newProceso.status,
    });

    setModalNewProceso(false);
    setNewProceso({
      cliente_id: clientes[0]?.id || 1,
      tipo_proceso: 'Registro de Marca',
      nombre_comercial: '',
      documento_identidad: '',
      estado: 'Ingreso inicial de expediente',
      observaciones: '',
      status: 'pendiente',
    });
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProcesoForDocs || !newDocData.nombre_archivo) return;

    addDocumentoLegal({
      proceso_legal_id: selectedProcesoForDocs.id,
      tipo_documento: newDocData.tipo_documento,
      nombre_archivo: newDocData.nombre_archivo.endsWith('.pdf')
        ? newDocData.nombre_archivo
        : `${newDocData.nombre_archivo}.pdf`,
      ruta_archivo: `/uploads/legales/${newDocData.nombre_archivo}`,
      usuario_id_subio: currentUser.id,
      status: 'pendiente_revision',
    });

    setNewDocData({
      tipo_documento: 'Acta Constitutiva',
      nombre_archivo: '',
    });
  };

  return (
    <div id="legales-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-teal-600" />
            Gestión de Procesos Legales
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Control de formalización mercantil, registros ante el SAPI, redacción estatutaria y custodia documental.
          </p>
        </div>

        <button
          id="btn-nuevo-tramite-legal"
          onClick={() => setModalNewProceso(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161938] hover:bg-[#1E224F] text-white text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          Nuevo Trámite Legal
        </button>
      </div>

      {/* Grid of Legal Processes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {procesosLegales.map(pl => {
          const cliente = clientes.find(c => c.id === pl.cliente_id);
          const docs = documentosLegales.filter(d => d.proceso_legal_id === pl.id);

          return (
            <div
              key={pl.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {pl.tipo_proceso}
                  </span>
                  <select
                    value={pl.status}
                    onChange={e =>
                      updateProcesoLegal(pl.id, {
                        status: e.target.value as ProcesoLegalStatus,
                        fecha_finalizacion:
                          e.target.value === 'completado'
                            ? new Date().toISOString().substring(0, 10)
                            : null,
                      })
                    }
                    className={`text-[11px] font-semibold rounded-lg px-2 py-0.5 border cursor-pointer ${
                      pl.status === 'completado'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : pl.status === 'en_proceso'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : pl.status === 'pendiente'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <option value="pendiente">PENDIENTE</option>
                    <option value="en_proceso">EN PROCESO</option>
                    <option value="completado">COMPLETADO</option>
                    <option value="rechazado">RECHAZADO</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{pl.nombre_comercial}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Titular: <b>{cliente?.nombre_completo}</b> &bull; RIF/CI: {pl.documento_identidad}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Estado Procesal
                  </div>
                  <div className="font-medium text-slate-800">{pl.estado}</div>
                </div>

                {pl.observaciones && (
                  <p className="text-[11px] text-slate-500 italic line-clamp-2">
                    {pl.observaciones}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Inicio: {pl.fecha_inicio}</span>
                <button
                  onClick={() => setSelectedProcesoForDocs(pl)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Expediente ({docs.length} docs)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Legal Process */}
      {modalNewProceso && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalNewProceso(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Aperturar Trámite Jurídico</h3>

            <form onSubmit={handleCreateProceso} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emprendedor Titular</label>
                <select
                  value={newProceso.cliente_id}
                  onChange={e => setNewProceso({ ...newProceso, cliente_id: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_completo} ({c.identificacion}) - {c.nombre_empresa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Trámite</label>
                  <select
                    value={newProceso.tipo_proceso}
                    onChange={e => setNewProceso({ ...newProceso, tipo_proceso: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Registro de Marca">Registro de Marca (SAPI)</option>
                    <option value="Constitución C.A.">Constitución C.A. (Registro Mercantil)</option>
                    <option value="Firma Personal">Firma Personal</option>
                    <option value="Modificación Estatutos">Modificación de Estatutos</option>
                    <option value="Permisología Sanitaria">Permisología Sanitaria</option>
                    <option value="RACDA y Ambiente">RACDA y Permisos Ambientales</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cédula / RIF Asociado</label>
                  <input
                    type="text"
                    placeholder="V-18234567"
                    value={newProceso.documento_identidad}
                    onChange={e => setNewProceso({ ...newProceso, documento_identidad: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Denominación o Nombre Comercial</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Inversiones y Servicios Código 58 C.A."
                  value={newProceso.nombre_comercial}
                  onChange={e => setNewProceso({ ...newProceso, nombre_comercial: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fase / Estado Inicial</label>
                <input
                  type="text"
                  placeholder="Ej. Búsqueda fonética aprobada / En redacción estatutaria"
                  value={newProceso.estado}
                  onChange={e => setNewProceso({ ...newProceso, estado: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observaciones Jurídicas</label>
                <textarea
                  rows={2}
                  placeholder="Notas internas, requisitos por consignar..."
                  value={newProceso.observaciones}
                  onChange={e => setNewProceso({ ...newProceso, observaciones: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNewProceso(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#161938] hover:bg-[#1E224F] text-white rounded-lg font-semibold"
                >
                  Registrar Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Expediente y Documentos Legales */}
      {selectedProcesoForDocs && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProcesoForDocs(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Expediente Digital
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Documentos de {selectedProcesoForDocs.nombre_comercial}
              </h3>
              <p className="text-xs text-slate-500">{selectedProcesoForDocs.tipo_proceso}</p>
            </div>

            {/* List of documents */}
            <div className="space-y-2 border-y border-slate-100 py-3">
              {documentosLegales
                .filter(d => d.proceso_legal_id === selectedProcesoForDocs.id)
                .map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {doc.tipo_documento}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{doc.nombre_archivo}</div>
                      <div className="text-[10px] text-slate-400">Subido: {doc.fecha_subida}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={doc.status}
                        onChange={e =>
                          updateDocumentoStatus(
                            doc.id,
                            e.target.value as DocumentoLegal['status']
                          )
                        }
                        className={`text-[11px] font-semibold rounded-lg px-2 py-1 border ${
                          doc.status === 'aprobado'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : doc.status === 'pendiente_revision'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="borrador">Borrador</option>
                        <option value="pendiente_revision">Pendiente Revisión</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </div>
                  </div>
                ))}

              {documentosLegales.filter(d => d.proceso_legal_id === selectedProcesoForDocs.id)
                .length === 0 && (
                <div className="text-center text-xs text-slate-400 py-4">
                  No hay documentos adjuntos en este expediente.
                </div>
              )}
            </div>

            {/* Form to attach new document */}
            <form onSubmit={handleAddDoc} className="space-y-3 text-xs pt-1">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                Adjuntar Nuevo Recaudo
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Tipo de Documento</label>
                  <select
                    value={newDocData.tipo_documento}
                    onChange={e => setNewDocData({ ...newDocData, tipo_documento: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Acta Constitutiva">Acta Constitutiva</option>
                    <option value="Solicitud SAPI FP-01">Solicitud SAPI FP-01</option>
                    <option value="Copia Cédula y RIF">Copia Cédula y RIF</option>
                    <option value="Balance de Apertura">Balance de Apertura</option>
                    <option value="Carta de Aceptación Comisario">Carta Aceptación Comisario</option>
                    <option value="Memoria Descriptiva RACDA">Memoria Descriptiva RACDA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Nombre del Archivo</label>
                  <input
                    type="text"
                    required
                    placeholder="expediente_firmado.pdf"
                    value={newDocData.nombre_archivo}
                    onChange={e => setNewDocData({ ...newDocData, nombre_archivo: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProcesoForDocs(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Adjuntar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
