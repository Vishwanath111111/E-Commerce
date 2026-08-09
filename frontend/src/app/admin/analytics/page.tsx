'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { DashboardStats } from '@/types';
import { api, formatINR } from '@/lib/api';
import { TrendingUp, DollarSign, ShoppingBag, BarChart3, PieChart } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminDashboardStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load stats', e);
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
          
          <div className="border-b border-[#E5E0D8] pb-4">
            <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Commercial Analytics & Revenue Intelligence</h1>
            <p className="text-xs text-gray-500 mt-0.5">Deep financial performance, sales breakdowns & inventory velocity</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base border-b pb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#C5A059]" /> Gross Revenue Breakdown
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-600">Total Recorded Sales</span>
                  <span className="font-bold text-[#1A2B4C]">{formatINR(stats?.totalSales || 0)}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-600">Average Order Value (AOV)</span>
                  <span className="font-bold text-gray-900">
                    {stats?.totalOrders ? formatINR((stats.totalSales || 0) / stats.totalOrders) : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Total Customer Base</span>
                  <span className="font-bold text-[#C5A059]">{stats?.totalCustomers || 0} Accounts</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base border-b pb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C5A059]" /> Order Fulfillment Distribution
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-600">Total Processed Orders</span>
                  <span className="font-bold text-gray-900">{stats?.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-600">Pending Dispatch</span>
                  <span className="font-bold text-amber-700">{stats?.pendingOrdersCount || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Active Product Catalogue</span>
                  <span className="font-bold text-[#1A2B4C]">{stats?.totalProducts || 0} Items</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base border-b pb-2 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#C5A059]" /> Inventory Health Index
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-600">Low Stock Alert Count</span>
                  <span className="font-bold text-red-600">{stats?.lowStockProductsCount || 0} SKUs</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Fulfillment Assurance</span>
                  <span className="font-bold text-green-700">100% Guard Protected</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
