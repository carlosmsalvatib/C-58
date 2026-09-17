import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  Building,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const CmsView: React.FC = () => {
  const {
    modulos,
    toggleModulo,
    servicios,
    addServicio,
    toggleServicio,
    config,
    updateConfig,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'modulos' | 'servicios' | 'empresa'>('modulos');
  const [companyForm, setCompanyForm] = useState(config);
  const [savedNotice, setSavedNotice] = useState(false);

  // New service form
  const [newService, setNewService] = useState({
    nombre: '',
    categoria: 'Legal y Corporativo',
    descripcion: '',
    activo: true,
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(companyForm);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.nombre) return;
    addServicio(newService);
    setNewService({
      nombre: '',
      categoria: 'Legal y Corporativo',
      descripcion: '',
      activo: true,
    });
  };

  return (
    <div id="cms-view" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600" />
          CMS & Configuración del Sistema
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Control de activación de módulos, catálogo oficial de servicios y parámetros institucionales de Código-58.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('modulos')}
          className={`pb-3 border-b-2 transition ${
            activeSubTab === 'modulos'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Módulos del Sistema ({modulos.length})
        </button>
        <button
          onClick={() => setActiveSubTab('servicios')}
          className={`pb-3 border-b-2 transition ${
            activeSubTab === 'servicios'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Catálogo de Servicios ({servicios.length})
        </button>
        <button
          onClick={() => setActiveSubTab('empresa')}
          className={`pb-3 border-b-2 transition ${
            activeSubTab === 'empresa'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Parámetros Corporativos
        </button>
      </div>

      {/* Subtab 1: Módulos del Sistema */}
      {activeSubTab === 'modulos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            Habilite o deshabilite los módulos del sistema en tiempo real. Los módulos inactivos se ocultan de la barra de navegación lateral.
          </div>
          {modulos.map(m => (
            <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{m.nombre}</span>
                  <span className="text-xs font-mono text-slate-400">({m.slug})</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      m.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {m.activo ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{m.descripcion}</p>
                <p className="text-[11px] text-teal-700 mt-1">
                  Roles con acceso: <span className="font-mono">{m.roles_permitidos}</span>
                </p>
              </div>

              <button
                onClick={() => toggleModulo(m.id)}
                className={`p-2 rounded-lg transition ${
                  m.activo ? 'text-teal-600 hover:bg-teal-50' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                {m.activo ? (
                  <ToggleRight className="w-8 h-8 text-teal-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 2: Catálogo de Servicios */}
      {activeSubTab === 'servicios' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-teal-600" />
              Agregar Nuevo Servicio al Catálogo
            </h3>
            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre del Servicio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Auditoría de Cumplimiento Legal y Tributario"
                    value={newService.nombre}
                    onChange={e => setNewService({ ...newService, nombre: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                  <select
                    value={newService.categoria}
                    onChange={e => setNewService({ ...newService, categoria: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Legal y Corporativo">Legal y Corporativo</option>
                    <option value="Finanzas y Tributos">Finanzas y Tributos</option>
                    <option value="Tecnología e Innovación">Tecnología e Innovación</option>
                    <option value="Marketing y Ventas">Marketing y Ventas</option>
                    <option value="Consultoría Estratégica">Consultoría Estratégica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descripción</label>
                <input
                  type="text"
                  placeholder="Detalle alcance y entregables del servicio..."
                  value={newService.descripcion}
                  onChange={e => setNewService({ ...newService, descripcion: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#161938] hover:bg-[#1E224F] text-white rounded-lg font-semibold"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {servicios.map(s => (
              <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{s.nombre}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {s.categoria}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{s.descripcion}</p>
                </div>

                <button
                  onClick={() => toggleServicio(s.id)}
                  className={`p-2 rounded-lg transition ${
                    s.activo ? 'text-teal-600' : 'text-slate-400'
                  }`}
                >
                  {s.activo ? (
                    <ToggleRight className="w-8 h-8 text-teal-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Parámetros Corporativos */}
      {activeSubTab === 'empresa' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          {savedNotice && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Parámetros corporativos guardados y actualizados exitosamente.
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={companyForm.nombre_empresa}
                  onChange={e => setCompanyForm({ ...companyForm, nombre_empresa: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título de la Plataforma</label>
                <input
                  type="text"
                  value={companyForm.sistema_titulo}
                  onChange={e => setCompanyForm({ ...companyForm, sistema_titulo: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lema Corporativo</label>
              <input
                type="text"
                value={companyForm.lema}
                onChange={e => setCompanyForm({ ...companyForm, lema: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email de Contacto</label>
                <input
                  type="email"
                  value={companyForm.email_contacto}
                  onChange={e => setCompanyForm({ ...companyForm, email_contacto: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teléfono Principal</label>
                <input
                  type="text"
                  value={companyForm.telefono_contacto}
                  onChange={e => setCompanyForm({ ...companyForm, telefono_contacto: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Dirección de Oficina</label>
              <input
                type="text"
                value={companyForm.direccion_oficina}
                onChange={e => setCompanyForm({ ...companyForm, direccion_oficina: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Días Plazo Trámites Legales</label>
                <input
                  type="number"
                  value={companyForm.dias_plazo_legal}
                  onChange={e => setCompanyForm({ ...companyForm, dias_plazo_legal: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Porcentaje Anticipo Requerido (%)</label>
                <input
                  type="number"
                  value={companyForm.porcentaje_anticipo}
                  onChange={e => setCompanyForm({ ...companyForm, porcentaje_anticipo: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Configuración
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
