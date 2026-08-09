'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A2B4C] text-[#E5E0D8] pt-16 pb-8 border-t-4 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#C5A059]/30 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-[#C5A059] mb-2" />
            <h4 className="font-semibold text-white text-sm">Express All-India Shipping</h4>
            <p className="text-xs text-gray-400 mt-1">Complimentary on orders above ₹1,999</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 text-[#C5A059] mb-2" />
            <h4 className="font-semibold text-white text-sm">Authentic Handloom</h4>
            <p className="text-xs text-gray-400 mt-1">100% certified pure silk & handcrafts</p>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="w-8 h-8 text-[#C5A059] mb-2" />
            <h4 className="font-semibold text-white text-sm">Hassle-Free Exchange</h4>
            <p className="text-xs text-gray-400 mt-1">7-day easy size & item exchange</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-[#C5A059] mb-2" />
            <h4 className="font-semibold text-white text-sm">Secure Shopping</h4>
            <p className="text-xs text-gray-400 mt-1">Encrypted transactions & COD support</p>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          
          {/* Brand Story */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white tracking-widest">VASTRADA</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              VASTRADA is India's premier online couture destination celebrating centuries-old handloom weaving traditions, royal embroideries, and contemporary Indian luxury lifestyle.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#C5A059]">
              <MapPin className="w-4 h-4" /> <span>Heritage Atelier, New Delhi & Mumbai</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#C5A059] mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/categories/ethnic-wear" className="hover:text-white transition-colors">Pure Silk Sarees & Lehengas</Link></li>
              <li><Link href="/categories/mens-royal-wear" className="hover:text-white transition-colors">Sherwanis & Bandhgalas</Link></li>
              <li><Link href="/categories/modern-fusion-western" className="hover:text-white transition-colors">Indo-Western Fusion</Link></li>
              <li><Link href="/categories/artisanal-jewellery" className="hover:text-white transition-colors">Kundan & Silver Jewellery</Link></li>
              <li><Link href="/categories/heritage-footwear" className="hover:text-white transition-colors">Handcrafted Juttis & Mojris</Link></li>
              <li><Link href="/categories/luxury-handbags-potlis" className="hover:text-white transition-colors">Zardozi Potlis & Bags</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#C5A059] mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Shipping & Delivery FAQ</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About VASTRADA</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#C5A059]">Join The Privé Circle</h4>
            <p className="text-xs text-gray-300">Subscribe for private trunk show invitations, festive previews, and exclusive offers.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to VASTRADA Privé!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 bg-white/10 border border-[#C5A059]/40 rounded-sm text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#C5A059] hover:bg-[#b08c46] text-[#1A2B4C] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-[#C5A059]/20 pt-8 text-center text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} VASTRADA Enterprise Platform. All rights reserved.</p>
          <div className="flex space-x-6 text-[#C5A059]">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>NetBanking</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
