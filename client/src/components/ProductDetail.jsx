import { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import "./ProductDetail.css";

const ACCORDION_ITEMS = [
  { title: "Envío y devoluciones", body: "Envío gratis en pedidos +$50. Entrega en 24-48h. Devoluciones aceptadas dentro de los 15 días." },
  { title: "Cuidado del producto", body: "Limpiar con paño suave y seco. Evitar exposición prolongada a la humedad. Guardar en lugar fresco." },
];

export default function ProductDetail({
  id,
  imageUrl     = "",
  image2       = "",
  image3       = "",
  productName  = "",
  category     = "",
  price        = "",
  priceValue   = 0,
  oldPrice     = "",
  discount     = "",
  description  = "",
  stockLevel   = "high",
  stockText    = "En stock",
  badge        = "",
  badgeBg      = "#D3FF0B",
  badgeColor   = "#000",
  showDiscount = false,
  variants     = [],
}) {
  const { addItem, openCart } = useCart();
  const [qty, setQty]           = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || "");
  const [added, setAdded]       = useState(false);
  const [sticky, setSticky]     = useState(false);
  const [openAcc, setOpenAcc]   = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const ctaRef                  = useRef(null);

  const images = [imageUrl, image2, image3].filter(Boolean);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setSticky(!e.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  const handleAdd = () => {
    const numericPrice = priceValue || parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
    addItem({
      id,
      name: productName,
      price: numericPrice,
      image: imageUrl,
      variant: selectedVariant,
      variants: variants.length > 0 ? variants : [],
      qty,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  return (
    <div className="pd-wrap">

      {/* Sticky bar */}
      {sticky && (
        <div className="pd-sticky">
          <span className="pd-sticky-name">{productName}</span>
          <span className="pd-sticky-price">{price}</span>
          <button className="pd-sticky-btn" onClick={handleAdd}>
            {added ? "✓ Agregado" : "Agregar"}
          </button>
        </div>
      )}

      <div className="pd-grid">

        {/* Imagen */}
        <div className="pd-img-col">
          <div className="pd-img-main">
            <img src={images[activeImg] || imageUrl} alt={productName} />
            <div className="pd-badge-wrap">
              {badge && (
                <span className="pd-badge" style={{ background: badgeBg, color: badgeColor }}>
                  {badge}
                </span>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((src, i) => (
                <div key={i} className={`pd-thumb${activeImg === i ? " active" : ""}`}
                  onClick={() => setActiveImg(i)}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info-col">
          <div>
            <p className="pd-category">{category}</p>
            <h1 className="pd-name">{productName}</h1>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">{price}</span>
            {showDiscount && oldPrice && <span className="pd-price-old">{oldPrice}</span>}
            {showDiscount && discount && <span className="pd-discount">{discount}</span>}
          </div>

          <p className="pd-desc">{description}</p>

          <div className="pd-stock">
            <span className={`pd-stock-dot ${stockLevel}`} />
            <span className={`pd-stock-text ${stockLevel}`}>{stockText}</span>
          </div>

          {/* Variantes del JSON */}
          {variants.length > 0 && (
            <div>
              <p className="pd-section-label">
                Variante — <span style={{ color:"#111" }}>{selectedVariant}</span>
              </p>
              <div className="pd-variants">
                {variants.map(v => (
                  <button key={v}
                    className={`pd-variant${selectedVariant === v ? " active" : ""}`}
                    onClick={() => setSelectedVariant(v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-qty-row" ref={ctaRef}>
            <div className="pd-qty">
              <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="pd-qty-num">{qty}</span>
              <button className="pd-qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className={`pd-cta${added ? " added" : ""}`} onClick={handleAdd}>
              {added ? <>✓ Agregado al carrito</> : (
                <>
                  Agregar al carrito
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </>
              )}
            </button>
          </div>

          <div className="pd-trust">
            {[
              { icon:"🚚", text:"Envío gratis +$50" },
              { icon:"🔒", text:"Pago seguro" },
              { icon:"↩️", text:"15 días devolución" },
            ].map((t, i) => (
              <div key={i} className="pd-trust-item">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          <div className="pd-accordion">
            {/* Descripción completa del JSON */}
            <div className="pd-acc-item">
              <button className="pd-acc-header" onClick={() => setOpenAcc(openAcc === -1 ? null : -1)}>
                Descripción completa
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: openAcc === -1 ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="pd-acc-body" style={{ maxHeight: openAcc === -1 ? "200px" : "0", opacity: openAcc === -1 ? 1 : 0 }}>
                {description}
              </div>
            </div>

            {ACCORDION_ITEMS.map((item, i) => (
              <div key={i} className="pd-acc-item">
                <button className="pd-acc-header" onClick={() => setOpenAcc(openAcc === i ? null : i)}>
                  {item.title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: openAcc === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="pd-acc-body" style={{ maxHeight: openAcc === i ? "200px" : "0", opacity: openAcc === i ? 1 : 0 }}>
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}