'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (variantId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (e) {
      console.error('Error loading cart', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (variantId: number, quantity = 1) => {
    if (!user) {
      alert('Please sign in to add items to your shopping cart.');
      return;
    }
    const updatedCart = await api.addToCart(variantId, quantity);
    setCart(updatedCart);
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    const updatedCart = await api.updateCartItem(itemId, quantity);
    setCart(updatedCart);
  };

  const removeCartItem = async (itemId: number) => {
    const updatedCart = await api.removeCartItem(itemId);
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCartItem, removeCartItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
