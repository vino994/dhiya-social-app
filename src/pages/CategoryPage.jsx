// src/pages/CategoryPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import PRODUCTS from "../data/products";
import ProductCard from "../ui/ProductCard";

export default function CategoryPage() {
  const { category } = useParams();

  const items = PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <Container className="product-section">
      <h2 className="mb-4 text-center text-capitalize">
        {category} Collection
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-muted">
          No products found in this category.
        </p>
      ) : (
        <Row>
          {items.map((product) => (
            <Col sm={6} md={4} lg={3} key={product.id} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
