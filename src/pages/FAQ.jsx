import React from "react";
import { Container } from "react-bootstrap";

export default function FAQ() {
  return (
    <Container className="product-section">
      <h2 className="mb-4">Frequently Asked Questions</h2>
      <h5>How do I place an order?</h5>
      <p>Browse products, click “View Product”, then click “Buy Now”.</p>

      <h5>What is your return policy?</h5>
      <p>We accept returns within 14 days of delivery if items are unused.</p>

      <h5>Do you ship internationally?</h5>
      <p>Yes, we currently ship to over 50 countries worldwide.</p>
    </Container>
  );
}
