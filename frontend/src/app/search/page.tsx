'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await api.getProducts({ search: query, pageSize: 24 });
        setProducts(data.content || []);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="border-b border-[#E5E0D8] pb-4 mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#1A2B4C]">
              Search Results for "<span className="text-[#C5A059]">{query}</span>"
            </h1>
            <p className="text-xs text-gray-500 mt-1">Found {products.length} products matching your query</p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Searching VASTRADA catalogue...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-[#E5E0D8] text-center space-y-4">
              <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">No Products Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try searching for broader terms like "silk", "saree", "sherwani", "kundan", or "juttis".
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Search Results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
