import { useState } from "react";
import "./ProductGridProductos.css";

const PRODUCTS = [
  { id:1,  name:"Glass Pipe",      price:34.99, badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Pipas",          image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80" },
  { id:2,  name:"Grinder Pro",     price:24.99, badge:"OFERTA",   badgeBg:"#FF3913", badgeColor:"#fff", category:"Molinillos",     image:"https://images.unsplash.com/photo-1585314540237-13cb89f0a4b9?w=600&h=400&fit=crop&q=80" },
  { id:3,  name:"Rolling Papers",  price:4.99,  badge:"Popular",  badgeBg:"#8DC63F", badgeColor:"#fff", category:"Papeles",        image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80" },
  { id:4,  name:"Vape Pen",        price:49.99, badge:"Premium",  badgeBg:"#000",    badgeColor:"#D3FF0B", category:"Vaporizadores", image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80" },
  { id:5,  name:"Herb Jar",        price:19.99, badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Almacenamiento", image:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&q=80" },
  { id:6,  name:"Lighter Set",     price:9.99,  badge:"Pack x3",  badgeBg:"#8DC63F", badgeColor:"#fff", category:"Encendedores",   image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop&q=80" },
  { id:7,  name:"Bong Classic",    price:59.99, badge:"OFERTA",   badgeBg:"#FF3913", badgeColor:"#fff", category:"Pipas",          image:"https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&h=400&fit=crop&q=80" },
  { id:8,  name:"Hemp Wraps",      price:6.99,  badge:"Oferta",   badgeBg:"#FF3913", badgeColor:"#fff", category:"Papeles",        image:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop&q=80" },
  { id:9,  name:"Dugout Box",      price:14.99, badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Accesorios",     image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&q=80" },
  { id:10, name:"Ashtray Premium", price:12.99, badge:"Popular",  badgeBg:"#8DC63F", badgeColor:"#fff", category:"Accesorios",     image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=80" },
  { id:11, name:"Wax Vaporizer",   price:79.99, badge:"Premium",  badgeBg:"#000",    badgeColor:"#D3FF0B", category:"Vaporizadores", image:"https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80" },
  { id:12, name:"Herb Grinder XL", price:32.99, badge:"OFERTA",   badgeBg:"#FF3913", badgeColor:"#fff", category:"Molinillos",     image:"https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop&q=80" },
  { id:13, name:"Bubbler Pipe",    price:44.99, badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Pipas",          image:"https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=600&h=400&fit=crop&q=80" },
  { id:14, name:"Rolling Tray",    price:18.99, badge:"Popular",  badgeBg:"#8DC63F", badgeColor:"#fff", category:"Accesorios",     image:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop&q=80" },
  { id:15, name:"Torch Lighter",   price:22.99, badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Encendedores",   image:"https://images.unsplash.com/photo-1558618047-f4e90e8de67b?w=600&h=400&fit=crop&q=80" },
  { id:16, name:"Smell Proof Bag", price:29.99, badge:"OFERTA",   badgeBg:"#FF3913", badgeColor:"#fff", category:"Almacenamiento", image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=80" },
  { id:17, name:"King Size Papers",price:3.99,  badge:"Pack x5",  badgeBg:"#8DC63F", badgeColor:"#fff", category:"Papeles",        image:"https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=600&h=400&fit=crop&q=80" },
  { id:18, name:"Nectar Collector",price:38.99, badge:"Premium",  badgeBg:"#000",    badgeColor:"#D3FF0B", category:"Vaporizadores", image:"https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop&q=80" },
  { id:19, name:"4-Part Grinder",  price:27.99, badge:"Popular",  badgeBg:"#8DC63F", badgeColor:"#fff", category:"Molinillos",     image:"https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=600&h=400&fit=crop&q=80" },
  { id:20, name:"Glass Bong XL",   price:89.99, badge:"Premium",  badgeBg:"#000",    badgeColor:"#D3FF0B", category:"Pipas",         image:"https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&h=400&fit=crop&q=80" },
  { id:21, name:"Stash Box",       price:36.99, badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Almacenamiento", image:"https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&h=400&fit=crop&q=80" },
  { id:22, name:"Blunt Wraps",     price:5.99,  badge:"Pack x10", badgeBg:"#8DC63F", badgeColor:"#fff", category:"Papeles",        image:"https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=400&fit=crop&q=80" },
  { id:23, name:"Dab Pen",         price:67.99, badge:"OFERTA",   badgeBg:"#FF3913", badgeColor:"#fff", category:"Vaporizadores",  image:"https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=400&fit=crop&q=80" },
  { id:24, name:"Hemp Wick",       price:7.99,  badge:"Nuevo",    badgeBg:"#D3FF0B", badgeColor:"#000", category:"Encendedores",   image:"https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&q=80" },
];

const CATEGORIES   = ["Todas", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
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

function AddButton({ type }) {
  const [added, setAdded] = useState(false);
  const handle = (e) => { e.stopPropagation(); setAdded(true); setTimeout(() => setAdded(false), 1500); };
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
  return (
    <div className="pp-card card-appear">
      <div className="pp-card-img-wrap">
        <img src={product.image} alt={product.name} className="pp-card-img" draggable={false} />
        <div className="pp-badge" style={{ background: product.badgeBg, color: product.badgeColor }}>{product.badge}</div>
      </div>
      <div className="pp-card-info">
        <p className="pp-category">{product.category}</p>
        <h3 className="pp-name">{product.name}</h3>
        <span className="pp-price">${product.price.toFixed(2)}</span>
      </div>
      <div className="pp-divider" />
      <AddButton type="grid" />
    </div>
  );
}

function ListCard({ product }) {
  return (
    <div className="pp-list-card card-appear">
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
          <span className="pp-list-price">${product.price.toFixed(2)}</span>
          <AddButton type="list" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ title = "Todos los Productos" }) {
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort]         = useState("default");
  const [view, setView]         = useState("grid");
  const [page, setPage]         = useState(1);
  const PER_PAGE = 24;

  let filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat    = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === "price-asc")  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === "name")       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));

  const shown   = filtered.slice(0, page * PER_PAGE);
  const hasMore = shown.length < filtered.length;

  return (
    <div id="productos-grid" className="pp-wrap">

      {/* Header */}
      <div className="pp-header">
        <div>
          <p className="pp-label">Catálogo completo</p>
          <h2 className="pp-title">{title}</h2>
        </div>
        <span className="pp-count">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Toolbar */}
      <div className="pp-toolbar">
        <div className="pp-search-wrap">
          <SearchIcon />
          <input className="pp-search-input" type="text" placeholder="Buscar producto..."
            value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
          {query && <button className="pp-clear-btn" onClick={() => setQuery("")}>✕</button>}
        </div>
        <div className="pp-select-wrap hide-mobile">
          <select className="pp-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="pp-sort-wrap hide-mobile">
          <select className="pp-select" value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="pp-view-toggle">
          <button className={`pp-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}><GridIcon /></button>
          <button className={`pp-view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")}><ListIcon /></button>
        </div>
      </div>

      {/* Mobile pills */}
      <div className="pp-pills">
        {CATEGORIES.map(c => (
          <button key={c} className={`pp-pill${category === c ? " active" : ""}`}
            onClick={() => { setCategory(c); setPage(1); }}>{c}</button>
        ))}
      </div>

      {/* Mobile sort */}
      <div className="pp-mobile-sort">
        <select className="pp-select" style={{ width:"100%", height:"44px" }} value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Products */}
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

      {/* Load more */}
      {hasMore && (
        <div className="pp-load-more">
          <button className="pp-load-btn" onClick={() => setPage(pg => pg + 1)}>
            Ver más productos ({filtered.length - shown.length} restantes)
          </button>
        </div>
      )}
    </div>
  );
}