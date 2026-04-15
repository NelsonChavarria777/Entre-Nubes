import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

function AdminLayout({ children, title }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/administracion');
  };

  const navItems = [
    { path: '/administracion/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/administracion/productos', label: 'Productos', icon: '📦' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-brand">
            <span className="admin-brand-icon">☁️</span>
            <span className="admin-brand-text">Entre Nubes</span>
          </Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">👤</div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.username}</span>
              <span className="admin-user-role">Administrador</span>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">{title}</h1>
          <div className="admin-header-actions">
            <Link to="/" className="admin-header-link" target="_blank">
              Ver sitio público →
            </Link>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
