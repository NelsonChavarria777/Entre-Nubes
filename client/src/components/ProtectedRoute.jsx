import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #1a1a1a',
          borderTop: '3px solid #8DC63F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a login guardando la URL a la que intentaba acceder
    return <Navigate to="/administracion" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
