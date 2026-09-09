// T-SQL Exporter for Microsoft SQL Server 'efluvio' database

const escapeSqlString = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'NULL';
  return Number(num).toFixed(2);
};

const formatInt = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'NULL';
  return parseInt(num, 10);
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'GETDATE()';
  // SQL Server standard datetime format 'YYYY-MM-DD HH:mm:ss'
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'GETDATE()';
  return `'${d.toISOString().replace('T', ' ').substring(0, 19)}'`;
};

export const generateSQLScript = (data) => {
  let sql = `-- =============================================\n`;
  sql += `-- SCRIPT DE INSERCIÓN DE DATOS PARA EFLUVIO\n`;
  sql += `-- Base de Datos: efluvio (SQL Server)\n`;
  sql += `-- Fecha de generación: ${new Date().toLocaleString('es-CR')}\n`;
  sql += `-- =============================================\n\n`;
  sql += `USE [efluvio];\nGO\n\n`;

  // 1. MetodosPago
  if (data.MetodosPago && data.MetodosPago.length > 0) {
    sql += `-- 1. MÉTODOS DE PAGO\n`;
    sql += `SET IDENTITY_INSERT [dbo].[MetodosPago] ON;\n`;
    for (const item of data.MetodosPago) {
      sql += `INSERT INTO [dbo].[MetodosPago] ([MetodoPagoID], [Metodo], [Descripcion], [Activo], [FechaRegistro]) VALUES (${formatInt(item.MetodoPagoID)}, ${escapeSqlString(item.Metodo)}, ${escapeSqlString(item.Descripcion)}, ${item.Activo ? 1 : 0}, ${formatDate(item.FechaRegistro)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[MetodosPago] OFF;\nGO\n\n`;
  }

  // 2. CategoriasGastos
  if (data.CategoriasGastos && data.CategoriasGastos.length > 0) {
    sql += `-- 2. CATEGORÍAS DE GASTOS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[CategoriasGastos] ON;\n`;
    for (const item of data.CategoriasGastos) {
      sql += `INSERT INTO [dbo].[CategoriasGastos] ([CategoriaGastoID], [Nombre], [Descripcion], [Activo], [FechaRegistro]) VALUES (${formatInt(item.CategoriaGastoID)}, ${escapeSqlString(item.Nombre)}, ${escapeSqlString(item.Descripcion)}, ${item.Activo ? 1 : 0}, ${formatDate(item.FechaRegistro)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[CategoriasGastos] OFF;\nGO\n\n`;
  }

  // 3. Proveedores
  if (data.Proveedores && data.Proveedores.length > 0) {
    sql += `-- 3. PROVEEDORES\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Proveedores] ON;\n`;
    for (const item of data.Proveedores) {
      sql += `INSERT INTO [dbo].[Proveedores] ([ProveedorID], [Nombre], [Telefono], [Email], [Direccion], [TipoProveedor], [Notas], [Activo], [FechaRegistro]) VALUES (${formatInt(item.ProveedorID)}, ${escapeSqlString(item.Nombre)}, ${escapeSqlString(item.Telefono)}, ${escapeSqlString(item.Email)}, ${escapeSqlString(item.Direccion)}, ${escapeSqlString(item.TipoProveedor)}, ${escapeSqlString(item.Notas)}, ${item.Activo ? 1 : 0}, ${formatDate(item.FechaRegistro)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Proveedores] OFF;\nGO\n\n`;
  }

  // 4. Clientes
  if (data.Clientes && data.Clientes.length > 0) {
    sql += `-- 4. CLIENTES\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Clientes] ON;\n`;
    for (const item of data.Clientes) {
      sql += `INSERT INTO [dbo].[Clientes] ([ClienteID], [Nombre], [Telefono], [Email], [Direccion], [Notas], [Activo], [FechaRegistro]) VALUES (${formatInt(item.ClienteID)}, ${escapeSqlString(item.Nombre)}, ${escapeSqlString(item.Telefono)}, ${escapeSqlString(item.Email)}, ${escapeSqlString(item.Direccion)}, ${escapeSqlString(item.Notas)}, ${item.Activo ? 1 : 0}, ${formatDate(item.FechaRegistro)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Clientes] OFF;\nGO\n\n`;
  }

  // 5. Productos (Note: GananciaUnitario is PERSISTED computed column, DO NOT insert it)
  if (data.Productos && data.Productos.length > 0) {
    sql += `-- 5. PRODUCTOS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Productos] ON;\n`;
    for (const item of data.Productos) {
      sql += `INSERT INTO [dbo].[Productos] ([ProductoID], [Nombre], [Marca], [Categoria], [Genero], [Presentacion], [ContenidoML], [ProveedorID], [ImagenURL], [CostoUnitario], [PrecioVentaUnitario], [CostoTotalCompra], [PrecioTotalVenta], [StockMinimo], [Activo], [FechaRegistro]) VALUES (${formatInt(item.ProductoID)}, ${escapeSqlString(item.Nombre)}, ${escapeSqlString(item.Marca)}, ${escapeSqlString(item.Categoria)}, ${escapeSqlString(item.Genero)}, ${escapeSqlString(item.Presentacion)}, ${formatNumber(item.ContenidoML)}, ${item.ProveedorID ? formatInt(item.ProveedorID) : 'NULL'}, ${escapeSqlString(item.ImagenURL)}, ${formatNumber(item.CostoUnitario)}, ${formatNumber(item.PrecioVentaUnitario)}, ${item.CostoTotalCompra ? formatNumber(item.CostoTotalCompra) : 'NULL'}, ${item.PrecioTotalVenta ? formatNumber(item.PrecioTotalVenta) : 'NULL'}, ${formatInt(item.StockMinimo || 1)}, ${item.Activo ? 1 : 0}, ${formatDate(item.FechaRegistro)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Productos] OFF;\nGO\n\n`;
  }

  // 6. InventarioLiquido (Note: DisponibleML is PERSISTED computed column)
  if (data.InventarioLiquido && data.InventarioLiquido.length > 0) {
    sql += `-- 6. INVENTARIO LÍQUIDO\n`;
    sql += `SET IDENTITY_INSERT [dbo].[InventarioLiquido] ON;\n`;
    for (const item of data.InventarioLiquido) {
      sql += `INSERT INTO [dbo].[InventarioLiquido] ([InventarioLiquidoID], [ProductoID], [ContenidoInicialML], [EntradasML], [SalidasML], [MermaML], [FechaActualizacion], [Observaciones]) VALUES (${formatInt(item.InventarioLiquidoID)}, ${formatInt(item.ProductoID)}, ${formatNumber(item.ContenidoInicialML)}, ${formatNumber(item.EntradasML)}, ${formatNumber(item.SalidasML)}, ${formatNumber(item.MermaML)}, ${formatDate(item.FechaActualizacion)}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[InventarioLiquido] OFF;\nGO\n\n`;
  }

  // 7. Compras
  if (data.Compras && data.Compras.length > 0) {
    sql += `-- 7. COMPRAS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Compras] ON;\n`;
    for (const item of data.Compras) {
      sql += `INSERT INTO [dbo].[Compras] ([CompraID], [ProveedorID], [FechaCompra], [NumeroFactura], [Subtotal], [Descuento], [Impuestos], [TotalCompra], [Estado], [Observaciones]) VALUES (${formatInt(item.CompraID)}, ${formatInt(item.ProveedorID)}, ${formatDate(item.FechaCompra)}, ${escapeSqlString(item.NumeroFactura)}, ${formatNumber(item.Subtotal)}, ${formatNumber(item.Descuento)}, ${formatNumber(item.Impuestos)}, ${formatNumber(item.TotalCompra)}, ${escapeSqlString(item.Estado || 'Completada')}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Compras] OFF;\nGO\n\n`;
  }

  // 8. DetalleCompras (Note: Subtotal is PERSISTED computed column)
  if (data.DetalleCompras && data.DetalleCompras.length > 0) {
    sql += `-- 8. DETALLE COMPRAS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[DetalleCompras] ON;\n`;
    for (const item of data.DetalleCompras) {
      sql += `INSERT INTO [dbo].[DetalleCompras] ([DetalleCompraID], [CompraID], [ProductoID], [Cantidad], [CostoUnitario], [Descuento]) VALUES (${formatInt(item.DetalleCompraID)}, ${formatInt(item.CompraID)}, ${formatInt(item.ProductoID)}, ${formatInt(item.Cantidad)}, ${formatNumber(item.CostoUnitario)}, ${formatNumber(item.Descuento || 0)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[DetalleCompras] OFF;\nGO\n\n`;
  }

  // 9. Ventas
  if (data.Ventas && data.Ventas.length > 0) {
    sql += `-- 9. VENTAS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Ventas] ON;\n`;
    for (const item of data.Ventas) {
      sql += `INSERT INTO [dbo].[Ventas] ([VentaID], [ClienteID], [FechaVenta], [Subtotal], [Descuento], [Impuestos], [TotalVenta], [Estado], [Observaciones]) VALUES (${formatInt(item.VentaID)}, ${item.ClienteID ? formatInt(item.ClienteID) : 'NULL'}, ${formatDate(item.FechaVenta)}, ${formatNumber(item.Subtotal)}, ${formatNumber(item.Descuento)}, ${formatNumber(item.Impuestos)}, ${formatNumber(item.TotalVenta)}, ${escapeSqlString(item.Estado || 'Completada')}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Ventas] OFF;\nGO\n\n`;
  }

  // 10. DetalleVentas (Note: Subtotal is PERSISTED computed column)
  if (data.DetalleVentas && data.DetalleVentas.length > 0) {
    sql += `-- 10. DETALLE VENTAS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[DetalleVentas] ON;\n`;
    for (const item of data.DetalleVentas) {
      sql += `INSERT INTO [dbo].[DetalleVentas] ([DetalleVentaID], [VentaID], [ProductoID], [Cantidad], [PrecioUnitario], [Descuento]) VALUES (${formatInt(item.DetalleVentaID)}, ${formatInt(item.VentaID)}, ${formatInt(item.ProductoID)}, ${formatNumber(item.Cantidad)}, ${formatNumber(item.PrecioUnitario)}, ${formatNumber(item.Descuento || 0)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[DetalleVentas] OFF;\nGO\n\n`;
  }

  // 11. Pagos
  if (data.Pagos && data.Pagos.length > 0) {
    sql += `-- 11. PAGOS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Pagos] ON;\n`;
    for (const item of data.Pagos) {
      sql += `INSERT INTO [dbo].[Pagos] ([PagoID], [VentaID], [ClienteID], [MetodoPagoID], [FechaPago], [Monto], [Referencia], [Estado], [Observaciones]) VALUES (${formatInt(item.PagoID)}, ${formatInt(item.VentaID)}, ${item.ClienteID ? formatInt(item.ClienteID) : 'NULL'}, ${formatInt(item.MetodoPagoID)}, ${formatDate(item.FechaPago)}, ${formatNumber(item.Monto)}, ${escapeSqlString(item.Referencia)}, ${escapeSqlString(item.Estado || 'Completado')}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Pagos] OFF;\nGO\n\n`;
  }

  // 12. CuentasPorCobrar (Note: SaldoPendiente is PERSISTED computed column)
  if (data.CuentasPorCobrar && data.CuentasPorCobrar.length > 0) {
    sql += `-- 12. CUENTAS POR COBRAR\n`;
    sql += `SET IDENTITY_INSERT [dbo].[CuentasPorCobrar] ON;\n`;
    for (const item of data.CuentasPorCobrar) {
      sql += `INSERT INTO [dbo].[CuentasPorCobrar] ([CuentaID], [VentaID], [ClienteID], [FechaVenta], [FechaVencimiento], [TotalVenta], [TotalPagado], [Estado], [Observaciones]) VALUES (${formatInt(item.CuentaID)}, ${formatInt(item.VentaID)}, ${formatInt(item.ClienteID)}, ${formatDate(item.FechaVenta)}, ${item.FechaVencimiento ? formatDate(item.FechaVencimiento) : 'NULL'}, ${formatNumber(item.TotalVenta)}, ${formatNumber(item.TotalPagado)}, ${escapeSqlString(item.Estado || 'Pendiente')}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[CuentasPorCobrar] OFF;\nGO\n\n`;
  }

  // 13. MovimientosStock
  if (data.MovimientosStock && data.MovimientosStock.length > 0) {
    sql += `-- 13. MOVIMIENTOS DE STOCK\n`;
    sql += `SET IDENTITY_INSERT [dbo].[MovimientosStock] ON;\n`;
    for (const item of data.MovimientosStock) {
      sql += `INSERT INTO [dbo].[MovimientosStock] ([MovimientoID], [ProductoID], [TipoMovimiento], [Cantidad], [FechaMovimiento], [CompraID], [VentaID], [Motivo], [Observaciones]) VALUES (${formatInt(item.MovimientoID)}, ${formatInt(item.ProductoID)}, ${escapeSqlString(item.TipoMovimiento)}, ${formatNumber(item.Cantidad)}, ${formatDate(item.FechaMovimiento)}, ${item.CompraID ? formatInt(item.CompraID) : 'NULL'}, ${item.VentaID ? formatInt(item.VentaID) : 'NULL'}, ${escapeSqlString(item.Motivo)}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[MovimientosStock] OFF;\nGO\n\n`;
  }

  // 14. Gastos
  if (data.Gastos && data.Gastos.length > 0) {
    sql += `-- 14. GASTOS\n`;
    sql += `SET IDENTITY_INSERT [dbo].[Gastos] ON;\n`;
    for (const item of data.Gastos) {
      sql += `INSERT INTO [dbo].[Gastos] ([GastoID], [CategoriaGastoID], [ProveedorID], [MetodoPagoID], [Descripcion], [FechaGasto], [Monto], [NumeroComprobante], [ComprobanteURL], [Observaciones]) VALUES (${formatInt(item.GastoID)}, ${formatInt(item.CategoriaGastoID)}, ${item.ProveedorID ? formatInt(item.ProveedorID) : 'NULL'}, ${item.MetodoPagoID ? formatInt(item.MetodoPagoID) : 'NULL'}, ${escapeSqlString(item.Descripcion)}, ${formatDate(item.FechaGasto)}, ${formatNumber(item.Monto)}, ${escapeSqlString(item.NumeroComprobante)}, ${escapeSqlString(item.ComprobanteURL)}, ${escapeSqlString(item.Observaciones)});\n`;
    }
    sql += `SET IDENTITY_INSERT [dbo].[Gastos] OFF;\nGO\n\n`;
  }

  return sql;
};

export const downloadSQLScript = (data) => {
  const sqlContent = generateSQLScript(data);
  const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `efluvio_seed_${new Date().toISOString().slice(0, 10)}.sql`;
  a.click();
  URL.revokeObjectURL(url);
};
