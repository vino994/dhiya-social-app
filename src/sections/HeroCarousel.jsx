import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import hero1 from '../assets/rainy.jpg';
import hero2 from '../assets/snow.jpg';
import hero3 from '../assets/sunny.jpg';

export default function HeroCarousel() {
  return (
    <Container className="hero-gradient rounded-3 p-3">
      <Carousel indicators={true} controls={true} interval={3000}>
        {/* Slide 1 */}
        <Carousel.Item>
          <img
            className="d-block w-100 rounded-3"
            src={hero1}
            alt="Discover colorful styles"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h1 className="fw-bold">Discover colorful styles</h1>
            <p>Animated, responsive & stylish ecommerce demo</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item>
          <img
            className="d-block w-100 rounded-3"
            src={hero2}
            alt="Fast checkout"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h1 className="fw-bold">Fast checkout</h1>
            <p>Simple flow, mock payments — ready to replace with Stripe</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 3 */}
        <Carousel.Item>
          <img
            className="d-block w-100 rounded-3"
            src={hero3}
            alt="Shop anywhere"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h1 className="fw-bold">Shop anywhere</h1>
            <p>Responsive, mobile-first design</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
}
