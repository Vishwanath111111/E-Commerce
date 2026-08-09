'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;
      try {
        setLoading(true);
        const [catData, prodData] = await Promise.all([
          api.getCategoryBySlug(slug),
          api.getProducts({ category: slug, pageSize: 24 }),
        ]);

        setCategory(catData);
        setProducts(prodData.content || []);
      } catch (e) {
        console.error('Failed to load category', e);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        {/* Category Header */}
        <div className="bg-[#1A2B4C] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/30">
          <div className="max-w-7xl mx-auto text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">VASTRADA Category</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-wide uppercase">
              {category?.name || slug.replace('-', ' ')}
            </h1>
            <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
              {category?.description || 'Explore our exclusive handcrafted heritage items in this category.'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading category products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-[#E5E0D8] text-center space-y-4">
              <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">No Products Currently in this Category</h3>
              <p className="text-xs text-gray-500">New creations will be added to this category soon.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
