import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import LogoEntreNubes from "../assets/LogoEntreNubes.webp";

const CartIcon = ({ size = 19 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

function CartItems({ items, changeQty, removeItem }) {
  return items.length === 0 ? (
    <div className="cart-empty">
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>🛍️</div>
      <p className="cart-empty-title">Carrito vacío</p>
      <p className="cart-empty-sub">Agrega productos para continuar</p>
    </div>
  ) : (
    <>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-img">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="cart-item-info">
            <p className="cart-item-name">{item.name}</p>
            <p className="cart-item-price">${(item.price * item.qty).toFixed(2)}</p>
          </div>
          <div className="cart-item-qty">
            <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
            <span>{item.qty}</span>
            <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
          </div>
          <button className="remove-btn" onClick={() => removeItem(item.id)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </>
  );
}

export default function NavBar({
  logoUrl       = LogoEntreNubes,
  showInicio    = true,
  showProductos = true,
  showContacto  = true,
}) {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems]       = useState([]);

  const links = [
    { label: "Inicio",    path: "/",          show: showInicio    },
    { label: "Productos", path: "/productos",  show: showProductos },
    { label: "Contacto",  path: "/contacto",   show: showContacto  },
  ].filter(l => l.show);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const changeQty  = (id, d) => setItems(p => p.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
  const removeItem = (id)    => setItems(p => p.filter(i => i.id !== id));
  const openCart   = () => { setCartOpen(true); setMenuOpen(false); };

  const isActive = (path) => location.pathname === path;

  const CartFooter = () => items.length > 0 ? (
    <div className="cart-footer">
      <div className="cart-total">
        <span>Total</span>
        <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
      </div>
      <button className="checkout-btn">Seguir con el Pago <ArrowIcon /></button>
    </div>
  ) : null;

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="logo-circle">
            <img src={logoUrl} alt="Logo" />
          </Link>

          {/* Desktop links */}
          <div className="desktop-links">
            {links.map(link => (
              <Link key={link.label} to={link.path} className="nav-link">
                <span className={`link-label${isActive(link.path) ? " active" : ""}`}>
                  {link.label}
                </span>
                <div className={`link-underline${isActive(link.path) ? " active" : ""}`} />
              </Link>
            ))}
          </div>

          <div className="nav-right">
            {/* Desktop cart */}
            <div className="desktop-cart">
              <button className={`cart-btn${cartOpen ? " open" : ""}`}
                onClick={() => { setCartOpen(o => !o); setMenuOpen(false); }}>
                <CartIcon />
                <span>Carrito</span>
                {totalItems > 0 && <div className="cart-badge">{totalItems}</div>}
              </button>

              {cartOpen && (
                <div className="cart-dropdown">
                  <div className="cart-dropdown-header">
                    <span>Mi Carrito</span>
                    <span className="cart-count">{totalItems} artículo{totalItems !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="cart-dropdown-items">
                    <CartItems items={items} changeQty={changeQty} removeItem={removeItem} />
                  </div>
                  <CartFooter />
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button className="hamburger" onClick={() => { setMenuOpen(o => !o); setCartOpen(false); }}>
              <div className={`ham-line${menuOpen ? " open-1" : ""}`} />
              <div className={`ham-line${menuOpen ? " open-2" : ""}`} />
              <div className={`ham-line${menuOpen ? " open-3" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {links.map(link => (
              <Link key={link.label} to={link.path}
                className={`mobile-link${isActive(link.path) ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}>
                {link.label}
                {isActive(link.path) && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </Link>
            ))}
            <button className="mobile-cart-btn" onClick={openCart}>
              <CartIcon size={18} />
              Carrito
              {totalItems > 0 && <span className="mobile-cart-badge">{totalItems}</span>}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile bottom sheet */}
      {cartOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setCartOpen(false)} />
          <div className="mobile-sheet">
            <div className="sheet-handle" />
            <div className="sheet-header">
              <span>Mi Carrito</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="cart-count">{totalItems} artículo{totalItems !== 1 ? "s" : ""}</span>
                <button className="sheet-close" onClick={() => setCartOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="sheet-items">
              <CartItems items={items} changeQty={changeQty} removeItem={removeItem} />
            </div>
            <CartFooter />
          </div>
        </>
      )}
    </div>
  );
}