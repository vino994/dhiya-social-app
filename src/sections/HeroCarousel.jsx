import React, { useMemo, useState } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import hero1 from "../assets/t-10.jpg";
import hero2 from "../assets/t-11.png";
import hero3 from "../assets/t-12.jpg";

const heroAnim = {
  hidden: { opacity: 0, scale: 0.98, y: 18 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, y: -18, transition: { duration: 0.35 } },
};

function TShirtSVG({ fill = "#ffffff", size = 76 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ display: "block" }}>
      <g transform="translate(2 2)">
        <path
          d="M6 6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v3c0 .6-.4 1-1 1H12c-1.1 0-2 .9-2 2v18h28V10c0-1.1-.9-2-2-2H36c-.6 0-1-.4-1-1V6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v4c4 0 5 3 5 3v6c0 6-6 10-6 10l-8 6v6H8v-6L0 29S0 23 0 17V11s1-3 5-3V6z"
          fill={fill}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

export default function HeroCarousel() {
  const { theme } = useTheme();

  const bases = useMemo(
    () => [
      {
        id: "base-white",
        title: "Essential Tee — Classic White",
        subtitle: "Clean base for any print. Lightweight cotton, everyday fit.",
        price: 19.99,
        img: hero1,
        colors: ["#ffffff", "#f2f2f2", "#e6e6e6"],
        productId: "p-tshirt-white",
      },
      {
        id: "base-black",
        title: "Essential Tee — Midnight Black",
        subtitle: "Bold base for high-contrast prints. Soft, durable knit.",
        price: 21.99,
        img: hero2,
        colors: ["#0b0b0b", "#2b2b2b", "#444444"],
        productId: "p-tshirt-black",
      },
      {
        id: "base-heather",
        title: "Essential Tee — Heather Grey",
        subtitle: "Textured look, great for vintage designs.",
        price: 20.5,
        img: hero3,
        colors: ["#d6d6d6", "#bdbdbd", "#9e9e9e"],
        productId: "p-tshirt-heather",
      },
    ],
    []
  );

  const initial = {};
  bases.forEach((_, i) => (initial[i] = bases[i].colors[0]));
  const [selected, setSelected] = useState(initial);

  // function handleSelectColor(slideIndex, color) {
  //   setSelected((s) => ({ ...s, [slideIndex]: color }));
  // }

  return (
    <Container className="hero-gradient rounded-3 p-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={theme} initial="hidden" animate="show" exit="exit" variants={heroAnim}>
          {/* wrapper controls carousel height */}
          <div className="hero-carousel-inner">
            <Carousel fade interval={4500}>
              {bases.map((b, idx) => {
                const currentColor = selected[idx] || b.colors[0];
                return (
                  <Carousel.Item key={b.id}>
                    {/* image fills the .hero-carousel-inner height via CSS */}
                    <img className="d-block w-100 hero-img" src={b.img} alt={b.title} />

                    <Carousel.Caption className={`carousel-text ${theme}`}>
                      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                          <div
                            style={{
                              width: 96,
                              height: 96,
                              borderRadius: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: theme === "dark" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.85)",
                              padding: 8,
                              boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
                            }}
                          >
                            <TShirtSVG fill={currentColor} size={72} />
                          </div>

                          <div style={{ color: theme === "dark" ? "#fff" : "#111" }}>
                            <h1 className="display-6 fw-bold" style={{ marginBottom: 6 }}>
                              {b.title}
                            </h1>
                            <p style={{ marginBottom: 8, opacity: 0.95 }}>{b.subtitle}</p>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ fontWeight: 800, fontSize: 20 }}>${b.price.toFixed(2)}</div>

                              <Button as={Link} to={`/product/${b.productId}`} className="btn-gradient" style={{ padding: "8px 14px" }}>
                                Shop T-shirt
                              </Button>

                              <Button variant="outline-light" size="sm" as={Link} to={`/product/${b.productId}`}>
                                View
                              </Button>
                            </div>

                          
                          </div>
                        </div>
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
