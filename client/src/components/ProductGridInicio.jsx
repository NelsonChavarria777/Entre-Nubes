import { useState } from "react";
import "./ProductGridInicio.css";

const products = [
  { id: 1, name: "Glass Pipe", price: "$34.99", badge: "Nuevo", badgeBg: "#D3FF0B", badgeColor: "#000", category: "Pipas", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80" },
  { id: 2, name: "Grinder Pro", price: "$24.99", badge: "Oferta", badgeBg: "#FF3913", badgeColor: "#fff", category: "Molinillos", image: "https://images.unsplash.com/photo-1585314540237-13cb89f0a4b9?w=400&h=300&fit=crop&q=80" },
  { id: 3, name: "Rolling Papers", price: "$4.99", badge: "Popular", badgeBg: "#8DC63F", badgeColor: "#fff", category: "Papeles", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80" },
  { id: 4, name: "Vape Pen", price: "$49.99", badge: "Premium", badgeBg: "#000", badgeColor: "#D3FF0B", category: "Vaporizadores", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80" },
  { id: 5, name: "Herb Jar", price: "$19.99", badge: "Nuevo", badgeBg: "#D3FF0B", badgeColor: "#000", category: "Almacenamiento", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&q=80" },
  { id: 6, name: "Lighter Set", price: "$9.99", badge: "Pack x3", badgeBg: "#8DC63F", badgeColor: "#fff", category: "Encendedores", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&q=80" },
  { id: 7, name: "Bong Classic", price: "$59.99", badge: "Top", badgeBg: "#FF3913", badgeColor: "#fff", category: "Pipas", image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=300&fit=crop&q=80" },
  { id: 8, name: "Hemp Wraps", price: "$6.99", badge: "Oferta", badgeBg: "#FF3913", badgeColor: "#fff", category: "Papeles", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&q=80" },
  { id: 9, name: "Dugout Box", price: "$14.99", badge: "Nuevo", badgeBg: "#D3FF0B", badgeColor: "#000", category: "Accesorios", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80" },
  { id: 10, name: "Ashtray Premium", price: "$12.99", badge: "Popular", badgeBg: "#8DC63F", badgeColor: "#fff", category: "Accesorios", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&q=80" },
  { id: 11, name: "Wax Vaporizer", price: "$79.99", badge: "Premium", badgeBg: "#000", badgeColor: "#D3FF0B", category: "Vaporizadores", image: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=300&fit=crop&q=80" },
  { id: 12, name: "Herb Grinder XL", price: "$32.99", badge: "Oferta", badgeBg: "#FF3913", badgeColor: "#fff", category: "Molinillos", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&q=80" },
];

const categories = ["Todas", ...Array.from(new Set(products.map(p => p.category)))];

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function Card({ product }) {
  const [added, setAdded] = useState(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="pc card-appear">
      <div className="pc-img-wrap">
        <img src={product.image} alt={product.name} className="pc-img" draggable={false} />
        <div className="badge" style={{ backgroundColor: product.badgeBg, color: product.badgeColor }}>
          {product.badge}
        </div>
      </div>
      <div className="pc-info">
        <p className="pc-category">{product.category}</p>
        <h3 className="pc-name">{product.name}</h3>
        <span className="pc-price">{product.price}</span>
      </div>
      <div className="pc-divider" />
      <button className="pc-btn" onClick={handleAdd}>
        {added ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            ¡Listo!
          </>
        ) : (
          <><CartIcon /> Agregar</>
        )}
      </button>
    </div>
  );
}

export default function ProductGrid({ title = "Nuestros Productos" }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="section-wrap">
      {/* Header */}
      <div className="section-header">
        <p className="section-label">Catálogo</p>
        <h2 className="section-title">{title}</h2>
      </div>

      {/* Search + select */}
      <div className="filter-bar">
        <div className="search-wrap">
          <SearchIcon />
          <input
            className="search-input"
            type="text"
            placeholder="Buscar producto..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className="clear-btn" onClick={() => setQuery("")}>✕</button>}
        </div>
        <div className="select-wrap">
          <select className="cat-select" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="results-count">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Mobile pills */}
      <div className="cat-pills">
        {categories.map(c => (
          <button key={c} className={`cat-pill${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map(p => <Card key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="no-results">
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
          <p className="no-results-title">Sin resultados</p>
          <p className="no-results-sub">Intenta con otro nombre o categoría</p>
        </div>
      )}
    </div>
  );
}