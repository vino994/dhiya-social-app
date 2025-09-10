import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CheckoutCancel() {
  return (
    <Container className="checkout-container" style={{ maxWidth: 760 }}>
      <h3>Payment cancelled</h3>
      <p>Your payment was cancelled. You can try again or contact support.</p>
      <div style={{ marginTop: 18 }}>
        <Button as={Link} to="/checkout" variant="light">Back to checkout</Button>
      </div>
    </Container>
  );
}
