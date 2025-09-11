// src/pages/Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Form, Button, ListGroup, Image } from "react-bootstrap";
import { useAuth } from "../contexts/AuthProvider";
import { motion } from "framer-motion";
import { useCart } from "../hooks/useCart";

/* small PRODUCTS sample — replace with your actual products if needed */
const PRODUCTS = [
  { id: "p1", title: "Aurora Sneakers", price: 59.99, img: "https://picsum.photos/seed/p1/400/300" },
  { id: "p2", title: "Nebula Jacket", price: 129.99, img: "https://picsum.photos/seed/p2/400/300" },
  { id: "p3", title: "Lumen Watch", price: 199.99, img: "https://picsum.photos/seed/p3/400/300" },
  { id: "p4", title: "Pixel Backpack", price: 79.99, img: "https://picsum.photos/seed/p4/400/300" },
];

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const cartHook = useCart?.();
  const addToCart = cartHook?.add ?? (() => {});

  // Local form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Recent orders (localStorage)
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem("orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // editing state: show form when true. If user has no name, start editing.
  const [editing, setEditing] = useState(() => {
    try {
      const saved = localStorage.getItem("auth_user");
      if (!saved) return true;
      const u = JSON.parse(saved);
      return !(u && u.name);
    } catch {
      return true;
    }
  });

  const fileRef = useRef(null);

  // Sync local state with the `user` from AuthProvider
  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setAvatar(user?.avatar || null);

    // If user has any saved profile, default to view (not editing)
    if (user && (user.name || user.phone || user.address || user.avatar)) {
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [user]);

  function handleAvatarFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(f);
  }

  async function saveProfile(e) {
    e?.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: "danger", text: "Name is required." });
      return;
    }
    if (phone && !/^[+\d][\d\s-]{6,}$/.test(phone)) {
      setMessage({ type: "danger", text: "Please enter a valid phone number." });
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        avatar: avatar,
      });

      // Accept both implicit success and explicit { ok: true } / { ok: false }
      if (res && res.ok === false) {
        setMessage({ type: "danger", text: res.message || "Failed to save profile." });
      } else {
        setMessage({ type: "success", text: "Profile saved." });
        setEditing(false); // hide the form after successful save
      }
    } catch {
      setMessage({ type: "danger", text: "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  }

  function handleResetToSaved() {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setAvatar(user?.avatar || null);
    if (fileRef.current) fileRef.current.value = "";
    setMessage({ type: "info", text: "Form reset to saved profile." });
  }

  function addMockOrder() {
    const mock = {
      id: `ord_${Date.now()}`,
      date: new Date().toISOString(),
      items: [{ id: "p1", title: "Aurora Sneakers", qty: 1, price: 59.99 }],
      total: 59.99,
      status: "Delivered",
    };
    const next = [mock, ...orders].slice(0, 10);
    localStorage.setItem("orders", JSON.stringify(next));
    setOrders(next);
    setMessage({ type: "success", text: "Mock order added." });
  }

  function handleAddToCart(productId) {
    try {
      addToCart(productId);
      setMessage({ type: "success", text: "Added to cart." });
    } catch {
      setMessage({ type: "danger", text: "Unable to add to cart." });
    }
  }

  return (
    <Container className="dashboard-section" style={{ maxWidth: 1100 }}>
      {/* Profile header */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <Card className="p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div style={{ width: 96, height: 96 }}>
                {avatar ? (
                  <Image src={avatar} alt="avatar" roundedCircle style={{ width: 96, height: 96, objectFit: "cover", border: "2px solid rgba(255,255,255,0.06)" }} />
                ) : (
                  <div style={{
                    width: 96,
                    height: 96,
                    borderRadius: 999,
                    background: "linear-gradient(135deg,#2b2b2b,#4b4b4b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 24
                  }}>
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h4 className="mb-0">{user?.name || "No name set"}</h4>
                  <div className="small  ">{user?.email}</div>
                </div>

                <div className="mt-2  ">
                  {user?.phone ? <span className="me-3"><strong>Phone:</strong> {user.phone}</span> : null}
                  {user?.address ? <span><strong>Address:</strong> {user.address}</span> : null}
                </div>
              </div>

              <div>
                <Button variant="outline-secondary" onClick={() => window.location.href = "/checkout"}>Go to checkout</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title className="mb-3">Quick actions</Card.Title>
              <div className="d-grid gap-2">
                <Button onClick={addMockOrder} className="btn-gradient">Add mock order</Button>
                <Button variant="outline-secondary" onClick={() => { localStorage.removeItem("orders"); setOrders([]); setMessage({ type: "info", text: "Recent orders cleared." }); }}>Clear recent orders</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main row: edit form (or condensed saved-card) + orders */}
      <Row className="g-4">
        <Col lg={6}>
          <motion.div whileHover={{ translateY: -6 }}>
            {/* If editing: show full form. Otherwise show a compact summary card + Edit button */}
            {editing ? (
              <Card className="p-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title className="mb-0">Edit profile</Card.Title>
                  </div>

                  {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                  <Form onSubmit={saveProfile}>
                    <Form.Group className="mb-3" controlId="profileAvatar">
                      <Form.Label className="form-label">Avatar</Form.Label>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: 72, height: 72 }}>
                          {avatar ? (
                            <Image src={avatar} alt="preview" roundedCircle style={{ width: 72, height: 72, objectFit: "cover" }} />
                          ) : (
                            <div style={{
                              width: 72, height: 72, borderRadius: 999,
                              background: "rgba(255,255,255,0.04)",
                              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                            }}>
                              {(name || user?.name || user?.email || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div>
                          <input type="file" accept="image/*" ref={fileRef} onChange={handleAvatarFileChange} />
                          <div className="small   mt-1">PNG/JPG only — preview shown immediately (client-side only)</div>
                        </div>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="profileName">
                      <Form.Label className="form-label">Full name</Form.Label>
                      <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="profilePhone">
                      <Form.Label className="form-label">Phone</Form.Label>
                      <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98..." />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="profileAddress">
                      <Form.Label className="form-label">Address</Form.Label>
                      <Form.Control as="textarea" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State, PIN" />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button type="submit" className="btn-gradient" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
                      <Button variant="outline-secondary" onClick={handleResetToSaved}>Reset</Button>
                      <Button variant="outline-danger" onClick={() => { handleResetToSaved(); setEditing(false); }}>Cancel</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <Card className="p-3">
                <Card.Body className="d-flex flex-column gap-3">
                  <div>
                    <h5 className="mb-1">Profile saved</h5>
                    <div className="small  ">Your profile is saved — click Edit to update it.</div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 72, height: 72 }}>
                      {avatar ? (
                        <Image src={avatar} alt="avatar" roundedCircle style={{ width: 72, height: 72, objectFit: "cover" }} />
                      ) : (
                        <div style={{
                          width: 72, height: 72, borderRadius: 999,
                          background: "rgba(255,255,255,0.04)",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                        }}>
                          {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{user?.name || user?.email}</div>
                      <div className="small  ">
                        {user?.phone && <div><strong>Phone:</strong> {user.phone}</div>}
                        {user?.address && <div><strong>Address:</strong> {user.address}</div>}
                      </div>
                    </div>

                    <div>
                      <Button onClick={() => setEditing(true)}>Edit profile</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </motion.div>
        </Col>

        <Col lg={6}>
          <motion.div whileHover={{ translateY: -6 }}>
            <Card className="p-3">
              <Card.Body>
                <Card.Title className="mb-3">Recent orders</Card.Title>

                {orders.length === 0 ? (
                  <div className=" ">No recent orders. Try "Add mock order" to generate a test order.</div>
                ) : (
                  <ListGroup variant="flush">
                    {orders.slice(0, 6).map((o) => (
                      <ListGroup.Item key={o.id} className="d-flex justify-content-between align-items-start">
                        <div>
                          <div style={{ fontWeight: 700 }}>{o.id}</div>
                          <div className="small  ">{new Date(o.date).toLocaleString()}</div>
                          <div className="mt-1 small">{o.items.map(it => `${it.title} ×${it.qty}`).join(", ")}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700 }}>${(o.total || 0).toFixed(2)}</div>
                          <div className="small  ">Status: {o.status || "Delivered"}</div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                <hr />

                <div className="d-flex gap-2">
                  <Button className="btn-gradient" onClick={addMockOrder}>Add mock order</Button>
                  <Button variant="outline-secondary" onClick={() => { localStorage.removeItem("orders"); setOrders([]); }}>Clear</Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Products list below */}
      <Row className="mt-4 g-4">
        <Col xs={12}><h5 className="mb-3">Products</h5></Col>
        {PRODUCTS.map((p) => (
          <Col md={3} key={p.id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-2">
                <div style={{ height: 160, overflow: "hidden", borderRadius: 8 }}>
                  <Image src={p.img} fluid style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <Card.Body>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div className="small   mb-2">${p.price.toFixed(2)}</div>
                  <div className="d-grid">
                    <Button className="btn-gradient" onClick={() => handleAddToCart(p.id)}>Add to cart</Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
