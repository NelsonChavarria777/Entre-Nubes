import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';
import LogoEntreNubes from '../../assets/LogoEntreNubes.webp';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Si venía de otra ruta protegida, redirigir allí después del login
  const from = location.state?.from?.pathname || '/administracion/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-logo">
            <img 
              src={LogoEntreNubes} 
              alt="Entre Nubes" 
              className="admin-logo-img" 
              width="40" 
              height="40"
            />
            <span className="admin-logo-text">Entre Nubes</span>
          </div>
          <h1 className="admin-login-title">Panel de Administración</h1>
          <p className="admin-login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="username" className="admin-form-label">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-form-input"
              placeholder="Ingresa tu usuario"
              required
              autoComplete="username"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-form-input"
              placeholder="Ingresa tu contraseña"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-spinner"></span>
                Ingresando...
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="admin-back-link">
            ← Volver al sitio público
          </a>
        </div>
      </div>

      <div className="admin-login-decoration">
        <div className="admin-decoration-circle admin-circle-1"></div>
        <div className="admin-decoration-circle admin-circle-2"></div>
        <div className="admin-decoration-circle admin-circle-3"></div>
      </div>
    </div>
  );
}

export default AdminLogin;
