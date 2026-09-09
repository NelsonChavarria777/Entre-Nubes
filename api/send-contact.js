import nodemailer from "nodemailer";

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
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_TO = process.env.EMAIL_TO || "aaronchavarria.ctpa@gmail.com";

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error("Missing email credentials");
      return res.status(500).json({ success: false, error: "Error de configuración de email" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const { tipo, nombre, apellido, correo, telefono, asunto, mensaje, empresa, sitio, volumen, categorias } = req.body;

    const subject = tipo === "proveedor" 
      ? `📦 Nueva Propuesta de Proveedor - ${nombre} ${apellido}`
      : `📩 Nuevo Mensaje de Contacto - ${asunto || "Sin asunto"}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; border-bottom: 2px solid #8DC63F; padding-bottom: 10px;">
          ${tipo === "proveedor" ? "📦 Nueva Propuesta de Proveedor" : "📩 Nuevo Mensaje de Contacto"}
        </h2>
        
        <h3 style="color: #333; margin-top: 20px;">Datos del Remitente</h3>
        <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
        <p><strong>Email:</strong> ${correo}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No proporcionado"}</p>
        
        ${tipo === "proveedor" ? `
        <h3 style="color: #333; margin-top: 20px;">Información de la Empresa</h3>
        <p><strong>Empresa/Marca:</strong> ${empresa || "No proporcionado"}</p>
        <p><strong>Sitio web:</strong> ${sitio || "No proporcionado"}</p>
        <p><strong>Volumen estimado:</strong> ${volumen || "No especificado"}</p>
        <p><strong>Categorías:</strong> ${categorias && categorias.length > 0 ? categorias.join(", ") : "No especificadas"}</p>
        ` : `
        <p><strong>Asunto:</strong> ${asunto}</p>
        `}
        
        <h3 style="color: #333; margin-top: 20px;">Mensaje</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
          ${mensaje}
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>Enviado desde el formulario de contacto de Entre Nubes</p>
          <p>Tipo: ${tipo === "proveedor" ? "Proveedor" : "Cliente"}</p>
        </div>
      </div>
    `;

    const textContent = tipo === "proveedor" 
      ? `Nueva Propuesta de Proveedor - Entre Nubes

Datos del Remitente:
Nombre: ${nombre} ${apellido}
Email: ${correo}
Teléfono: ${telefono || "No proporcionado"}

Información de la Empresa:
Empresa/Marca: ${empresa || "No proporcionado"}
Sitio web: ${sitio || "No proporcionado"}
Volumen estimado: ${volumen || "No especificado"}
Categorías: ${categorias && categorias.length > 0 ? categorias.join(", ") : "No especificadas"}

Mensaje:
${mensaje}`
      : `Nuevo Mensaje de Contacto - Entre Nubes

Datos del Remitente:
Nombre: ${nombre} ${apellido}
Email: ${correo}
Teléfono: ${telefono || "No proporcionado"}
Asunto: ${asunto}

Mensaje:
${mensaje}`;

    await transporter.sendMail({
      from: `"Entre Nubes Contacto" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      replyTo: correo,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    res.json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Error al enviar el mensaje" });
  }
}
