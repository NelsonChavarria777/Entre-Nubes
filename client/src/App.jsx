import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import Producto from './pages/Producto'
import Contacto from './pages/Contacto'
import Carrito from './pages/Carrito'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"          element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/contacto"  element={<Contacto />} />
        <Route path="/carrito"   element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App