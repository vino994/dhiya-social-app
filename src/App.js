// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Login from "./auth/Login";       // <-- auth folder
import Signup from "./auth/Signup";     // <-- auth folder
import Dashboard from "./pages/Dashboard";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import ThemeToggle from "./components/ThemeToggle";

/*
  NOTE:
  AuthProvider, ThemeProvider and CartProvider are provided at top-level in src/index.js.
  Do NOT re-wrap the app here (that caused the "AuthProvider is not defined" runtime error).
*/

export default function App() {
  return (
    <div className="app-shell">
      {/* Top navigation */}
      <SiteNavbar />

      {/* Main content */}
      <div className="main-canvas">
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/checkout-cancel" element={<CheckoutCancel />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer text-center">
        <div className="container">
          © {new Date().getFullYear()} Dhiya Store — Built for business • Privacy • Terms
        </div>
      </footer>

      {/* Floating Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
