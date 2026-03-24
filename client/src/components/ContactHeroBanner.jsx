import "./ContactHeroBanner.css";

export default function ContactHeroBanner({
  imageUrl     = "https://cdn.abacus.ai/images/500d6a99-50bf-48e4-acdc-5996a83f8ef3.png",
  tag          = "Clientes & Proveedores",
  title        = "Hablemos",
  titleAccent  = "Negocios",
  subtitle     = "Ya seas cliente buscando los mejores productos o proveedor con algo especial que ofrecer — aquí encontrarás la puerta abierta.",
  badge1       = "💬 Atención al cliente",
  badge2       = "🤝 Alianzas comerciales",
  badge3       = "📦 Distribución",
}) {
  return (
    <section className="chb-wrap">
      <img className="chb-img" src={imageUrl} alt="Contacto" />
      <div className="chb-overlay" />
      <div className="chb-content">
        <p className="chb-tag">{tag}</p>
        <h1 className="chb-title">
          {title} <span>{titleAccent}</span>
        </h1>
        <div className="chb-line" />
        <p className="chb-subtitle">{subtitle}</p>
        <div className="chb-badges">
          <div className="chb-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f135" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {badge1}
          </div>
          <div className="chb-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f135" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {badge2}
          </div>
          <div className="chb-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f135" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {badge3}
          </div>
        </div>
      </div>
    </section>
  );
}