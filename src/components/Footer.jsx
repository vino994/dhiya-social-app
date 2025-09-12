// src/components/Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer text-light">
      <Container>
        <Row className="gy-4">
          {/* Brand / About */}
          <Col md={3} sm={6}>
            <h5 className="footer-heading">Dhiya Store</h5>
            <p className="footer-text">
              Your one-stop shop for premium clothing and lifestyle products.  
              Designed with love and built for style.
            </p>
          </Col>

          {/* Shop links */}
          <Col md={3} sm={6}>
            <h6 className="footer-heading">Shop</h6>
            <ul className="footer-links">
             <li><Link to="/products">All Products</Link></li>
  <li><Link to="/category/men">Men’s Collection</Link></li>
  <li><Link to="/category/women">Women’s Collection</Link></li>
  <li><Link to="/category/accessories">Accessories</Link></li>
            </ul>
          </Col>

          {/* Support links */}
          <Col md={3} sm={6}>
            <h6 className="footer-heading">Support</h6>
            <ul className="footer-links">
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/shipping">Shipping & Returns</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </Col>

          {/* Contact / Social */}
          <Col md={3} sm={6}>
            <h6 className="footer-heading">Contact</h6>
            <ul className="footer-links">
              <li>Email: <a href="mailto:vinodjayasudha@gmail.com">vinodjayasudha@gmail.com</a></li>
              <li>Phone: <a href="tel:+919380334317">+91 9380334317</a></li>
            </ul>
            <div className="footer-social">
              <a href="https://www.facebook.com/vinothkumar.sanjeevi/"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/vinod_sanjeev/"><i className="bi bi-instagram"></i></a>
              <a href="https://twitter.com"><i className="bi bi-twitter"></i></a>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <div className="text-center footer-bottom">
          © {new Date().getFullYear()} Dhiya Store • Built with ❤️ for your business
        </div>
      </Container>
    </footer>
  );
}
