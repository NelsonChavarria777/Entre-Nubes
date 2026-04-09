import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import "./ProductGridProductos.css";

const SORT_OPTIONS = [
  { value:"default",    label:"Destacados" },
  { value:"price-asc",  label:"Precio: menor a mayor" },
  { value:"price-desc", label:"Precio: mayor a menor" },
  { value:"name",       label:"Nombre A-Z" },
];

const CartIcon  = ({ size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

function AddButton({ type, product }) {
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();
  
  const handle = (e) => { 
    e.stopPropagation(); 
    
    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : "";
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: firstVariant,
      variants: product.variants || [],
      qty: 1,
    });
    
    setAdded(true); 
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800); 
  };
  
  return type === "grid" ? (
    <button className="pp-card-btn" onClick={handle}>
      {added ? <><CheckIcon />Listo!</> : <><CartIcon />Agregar</>}
    </button>
  ) : (
    <button className="pp-list-btn" onClick={handle}>
      {added ? <><CheckIcon />Listo!</> : <><CartIcon size={13}/>Agregar</>}
    </button>
  );
}

function GridCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="pp-card card-appear" onClick={() => navigate(`/producto/${product.id}`)}>
      <div className="pp-card-img-wrap">
        <img src={product.image} alt={product.name} className="pp-card-img" draggable={false} />
        <div className="pp-badge" style={{ background: product.badgeBg, color: product.badgeColor }}>{product.badge}</div>
      </div>
      <div className="pp-card-info">
        <p className="pp-category">{product.category}</p>
        <h3 className="pp-name">{product.name}</h3>
        <span className="pp-price">₡{Math.round(product.price).toLocaleString("es-CR")}</span>
      </div>
      <div className="pp-divider" />
      <AddButton type="grid" product={product} />
    </div>
  );
}

function ListCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="pp-list-card card-appear" onClick={() => navigate(`/producto/${product.id}`)}>
      <div className="pp-list-img-wrap">
        <img src={product.image} alt={product.name} className="pp-list-img" draggable={false} />
        <div className="pp-badge" style={{ background: product.badgeBg, color: product.badgeColor }}>{product.badge}</div>
      </div>
      <div className="pp-list-info">
        <div>
          <p className="pp-category">{product.category}</p>
          <h3 className="pp-list-name">{product.name}</h3>
        </div>
        <div className="pp-list-footer">
          <span className="pp-list-price">₡{Math.round(product.price).toLocaleString("es-CR")}</span>
          <AddButton type="list" product={product} />
        </div>
      </div>
    </div>
  );
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = getPageNumbers(page, totalPages);
  return (
    <div className="pp-pagination">
      <button className="pp-page-arrow" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ChevronLeftIcon />
      </button>
      <div className="pp-page-numbers">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="pp-page-dots">…</span>
          ) : (
            <button key={p} className={`pp-page-num${page === p ? " active" : ""}`} onClick={() => onPageChange(p)}>
              {p}
            </button>
          )
        )}
      </div>
      <button className="pp-page-arrow" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

export default function ProductPage({ title = "Todos los Productos" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort]         = useState("default");
  const [view, setView]         = useState("grid");
  const [page, setPage]         = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => { setError("No se pudo cargar los productos"); setLoading(false); });
  }, []);

  const CATEGORIES = ["Todas", ...Array.from(new Set(products.map(p => p.category)))];

  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat    = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === "price-asc")  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === "name")       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const shown      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch   = (val) => { setQuery(val);    setPage(1); };
  const handleCategory = (val) => { setCategory(val); setPage(1); };
  const handleSort     = (val) => { setSort(val);     setPage(1); };
  const handlePageChange = (newPage) => {
    setPage(newPage);
    document.querySelector(".pp-wrap")?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  if (loading) return (
    <div className="pp-wrap">
      <div className="pp-empty">
        <p className="pp-empty-title">Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="pp-wrap">
      <div className="pp-empty">
        <p className="pp-empty-title" style={{ color:"#FF3913" }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div id="productos-grid" className="pp-wrap">

      <div className="pp-header">
        <div>
          <p className="pp-label">Catálogo completo</p>
          <h2 className="pp-title">{title}</h2>
        </div>
        <span className="pp-count">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="pp-toolbar">
        <div className="pp-search-wrap">
          <SearchIcon />
          <input className="pp-search-input" type="text" placeholder="Buscar producto..."
            value={query} onChange={e => handleSearch(e.target.value)} />
          {query && <button className="pp-clear-btn" onClick={() => handleSearch("")}>✕</button>}
        </div>
        <div className="pp-select-wrap hide-mobile">
          <select className="pp-select" value={category} onChange={e => handleCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="pp-sort-wrap hide-mobile">
          <select className="pp-select" value={sort} onChange={e => handleSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="pp-view-toggle">
          <button className={`pp-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}><GridIcon /></button>
          <button className={`pp-view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")}><ListIcon /></button>
        </div>
      </div>

      <div className="pp-pills">
        {CATEGORIES.map(c => (
          <button key={c} className={`pp-pill${category === c ? " active" : ""}`}
            onClick={() => handleCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="pp-mobile-sort">
        <select className="pp-select" style={{ width:"100%", height:"44px" }} value={sort} onChange={e => handleSort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="pp-empty">
          <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</div>
          <p className="pp-empty-title">Sin resultados</p>
          <p className="pp-empty-sub">Intenta con otro nombre o categoría</p>
        </div>
      ) : view === "grid" ? (
        <div className="pp-grid">
          {shown.map(p => <GridCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="pp-list">
          {shown.map(p => <ListCard key={p.id} product={p} />)}
        </div>
      )}

      {filtered.length > PER_PAGE && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

    </div>
  );
}