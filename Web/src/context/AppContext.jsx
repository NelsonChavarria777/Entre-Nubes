import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { db } from '../services/db';
import { downloadSQLScript } from '../services/sqlExporter';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => db.get());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState({ connected: false, server: '', db: '', loading: true });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return '₡' + num.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Check SQL Server Status and Load data
  const refreshFromSQL = useCallback(async () => {
    try {
      const statusRes = await api.getStatus();
      if (statusRes.ok) {
        setDbStatus({
          connected: true,
          server: statusRes.data.server,
          db: statusRes.data.db,
          loading: false
        });

        // Fetch all 14 tables from SQL Server
        const bootstrapRes = await api.getBootstrap();
        if (bootstrapRes.ok && bootstrapRes.data) {
          // If SQL Server has data, use it; if Productos is empty, offer seed
          setData(bootstrapRes.data);
          db.save(bootstrapRes.data);
        }
      } else {
        setDbStatus({ connected: false, server: '', db: '', loading: false });
      }
    } catch (e) {
      console.warn('Backend/SQL Server not reached, using local fallback:', e);
      setDbStatus({ connected: false, server: '', db: '', loading: false });
    }
  }, []);

  useEffect(() => {
    refreshFromSQL();
  }, [refreshFromSQL]);

  // Seed sample perfumes into empty SQL Server
  const handleSeedSQL = async () => {
    try {
      showToast('Sembrando datos iniciales en SQL Server...', 'info');
      const res = await api.seedInicial();
      if (res.ok) {
        await refreshFromSQL();
        showToast('¡Datos iniciales sembrados en SQL Server [efluvio] con éxito!');
      } else {
        showToast('Error al sembrar: ' + res.error, 'error');
      }
    } catch (e) {
      showToast('Error de conexión: ' + e.message, 'error');
    }
  };

  // --- PRODUCTOS ---
  const addProducto = async (prodData) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createProducto(prodData);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Producto guardado en SQL Server: ${prodData.Nombre}`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Local fallback if offline
    const id = Date.now();
    const costo = Number(prodData.CostoUnitario) || 0;
    const precio = Number(prodData.PrecioVentaUnitario) || 0;
    const stock = Number(prodData.StockActual) || 0;
    const newProd = {
      ...prodData,
      ProductoID: id,
      CostoUnitario: costo,
      PrecioVentaUnitario: precio,
      GananciaUnitario: precio - costo,
      StockActual: stock,
      FechaRegistro: new Date().toISOString()
    };
    setData(prev => ({ ...prev, Productos: [newProd, ...prev.Productos] }));
    showToast(`Producto "${newProd.Nombre}" guardado`);
  };

  const updateProducto = async (id, prodData) => {
    try {
      if (dbStatus.connected) {
        const res = await api.updateProducto(id, prodData);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Producto actualizado en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setData(prev => ({
      ...prev,
      Productos: prev.Productos.map(p => p.ProductoID === id ? { ...p, ...prodData } : p)
    }));
    showToast('Producto actualizado');
  };

  const deleteProducto = async (id) => {
    try {
      if (dbStatus.connected) {
        await api.deleteProducto(id);
        await refreshFromSQL();
        showToast('Producto desactivado en SQL Server');
        return;
      }
    } catch (e) {
      console.error(e);
    }

    setData(prev => ({
      ...prev,
      Productos: prev.Productos.filter(p => p.ProductoID !== id)
    }));
    showToast('Producto eliminado');
  };

  // --- INVENTARIO LÍQUIDO (DECANTS) ---
  const registrarExtraccionML = async (productoID, ml, motivo) => {
    try {
      if (dbStatus.connected) {
        const res = await api.extraerML(productoID, ml, motivo);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Extracción de ${ml}ml guardada en SQL Server`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setData(prev => ({
      ...prev,
      InventarioLiquido: prev.InventarioLiquido.map(item => {
        if (item.ProductoID === productoID) {
          const nuevasSalidas = (Number(item.SalidasML) || 0) + Number(ml);
          const disponible = (Number(item.ContenidoInicialML) || 0) + (Number(item.EntradasML) || 0) - nuevasSalidas - (Number(item.MermaML) || 0);
          return { ...item, SalidasML: nuevasSalidas, DisponibleML: disponible };
        }
        return item;
      })
    }));
    showToast(`Se registraron ${ml} ml extraídos`);
  };

  const registrarMermaML = async (productoID, ml, motivo) => {
    try {
      if (dbStatus.connected) {
        const res = await api.mermaML(productoID, ml, motivo);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Merma de ${ml}ml guardada en SQL Server`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setData(prev => ({
      ...prev,
      InventarioLiquido: prev.InventarioLiquido.map(item => {
        if (item.ProductoID === productoID) {
          const nuevaMerma = (Number(item.MermaML) || 0) + Number(ml);
          const disponible = (Number(item.ContenidoInicialML) || 0) + (Number(item.EntradasML) || 0) - (Number(item.SalidasML) || 0) - nuevaMerma;
          return { ...item, MermaML: nuevaMerma, DisponibleML: disponible };
        }
        return item;
      })
    }));
    showToast(`Se registraron ${ml} ml de merma`);
  };

  // --- VENTAS & POS ---
  const addVenta = async (ventaPayload) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createVenta(ventaPayload);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Venta #${res.data.VentaID} registrada en SQL Server [efluvio]`);
          return res.data;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Local fallback
    const id = Date.now();
    const nuevaVenta = {
      VentaID: id,
      ClienteID: ventaPayload.clienteID || null,
      FechaVenta: new Date().toISOString(),
      Subtotal: ventaPayload.subtotal,
      Descuento: ventaPayload.descuento || 0,
      TotalVenta: Math.max(0, ventaPayload.subtotal - (ventaPayload.descuento || 0)),
      Estado: 'Completada',
      Observaciones: ventaPayload.observaciones
    };
    setData(prev => ({ ...prev, Ventas: [nuevaVenta, ...prev.Ventas] }));
    return nuevaVenta;
  };

  // --- COMPRAS ---
  const addCompra = async (compraPayload) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createCompra(compraPayload);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Compra #${res.data.CompraID} guardada en SQL Server`);
          return res.data;
        }
      }
    } catch (e) {
      console.error(e);
    }

    showToast('Compra registrada localmente');
  };

  // --- PAGOS / ABONOS ---
  const addPago = async (pagoPayload) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createPago(pagoPayload);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Abono registrado en SQL Server: ${formatCurrency(pagoPayload.monto)}`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    showToast(`Abono de ${formatCurrency(pagoPayload.monto)} registrado`);
  };

  // --- GASTOS ---
  const addGasto = async (gastoData) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createGasto(gastoData);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Gasto de ${formatCurrency(gastoData.Monto)} guardado en SQL Server`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteGasto = async (id) => {
    try {
      if (dbStatus.connected) {
        await api.deleteGasto(id);
        await refreshFromSQL();
        showToast('Gasto eliminado de SQL Server');
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- MOVIMIENTOS STOCK MANUAL ---
  const addMovimientoStock = async (movData) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createMovimiento(movData);
        if (res.ok) {
          await refreshFromSQL();
          showToast(`Ajuste de stock guardado en SQL Server`);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CONTACTOS ---
  const addProveedor = async (prov) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createProveedor(prov);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Proveedor guardado en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProveedor = async (id) => {
    try {
      if (dbStatus.connected) {
        await api.deleteProveedor(id);
        await refreshFromSQL();
        showToast('Proveedor eliminado de SQL Server');
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProveedor = async (id, prov) => {
    try {
      if (dbStatus.connected) {
        const res = await api.updateProveedor(id, prov);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Proveedor actualizado en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addCliente = async (cli) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createCliente(cli);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Cliente guardado en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCliente = async (id) => {
    try {
      if (dbStatus.connected) {
        await api.deleteCliente(id);
        await refreshFromSQL();
        showToast('Cliente eliminado de SQL Server');
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCliente = async (id) => {
    try {
      if (dbStatus.connected) {
        const res = await api.toggleCliente(id);
        if (res.ok && res.data) {
          await refreshFromSQL();
          showToast(`Cliente ${res.data.Activo ? 'activado' : 'inactivado'}`);
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleProveedor = async (id) => {
    try {
      if (dbStatus.connected) {
        const res = await api.toggleProveedor(id);
        if (res.ok && res.data) {
          await refreshFromSQL();
          showToast(`Proveedor ${res.data.Activo ? 'activado' : 'inactivado'}`);
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCliente = async (id, cli) => {
    try {
      if (dbStatus.connected) {
        const res = await api.updateCliente(id, cli);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Cliente actualizado en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CATALOGOS ---
  const addMetodoPago = async (metodo) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createMetodoPago(metodo);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Método de pago guardado en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMetodoPago = async (id) => {
    try {
      if (dbStatus.connected) {
        await api.deleteMetodoPago(id);
        await refreshFromSQL();
        showToast('Método de pago eliminado de SQL Server');
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addCategoriaGasto = async (cat) => {
    try {
      if (dbStatus.connected) {
        const res = await api.createCategoriaGasto(cat);
        if (res.ok) {
          await refreshFromSQL();
          showToast('Categoría de gasto guardada en SQL Server');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategoriaGasto = async (id) => {
    try {
      if (dbStatus.connected) {
        await api.deleteCategoriaGasto(id);
        await refreshFromSQL();
        showToast('Categoría de gasto eliminada de SQL Server');
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMetodoPago = async (id) => {
    try {
      if (dbStatus.connected) {
        const res = await api.toggleMetodoPago(id);
        if (res.ok && res.data) {
          await refreshFromSQL();
          showToast(`Método ${res.data.Activo ? 'activado' : 'inactivado'}`);
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCategoriaGasto = async (id) => {
    try {
      if (dbStatus.connected) {
        const res = await api.toggleCategoriaGasto(id);
        if (res.ok && res.data) {
          await refreshFromSQL();
          showToast(`Categoría ${res.data.Activo ? 'activada' : 'inactivada'}`);
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- UTILERÍAS ---
  const handleReset = () => {
    const resetData = db.reset();
    setData(resetData);
    showToast('Datos locales reiniciados', 'info');
  };

  const handleExportJSON = () => {
    db.exportJSON();
    showToast('Respaldo JSON descargado');
  };

  const handleExportSQL = () => {
    downloadSQLScript(data);
    showToast('Script T-SQL generado y descargado para SQL Server');
  };

  const handleImportJSON = (jsonString) => {
    const success = db.importJSON(jsonString);
    if (success) {
      setData(db.get());
      showToast('Respaldo JSON restaurado correctamente');
    } else {
      showToast('Error al importar el archivo JSON', 'error');
    }
  };

  // Helper selectors
  const getProveedorName = (id) => data.Proveedores?.find(p => p.ProveedorID === id)?.Nombre || 'Proveedor General';
  const getClienteName = (id) => data.Clientes?.find(c => c.ClienteID === id)?.Nombre || 'Consumidor Final';
  const getMetodoPagoName = (id) => data.MetodosPago?.find(m => m.MetodoPagoID === id)?.Metodo || 'Sin Definir';
  const getCategoriaGastoName = (id) => data.CategoriasGastos?.find(c => c.CategoriaGastoID === id)?.Nombre || 'General';
  const getProductoName = (id) => data.Productos?.find(p => p.ProductoID === id)?.Nombre || `Producto #${id}`;

  return (
    <AppContext.Provider value={{
      data,
      activeTab,
      setActiveTab,
      notification,
      showToast,
      formatCurrency,
      searchQuery,
      setSearchQuery,
      dbStatus,
      refreshFromSQL,
      handleSeedSQL,
      // CRUD
      addProducto,
      updateProducto,
      deleteProducto,
      registrarExtraccionML,
      registrarMermaML,
      addVenta,
      addCompra,
      addPago,
      addGasto,
      deleteGasto,
      addMovimientoStock,
      addProveedor,
      deleteProveedor,
      toggleProveedor,
      updateProveedor,
      addCliente,
      deleteCliente,
      toggleCliente,
      updateCliente,
      addMetodoPago,
      deleteMetodoPago,
      toggleMetodoPago,
      addCategoriaGasto,
      deleteCategoriaGasto,
      toggleCategoriaGasto,
      // Utilities
      handleReset,
      handleExportJSON,
      handleExportSQL,
      handleImportJSON,
      // Selectors
      getProveedorName,
      getClienteName,
      getMetodoPagoName,
      getCategoriaGastoName,
      getProductoName
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
