// src/pages/AllProductsPage.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PRODUCTS from "../data/products";
import ProductCard from "../ui/ProductCard";

export default function AllProductsPage() {
  // Group by category
  const grouped = PRODUCTS.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <Container className="product-section">
      <h2 className="mb-5 text-center">All Products</h2>

      {Object.keys(grouped).map((cat) => (
        <div key={cat} className="mb-5">
          <h3 className="mb-4 text-capitalize">{cat} Collection</h3>
          <Row>
            {grouped[cat].map((p) => (
              <Col sm={6} md={4} lg={3} key={p.id} className="mb-4">
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
}
