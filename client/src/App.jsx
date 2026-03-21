import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
  }, [])

  return (
    <div>
      <h1>Smoke Shop</h1>
      <div>
        {productos.map(producto => (
          <div key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>Precio: ${producto.precio}</p>
            <p>Categoría: {producto.categoria}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App