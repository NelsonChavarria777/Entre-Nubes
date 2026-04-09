import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const DATA_PATH  = join(__dirname, "data/productos.json");

const leerProductos  = () => JSON.parse(readFileSync(DATA_PATH, "utf-8"));
const guardarProductos = (data) => writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// Configuración de email - usar variables de entorno o valores por defecto
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || "entrenubessmokeshop@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "nrwn iyre zjnd vjqf";
const EMAIL_TO = process.env.EMAIL_TO || "aaronchavarria.ctpa@gmail.com";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.use("/images", express.static(join(__dirname, "data/images")));

// GET todos
app.get("/api/productos", (req, res) => {
  res.json(leerProductos());
});

// GET uno
app.get("/api/productos/:id", (req, res) => {
  const productos = leerProductos();
  const producto  = productos.find(p => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});

// POST crear
app.post("/api/productos", (req, res) => {
  const productos  = leerProductos();
  const nuevoId    = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  const nuevo      = { id: nuevoId, ...req.body };
  productos.push(nuevo);
  guardarProductos(productos);
  res.status(201).json(nuevo);
});

// PUT editar
app.put("/api/productos/:id", (req, res) => {
  const productos = leerProductos();
  const index     = productos.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
  productos[index] = { ...productos[index], ...req.body };
  guardarProductos(productos);
  res.json(productos[index]);
});

// DELETE eliminar
app.delete("/api/productos/:id", (req, res) => {
  const productos   = leerProductos();
  const filtrados   = productos.filter(p => p.id !== Number(req.params.id));
  if (filtrados.length === productos.length) return res.status(404).json({ error: "Producto no encontrado" });
  guardarProductos(filtrados);
  res.json({ mensaje: "Producto eliminado" });
});

// POST enviar pedido por email
app.post("/api/send-order", async (req, res) => {
  try {
    const { customer, items, subtotal, shipping, total } = req.body;

    // Generar HTML del pedido
    const itemsHtml = items.map((item, index) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}${item.variant ? ` <span style="color: #666;">(${item.variant})</span>` : ""}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₡${Math.round(item.price).toLocaleString("es-CR")}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₡${Math.round(item.price * item.qty).toLocaleString("es-CR")}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; border-bottom: 2px solid #8DC63F; padding-bottom: 10px;">
          🛒 Nuevo Pedido - Entre Nubes
        </h2>
        
        <h3 style="color: #333; margin-top: 20px;">Datos del Cliente</h3>
        <table style="width: 100%; background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <tr><td style="padding: 5px 0;"><strong>Nombre:</strong></td><td>${customer.nombre} ${customer.apellido}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Cédula:</strong></td><td>${customer.cedula}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${customer.email}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Teléfono:</strong></td><td>${customer.telefono}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>WhatsApp:</strong></td><td>${customer.whatsapp}</td></tr>
        </table>

        <h3 style="color: #333; margin-top: 20px;">Productos</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #111; color: white;">
              <th style="padding: 10px; text-align: left;">#</th>
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cant.</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0;"><strong>Subtotal:</strong></td>
              <td style="text-align: right;">₡${Math.round(subtotal).toLocaleString("es-CR")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Envío:</strong></td>
              <td style="text-align: right;">${shipping === 0 ? "Gratis" : "₡" + Math.round(shipping).toLocaleString("es-CR")}</td>
            </tr>
            <tr style="font-size: 18px; color: #111;">
              <td style="padding: 10px 0; border-top: 2px solid #ddd;"><strong>TOTAL:</strong></td>
              <td style="text-align: right; padding: 10px 0; border-top: 2px solid #ddd;">
                <strong>₡${Math.round(total).toLocaleString("es-CR")}</strong>
              </td>
            </tr>
          </table>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
          Este pedido fue generado desde la tienda online Entre Nubes
        </p>
      </div>
    `;

    const textContent = `
Nuevo Pedido - Entre Nubes

Datos del Cliente:
Nombre: ${customer.nombre} ${customer.apellido}
Cédula: ${customer.cedula}
Email: ${customer.email}
Teléfono: ${customer.telefono}
WhatsApp: ${customer.whatsapp}

Productos:
${items.map((item, i) => `${i + 1}. ${item.name}${item.variant ? ` (${item.variant})` : ""} - ${item.qty}x ₡${Math.round(item.price).toLocaleString("es-CR")} = ₡${Math.round(item.price * item.qty).toLocaleString("es-CR")}`).join("\n")}

Subtotal: ₡${Math.round(subtotal).toLocaleString("es-CR")}
Envío: ${shipping === 0 ? "Gratis" : "₡" + Math.round(shipping).toLocaleString("es-CR")}
TOTAL: ₡${Math.round(total).toLocaleString("es-CR")}
    `;

    const mailOptions = {
      from: `"Entre Nubes Shop" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `🛒 Nuevo Pedido - ${customer.nombre} ${customer.apellido} - ₡${Math.round(total).toLocaleString("es-CR")}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Pedido enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ success: false, error: "Error al enviar el pedido" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});