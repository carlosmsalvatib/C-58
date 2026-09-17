import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  Scale,
  FileCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Briefcase,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    clientes,
    asesorias,
    procesosLegales,
    contratos,
    pagos,
    interacciones,
    setActiveTab,
  } = useApp();

  // Metrics calculation
  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(c => c.status === 'activo').length;
  const clientesEnLegal = clientes.filter(c => c.status === 'en_legalizacion').length;
  const clientesEnConsulta = clientes.filter(c => c.status === 'en_consulta').length;

  const totalAsesorias = asesorias.length;
  const asesoriasRealizadas = asesorias.filter(a => a.status === 'realizada').length;
  const asesoriasProgramadas = asesorias.filter(a => a.status === 'programada').length;

  const totalProcesos = procesosLegales.length;
  const procesosEnCurso = procesosLegales.filter(p => p.status === 'en_proceso').length;
  const procesosPendientes = procesosLegales.filter(p => p.status === 'pendiente').length;

  const montoTotalContratos = contratos.reduce((acc, c) => acc + Number(c.monto_total), 0);
  const totalPagado = pagos
    .filter(p => p.status === 'verificado')
    .reduce((acc, p) => acc + Number(p.monto), 0);
  const saldoPendienteTotal = montoTotalContratos - totalPagado;

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#161938] via-[#1E224F] to-[#0D9488] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Rol Activo: {currentUser.rol.toUpperCase()}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bienvenido, {currentUser.nombre}
          </h2>
          <p className="mt-1 text-slate-300 text-sm">
            Panel de control ejecutivo de Código-58. Supervise diagnósticos, gestión legal y recaudación en tiempo real.
          </p>
        </div>

        {/* Quick action buttons in banner */}
        <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
          <button
            id="dash-action-new-client"
            onClick={() => setActiveTab('clientes')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Nuevo Emprendedor
          </button>
          <button
            id="dash-action-new-asesoria"
            onClick={() => setActiveTab('asesorias')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition backdrop-blur-sm"
          >
            <Calendar className="w-4 h-4" />
            Programar Asesoría
          </button>
          <button
            id="dash-action-view-contracts"
            onClick={() => setActiveTab('contratos')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition backdrop-blur-sm"
          >
            <DollarSign className="w-4 h-4" />
            Ver Cobros y Pagos
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Emprendedores */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Emprendedores
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalClientes}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {clientesActivos} activos
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2">
            <span>En consulta: <b>{clientesEnConsulta}</b></span>
            <span>Legalización: <b>{clientesEnLegal}</b></span>
          </div>
        </div>

        {/* Asesorías */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Asesorías
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalAsesorias}</span>
            <span className="text-xs text-teal-600 font-medium">
              {asesoriasProgramadas} pendientes
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2">
            <span>Completadas: <b>{asesoriasRealizadas}</b></span>
            <span className="text-teal-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('asesorias')}>
              Ver agenda &rarr;
            </span>
          </div>
        </div>

        {/* Procesos Legales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Procesos Legales
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalProcesos}</span>
            <span className="text-xs text-indigo-600 font-medium">
              {procesosEnCurso} en curso
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2">
            <span>Pendientes: <b>{procesosPendientes}</b></span>
            <span className="text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('legales')}>
              Revisar &rarr;
            </span>
          </div>
        </div>

        {/* Facturación / Cobranza */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recaudación ($)
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">${totalPagado.toLocaleString()}</span>
            <span className="text-xs text-amber-600 font-medium">
              de ${montoTotalContratos.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2">
            <span>Por cobrar: <b>${saldoPendienteTotal.toLocaleString()}</b></span>
            <span className="text-emerald-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('contratos')}>
              Ver pagos &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Operational status & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Próximas Asesorías y Trámites Legales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Próximas Asesorías */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-800">Próximas Sesiones de Consultoría</h3>
              </div>
              <button
                onClick={() => setActiveTab('asesorias')}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                Ver todas ({asesorias.length})
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {asesorias.slice(0, 4).map(as => {
                const cliente = clientes.find(c => c.id === as.cliente_id);
                return (
                  <div key={as.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {cliente?.nombre_completo || 'Emprendedor'}
                        </span>
                        <span className="text-xs text-slate-400">({cliente?.nombre_empresa})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            as.status === 'realizada'
                              ? 'bg-emerald-100 text-emerald-800'
                              : as.status === 'programada'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {as.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{as.tema}</p>
                    </div>
                    <div className="text-right text-xs shrink-0 pl-4">
                      <div className="font-semibold text-slate-700 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {as.fecha_programada}
                      </div>
                      <span className="text-slate-400 capitalize">{as.tipo} ({as.duracion_minutos}m)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estado de Trámites Legales */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-800">Expedientes Legales en Trámite</h3>
              </div>
              <button
                onClick={() => setActiveTab('legales')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Gestionar Trámites &rarr;
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {procesosLegales.map(pl => {
                const cliente = clientes.find(c => c.id === pl.cliente_id);
                return (
                  <div key={pl.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{pl.tipo_proceso}</span>
                        <span className="text-xs text-slate-500 font-mono">[{pl.documento_identidad}]</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Emprendedor: <b>{cliente?.nombre_completo}</b> &bull; Razón: {pl.nombre_comercial}
                      </p>
                      <p className="text-[11px] text-indigo-600 mt-1">
                        Estado procesal: <i>{pl.estado}</i>
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        pl.status === 'completado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pl.status === 'en_proceso'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pl.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Bitácora de Interacciones Recientes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-teal-600" />
              Bitácora de Interacciones
            </h3>
            <div className="space-y-3">
              {interacciones.map(i => {
                const cliente = clientes.find(c => c.id === i.cliente_id);
                return (
                  <div key={i.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{cliente?.nombre_completo}</span>
                      <span className="text-[10px] text-slate-400">{i.fecha_hora}</span>
                    </div>
                    <div className="text-teal-700 font-medium">
                      {i.tipo} &bull; <span className="text-slate-500">{i.canal}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{i.descripcion}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-slate-900 to-[#161938] text-white p-5 rounded-xl shadow-sm text-xs space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <AlertCircle className="w-4 h-4" />
              Atajos de Demostración
            </div>
            <p className="text-slate-300">
              Puede interactuar con los datos directamente: añadir nuevos clientes, crear asesorías con formularios de diagnóstico, aprobar recaudos legales y registrar pagos.
            </p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Directorio: {totalClientes} registros</span>
              <button
                onClick={() => setActiveTab('directorio')}
                className="text-teal-300 hover:text-white font-medium underline"
              >
                Explorar directorio &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
