import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  const diagnostics = {
    hasUser: !!EMAIL_USER,
    hasPass: !!EMAIL_PASS,
    userLength: EMAIL_USER ? EMAIL_USER.length : 0,
    passLength: EMAIL_PASS ? EMAIL_PASS.length : 0,
  };

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({
      error: "Faltan credenciales de email",
      diagnostics
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.verify();
    
    res.json({ 
      success: true, 
      message: "Conexión SMTP exitosa",
      diagnostics
    });
  } catch (error) {
    res.status(500).json({
      error: "Error de conexión SMTP",
      details: error.message,
      diagnostics
    });
  }
}
