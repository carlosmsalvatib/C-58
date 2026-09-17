import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Contrato, Pago, ContratoEstadoPago, ContratoEstado } from '../types';
import {
  FileText,
  Plus,
  DollarSign,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  Receipt,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const ContratosView: React.FC = () => {
  const {
    contratos,
    addContrato,
    pagos,
    addPago,
    updatePagoStatus,
    clientes,
  } = useApp();

  const [modalNewContrato, setModalNewContrato] = useState(false);
  const [modalNewPago, setModalNewPago] = useState<Contrato | null>(null);

  // New contract form
  const [newContratoData, setNewContratoData] = useState({
    cliente_id: clientes[0]?.id || 1,
    numero_contrato: `CTR-${new Date().getFullYear()}-00${contratos.length + 1}`,
    fecha_firma: new Date().toISOString().substring(0, 10),
    monto_total: 600,
    anticipo: 300,
    fecha_anticipo: new Date().toISOString().substring(0, 10),
    fecha_inicio_servicio: new Date().toISOString().substring(0, 10),
    fecha_fin_servicio: new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10),
    estado_pago: 'parcial' as ContratoEstadoPago,
    estado_contrato: 'activo' as ContratoEstado,
    condiciones: 'Paquete de servicios de consultoría estratégica y formalización mercantil.',
    observaciones: '',
  });

  // New payment form
  const [newPagoData, setNewPagoData] = useState({
    monto: 0,
    fecha_pago: new Date().toISOString().substring(0, 10),
    metodo_pago: 'transferencia' as Pago['metodo_pago'],
    referencia: '',
    comprobante: '',
  });

  const handleCreateContrato = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = Number(newContratoData.monto_total);
    const anticipo = Number(newContratoData.anticipo);

    addContrato({
      cliente_id: Number(newContratoData.cliente_id),
      comercial_id: 4,
      numero_contrato: newContratoData.numero_contrato,
      fecha_firma: newContratoData.fecha_firma,
      monto_total: monto,
      anticipo: anticipo,
      fecha_anticipo: newContratoData.fecha_anticipo,
      fecha_inicio_servicio: newContratoData.fecha_inicio_servicio,
      fecha_fin_servicio: newContratoData.fecha_fin_servicio,
      estado_pago: anticipo >= monto ? 'pagado' : anticipo > 0 ? 'parcial' : 'pendiente',
      estado_contrato: newContratoData.estado_contrato,
      condiciones: newContratoData.condiciones,
      observaciones: newContratoData.observaciones,
    });

    setModalNewContrato(false);
  };

  const handleCreatePago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalNewPago || newPagoData.monto <= 0) {
      alert('Ingrese un monto válido mayor a 0');
      return;
    }

    addPago({
      contrato_id: modalNewPago.id,
      monto: Number(newPagoData.monto),
      fecha_pago: newPagoData.fecha_pago,
      metodo_pago: newPagoData.metodo_pago,
      referencia: newPagoData.referencia || `REF-${Date.now().toString().slice(-6)}`,
      comprobante: newPagoData.comprobante || `comprobante_${Date.now()}.pdf`,
      status: 'verificado',
    });

    setModalNewPago(null);
  };

  return (
    <div id="contratos-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Contratos, Cobros & Verificación
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Control de acuerdos comerciales, registro de pagos, anticipos y validación de comprobantes.
          </p>
        </div>

        <button
          id="btn-nuevo-contrato"
          onClick={() => setModalNewContrato(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161938] hover:bg-[#1E224F] text-white text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          Registrar Contrato
        </button>
      </div>

      {/* Contratos List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-4">N° Contrato</th>
              <th className="p-4">Emprendedor</th>
              <th className="p-4">Monto Total</th>
              <th className="p-4">Anticipo</th>
              <th className="p-4">Saldo Pendiente</th>
              <th className="p-4">Estado Pago</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contratos.map(ct => {
              const cliente = clientes.find(c => c.id === ct.cliente_id);
              return (
                <tr key={ct.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-bold text-slate-900">{ct.numero_contrato}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{cliente?.nombre_completo}</div>
                    <div className="text-xs text-slate-500">{cliente?.nombre_empresa}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-900">${ct.monto_total.toLocaleString()}</td>
                  <td className="p-4 text-emerald-700 font-semibold">${ct.anticipo.toLocaleString()}</td>
                  <td className="p-4 font-semibold text-amber-700">
                    ${ct.saldo_pendiente.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        ct.estado_pago === 'pagado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ct.estado_pago === 'parcial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ct.estado_pago.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setModalNewPago(ct);
                        setNewPagoData({
                          monto: ct.saldo_pendiente,
                          fecha_pago: new Date().toISOString().substring(0, 10),
                          metodo_pago: 'transferencia',
                          referencia: '',
                          comprobante: '',
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Registrar Cobro
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Historial de Pagos y Verificación */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            Historial de Pagos y Comprobantes
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total recaudado:{' '}
            <b className="text-emerald-700">
              ${pagos.filter(p => p.status === 'verificado').reduce((a, b) => a + Number(b.monto), 0)}
            </b>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {pagos.map(p => {
            const contrato = contratos.find(c => c.id === p.contrato_id);
            const cliente = clientes.find(c => c.id === contrato?.cliente_id);

            return (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 text-sm">
                    ${p.monto.toLocaleString()} &bull;{' '}
                    <span className="text-slate-600 font-normal">{cliente?.nombre_completo}</span>
                  </div>
                  <div className="text-slate-500">
                    Contrato: <span className="font-mono">{contrato?.numero_contrato}</span> &bull; Método:{' '}
                    <span className="capitalize">{p.metodo_pago}</span> &bull; Ref: {p.referencia}
                  </div>
                  {p.comprobante && (
                    <div className="text-[11px] text-teal-700 font-mono flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      {p.comprobante}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{p.fecha_pago}</span>
                  <select
                    value={p.status}
                    onChange={e => updatePagoStatus(p.id, e.target.value as Pago['status'])}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1 border ${
                      p.status === 'verificado'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : p.status === 'pendiente'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <option value="pendiente">PENDIENTE</option>
                    <option value="verificado">VERIFICADO</option>
                    <option value="rechazado">RECHAZADO</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Nuevo Contrato */}
      {modalNewContrato && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalNewContrato(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Registrar Contrato Comercial</h3>

            <form onSubmit={handleCreateContrato} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emprendedor</label>
                <select
                  value={newContratoData.cliente_id}
                  onChange={e =>
                    setNewContratoData({ ...newContratoData, cliente_id: Number(e.target.value) })
                  }
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
                  <label className="block font-semibold text-slate-700 mb-1">Número de Contrato</label>
                  <input
                    type="text"
                    required
                    value={newContratoData.numero_contrato}
                    onChange={e =>
                      setNewContratoData({ ...newContratoData, numero_contrato: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha de Firma</label>
                  <input
                    type="date"
                    value={newContratoData.fecha_firma}
                    onChange={e =>
                      setNewContratoData({ ...newContratoData, fecha_firma: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monto Total ($)</label>
                  <input
                    type="number"
                    required
                    value={newContratoData.monto_total}
                    onChange={e =>
                      setNewContratoData({ ...newContratoData, monto_total: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Anticipo ($)</label>
                  <input
                    type="number"
                    value={newContratoData.anticipo}
                    onChange={e =>
                      setNewContratoData({ ...newContratoData, anticipo: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Condiciones del Servicio</label>
                <textarea
                  rows={2}
                  value={newContratoData.condiciones}
                  onChange={e =>
                    setNewContratoData({ ...newContratoData, condiciones: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNewContrato(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#161938] hover:bg-[#1E224F] text-white rounded-lg font-semibold"
                >
                  Crear Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Pago */}
      {modalNewPago && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalNewPago(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Registrar Cobro / Abono</h3>
              <p className="text-xs text-slate-500">
                Contrato: <b>{modalNewPago.numero_contrato}</b> &bull; Saldo pendiente: ${modalNewPago.saldo_pendiente}
              </p>
            </div>

            <form onSubmit={handleCreatePago} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monto a Cobrar ($)</label>
                  <input
                    type="number"
                    required
                    max={modalNewPago.saldo_pendiente || modalNewPago.monto_total}
                    value={newPagoData.monto}
                    onChange={e => setNewPagoData({ ...newPagoData, monto: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Método de Pago</label>
                  <select
                    value={newPagoData.metodo_pago}
                    onChange={e =>
                      setNewPagoData({ ...newPagoData, metodo_pago: e.target.value as Pago['metodo_pago'] })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="pago_movil">Pago Móvil</option>
                    <option value="efectivo">Efectivo ($ USD)</option>
                    <option value="tarjeta">Punto de Venta / Tarjeta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Referencia Bancaria</label>
                <input
                  type="text"
                  placeholder="Ej. TRF-12345678"
                  value={newPagoData.referencia}
                  onChange={e => setNewPagoData({ ...newPagoData, referencia: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Archivo Comprobante</label>
                <input
                  type="text"
                  placeholder="comprobante_bancarizado.pdf"
                  value={newPagoData.comprobante}
                  onChange={e => setNewPagoData({ ...newPagoData, comprobante: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNewPago(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                >
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
