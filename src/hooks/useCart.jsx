import React, { createContext, useContext, useState, useEffect } from 'react';
import { readJSON, writeJSON } from '../services/storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readJSON('app_cart_v1', {}));
  useEffect(()=> writeJSON('app_cart_v1', cart), [cart]);

  const add = id => setCart(prev => ({ ...prev, [id]: (prev[id]||0) + 1 }));
  const update = (id, qty) => setCart(prev => { if (qty<=0){ const c={...prev}; delete c[id]; return c; } return {...prev, [id]: qty} });
  const remove = id => { const c={...cart}; delete c[id]; setCart(c); };
  const clear = () => setCart({});

  return <CartContext.Provider value={{cart, add, update, remove, clear}}>{children}</CartContext.Provider>;
}

export function useCart(){ const ctx = useContext(CartContext); if(!ctx) throw new Error('useCart must be inside CartProvider'); return ctx; }
