import React, { useState } from "react";
import { Container, Form, Button, Card, Modal } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const formAnim = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const r = await login({ email, password });
    if (!r.ok) {
      if (r.message && r.message.toLowerCase().includes("not found")) {
        setShowPopup(true);
      } else {
        setErr(r.message || "Login failed");
      }
    } else {
      const from = location.state?.from || "/dashboard";
      nav(from, { replace: true });
    }
    setLoading(false);
  };

  // Notice: we use className="auth-container" so theme CSS applies.
  return (
    <Container className="auth-container" style={{ maxWidth: 540 }}>
      <AnimatePresence>
        <motion.div key={theme} initial="hidden" animate="show" variants={formAnim}>
          <Card style={{ background: "transparent", border: "none" }}>
            <Card.Body>
              <h3 className="mb-3">Welcome back</h3>
              {err && <div className="alert alert-danger">{err}</div>}
              <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="btn-gradient" disabled={loading}>
                      {loading ? "Logging in…" : "Login"}
                    </Button>
                  </motion.div>
                </div>
              </Form>

              <div className="text-center mt-3">
                Don’t have an account? <Link to="/signup">Create one</Link>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Popup for account not found */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Account Not Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          We couldn’t find an account with this email. Would you like to create one?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => nav("/signup")}>
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
