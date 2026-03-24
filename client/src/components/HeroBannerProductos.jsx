import { useState, useEffect } from "react";
import "./HeroBannerProductos.css";

export default function PageBanner({
  imageUrl   = "https://cdn.abacus.ai/images/bfea82ef-1cf1-46d8-b63b-2e3c473e74ac.png",
  titleLine1 = "Todo lo que",
  titleAccent = "necesitás.",
  subtitle   = "Explorá nuestra selección de productos premium.",
  ctaText    = "Ver Catálogo",
}) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(k => k + 1);
  }, [imageUrl, titleLine1, titleAccent, subtitle, ctaText]);

  return (
    <div key={key} className="pb-wrap">
      <img src={imageUrl} alt="" className="pb-img" />
      <div className="pb-overlay" />
      <div className="pb-accent" />

      <div className="pb-content">
        <h1 className="pb-title">
          {titleLine1}<br />
          <span>{titleAccent}</span>
        </h1>
        <p className="pb-sub">{subtitle}</p>
        <button className="pb-cta">
          {ctaText}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}