import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const formAnim = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Signup() {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const nav = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const r = await signup({ name, email, password });
    if (!r.ok) {
      setErr(r.message || "Signup failed");
    } else {
      const from = location.state?.from || "/dashboard";
      nav(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <Container className="auth-container" style={{ maxWidth: 540 }}>
      <AnimatePresence>
        <motion.div key={theme} initial="hidden" animate="show" variants={formAnim}>
          <Card style={{ background: "transparent", border: "none" }}>
            <Card.Body>
              <h3 className="mb-3">Create your account</h3>
              {err && <div className="alert alert-danger">{err}</div>}
              <Form onSubmit={submit} noValidate>
                <Form.Group className="mb-3" controlId="signupName">
                  <Form.Label className="form-label">Full name</Form.Label>
                  <Form.Control
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupEmail">
                  <Form.Label className="form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupPassword">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <small className="text-muted">
                    Must be ≥8 characters & include a special character
                  </small>
                </Form.Group>

                <div className="d-grid">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" className="btn-gradient" disabled={loading}>
                      {loading ? "Creating…" : "Create account"}
                    </Button>
                  </motion.div>
                </div>
              </Form>

              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
