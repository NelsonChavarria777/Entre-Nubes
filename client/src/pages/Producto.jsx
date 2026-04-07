import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import ProductDetail from '../components/ProductDetail'

function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`)
      .then(res => res.json())
      .then(data => { setProducto(data); setLoading(false); })
      .catch(() => { setError("No se pudo cargar el producto"); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div>
      <NavBar />
      <div style={{ textAlign:"center", padding:"100px 0", fontFamily:"'Permanent Marker',cursive", fontSize:"22px", color:"#ccc" }}>
        Cargando producto...
      </div>
      <Footer />
    </div>
  );

  if (error || !producto) return (
    <div>
      <NavBar />
      <div style={{ textAlign:"center", padding:"100px 0", fontFamily:"'Permanent Marker',cursive", fontSize:"22px", color:"#FF3913" }}>
        Producto no encontrado
      </div>
      <Footer />
    </div>
  );

  // Calcular precio con descuento
  const tieneDescuento = producto.discount !== null && producto.discount > 0;
  const precioFinal    = tieneDescuento
    ? (producto.price - (producto.price * producto.discount / 100)).toFixed(2)
    : producto.price.toFixed(2);
  const porcentaje     = tieneDescuento ? `${producto.discount}% OFF` : "";

  return (
    <div>
      <NavBar />
      <ProductDetail
        imageUrl={producto.image}
        image2={producto.image2}
        image3={producto.image3}
        productName={producto.name}
        category={producto.category}
        price={`$${precioFinal}`}
        oldPrice={tieneDescuento ? `$${producto.price.toFixed(2)}` : ""}
        discount={porcentaje}
        showDiscount={tieneDescuento}
        description={producto.description}
        badge={producto.badge}
        badgeBg={producto.badgeBg}
        badgeColor={producto.badgeColor}
        variants={Array.isArray(producto.variants) ? producto.variants : [producto.variants].filter(Boolean)}
        stockLevel={producto.amount > 5 ? "high" : producto.amount > 1 ? "medium" : "low"}
        stockText={producto.amount > 5 ? "En stock" : producto.amount > 1 ? `Últimas ${producto.amount} unidades` : "Última unidad"}
      />
      <Footer />
    </div>
  );
}

export default Producto