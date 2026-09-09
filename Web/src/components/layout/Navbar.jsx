import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Download, Database, Sparkles, Server } from 'lucide-react';

export const Navbar = () => {
  const { 
    data, 
    setActiveTab, 
    handleExportSQL, 
    searchQuery, 
    setSearchQuery,
    dbStatus 
  } = useApp();

  const lowStockCount = data.Productos?.filter(p => (p.StockActual || 0) <= (p.StockMinimo || 1)).length || 0;
  const lowLiquidoCount = data.InventarioLiquido?.filter(l => (l.DisponibleML || 0) < 15).length || 0;
  const totalAlerts = lowStockCount + lowLiquidoCount;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-[#0e1017]/90 px-6 backdrop-blur-md">
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar fragancias, marcas, clientes, facturas..."
            className="w-full rounded-xl bg-zinc-900/80 pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 border border-zinc-700/60 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live SQL Server Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300">
          <span className={`h-2 w-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-mono text-[11px] text-zinc-300">
            {dbStatus.connected ? 'SQL Server Conectado' : 'Conectando BD...'}
          </span>
        </div>

        {/* Quick New Sale (POS) Button */}
        <button
          onClick={() => setActiveTab('pos')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-zinc-950" />
          <span>Punto de Venta</span>
        </button>

        {/* Notifications badge */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="relative rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
          title={`${totalAlerts} alertas de inventario`}
        >
          <Bell className="h-4 w-4" />
          {totalAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-950 animate-pulse">
              {totalAlerts}
            </span>
          )}
        </button>

        {/* User / Business Avatar */}
        <div className="flex items-center gap-2.5 border-l border-zinc-800 pl-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-sm">
            EF
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-zinc-200">Administrador</div>
            <div className="text-[10px] text-amber-400 font-medium">Efluvio Perfumería</div>
          </div>
        </div>
      </div>
    </header>
  );
};
