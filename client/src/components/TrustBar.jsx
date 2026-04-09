import { useState, useEffect } from "react";
import "./TrustBar.css";

const ShipIcon = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const CardIcon = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const ShieldIcon = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ChatIcon = ({ color }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const ICONS = [ShipIcon, CardIcon, ShieldIcon, ChatIcon];

function TrustItem({ Icon, title, sub, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`trust-item${isLast ? " last" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className={`trust-icon-wrap${hovered ? " hovered" : ""}`}>
        <Icon color={hovered ? "#fff" : "#8DC63F"} />
      </div>
      <div>
        <p className="trust-title">{title}</p>
        <p className="trust-sub">{sub}</p>
      </div>
    </div>
  );
}

function TrustItemCompact({ Icon, title, sub }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="trust-item-compact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className={`trust-icon-compact${hovered ? " hovered" : ""}`}>
        <Icon color={hovered ? "#fff" : "#8DC63F"} />
      </div>
      <div>
        <p className="trust-title-sm">{title}</p>
        <p className="trust-sub-sm">{sub}</p>
      </div>
    </div>
  );
}

export default function TrustBar({
  item1Title = "Envio Rapido",
  item1Sub   = "",
  item2Title = "Pago Seguro",
  item2Sub   = "",
  item3Title = "Calidad Garantizada",
  item3Sub   = "",
  item4Title = "Soporte 7/7",
  item4Sub   = "",
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const labels = [
    { title: item1Title, sub: item1Sub },
    { title: item2Title, sub: item2Sub },
    { title: item3Title, sub: item3Sub },
    { title: item4Title, sub: item4Sub },
  ];

  return (
    <div className="trust-bar">
      {!isMobile ? (
        <div className="trust-row">
          {ICONS.map((Icon, i) => (
            <TrustItem key={i} Icon={Icon} title={labels[i].title} sub={labels[i].sub} isLast={i === 3} />
          ))}
        </div>
      ) : (
        <div className="trust-grid">
          {ICONS.map((Icon, i) => (
            <TrustItemCompact key={i} Icon={Icon} title={labels[i].title} sub={labels[i].sub} />
          ))}
        </div>
      )}
    </div>
  );
}