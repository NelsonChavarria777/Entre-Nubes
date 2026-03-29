import { useState, useEffect } from "react";
import "./ProductGridInicio.css";

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
        <span className="pc-price">${product.price.toFixed(2)}</span>
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
  const [products, setProducts] = useState([]);
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState("Todas");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 12));
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar los productos");
        setLoading(false);
      });
  }, []);

  const categories = ["Todas", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat    = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div className="section-wrap">
      <div style={{ textAlign:"center", padding:"60px 0" }}>
        <p style={{ fontFamily:"'Permanent Marker', cursive", fontSize:"22px", color:"#ccc" }}>Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="section-wrap">
      <div style={{ textAlign:"center", padding:"60px 0" }}>
        <p style={{ fontFamily:"'Permanent Marker', cursive", fontSize:"22px", color:"#FF3913" }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="section-wrap">
      <div className="section-header">
        <p className="section-label">Catálogo</p>
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <SearchIcon />
          <input className="search-input" type="text" placeholder="Buscar producto..."
            value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button className="clear-btn" onClick={() => setQuery("")}>✕</button>}
        </div>
        <div className="select-wrap">
          <select className="cat-select" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="results-count">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="cat-pills">
        {categories.map(c => (
          <button key={c} className={`cat-pill${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map(p => <Card key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="no-results">
          <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</div>
          <p className="no-results-title">Sin resultados</p>
          <p className="no-results-sub">Intenta con otro nombre o categoría</p>
        </div>
      )}
    </div>
  );
}