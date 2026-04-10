import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customer, items, subtotal, shipping, total } = req.body;
    const EMAIL_TO = process.env.EMAIL_TO || "aaronchavarria.ctpa@gmail.com";
    const EMAIL_USER = process.env.EMAIL_USER;

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
        <p><strong>Nombre:</strong> ${customer.nombre} ${customer.apellido}</p>
        <p><strong>Cédula:</strong> ${customer.cedula}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Teléfono:</strong> ${customer.telefono}</p>
        <p><strong>WhatsApp:</strong> ${customer.whatsapp}</p>
        <h3 style="color: #333; margin-top: 20px;">Productos</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">#</th>
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cantidad</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
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

    await transporter.sendMail({
      from: `"Entre Nubes Shop" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `🛒 Nuevo Pedido - ${customer.nombre} ${customer.apellido} - ₡${Math.round(total).toLocaleString("es-CR")}`,
      text: textContent,
      html: htmlContent,
    });

    res.json({ success: true, message: "Pedido enviado correctamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Error al enviar el pedido" });
  }
}
