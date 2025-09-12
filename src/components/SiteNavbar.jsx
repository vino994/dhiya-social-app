import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import "./SiteNavbar.css";

export default function SiteNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <Navbar expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/" className="brand-logo">
              <i className="bi bi-bag-heart-fill me-2 brand-icon" aria-hidden="true"></i>
              <span className="brand-text">Dhiya Store</span>
            </Navbar.Brand>

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/checkout">Cart</Nav.Link>
<Nav.Link as={Link} to="/customize/:id">Custom Design</Nav.Link>
                {user ? (
                  <>
                    {/* Dashboard link shows user's short name or email */}
                    <Nav.Link as={Link} to="/dashboard">{user.name ? user.name : user.email}</Nav.Link>

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => { logout(); nav("/"); }}
                      className="ms-2"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                  </>
                )}

                <Button variant="link" className="ms-3" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === "light" ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>
    </AnimatePresence>
  );
}
