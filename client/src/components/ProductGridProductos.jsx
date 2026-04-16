import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./ProductGridProductos.css";

const SORT_OPTIONS = [
  { value:"default",    label:"Destacados" },
  { value:"price-asc",  label:"Precio: menor a mayor" },
  { value:"price-desc", label:"Precio: mayor a menor" },
  { value:"name",       label:"Nombre A-Z" },
];

// Icono de drag
const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
  </svg>
);

// Icono de guardar
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

// Icono de edición
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// Icono de check
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

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
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [query, setQuery]         = useState("");
  const [category, setCategory]   = useState("Todas");
  const [sort, setSort]           = useState("default");
  const [view, setView]           = useState("grid");
  const [page, setPage]           = useState(1);
  const [editMode, setEditMode]   = useState(false); // Modo edición para admins
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const { user } = useAuth(); // Detectar si es admin
  const PER_PAGE = 20;
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(`${apiUrl}/api/productos`)
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => { setError("No se pudo cargar los productos"); setLoading(false); });
  }, []);

  // Guardar el nuevo orden de productos
  const saveOrder = async () => {
    if (!user?.isAdmin) return;
    setSavingOrder(true);
    
    try {
      // Preparar actualizaciones
      const updates = filtered.map((p, index) => ({
        id: p.id,
        position: index + 1
      }));
      
      // Enviar al backend
      const response = await fetch(`${apiUrl}/api/productos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar en el servidor');
      }
      
      const result = await response.json();
      console.log('Guardado:', result);
      
      // Actualizar estado local
      setProducts(prev => {
        const newProducts = [...prev];
        updates.forEach(update => {
          const idx = newProducts.findIndex(p => p.id === update.id);
          if (idx !== -1) {
            newProducts[idx] = { ...newProducts[idx], position: update.position };
          }
        });
        return newProducts;
      });
      
      setEditMode(false);
      alert('Orden guardado correctamente');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setSavingOrder(false);
    }
  };

  // Handlers de Drag and Drop
  const handleDragStart = (e, productId) => {
    setDraggingId(productId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    
    // Reordenar visualmente
    const dragIndex = filtered.findIndex(p => p.id === draggingId);
    const targetIndex = filtered.findIndex(p => p.id === targetId);
    
    if (dragIndex === -1 || targetIndex === -1) return;
    
    const newFiltered = [...filtered];
    const [draggedItem] = newFiltered.splice(dragIndex, 1);
    newFiltered.splice(targetIndex, 0, draggedItem);
    
    // Actualizar el estado de products manteniendo el orden
    const otherProducts = products.filter(p => !newFiltered.find(np => np.id === p.id));
    setProducts([...otherProducts, ...newFiltered.map((p, i) => ({ ...p, position: i + 1 }))]);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const CATEGORIES = ["Todas", ...Array.from(new Set(products.map(p => p.category)))];

  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat    = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === "default")    filtered = [...filtered].sort((a,b) => (a.position ?? 999999) - (b.position ?? 999999) || a.id - b.id);
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
          <input 
            className="pp-search-input" 
            type="text" 
            placeholder="Buscar producto..."
            value={query} 
            onChange={e => handleSearch(e.target.value)}
            disabled={editMode}
          />
          {query && <button className="pp-clear-btn" onClick={() => handleSearch("")}>✕</button>}
        </div>
        <div className="pp-select-wrap hide-mobile">
          <select 
            className="pp-select" 
            value={category} 
            onChange={e => handleCategory(e.target.value)}
            disabled={editMode}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="pp-sort-wrap hide-mobile">
          <select 
            className="pp-select" 
            value={sort} 
            onChange={e => handleSort(e.target.value)}
            disabled={editMode}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="pp-view-toggle">
          <button 
            className={`pp-view-btn${view === "grid" ? " active" : ""}`} 
            onClick={() => setView("grid")}
            disabled={editMode}
          >
            <GridIcon />
          </button>
          <button 
            className={`pp-view-btn${view === "list" ? " active" : ""}`} 
            onClick={() => setView("list")}
            disabled={editMode}
          >
            <ListIcon />
          </button>
        </div>
        
        {/* Botón de edición para admins */}
        {user?.isAdmin && (
          <div className="pp-admin-controls">
            {!editMode ? (
              <button 
                className="pp-edit-order-btn" 
                onClick={() => {
                  setEditMode(true);
                  setSort("default");
                  setQuery("");
                  setCategory("Todas");
                }}
                title="Editar orden de productos"
              >
                <EditIcon /> Editar orden
              </button>
            ) : (
              <div className="pp-edit-actions">
                <button 
                  className="pp-save-order-btn" 
                  onClick={saveOrder}
                  disabled={savingOrder}
                >
                  {savingOrder ? (
                    <>Guardando...</>
                  ) : (
                    <><SaveIcon /> Guardar</>
                  )}
                </button>
                <button 
                  className="pp-cancel-order-btn" 
                  onClick={() => setEditMode(false)}
                  disabled={savingOrder}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pp-pills">
        {CATEGORIES.map(c => (
          <button key={c} className={`pp-pill${category === c ? " active" : ""}`}
            onClick={() => handleCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="pp-mobile-sort">
        <select className="pp-select" style={{ width:"100%", height:"44px" }} value={sort} onChange={e => handleSort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {editMode && (
        <div className="pp-edit-banner">
          <DragIcon />
          <span>Modo edición: Arrastra los productos para cambiar su orden</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="pp-empty">
          <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</div>
          <p className="pp-empty-title">Sin resultados</p>
          <p className="pp-empty-sub">Intenta con otro nombre o categoría</p>
        </div>
      ) : view === "grid" ? (
        <div className={`pp-grid${editMode ? " pp-editing" : ""}`}>
          {shown.map(p => (
            <div 
              key={p.id}
              className={`pp-drag-wrapper${draggingId === p.id ? " pp-dragging" : ""}`}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, p.id)}
              onDragOver={(e) => handleDragOver(e, p.id)}
              onDragEnd={handleDragEnd}
            >
              {editMode && (
                <div className="pp-drag-handle">
                  <DragIcon />
                  <span className="pp-position-badge">{filtered.findIndex(fp => fp.id === p.id) + 1}</span>
                </div>
              )}
              <GridCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`pp-list${editMode ? " pp-editing" : ""}`}>
          {shown.map(p => (
            <div 
              key={p.id}
              className={`pp-drag-wrapper${draggingId === p.id ? " pp-dragging" : ""}`}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, p.id)}
              onDragOver={(e) => handleDragOver(e, p.id)}
              onDragEnd={handleDragEnd}
            >
              {editMode && (
                <div className="pp-drag-handle pp-list-drag-handle">
                  <DragIcon />
                  <span className="pp-position-badge">{filtered.findIndex(fp => fp.id === p.id) + 1}</span>
                </div>
              )}
              <ListCard product={p} />
            </div>
          ))}
        </div>
      )}

      {filtered.length > PER_PAGE && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}