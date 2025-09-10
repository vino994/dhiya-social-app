// src/components/ThemeToggle.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react"; // icon library

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.body.className = `theme-${saved}`;
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = `theme-${newTheme}`;
    localStorage.setItem("theme", newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-float-btn"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
    </motion.button>
  );
}
