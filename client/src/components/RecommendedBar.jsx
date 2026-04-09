import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import "./RecommendedBar.css";

const VISIBLE = 4;
const CARD_W = 236;

function QuickAddBtn({ product, addedId, onAdd }) {
  const isAdded = addedId === product.id;
  const { addItem } = useCart();

  const handleClick = (e) => {
    e.stopPropagation();
    const variant = product.variants?.[0] || "";
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant,
      variants: product.variants || [],
      qty: 1,
    });
    onAdd(product.id);
  };

  return (
    <button
      className={"rb-card-quick" + (isAdded ? " added" : "")}
      onClick={handleClick}
      aria-label="Agregar al carrito"
    >
      {isAdded ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      )}
    </button>
  );
}

export default function RecommendedBar({
  sectionTitle = "También te puede gustar",
  eyebrow = "Recomendados",
  currentProductId = null,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [addedId, setAddedId] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => {
        const allProducts = Array.isArray(data) ? data : data.productos || [];
        const filtered = currentProductId 
          ? allProducts.filter(p => p.id !== currentProductId)
          : allProducts;
        setProducts(filtered.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentProductId]);

  const maxOffset = Math.max(0, products.length - VISIBLE);

  const prev = () => setOffset(o => Math.max(0, o - 1));
  const next = () => setOffset(o => Math.min(maxOffset, o + 1));

  const handleQuickAdd = (id) => {
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1400);
  };


  const formatPrice = (price, discount) => {
    const finalPrice = discount 
      ? Math.round(price - (price * discount / 100))
      : Math.round(price);
    return `₡${finalPrice.toLocaleString("es-CR")}`;
  };

  const formatOldPrice = (price) => {
    return `₡${Math.round(price).toLocaleString("es-CR")}`;
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="rb-section">
      <div className="rb-header">
        <div>
          <p className="rb-eyebrow">{eyebrow}</p>
          <h2 className="rb-title">{sectionTitle}</h2>
        </div>
        <div className="rb-nav-btns">
          <button className="rb-nav-btn" onClick={prev} disabled={offset === 0} aria-label="Anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className="rb-nav-btn" onClick={next} disabled={offset >= maxOffset} aria-label="Siguiente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="rb-track-wrap">
        <div
          ref={trackRef}
          className="rb-track"
          style={{ transform: `translateX(-${offset * CARD_W}px)` }}
        >
          {products.map(p => {
            const hasDiscount = p.discount && p.discount > 0;
            return (
              <div key={p.id} className="rb-card" onClick={() => window.location.href = `/producto/${p.id}`}>
                <div className="rb-card-img">
                  <img src={p.image} alt={p.name} />
                  {p.badge && (
                    <span className="rb-card-badge" style={{ background: p.badgeBg, color: p.badgeColor }}>
                      {p.badge}
                    </span>
                  )}
                  <QuickAddBtn product={p} addedId={addedId} onAdd={handleQuickAdd} />
                </div>
                <div className="rb-card-body">
                  <p className="rb-card-cat">{p.category}</p>
                  <p className="rb-card-name">{p.name}</p>
                  <div className="rb-card-price-row">
                    <span className="rb-card-price">{formatPrice(p.price, p.discount)}</span>
                    {hasDiscount && <span className="rb-card-old">{formatOldPrice(p.price)}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rb-dots">
        {Array.from({ length: maxOffset + 1 }).map((_, i) => (
          <button
            key={i}
            className="rb-dot"
            onClick={() => setOffset(i)}
            aria-label={`Página ${i + 1}`}
            style={{
              width: offset === i ? "20px" : "6px",
              background: offset === i ? "#6aaa00" : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
