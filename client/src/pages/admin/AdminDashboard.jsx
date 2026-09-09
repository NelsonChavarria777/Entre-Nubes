import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    totalValue: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://entre-nubes-ten.vercel.app';
      const response = await fetch(`${API_URL}/api/productos`);
      const products = await response.json();
      
      const categories = new Set(products.map(p => p.category)).size;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.amount), 0);
      const recentProducts = products.slice(-5).reverse();

      setStats({
        totalProducts: products.length,
        categories,
        totalValue,
        recentProducts
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      <AdminLayout title="Dashboard">
        <div className="admin-loading">
          <div className="admin-spinner-large"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon-products">📦</div>
            <div className="admin-stat-content">
              <span className="admin-stat-value">{stats.totalProducts}</span>
              <span className="admin-stat-label">Productos totales</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon-categories">🏷️</div>
            <div className="admin-stat-content">
              <span className="admin-stat-value">{stats.categories}</span>
              <span className="admin-stat-label">Categorías</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon-value">💰</div>
            <div className="admin-stat-content">
              <span className="admin-stat-value">{formatCurrency(stats.totalValue)}</span>
              <span className="admin-stat-label">Valor en inventario</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-section">
          <h2 className="admin-section-title">Acciones rápidas</h2>
          <div className="admin-actions-grid">
            <Link to="/administracion/productos/nuevo" className="admin-action-card">
              <span className="admin-action-icon">➕</span>
              <span className="admin-action-text">Nuevo producto</span>
            </Link>
            <Link to="/administracion/productos" className="admin-action-card">
              <span className="admin-action-icon">✏️</span>
              <span className="admin-action-text">Gestionar productos</span>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Productos recientes</h2>
            <Link to="/administracion/productos" className="admin-section-link">
              Ver todos →
            </Link>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="admin-table-id">#{product.id}</td>
                    <td>
                      <div className="admin-product-cell">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="admin-product-thumb"
                          onError={(e) => e.target.src = '/images/producto_gen.webp'}
                        />
                        <span className="admin-product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-category-badge">{product.category}</span>
                    </td>
                    <td className="admin-price">{formatCurrency(product.price)}</td>
                    <td>
                      <span className={`admin-stock ${product.amount < 5 ? 'admin-stock-low' : ''}`}>
                        {product.amount} unidades
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/administracion/productos/editar/${product.id}`}
                        className="admin-table-action"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
