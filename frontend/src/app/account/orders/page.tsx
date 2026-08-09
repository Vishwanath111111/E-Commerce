'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Order } from '@/types';
import { api, formatINR } from '@/lib/api';
import { Package, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await api.getCustomerOrders();
        setOrders(data);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> In Transit</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Processing</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-serif font-bold text-[#1A2B4C] mb-8">My Orders & Tracking</h1>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading your order history...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg border border-[#E5E0D8] shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E0D8] pb-4 gap-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Number</span>
                      <h3 className="text-base font-serif font-bold text-[#1A2B4C]">{order.orderNumber}</h3>
                      <p className="text-[11px] text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="text-base font-bold text-[#C5A059]">{formatINR(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 text-xs text-gray-700">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-1">
                        <div>
                          <p className="font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-[11px] text-gray-400">SKU: {item.variantSku} | Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold">{formatINR(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E5E0D8]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 gap-2">
                    <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to cancel this order?')) {
                            await api.cancelOrder(order.id);
                            alert('Order cancelled successfully.');
                            window.location.reload();
                          }
                        }}
                        className="text-red-600 hover:underline font-bold"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg border border-[#E5E0D8] text-center space-y-4">
              <Package className="w-16 h-16 text-[#C5A059] mx-auto" />
              <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500">When you place an order, its real-time tracking status will appear here.</p>
              <Link href="/products" className="inline-block px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] text-xs font-bold uppercase rounded-sm">
                Explore Collections
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
