import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  try {
    const { id } = req.query;
    const filePath = join(process.cwd(), "server", "src", "data", "productos.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    
    const product = data.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error cargando producto" });
  }
}
