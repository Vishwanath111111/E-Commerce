'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wishlist } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  loading: boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlist(null);
      return;
    }
    try {
      setLoading(true);
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (e) {
      console.error('Error loading wishlist', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const addToWishlist = async (productId: number) => {
    if (!user) {
      alert('Please sign in to add items to your wishlist.');
      return;
    }
    const updated = await api.addToWishlist(productId);
    setWishlist(updated);
  };

  const removeFromWishlist = async (productId: number) => {
    const updated = await api.removeFromWishlist(productId);
    setWishlist(updated);
  };

  const isInWishlist = (productId: number) => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
