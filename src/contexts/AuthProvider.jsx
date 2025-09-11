// src/contexts/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // persist logged-in user
  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  // helpers for registered accounts
  function getUsers() {
    try {
      const raw = localStorage.getItem("auth_users");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function saveUsers(users) {
    localStorage.setItem("auth_users", JSON.stringify(users));
  }

  // Login: returns { ok: boolean, message?: string }
  const login = async ({ email, password }) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email);
    if (!found) return { ok: false, message: "Account not found" };
    if (found.password !== password) return { ok: false, message: "Incorrect password" };
    // omit password when saving current user
    setUser({ name: found.name || "", email: found.email, phone: found.phone || "", address: found.address || "", avatar: found.avatar || null });
    return { ok: true };
  };

  // Signup: validates password (>=8 chars and a special char)
  const signup = async ({ name, email, password }) => {
    const users = getUsers();
    if (users.some((u) => u.email === email)) return { ok: false, message: "Account already exists" };

    // password strength
    const strong = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!strong.test(password)) return { ok: false, message: "Password must be ≥8 chars & include a special char" };

    const newUser = { name: name || "", email, password, phone: "", address: "", avatar: null };
    users.push(newUser);
    saveUsers(users);
    setUser({ name: newUser.name, email: newUser.email, phone: "", address: "", avatar: null });
    return { ok: true };
  };

  // update profile (merge into stored user and also persist into auth_users)
  const updateProfile = async (payload) => {
    // payload: { name, phone, address, avatar }
    const next = {
      ...user,
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.address !== undefined ? { address: payload.address } : {}),
      ...(payload.avatar !== undefined ? { avatar: payload.avatar } : {}),
    };
    setUser(next);

    // update in registered users list if exists
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === next.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name: next.name || users[idx].name, phone: next.phone || users[idx].phone, address: next.address || users[idx].address, avatar: next.avatar || users[idx].avatar };
      saveUsers(users);
    }
    return { ok: true };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
