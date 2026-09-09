import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Droplet, 
  Plus, 
  Minus, 
  AlertCircle, 
  RefreshCw, 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  X
} from 'lucide-react';

export const InventarioLiquidoView = () => {
  const { data, registrarExtraccionML, registrarMermaML, formatCurrency } = useApp();

  const [selectedLiquido, setSelectedLiquido] = useState(null);
  const [modalMode, setModalMode] = useState('extract'); // 'extract' | 'merma'
  const [mlAmount, setMlAmount] = useState(5);
  const [motivo, setMotivo] = useState('');

  const openActionModal = (liquido, mode) => {
    setSelectedLiquido(liquido);
    setModalMode(mode);
    setMlAmount(mode === 'extract' ? 5 : 1);
    setMotivo(mode === 'extract' ? 'Preparación de decant para cliente' : 'Merma por evaporación / llenado');
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    if (!selectedLiquido) return;

    if (modalMode === 'extract') {
      registrarExtraccionML(selectedLiquido.ProductoID, mlAmount, motivo);
    } else {
      registrarMermaML(selectedLiquido.ProductoID, mlAmount, motivo);
    }

    setSelectedLiquido(null);
  };

  // Overall totals
  const totalDisponibleML = data.InventarioLiquido.reduce((acc, l) => acc + (Number(l.DisponibleML) || 0), 0);
  const totalSalidasML = data.InventarioLiquido.reduce((acc, l) => acc + (Number(l.SalidasML) || 0), 0);
  const totalMermaML = data.InventarioLiquido.reduce((acc, l) => acc + (Number(l.MermaML) || 0), 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold uppercase tracking-wider">
              Especialidad Perfumería
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
            <FlaskConical className="h-5 w-5 text-cyan-400" />
            <span>Inventario Líquido y Fraccionamiento de Decants</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Mapeo directo de <code className="text-cyan-300 font-mono">InventarioLiquido</code>: cálculo de DisponibleML = Inicial + Entradas - Salidas - Merma.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-zinc-900 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Líquido Disponible</span>
            <Droplet className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-300 font-mono">
            {totalDisponibleML.toFixed(1)} <span className="text-sm text-cyan-500">ml</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Volumen activo en frascos matriz</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Fraccionado (Salidas)</span>
            <Minus className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">
            {totalSalidasML.toFixed(1)} <span className="text-sm text-amber-500">ml</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Extraídos en decants de 3ml, 5ml, 10ml</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Mermas Acumuladas</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">
            {totalMermaML.toFixed(1)} <span className="text-sm text-rose-500">ml</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Evaporación o residuos en pipetas</div>
        </div>
      </div>

      {/* Fragrance Flask Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.InventarioLiquido.map(liq => {
          const prod = data.Productos.find(p => p.ProductoID === liq.ProductoID);
          const totalBase = (Number(liq.ContenidoInicialML) || 0) + (Number(liq.EntradasML) || 0);
          const disponible = Number(liq.DisponibleML) || 0;
          const percentage = totalBase > 0 ? Math.max(0, Math.min(100, (disponible / totalBase) * 100)) : 0;
          const isCritical = disponible < 15;

          return (
            <div
              key={liq.InventarioLiquidoID}
              className={`rounded-2xl border bg-zinc-900/80 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all ${
                isCritical ? 'border-rose-500/40 ring-1 ring-rose-500/20' : 'border-zinc-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {prod ? prod.Marca : 'Efluvio'}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-100">
                      {prod ? prod.Nombre : `Producto #${liq.ProductoID}`}
                    </h3>
                    <div className="text-[11px] text-zinc-500">
                      {prod ? `${prod.Presentacion} • Género: ${prod.Genero}` : ''}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                      isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {disponible.toFixed(1)} ml
                    </span>
                  </div>
                </div>

                {/* Visual Liquid Tank Gauge */}
                <div className="space-y-1.5 my-4">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Droplet className="h-3 w-3 text-cyan-400" />
                      Nivel en Frasco Matriz
                    </span>
                    <span className="font-mono font-semibold text-zinc-300">{percentage.toFixed(0)}%</span>
                  </div>

                  {/* Progress bar representing perfume liquid */}
                  <div className="h-4 w-full rounded-full bg-zinc-950 border border-zinc-800 p-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical 
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500' 
                          : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {isCritical && (
                    <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="h-3 w-3" />
                      Frasco próximo a agotarse. Se sugiere recargar o abrir nueva botella.
                    </div>
                  )}
                </div>

                {/* Mathematical Breakdown */}
                <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/80 p-3 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Inicial + Entradas:</span>
                    <span className="text-zinc-200">{(Number(liq.ContenidoInicialML) + Number(liq.EntradasML)).toFixed(1)} ml</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Salidas (Decants):</span>
                    <span className="text-amber-400">-{Number(liq.SalidasML).toFixed(1)} ml</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Merma Registrada:</span>
                    <span className="text-rose-400">-{Number(liq.MermaML).toFixed(1)} ml</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-800 text-zinc-200 font-bold">
                    <span>Disponible Real:</span>
                    <span className="text-cyan-300">{Number(liq.DisponibleML).toFixed(1)} ml</span>
                  </div>
                </div>

                {/* Observations */}
                {liq.Observaciones && (
                  <p className="mt-3 text-[10px] text-zinc-500 italic line-clamp-2" title={liq.Observaciones}>
                    {liq.Observaciones}
                  </p>
                )}
              </div>

              {/* Quick Decanting Extraction Buttons */}
              <div className="mt-5 pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                  Fraccionamiento Rápido:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => registrarExtraccionML(liq.ProductoID, 3, 'Decant exprés 3ml')}
                    disabled={disponible < 3}
                    className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-cyan-900/50 hover:border-cyan-700 text-zinc-200 text-xs font-mono font-bold border border-zinc-700 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    -3 ml
                  </button>
                  <button
                    onClick={() => registrarExtraccionML(liq.ProductoID, 5, 'Decant exprés 5ml')}
                    disabled={disponible < 5}
                    className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-cyan-900/50 hover:border-cyan-700 text-zinc-200 text-xs font-mono font-bold border border-zinc-700 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    -5 ml
                  </button>
                  <button
                    onClick={() => registrarExtraccionML(liq.ProductoID, 10, 'Decant exprés 10ml')}
                    disabled={disponible < 10}
                    className="py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-cyan-900/50 hover:border-cyan-700 text-zinc-200 text-xs font-mono font-bold border border-zinc-700 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    -10 ml
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openActionModal(liq, 'extract')}
                    className="flex-1 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-semibold transition-all cursor-pointer text-center"
                  >
                    Extracción Personalizada...
                  </button>
                  <button
                    onClick={() => openActionModal(liq, 'merma')}
                    className="py-1.5 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-[11px] font-semibold transition-all cursor-pointer"
                    title="Registrar merma o evaporación"
                  >
                    Merma
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Modal (Extract or Merma) */}
      {selectedLiquido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {modalMode === 'extract' ? (
                  <>
                    <Droplet className="h-4 w-4 text-cyan-400" />
                    <span>Registrar Salida de Decant (ML)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <span>Registrar Merma de Fragancia (ML)</span>
                  </>
                )}
              </h2>
              <button
                onClick={() => setSelectedLiquido(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Fragancia Seleccionada:</span>
                <span className="font-bold text-white text-sm">
                  {data.Productos.find(p => p.ProductoID === selectedLiquido.ProductoID)?.Nombre}
                </span>
                <div className="mt-1 text-[11px] text-cyan-400 font-mono">
                  Disponible actual: {selectedLiquido.DisponibleML} ml
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Cantidad a {modalMode === 'extract' ? 'Extraer' : 'Descontar por Merma'} (ML) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={selectedLiquido.DisponibleML}
                  required
                  value={mlAmount}
                  onChange={(e) => setMlAmount(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono text-base"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Motivo u Observación</label>
                <input
                  type="text"
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder={modalMode === 'extract' ? 'Ej: Decant 5ml para cliente X' : 'Ej: Derrame en llenado o evaporación'}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLiquido(null)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg cursor-pointer ${
                    modalMode === 'extract'
                      ? 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }`}
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
