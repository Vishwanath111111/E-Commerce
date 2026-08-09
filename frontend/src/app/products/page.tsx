'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';
import { Filter, SlidersHorizontal, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';
  const initialSort = searchParams.get('sortBy') || 'newest';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minRating, setMinRating] = useState<number | ''>('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    }
    fetchCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        minPrice: minPrice !== '' ? minPrice : undefined,
        maxPrice: maxPrice !== '' ? maxPrice : undefined,
        minRating: minRating !== '' ? minRating : undefined,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        sortBy: sortBy,
        page: page,
        pageSize: 12,
      });

      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy, page]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setMinRating('');
    setSortBy('newest');
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        {/* Page Header */}
        <div className="bg-[#1A2B4C] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/30">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide">
              {selectedCategory ? selectedCategory.replace('-', ' ').toUpperCase() : 'ALL ROYAL COLLECTIONS'}
            </h1>
            <p className="text-xs text-gray-300 mt-2 uppercase tracking-widest">
              Showing {totalElements} Artisanal Creations
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filters */}
            <aside className={`lg:w-64 bg-white p-6 rounded-lg border border-[#E5E0D8] h-fit space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <h3 className="font-serif font-bold text-[#1A2B4C] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#C5A059]" /> Filter Products
                </h3>
                <button onClick={handleResetFilters} className="text-xs text-[#C5A059] hover:underline font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              <form onSubmit={handleApplyFilters} className="space-y-6 text-xs">
                {/* Search */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Search Keywords</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Saree, Kurta, Silk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                    <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
                    className="w-full py-2 px-3 border border-[#E5E0D8] rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Price Range (₹)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-2 py-1.5 border border-[#E5E0D8] rounded-md text-xs"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-2 py-1.5 border border-[#E5E0D8] rounded-md text-xs"
                    />
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Free Size', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                        className={`px-2.5 py-1 text-[11px] rounded-md font-medium border transition-colors ${
                          selectedSize === sz
                            ? 'bg-[#1A2B4C] text-[#C5A059] border-[#1A2B4C]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#C5A059]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Minimum Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
                    className="w-full py-2 px-3 border border-[#E5E0D8] rounded-md text-xs bg-white text-gray-800"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5★ & Above</option>
                    <option value="4.0">4.0★ & Above</option>
                    <option value="3.5">3.5★ & Above</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1A2B4C] hover:bg-[#C5A059] text-white hover:text-[#1A2B4C] font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
                >
                  Apply Filters
                </button>
              </form>
            </aside>

            {/* Main Product Grid Container */}
            <main className="flex-1">
              
              {/* Top Controls Bar */}
              <div className="bg-white p-4 rounded-lg border border-[#E5E0D8] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[#1A2B4C] text-[#C5A059] text-xs font-bold rounded-md"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filter Products
                </button>

                <div className="text-xs text-gray-600">
                  Showing <span className="font-bold text-[#1A2B4C]">{products.length}</span> of <span className="font-bold text-[#1A2B4C]">{totalElements}</span> items
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <label className="font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Sort By:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                    className="px-3 py-1.5 border border-[#E5E0D8] rounded-md bg-white text-xs text-gray-800 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12 text-center text-gray-500">
                  Loading VASTRADA collections...
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* No Results State */
                <div className="bg-white p-12 rounded-lg border border-[#E5E0D8] text-center space-y-4">
                  <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">No Matching Products Found</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    We couldn't find any products matching your current search criteria. Try clearing filters or searching for another term.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-[#C5A059] text-[#1A2B4C] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#b08c46]"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center space-x-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="p-2 border border-[#E5E0D8] rounded-md disabled:opacity-40 hover:bg-[#1A2B4C] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors ${
                        page === i
                          ? 'bg-[#1A2B4C] text-[#C5A059]'
                          : 'bg-white border border-[#E5E0D8] text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="p-2 border border-[#E5E0D8] rounded-md disabled:opacity-40 hover:bg-[#1A2B4C] hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </main>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading VASTRADA Catalogue...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
