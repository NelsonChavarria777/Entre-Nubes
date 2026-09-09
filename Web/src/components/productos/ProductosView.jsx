import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp,
  X,
  Droplet,
  Upload,
  Image as ImageIcon,
  Loader2,
  FolderOpen
} from 'lucide-react';

export const ProductosView = () => {
  const { data, addProducto, updateProducto, deleteProducto, formatCurrency, getProveedorName } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [filterMarca, setFilterMarca] = useState('ALL');
  const [filterGenero, setFilterGenero] = useState('ALL');
  const [filterCategoria, setFilterCategoria] = useState('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Products folder images and upload state
  const [productImages, setProductImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSourceMode, setImageSourceMode] = useState('gallery'); // 'gallery' | 'upload' | 'manual'

  useEffect(() => {
    const loadFolderImages = async () => {
      try {
        const res = await api.getProductsImages();
        if (res.ok && res.data) {
          setProductImages(res.data);
        }
      } catch (e) {
        console.error('Error fetching product images:', e);
      }
    };
    loadFolderImages();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await api.uploadProductImage(file);
      if (res.ok && res.url) {
        setForm(prev => ({ ...prev, ImagenURL: res.url }));
        setProductImages(prev => [{ filename: res.filename, url: res.url }, ...prev]);
      } else {
        alert('Error al subir imagen: ' + (res.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error al conectar con el servidor: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const initialFormState = {
    Nombre: '',
    Marca: '',
    Categoria: 'Perfume Árabe',
    Genero: 'Unisex',
    Presentacion: 'Botella 100ml',
    ContenidoML: 100,
    ProveedorID: data.Proveedores[0]?.ProveedorID || 1,
    ImagenURL: '/assets/banners/armafBanner1.webp',
    CostoUnitario: '',
    PrecioVentaUnitario: '',
    StockActual: 5,
    StockMinimo: 2,
    Activo: 1
  };

  const [form, setForm] = useState(initialFormState);

  // Extract distinct marcas and categories for filter dropdowns
  const marcas = useMemo(() => ['ALL', ...new Set(data.Productos.map(p => p.Marca).filter(Boolean))], [data.Productos]);
  const categorias = useMemo(() => ['ALL', ...new Set(data.Productos.map(p => p.Categoria).filter(Boolean))], [data.Productos]);

  // Filtered list
  const filteredProductos = useMemo(() => {
    return data.Productos.filter(p => {
      const matchSearch = p.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.Marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.Presentacion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMarca = filterMarca === 'ALL' || p.Marca === filterMarca;
      const matchGenero = filterGenero === 'ALL' || p.Genero === filterGenero;
      const matchCategoria = filterCategoria === 'ALL' || p.Categoria === filterCategoria;
      const matchLowStock = !onlyLowStock || ((p.StockActual || 0) <= (p.StockMinimo || 1));
      return matchSearch && matchMarca && matchGenero && matchCategoria && matchLowStock;
    });
  }, [data.Productos, searchTerm, filterMarca, filterGenero, filterCategoria, onlyLowStock]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(initialFormState);
    setImageSourceMode('gallery');
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setForm({
      Nombre: prod.Nombre,
      Marca: prod.Marca,
      Categoria: prod.Categoria,
      Genero: prod.Genero,
      Presentacion: prod.Presentacion,
      ContenidoML: prod.ContenidoML,
      ProveedorID: prod.ProveedorID || '',
      ImagenURL: prod.ImagenURL || '',
      CostoUnitario: prod.CostoUnitario,
      PrecioVentaUnitario: prod.PrecioVentaUnitario,
      StockActual: prod.StockActual || 0,
      StockMinimo: prod.StockMinimo || 1,
      Activo: prod.Activo !== undefined ? prod.Activo : 1
    });
    setImageSourceMode('gallery');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Nombre || !form.Marca || !form.PrecioVentaUnitario || !form.CostoUnitario) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    if (editingProduct) {
      updateProducto(editingProduct.ProductoID, form);
    } else {
      addProducto(form);
    }
    setIsModalOpen(false);
  };

  // Profit calculation helper in form
  const computedGanancia = (Number(form.PrecioVentaUnitario) || 0) - (Number(form.CostoUnitario) || 0);
  const computedMargen = (Number(form.PrecioVentaUnitario) || 0) > 0 
    ? ((computedGanancia / Number(form.PrecioVentaUnitario)) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-400" />
            <span>Catálogo de Productos y Fragancias</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gestión de stock, costos, márgenes de ganancia calculados y presentaciones ({data.Productos.length} registros)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
              title="Vista en Cuadrícula"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'table' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
              title="Vista en Tabla ERP"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 px-4 py-2 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, marca o presentación..."
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Marca */}
          <div>
            <select
              value={filterMarca}
              onChange={(e) => setFilterMarca(e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              {marcas.map(m => (
                <option key={m} value={m}>{m === 'ALL' ? 'Todas las Marcas' : m}</option>
              ))}
            </select>
          </div>

          {/* Genero */}
          <div>
            <select
              value={filterGenero}
              onChange={(e) => setFilterGenero(e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">Todos los Géneros</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-700/80 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              {categorias.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'Todas las Categorías' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stock Filter */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
          <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              Ver únicamente productos con stock mínimo o agotado
            </span>
          </label>

          <span className="text-zinc-500">
            Mostrando {filteredProductos.length} de {data.Productos.length} productos
          </span>
        </div>
      </div>

      {/* Product Content: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProductos.map(prod => {
            const isLowStock = (prod.StockActual || 0) <= (prod.StockMinimo || 1);
            const isOutOfStock = (prod.StockActual || 0) === 0;
            const ganancia = (Number(prod.PrecioVentaUnitario) || 0) - (Number(prod.CostoUnitario) || 0);
            const margen = prod.PrecioVentaUnitario > 0 ? ((ganancia / prod.PrecioVentaUnitario) * 100).toFixed(0) : 0;

            return (
              <div 
                key={prod.ProductoID}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-md"
              >
                {/* Image / Banner Header */}
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 mb-3">
                  <img
                    src={prod.ImagenURL || '/assets/banners/armafBanner1.webp'}
                    alt={prod.Nombre}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/banners/armafBanner1.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                  {/* Stock status badge on image */}
                  <div className="absolute top-2.5 right-2.5">
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800 text-[10px] font-bold">
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-800 text-[10px] font-bold animate-pulse">
                        Stock Bajo ({prod.StockActual})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        {prod.StockActual} en stock
                      </span>
                    )}
                  </div>

                  {/* Presentacion & ML */}
                  <div className="absolute bottom-2 left-2.5">
                    <span className="text-[10px] font-semibold tracking-wider text-amber-300 uppercase px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800">
                      {prod.Presentacion} ({prod.ContenidoML} ml)
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-bold text-amber-400">{prod.Marca}</span>
                    <span>{prod.Genero}</span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-1" title={prod.Nombre}>
                    {prod.Nombre}
                  </h3>

                  <div className="text-[10px] text-zinc-500">
                    {prod.Categoria} • Prov: {getProveedorName(prod.ProveedorID)}
                  </div>

                  {/* Price & Margins */}
                  <div className="pt-2 border-t border-zinc-800/80 mt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-zinc-400">Precio Venta</span>
                      <span className="text-base font-bold text-white font-mono">
                        {formatCurrency(prod.PrecioVentaUnitario)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-0.5">
                      <span>Costo: {formatCurrency(prod.CostoUnitario)}</span>
                      <span className="text-emerald-400 font-semibold">+{margen}% ({formatCurrency(ganancia)})</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-zinc-800/80 mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                    title="Editar producto"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar producto "${prod.Nombre}"?`)) {
                        deleteProducto(prod.ProductoID);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-rose-200 transition-all cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Marca / Categoría</th>
                <th className="p-3">Presentación</th>
                <th className="p-3 text-right">Costo Unit.</th>
                <th className="p-3 text-right">Precio Venta</th>
                <th className="p-3 text-right">Ganancia (Margen)</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProductos.map(prod => {
                const isLow = (prod.StockActual || 0) <= (prod.StockMinimo || 1);
                const ganancia = (Number(prod.PrecioVentaUnitario) || 0) - (Number(prod.CostoUnitario) || 0);
                const margen = prod.PrecioVentaUnitario > 0 ? ((ganancia / prod.PrecioVentaUnitario) * 100).toFixed(0) : 0;

                return (
                  <tr key={prod.ProductoID} className="hover:bg-zinc-800/30 transition-all">
                    <td className="p-3 font-mono text-zinc-500">#{prod.ProductoID}</td>
                    <td className="p-3">
                      <div className="font-semibold text-zinc-100">{prod.Nombre}</div>
                      <div className="text-[10px] text-zinc-500">{prod.Genero}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-amber-400 font-medium">{prod.Marca}</div>
                      <div className="text-[10px] text-zinc-500">{prod.Categoria}</div>
                    </td>
                    <td className="p-3 font-mono text-zinc-300">
                      {prod.Presentacion} ({prod.ContenidoML} ml)
                    </td>
                    <td className="p-3 text-right font-mono text-zinc-400">
                      {formatCurrency(prod.CostoUnitario)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-zinc-100">
                      {formatCurrency(prod.PrecioVentaUnitario)}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-medium">
                      +{formatCurrency(ganancia)} ({margen}%)
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        (prod.StockActual || 0) === 0
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isLow 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {prod.StockActual || 0} / mín {prod.StockMinimo || 1}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${prod.Activo ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'}`}>
                        {prod.Activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white"
                          title="Editar"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar ${prod.Nombre}?`)) deleteProducto(prod.ProductoID);
                          }}
                          className="p-1 rounded hover:bg-rose-900/60 text-rose-400"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-[#12141c] p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-400" />
                <span>{editingProduct ? 'Editar Producto / Fragancia' : 'Registrar Nuevo Producto'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nombre */}
                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-medium mb-1">Nombre de la Fragancia *</label>
                  <input
                    type="text"
                    required
                    value={form.Nombre}
                    onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                    placeholder="Ej: Club de Nuit Intense Man EDP"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    value={form.Marca}
                    onChange={(e) => setForm({ ...form, Marca: e.target.value })}
                    placeholder="Ej: Armaf, Lattafa, Bharara, JPG..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Categoría</label>
                  <input
                    type="text"
                    value={form.Categoria}
                    onChange={(e) => setForm({ ...form, Categoria: e.target.value })}
                    placeholder="Ej: Perfume Árabe, Diseñador, Decant..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Género */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Género</label>
                  <select
                    value={form.Genero}
                    onChange={(e) => setForm({ ...form, Genero: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                {/* Presentación */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Presentación</label>
                  <input
                    type="text"
                    value={form.Presentacion}
                    onChange={(e) => setForm({ ...form, Presentacion: e.target.value })}
                    placeholder="Ej: Botella 100ml, Atomizador 10ml, Tester..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Contenido ML */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Contenido (ML) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.ContenidoML}
                    onChange={(e) => setForm({ ...form, ContenidoML: e.target.value })}
                    placeholder="100"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Proveedor */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Proveedor Habitual</label>
                  <select
                    value={form.ProveedorID}
                    onChange={(e) => setForm({ ...form, ProveedorID: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">(Sin proveedor asignado)</option>
                    {data.Proveedores.map(p => (
                      <option key={p.ProveedorID} value={p.ProveedorID}>{p.Nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Costo Unitario */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Costo Unitario de Compra (₡) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={form.CostoUnitario}
                    onChange={(e) => setForm({ ...form, CostoUnitario: e.target.value })}
                    placeholder="Ej: 24000"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Precio Venta Unitario */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Precio de Venta al Público (₡) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={form.PrecioVentaUnitario}
                    onChange={(e) => setForm({ ...form, PrecioVentaUnitario: e.target.value })}
                    placeholder="Ej: 38000"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Computed Profit Display */}
                <div className="sm:col-span-2 rounded-xl bg-zinc-950/70 border border-zinc-800 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span>Ganancia Estimada por Unidad (PERSISTED):</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-emerald-400">
                    {formatCurrency(computedGanancia)} ({computedMargen}%)
                  </div>
                </div>

                {/* Stock Actual & Stock Minimo */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Stock Actual (Unidades)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.StockActual}
                    onChange={(e) => setForm({ ...form, StockActual: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.StockMinimo}
                    onChange={(e) => setForm({ ...form, StockMinimo: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Imagen del Producto (Carpeta Products & Upload) */}
                <div className="sm:col-span-2 rounded-xl bg-zinc-950/70 border border-zinc-800 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-200 font-bold flex items-center gap-2 text-xs">
                      <ImageIcon className="h-4 w-4 text-amber-400" />
                      <span>Imagen del Producto (Carpeta Products)</span>
                    </label>

                    {/* Mode switcher */}
                    <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('gallery')}
                        className={`px-2 py-1 rounded cursor-pointer ${imageSourceMode === 'gallery' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Carpeta Products ({productImages.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('upload')}
                        className={`px-2 py-1 rounded cursor-pointer flex items-center gap-1 ${imageSourceMode === 'upload' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <Upload className="h-3 w-3" />
                        <span>Subir Archivo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('manual')}
                        className={`px-2 py-1 rounded cursor-pointer ${imageSourceMode === 'manual' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Banners / URL
                      </button>
                    </div>
                  </div>

                  {/* Current Selected Image Preview Banner */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <div className="h-14 w-14 rounded-lg bg-zinc-950 border border-zinc-700/80 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {form.ImagenURL ? (
                        <img
                          src={form.ImagenURL}
                          alt="Vista previa"
                          className="h-full w-full object-contain p-0.5"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/logos/logoImgSinFondo.webp';
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-zinc-400 font-medium">Imagen seleccionada:</div>
                      <div className="text-xs font-mono text-amber-300 truncate" title={form.ImagenURL}>
                        {form.ImagenURL || 'Sin imagen seleccionada'}
                      </div>
                    </div>
                  </div>

                  {/* MODE 1: GALLERY FROM PRODUCTS FOLDER */}
                  {imageSourceMode === 'gallery' && (
                    <div className="space-y-2">
                      <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                        <span>Haz clic en cualquier fragancia de la carpeta <strong className="text-amber-400">Products</strong>:</span>
                        <span className="text-zinc-500">Total: {productImages.length} fotos</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                        {productImages.map((img, idx) => {
                          const isSelected = form.ImagenURL === img.url;
                          const cleanName = img.filename.replace(/\.[^/.]+$/, '').replace(/([A-Z])/g, ' $1').trim();
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setForm({ ...form, ImagenURL: img.url })}
                              className={`group relative rounded-lg border p-1 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400'
                                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-800/60'
                              }`}
                              title={img.filename}
                            >
                              <div className="h-14 w-full flex items-center justify-center overflow-hidden rounded">
                                <img
                                  src={img.url}
                                  alt={img.filename}
                                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <span className="text-[9px] font-medium text-zinc-300 mt-1 line-clamp-1 w-full text-center">
                                {cleanName}
                              </span>
                              {isSelected && (
                                <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-[9px] font-bold">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* MODE 2: UPLOAD DIRECTLY TO PRODUCTS FOLDER */}
                  {imageSourceMode === 'upload' && (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 rounded-xl p-5 text-center transition-colors bg-zinc-900/40">
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center gap-2 py-4 text-amber-400">
                            <Loader2 className="h-7 w-7 animate-spin" />
                            <span className="text-xs font-semibold">Guardando archivo en la carpeta Products...</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                            <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Upload className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-zinc-200">
                              Haz clic para seleccionar una foto de perfume
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Se guardará automáticamente en <code className="text-amber-400">Imagenes/Products/</code> (PNG, JPG, WEBP)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODE 3: MANUAL URL OR BANNERS */}
                  {imageSourceMode === 'manual' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={form.ImagenURL}
                        onChange={(e) => setForm({ ...form, ImagenURL: e.target.value })}
                        placeholder="/assets/products/nombre.png o URL externa"
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none font-mono text-[11px]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { name: 'Armaf 1', url: '/assets/banners/armafBanner1.webp' },
                          { name: 'Bharara 1', url: '/assets/banners/baharaBanner1.webp' },
                          { name: 'JPG 1', url: '/assets/banners/jpgBanner1.webp' },
                          { name: 'Lattafa 1', url: '/assets/banners/lattafaBanner1.webp' },
                        ].map(p => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => setForm({ ...form, ImagenURL: p.url })}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${form.ImagenURL === p.url ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'}`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Activo switch */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="activoCheck"
                    checked={form.Activo === 1}
                    onChange={(e) => setForm({ ...form, Activo: e.target.checked ? 1 : 0 })}
                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="activoCheck" className="text-zinc-300 font-medium cursor-pointer">
                    Producto Activo para venta y catálogo
                  </label>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
