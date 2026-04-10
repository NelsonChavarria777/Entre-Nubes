import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  try {
    const filePath = join(process.cwd(), "server", "src", "data", "productos.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error cargando productos" });
  }
}
