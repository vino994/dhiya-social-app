// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import AllProducts from "./pages/AllProducts";
import CategoryPage from "./pages/CategoryPage";
import FAQ from "./pages/FAQ";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SiteNavbar from "./components/SiteNavbar";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";   // <-- Single product details
import Checkout from "./pages/Checkout";
import Login from "./auth/Login";       
import Signup from "./auth/Signup";     
import Dashboard from "./pages/Dashboard";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";
import TShirtCustomizer from "./components/TShirtCustomizer";

export default function App() {
  return (
    <div className="app-shell">
      {/* Top navigation */}
      <SiteNavbar />

      {/* Main content */}
      <div className="main-canvas">
        <main className="py-4">
      <Routes>
  {/* Home */}
  <Route path="/" element={<Home />} />
  
  {/* Customize (with product ID param) */}
  <Route path="/customize/:id" element={<TShirtCustomizer />} />

  {/* Products */}
  <Route path="/products" element={<AllProducts />} />
  <Route path="/product/:id" element={<ProductPage />} />
  <Route path="/category/:category" element={<CategoryPage />} />

  {/* Auth */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* Checkout */}
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/checkout-success" element={<CheckoutSuccess />} />
  <Route path="/checkout-cancel" element={<CheckoutCancel />} />

  {/* Dashboard */}
  <Route path="/dashboard" element={<Dashboard />} />

  {/* Info pages */}
  <Route path="/faq" element={<FAQ />} />
  <Route path="/shipping" element={<Shipping />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/terms" element={<Terms />} />
</Routes>

        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
