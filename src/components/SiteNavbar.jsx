import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import "./SiteNavbar.css";

const fadeAnim = {
  hidden: { opacity: 0, y: -15, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.3 } },
};

export default function SiteNavbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme} // Re-animates on theme change
        initial="hidden"
        animate="show"
        exit="exit"
        variants={fadeAnim}
      >
        <Navbar expand="lg" className="shadow-sm">
          <Container>
            {/* Brand */}
            <Navbar.Brand as={Link} to="/" className="brand-logo d-flex align-items-center">
              <i className="bi bi-bag-heart-fill me-2 brand-icon"></i>
              <span className="brand-text">Dhiya Store</span>
            </Navbar.Brand>

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/checkout">Cart</Nav.Link>

                {currentUser ? (
                  <>
                    <Nav.Link as={Link} to="/dashboard">{currentUser.name}</Nav.Link>
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

                {/* Theme toggle button */}
                <Button
                  variant="link"
                  className="theme-toggle ms-3"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <i className="bi bi-moon-fill"></i>
                  ) : (
                    <i className="bi bi-sun-fill"></i>
                  )}
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>
    </AnimatePresence>
  );
}
