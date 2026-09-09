import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './AdminProducts.css';

// Iconos para toggle de vista
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

// Icono de drag
const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
  </svg>
);

// Icono de guardar
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

// Icono de edición
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
  const [editMode, setEditMode] = useState(false); // Modo edición para reordenar
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://entre-nubes-ten.vercel.app';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm && !editMode) { // No filtrar por búsqueda en modo edición
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all' && !editMode) { // No filtrar por categoría en modo edición
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Ordenar por posición (menor primero), luego por ID como fallback
    filtered = [...filtered].sort((a, b) => {
      const posA = a.position ?? 999999;
      const posB = b.position ?? 999999;
      if (posA !== posB) return posA - posB;
      return a.id - b.id;
    });

    setFilteredProducts(filtered);
  };

  // Guardar el nuevo orden de productos
  const saveOrder = async () => {
    setSavingOrder(true);
    
    try {
      // Preparar los productos con nuevas posiciones
      const updatedProducts = filteredProducts.map((p, index) => ({
        id: p.id,
        position: index + 1
      }));
      
      // Enviar actualizaciones al backend
      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProducts)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar posiciones');
      }
      
      const result = await response.json();
      console.log('Posiciones actualizadas:', result);
      
      // Actualizar estado local
      setProducts(prev => {
        const newProducts = [...prev];
        updatedProducts.forEach(update => {
          const idx = newProducts.findIndex(p => p.id === update.id);
          if (idx !== -1) {
            newProducts[idx] = { ...newProducts[idx], position: update.position };
          }
        });
        return newProducts;
      });
      
      setEditMode(false);
      alert('Orden guardado correctamente. Los cambios se reflejarán en la página de productos.');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al guardar el orden: ' + err.message);
    } finally {
      setSavingOrder(false);
    }
  };

  // Handlers de Drag and Drop
  const handleDragStart = (e, productId) => {
    setDraggingId(productId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    
    // Reordenar visualmente
    const dragIndex = filteredProducts.findIndex(p => p.id === draggingId);
    const targetIndex = filteredProducts.findIndex(p => p.id === targetId);
    
    if (dragIndex === -1 || targetIndex === -1) return;
    
    const newFiltered = [...filteredProducts];
    const [draggedItem] = newFiltered.splice(dragIndex, 1);
    newFiltered.splice(targetIndex, 0, draggedItem);
    
    // Actualizar el estado de products manteniendo el orden
    setFilteredProducts(newFiltered.map((p, i) => ({ ...p, position: i + 1 })));
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({ show: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;

    try {
      const response = await fetch(`${API_URL}/api/productos/${deleteModal.product.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== deleteModal.product.id));
        setDeleteModal({ show: false, product: null });
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <AdminLayout title="Productos">
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Cargando productos...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestión de Productos">
      <div className="admin-products">
        {/* Filters */}
        <div className="admin-filters">
          <div className="admin-search-box">
            <span className="admin-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="admin-view-toggle">
            <button 
              className={`admin-view-btn${view === 'grid' ? ' active' : ''}`} 
              onClick={() => setView('grid')}
              title="Vista de grid"
            >
              <GridIcon />
            </button>
            <button 
              className={`admin-view-btn${view === 'list' ? ' active' : ''}`} 
              onClick={() => setView('list')}
              title="Vista de lista"
            >
              <ListIcon />
            </button>
          </div>

          {/* Botón de edición de orden */}
          {!editMode ? (
            <button 
              className="admin-btn admin-btn-edit-mode" 
              onClick={() => {
                setEditMode(true);
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              title="Editar orden de productos"
            >
              <EditIcon /> Editar orden
            </button>
          ) : (
            <div className="admin-edit-actions">
              <button 
                className="admin-btn admin-btn-save-order" 
                onClick={saveOrder}
                disabled={savingOrder}
              >
                {savingOrder ? 'Guardando...' : <><SaveIcon /> Guardar</>}
              </button>
              <button 
                className="admin-btn admin-btn-cancel" 
                onClick={() => setEditMode(false)}
                disabled={savingOrder}
              >
                Cancelar
              </button>
            </div>
          )}

          <Link to="/administracion/productos/nuevo" className="admin-btn admin-btn-primary">
            <span>➕</span>
            Nuevo Producto
          </Link>
        </div>

        {/* Banner de modo edición */}
        {editMode && (
          <div className="admin-edit-banner">
            <DragIcon />
            <span>Modo edición: Arrastra los productos para cambiar su orden</span>
          </div>
        )}

        {/* Products Count */}
        <div className="admin-results-count">
          {editMode ? (
            <span>Reordenando {filteredProducts.length} productos</span>
          ) : (
            <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <span className="admin-empty-icon">📭</span>
            <p>No se encontraron productos</p>
            {searchTerm && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="admin-btn admin-btn-secondary"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className={`admin-products-grid${editMode ? ' admin-editing' : ''}`}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`admin-drag-wrapper${draggingId === product.id ? ' admin-dragging' : ''}`}
                draggable={editMode}
                onDragStart={(e) => handleDragStart(e, product.id)}
                onDragOver={(e) => handleDragOver(e, product.id)}
                onDragEnd={handleDragEnd}
              >
                {editMode && (
                  <div className="admin-drag-handle">
                    <DragIcon />
                    <span className="admin-position-badge">
                      {filteredProducts.findIndex(fp => fp.id === product.id) + 1}
                    </span>
                  </div>
                )}
                <div className="admin-product-card">
                  <div className="admin-product-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => e.target.src = '/images/producto_gen.webp'}
                    />
                    {product.discount && (
                      <span className="admin-product-discount">-{product.discount}%</span>
                    )}
                  </div>
                  
                  <div className="admin-product-info">
                    <span className="admin-product-category">{product.category}</span>
                    <h3 className="admin-product-title">{product.name}</h3>
                    <p className="admin-product-price">{formatCurrency(product.price)}</p>
                    <p className="admin-product-stock">
                      Stock: <span className={product.amount < 5 ? 'low' : ''}>{product.amount} unidades</span>
                    </p>
                  </div>

                  {!editMode && (
                    <div className="admin-product-actions">
                      <Link 
                        to={`/administracion/productos/editar/${product.id}`}
                        className="admin-btn admin-btn-edit"
                      >
                        ✏️ Editar
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="admin-btn admin-btn-delete"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`admin-products-list${editMode ? ' admin-editing' : ''}`}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`admin-drag-wrapper${draggingId === product.id ? ' admin-dragging' : ''}`}
                draggable={editMode}
                onDragStart={(e) => handleDragStart(e, product.id)}
                onDragOver={(e) => handleDragOver(e, product.id)}
                onDragEnd={handleDragEnd}
              >
                {editMode && (
                  <div className="admin-drag-handle admin-list-drag-handle">
                    <DragIcon />
                    <span className="admin-position-badge">
                      {filteredProducts.findIndex(fp => fp.id === product.id) + 1}
                    </span>
                  </div>
                )}
                <div className="admin-product-list-card">
                  <div className="admin-product-list-image">
                    <img 
                      src={product.image} 
                    alt={product.name}
                    onError={(e) => e.target.src = '/images/producto_gen.webp'}
                  />
                  {product.discount && (
                    <span className="admin-product-discount">-{product.discount}%</span>
                  )}
                </div>
                
                <div className="admin-product-list-info">
                  <div className="admin-product-list-main">
                    <span className="admin-product-category">{product.category}</span>
                    <h3 className="admin-product-list-title">{product.name}</h3>
                    <p className="admin-product-list-description">
                      {product.description?.substring(0, 100)}{product.description?.length > 100 ? '...' : ''}
                    </p>
                  </div>
                  <div className="admin-product-list-footer">
                    <div className="admin-product-list-meta">
                      <p className="admin-product-price">{formatCurrency(product.price)}</p>
                      <p className="admin-product-stock">
                        Stock: <span className={product.amount < 5 ? 'low' : ''}>{product.amount} unidades</span>
                      </p>
                    </div>
                    {!editMode && (
                      <div className="admin-product-list-actions">
                        <Link 
                          to={`/administracion/productos/editar/${product.id}`}
                          className="admin-btn admin-btn-edit"
                        >
                          ✏️ Editar
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="admin-btn admin-btn-delete"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.show && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <span className="admin-modal-icon">⚠️</span>
                <h3>¿Eliminar producto?</h3>
              </div>
              <p className="admin-modal-text">
                Estás a punto de eliminar <strong>"{deleteModal.product?.name}"</strong>.
                Esta acción no se puede deshacer.
              </p>
              <div className="admin-modal-actions">
                <button 
                  onClick={() => setDeleteModal({ show: false, product: null })}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="admin-btn admin-btn-danger"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
