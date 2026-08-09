'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { DashboardStats } from '@/types';
import { api, formatINR } from '@/lib/api';
import { IndianRupee, ShoppingCart, Users, Package, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminDashboardStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Executive Business Analytics</h1>
              <p className="text-xs text-gray-500 mt-0.5">Real-time revenue, sales, order status & inventory overview</p>
            </div>
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#0F1C34]"
            >
              + Create New Product
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Gross Sales</span>
                <div className="p-2 bg-green-50 text-green-700 rounded-md"><IndianRupee className="w-5 h-5" /></div>
              </div>
              <p className="text-2xl font-bold text-[#1A2B4C]">{formatINR(stats?.totalSales || 0)}</p>
              <p className="text-[11px] text-green-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> Calculated authoritatively from completed orders
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Customer Orders</span>
                <div className="p-2 bg-blue-50 text-blue-700 rounded-md"><ShoppingCart className="w-5 h-5" /></div>
              </div>
              <p className="text-2xl font-bold text-[#1A2B4C]">{stats?.totalOrders || 0}</p>
              <p className="text-[11px] text-gray-500">Across all order status pipelines</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Pending Orders</span>
                <div className="p-2 bg-amber-50 text-amber-700 rounded-md"><Clock className="w-5 h-5" /></div>
              </div>
              <p className="text-2xl font-bold text-[#1A2B4C]">{stats?.pendingOrdersCount || 0}</p>
              <p className="text-[11px] text-amber-700 font-semibold">Requires fulfillment action</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Low Stock Variants</span>
                <div className="p-2 bg-red-50 text-red-700 rounded-md"><AlertTriangle className="w-5 h-5" /></div>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats?.lowStockProductsCount || 0}</p>
              <Link href="/admin/inventory" className="text-[11px] text-red-600 font-semibold hover:underline block">
                Replenish inventory stock &rarr;
              </Link>
            </div>

          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="font-serif font-bold text-[#1A2B4C] text-lg">Recent Customer Orders</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-[#C5A059] hover:underline">
                View All Orders &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-[#1A2B4C]">{o.orderNumber}</td>
                        <td className="p-3">{o.customerName || 'Customer'}</td>
                        <td className="p-3 font-bold text-gray-900">{formatINR(o.totalAmount)}</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold">{o.paymentMethod}</span></td>
                        <td className="p-3 font-bold text-[#C5A059]">{o.status}</td>
                        <td className="p-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-[#1A2B4C] text-lg border-b border-[#E5E0D8] pb-3">
              Top Best Selling Heritage Creations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats?.bestSellingProducts?.map((p) => (
                <div key={p.id} className="p-3 border border-[#E5E0D8] rounded-md flex items-center space-x-3">
                  <div className="w-12 h-16 bg-[#F8F5F0] rounded-sm relative overflow-hidden flex-shrink-0">
                    <img src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'} alt={p.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1A2B4C] line-clamp-1">{p.name}</h4>
                    <p className="text-xs font-semibold text-[#C5A059] mt-0.5">{formatINR(p.discountPrice || p.basePrice)}</p>
                    <p className="text-[10px] text-gray-400">SKU: {p.variants?.[0]?.sku || 'VST-01'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
