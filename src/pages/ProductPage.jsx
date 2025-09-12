// src/pages/ProductPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  ListGroup,
  Form,
} from "react-bootstrap";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../contexts/AuthProvider";
import PRODUCTS from "../data/products";

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();

  // find product by id
  const product = PRODUCTS.find((p) => p.id === id);

  // local state for variants
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.hex ?? ""
  );
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <Container className="product-section text-center">
        <h4>Product not found</h4>
        <div className="text-muted">The requested product does not exist.</div>
        <Button
          variant="outline-secondary"
          onClick={() => nav(-1)}
          className="mt-3"
        >
          Back
        </Button>
      </Container>
    );
  }

  function handleBuyNow() {
    if (!user) {
      nav("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    add(product.id, { qty, size: selectedSize, color: selectedColor });
    nav("/checkout");
  }

  return (
    <Container className="product-section">
      <Row className="g-4 align-items-center">
        {/* Product Image */}
        <Col md={6}>
          <div className="product-img-wrapper">
            <Image
              src={product.img}
              alt={product.title}
              fluid
              className="product-img"
            />
          </div>
        </Col>

        {/* Product Details */}
        <Col md={6}>
          <h2 className="product-title">{product.title}</h2>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-short">{product.short}</p>

          <h6 className="section-heading mt-3">Details</h6>
          <p className="product-long">{product.long}</p>

          {product.features && product.features.length > 0 && (
            <>
              <h6 className="section-heading">Features</h6>
              <ListGroup variant="flush" className="product-features">
                {product.features.map((f, i) => (
                  <ListGroup.Item key={i} className="product-feature-item">
                    {f}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {/* Variant selectors */}
          <div style={{ marginTop: 12 }}>
            {product.sizes?.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Size</Form.Label>
                <Form.Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {product.colors?.length > 0 && (
              <div className="mb-3">
                <Form.Label className="form-label">Color</Form.Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {product.colors.map((c) => (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => setSelectedColor(c.hex)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: c.hex,
                        border:
                          selectedColor === c.hex
                            ? "3px solid #ff7a59"
                            : "2px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Form.Control
                type="number"
                value={qty}
                min={1}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value || "1", 10)))
                }
                style={{ width: 100 }}
              />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
  <Button className="btn-gradient" onClick={handleBuyNow}>
    Buy now
  </Button>
  <Button variant="outline-secondary" onClick={() => nav(-1)}>
    Back
  </Button>
  <Button className="btn-gradient" onClick={() => nav(`/customize/${product.id}`)}>
    Customize
  </Button>
</div>

            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
