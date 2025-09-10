import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CheckoutSuccess() {
  return (
    <Container className="checkout-container" style={{ maxWidth: 760 }}>
      <h3>Payment successful 🎉</h3>
      <p>Thank you — your payment was received (test mode). We logged the mock order on the server console.</p>
      <div style={{ marginTop: 18 }}>
        <Button as={Link} to="/" className="btn-gradient">Continue shopping</Button>
      </div>
    </Container>
  );
}
