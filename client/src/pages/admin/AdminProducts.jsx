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

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

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

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
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

          <Link to="/administracion/productos/nuevo" className="admin-btn admin-btn-primary">
            <span>➕</span>
            Nuevo Producto
          </Link>
        </div>

        {/* Products Count */}
        <div className="admin-results-count">
          Mostrando {filteredProducts.length} de {products.length} productos
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
          <div className="admin-products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="admin-product-card">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-products-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="admin-product-list-card">
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
