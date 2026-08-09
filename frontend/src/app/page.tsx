'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import RatingStars from '@/components/ui/RatingStars';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [feat, news, bests, trend, cats] = await Promise.allSettled([
          api.getFeaturedProducts(),
          api.getNewArrivals(),
          api.getBestSellers(),
          api.getTrendingProducts(),
          api.getFeaturedCategories(),
        ]);

        if (feat.status === 'fulfilled') setFeaturedProducts(feat.value);
        if (news.status === 'fulfilled') setNewArrivals(news.value);
        if (bests.status === 'fulfilled') setBestSellers(bests.value);
        if (trend.status === 'fulfilled') setTrendingProducts(trend.value);
        if (cats.status === 'fulfilled') setCategories(cats.value);
      } catch (e) {
        console.error('Failed to load homepage products', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        {/* HERO BANNER SECTION */}
        <section className="relative bg-[#1A2B4C] text-white overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80"
              alt="Indian Couture Banner Background"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Royal Festive Edition 2026
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-wide max-w-4xl leading-tight">
              Artisanal Grace, <span className="text-[#C5A059] italic">Modern Elegance.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
              Discover authentic pure Kanjeevarams, hand-embroidered Zardozi lehengas, bespoke Jodhpuri sherwanis, and fine Kundan jewels.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-8 py-3.5 bg-[#C5A059] hover:bg-[#b08c46] text-[#1A2B4C] font-bold text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Explore All Collections <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories/ethnic-wear"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm uppercase tracking-widest rounded-sm border border-white/30 backdrop-blur-md transition-all flex items-center justify-center"
              >
                Heritage Sarees
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORY SHOWCASE */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Curated Categories</span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2B4C] mt-1">Shop By Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group block relative rounded-lg overflow-hidden bg-white border border-[#E5E0D8] shadow-2xs hover:shadow-md transition-all text-center p-3"
                >
                  <div className="relative aspect-square rounded-md overflow-hidden bg-[#F8F5F0] mb-3">
                    <Image
                      src={cat.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-[#1A2B4C] group-hover:text-[#C5A059] transition-colors truncate">
                    {cat.name}
                  </h3>
                </Link>
              ))
            ) : (
              // Fallback categories if server API loading
              [
                { name: 'Ethnic Wear', slug: 'ethnic-wear', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80' },
                { name: "Men's Royal Wear", slug: 'mens-royal-wear', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80' },
                { name: 'Modern Fusion', slug: 'modern-fusion-western', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80' },
                { name: 'Artisanal Jewellery', slug: 'artisanal-jewellery', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80' },
                { name: 'Heritage Footwear', slug: 'heritage-footwear', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80' },
                { name: 'Potlis & Bags', slug: 'luxury-handbags-potlis', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80' },
              ].map((cat, i) => (
                <Link
                  key={i}
                  href={`/categories/${cat.slug}`}
                  className="group block relative rounded-lg overflow-hidden bg-white border border-[#E5E0D8] text-center p-3"
                >
                  <div className="relative aspect-square rounded-md overflow-hidden bg-[#F8F5F0] mb-3">
                    <Image src={cat.img} alt={cat.name} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="text-xs font-bold text-[#1A2B4C] group-hover:text-[#C5A059]">{cat.name}</h3>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* FEATURED COLLECTIONS */}
        <section className="py-16 bg-white border-y border-[#E5E0D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Signature Selection</span>
                <h2 className="text-3xl font-serif font-bold text-[#1A2B4C] mt-1">Featured Royal Creations</h2>
              </div>
              <Link href="/products" className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-1">
                View All Products <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-4 text-center py-12 text-gray-500">Loading signature collection...</div>
              )}
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Fresh Off The Looms</span>
              <h2 className="text-3xl font-serif font-bold text-[#1A2B4C] mt-1">New Arrivals</h2>
            </div>
            <Link href="/products?new=true" className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-1">
              Explore New Additions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.length > 0 ? (
              newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading new arrivals...</div>
            )}
          </div>
        </section>

        {/* PROMOTIONAL SPOTLIGHT BANNER */}
        <section className="py-16 bg-[#1A2B4C] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold uppercase tracking-widest border border-[#C5A059]/40 rounded-full">
                Artisanal Spotlight
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide">
                Pure Kanjeevaram & Banarasi Handloom Masterpieces
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Each VASTRADA saree is individually woven over 45 days by certified master weavers using pure mulberry silk yarn and real Zari gold brocade. Enjoy complimentary heirloom luxury gift packaging with every purchase.
              </p>
              <div className="pt-2">
                <Link
                  href="/categories/ethnic-wear"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#C5A059] hover:bg-[#b08c46] text-[#1A2B4C] font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
                >
                  Discover Pure Silk Sarees <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-4/3 rounded-lg overflow-hidden border-2 border-[#C5A059]/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=80"
                alt="Banarasi Weaving Spotlight"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Most Loved</span>
              <h2 className="text-3xl font-serif font-bold text-[#1A2B4C] mt-1">Best Selling Classics</h2>
            </div>
            <Link href="/products?bestseller=true" className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-1">
              View All Bestsellers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.length > 0 ? (
              bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading bestsellers...</div>
            )}
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS */}
        <section className="py-16 bg-white border-t border-[#E5E0D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Client Experience</span>
            <h2 className="text-3xl font-serif font-bold text-[#1A2B4C] mt-1 mb-12">Stories of Grace</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The Royal Kanjeevaram saree I ordered for my sister's wedding was beyond stunning. Pure silk, rich zari weight, and authentic craftsmanship. VASTRADA delivers true commercial luxury!",
                  name: "Ananya Iyer",
                  location: "Bengaluru",
                  product: "Royal Kanjeevaram Pure Silk Saree",
                },
                {
                  quote: "Ordered the Jodhpuri Bandhgala for a reception in Delhi. The tailoring fit was spot on, raw silk texture feels premium, and delivery arrived in 48 hours in a wooden suit hanger box.",
                  name: "Vikramaditya Rathore",
                  location: "Jaipur",
                  product: "Royal Jodhpur Silk Bandhgala",
                },
                {
                  quote: "The Kundan necklace set was packaged in a heavy velvet case with a authenticity card. Magnificent detailing and zero skin irritation!",
                  name: "Meera Kapoor",
                  location: "Mumbai",
                  product: "Kundan & Uncut Diamond Set",
                },
              ].map((t, i) => (
                <div key={i} className="bg-[#FDFBF7] p-6 rounded-lg border border-[#E5E0D8] text-left flex flex-col justify-between shadow-2xs">
                  <div className="space-y-4">
                    <RatingStars rating={5.0} />
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{t.quote}"</p>
                  </div>
                  <div className="pt-4 border-t border-[#E5E0D8]/60 mt-4">
                    <p className="text-xs font-bold text-[#1A2B4C]">{t.name}</p>
                    <p className="text-[10px] text-[#C5A059] font-medium">{t.location} • Verified Buyer</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
