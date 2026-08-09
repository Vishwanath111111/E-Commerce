'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, calculateDiscountPercentage } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import RatingStars from './RatingStars';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isWishlisted = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80';
  const discountPercent = calculateDiscountPercentage(product.basePrice, product.discountPrice);

  const primaryVariant = product.variants?.[0];

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (primaryVariant) {
      addToCart(primaryVariant.id, 1);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      
      <div className="relative">
        {/* Product Image Link */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-3/4 overflow-hidden bg-[#F8F5F0]">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#1A2B4C] text-[#C5A059] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider border border-[#C5A059]/40">
                BESTSELLER
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-[#059669] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isWishlisted
                ? 'bg-red-50 text-red-600'
                : 'bg-white/80 text-gray-700 hover:text-red-500 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </Link>
      </div>

      {/* Product Details Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#C5A059]">
            {product.brand || 'VASTRADA'}
          </span>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#C5A059] transition-colors mt-0.5">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1">
            <RatingStars rating={product.averageRating || 4.8} count={product.reviewCount || 12} />
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-[#E5E0D8]/60 flex items-center justify-between">
          <div>
            {product.discountPrice ? (
              <div className="flex items-baseline space-x-2">
                <span className="text-base font-bold text-[#1A2B4C]">{formatINR(product.discountPrice)}</span>
                <span className="text-xs text-gray-400 line-through">{formatINR(product.basePrice)}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-[#1A2B4C]">{formatINR(product.basePrice)}</span>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          {primaryVariant && (
            <button
              onClick={handleAddToCartClick}
              className="p-2 bg-[#1A2B4C] hover:bg-[#C5A059] text-white rounded-md transition-colors flex items-center justify-center"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
