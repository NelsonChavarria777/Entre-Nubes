import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeftRight, 
  Plus, 
  Filter, 
  Clock, 
  Package, 
  Calendar, 
  Search, 
  X,
  AlertTriangle
} from 'lucide-react';

export const MovimientosView = () => {
  const { data, addMovimientoStock, getProductoName } = useApp();

  const [filterTipo, setFilterTipo] = useState('ALL');
  const [filterProducto, setFilterProducto] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manual Adjustment Form
  const [form, setForm] = useState({
    productoID: data.Productos[0]?.ProductoID || 1,
    tipoMovimiento: 'AJUSTE_POSITIVO',
    cantidad: 1,
    motivo: 'Auditoría de inventario físico',
    observaciones: ''
  });

  const filteredMovimientos = data.MovimientosStock.filter(m => {
    const matchTipo = filterTipo === 'ALL' || m.TipoMovimiento === filterTipo;
    const matchProd = filterProducto === 'ALL' || m.ProductoID === Number(filterProducto);
    return matchTipo && matchProd;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMovimientoStock({
      productoID: form.productoID,
      tipoMovimiento: form.tipoMovimiento,
      cantidad: form.cantidad,
      motivo: form.motivo,
      observaciones: form.observaciones
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-amber-400" />
            <span>Kardex & Movimientos de Stock</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Auditoría cronológica inmutable de entradas por compras, salidas por ventas y ajustes manuales.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Ajuste Manual de Inventario</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-zinc-400 mb-1">Tipo de Movimiento</label>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="ENTRADA">ENTRADA (Compras / Cargas)</option>
            <option value="SALIDA">SALIDA (Ventas / Despachos)</option>
            <option value="AJUSTE_POSITIVO">AJUSTE POSITIVO (+)</option>
            <option value="AJUSTE_NEGATIVO">AJUSTE NEGATIVO (-)</option>
            <option value="DEVOLUCION">DEVOLUCIÓN</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Fragancia / Producto</label>
          <select
            value={filterProducto}
            onChange={(e) => setFilterProducto(e.target.value)}
            className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">Todas las fragancias</option>
            {data.Productos.map(p => (
              <option key={p.ProductoID} value={p.ProductoID}>{p.Nombre} ({p.Marca})</option>
            ))}
          </select>
        </div>

        <div className="flex items-end text-zinc-500 text-xs">
          Mostrando {filteredMovimientos.length} de {data.MovimientosStock.length} movimientos
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Fecha y Hora</th>
              <th className="p-3">Fragancia</th>
              <th className="p-3 text-center">Tipo</th>
              <th className="p-3 text-right">Cantidad</th>
              <th className="p-3">Origen</th>
              <th className="p-3">Motivo</th>
              <th className="p-3">Observaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {filteredMovimientos.map(mov => {
              const isPositive = mov.TipoMovimiento === 'ENTRADA' || mov.TipoMovimiento === 'AJUSTE_POSITIVO' || mov.TipoMovimiento === 'DEVOLUCION';
              return (
                <tr key={mov.MovimientoID} className="hover:bg-zinc-800/30 transition-all font-sans">
                  <td className="p-3 font-mono text-zinc-500 font-bold">#{mov.MovimientoID}</td>
                  <td className="p-3 text-zinc-400">
                    {new Date(mov.FechaMovimiento).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-3 font-semibold text-zinc-100">
                    {getProductoName(mov.ProductoID)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isPositive 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}>
                      {mov.TipoMovimiento}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                      {isPositive ? '+' : '-'}{mov.Cantidad}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-amber-400 text-[11px]">
                    {mov.CompraID ? `Compra #${mov.CompraID}` : mov.VentaID ? `Venta #${mov.VentaID}` : 'Ajuste Manual'}
                  </td>
                  <td className="p-3 text-zinc-300 text-[11px]">
                    {mov.Motivo || 'N/A'}
                  </td>
                  <td className="p-3 text-zinc-500 text-[11px] max-w-xs truncate">
                    {mov.Observaciones || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MANUAL ADJUSTMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-amber-400" />
                <span>Registrar Ajuste Manual de Inventario</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Fragancia / Producto *</label>
                <select
                  value={form.productoID}
                  onChange={(e) => setForm({ ...form, productoID: Number(e.target.value) })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  {data.Productos.map(p => (
                    <option key={p.ProductoID} value={p.ProductoID}>
                      {p.Nombre} (Stock actual: {p.StockActual})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Tipo de Ajuste *</label>
                <select
                  value={form.tipoMovimiento}
                  onChange={(e) => setForm({ ...form, tipoMovimiento: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="AJUSTE_POSITIVO">AJUSTE POSITIVO (Ingreso de unidades)</option>
                  <option value="AJUSTE_NEGATIVO">AJUSTE NEGATIVO (Merma / Rotura / Pérdida)</option>
                  <option value="DEVOLUCION">DEVOLUCIÓN (Reingreso de cliente)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Cantidad de Unidades *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={form.cantidad}
                  onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 font-mono text-base focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Motivo</label>
                <input
                  type="text"
                  required
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  placeholder="Ej: Recuento físico de fin de mes, frasco quebrado..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Observaciones</label>
                <input
                  type="text"
                  value={form.observaciones}
                  onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  placeholder="Detalles adicionales..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Aplicar Ajuste al Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
