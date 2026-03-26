import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBannerInicio.css";

const slides = [
  {
    id: 1,
    image: "https://www.shutterstock.com/image-photo/accessories-smoking-marijuana-store-smoke-600nw-1498178294.jpg",
    label: "Colección Premium",
    title: "Eleva tu\nexperiencia",
    sub: "Accesorios de la más alta calidad para los verdaderos conocedores.",
    accent: "#D3FF0B",
    kenBurns: "kenBurns0",
  },
  {
    id: 2,
    image: "https://www.vaposhop.com/cdn/shop/collections/raw-rolling-paper-banner.jpg?v=1750312762&width=1800",
    label: "Nuevos Ingresos",
    title: "Sabor &\nEstilo",
    sub: "Rolling papers, grinders y más — todo en un solo lugar.",
    accent: "#8DC63F",
    kenBurns: "kenBurns1",
  },
  {
    id: 3,
    image: "https://img.freepik.com/fotos-premium/matriz-vapeos-colores-pantalla-resaltando-opciones-sabor-concepto-vapeos-color-opciones-sabor-mostrar-matriz-resaltando_918839-183123.jpg",
    label: "Vaporizadores",
    title: "El futuro\nes ahora",
    sub: "La mejor tecnología de vaporización disponible.",
    accent: "#FF3913",
    kenBurns: "kenBurns2",
  },
  {
    id: 4,
    image: "https://media.istockphoto.com/id/918226564/es/foto/estilo-de-vida-en-amsterdam.jpg?s=612x612&w=0&k=20&c=FLpKOlUcrs75XBIaOlM4DFgIBf4iojLefyxP3mFcgZc=",
    label: "Almacenamiento",
    title: "Frescura\ngarantizada",
    sub: "Guarda tus productos con estilo y hermeticidad total.",
    accent: "#D3FF0B",
    kenBurns: "kenBurns3",
  },
  {
    id: 5,
    image: "https://cdn.pixabay.com/photo/2017/08/17/13/05/lighter-2651256_1280.jpg",
    label: "Encendedores",
    title: "Detalle en\ncada chispa",
    sub: "Encendedores de diseño para llevar siempre contigo.",
    accent: "#8DC63F",
    kenBurns: "kenBurns4",
  },
];

const DURATION = 5000;

export default function HeroBanner({ autoPlay = true }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState(0);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = (idx) => {
    setCurrent(idx);
    setKey(k => k + 1);
    setProgress(0);
    startTimeRef.current = performance.now();
  };

  const next   = () => goTo((current + 1) % slides.length);
  const goBack = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!autoPlay) return;
    startTimeRef.current = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - startTimeRef.current) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick);
      } else {
        next();
      }
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, autoPlay]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) { delta < 0 ? next() : goBack(); }
    touchStartX.current = null;
  };

  const slide = slides[current];

  return (
    <div
      className="hero-wrap"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const isActive = i === current;
        return (
          <div key={s.id} className={`hero-slide${isActive ? " active" : ""}`}>
            <div className="hero-img-wrap">
              <img
                src={s.image} alt={s.title} draggable={false}
                style={{ animation: isActive ? `${s.kenBurns} ${DURATION + 1000}ms ease-in-out forwards` : "none" }}
              />
            </div>
            <div className="hero-gradient-left" />
            <div className="hero-gradient-bottom" />
          </div>
        );
      })}

      {/* Content */}
      <div key={`content-${key}`} className="hero-content">
        <div className="slide-label">
          <span style={{ color: slide.accent }}>— {slide.label}</span>
        </div>
        <h1 className="slide-title" style={{ color: "#fff" }}>{slide.title}</h1>
        <p className="slide-sub">{slide.sub}</p>
        <div className="slide-cta hero-cta-wrap">
          <button className="cta-main" onClick={() => navigate("/productos")}>Ver Productos</button>
        </div>
      </div>

      {/* Counter */}
      <div className="hero-counter">
        <span className="hero-counter-num">{String(current + 1).padStart(2, "0")}</span>
        <span className="hero-counter-total">/ {String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Arrows */}
      <div className="hero-arrows">
        <button className="hero-arrow" onClick={goBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button className="hero-arrow" onClick={next}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`thumb${i === current ? " active" : ""}`}
            style={{ backgroundColor: i === current ? slide.accent : "#fff" }}
            onClick={() => goTo(i)}
          >
            {i === current && <div className="progress-bar" style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>

      {/* Accent top line */}
      <div className="hero-accent-line" style={{ background: `linear-gradient(90deg, ${slide.accent}, transparent)` }} />
    </div>
  );
}