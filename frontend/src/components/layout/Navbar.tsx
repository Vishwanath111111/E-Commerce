'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlist?.items?.length || 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E5E0D8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A2B4C] hover:text-[#C5A059]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#1A2B4C] flex items-center justify-center p-1.5 border border-[#C5A059]/40 group-hover:border-[#C5A059] transition-colors">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 6L18 9L16 11L14 9L16 6Z" fill="#C5A059"/>
                <path d="M8 12L16 26L24 12H20.5L16 20.5L11.5 12H8Z" fill="#C5A059"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-[#1A2B4C] group-hover:text-[#C5A059] transition-colors">
                VASTRADA
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#C5A059] uppercase -mt-1 font-semibold">
                Royal Heritage Couture
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search pure silk sarees, sherwanis, jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#E5E0D8] rounded-full text-sm focus:outline-none focus:border-[#C5A059] transition-colors shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2B4C] hover:text-[#C5A059] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            
            {/* Admin Quick Switch Badge */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#1A2B4C] text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#0F1C34]"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Admin Panel
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" className="relative text-[#1A2B4C] hover:text-[#C5A059] transition-colors p-1" aria-label="Wishlist">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative text-[#1A2B4C] hover:text-[#C5A059] transition-colors p-1" aria-label="Cart">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1A2B4C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-[#1A2B4C] hover:text-[#C5A059] focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1A2B4C] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline font-medium text-xs max-w-[100px] truncate">
                      {user.fullName}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-[#E5E0D8] py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-[#E5E0D8]">
                        <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-[#1A2B4C] font-semibold hover:bg-[#FDFBF7]"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-[#FDFBF7]"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-[#FDFBF7]"
                      >
                        Account Profile
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-[#FDFBF7]"
                      >
                        Saved Addresses
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-sm font-semibold text-[#1A2B4C] hover:text-[#C5A059] transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

          </div>

        </div>

        {/* Main Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-3 border-t border-[#E5E0D8]/60 text-xs font-semibold uppercase tracking-wider text-[#1A2B4C]">
          <Link href="/products" className="hover:text-[#C5A059] transition-colors">All Collections</Link>
          <Link href="/categories/ethnic-wear" className="hover:text-[#C5A059] transition-colors">Ethnic Wear</Link>
          <Link href="/categories/mens-royal-wear" className="hover:text-[#C5A059] transition-colors">Men's Royal Wear</Link>
          <Link href="/categories/modern-fusion-western" className="hover:text-[#C5A059] transition-colors">Modern Fusion</Link>
          <Link href="/categories/artisanal-jewellery" className="hover:text-[#C5A059] transition-colors">Jewellery</Link>
          <Link href="/categories/heritage-footwear" className="hover:text-[#C5A059] transition-colors">Footwear</Link>
          <Link href="/categories/luxury-handbags-potlis" className="hover:text-[#C5A059] transition-colors">Potlis & Bags</Link>
          <Link href="/products?featured=true" className="text-[#C5A059] font-bold hover:underline">Festive Special</Link>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E0D8] px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search VASTRADA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-[#FDFBF7] border border-[#E5E0D8] rounded-full text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2B4C]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-3 font-semibold text-sm text-[#1A2B4C] border-t border-[#E5E0D8] pt-3">
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
            <Link href="/categories/ethnic-wear" onClick={() => setMobileMenuOpen(false)}>Ethnic Wear</Link>
            <Link href="/categories/mens-royal-wear" onClick={() => setMobileMenuOpen(false)}>Men's Royal Wear</Link>
            <Link href="/categories/modern-fusion-western" onClick={() => setMobileMenuOpen(false)}>Modern Fusion</Link>
            <Link href="/categories/artisanal-jewellery" onClick={() => setMobileMenuOpen(false)}>Jewellery</Link>
            <Link href="/categories/heritage-footwear" onClick={() => setMobileMenuOpen(false)}>Footwear</Link>
            <Link href="/categories/luxury-handbags-potlis" onClick={() => setMobileMenuOpen(false)}>Handbags & Potlis</Link>
            {isAdmin && (
              <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[#C5A059] font-bold">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
