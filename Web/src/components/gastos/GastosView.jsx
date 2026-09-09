import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingDown, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Tag, 
  Receipt, 
  Building2, 
  CreditCard,
  X,
  PieChart
} from 'lucide-react';

export const GastosView = () => {
  const { 
    data, 
    addGasto, 
    deleteGasto, 
    formatCurrency, 
    getCategoriaGastoName, 
    getProveedorName, 
    getMetodoPagoName 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoriaFilter, setSelectedCategoriaFilter] = useState('ALL');

  // Form State
  const initialFormState = {
    CategoriaGastoID: data.CategoriasGastos[0]?.CategoriaGastoID || 1,
    ProveedorID: '',
    MetodoPagoID: 2, // SINPE
    Descripcion: '',
    Monto: '',
    NumeroComprobante: '',
    ComprobanteURL: '',
    Observaciones: ''
  };

  const [form, setForm] = useState(initialFormState);

  // Total Expenses
  const totalGastos = data.Gastos.reduce((acc, g) => acc + (Number(g.Monto) || 0), 0);

  // Group by category for breakdown
  const categoryStats = data.CategoriasGastos.map(cat => {
    const total = data.Gastos
      .filter(g => g.CategoriaGastoID === cat.CategoriaGastoID)
      .reduce((acc, g) => acc + (Number(g.Monto) || 0), 0);
    const count = data.Gastos.filter(g => g.CategoriaGastoID === cat.CategoriaGastoID).length;
    const percentage = totalGastos > 0 ? ((total / totalGastos) * 100).toFixed(1) : 0;
    return { ...cat, total, count, percentage };
  });

  const filteredGastos = data.Gastos.filter(g => {
    if (selectedCategoriaFilter === 'ALL') return true;
    return g.CategoriaGastoID === Number(selectedCategoriaFilter);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Descripcion || !form.Monto) {
      alert('Por favor complete la descripción y el monto.');
      return;
    }

    addGasto(form);
    setIsModalOpen(false);
    setForm(initialFormState);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-400" />
            <span>Gastos Operativos & Egresos</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Registro de egresos por empaques, frascos de decants, envíos por Correos de CR, publicidad y materiales.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white px-4 py-2 text-xs font-bold shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Nuevo Gasto</span>
        </button>
      </div>

      {/* Categories Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {categoryStats.map(cat => (
          <div
            key={cat.CategoriaGastoID}
            onClick={() => setSelectedCategoriaFilter(cat.CategoriaGastoID === selectedCategoriaFilter ? 'ALL' : cat.CategoriaGastoID)}
            className={`rounded-xl border p-2.5 transition-all select-none cursor-pointer ${
              selectedCategoriaFilter === cat.CategoriaGastoID
                ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
            }`}
          >
            <div className="text-[10px] font-bold text-zinc-400 truncate">{cat.Nombre}</div>
            <div className="text-xs font-mono font-bold mt-1 text-zinc-100">{formatCurrency(cat.total)}</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">{cat.count} reg. ({cat.percentage}%)</div>
          </div>
        ))}
      </div>

      {/* Filter and Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Filtrar por Categoría:</span>
            <select
              value={selectedCategoriaFilter}
              onChange={(e) => setSelectedCategoriaFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="rounded-lg bg-zinc-950 border border-zinc-700 px-2.5 py-1 text-zinc-200 text-xs focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">Todas las Categorías</option>
              {data.CategoriasGastos.map(c => (
                <option key={c.CategoriaGastoID} value={c.CategoriaGastoID}>{c.Nombre}</option>
              ))}
            </select>
          </div>

          <div className="font-mono text-sm font-bold text-rose-400">
            Total Gastado: {formatCurrency(totalGastos)}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Proveedor / Beneficiario</th>
                <th className="p-3">Método</th>
                <th className="p-3">Comprobante</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredGastos.map(gasto => (
                <tr key={gasto.GastoID} className="hover:bg-zinc-800/30 transition-all">
                  <td className="p-3 font-mono text-zinc-500 font-bold">#{gasto.GastoID}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700 text-[10px] font-semibold">
                      {getCategoriaGastoName(gasto.CategoriaGastoID)}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-zinc-100 max-w-sm">
                    {gasto.Descripcion}
                  </td>
                  <td className="p-3 text-zinc-400">
                    {new Date(gasto.FechaGasto).toLocaleDateString('es-CR')}
                  </td>
                  <td className="p-3 text-zinc-400">
                    {gasto.ProveedorID ? getProveedorName(gasto.ProveedorID) : 'General'}
                  </td>
                  <td className="p-3 text-zinc-400">
                    {gasto.MetodoPagoID ? getMetodoPagoName(gasto.MetodoPagoID) : 'N/A'}
                  </td>
                  <td className="p-3 font-mono text-zinc-400 text-[11px]">
                    {gasto.NumeroComprobante || 'S/N'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-rose-400">
                    {formatCurrency(gasto.Monto)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar gasto "${gasto.Descripcion}"?`)) deleteGasto(gasto.GastoID);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-rose-400" />
                <span>Registrar Nuevo Gasto Operativo</span>
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
                <label className="block text-zinc-300 font-medium mb-1">Descripción del Gasto *</label>
                <input
                  type="text"
                  required
                  value={form.Descripcion}
                  onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
                  placeholder="Ej: Compra de 50 cajas para envíos"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Monto (₡) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={form.Monto}
                    onChange={(e) => setForm({ ...form, Monto: e.target.value })}
                    placeholder="25000"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 font-mono text-base focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Categoría *</label>
                  <select
                    value={form.CategoriaGastoID}
                    onChange={(e) => setForm({ ...form, CategoriaGastoID: Number(e.target.value) })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-rose-500 focus:outline-none"
                  >
                    {data.CategoriasGastos.filter(c => c.Activo).map(c => (
                      <option key={c.CategoriaGastoID} value={c.CategoriaGastoID}>{c.Nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Proveedor (Opcional)</label>
                  <select
                    value={form.ProveedorID}
                    onChange={(e) => setForm({ ...form, ProveedorID: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-rose-500 focus:outline-none"
                  >
                    <option value="">(Ninguno)</option>
                    {data.Proveedores.map(p => (
                      <option key={p.ProveedorID} value={p.ProveedorID}>{p.Nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Método de Pago</label>
                  <select
                    value={form.MetodoPagoID}
                    onChange={(e) => setForm({ ...form, MetodoPagoID: Number(e.target.value) })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-rose-500 focus:outline-none"
                  >
                    {data.MetodosPago.map(m => (
                      <option key={m.MetodoPagoID} value={m.MetodoPagoID}>{m.Metodo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">N° Comprobante / Factura</label>
                <input
                  type="text"
                  value={form.NumeroComprobante}
                  onChange={(e) => setForm({ ...form, NumeroComprobante: e.target.value })}
                  placeholder="Ej: FE-109283 o SINPE ref"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Observaciones</label>
                <input
                  type="text"
                  value={form.Observaciones}
                  onChange={(e) => setForm({ ...form, Observaciones: e.target.value })}
                  placeholder="Notas adicionales..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-rose-500 focus:outline-none"
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
                  className="rounded-xl bg-rose-500 hover:bg-rose-400 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
