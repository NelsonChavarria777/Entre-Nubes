import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Code splitting - lazy load pages to reduce initial bundle
const Inicio = lazy(() => import('./pages/Inicio'))
const Productos = lazy(() => import('./pages/Productos'))
const Producto = lazy(() => import('./pages/Producto'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Carrito = lazy(() => import('./pages/Carrito'))

// Admin pages - lazy loaded
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'))

// Simple fallback while chunks load
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafaf8'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #f0f0f0',
      borderTop: '3px solid #8DC63F',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/"          element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/contacto"  element={<Contacto />} />
            <Route path="/carrito"   element={<Carrito />} />

            {/* Admin Routes */}
            <Route path="/administracion" element={<AdminLogin />} />
            <Route 
              path="/administracion/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/administracion/productos" 
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/administracion/productos/nuevo" 
              element={
                <ProtectedRoute>
                  <AdminProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/administracion/productos/editar/:id" 
              element={
                <ProtectedRoute>
                  <AdminProductForm />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App