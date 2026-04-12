import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  try {
    // Vercel: subir 1 nivel (desde api/) para llegar a la raíz
    const filePath = join(__dirname, "..", "server", "src", "data", "productos.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error cargando productos" });
  }
}
