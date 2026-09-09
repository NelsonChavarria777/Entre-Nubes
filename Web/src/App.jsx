import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductosView } from './components/productos/ProductosView';
import { InventarioLiquidoView } from './components/inventarioLiquido/InventarioLiquidoView';
import { POSView } from './components/ventas/POSView';
import { ComprasView } from './components/compras/ComprasView';
import { CuentasCobrarView } from './components/cuentasCobrar/CuentasCobrarView';
import { GastosView } from './components/gastos/GastosView';
import { MovimientosView } from './components/movimientos/MovimientosView';
import { ContactosView } from './components/contactos/ContactosView';
import { ConfiguracionView } from './components/configuracion/ConfiguracionView';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent = () => {
  const { activeTab, notification } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <ProductosView />;
      case 'inventarioLiquido':
        return <InventarioLiquidoView />;
      case 'pos':
      case 'ventas':
        return <POSView />;
      case 'compras':
        return <ComprasView />;
      case 'cuentasCobrar':
        return <CuentasCobrarView />;
      case 'gastos':
        return <GastosView />;
      case 'movimientos':
        return <MovimientosView />;
      case 'contactos':
        return <ContactosView />;
      case 'configuracion':
        return <ConfiguracionView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0d13] text-zinc-100 font-sans antialiased selection:bg-amber-500 selection:text-zinc-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md text-xs animate-bounce font-medium">
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-rose-400" />
          ) : notification.type === 'info' ? (
            <Info className="h-5 w-5 text-cyan-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-amber-400" />
          )}
          <span className="text-zinc-100">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
