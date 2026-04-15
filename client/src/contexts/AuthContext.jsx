import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Credenciales hardcoded (en producción usar backend real)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData = { username, isAdmin: true };
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const isAuthenticated = !!user?.isAdmin;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
