import React from "react";
import { Container } from "react-bootstrap";

export default function Shipping() {
  return (
    <Container className="product-section">
      <h2 className="mb-4">Shipping & Returns</h2>
      <p>
        Orders are processed within 2–3 business days. Shipping typically takes
        5–7 business days.
      </p>
      <p>
        Returns are accepted within 14 days of delivery. Items must be in
        original condition with tags attached.
      </p>
    </Container>
  );
}
