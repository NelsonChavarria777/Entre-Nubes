import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  Search, 
  User, 
  FileText, 
  Receipt,
  X
} from 'lucide-react';

export const CuentasCobrarView = () => {
  const { 
    data, 
    addPago, 
    formatCurrency, 
    getClienteName, 
    getMetodoPagoName 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('cuentas'); // 'cuentas' | 'pagos'
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [montoAbono, setMontoAbono] = useState('');
  const [metodoPagoID, setMetodoPagoID] = useState(2); // default SINPE
  const [referencia, setReferencia] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Total summary metrics
  const totalPorCobrar = data.CuentasPorCobrar.reduce((acc, c) => acc + (Number(c.SaldoPendiente) || 0), 0);
  const totalCobrado = data.CuentasPorCobrar.reduce((acc, c) => acc + (Number(c.TotalPagado) || 0), 0);
  const totalVendidoCredito = data.CuentasPorCobrar.reduce((acc, c) => acc + (Number(c.TotalVenta) || 0), 0);

  const openAbonoModal = (cuenta) => {
    setSelectedCuenta(cuenta);
    setMontoAbono(cuenta.SaldoPendiente);
    setReferencia('');
    setObservaciones(`Abono a cuenta #${cuenta.CuentaID}`);
  };

  const handleAbonoSubmit = (e) => {
    e.preventDefault();
    if (!selectedCuenta) return;

    const montoNum = Number(montoAbono) || 0;
    if (montoNum <= 0 || montoNum > Number(selectedCuenta.SaldoPendiente)) {
      alert('El monto a abonar debe ser mayor a 0 y no puede superar el saldo pendiente.');
      return;
    }

    addPago({
      ventaID: selectedCuenta.VentaID,
      clienteID: selectedCuenta.ClienteID,
      metodoPagoID,
      monto: montoNum,
      referencia,
      observaciones
    });

    setSelectedCuenta(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-400" />
            <span>Cuentas por Cobrar & Control de Pagos</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Seguimiento de ventas a crédito, saldos pendientes de clientes y registro de abonos vía SINPE Móvil o Efectivo.
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
          <button
            onClick={() => setActiveSubTab('cuentas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'cuentas' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            Cuentas Pendientes ({data.CuentasPorCobrar.filter(c => c.SaldoPendiente > 0).length})
          </button>
          <button
            onClick={() => setActiveSubTab('pagos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeSubTab === 'pagos' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            Libro de Pagos ({data.Pagos.length})
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-900 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Saldo Total por Cobrar</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-300 font-mono">
            {formatCurrency(totalPorCobrar)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Monto pendiente en calle</div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Recaudado (Abonos)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-300 font-mono">
            {formatCurrency(totalCobrado)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Cobrado satisfactoriamente</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Crédito Bruto Otorgado</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">
            {formatCurrency(totalVendidoCredito)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">{data.CuentasPorCobrar.length} cuentas registradas</div>
        </div>
      </div>

      {activeSubTab === 'cuentas' ? (
        /* TABLE OF CUENTAS POR COBRAR */
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="p-3">Cuenta #</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Venta #</th>
                <th className="p-3">F. Emisión</th>
                <th className="p-3">F. Vencimiento</th>
                <th className="p-3 text-right">Total Venta</th>
                <th className="p-3 text-right">Total Pagado</th>
                <th className="p-3 text-right">Saldo Pendiente</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {data.CuentasPorCobrar.map(cuenta => {
                const isOverdue = cuenta.FechaVencimiento && new Date(cuenta.FechaVencimiento) < new Date() && cuenta.SaldoPendiente > 0;
                return (
                  <tr key={cuenta.CuentaID} className="hover:bg-zinc-800/30 transition-all">
                    <td className="p-3 font-mono text-zinc-500 font-bold">#{cuenta.CuentaID}</td>
                    <td className="p-3 font-semibold text-zinc-100">{getClienteName(cuenta.ClienteID)}</td>
                    <td className="p-3 font-mono text-amber-400">Venta #{cuenta.VentaID}</td>
                    <td className="p-3 text-zinc-400">
                      {new Date(cuenta.FechaVenta).toLocaleDateString('es-CR')}
                    </td>
                    <td className="p-3">
                      <span className={`font-medium ${isOverdue ? 'text-rose-400 font-bold' : 'text-zinc-400'}`}>
                        {cuenta.FechaVencimiento ? new Date(cuenta.FechaVencimiento).toLocaleDateString('es-CR') : 'N/A'}
                        {isOverdue && ' (Vencida)'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-zinc-400">{formatCurrency(cuenta.TotalVenta)}</td>
                    <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(cuenta.TotalPagado)}</td>
                    <td className="p-3 text-right font-mono font-bold text-rose-300">
                      {formatCurrency(cuenta.SaldoPendiente)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cuenta.SaldoPendiente <= 0 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : isOverdue 
                          ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {cuenta.SaldoPendiente <= 0 ? 'Pagada' : isOverdue ? 'Vencida' : cuenta.Estado}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {cuenta.SaldoPendiente > 0 ? (
                        <button
                          onClick={() => openAbonoModal(cuenta)}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                        >
                          Abonar / Pagar
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Cancelada</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* TABLE OF ALL PAYMENTS (PAGOS) */
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="p-3">Pago #</th>
                <th className="p-3">Venta #</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Método de Pago</th>
                <th className="p-3">Fecha de Pago</th>
                <th className="p-3">Referencia / Comprobante</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {data.Pagos.map(pago => (
                <tr key={pago.PagoID} className="hover:bg-zinc-800/30 transition-all">
                  <td className="p-3 font-mono text-zinc-500 font-bold">#{pago.PagoID}</td>
                  <td className="p-3 font-mono text-amber-400">Venta #{pago.VentaID}</td>
                  <td className="p-3 font-medium text-zinc-100">{getClienteName(pago.ClienteID)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 font-medium">
                      {getMetodoPagoName(pago.MetodoPagoID)}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400">
                    {new Date(pago.FechaPago).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-3 font-mono text-cyan-300">{pago.Referencia || 'Sin ref.'}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(pago.Monto)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      {pago.Estado}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400 text-[11px] max-w-xs truncate">
                    {pago.Observaciones || 'Sin notas'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ABONO / PAGO MODAL */}
      {selectedCuenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-400" />
                <span>Registrar Abono a Cuenta #{selectedCuenta.CuentaID}</span>
              </h2>
              <button
                onClick={() => setSelectedCuenta(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAbonoSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Cliente:</span>
                  <span className="font-bold text-white">{getClienteName(selectedCuenta.ClienteID)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Venta:</span>
                  <span className="font-mono text-zinc-200">{formatCurrency(selectedCuenta.TotalVenta)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Saldo Pendiente:</span>
                  <span className="font-mono font-bold text-rose-400">{formatCurrency(selectedCuenta.SaldoPendiente)}</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Monto del Abono (₡) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={selectedCuenta.SaldoPendiente}
                  required
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 font-mono text-base focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Método de Pago *</label>
                <select
                  value={metodoPagoID}
                  onChange={(e) => setMetodoPagoID(Number(e.target.value))}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  {data.MetodosPago.filter(m => m.Activo).map(m => (
                    <option key={m.MetodoPagoID} value={m.MetodoPagoID}>{m.Metodo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Referencia Bancaria (Ej: SINPE # comprobante)</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej: SINPE-293841"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Notas u Observaciones</label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Comprobante verificado por WhatsApp..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCuenta(null)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Confirmar Pago / Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
