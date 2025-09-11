// src/pages/Checkout.jsx
import React, { useMemo, useState } from 'react';
import { Container, Form, Button, Row, Col, Image, Table, InputGroup } from 'react-bootstrap';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';

/* PRODUCTS lookup (local demo) */
const PRODUCTS = [
  { id: 'p1', title: 'Aurora Sneakers', price: 59.99, img: 'https://picsum.photos/seed/p1/300/200' },
  { id: 'p2', title: 'Nebula Jacket', price: 129.99, img: 'https://picsum.photos/seed/p2/300/200' },
  { id: 'p3', title: 'Lumen Watch', price: 199.99, img: 'https://picsum.photos/seed/p3/300/200' },
  { id: 'p4', title: 'Pixel Backpack', price: 79.99, img: 'https://picsum.photos/seed/p4/300/200' }
];
function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || { id, title: 'Unknown product', price: 0, img: '' };
}

/* AnimatedCartSVG (unchanged) */
function AnimatedCartSVG({ animate = true }) {
  const float = {
    initial: { y: 0 },
    animate: {
      y: [0, -8, 0],
      rotate: [0, -3, 0],
      transition: { duration: 3, loop: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div initial="initial" animate={animate ? 'animate' : 'initial'} variants={float} style={{ display: 'inline-block' }}>
      <motion.svg width="280" height="220" viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <motion.path
          d="M40 140C20 100 10 70 60 48C110 26 170 40 214 74C258 108 260 178 210 195C160 212 80 180 40 140Z"
          fill="url(#g1)"
          initial={{ scale: 0.98 }}
          animate={{ scale: [0.98, 1.02, 0.98], transition: { duration: 6, loop: Infinity } }}
        />
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFD6A5" />
            <stop offset="100%" stopColor="#FF8BA7" />
          </linearGradient>
        </defs>

        <motion.g initial={{ y: 0, scale: 1 }} animate={{ y: [0, -6, 0], rotate: [0, -2, 0], transition: { duration: 2.6, loop: Infinity } }}>
          <rect x="80" y="58" width="120" height="96" rx="10" fill="#FFFFFF" stroke="#FF6A88" strokeWidth="3" />
          <path d="M96 58 C96 42, 132 36, 140 56" stroke="#FF6A88" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M200 58 C200 42, 164 36, 156 56" stroke="#FF6A88" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
          <motion.circle cx="120" cy="120" r="6" fill="#FF6A88" animate={{ r: [6, 10, 6], opacity: [1, 0.6, 1] }} transition={{ duration: 2, loop: Infinity }} />
          <motion.circle cx="160" cy="100" r="4" fill="#FFC857" animate={{ y: [0, -4, 0] }} transition={{ duration: 3, loop: Infinity }} />
        </motion.g>

        <motion.circle cx="100" cy="170" r="6" fill="#3F51F0" opacity="0.95" animate={{ x: [0, 2, 0] }} transition={{ duration: 2, loop: Infinity }} />
        <motion.circle cx="180" cy="170" r="6" fill="#00C2A8" opacity="0.95" animate={{ x: [0, -2, 0] }} transition={{ duration: 2, loop: Infinity }} />
      </motion.svg>
    </motion.div>
  );
}

export default function Checkout() {
  const { cart, remove, clear } = useCart();

  // step: 1 = details, 2 = payment/shipping, 3 = confirmation
  const [step, setStep] = useState(1);

  // customer details (kept in state but not shown after "Continue")
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // payment / misc
  const [card, setCard] = useState('');
  const [promo, setPromo] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4242';

  // derived cart items
  const items = useMemo(() => {
    const arr = [];
    Object.entries(cart || {}).forEach(([key, value]) => {
      const qty = typeof value === 'number' ? value : value.qty ?? 0;
      const productId = typeof value === 'number' ? key : value.productId ?? key;
      const p = findProduct(productId);
      if (qty > 0) arr.push({ ...p, qty });
    });
    return arr;
  }, [cart]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const shippingCost = shippingMethod === 'standard' ? 5.0 : 12.0;
  const promoDiscount = appliedPromo === 'SAVE10' ? Math.min(10, subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shippingCost - promoDiscount);

  function applyPromo(e) {
    e.preventDefault();
    const code = (promo || '').trim().toUpperCase();
    if (!code) return;
    if (code === 'SAVE10') setAppliedPromo('SAVE10');
    else setAppliedPromo('INVALID');
  }

  /* ===== IMPORTANT: when the user clicks Continue we advance step to 2.
     The personal fields are kept in state (fullName/email/address) but not rendered.
     The user can "Edit details" from step 2 to go back and change them. ===== */
  function handleContinueFromDetails(e) {
    e.preventDefault();
    // basic required validation
    if (!fullName.trim() || !email.trim() || !address.trim()) {
      alert('Please fill name, email and address before continuing.');
      return;
    }
    setStep(2);
    // do NOT display the personal fields anywhere after this
  }

  async function placeOrder() {
    if (!fullName || !email || !address) {
      alert('Missing customer details — please complete them first.');
      setStep(1);
      return;
    }

    const sendItems = items.map((it) => ({ id: it.id, name: it.title, price: it.price, qty: it.qty }));

    try {
      const resp = await fetch(`${BACKEND_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: sendItems,
          customer: { fullName, email, phone, address },
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Server error');

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert('Could not create Stripe session (server did not return url)');
    } catch (err) {
      console.error('Stripe create session failed', err);
      alert('Payment initialization failed: ' + (err.message || err));
    }
  }

  return (
    <Container className="checkout-container" style={{ maxWidth: 980 }}>
      <Row>
        {/* LEFT column */}
        <Col lg={6} className="pt-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <h3 className="fw-bold mb-2">Checkout</h3>
          
          </div>

          {/* Step 1: Customer details (shown only while step === 1) */}
          {step === 1 && (
            <Form onSubmit={handleContinueFromDetails}>
              <Form.Group className="mb-3" controlId="custName">
                <Form.Label>Full name</Form.Label>
                <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="custEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="custPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 938..." />
              </Form.Group>

              <Form.Group className="mb-3" controlId="custAddress">
                <Form.Label>Shipping address</Form.Label>
                <Form.Control as="textarea" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State, PIN" required />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="light" onClick={() => { setFullName(''); setEmail(''); setPhone(''); setAddress(''); }}>Clear</Button>
                <Button type="submit" className="btn-gradient">Continue</Button>
              </div>
            </Form>
          )}

          {/* Step 2: Payment & shipping (shown when step === 2) */}
          {step === 2 && (
            <Form onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
              {/* Provide an 'Edit details' button so user can go back if needed */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <strong>Payment & shipping</strong>
                  <div className="small text-muted">You will not see name/email fields here. Click Edit to change.</div>
                </div>
                <div>
                  <Button variant="outline-secondary" size="sm" onClick={() => setStep(1)}>Edit details</Button>
                </div>
              </div>

              <Form.Group className="mb-3" controlId="shipMethod">
                <Form.Label>Shipping method</Form.Label>
                <div>
                  <Form.Check inline label={`Standard — $${shippingMethod === 'standard' ? shippingCost.toFixed(2) : '5.00'}`} name="ship" type="radio" id="ship-standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                  <Form.Check inline label={`Express — $${shippingMethod === 'express' ? shippingCost.toFixed(2) : '12.00'}`} name="ship" type="radio" id="ship-express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="promo">
                <Form.Label>Promo code</Form.Label>
                <InputGroup>
                  <Form.Control placeholder="Enter code (e.g. SAVE10)" value={promo} onChange={(e) => setPromo(e.target.value)} />
                  <Button variant="outline-light" onClick={applyPromo}>Apply</Button>
                </InputGroup>
                {appliedPromo === 'INVALID' && <div style={{ color: '#ff6b6b', marginTop: 8 }}>Invalid promo code</div>}
                {appliedPromo === 'SAVE10' && <div style={{ color: '#5eead4', marginTop: 8 }}>Promo applied: 10% (max $10)</div>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="card">
                <Form.Label>Card (mock)</Form.Label>
                <Form.Control value={card} onChange={(e) => setCard(e.target.value)} placeholder="4242 4242 4242 4242" required />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="light" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" className="btn-gradient">Pay ${total.toFixed(2)}</Button>
              </div>
            </Form>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="mt-3">
              <div className="alert alert-success">✅ Thanks — your order is confirmed (mock).</div>
              <Button className="btn-gradient" onClick={() => { setStep(1); setFullName(''); setEmail(''); setPhone(''); setAddress(''); clear(); }}>
                Place another order
              </Button>
            </div>
          )}
        </Col>

        {/* RIGHT column: Order summary ONLY (never shows personal details) */}
        <Col lg={6} className="pt-2">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <AnimatedCartSVG />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: 14, borderRadius: 12 }}>
            <h5 style={{ marginBottom: 10 }}>Order summary</h5>

            {items.length === 0 ? (
              <div className="small-muted-strong">Your cart is empty.</div>
            ) : (
              <Table borderless size="sm" responsive>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td style={{ width: 64 }}>
                        <Image src={it.img} rounded style={{ width: 64, height: 48, objectFit: 'cover' }} />
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 700 }}>{it.title}</div>
                        <div className="small-muted">{it.qty} × ${it.price.toFixed(2)}</div>
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'right', width: 86 }}>
                        ${(it.price * it.qty).toFixed(2)}
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                        <Button variant="outline-danger" size="sm" onClick={() => remove(it.id)}>✕</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="small-muted">Subtotal</div>
              <div className="fw-bold">${subtotal.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="small-muted">Shipping</div>
              <div>${shippingCost.toFixed(2)}</div>
            </div>
            {promoDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="small-muted">Promo</div>
                <div>−${promoDiscount.toFixed(2)}</div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, marginTop: 8 }}>
              <div className="fw-bold">Total</div>
              <div className="fw-bold">${total.toFixed(2)}</div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
