import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { motion } from 'framer-motion';

const cardAnim = {
  hidden: { opacity: 0, y: 18, scale: 0.995 },
  show:  { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function Login(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const [loading,setLoading]=useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await login({ email, password });
      if (!r.ok) setErr(r.message || 'Login failed');
      else nav('/dashboard');
    } catch (e) {
      setErr('Unexpected error — try again');
    } finally { setLoading(false); }
  };

  return (
    <Container className="auth-container" style={{maxWidth:540}}>
      <motion.div initial="hidden" animate="show" variants={cardAnim}>
        <Card style={{background: 'transparent', border: 'none'}}>
          <Card.Body>
            <h3 className="mb-3" style={{color:'#fff'}}>Welcome back</h3>

            {err && <div className="alert alert-danger">{err}</div>}

            <Form onSubmit={submit} noValidate>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label className="form-label" style={{color:'#fff'}}>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label className="form-label" style={{color:'#fff'}}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="btn-gradient" disabled={loading}>
                    {loading ? 'Logging in…' : 'Login'}
                  </Button>
                </motion.div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}
