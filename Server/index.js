import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { queryJSON, executeSQL, testConnection } from './db.js';

const app = express();
const PORT = 3001;

const DIST_PATH = path.resolve('c:/Users/Usuario/Documents/Efluvio/Web/dist');
const PRODUCTS_DIR_MASTER = path.resolve('c:/Users/Usuario/Documents/Efluvio/Imagenes/Products');
const PRODUCTS_DIR_WEB = path.resolve('c:/Users/Usuario/Documents/Efluvio/Web/dist/assets/products');

// Ensure all directories exist
if (!fs.existsSync(PRODUCTS_DIR_MASTER)) fs.mkdirSync(PRODUCTS_DIR_MASTER, { recursive: true });
if (!fs.existsSync(PRODUCTS_DIR_WEB)) fs.mkdirSync(PRODUCTS_DIR_WEB, { recursive: true });
if (!fs.existsSync(DIST_PATH)) fs.mkdirSync(DIST_PATH, { recursive: true });

// Multer storage configured for Products folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRODUCTS_DIR_MASTER);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
    const uniqueSuffix = Date.now();
    const finalName = `${base || 'producto'}_${uniqueSuffix}${ext}`;
    cb(null, finalName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

app.use(cors());
app.use(express.json());
app.use('/assets/products', express.static(PRODUCTS_DIR_MASTER));
app.use(express.static(DIST_PATH));

// Helper to escape single quotes in SQL strings
const esc = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const num = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 'NULL';
  return Number(val);
};

