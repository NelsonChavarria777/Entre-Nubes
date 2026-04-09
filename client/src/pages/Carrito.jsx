import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Carrito.css";

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

function CartItem({ item, onUpdateQty, onRemove, onUpdateVariant }) {
  const hasVariants = item.variants && item.variants.length > 0;
  
  return (
    <div className="cart-page-item">
      <div className="cart-page-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="cart-page-item-details">
        <h3 className="cart-page-item-name">{item.name}</h3>
        {hasVariants && (
          <div className="cart-page-variant-select-wrapper">
            <select 
              className="cart-page-variant-select"
              value={item.variant || ""}
              onChange={(e) => onUpdateVariant(item.id, item.variant, e.target.value)}
            >
              {item.variants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <svg className="cart-page-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}
        {!hasVariants && item.variant && <p className="cart-page-item-variant">{item.variant}</p>}
        <p className="cart-page-item-price">${item.price.toFixed(2)} c/u</p>
      </div>
      <div className="cart-page-item-actions">
        <div className="cart-page-qty">
          <button 
            className="cart-page-qty-btn" 
            onClick={() => onUpdateQty(item.id, item.variant, -1)}
            disabled={item.qty <= 1}
          >
            −
          </button>
          <span className="cart-page-qty-value">{item.qty}</span>
          <button 
            className="cart-page-qty-btn" 
            onClick={() => onUpdateQty(item.id, item.variant, +1)}
          >
            +
          </button>
        </div>
        <p className="cart-page-item-total">${(item.price * item.qty).toFixed(2)}</p>
        <button className="cart-page-remove-btn" onClick={() => onRemove(item.id, item.variant)}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="cart-page-empty">
      <div className="cart-page-empty-icon">
        <PackageIcon />
      </div>
      <h2 className="cart-page-empty-title">Tu carrito está vacío</h2>
      <p className="cart-page-empty-text">Parece que aún no has agregado ningún producto.</p>
      <Link to="/productos" className="cart-page-empty-btn">
        Explorar productos
      </Link>
    </div>
  );
}

function OrderSummary({ items, totalItems, subtotal, shipping, total, onProceed }) {
  return (
    <div className="cart-page-summary">
      <h2 className="cart-page-summary-title">Resumen del pedido</h2>
      <div className="cart-page-summary-row">
        <span>Productos ({totalItems})</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="cart-page-summary-row">
        <span>Envío</span>
        <span className={shipping === 0 ? "cart-page-free" : ""}>
          {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
        </span>
      </div>
      <div className="cart-page-summary-divider" />
      <div className="cart-page-summary-row cart-page-summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button 
        onClick={onProceed}
        className="cart-page-checkout-btn"
      >
        Proceder al pago
      </button>
      <div className="cart-page-trust-badges">
        <div className="cart-page-trust-item">
          <span>🚚</span>
          <span>Envío gratis en +$50</span>
        </div>
        <div className="cart-page-trust-item">
          <span>🔒</span>
          <span>Pago seguro</span>
        </div>
        <div className="cart-page-trust-item">
          <span>↩️</span>
          <span>Devolución 15 días</span>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ items, subtotal, shipping, total, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    email: "",
    telefono: "",
    whatsapp: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/send-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Error al enviar el pedido. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="cart-page-summary">
        <h2 className="cart-page-summary-title">¡Pedido Enviado!</h2>
        <div className="cart-page-success">
          <p>Gracias por tu compra. Hemos enviado tu pedido y te contactaremos pronto.</p>
          <button onClick={onClose} className="cart-page-checkout-btn" style={{ marginTop: "16px" }}>
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-summary">
      <h2 className="cart-page-summary-title">Datos de Contacto</h2>
      <form onSubmit={handleSubmit} className="cart-page-form">
        <div className="cart-page-form-row">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="cart-page-input"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="cart-page-input"
          />
        </div>
        <input
          type="text"
          name="cedula"
          placeholder="Cédula"
          value={formData.cedula}
          onChange={handleChange}
          required
          className="cart-page-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="cart-page-input"
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Número de teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="cart-page-input"
        />
        <input
          type="tel"
          name="whatsapp"
          placeholder="WhatsApp"
          value={formData.whatsapp}
          onChange={handleChange}
          required
          className="cart-page-input"
        />
        
        {error && (
          <div className="cart-page-error" style={{ color: "#FF3913", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}
        
        <div className="cart-page-form-total">
          <span>Total a pagar:</span>
          <span className="cart-page-form-total-price">${total.toFixed(2)}</span>
        </div>
        
        <button 
          type="submit" 
          className="cart-page-checkout-btn"
          disabled={submitting}
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Enviando..." : "Enviar pedido"}
        </button>
        
        <button type="button" onClick={onClose} className="cart-page-cancel-btn">
          Cancelar
        </button>
      </form>
    </div>
  );
}

function Carrito() {
  const { items, totalItems, totalPrice, changeQty, removeItem, updateVariant, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  
  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const total = totalPrice + shipping;

  return (
    <div className="cart-page">
      <NavBar />
      
      <main className="cart-page-main">
        <div className="cart-page-container">
          <Link to="/productos" className="cart-page-back">
            <ArrowLeftIcon />
            Seguir comprando
          </Link>

          <h1 className="cart-page-title">Mi Carrito</h1>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="cart-page-content">
              <div className="cart-page-items-section">
                <div className="cart-page-header">
                  <span>{totalItems} artículo{totalItems !== 1 ? "s" : ""}</span>
                  <button className="cart-page-clear" onClick={clearCart}>
                    Vaciar carrito
                  </button>
                </div>
                
                <div className="cart-page-items">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.variant}`}
                      item={item}
                      onUpdateQty={changeQty}
                      onRemove={removeItem}
                      onUpdateVariant={updateVariant}
                    />
                  ))}
                </div>
              </div>

              <div className="cart-page-sidebar">
                {showCheckoutForm ? (
                  <CheckoutForm
                    items={items}
                    subtotal={totalPrice}
                    shipping={shipping}
                    total={total}
                    onClose={() => setShowCheckoutForm(false)}
                  />
                ) : (
                  <OrderSummary
                    items={items}
                    totalItems={totalItems}
                    subtotal={totalPrice}
                    shipping={shipping}
                    total={total}
                    onProceed={() => setShowCheckoutForm(true)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Carrito;