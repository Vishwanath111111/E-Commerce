'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Product, Category } from '@/types';
import { api, formatINR } from '@/lib/api';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for New/Edit Product
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('VASTRADA');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [sku, setSku] = useState('');
  const [size, setSize] = useState('Free Size');
  const [color, setColor] = useState('Royal Red');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        api.getProducts({ pageSize: 50 }),
        api.getCategories(),
      ]);
      setProducts(prodData.content || []);
      setCategories(catData);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !basePrice || !description) {
      alert('Please fill in required fields.');
      return;
    }

    try {
      await api.createProduct({
        name,
        slug,
        brand,
        description,
        basePrice: Number(basePrice),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        images: [{ imageUrl: imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', isPrimary: true }],
        variants: [
          {
            sku: sku || `VST-${slug.toUpperCase()}-01`,
            size,
            color,
            price: Number(basePrice),
            discountPrice: discountPrice ? Number(discountPrice) : undefined,
            availableQuantity: 25,
          },
        ],
        isFeatured: true,
        isActive: true,
      });

      alert('Product created successfully!');
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Product Catalogue Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage products, variants, SKUs, pricing & visibility</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#0F1C34] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Heritage Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading products...</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Discount Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 flex items-center space-x-3">
                        <img src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'} alt="" className="w-10 h-12 object-cover rounded-sm border" />
                        <div>
                          <p className="font-bold text-[#1A2B4C] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-gray-400">Slug: {p.slug}</p>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-700">{p.categoryName || 'Unassigned'}</td>
                      <td className="p-3 font-bold">{formatINR(p.basePrice)}</td>
                      <td className="p-3 text-[#C5A059] font-bold">{p.discountPrice ? formatINR(p.discountPrice) : '-'}</td>
                      <td className="p-3">
                        {p.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal Form for New Product */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 sm:p-8 rounded-lg max-w-xl w-full border border-[#E5E0D8] space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">Create New Heritage Product</h3>
                
                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                    <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Maharani Pure Silk Saree" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Slug *</label>
                    <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Base Price (₹) *</label>
                      <input type="number" required value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Discount Price (₹)</label>
                      <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md bg-white">
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Product Description *</label>
                    <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Primary Image URL</label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="https://images.unsplash.com/..." />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md font-bold uppercase text-[11px]">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase rounded-md">Save Product</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
