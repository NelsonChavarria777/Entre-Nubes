import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const DATA_PATH  = join(__dirname, "data/productos.json");

const leerProductos  = () => JSON.parse(readFileSync(DATA_PATH, "utf-8"));
const guardarProductos = (data) => writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});