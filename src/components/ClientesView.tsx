import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cliente, ClienteStatus } from '../types';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  Search,
  Check,
  X,
  Clock,
  Send,
  Building,
} from 'lucide-react';

export const ClientesView: React.FC = () => {
  const {
    clientes,
    addCliente,
    updateCliente,
    deleteCliente,
    interacciones,
    addInteraccion,
    currentUser,
  } = useApp();

  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'interaction' | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Form state for client
  const [formData, setFormData] = useState({
    identificacion: '',
    nombre_completo: '',
    email: '',
    telefono: '',
    direccion: '',
    nombre_empresa: '',
    servicios_ofrecidos: '',
    industria: '',
    status: 'prospecto' as ClienteStatus,
  });

  // Form state for interaction
  const [interactionData, setInteractionData] = useState({
    tipo: 'Llamada telefónica',
    canal: 'Teléfono',
    descripcion: '',
    seguimiento: false,
  });

  const filtered = clientes.filter(
    c =>
      c.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
      c.identificacion.toLowerCase().includes(search.toLowerCase()) ||
      c.nombre_empresa.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setFormData({
      identificacion: '',
      nombre_completo: '',
      email: '',
      telefono: '',
      direccion: '',
      nombre_empresa: '',
      servicios_ofrecidos: '',
      industria: 'Tecnología',
      status: 'prospecto',
    });
    setModalMode('create');
  };

  const handleOpenEdit = (c: Cliente) => {
    setSelectedCliente(c);
    setFormData({
      identificacion: c.identificacion,
      nombre_completo: c.nombre_completo,
      email: c.email,
      telefono: c.telefono,
      direccion: c.direccion,
      nombre_empresa: c.nombre_empresa,
      servicios_ofrecidos: c.servicios_ofrecidos,
      industria: c.industria,
      status: c.status,
    });
    setModalMode('edit');
  };

  const handleSaveCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo || !formData.email) {
      alert('Por favor complete el nombre y correo electrónico');
      return;
    }

    if (modalMode === 'create') {
      addCliente(formData);
    } else if (modalMode === 'edit' && selectedCliente) {
      updateCliente(selectedCliente.id, formData);
    }
    setModalMode(null);
  };

  const handleSaveInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente || !interactionData.descripcion) return;

    addInteraccion({
      cliente_id: selectedCliente.id,
      usuario_id: currentUser.id,
      tipo: interactionData.tipo,
      canal: interactionData.canal,
      descripcion: interactionData.descripcion,
      seguimiento: interactionData.seguimiento,
    });

    setInteractionData({
      tipo: 'Llamada telefónica',
      canal: 'Teléfono',
      descripcion: '',
      seguimiento: false,
    });
    setModalMode(null);
  };

  return (
    <div id="clientes-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Gestión de Emprendedores
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Expedientes integrales, estado del emprendimiento y registro de interacciones comerciales.
          </p>
        </div>
        <button
          id="btn-nuevo-cliente"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161938] hover:bg-[#1E224F] text-white text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          Registrar Emprendedor
        </button>
      </div>

      {/* Filter and stats */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cédula, nombre, empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total: <span className="font-bold text-slate-900">{filtered.length}</span> registros
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-4">Identificación</th>
              <th className="p-4">Emprendedor & Empresa</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Industria</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition">
                <td className="p-4 font-mono font-medium text-slate-700">{c.identificacion || 'S/N'}</td>
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{c.nombre_completo}</div>
                  <div className="text-xs text-teal-700 flex items-center gap-1 font-medium">
                    <Building className="w-3 h-3" />
                    {c.nombre_empresa}
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-600 space-y-0.5">
                  <div>{c.telefono}</div>
                  <div className="text-slate-400 truncate max-w-xs">{c.email}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                    {c.industria}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={c.status}
                    onChange={e => updateCliente(c.id, { status: e.target.value as ClienteStatus })}
                    className="text-xs font-semibold rounded-lg px-2.5 py-1 border border-slate-200 bg-white cursor-pointer focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="prospecto">Prospecto</option>
                    <option value="activo">Activo</option>
                    <option value="en_consulta">En Consulta</option>
                    <option value="en_legalizacion">En Legalización</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button
                    title="Bitácora de interacciones"
                    onClick={() => {
                      setSelectedCliente(c);
                      setModalMode('interaction');
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    title="Editar expediente"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => {
                      if (window.confirm(`¿Está seguro de eliminar a ${c.nombre_completo}?`)) {
                        deleteCliente(c.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create/Edit Cliente */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              {modalMode === 'create' ? 'Registrar Nuevo Emprendedor' : 'Editar Expediente de Emprendedor'}
            </h3>

            <form onSubmit={handleSaveCliente} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cédula / RIF</label>
                  <input
                    type="text"
                    required
                    placeholder="V-12345678 o J-12345678-0"
                    value={formData.identificacion}
                    onChange={e => setFormData({ ...formData, identificacion: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido"
                    value={formData.nombre_completo}
                    onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    placeholder="+58 412-1234567"
                    value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre de la Empresa / Proyecto</label>
                  <input
                    type="text"
                    placeholder="Ej. Soluciones Digitales 58"
                    value={formData.nombre_empresa}
                    onChange={e => setFormData({ ...formData, nombre_empresa: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Industria</label>
                  <select
                    value={formData.industria}
                    onChange={e => setFormData({ ...formData, industria: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Tecnología">Tecnología e Innovación</option>
                    <option value="Legal y Fiscal">Legal y Fiscal</option>
                    <option value="Publicidad y Creatividad">Publicidad y Creatividad</option>
                    <option value="Agroindustria">Agroindustria</option>
                    <option value="Comercio y Retail">Comercio y Retail</option>
                    <option value="Servicios Profesionales">Servicios Profesionales</option>
                    <option value="Gastronomía">Gastronomía y Alimentos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dirección Física</label>
                <input
                  type="text"
                  placeholder="Ciudad, zona, calle, edificio u oficina"
                  value={formData.direccion}
                  onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Servicios que Ofrece (Portafolio)</label>
                <textarea
                  rows={2}
                  placeholder="Detalle los servicios que ofrece el emprendedor a sus clientes..."
                  value={formData.servicios_ofrecidos}
                  onChange={e => setFormData({ ...formData, servicios_ofrecidos: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#161938] hover:bg-[#1E224F] text-white rounded-lg font-semibold"
                >
                  Guardar Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Interacción */}
      {modalMode === 'interaction' && selectedCliente && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Bitácora de Interacciones: {selectedCliente.nombre_completo}
              </h3>
              <p className="text-xs text-slate-500">{selectedCliente.nombre_empresa}</p>
            </div>

            {/* List of existing interactions */}
            <div className="space-y-2 max-h-48 overflow-y-auto border-y border-slate-100 py-3">
              {interacciones
                .filter(i => i.cliente_id === selectedCliente.id)
                .map(i => (
                  <div key={i.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{i.tipo} ({i.canal})</span>
                      <span className="text-[10px] text-slate-400">{i.fecha_hora}</span>
                    </div>
                    <p className="text-slate-600">{i.descripcion}</p>
                  </div>
                ))}
              {interacciones.filter(i => i.cliente_id === selectedCliente.id).length === 0 && (
                <div className="text-center text-xs text-slate-400 py-3">
                  No hay interacciones registradas aún para este cliente.
                </div>
              )}
            </div>

            {/* Form to add interaction */}
            <form onSubmit={handleSaveInteraction} className="space-y-3 text-xs pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipo</label>
                  <select
                    value={interactionData.tipo}
                    onChange={e => setInteractionData({ ...interactionData, tipo: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Llamada telefónica">Llamada telefónica</option>
                    <option value="WhatsApp">Mensaje WhatsApp</option>
                    <option value="Reunión Presencial">Reunión Presencial</option>
                    <option value="Videollamada">Videollamada</option>
                    <option value="Email">Correo Electrónico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Canal</label>
                  <input
                    type="text"
                    value={interactionData.canal}
                    onChange={e => setInteractionData({ ...interactionData, canal: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notas de la conversación</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle los acuerdos, dudas o seguimiento requerido..."
                  value={interactionData.descripcion}
                  onChange={e => setInteractionData({ ...interactionData, descripcion: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Registrar Interacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
