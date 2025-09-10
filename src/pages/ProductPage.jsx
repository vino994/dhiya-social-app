import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useCart } from '../hooks/useCart';

const PRODUCTS = [
  { id: 'p1', title: 'Aurora Sneakers', price: 59.99, img: 'https://picsum.photos/seed/p1/900/600' },
  { id: 'p2', title: 'Nebula Jacket', price: 129.99, img: 'https://picsum.photos/seed/p2/900/600' },
  { id: 'p3', title: 'Lumen Watch', price: 199.99, img: 'https://picsum.photos/seed/p3/900/600' },
  { id: 'p4', title: 'Pixel Backpack', price: 79.99, img: 'https://picsum.photos/seed/p4/900/600' }
];

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <Container className="product-section">
        <Row>
          <Col>
            <h4>Product not found</h4>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="product-section">
      <Row>
        <Col md={6}>
          <Image src={product.img} alt={product.title} fluid rounded className="card-img-top" />
        </Col>

        <Col md={6}>
          <h2>{product.title}</h2>
          <p className="lead">${product.price}</p>
          <p className="small-muted">Details about the product — lightweight, durable materials, great for daily use.</p>
          <div style={{ marginTop: 20 }}>
            <Button className="btn-gradient" onClick={() => { add(product.id); nav('/checkout'); }}>
              Buy now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
