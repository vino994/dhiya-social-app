import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HeroCarousel from '../sections/HeroCarousel';
import ProductList from '../sections/ProductList';

export default function Home() {
  return (
    <Container className="product-section">
      <Row>
        <Col xs={12}>
          <HeroCarousel />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <ProductList />
        </Col>
      </Row>
    </Container>
  );
}
