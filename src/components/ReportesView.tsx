import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  PieChart,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ReportesView: React.FC = () => {
  const { clientes, asesorias, procesosLegales, contratos, pagos } = useApp();

  // Financials
  const totalContratado = contratos.reduce((a, b) => a + Number(b.monto_total), 0);
  const totalCobrado = pagos.filter(p => p.status === 'verificado').reduce((a, b) => a + Number(b.monto), 0);
  const totalPendiente = totalContratado - totalCobrado;

  // Status breakdown
  const statusCounts = {
    activo: clientes.filter(c => c.status === 'activo').length,
    en_consulta: clientes.filter(c => c.status === 'en_consulta').length,
    en_legalizacion: clientes.filter(c => c.status === 'en_legalizacion').length,
    prospecto: clientes.filter(c => c.status === 'prospecto').length,
    finalizado: clientes.filter(c => c.status === 'finalizado').length,
  };

  // Industry breakdown
  const industries = Array.from(new Set(clientes.map(c => c.industria).filter(Boolean)));
  const industryCounts = industries.map(ind => ({
    name: ind,
    count: clientes.filter(c => c.industria === ind).length,
  }));

  const exportReportCSV = () => {
    const lines = [
      'Reporte Ejecutivo Código-58',
      `Fecha de Emisión: ${new Date().toISOString()}`,
      '',
      '--- METRICAS FINANCIERAS ---',
      `Total Contratado,$${totalContratado}`,
      `Total Cobrado,$${totalCobrado}`,
      `Saldo Pendiente,$${totalPendiente}`,
      '',
      '--- ESTADO DE EMPRENDEDORES ---',
      `Activos,${statusCounts.activo}`,
      `En Consulta,${statusCounts.en_consulta}`,
      `En Legalización,${statusCounts.en_legalizacion}`,
      `Prospectos,${statusCounts.prospecto}`,
      `Finalizados,${statusCounts.finalizado}`,
      '',
      '--- ASESORIAS ---',
      `Total Sesiones,${asesorias.length}`,
      `Realizadas,${asesorias.filter(a => a.status === 'realizada').length}`,
      `Programadas,${asesorias.filter(a => a.status === 'programada').length}`,
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ejecutivo_codigo58_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="reportes-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Reportes & Estadísticas Gerenciales
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Métricas de rendimiento operacional, análisis financiero de contratos y avance de expedientes.
          </p>
        </div>

        <button
          onClick={exportReportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Descargar Informe Completo (CSV)
        </button>
      </div>

      {/* Financial Bar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Cartera Contratada
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">${totalContratado.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">{contratos.length} contratos formalizados</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Recaudación Efectiva
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">${totalCobrado.toLocaleString()}</div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
            {totalContratado > 0 ? Math.round((totalCobrado / totalContratado) * 100) : 0}% del monto global
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Saldo Pendiente por Cobrar
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1">${totalPendiente.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Por verificar o pendientes</div>
        </div>
      </div>

      {/* Distribution visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status of Clientes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            Distribución de Emprendedores por Estado
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = clientes.length > 0 ? Math.round((count / clientes.length) * 100) : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium capitalize">
                    <span>{status.replace('_', ' ')}</span>
                    <span className="font-bold text-slate-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === 'activo'
                          ? 'bg-emerald-500'
                          : status === 'en_consulta'
                          ? 'bg-amber-500'
                          : status === 'en_legalizacion'
                          ? 'bg-indigo-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Industry distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            Emprendimientos por Sector Económico
          </h3>

          <div className="space-y-3 text-xs">
            {industryCounts.map(ind => {
              const pct = clientes.length > 0 ? Math.round((ind.count / clientes.length) * 100) : 0;
              return (
                <div key={ind.name} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{ind.name}</span>
                    <span className="font-bold text-slate-900">
                      {ind.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
