'use client';

import React from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const items = wishlist?.items || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-serif font-bold text-[#1A2B4C] mb-8">
            Saved Wishlist ({items.length} items)
          </h1>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ProductCard key={item.id} product={item.product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-[#E5E0D8] text-center space-y-4">
              <Heart className="w-16 h-16 text-[#C5A059] mx-auto" />
              <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Save your favourite pure silk sarees, bandhgalas, and fine Kundan jewels to your wishlist to review later.
              </p>
              <Link href="/products" className="inline-block px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] text-xs font-bold uppercase rounded-sm">
                Explore Collections
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
