import React, { useMemo } from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

// hero images
import hero1 from "../assets/banner-1.gif";
import hero2 from "../assets/banner-2.gif";
import hero3 from "../assets/banner-3.gif";

const heroAnim = {
  hidden: { opacity: 0, scale: 0.98, y: 18 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, y: -18, transition: { duration: 0.35 } },
};

// small T-shirt preview icon


export default function HeroCarousel() {
  const { theme } = useTheme();

  const bases = useMemo(
    () => [
      { id: "slide-1", img: hero1 },
      { id: "slide-2", img: hero2 },
      { id: "slide-3", img: hero3 },
    ],
    []
  );

  const initial = {};
  bases.forEach((_, i) => (initial[i] = "#ffffff"));


  return (
    <Container className="hero-gradient rounded-3 p-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={theme} initial="hidden" animate="show" exit="exit" variants={heroAnim}>
          <div className="hero-carousel-inner">
            <Carousel fade interval={4500}>
              {bases.map((b, idx) => {
                
                return (
                  <Carousel.Item key={b.id}>
                    {/* image */}
                    <img className="d-block w-100 hero-img" src={b.img} alt={`slide ${idx + 1}`} />

                    {/* caption BELOW image */}
                    <div className={`carousel-caption-bottom ${theme}`}>
                      <div className="caption-content">
                    
                        {/* ✅ Single Button → goes to customizer */}
                        <Button
                          as={Link}
                          to="/customizer"   // matches App.js route
                          className="btn-gradient caption-btn"
                        >
                          Start Designing
                        </Button>
                      </div>
                    </div>
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
