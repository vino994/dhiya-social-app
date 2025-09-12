// src/sections/ProductList.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../ui/ProductCard';
import PRODUCTS from '../data/products';

export default function ProductList() {
  return (
    <Row>
      {PRODUCTS.map(p => (
        <Col sm={6} md={4} lg={3} key={p.id} className="mb-4">
          <ProductCard product={p} />
        </Col>
      ))}
    </Row>
  );
}
