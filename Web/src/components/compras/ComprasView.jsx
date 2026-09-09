import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Clock, 
  X,
  Building2,
  Package
} from 'lucide-react';

export const ComprasView = () => {
  const { data, addCompra, formatCurrency, getProveedorName, getProductoName } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedorID, setSelectedProveedorID] = useState(data.Proveedores[0]?.ProveedorID || 1);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [impuestos, setImpuestos] = useState(0);

  // Line items
  const [items, setItems] = useState([
    { ProductoID: data.Productos[0]?.ProductoID || 1, cantidad: 5, costoUnitario: data.Productos[0]?.CostoUnitario || 20000, descuento: 0 }
  ]);

  const addItemRow = () => {
    const firstProd = data.Productos[0];
    setItems(prev => [
      ...prev,
      { ProductoID: firstProd?.ProductoID || 1, cantidad: 1, costoUnitario: firstProd?.CostoUnitario || 10000, descuento: 0 }
    ]);
  };

  const updateItemRow = (index, field, value) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        const updated = { ...item, [field]: value };
        // If product changed, update unit cost suggestion
        if (field === 'ProductoID') {
          const prod = data.Productos.find(p => p.ProductoID === Number(value));
          if (prod) updated.costoUnitario = prod.CostoUnitario;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const subtotalCompra = items.reduce((acc, it) => acc + (Number(it.cantidad || 0) * Number(it.costoUnitario || 0)), 0);
  const totalCompra = Math.max(0, subtotalCompra - Number(descuentoGeneral || 0) + Number(impuestos || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Debe agregar al menos un producto a la compra.');
      return;
    }

    addCompra({
      proveedorID: selectedProveedorID,
      numeroFactura,
      items,
      descuento: Number(descuentoGeneral || 0),
      impuestos: Number(impuestos || 0),
      observaciones
    });

    setIsModalOpen(false);
    setNumeroFactura('');
    setObservaciones('');
    setDescuentoGeneral(0);
    setImpuestos(0);
    setItems([
      { ProductoID: data.Productos[0]?.ProductoID || 1, cantidad: 5, costoUnitario: data.Productos[0]?.CostoUnitario || 20000, descuento: 0 }
    ]);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="h-5 w-5 text-amber-400" />
            <span>Gestión de Compras y Lotes a Proveedores</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Registro de facturas de compra, reposición de inventario y actualización automática de stock de fragancias.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 px-4 py-2 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Nueva Compra</span>
        </button>
      </div>

      {/* Purchases History Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Factura #</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Fecha</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3 text-right">Descuento</th>
              <th className="p-3 text-right">Impuestos</th>
              <th className="p-3 text-right">Total Compra</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3">Observaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {data.Compras.map(compra => (
              <tr key={compra.CompraID} className="hover:bg-zinc-800/30 transition-all">
                <td className="p-3 font-mono text-zinc-500 font-bold">#{compra.CompraID}</td>
                <td className="p-3 font-mono font-semibold text-amber-400">{compra.NumeroFactura || 'S/N'}</td>
                <td className="p-3 font-medium text-zinc-100">{getProveedorName(compra.ProveedorID)}</td>
                <td className="p-3 text-zinc-400">
                  {new Date(compra.FechaCompra).toLocaleDateString('es-CR', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-3 text-right font-mono text-zinc-400">{formatCurrency(compra.Subtotal)}</td>
                <td className="p-3 text-right font-mono text-rose-400">
                  {compra.Descuento > 0 ? `-${formatCurrency(compra.Descuento)}` : '₡0.00'}
                </td>
                <td className="p-3 text-right font-mono text-zinc-400">{formatCurrency(compra.Impuestos || 0)}</td>
                <td className="p-3 text-right font-mono font-bold text-amber-300">{formatCurrency(compra.TotalCompra)}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {compra.Estado}
                  </span>
                </td>
                <td className="p-3 text-zinc-400 text-[11px] max-w-xs truncate">
                  {compra.Observaciones || 'Sin notas'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW PURCHASE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>Registrar Compra de Lote a Proveedor</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Proveedor */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-medium mb-1">Proveedor *</label>
                  <select
                    value={selectedProveedorID}
                    onChange={(e) => setSelectedProveedorID(Number(e.target.value))}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    {data.Proveedores.filter(p => p.Activo).map(prov => (
                      <option key={prov.ProveedorID} value={prov.ProveedorID}>{prov.Nombre} - {prov.TipoProveedor}</option>
                    ))}
                  </select>
                </div>

                {/* Número Factura */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">N° de Factura / Comprobante</label>
                  <input
                    type="text"
                    required
                    value={numeroFactura}
                    onChange={(e) => setNumeroFactura(e.target.value)}
                    placeholder="FAC-2026-001"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-bold uppercase tracking-wider text-[10px]">
                    Detalle de Fragancias Compradas
                  </label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Añadir Línea</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {items.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 items-center">
                      <div className="col-span-5">
                        <select
                          value={row.ProductoID}
                          onChange={(e) => updateItemRow(idx, 'ProductoID', e.target.value)}
                          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-2.5 py-1.5 text-zinc-100 text-xs focus:border-amber-500 focus:outline-none"
                        >
                          {data.Productos.map(p => (
                            <option key={p.ProductoID} value={p.ProductoID}>
                              {p.Nombre} ({p.Marca})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={row.cantidad}
                          onChange={(e) => updateItemRow(idx, 'cantidad', e.target.value)}
                          placeholder="Cant."
                          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-2 py-1.5 text-zinc-100 font-mono text-center"
                          title="Cantidad de unidades"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          step="1"
                          required
                          value={row.costoUnitario}
                          onChange={(e) => updateItemRow(idx, 'costoUnitario', e.target.value)}
                          placeholder="Costo"
                          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-2 py-1.5 text-zinc-100 font-mono text-right"
                          title="Costo unitario"
                        />
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-zinc-200">
                        {formatCurrency(Number(row.cantidad || 0) * Number(row.costoUnitario || 0))}
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          disabled={items.length === 1}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals & Adjustments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
                <div className="space-y-2">
                  <div>
                    <label className="block text-zinc-400 text-[11px] mb-1">Descuento Global (₡)</label>
                    <input
                      type="number"
                      min="0"
                      value={descuentoGeneral}
                      onChange={(e) => setDescuentoGeneral(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-zinc-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[11px] mb-1">Impuestos / IVA (₡)</label>
                    <input
                      type="number"
                      min="0"
                      value={impuestos}
                      onChange={(e) => setImpuestos(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-zinc-100 font-mono"
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-3 space-y-1.5 font-mono flex flex-col justify-center">
                  <div className="flex justify-between text-zinc-400 text-xs">
                    <span>Subtotal Líneas:</span>
                    <span>{formatCurrency(subtotalCompra)}</span>
                  </div>
                  {Number(descuentoGeneral) > 0 && (
                    <div className="flex justify-between text-rose-400 text-xs">
                      <span>Descuento:</span>
                      <span>-{formatCurrency(descuentoGeneral)}</span>
                    </div>
                  )}
                  {Number(impuestos) > 0 && (
                    <div className="flex justify-between text-zinc-300 text-xs">
                      <span>Impuestos:</span>
                      <span>+{formatCurrency(impuestos)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-300 font-bold text-sm pt-2 border-t border-zinc-800">
                    <span>TOTAL COMPRA:</span>
                    <span>{formatCurrency(totalCompra)}</span>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-zinc-400 mb-1">Observaciones</label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles del lote, transportista, etc."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Confirmar y Cargar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
