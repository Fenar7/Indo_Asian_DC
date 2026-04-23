"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartLineItem = {
  _id: string;
  name: string;
  code: string;
  unit?: string;
  weight?: string;
  price?: string;
  image?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLineItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Omit<CartLineItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "indo_asian_cart";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ── Actions ────────────────────────────────────────────────────────────────

  function addToCart(product: Omit<CartLineItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  function updateQuantity(id: string, qty: number) {
    if (qty < 1) { removeFromCart(id); return; }
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: qty } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce((sum, i) => {
    const num = parseFloat((i.price ?? "0").replace(/[^\d.]/g, ""));
    return sum + (isNaN(num) ? 0 : num * i.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotal, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
