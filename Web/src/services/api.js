// Frontend API Client for Efluvio Backend connected to SQL Server

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Check backend and SQL Server health
  getStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      return await res.json();
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  // Load all tables directly from SQL Server
  getBootstrap: async () => {
    const res = await fetch(`${API_BASE}/bootstrap`);
    if (!res.ok) throw new Error('Error al cargar datos desde SQL Server');
    return await res.json();
  },

  // Seed sample perfumes and contacts into SQL Server if empty
  seedInicial: async () => {
    const res = await fetch(`${API_BASE}/seed-inicial`, { method: 'POST' });
    return await res.json();
  },

  // Get all available product images in Products folder
  getProductsImages: async () => {
    try {
      const res = await fetch(`${API_BASE}/products/images`);
      return await res.json();
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  // Upload image to Products folder
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    return await res.json();
  },

  // Productos
  createProducto: async (prodData) => {
    const res = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData)
    });
    return await res.json();
  },

  updateProducto: async (id, prodData) => {
    const res = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData)
    });
    return await res.json();
  },

  deleteProducto: async (id) => {
    const res = await fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Inventario Líquido
  extraerML: async (productoID, ml, motivo) => {
    const res = await fetch(`${API_BASE}/inventario-liquido/extraer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoID, ml, motivo })
    });
    return await res.json();
  },

  mermaML: async (productoID, ml, motivo) => {
    const res = await fetch(`${API_BASE}/inventario-liquido/merma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoID, ml, motivo })
    });
    return await res.json();
  },

  // Ventas (POS)
  createVenta: async (ventaPayload) => {
    const res = await fetch(`${API_BASE}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ventaPayload)
    });
    return await res.json();
  },

  // Compras
  createCompra: async (compraPayload) => {
    const res = await fetch(`${API_BASE}/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compraPayload)
    });
    return await res.json();
  },

  // Pagos & Cuentas por Cobrar
  createPago: async (pagoPayload) => {
    const res = await fetch(`${API_BASE}/pagos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pagoPayload)
    });
    return await res.json();
  },

  // Gastos
  createGasto: async (gastoData) => {
    const res = await fetch(`${API_BASE}/gastos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gastoData)
    });
    return await res.json();
  },

  deleteGasto: async (id) => {
    const res = await fetch(`${API_BASE}/gastos/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Movimientos Stock
  createMovimiento: async (movData) => {
    const res = await fetch(`${API_BASE}/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movData)
    });
    return await res.json();
  },

  // Contactos
  createProveedor: async (prov) => {
    const res = await fetch(`${API_BASE}/contactos/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prov)
    });
    return await res.json();
  },

  createCliente: async (cli) => {
    const res = await fetch(`${API_BASE}/contactos/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cli)
    });
    return await res.json();
  },

  // Catálogos
  createMetodoPago: async (metodo) => {
    const res = await fetch(`${API_BASE}/catalogos/metodos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metodo)
    });
    return await res.json();
  },

  createCategoriaGasto: async (cat) => {
    const res = await fetch(`${API_BASE}/catalogos/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return await res.json();
  },

  deleteMetodoPago: async (id) => {
    const res = await fetch(`${API_BASE}/catalogos/metodos/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  deleteCategoriaGasto: async (id) => {
    const res = await fetch(`${API_BASE}/catalogos/categorias/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};
