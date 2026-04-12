import productos from '../../productos-data.js';

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  
  const { id } = req.query;
  const product = productos.find(p => p.id === parseInt(id));
  
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  
  res.status(200).json(product);
}
