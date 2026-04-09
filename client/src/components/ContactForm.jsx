import { useState } from "react";
import "./ContactForm.css";

const categories = ["Pipas & Accesorios", "Vaporizadores", "Rolling Papers", "Grinders", "Encendedores", "Otros"];

export default function ContactForm({
  defaultTab = "cliente",
  phone      = "+506 7267 7525",
  email      = "entrenubes.smoke@gmail.com",
}) {
  const [tab, setTab]               = useState(defaultTab);
  const [sent, setSent]             = useState(false);
  const [loading, setLoading]       = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);

  const [form, setForm] = useState({
    nombre:"", apellido:"", correo:"", telefono:"",
    asunto:"", mensaje:"", empresa:"", sitio:"", volumen:"",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleCat    = (cat) => setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };
  const reset = () => {
    setSent(false);
    setForm({ nombre:"",apellido:"",correo:"",telefono:"",asunto:"",mensaje:"",empresa:"",sitio:"",volumen:"" });
    setSelectedCats([]);
  };

  return (
    <section className="cf-wrap">

      {/* Header */}
      <div className="cf-header">
        <p className="cf-label-top">Escríbenos</p>
        <h2 className="cf-title">Formulario de Contacto</h2>
      </div>

      {/* Layout */}
      <div className="cf-layout">

        {/* Form card */}
        <div className="cf-card cf-form-card">

          {/* Tabs */}
          <div className="cf-tabs">
            <button className={`cf-tab${tab === "cliente" ? " active" : ""}`} onClick={() => { setTab("cliente"); setSent(false); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Soy Cliente
            </button>
            <button className={`cf-tab${tab === "proveedor" ? " active" : ""}`} onClick={() => { setTab("proveedor"); setSent(false); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Soy Proveedor
            </button>
          </div>

          {/* Success */}
          {sent ? (
            <div className="cf-success">
              <div className="cf-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="cf-success-title">¡Mensaje enviado!</p>
              <p className="cf-success-sub">
                {tab === "cliente"
                  ? "Gracias por escribirnos. Te responderemos pronto."
                  : "Gracias por tu interés. Revisaremos tu propuesta y te contactaremos."}
              </p>
              <button className="cf-submit" style={{ maxWidth:"200px", marginTop:"8px" }} onClick={reset}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-field-label">Nombre</label>
                  <input className="cf-input" name="nombre" placeholder="Juan" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="cf-field">
                  <label className="cf-field-label">Apellido</label>
                  <input className="cf-input" name="apellido" placeholder="Pérez" value={form.apellido} onChange={handleChange} required />
                </div>
              </div>

              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-field-label">Correo</label>
                  <input className="cf-input" type="email" name="correo" placeholder="juan@correo.com" value={form.correo} onChange={handleChange} required />
                </div>
                <div className="cf-field">
                  <label className="cf-field-label">Teléfono</label>
                  <input className="cf-input" type="tel" name="telefono" placeholder="+506 8888-8888" value={form.telefono} onChange={handleChange} />
                </div>
              </div>

              {tab === "proveedor" && (
                <>
                  <div className="cf-row">
                    <div className="cf-field">
                      <label className="cf-field-label">Empresa / Marca</label>
                      <input className="cf-input" name="empresa" placeholder="Mi Empresa S.A." value={form.empresa} onChange={handleChange} />
                    </div>
                    <div className="cf-field">
                      <label className="cf-field-label">Sitio web</label>
                      <input className="cf-input" name="sitio" placeholder="www.miempresa.com" value={form.sitio} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="cf-field">
                    <label className="cf-field-label">Categorías de producto</label>
                    <div className="cf-tag-group">
                      {categories.map(cat => (
                        <button key={cat} type="button"
                          className={`cf-tag${selectedCats.includes(cat) ? " selected" : ""}`}
                          onClick={() => toggleCat(cat)}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="cf-field">
                    <label className="cf-field-label">Volumen estimado de venta</label>
                    <select className="cf-input cf-select" name="volumen" value={form.volumen} onChange={handleChange}>
                      <option value="">Seleccionar...</option>
                      <option>Menos de $500/mes</option>
                      <option>$500 – $2,000/mes</option>
                      <option>$2,000 – $10,000/mes</option>
                      <option>Más de $10,000/mes</option>
                    </select>
                  </div>
                </>
              )}

              {tab === "cliente" && (
                <div className="cf-field">
                  <label className="cf-field-label">Asunto</label>
                  <select className="cf-input cf-select" name="asunto" value={form.asunto} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    <option>Consulta sobre producto</option>
                    <option>Estado de pedido</option>
                    <option>Devolución / cambio</option>
                    <option>Información general</option>
                    <option>Otro</option>
                  </select>
                </div>
              )}

              <div className="cf-field">
                <label className="cf-field-label">
                  {tab === "proveedor" ? "Cuéntanos sobre tu propuesta" : "Mensaje"}
                </label>
                <textarea className="cf-input cf-textarea" name="mensaje"
                  placeholder={tab === "proveedor"
                    ? "Describe brevemente tus productos, condiciones y por qué sería una buena alianza..."
                    : "¿En qué podemos ayudarte?"}
                  value={form.mensaje} onChange={handleChange} required />
              </div>

              <button className="cf-submit" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="cf-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    {tab === "proveedor" ? "Enviar propuesta" : "Enviar mensaje"}
                  </>
                )}
              </button>

            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="cf-sidebar">

          {/* Quick contact */}
          <div className="cf-card">
            <div className="cf-sidebar-header">
              <div className="cf-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="cf-label-top">Contacto rápido</p>
                <p className="cf-sidebar-title">Estamos aquí</p>
              </div>
            </div>

            <div className="cf-info-item">
              <div className="cf-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="cf-info-label">Teléfono</p>
                <p className="cf-info-value">{phone}</p>
              </div>
            </div>

            <div className="cf-info-item">
              <div className="cf-info-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="cf-info-label">Correo</p>
                <p className="cf-info-value">{email}</p>
              </div>
            </div>
          </div>

          {/* Tip card */}
          <div className="cf-card cf-tip-card">
            <p className="cf-tip-label">
              {tab === "proveedor" ? "💼 Para proveedores" : "💬 Respuesta rápida"}
            </p>
            <p className="cf-tip-text">
              {tab === "proveedor"
                ? "Revisamos cada propuesta con atención. Si tu producto encaja con nuestra línea, te contactaremos en menos de 48 horas."
                : "Normalmente respondemos en menos de 2 horas durante horario de atención. También puedes escribirnos por WhatsApp para una respuesta inmediata."}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}