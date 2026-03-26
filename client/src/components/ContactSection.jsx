import "./ContactSection.css";

//Imagenes--------------------------------------------------------------------------------
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const SocialIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const TiktokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
  </svg>
);
const WhatsappIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
//Imagenes--------------------------------------------------------------------------------

//Horas-----------------------------------------------------------------------------------
const hours = [
  { day: "Lunes — Viernes", time: "9:00 AM – 12:00 AM" },
  { day: "Sábado",          time: "10:00 AM – 12:00 AM" },
  { day: "Domingo",         time: "11:00 AM – 12:00 AM" },
];
//Horas-----------------------------------------------------------------------------------

export default function ContactSection({
  phone     = "+506 8888-8888",
  instagram = "@entrenubes.smoke",
  facebook  = "entrenubessmoke",
  tiktok    = "@entrenubes.smoke",
}) {
  return (
    <section className="contact-section">

      {/* Header */}
      <div className="contact-header">
        <p className="contact-label">Encuéntranos</p>
        <h2 className="contact-title">Contáctanos</h2>
      </div>

      {/* Top row */}
      <div className="contact-top-row">

        {/* Map */}
        <div className="contact-card map-card">
          <div className="card-header-row">
            <div className="icon-wrap"><MapIcon /></div>
            <div>
              <p className="card-label">Dirección</p>
              <p className="card-title">100mts Este de la Gasolinera</p>
              <p className="card-sub">Turrúcares, Alajuela, 20111</p>
            </div>
          </div>
          <div className="map-iframe-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1300.6386591684707!2d-84.31548200406014!3d9.962760705526938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0568b00d05c67%3A0x702fd634896bed0d!2sMini%20Super%20y%20Licorera%20La%20Vi%C3%B1a!5e1!3m2!1sen!2scr!4v1772052518398!5m2!1sen!2scr"
              width="100%"
              height="280"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Smoke Shop"
            />
          </div>
        </div>

        {/* Phone + Hours */}
        <div className="contact-side">

          {/* Phone */}
          <div className="contact-card">
            <div className="icon-wrap"><PhoneIcon /></div>
            <p className="card-label">Teléfono</p>
            <p className="card-phone">{phone}</p>
            <p className="card-sub">Disponible en horario de atención</p>
            <button className="whatsapp-btn">
              <WhatsappIcon />
              Escribir por WhatsApp
            </button>
          </div>

          {/* Hours */}
          <div className="contact-card">
            <div className="icon-wrap"><ClockIcon /></div>
            <p className="card-label">Horario</p>
            {hours.map((h, i) => (
              <div key={i} className="hour-row">
                <span className="hour-day">{h.day}</span>
                <span className="hour-time">{h.time}</span>
              </div>
            ))}
            <div className="open-badge">
              <div className="open-dot" />
              <span>Abierto ahora</span>
            </div>
          </div>

        </div>
      </div>

      {/* Social media */}
      <div className="contact-card social-card">
        <div className="card-header-row" style={{ marginBottom: "24px" }}>
          <div className="icon-wrap" style={{ marginBottom: 0 }}><SocialIcon /></div>
          <div>
            <p className="card-label">Síguenos</p>
            <p className="card-title">Redes Sociales</p>
          </div>
        </div>
        <div className="social-list">
          {[
            { icon: <InstagramIcon />, label: "Instagram", handle: instagram, link : `https://instagram.com/${instagram.replace("@", "")}` },
            { icon: <FacebookIcon />,  label: "Facebook",  handle: facebook, link : `https://facebook.com/${facebook}` },
            { icon: <TiktokIcon />,    label: "TikTok",    handle: tiktok, link : `https://tiktok.com/${tiktok}` },
          ].map(s => (
            <div key={s.label} className="social-item">
              <button className="social-btn" onClick={() => window.open(s.link, "_blank")}>
                {s.icon}
              </button>
              <div>
                <p className="card-label">{s.label}</p>
                <p className="social-handle">{s.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}