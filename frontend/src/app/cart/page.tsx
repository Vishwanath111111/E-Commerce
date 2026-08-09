'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/api';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartItem, removeCartItem, loading } = useCart();

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-serif font-bold text-[#1A2B4C] mb-8">
            Your Royal Bag ({cart?.totalItems || 0} items)
          </h1>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Items Table / List */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-4 sm:p-6 rounded-lg border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-24 rounded-md overflow-hidden bg-[#F8F5F0] flex-shrink-0">
                        <Image
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'}
                          alt={item.productName}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <Link href={`/products/${item.productSlug}`} className="font-serif font-bold text-[#1A2B4C] hover:text-[#C5A059] text-base">
                          {item.productName}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          SKU: {item.sku} {item.size ? `| Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}
                        </p>
                        <p className="text-sm font-bold text-[#1A2B4C] mt-2">
                          {formatINR(item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E5E0D8]">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 rounded border border-[#E5E0D8] bg-gray-50 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-[#E5E0D8] bg-gray-50 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="mt-2 text-right">
                        <p className="text-sm font-bold text-[#1A2B4C] mb-1">
                          {formatINR(item.totalPrice)}
                        </p>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Authoritative Order Summary Sidebar */}
              <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] h-fit space-y-6 shadow-sm">
                <h3 className="font-serif font-bold text-[#1A2B4C] text-lg border-b border-[#E5E0D8] pb-3">
                  Order Total Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">{formatINR(cart?.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST & Taxes (5% Included)</span>
                    <span className="font-bold text-gray-900">Included</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Shipping Fee</span>
                    <span className="font-bold text-green-700">
                      {cart?.deliveryFee === 0 ? 'FREE' : formatINR(cart?.deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E0D8] pt-3 flex justify-between text-base font-bold text-[#1A2B4C]">
                    <span>Grand Total</span>
                    <span className="text-[#C5A059]">{formatINR(cart?.grandTotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#1A2B4C] hover:bg-[#C5A059] text-white hover:text-[#1A2B4C] font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Proceed To Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2 border-t border-[#E5E0D8]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> 256-Bit Encrypted Authoritative Backend Pricing
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-[#E5E0D8] text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-[#C5A059] mx-auto" />
              <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">Your Bag is Currently Empty</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our pure silk sarees, hand-embroidered lehengas, and royal bandhgalas to add items to your bag.
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#0F1C34]"
              >
                Browse All Collections
              </Link>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}
