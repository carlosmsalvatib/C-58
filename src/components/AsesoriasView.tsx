import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Asesoria, AsesoriaTipo, AsesoriaStatus, FormularioDiagnostico } from '../types';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  X,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export const AsesoriasView: React.FC = () => {
  const {
    asesorias,
    addAsesoria,
    updateAsesoria,
    clientes,
    currentUser,
    diagnosticos,
    saveDiagnostico,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'lista' | 'fdi'>('lista');
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [fdiModalClienteId, setFdiModalClienteId] = useState<number | null>(null);

  // New Asesoria form
  const [newAsesoria, setNewAsesoria] = useState({
    cliente_id: clientes[0]?.id || 1,
    tipo: 'diagnostico' as AsesoriaTipo,
    fecha_programada: new Date(Date.now() + 86400000).toISOString().substring(0, 16).replace('T', ' '),
    duracion_minutos: 60,
    tema: '',
    observaciones: '',
  });

  // FDI form state
  const [fdiData, setFdiData] = useState<Partial<FormularioDiagnostico>>({});

  const handleOpenFDI = (clienteId: number) => {
    const existing = diagnosticos.find(d => d.cliente_id === clienteId);
    if (existing) {
      setFdiData(existing);
    } else {
      setFdiData({
        cliente_id: clienteId,
        motivacion: '',
        experiencia: '',
        disponibilidad: 'Tiempo completo',
        descripcion_negocio: '',
        problema_resuelve: '',
        publico_objetivo: '',
        propuesta_valor: '',
        competidores: '',
        diferenciacion: '',
        tamano_mercado: '',
        inversion_inicial: 1000,
        punto_equilibrio: 500,
        proyeccion_ventas: '',
        estructura_propuesta: '',
        recursos_necesarios: '',
        recomendaciones: '',
        status: 'completado',
      });
    }
    setFdiModalClienteId(clienteId);
  };

  const handleSaveFDI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fdiModalClienteId) return;
    saveDiagnostico({ ...fdiData, cliente_id: fdiModalClienteId });
    setFdiModalClienteId(null);
    alert('Formulario de Diagnóstico Inicial guardado exitosamente.');
  };

  const handleCreateAsesoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsesoria.tema) {
      alert('Por favor ingrese el tema de la asesoría');
      return;
    }

    addAsesoria({
      cliente_id: Number(newAsesoria.cliente_id),
      consultor_id: currentUser.id,
      tipo: newAsesoria.tipo,
      fecha_programada: newAsesoria.fecha_programada,
      fecha_realizada: null,
      duracion_minutos: Number(newAsesoria.duracion_minutos),
      tema: newAsesoria.tema,
      observaciones: newAsesoria.observaciones,
      status: 'programada',
    });

    setNewAsesoria({
      cliente_id: clientes[0]?.id || 1,
      tipo: 'diagnostico',
      fecha_programada: new Date(Date.now() + 86400000).toISOString().substring(0, 16).replace('T', ' '),
      duracion_minutos: 60,
      tema: '',
      observaciones: '',
    });
    setModalNewOpen(false);
  };

  return (
    <div id="asesorias-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Asesorías y Diagnóstico
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Agenda de consultoría empresarial, seguimiento estratégico y Formularios de Diagnóstico Inicial (FDI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-nueva-asesoria"
            onClick={() => setModalNewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161938] hover:bg-[#1E224F] text-white text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            Programar Asesoría
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('lista')}
          className={`pb-3 border-b-2 transition ${
            activeSubTab === 'lista'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Agenda de Sesiones ({asesorias.length})
        </button>
        <button
          onClick={() => setActiveSubTab('fdi')}
          className={`pb-3 border-b-2 transition ${
            activeSubTab === 'fdi'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Formularios de Diagnóstico (FDI) ({diagnosticos.length})
        </button>
      </div>

      {/* View 1: Agenda de Asesorías */}
      {activeSubTab === 'lista' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {asesorias.map(as => {
              const cliente = clientes.find(c => c.id === as.cliente_id);
              return (
                <div
                  key={as.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {as.tipo}
                      </span>
                      <select
                        value={as.status}
                        onChange={e =>
                          updateAsesoria(as.id, {
                            status: e.target.value as AsesoriaStatus,
                            fecha_realizada:
                              e.target.value === 'realizada'
                                ? new Date().toISOString().substring(0, 16).replace('T', ' ')
                                : null,
                          })
                        }
                        className={`text-[11px] font-semibold rounded-lg px-2 py-0.5 border cursor-pointer ${
                          as.status === 'realizada'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : as.status === 'programada'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="programada">PROGRAMADA</option>
                        <option value="realizada">REALIZADA</option>
                        <option value="cancelada">CANCELADA</option>
                      </select>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{as.tema}</h4>

                    <div className="text-xs text-slate-600">
                      Emprendedor: <b>{cliente?.nombre_completo}</b>
                      <span className="block text-slate-400 font-normal">{cliente?.nombre_empresa}</span>
                    </div>

                    {as.observaciones && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {as.observaciones}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {as.fecha_programada} ({as.duracion_minutos} min)
                    </div>
                    {cliente && (
                      <button
                        onClick={() => handleOpenFDI(cliente.id)}
                        className="text-teal-700 hover:text-teal-900 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        FDI
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: FDI Diagnostics Catalog */}
      {activeSubTab === 'fdi' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Formularios de Diagnóstico Inicial (FDI)
              </h3>
              <p className="text-xs text-slate-500">
                Evaluación cualitativa y cuantitativa de modelos de negocios y viabilidad económica.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {clientes.map(cl => {
              const diag = diagnosticos.find(d => d.cliente_id === cl.id);
              return (
                <div key={cl.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{cl.nombre_completo}</span>
                      <span className="text-xs text-slate-400">({cl.nombre_empresa})</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-mono">
                        {cl.identificacion}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {diag ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          FDI Completado &bull; Fecha: {diag.fecha_aplicacion} &bull; Inversión proyectada: ${diag.inversion_inicial || 0}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">FDI Pendiente por aplicar</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenFDI(cl.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      diag
                        ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                        : 'bg-[#161938] text-white hover:bg-[#1E224F]'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    {diag ? 'Ver / Editar FDI' : 'Aplicar Diagnóstico'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: New Asesoria */}
      {modalNewOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalNewOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Programar Sesión de Consultoría</h3>

            <form onSubmit={handleCreateAsesoria} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emprendedor</label>
                <select
                  value={newAsesoria.cliente_id}
                  onChange={e => setNewAsesoria({ ...newAsesoria, cliente_id: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_completo} ({c.nombre_empresa})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Sesión</label>
                  <select
                    value={newAsesoria.tipo}
                    onChange={e => setNewAsesoria({ ...newAsesoria, tipo: e.target.value as AsesoriaTipo })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="diagnostico">Diagnóstico Inicial</option>
                    <option value="seguimiento">Seguimiento</option>
                    <option value="cierre">Cierre y Entrega</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    value={newAsesoria.duracion_minutos}
                    onChange={e => setNewAsesoria({ ...newAsesoria, duracion_minutos: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha y Hora Programada</label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD HH:MM"
                  value={newAsesoria.fecha_programada}
                  onChange={e => setNewAsesoria({ ...newAsesoria, fecha_programada: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tema Principal</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Revisión de modelo Canvas y estructura societaria"
                  value={newAsesoria.tema}
                  onChange={e => setNewAsesoria({ ...newAsesoria, tema: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observaciones Previas</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre documentos a consignar o enfoque de la sesión..."
                  value={newAsesoria.observaciones}
                  onChange={e => setNewAsesoria({ ...newAsesoria, observaciones: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNewOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#161938] hover:bg-[#1E224F] text-white rounded-lg font-semibold"
                >
                  Agendar Asesoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Formulario Diagnostico Inicial (FDI) */}
      {fdiModalClienteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setFdiModalClienteId(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                Código-58 &bull; Consultoría Estratégica
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Formulario de Diagnóstico Inicial (FDI)
              </h3>
              <p className="text-xs text-slate-500">
                Cliente:{' '}
                <b>{clientes.find(c => c.id === fdiModalClienteId)?.nombre_completo}</b> (
                {clientes.find(c => c.id === fdiModalClienteId)?.nombre_empresa})
              </p>
            </div>

            <form onSubmit={handleSaveFDI} className="space-y-4 text-xs">
              {/* Sección 1 */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  1. Perfil del Emprendedor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Motivación</label>
                    <input
                      type="text"
                      value={fdiData.motivacion || ''}
                      onChange={e => setFdiData({ ...fdiData, motivacion: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      placeholder="Ej. Independencia"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Experiencia</label>
                    <input
                      type="text"
                      value={fdiData.experiencia || ''}
                      onChange={e => setFdiData({ ...fdiData, experiencia: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      placeholder="Ej. 5 años en el sector"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Disponibilidad</label>
                    <input
                      type="text"
                      value={fdiData.disponibilidad || ''}
                      onChange={e => setFdiData({ ...fdiData, disponibilidad: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      placeholder="Ej. Tiempo completo"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2 */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  2. Idea de Negocio & Propuesta de Valor
                </h4>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Descripción del Negocio</label>
                  <textarea
                    rows={2}
                    value={fdiData.descripcion_negocio || ''}
                    onChange={e => setFdiData({ ...fdiData, descripcion_negocio: e.target.value })}
                    className="w-full p-1.5 border border-slate-200 rounded bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Problema que Resuelve</label>
                    <input
                      type="text"
                      value={fdiData.problema_resuelve || ''}
                      onChange={e => setFdiData({ ...fdiData, problema_resuelve: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Propuesta de Valor</label>
                    <input
                      type="text"
                      value={fdiData.propuesta_valor || ''}
                      onChange={e => setFdiData({ ...fdiData, propuesta_valor: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3 & 4 */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  3. Finanzas y Proyección
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Inversión Inicial ($)</label>
                    <input
                      type="number"
                      value={fdiData.inversion_inicial || 0}
                      onChange={e => setFdiData({ ...fdiData, inversion_inicial: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Punto de Equilibrio Estimado ($)</label>
                    <input
                      type="number"
                      value={fdiData.punto_equilibrio || 0}
                      onChange={e => setFdiData({ ...fdiData, punto_equilibrio: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 5 */}
              <div className="p-3 bg-teal-50/50 rounded-xl space-y-2 border border-teal-100">
                <h4 className="font-bold text-teal-900 text-xs uppercase tracking-wide">
                  4. Recomendaciones del Consultor
                </h4>
                <textarea
                  rows={3}
                  value={fdiData.recomendaciones || ''}
                  onChange={e => setFdiData({ ...fdiData, recomendaciones: e.target.value })}
                  placeholder="Plan de acción sugerido: registro mercantil, permisología, estrategia comercial..."
                  className="w-full p-2 border border-teal-200 rounded bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFdiModalClienteId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold"
                >
                  Guardar FDI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
