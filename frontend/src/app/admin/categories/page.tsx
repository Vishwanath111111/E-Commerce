'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Category } from '@/types';
import { api } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    try {
      await api.createCategory({ name, slug, description, isFeatured: true });
      alert('Category created successfully!');
      setName('');
      setSlug('');
      setDescription('');
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await api.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Category Taxonomy Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage fashion categories, subcategories & featured showcases</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-4 text-xs h-fit">
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base border-b pb-2">Add New Category</h3>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. Royal Dupattas"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Category description..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase rounded-md hover:bg-[#0F1C34]"
              >
                Save Category
              </button>
            </form>

            {/* Categories Table */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#1A2B4C]">{c.name}</td>
                      <td className="p-3 font-mono text-gray-500">{c.slug}</td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">{c.description || '-'}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
