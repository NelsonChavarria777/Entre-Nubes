import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Package, 
  Droplet, 
  CreditCard, 
  AlertTriangle, 
  ShoppingCart, 
  ArrowUpRight, 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  Truck, 
  ChevronRight,
  Clock
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    data, 
    formatCurrency, 
    setActiveTab, 
    getClienteName, 
    getMetodoPagoName,
    dbStatus,
    handleSeedSQL 
  } = useApp();

  // Safe checks for empty tables
  const productosList = data.Productos || [];
  const ventasList = data.Ventas || [];
  const detalleVentasList = data.DetalleVentas || [];
  const cuentasList = data.CuentasPorCobrar || [];
  const gastosList = data.Gastos || [];
  const liquidoList = data.InventarioLiquido || [];
  const movimientosList = data.MovimientosStock || [];

  // Metrics calculations
  const totalVentasMonto = ventasList.reduce((acc, v) => acc + (Number(v.TotalVenta) || 0), 0);
  const totalVentasCount = ventasList.length;

  // Ganancia real estimada (Ventas vs Costos de detalle vendidos)
  const costoTotalVendido = detalleVentasList.reduce((acc, det) => {
    const prod = productosList.find(p => p.ProductoID === det.ProductoID);
    const costoUnit = prod ? Number(prod.CostoUnitario) : 0;
    return acc + (Number(det.Cantidad) * costoUnit);
  }, 0);
  const gananciaEstimada = totalVentasMonto - costoTotalVendido;

  // Cuentas por cobrar
  const saldoPorCobrar = cuentasList.reduce((acc, c) => acc + (Number(c.SaldoPendiente) || 0), 0);

  // Gastos
  const totalGastos = gastosList.reduce((acc, g) => acc + (Number(g.Monto) || 0), 0);

  // Inventario Liquido ML disponible total
  const totalMLDisponibles = liquidoList.reduce((acc, l) => acc + (Number(l.DisponibleML) || 0), 0);

  // Alertas
  const productosBajoStock = productosList.filter(p => (p.StockActual || 0) <= (p.StockMinimo || 1));
  const liquidosBajoNivel = liquidoList.filter(l => (Number(l.DisponibleML) || 0) < 15);
  const cuentasVencidas = cuentasList.filter(c => {
    if (!c.FechaVencimiento || c.SaldoPendiente <= 0) return false;
    return new Date(c.FechaVencimiento) < new Date();
  });

  return (
    <div className="space-y-6">
      {/* Live SQL Server Status & Seed Banner */}
      {dbStatus.connected && productosList.length === 0 && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left shadow-xl">
          <div className="flex items-start gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Base de Datos SQL Server Conectada:</span>
                <span className="font-mono text-emerald-400 text-xs">{dbStatus.server} [{dbStatus.db}]</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Las 14 tablas están listas en tu SQL Server. Puedes sembrar las fragancias iniciales de prueba (Armaf, Bharara, JPG, Lattafa) o comenzar a registrar tus productos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSeedSQL}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sembrar Fragancias de Prueba</span>
            </button>
            <button
              onClick={() => setActiveTab('productos')}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              Crear Manualmente
            </button>
          </div>
        </div>
      )}

      {/* Welcome & Brand Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-zinc-900 via-[#16141a] to-zinc-900 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                <Sparkles className="h-3 w-3" /> Panel Ejecutivo
              </span>
              <span className="text-xs text-zinc-500 font-mono">v1.0 (SQL Server efluvio)</span>
            </div>
            <h1 className="mt-2 text-2xl font-serif font-bold text-white tracking-tight">
              Bienvenido a <span className="text-amber-400 font-serif">Efluvio</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-xl">
              Control integral de fragancias de diseñador, perfumes árabes, fraccionamiento de decants líquidos, ventas y cuentas por cobrar.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Nueva Venta (POS)</span>
            </button>

            <button
              onClick={() => setActiveTab('compras')}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium px-3.5 py-2.5 text-xs border border-zinc-700 transition-all cursor-pointer"
            >
              <Truck className="h-4 w-4 text-amber-400" />
              <span>Cargar Compra</span>
            </button>

            <button
              onClick={() => setActiveTab('inventarioLiquido')}
              className="flex items-center gap-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 font-medium px-3.5 py-2.5 text-xs border border-cyan-800/50 transition-all cursor-pointer"
            >
              <Droplet className="h-4 w-4 text-cyan-400" />
              <span>Decantar ML</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Ventas */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Ventas Totales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-white">{formatCurrency(totalVentasMonto)}</div>
          <div className="mt-1 text-[11px] text-zinc-500">{totalVentasCount} transacciones</div>
        </div>

        {/* Ganancia Estimada */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Ganancia Neta Est.</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-amber-300">{formatCurrency(gananciaEstimada)}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Margen bruto positivo</div>
        </div>

        {/* Cuentas por Cobrar */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Por Cobrar</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-purple-300">{formatCurrency(saldoPorCobrar)}</div>
          <div className="mt-1 text-[11px] text-zinc-500">{data.CuentasPorCobrar.length} pendientes</div>
        </div>

        {/* Gastos Operativos */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Gastos Totales</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-rose-300">{formatCurrency(totalGastos)}</div>
          <div className="mt-1 text-[11px] text-zinc-500">{data.Gastos.length} comprobantes</div>
        </div>

        {/* Inventario Líquido */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Líquido Decants</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-cyan-300">{totalMLDisponibles.toFixed(1)} ml</div>
          <div className="mt-1 text-[11px] text-zinc-500">Disponible para fraccionar</div>
        </div>

        {/* Alertas Stock */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Stock Crítico</span>
            <div className={`p-2 rounded-xl border ${productosBajoStock.length > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className={`mt-2 text-lg font-bold ${productosBajoStock.length > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
            {productosBajoStock.length} items
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Requieren reposición</div>
        </div>
      </div>

      {/* Actionable Alerts Section */}
      {(productosBajoStock.length > 0 || liquidosBajoNivel.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productosBajoStock.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Alerta: Stock Mínimo Alcanzado</span>
                </div>
                <button
                  onClick={() => setActiveTab('productos')}
                  className="text-xs text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Ver todos <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {productosBajoStock.slice(0, 3).map(prod => (
                  <div key={prod.ProductoID} className="flex items-center justify-between bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{prod.Nombre}</div>
                      <div className="text-[10px] text-zinc-400">{prod.Marca} • {prod.Presentacion}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold">
                        {prod.StockActual || 0} unid. (Mín: {prod.StockMinimo})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {liquidosBajoNivel.length > 0 && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Droplet className="h-4 w-4" />
                  <span>Frascos Matriz con Poco Líquido (&lt; 15ml)</span>
                </div>
                <button
                  onClick={() => setActiveTab('inventarioLiquido')}
                  className="text-xs text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Gestionar <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {liquidosBajoNivel.slice(0, 3).map(liq => {
                  const prod = data.Productos.find(p => p.ProductoID === liq.ProductoID);
                  return (
                    <div key={liq.InventarioLiquidoID} className="flex items-center justify-between bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{prod ? prod.Nombre : `Producto #${liq.ProductoID}`}</div>
                        <div className="text-[10px] text-zinc-400">{prod ? prod.Marca : ''}</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold">
                          {liq.DisponibleML} ml restantes
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Recent Sales & Stock Kardex */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Últimas Ventas</h2>
              <p className="text-xs text-zinc-400">Movimientos de caja recientes</p>
            </div>
            <button
              onClick={() => setActiveTab('ventas')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              Historial completo <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {data.Ventas.slice(0, 5).map(venta => (
              <div key={venta.VentaID} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                    #{venta.VentaID}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">
                      {getClienteName(venta.ClienteID)}
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(venta.FechaVenta).toLocaleDateString('es-CR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      <span>•</span>
                      <span className="text-emerald-400">{venta.Estado}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300">{formatCurrency(venta.TotalVenta)}</div>
                  <div className="text-[10px] text-zinc-400">Subtotal: {formatCurrency(venta.Subtotal)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Movimientos de Stock</h2>
              <p className="text-xs text-zinc-400">Entradas, salidas y ajustes de inventario</p>
            </div>
            <button
              onClick={() => setActiveTab('movimientos')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              Ver Kardex <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {data.MovimientosStock.slice(0, 5).map(mov => {
              const prod = data.Productos.find(p => p.ProductoID === mov.ProductoID);
              const isEntrada = mov.TipoMovimiento === 'ENTRADA' || mov.TipoMovimiento === 'AJUSTE_POSITIVO';
              return (
                <div key={mov.MovimientoID} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center h-8 px-2 rounded-lg text-[10px] font-bold border ${
                      isEntrada 
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                    }`}>
                      {mov.TipoMovimiento}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">
                        {prod ? prod.Nombre : `Prod #${mov.ProductoID}`}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {mov.Motivo || 'Sin motivo'} • {new Date(mov.FechaMovimiento).toLocaleDateString('es-CR')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono font-bold text-xs">
                    <span className={isEntrada ? 'text-emerald-400' : 'text-rose-400'}>
                      {isEntrada ? '+' : '-'}{mov.Cantidad}
                    </span>
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
