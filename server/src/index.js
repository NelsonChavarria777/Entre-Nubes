import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const productos = [
  { id: 1, nombre: "Papel Raw", precio: 2.99, categoria: "papeles" },
  { id: 2, nombre: "Grinder Metalico", precio: 15.99, categoria: "grinders" },
  { id: 3, nombre: "Bong de Vidrio", precio: 45.99, categoria: "bongs" },
  { id: 4, nombre: "Filtros Tips", precio: 1.99, categoria: "papeles" },
];

app.get("/api/productos", (req, res) => {
  res.json(productos);
});

app.get("/api/productos/:id", (req, res) => {
  const producto = productos.find(p => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});