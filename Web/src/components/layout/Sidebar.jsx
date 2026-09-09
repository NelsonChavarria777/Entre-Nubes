import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  Droplet, 
  ShoppingCart, 
  Receipt, 
  Truck, 
  CreditCard, 
  ArrowLeftRight, 
  TrendingDown, 
  Users, 
  Settings,
  Database,
  CheckCircle2
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, data, dbStatus } = useApp();

  const lowStockCount = data.Productos?.filter(p => (p.StockActual || 0) <= (p.StockMinimo || 1)).length || 0;
  const pendingReceivablesCount = data.CuentasPorCobrar?.filter(c => (c.SaldoPendiente || 0) > 0).length || 0;

  const menuSections = [
    {
      title: 'OPERACIONES',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pos', label: 'Punto de Venta (POS)', icon: ShoppingCart },
        { id: 'ventas', label: 'Ventas Realizadas', icon: Receipt },
        { id: 'compras', label: 'Compras Proveedores', icon: Truck },
      ]
    },
    {
      title: 'INVENTARIO & CATÁLOGO',
      items: [
        { 
          id: 'productos', 
          label: 'Catálogo Productos', 
          icon: Package, 
          badge: lowStockCount > 0 ? lowStockCount : null,
          badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        },
        { 
          id: 'inventarioLiquido', 
          label: 'Inventario Líquido (Decants)', 
          icon: Droplet,
          pill: 'Perfumería' 
        },
        { id: 'movimientos', label: 'Kardex Movimientos', icon: ArrowLeftRight },
      ]
    },
    {
      title: 'FINANZAS',
      items: [
        { 
          id: 'cuentasCobrar', 
          label: 'Cuentas por Cobrar', 
          icon: CreditCard,
          badge: pendingReceivablesCount > 0 ? pendingReceivablesCount : null,
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        },
        { id: 'gastos', label: 'Gastos Operativos', icon: TrendingDown },
      ]
    },
    {
      title: 'GESTIÓN & SISTEMA',
      items: [
        { id: 'contactos', label: 'Clientes y Proveedores', icon: Users },
        { id: 'configuracion', label: 'Configuración & BD', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0a0c12] border-r border-zinc-800/80 flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-zinc-800/80 flex flex-col items-center">
          <img 
            src="/assets/logos/logoNavbarSinFondo.webp" 
            alt="Efluvio" 
            className="h-11 object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/logos/logoImgSinFondo.webp';
            }}
          />
          <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-amber-400/80 font-medium">
            Panel Administrativo
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                {section.title}
              </div>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/10 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.pill && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-semibold">
                          {item.pill}
                        </span>
                      )}
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Database Status Live Badge Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 text-left">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`h-2 w-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400 shadow-sm shadow-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {dbStatus.connected ? 'SQL Server En Vivo' : 'Modo Local'}
            </span>
            <span className="text-[10px] text-amber-400/90 font-mono">efluvio</span>
          </div>
          <div className="mt-1 text-[10px] text-zinc-400 truncate" title={dbStatus.server || 'DESKTOP-S6VR4T8\\SQLEXPRESS'}>
            {dbStatus.connected ? 'DESKTOP-S6VR4T8\\SQLEXPRESS' : 'Conectando...'}
          </div>
          <div className="mt-0.5 text-[9px] text-zinc-500">
            {data.Productos?.length || 0} productos • {data.Ventas?.length || 0} ventas
          </div>
        </div>
      </div>
    </aside>
  );
};