// --- GET ALL IMAGES IN PRODUCTS FOLDER ---
app.get('/api/products/images', (req, res) => {
  try {
    const files = fs.readdirSync(PRODUCTS_DIR_MASTER).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
    });

    const list = files.map(f => ({
      filename: f,
      url: `/assets/products/${encodeURIComponent(f)}`
    }));

    res.json({ ok: true, data: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- UPLOAD IMAGE TO PRODUCTS FOLDER ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No se subió ningún archivo' });
    }

    const filename = req.file.filename;
    const masterPath = path.join(PRODUCTS_DIR_MASTER, filename);
    const webPath = path.join(PRODUCTS_DIR_WEB, filename);

    // Sync to web public folder immediately for instant rendering
    fs.copyFileSync(masterPath, webPath);

    res.json({
      ok: true,
      filename,
      url: `/assets/products/${encodeURIComponent(filename)}`
    });
  } catch (err) {
    console.error('Error in /api/upload:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- HEALTH CHECK / STATUS ---
app.get('/api/status', async (req, res) => {
  try {
    const status = await testConnection();
    res.json(status);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- BOOTSTRAP (ALL TABLES IN ONE CALL) ---
app.get('/api/bootstrap', async (req, res) => {
  try {
    // Parallel queries to fetch all 14 tables directly from SQL Server
    const [
      Productos,
      Proveedores,
      Clientes,
      MetodosPago,
      Compras,
      DetalleCompras,
      Ventas,
      DetalleVentas,
      Pagos,
      CuentasPorCobrar,
      MovimientosStock,
      InventarioLiquido,
      CategoriasGastos,
      Gastos
    ] = await Promise.all([
      queryJSON('SELECT * FROM Productos ORDER BY ProductoID DESC'),
      queryJSON('SELECT * FROM Proveedores ORDER BY ProveedorID DESC'),
      queryJSON('SELECT * FROM Clientes ORDER BY ClienteID DESC'),
      queryJSON('SELECT * FROM MetodosPago ORDER BY MetodoPagoID ASC'),
      queryJSON('SELECT * FROM Compras ORDER BY CompraID DESC'),
      queryJSON('SELECT * FROM DetalleCompras ORDER BY DetalleCompraID DESC'),
      queryJSON('SELECT * FROM Ventas ORDER BY VentaID DESC'),
      queryJSON('SELECT * FROM DetalleVentas ORDER BY DetalleVentaID DESC'),
      queryJSON('SELECT * FROM Pagos ORDER BY PagoID DESC'),
      queryJSON('SELECT * FROM CuentasPorCobrar ORDER BY CuentaID DESC'),
      queryJSON('SELECT * FROM MovimientosStock ORDER BY MovimientoID DESC'),
      queryJSON('SELECT * FROM InventarioLiquido ORDER BY InventarioLiquidoID DESC'),
      queryJSON('SELECT * FROM CategoriasGastos ORDER BY CategoriaGastoID ASC'),
      queryJSON('SELECT * FROM Gastos ORDER BY GastoID DESC')
    ]);

    // Calculate dynamic stock for each product based on sum of MovimientosStock
    const stockMap = {};
    for (const mov of MovimientosStock) {
      const pId = mov.ProductoID;
      if (!stockMap[pId]) stockMap[pId] = 0;
      const qty = Number(mov.Cantidad) || 0;
      if (mov.TipoMovimiento === 'ENTRADA' || mov.TipoMovimiento === 'AJUSTE_POSITIVO' || mov.TipoMovimiento === 'DEVOLUCION') {
        stockMap[pId] += qty;
      } else if (mov.TipoMovimiento === 'SALIDA' || mov.TipoMovimiento === 'AJUSTE_NEGATIVO') {
        stockMap[pId] -= qty;
      }
    }

    const productosWithStock = Productos.map(p => ({
      ...p,
      StockActual: Math.max(0, stockMap[p.ProductoID] !== undefined ? stockMap[p.ProductoID] : (p.StockMinimo || 0))
    }));

    res.json({
      ok: true,
      data: {
        Productos: productosWithStock,
        Proveedores,
        Clientes,
        MetodosPago,
        Compras,
        DetalleCompras,
        Ventas,
        DetalleVentas,
        Pagos,
        CuentasPorCobrar,
        MovimientosStock,
        InventarioLiquido,
        CategoriasGastos,
        Gastos
      }
    });
  } catch (err) {
    console.error('Error in /api/bootstrap:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- PRODUCTOS ---
app.post('/api/productos', async (req, res) => {
  try {
    const p = req.body;
    const stockInit = Number(p.StockActual) || 0;

    // Primero insertar el producto usando executeSQL (no FOR JSON)
    const insertSQL = `
      INSERT INTO Productos (Nombre, Marca, Categoria, Genero, Presentacion, ContenidoML, ProveedorID, ImagenURL, CostoUnitario, PrecioVentaUnitario, CostoTotalCompra, PrecioTotalVenta, StockMinimo, Activo)
      VALUES (${esc(p.Nombre)}, ${esc(p.Marca)}, ${esc(p.Categoria)}, ${esc(p.Genero)}, ${esc(p.Presentacion)}, ${num(p.ContenidoML)}, ${p.ProveedorID ? num(p.ProveedorID) : 'NULL'}, ${esc(p.ImagenURL)}, ${num(p.CostoUnitario)}, ${num(p.PrecioVentaUnitario)}, ${num(p.CostoUnitario * stockInit)}, ${num(p.PrecioVentaUnitario * stockInit)}, ${num(p.StockMinimo || 1)}, ${p.Activo ? 1 : 0});
    `;

    await executeSQL(insertSQL);

    // Obtener el ID del producto insertado usando una consulta separada
    const idResult = await queryJSON('SELECT TOP 1 ProductoID FROM Productos ORDER BY ProductoID DESC');
    console.log('ID Result:', idResult);

    if (!idResult || idResult.length === 0) {
      throw new Error('No se pudo obtener el ID del producto insertado');
    }

    const newProdID = idResult[0].ProductoID;

    // Intentar insertar en InventarioLiquido si existe la tabla
    try {
      const inventarioSQL = `
        INSERT INTO InventarioLiquido (ProductoID, ContenidoInicialML, EntradasML, SalidasML, MermaML, Observaciones)
        VALUES (${num(newProdID)}, ${num(Number(p.ContenidoML) * stockInit)}, 0, 0, 0, ${esc('Registro inicial para ' + p.Nombre)});
      `;
      await executeSQL(inventarioSQL);
    } catch (invErr) {
      console.log('Warning: Could not insert into InventarioLiquido:', invErr.message);
    }

    // Registrar movimiento de stock inicial si > 0
    if (stockInit > 0) {
      try {
        const movimientoSQL = `
          INSERT INTO MovimientosStock (ProductoID, TipoMovimiento, Cantidad, Motivo, Observaciones)
          VALUES (${num(newProdID)}, 'ENTRADA', ${stockInit}, 'Inventario Inicial', 'Carga inicial en catálogo');
        `;
        await executeSQL(movimientoSQL);
      } catch (movErr) {
        console.log('Warning: Could not insert stock movement:', movErr.message);
      }
    }

    // Obtener el producto insertado
    const result = await queryJSON(`SELECT * FROM Productos WHERE ProductoID = ${num(newProdID)}`);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    console.error('Error in POST /api/productos:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.put('/api/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;

    const sql = `
      UPDATE Productos SET
        Nombre = ${esc(p.Nombre)},
        Marca = ${esc(p.Marca)},
        Categoria = ${esc(p.Categoria)},
        Genero = ${esc(p.Genero)},
        Presentacion = ${esc(p.Presentacion)},
        ContenidoML = ${num(p.ContenidoML)},
        ProveedorID = ${p.ProveedorID ? num(p.ProveedorID) : 'NULL'},
        ImagenURL = ${esc(p.ImagenURL)},
        CostoUnitario = ${num(p.CostoUnitario)},
        PrecioVentaUnitario = ${num(p.PrecioVentaUnitario)},
        StockMinimo = ${num(p.StockMinimo || 1)},
        Activo = ${p.Activo ? 1 : 0}
      WHERE ProductoID = ${num(id)};

      SELECT * FROM Productos WHERE ProductoID = ${num(id)};
    `;

    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    console.error('Error in PUT /api/productos:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Logical delete: set Activo = 0 to preserve foreign keys
    await executeSQL(`UPDATE Productos SET Activo = 0 WHERE ProductoID = ${num(id)};`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- INVENTARIO LÍQUIDO (DECANTS) ---
app.post('/api/inventario-liquido/extraer', async (req, res) => {
  try {
    const { productoID, ml, motivo } = req.body;
    const sql = `
      UPDATE InventarioLiquido SET
        SalidasML = SalidasML + ${num(ml)},
        FechaActualizacion = GETDATE(),
        Observaciones = CONCAT(ISNULL(Observaciones, ''), ' | Extracción ', ${num(ml)}, 'ml: ', ${esc(motivo || 'Decant')})
      WHERE ProductoID = ${num(productoID)};

      SELECT * FROM InventarioLiquido WHERE ProductoID = ${num(productoID)};
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/inventario-liquido/merma', async (req, res) => {
  try {
    const { productoID, ml, motivo } = req.body;
    const sql = `
      UPDATE InventarioLiquido SET
        MermaML = MermaML + ${num(ml)},
        FechaActualizacion = GETDATE(),
        Observaciones = CONCAT(ISNULL(Observaciones, ''), ' | Merma ', ${num(ml)}, 'ml: ', ${esc(motivo || 'Evaporación')})
      WHERE ProductoID = ${num(productoID)};

      SELECT * FROM InventarioLiquido WHERE ProductoID = ${num(productoID)};
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- VENTAS & POS (TRANSACTION) ---
app.post('/api/ventas', async (req, res) => {
  try {
    const {
      clienteID,
      items,
      subtotal,
      descuento = 0,
      impuestos = 0,
      observaciones = '',
      metodoPagoID = 1,
      esCredito = false,
      pagoInicial = 0,
      diasCredito = 15
    } = req.body;

    const totalVenta = Math.max(0, Number(subtotal) - Number(descuento) + Number(impuestos));

    let tsql = `
      BEGIN TRANSACTION;

      INSERT INTO Ventas (ClienteID, Subtotal, Descuento, Impuestos, TotalVenta, Estado, Observaciones)
      VALUES (${clienteID ? num(clienteID) : 'NULL'}, ${num(subtotal)}, ${num(descuento)}, ${num(impuestos)}, ${num(totalVenta)}, 'Completada', ${esc(observaciones)});

      DECLARE @NewVentaID INT = SCOPE_IDENTITY();
    `;

    // DetalleVentas and MovimientosStock
    for (const it of items) {
      tsql += `
        INSERT INTO DetalleVentas (VentaID, ProductoID, Cantidad, PrecioUnitario, Descuento)
        VALUES (@NewVentaID, ${num(it.ProductoID)}, ${num(it.cantidad)}, ${num(it.PrecioVentaUnitario)}, ${num(it.descuento || 0)});

        INSERT INTO MovimientosStock (ProductoID, TipoMovimiento, Cantidad, VentaID, Motivo, Observaciones)
        VALUES (${num(it.ProductoID)}, 'SALIDA', ${num(it.cantidad)}, @NewVentaID, CONCAT('Venta #', @NewVentaID), ${esc(clienteID ? 'Cliente #' + clienteID : 'Venta mostrador')});
      `;
    }

    if (esCredito) {
      const vDate = new Date();
      vDate.setDate(vDate.getDate() + Number(diasCredito));
      const vDateStr = vDate.toISOString().slice(0, 19).replace('T', ' ');
      const abono = Math.min(totalVenta, Number(pagoInicial) || 0);

      tsql += `
        INSERT INTO CuentasPorCobrar (VentaID, ClienteID, FechaVenta, FechaVencimiento, TotalVenta, TotalPagado, Estado, Observaciones)
        VALUES (@NewVentaID, ${num(clienteID)}, GETDATE(), '${vDateStr}', ${num(totalVenta)}, ${num(abono)}, '${abono >= totalVenta ? 'Pagada' : (abono > 0 ? 'Parcial' : 'Pendiente')}', ${esc('Venta a crédito. ' + observaciones)});
      `;

      if (abono > 0) {
        tsql += `
          INSERT INTO Pagos (VentaID, ClienteID, MetodoPagoID, Monto, Referencia, Estado, Observaciones)
          VALUES (@NewVentaID, ${num(clienteID)}, ${num(metodoPagoID)}, ${num(abono)}, 'Abono Inicial Venta', 'Completado', 'Prima de venta a crédito');
        `;
      }
    } else {
      // Immediate Cash/SINPE payment
      tsql += `
        INSERT INTO Pagos (VentaID, ClienteID, MetodoPagoID, Monto, Referencia, Estado, Observaciones)
        VALUES (@NewVentaID, ${clienteID ? num(clienteID) : 'NULL'}, ${num(metodoPagoID)}, ${num(totalVenta)}, 'Pago Inmediato POS', 'Completado', 'Pago en caja');
      `;
    }

    tsql += `
      COMMIT TRANSACTION;
      SELECT * FROM Ventas WHERE VentaID = @NewVentaID;
    `;

    const result = await queryJSON(tsql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    console.error('Error in POST /api/ventas:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- COMPRAS A PROVEEDORES ---
app.post('/api/compras', async (req, res) => {
  try {
    const { proveedorID, numeroFactura, items, descuento = 0, impuestos = 0, observaciones = '' } = req.body;
    const subtotal = items.reduce((acc, it) => acc + (Number(it.cantidad) * Number(it.costoUnitario)), 0);
    const totalCompra = Math.max(0, subtotal - Number(descuento) + Number(impuestos));

    let tsql = `
      BEGIN TRANSACTION;

      INSERT INTO Compras (ProveedorID, NumeroFactura, Subtotal, Descuento, Impuestos, TotalCompra, Estado, Observaciones)
      VALUES (${num(proveedorID)}, ${esc(numeroFactura || 'S/N')}, ${num(subtotal)}, ${num(descuento)}, ${num(impuestos)}, ${num(totalCompra)}, 'Completada', ${esc(observaciones)});

      DECLARE @NewCompraID INT = SCOPE_IDENTITY();
    `;

    for (const it of items) {
      tsql += `
        INSERT INTO DetalleCompras (CompraID, ProductoID, Cantidad, CostoUnitario, Descuento)
        VALUES (@NewCompraID, ${num(it.ProductoID)}, ${num(it.cantidad)}, ${num(it.costoUnitario)}, ${num(it.descuento || 0)});

        INSERT INTO MovimientosStock (ProductoID, TipoMovimiento, Cantidad, CompraID, Motivo, Observaciones)
        VALUES (${num(it.ProductoID)}, 'ENTRADA', ${num(it.cantidad)}, @NewCompraID, CONCAT('Compra #', @NewCompraID), ${esc('Factura: ' + (numeroFactura || 'N/A'))});

        -- Update product CostoUnitario
        UPDATE Productos SET CostoUnitario = ${num(it.costoUnitario)} WHERE ProductoID = ${num(it.ProductoID)};

        -- Update InventarioLiquido if product has ContenidoML
        UPDATE InventarioLiquido SET
          EntradasML = EntradasML + (${num(it.cantidad)} * (SELECT ContenidoML FROM Productos WHERE ProductoID = ${num(it.ProductoID)})),
          FechaActualizacion = GETDATE()
        WHERE ProductoID = ${num(it.ProductoID)};
      `;
    }

    tsql += `
      COMMIT TRANSACTION;
      SELECT * FROM Compras WHERE CompraID = @NewCompraID;
    `;

    const result = await queryJSON(tsql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    console.error('Error in POST /api/compras:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- PAGOS & ABONOS ---
app.post('/api/pagos', async (req, res) => {
  try {
    const { ventaID, clienteID, metodoPagoID, monto, referencia = '', observaciones = '' } = req.body;
    const montoNum = Number(monto) || 0;

    const sql = `
      BEGIN TRANSACTION;

      INSERT INTO Pagos (VentaID, ClienteID, MetodoPagoID, Monto, Referencia, Estado, Observaciones)
      VALUES (${num(ventaID)}, ${clienteID ? num(clienteID) : 'NULL'}, ${num(metodoPagoID)}, ${num(montoNum)}, ${esc(referencia)}, 'Completado', ${esc(observaciones)});

      -- Update CuentasPorCobrar
      UPDATE CuentasPorCobrar SET
        TotalPagado = TotalPagado + ${num(montoNum)},
        Estado = CASE WHEN (TotalVenta - (TotalPagado + ${num(montoNum)})) <= 0 THEN 'Pagada' ELSE 'Parcial' END
      WHERE VentaID = ${num(ventaID)};

      COMMIT TRANSACTION;

      SELECT TOP 1 * FROM Pagos ORDER BY PagoID DESC;
    `;

    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- GASTOS ---
app.post('/api/gastos', async (req, res) => {
  try {
    const g = req.body;
    const sql = `
      INSERT INTO Gastos (CategoriaGastoID, ProveedorID, MetodoPagoID, Descripcion, Monto, NumeroComprobante, ComprobanteURL, Observaciones)
      VALUES (${num(g.CategoriaGastoID)}, ${g.ProveedorID ? num(g.ProveedorID) : 'NULL'}, ${g.MetodoPagoID ? num(g.MetodoPagoID) : 'NULL'}, ${esc(g.Descripcion)}, ${num(g.Monto)}, ${esc(g.NumeroComprobante)}, ${esc(g.ComprobanteURL)}, ${esc(g.Observaciones)});

      SELECT TOP 1 * FROM Gastos ORDER BY GastoID DESC;
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/gastos/:id', async (req, res) => {
  try {
    await executeSQL(`DELETE FROM Gastos WHERE GastoID = ${num(req.params.id)};`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- MOVIMIENTOS STOCK MANUAL ---
app.post('/api/movimientos', async (req, res) => {
  try {
    const { productoID, tipoMovimiento, cantidad, motivo, observaciones = '' } = req.body;
    const sql = `
      INSERT INTO MovimientosStock (ProductoID, TipoMovimiento, Cantidad, Motivo, Observaciones)
      VALUES (${num(productoID)}, ${esc(tipoMovimiento)}, ${num(cantidad)}, ${esc(motivo)}, ${esc(observaciones)});

      SELECT TOP 1 * FROM MovimientosStock ORDER BY MovimientoID DESC;
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- CONTACTOS ---
app.post('/api/contactos/proveedores', async (req, res) => {
  try {
    const p = req.body;
    const sql = `
      INSERT INTO Proveedores (Nombre, Telefono, Email, Direccion, TipoProveedor, Notas, Activo)
      VALUES (${esc(p.Nombre)}, ${esc(p.Telefono)}, ${esc(p.Email)}, ${esc(p.Direccion)}, ${esc(p.TipoProveedor)}, ${esc(p.Notas)}, 1);
      SELECT TOP 1 * FROM Proveedores ORDER BY ProveedorID DESC;
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/contactos/clientes', async (req, res) => {
  try {
    const c = req.body;
    const sql = `
      INSERT INTO Clientes (Nombre, Telefono, Email, Direccion, Notas, Activo)
      VALUES (${esc(c.Nombre)}, ${esc(c.Telefono)}, ${esc(c.Email)}, ${esc(c.Direccion)}, ${esc(c.Notas)}, 1);
      SELECT TOP 1 * FROM Clientes ORDER BY ClienteID DESC;
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- CATALOGOS ---
app.post('/api/catalogos/metodos', async (req, res) => {
  try {
    const { Metodo, Descripcion } = req.body;
    const sql = `
      INSERT INTO MetodosPago (Metodo, Descripcion, Activo)
      VALUES (${esc(Metodo)}, ${esc(Descripcion)}, 1);
      SELECT TOP 1 * FROM MetodosPago ORDER BY MetodoPagoID DESC;
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/catalogos/categorias', async (req, res) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const sql = `
      INSERT INTO CategoriasGastos (Nombre, Descripcion, Activo)
      VALUES (${esc(Nombre)}, ${esc(Descripcion)}, 1);
      SELECT TOP 1 * FROM CategoriasGastos ORDER BY CategoriaGastoID DESC;
    `;
    const result = await queryJSON(sql);
    res.json({ ok: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- DELETE CATÁLOGOS ---
app.delete('/api/catalogos/metodos/:id', async (req, res) => {
  try {
    await executeSQL(`UPDATE MetodosPago SET Activo = 0 WHERE MetodoPagoID = ${num(req.params.id)};`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/catalogos/categorias/:id', async (req, res) => {
  try {
    await executeSQL(`UPDATE CategoriasGastos SET Activo = 0 WHERE CategoriaGastoID = ${num(req.params.id)};`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- SEED INICIAL (Poblar BD física con fragancias iniciales si está vacía) ---
app.post('/api/seed-inicial', async (req, res) => {
  try {
    const tsql = `
      BEGIN TRANSACTION;

      -- 1. Insertar Proveedores si no hay
      IF NOT EXISTS (SELECT 1 FROM Proveedores)
      BEGIN
        INSERT INTO Proveedores (Nombre, Telefono, Email, Direccion, TipoProveedor, Notas, Activo)
        VALUES 
        ('Distribuidora Aromas del Golfo S.A.', '+506 2222-3344', 'contacto@aromasdelgolfo.com', 'San José, Paseo Colón #1420', 'Distribuidor Mayorista', 'Proveedor oficial marcas árabes', 1),
        ('Fragrance Imports Luxury Corp', '+506 8877-6655', 'ventas@luxurylat.com', 'Escazú Corporate Center', 'Importador Directo', 'Perfumería de diseñador', 1),
        ('Insumos & Frascos Decant CR', '+506 7011-2233', 'pedidos@decantsfrascoscr.com', 'Alajuela, El Coyol', 'Insumos y Empaques', 'Frascos atomizadores 3ml, 5ml, 10ml', 1);
      END;

      -- 2. Insertar Clientes si no hay
      IF NOT EXISTS (SELECT 1 FROM Clientes)
      BEGIN
        INSERT INTO Clientes (Nombre, Telefono, Email, Direccion, Notas, Activo)
        VALUES 
        ('Alejandro Morales Mora', '+506 8345-6789', 'amorales@gmail.com', 'Curridabat, Residencial del Monte', 'Coleccionista de fragancias orientales', 1),
        ('Valeria Castro Fonseca', '+506 8765-4321', 'valeria.castro@outlook.com', 'Heredia Centro', 'Prefiere decants de 5ml', 1),
        ('Carlos Andrés Gutiérrez', '+506 8912-3456', 'carlos.gutierrez@empresa.cr', 'Santa Ana, Lindora', 'Cliente recurrente JPG y Bharara', 1);
      END;

      -- 3. Insertar Productos si no hay
      IF NOT EXISTS (SELECT 1 FROM Productos)
      BEGIN
        INSERT INTO Productos (Nombre, Marca, Categoria, Genero, Presentacion, ContenidoML, ProveedorID, ImagenURL, CostoUnitario, PrecioVentaUnitario, StockMinimo, Activo)
        VALUES 
        ('Club de Nuit Intense Man EDP', 'Armaf', 'Perfume Árabe', 'Hombre', 'Botella 105ml', 105.00, 1, '/assets/banners/armafBanner1.webp', 24000.00, 38000.00, 3, 1),
        ('King Parfum', 'Bharara', 'Nicho / Premium', 'Unisex', 'Botella 100ml', 100.00, 1, '/assets/banners/baharaBanner1.webp', 42000.00, 65000.00, 2, 1),
        ('Ultra Male EDT Intense', 'Jean Paul Gaultier', 'Diseñador', 'Hombre', 'Botella 125ml', 125.00, 2, '/assets/banners/jpgBanner1.webp', 52000.00, 78000.00, 2, 1),
        ('Khamrah EDP', 'Lattafa', 'Gourmand / Oriental', 'Unisex', 'Botella 100ml', 100.00, 1, '/assets/banners/lattafaBanner1.webp', 22000.00, 35000.00, 3, 1),
        ('Decant 10ml - Club de Nuit Intense', 'Armaf', 'Decant', 'Hombre', 'Atomizador 10ml', 10.00, 1, '/assets/banners/armafBanner2.webp', 3200.00, 6500.00, 5, 1),
        ('Decant 5ml - Bharara King', 'Bharara', 'Decant', 'Unisex', 'Atomizador 5ml', 5.00, 1, '/assets/banners/baharaBanner2.webp', 2800.00, 5500.00, 4, 1);

        -- Stock inicial y frascos de decant
        INSERT INTO MovimientosStock (ProductoID, TipoMovimiento, Cantidad, Motivo, Observaciones)
        SELECT ProductoID, 'ENTRADA', 8, 'Inventario Inicial', 'Carga inicial' FROM Productos;

        INSERT INTO InventarioLiquido (ProductoID, ContenidoInicialML, EntradasML, SalidasML, MermaML, Observaciones)
        SELECT ProductoID, ContenidoML * 8, 0, 0, 0, 'Botella matriz para fraccionamiento' FROM Productos;
      END;

      COMMIT TRANSACTION;
    `;

    await executeSQL(tsql);
    res.json({ ok: true, message: 'Datos iniciales sembrados en SQL Server con éxito' });
  } catch (err) {
    console.error('Error in /api/seed-inicial:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API de Efluvio corriendo en http://localhost:${PORT}`);
  console.log(`📡 Conectado directamente a SQL Server [DESKTOP-S6VR4T8\\SQLEXPRESS]`);
});
