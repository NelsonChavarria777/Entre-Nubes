// Efluvio Administrative Database Engine & Mock Data Layer
// Exact representation of the SQL Server Schema with localStorage persistence

const STORAGE_KEY = 'efluvio_admin_db_v1';

// Initial Seed Data
const initialData = {
  Proveedores: [
    {
      ProveedorID: 1,
      Nombre: 'Distribuidora Aromas del Golfo S.A.',
      Telefono: '+506 2222-3344',
      Email: 'contacto@aromasdelgolfo.com',
      Direccion: 'San José, Costa Rica, Paseo Colón #1420',
      TipoProveedor: 'Distribuidor Mayorista',
      Notas: 'Proveedor oficial de marcas árabes (Lattafa, Armaf, Afnan)',
      Activo: 1,
      FechaRegistro: '2026-01-15T08:30:00'
    },
    {
      ProveedorID: 2,
      Nombre: 'Fragrance Imports Luxury Corp',
      Telefono: '+506 8877-6655',
      Email: 'ventas@luxurylat.com',
      Direccion: 'Escazú Corporate Center, Torre 2',
      TipoProveedor: 'Importador Directo',
      Notas: 'Perfumería de diseñador (Jean Paul Gaultier, Dior, Creed)',
      Activo: 1,
      FechaRegistro: '2026-01-20T10:00:00'
    },
    {
      ProveedorID: 3,
      Nombre: 'Insumos & Frascos Decant CR',
      Telefono: '+506 7011-2233',
      Email: 'pedidos@decantsfrascoscr.com',
      Direccion: 'Alajuela, El Coyol Parque Logístico',
      TipoProveedor: 'Insumos y Empaques',
      Notas: 'Proveedor de botellitas atomizadoras de 3ml, 5ml, 10ml y jeringas',
      Activo: 1,
      FechaRegistro: '2026-02-01T14:15:00'
    }
  ],

  Clientes: [
    {
      ClienteID: 1,
      Nombre: 'Alejandro Morales Mora',
      Telefono: '+506 8345-6789',
      Email: 'amorales@gmail.com',
      Direccion: 'Curridabat, San José, Residencial del Monte #45',
      Notas: 'Coleccionista de fragancias orientales y amaderadas.',
      Activo: 1,
      FechaRegistro: '2026-02-10T11:20:00'
    },
    {
      ClienteID: 2,
      Nombre: 'Valeria Castro Fonseca',
      Telefono: '+506 8765-4321',
      Email: 'valeria.castro@outlook.com',
      Direccion: 'Heredia Centro, Condominio Las Flores #12',
      Notas: 'Prefiere decants de 5ml para probar antes de botella completa.',
      Activo: 1,
      FechaRegistro: '2026-02-14T16:00:00'
    },
    {
      ClienteID: 3,
      Nombre: 'Carlos Andrés Gutiérrez',
      Telefono: '+506 8912-3456',
      Email: 'carlos.gutierrez@empresa.cr',
      Direccion: 'Santa Ana, Lindora Park',
      Notas: 'Cliente recurrente de Jean Paul Gaultier y Bharara.',
      Activo: 1,
      FechaRegistro: '2026-02-18T09:45:00'
    }
  ],

  MetodosPago: [
    {
      MetodoPagoID: 1,
      Metodo: 'Efectivo',
      Descripcion: 'Pago realizado en efectivo (Colones o Dólares)',
      Activo: 1,
      FechaRegistro: '2026-01-01T00:00:00'
    },
    {
      MetodoPagoID: 2,
      Metodo: 'SINPE Móvil',
      Descripcion: 'Pago electrónico instantáneo mediante SINPE Móvil al 8888-0000',
      Activo: 1,
      FechaRegistro: '2026-01-01T00:00:00'
    },
    {
      MetodoPagoID: 3,
      Metodo: 'Transferencia',
      Descripcion: 'Transferencia bancaria directa BAC San José / BCR',
      Activo: 1,
      FechaRegistro: '2026-01-01T00:00:00'
    },
    {
      MetodoPagoID: 4,
      Metodo: 'Tarjeta Débito / Crédito',
      Descripcion: 'Datafono móvil o link de pago',
      Activo: 1,
      FechaRegistro: '2026-01-10T00:00:00'
    }
  ],

  CategoriasGastos: [
    { CategoriaGastoID: 1, Nombre: 'Materiales', Descripcion: 'Materiales utilizados para la operación', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 2, Nombre: 'Empaques', Descripcion: 'Cajas, bolsas y empaques de regalo', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 3, Nombre: 'Decants', Descripcion: 'Frascos atomizadores de vidrio, pipetas y teflón', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 4, Nombre: 'Publicidad', Descripcion: 'Publicidad en Instagram, TikTok y pauta digital', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 5, Nombre: 'Transporte', Descripcion: 'Combustible y transporte para entregas personales', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 6, Nombre: 'Envíos', Descripcion: 'Envíos por Correos de Costa Rica y mensajería', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 7, Nombre: 'Comisiones', Descripcion: 'Comisiones bancarias y datáfonos', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' },
    { CategoriaGastoID: 8, Nombre: 'Otros', Descripcion: 'Otros gastos operativos del negocio', Activo: 1, FechaRegistro: '2026-01-01T00:00:00' }
  ],

  Productos: [
    {
      ProductoID: 1,
      Nombre: 'Club de Nuit Intense Man EDP',
      Marca: 'Armaf',
      Categoria: 'Perfume Árabe',
      Genero: 'Hombre',
      Presentacion: 'Botella 105ml',
      ContenidoML: 105.00,
      ProveedorID: 1,
      ImagenURL: '/assets/banners/armafBanner1.webp',
      CostoUnitario: 24000.00,
      PrecioVentaUnitario: 38000.00,
      GananciaUnitario: 14000.00,
      CostoTotalCompra: 240000.00,
      PrecioTotalVenta: 380000.00,
      StockActual: 8,
      StockMinimo: 3,
      Activo: 1,
      FechaRegistro: '2026-01-16T10:00:00'
    },
    {
      ProductoID: 2,
      Nombre: 'King Parfum',
      Marca: 'Bharara',
      Categoria: 'Nicho / Premium',
      Genero: 'Unisex',
      Presentacion: 'Botella 100ml',
      ContenidoML: 100.00,
      ProveedorID: 1,
      ImagenURL: '/assets/banners/baharaBanner1.webp',
      CostoUnitario: 42000.00,
      PrecioVentaUnitario: 65000.00,
      GananciaUnitario: 23000.00,
      CostoTotalCompra: 210000.00,
      PrecioTotalVenta: 325000.00,
      StockActual: 4,
      StockMinimo: 2,
      Activo: 1,
      FechaRegistro: '2026-01-18T12:00:00'
    },
    {
      ProductoID: 3,
      Nombre: 'Ultra Male EDT Intense',
      Marca: 'Jean Paul Gaultier',
      Categoria: 'Diseñador',
      Genero: 'Hombre',
      Presentacion: 'Botella 125ml',
      ContenidoML: 125.00,
      ProveedorID: 2,
      ImagenURL: '/assets/banners/jpgBanner1.webp',
      CostoUnitario: 52000.00,
      PrecioVentaUnitario: 78000.00,
      GananciaUnitario: 26000.00,
      CostoTotalCompra: 260000.00,
      PrecioTotalVenta: 390000.00,
      StockActual: 2,
      StockMinimo: 2,
      Activo: 1,
      FechaRegistro: '2026-01-22T14:30:00'
    },
    {
      ProductoID: 4,
      Nombre: 'Khamrah EDP',
      Marca: 'Lattafa',
      Categoria: 'Gourmand / Oriental',
      Genero: 'Unisex',
      Presentacion: 'Botella 100ml',
      ContenidoML: 100.00,
      ProveedorID: 1,
      ImagenURL: '/assets/banners/lattafaBanner1.webp',
      CostoUnitario: 22000.00,
      PrecioVentaUnitario: 35000.00,
      GananciaUnitario: 13000.00,
      CostoTotalCompra: 176000.00,
      PrecioTotalVenta: 280000.00,
      StockActual: 6,
      StockMinimo: 3,
      Activo: 1,
      FechaRegistro: '2026-01-25T16:00:00'
    },
    {
      ProductoID: 5,
      Nombre: 'Decant 10ml - Club de Nuit Intense',
      Marca: 'Armaf',
      Categoria: 'Decant',
      Genero: 'Hombre',
      Presentacion: 'Atomizador 10ml',
      ContenidoML: 10.00,
      ProveedorID: 1,
      ImagenURL: '/assets/banners/armafBanner2.webp',
      CostoUnitario: 3200.00,
      PrecioVentaUnitario: 6500.00,
      GananciaUnitario: 3300.00,
      CostoTotalCompra: 32000.00,
      PrecioTotalVenta: 65000.00,
      StockActual: 15,
      StockMinimo: 5,
      Activo: 1,
      FechaRegistro: '2026-02-01T11:00:00'
    },
    {
      ProductoID: 6,
      Nombre: 'Decant 5ml - Bharara King',
      Marca: 'Bharara',
      Categoria: 'Decant',
      Genero: 'Unisex',
      Presentacion: 'Atomizador 5ml',
      ContenidoML: 5.00,
      ProveedorID: 1,
      ImagenURL: '/assets/banners/baharaBanner2.webp',
      CostoUnitario: 2800.00,
      PrecioVentaUnitario: 5500.00,
      GananciaUnitario: 2700.00,
      CostoTotalCompra: 28000.00,
      PrecioTotalVenta: 55000.00,
      StockActual: 1,
      StockMinimo: 4,
      Activo: 1,
      FechaRegistro: '2026-02-05T09:00:00'
    }
  ],

  InventarioLiquido: [
    {
      InventarioLiquidoID: 1,
      ProductoID: 1, // Club de Nuit
      ContenidoInicialML: 105.00,
      EntradasML: 105.00,
      SalidasML: 45.00,
      MermaML: 2.50,
      DisponibleML: 162.50, // (105 + 105 - 45 - 2.5)
      FechaActualizacion: '2026-02-20T17:00:00',
      Observaciones: 'Botella matriz para fraccionamiento de decants de 5ml y 10ml'
    },
    {
      InventarioLiquidoID: 2,
      ProductoID: 2, // Bharara King
      ContenidoInicialML: 100.00,
      EntradasML: 0.00,
      SalidasML: 70.00,
      MermaML: 1.80,
      DisponibleML: 28.20, // (100 + 0 - 70 - 1.8)
      FechaActualizacion: '2026-02-22T12:30:00',
      Observaciones: 'Nivel bajo en matriz. Quedan 28.2 ml listos para decantar'
    },
    {
      InventarioLiquidoID: 3,
      ProductoID: 3, // JPG Ultra Male
      ContenidoInicialML: 125.00,
      EntradasML: 0.00,
      SalidasML: 25.00,
      MermaML: 1.00,
      DisponibleML: 99.00, // (125 + 0 - 25 - 1.0)
      FechaActualizacion: '2026-02-23T15:00:00',
      Observaciones: 'Frasco tester utilizado para muestras exclusivas'
    }
  ],

  Compras: [
    {
      CompraID: 1,
      ProveedorID: 1,
      FechaCompra: '2026-02-01T09:30:00',
      NumeroFactura: 'FAC-AR-8821',
      Subtotal: 240000.00,
      Descuento: 10000.00,
      Impuestos: 29900.00,
      TotalCompra: 259900.00,
      Estado: 'Completada',
      Observaciones: 'Lote de 10 unidades Club de Nuit Intense Man'
    },
    {
      CompraID: 2,
      ProveedorID: 2,
      FechaCompra: '2026-02-10T14:00:00',
      NumeroFactura: 'FAC-LUX-3401',
      Subtotal: 260000.00,
      Descuento: 0.00,
      Impuestos: 33800.00,
      TotalCompra: 293800.00,
      Estado: 'Completada',
      Observaciones: 'Pedido de reposición Jean Paul Gaultier Ultra Male'
    }
  ],

  DetalleCompras: [
    {
      DetalleCompraID: 1,
      CompraID: 1,
      ProductoID: 1,
      Cantidad: 10,
      CostoUnitario: 24000.00,
      Descuento: 10000.00,
      Subtotal: 230000.00 // (10 * 24000) - 10000
    },
    {
      DetalleCompraID: 2,
      CompraID: 2,
      ProductoID: 3,
      Cantidad: 5,
      CostoUnitario: 52000.00,
      Descuento: 0.00,
      Subtotal: 260000.00 // (5 * 52000) - 0
    }
  ],

  Ventas: [
    {
      VentaID: 1,
      ClienteID: 1,
      FechaVenta: '2026-02-15T15:20:00',
      Subtotal: 38000.00,
      Descuento: 2000.00,
      Impuestos: 0.00,
      TotalVenta: 36000.00,
      Estado: 'Completada',
      Observaciones: 'Cliente pagó con SINPE Móvil de inmediato'
    },
    {
      VentaID: 2,
      ClienteID: 2,
      FechaVenta: '2026-02-20T11:45:00',
      Subtotal: 12000.00,
      Descuento: 0.00,
      Impuestos: 0.00,
      TotalVenta: 12000.00,
      Estado: 'Completada',
      Observaciones: 'Compra de 2 decants (Club de Nuit 10ml + Bharara 5ml)'
    },
    {
      VentaID: 3,
      ClienteID: 3,
      FechaVenta: '2026-02-25T16:10:00',
      Subtotal: 78000.00,
      Descuento: 3000.00,
      Impuestos: 0.00,
      TotalVenta: 75000.00,
      Estado: 'Completada',
      Observaciones: 'JPG Ultra Male. Venta a crédito convenida a 15 días'
    }
  ],

  DetalleVentas: [
    {
      DetalleVentaID: 1,
      VentaID: 1,
      ProductoID: 1,
      Cantidad: 1.00,
      PrecioUnitario: 38000.00,
      Descuento: 2000.00,
      Subtotal: 36000.00
    },
    {
      DetalleVentaID: 2,
      VentaID: 2,
      ProductoID: 5,
      Cantidad: 1.00,
      PrecioUnitario: 6500.00,
      Descuento: 0.00,
      Subtotal: 6500.00
    },
    {
      DetalleVentaID: 3,
      VentaID: 2,
      ProductoID: 6,
      Cantidad: 1.00,
      PrecioUnitario: 5500.00,
      Descuento: 0.00,
      Subtotal: 5500.00
    },
    {
      DetalleVentaID: 4,
      VentaID: 3,
      ProductoID: 3,
      Cantidad: 1.00,
      PrecioUnitario: 78000.00,
      Descuento: 3000.00,
      Subtotal: 75000.00
    }
  ],

  Pagos: [
    {
      PagoID: 1,
      VentaID: 1,
      ClienteID: 1,
      MetodoPagoID: 2, // SINPE Movil
      FechaPago: '2026-02-15T15:21:00',
      Monto: 36000.00,
      Referencia: 'SINPE-9948123',
      Estado: 'Completado',
      Observaciones: 'Comprobante recibido por WhatsApp'
    },
    {
      PagoID: 2,
      VentaID: 2,
      ClienteID: 2,
      MetodoPagoID: 1, // Efectivo
      FechaPago: '2026-02-20T11:46:00',
      Monto: 12000.00,
      Referencia: 'RECIBO-002',
      Estado: 'Completado',
      Observaciones: 'Efectivo contra entrega'
    },
    {
      PagoID: 3,
      VentaID: 3,
      ClienteID: 3,
      MetodoPagoID: 2, // SINPE
      FechaPago: '2026-02-28T10:00:00',
      Monto: 35000.00,
      Referencia: 'SINPE-104928',
      Estado: 'Completado',
      Observaciones: 'Abono parcial del 50% de la venta #3'
    }
  ],

  CuentasPorCobrar: [
    {
      CuentaID: 1,
      VentaID: 3,
      ClienteID: 3,
      FechaVenta: '2026-02-25T16:10:00',
      FechaVencimiento: '2026-03-12T23:59:59',
      TotalVenta: 75000.00,
      TotalPagado: 35000.00,
      SaldoPendiente: 40000.00, // (75000 - 35000)
      Estado: 'Pendiente',
      Observaciones: 'Saldo pendiente restante de ₡40,000 por cancelar antes del 12 de marzo.'
    }
  ],

  MovimientosStock: [
    {
      MovimientoID: 1,
      ProductoID: 1,
      TipoMovimiento: 'ENTRADA',
      Cantidad: 10.00,
      FechaMovimiento: '2026-02-01T09:35:00',
      CompraID: 1,
      VentaID: null,
      Motivo: 'Ingreso por Compra #1',
      Observaciones: 'Factura FAC-AR-8821'
    },
    {
      MovimientoID: 2,
      ProductoID: 3,
      TipoMovimiento: 'ENTRADA',
      Cantidad: 5.00,
      FechaMovimiento: '2026-02-10T14:05:00',
      CompraID: 2,
      VentaID: null,
      Motivo: 'Ingreso por Compra #2',
      Observaciones: 'Factura FAC-LUX-3401'
    },
    {
      MovimientoID: 3,
      ProductoID: 1,
      TipoMovimiento: 'SALIDA',
      Cantidad: 1.00,
      FechaMovimiento: '2026-02-15T15:20:00',
      CompraID: null,
      VentaID: 1,
      Motivo: 'Venta #1 a Alejandro Morales',
      Observaciones: 'Entregado'
    },
    {
      MovimientoID: 4,
      ProductoID: 5,
      TipoMovimiento: 'SALIDA',
      Cantidad: 1.00,
      FechaMovimiento: '2026-02-20T11:45:00',
      CompraID: null,
      VentaID: 2,
      Motivo: 'Venta #2 Decant 10ml',
      Observaciones: 'Entregado'
    },
    {
      MovimientoID: 5,
      ProductoID: 6,
      TipoMovimiento: 'SALIDA',
      Cantidad: 1.00,
      FechaMovimiento: '2026-02-20T11:45:00',
      CompraID: null,
      VentaID: 2,
      Motivo: 'Venta #2 Decant 5ml',
      Observaciones: 'Entregado'
    },
    {
      MovimientoID: 6,
      ProductoID: 3,
      TipoMovimiento: 'SALIDA',
      Cantidad: 1.00,
      FechaMovimiento: '2026-02-25T16:10:00',
      CompraID: null,
      VentaID: 3,
      Motivo: 'Venta #3 a Carlos Gutiérrez',
      Observaciones: 'A crédito'
    }
  ],

  Gastos: [
    {
      GastoID: 1,
      CategoriaGastoID: 3, // Decants
      ProveedorID: 3,
      MetodoPagoID: 2, // SINPE Móvil
      Descripcion: 'Compra de 100 frascos de vidrio atomizadores de 10ml y 50 de 5ml',
      FechaGasto: '2026-02-05T10:15:00',
      Monto: 35000.00,
      NumeroComprobante: 'REC-FRASCOS-910',
      ComprobanteURL: '',
      Observaciones: 'Insumos para decantación'
    },
    {
      GastoID: 2,
      CategoriaGastoID: 4, // Publicidad
      ProveedorID: null,
      MetodoPagoID: 4, // Tarjeta
      Descripcion: 'Campaña publicitaria en Instagram Reels para el Día de San Valentín',
      FechaGasto: '2026-02-12T08:00:00',
      Monto: 25000.00,
      NumeroComprobante: 'META-ADS-202602',
      ComprobanteURL: '',
      Observaciones: 'Segmentación San José y Heredia'
    },
    {
      GastoID: 3,
      CategoriaGastoID: 6, // Envíos
      ProveedorID: null,
      MetodoPagoID: 2, // SINPE
      Descripcion: 'Envío de paquetes a clientes de Guanacaste y Puntarenas (Correos CR)',
      FechaGasto: '2026-02-16T13:40:00',
      Monto: 6500.00,
      NumeroComprobante: 'GUIA-CCR-77881',
      ComprobanteURL: '',
      Observaciones: 'Servicio Pymexpress'
    }
  ]
};

// Storage service helper
export const db = {
  get: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading DB from localStorage:', e);
      return initialData;
    }
  },

  save: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving DB to localStorage:', e);
    }
  },

  reset: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  },

  exportJSON: () => {
    const data = db.get();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efluvio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.Productos || !parsed.Ventas) {
        throw new Error('Estructura de respaldo inválida.');
      }
      db.save(parsed);
      return true;
    } catch (e) {
      console.error('Error importing JSON:', e);
      return false;
    }
  }
};
