'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, ProductDTO } from '@/lib/types';

type CartState = {
  cart: CartItem[];
  drawerOpen: boolean;
  toast: string;
  cartCount: number;
  subtotal: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: ProductDTO) => void;
  removeFromCart: (id: string) => void;
  incQty: (id: string) => void;
  decQty: (id: string) => void;
  clearCart: () => void;
  showToast: (msg: string) => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const addToCart = useCallback((product: ProductDTO) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    setToast('Added to your bag 🌸');
  }, []);

  const removeFromCart = useCallback(
    (id: string) => setCart((prev) => prev.filter((i) => i.id !== id)),
    []
  );
  const incQty = useCallback(
    (id: string) =>
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))),
    []
  );
  const decQty = useCallback(
    (id: string) =>
      setCart((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i))
          .filter((i) => i.qty > 0)
      ),
    []
  );
  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<CartState>(() => {
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      cart,
      drawerOpen,
      toast,
      cartCount,
      subtotal,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addToCart,
      removeFromCart,
      incQty,
      decQty,
      clearCart,
      showToast,
    };
  }, [cart, drawerOpen, toast, addToCart, removeFromCart, incQty, decQty, clearCart, showToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
