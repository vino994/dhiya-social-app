// src/components/HeroCarousel.js
import React from "react";
import { Carousel, Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import hero1 from "../assets/rainy.jpg"; // ✅ replace with your image
import hero2 from "../assets/snow.jpg"; // ✅ replace with your image
import hero3 from "../assets/sunny.jpg";
const heroAnim = {
  hidden: { opacity: 0, scale: 0.97, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.97, y: -20, transition: { duration: 0.3 } },
};

export default function HeroCarousel() {
  const { theme } = useTheme();

  return (
    <Container className="hero-gradient rounded-3 p-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial="hidden"
          animate="show"
          exit="exit"
          variants={heroAnim}
        >
          <Carousel fade interval={4000}>
            {/* Slide 1 */}
            <Carousel.Item>
              <img
                className="d-block w-100 hero-img"
                src={hero1}
                alt="First slide"
              />
              <Carousel.Caption className={`carousel-text ${theme}`}>
                <h1 className="display-5 fw-bold">Discover colorful styles</h1>
                <p>Animated, responsive & stylish ecommerce demo</p>
              </Carousel.Caption>
            </Carousel.Item>

            {/* Slide 2 */}
            <Carousel.Item>
              <img
                className="d-block w-100 hero-img"
                src={hero2}
                alt="Second slide"
              />
              <Carousel.Caption className={`carousel-text ${theme}`}>
                <h1 className="display-5 fw-bold">Fast checkout</h1>
                <p>Simple flow, mock payments — ready to replace with Stripe</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
