import React from 'react';
import { Carousel, Container } from 'react-bootstrap';


export default function HeroCarousel(){
return (
<Container className="hero-gradient rounded-3 p-3">
<Carousel className="bg-transparent" indicators={false}>
<Carousel.Item>
<div className="d-flex align-items-center justify-content-center" style={{height:260}}>
<div>
<h1 className="display-5 fw-bold">Discover colorful styles</h1>
<p>Animated, responsive & stylish ecommerce demo</p>
</div>
</div>
</Carousel.Item>
<Carousel.Item>
<div className="d-flex align-items-center justify-content-center" style={{height:260}}>
<div>
<h1 className="display-5 fw-bold">Fast checkout</h1>
<p>Simple flow, mock payments — ready to replace with Stripe</p>
</div>
</div>
</Carousel.Item>
</Carousel>
</Container>
);
}