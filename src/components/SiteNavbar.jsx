import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useTheme } from "../contexts/ThemeContext";

export default function SiteNavbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();

  return (
    <Navbar expand="lg" className="shadow-sm">
      <Container>
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
                <Button variant="outline-light" size="sm" onClick={() => { logout(); nav('/'); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
            {/* Theme Toggle */}
            <Button
              variant={theme === "dark" ? "light" : "dark"}
              size="sm"
              className="ms-3"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
