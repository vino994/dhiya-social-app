// src/pages/ProductDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image, Badge, ListGroup, Form } from "react-bootstrap";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../contexts/AuthProvider";
import PRODUCTS from "../data/products";

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart() || {}; // guard in case hook is missing
  const { user } = useAuth();

  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.hex ?? "");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) {
    return (
      <Container className="product-section">
        <Row>
          <Col>
            <h4>Product not found</h4>
            <p className="text-muted">The requested product does not exist.</p>
            <Button variant="outline-secondary" onClick={() => nav(-1)}>Back</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  async function handleBuyNow() {
    if (!user) {
      nav("/login", { state: { from: `/product/${product.id}` } });
      return;
    }

    setAdding(true);

    try {
      if (typeof add === "function") {
        // If add supports metadata you can call add(product.id, { qty, size, color })
        // But to be compatible with simple add(id) implementations we'll add in a loop.
        // If your useCart supports add(id, qtyOrMeta) you may adapt this.
        for (let i = 0; i < Math.max(1, qty); i++) {
          add(product.id);
        }
      } else {
        console.warn("Cart add() not available — skipping add to cart.");
      }
      nav("/checkout");
    } catch (err) {
      console.error("Add to cart failed", err);
      alert("Unable to add to cart.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Container className="product-section">
      <Row className="g-4">
        <Col md={6}>
          <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
            <Image src={product.img} alt={product.title} fluid style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <h2 style={{ marginBottom: 6 }}>
                {product.title}{" "}
                <Badge bg="secondary" className="ms-2">
                  {product.sku || product.id}
                </Badge>
              </h2>
              <div className="lead">${product.price.toFixed(2)}</div>
              <div className="text-muted" style={{ marginTop: 8 }}>
                {product.short}
              </div>
            </div>
          </div>

          <hr />

          <h6>About</h6>
          <p style={{ marginTop: 6 }}>{product.long}</p>

          {product.features?.length > 0 && (
            <>
              <h6>Features</h6>
              <ListGroup variant="flush" className="mb-3">
                {product.features.map((f, i) => (
                  <ListGroup.Item key={i} style={{ border: "none", paddingLeft: 0, paddingRight: 0 }}>
                    • {f}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          <div style={{ marginTop: 8 }}>
            {product.sizes?.length > 0 && (
              <Form.Group className="mb-3" controlId="sizeSelect">
                <Form.Label className="form-label">Size</Form.Label>
                <Form.Select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div className="form-label">Color</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  {product.colors.map((c) => (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => setSelectedColor(c.hex)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 999,
                        background: c.hex,
                        border: selectedColor === c.hex ? "3px solid rgba(0,0,0,0.12)" : "2px solid rgba(0,0,0,0.08)",
                        cursor: "pointer"
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
              <Form.Control
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
                style={{ width: 110 }}
              />

              <div style={{ display: "flex", gap: 8 }}>
                <Button className="btn-gradient" onClick={handleBuyNow} disabled={adding}>
                  {adding ? "Adding…" : "Buy now"}
                </Button>
                <Button variant="outline-secondary" onClick={() => nav(-1)}>
                  Back
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
