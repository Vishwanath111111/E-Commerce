'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Order, OrderStatus } from '@/types';
import { api, formatINR } from '@/lib/api';
import { ShoppingBag, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data.content || []);
    } catch (e) {
      console.error('Failed to load admin orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      alert(`Order #${id} status updated to ${status}`);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Order Fulfillment & Dispatch</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage order statuses, shipping tracking & status transitions</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading orders...</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Shipping Address</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#1A2B4C]">{o.orderNumber}</td>
                      <td className="p-3 font-semibold">{o.customerName || 'Customer'}</td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">{o.shippingAddress}</td>
                      <td className="p-3 font-bold text-gray-900">{formatINR(o.totalAmount)}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-gray-100 font-semibold rounded">{o.paymentMethod}</span></td>
                      <td className="p-3 font-bold text-[#C5A059]">{o.status}</td>
                      <td className="p-3 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="px-2 py-1 border rounded bg-white text-xs text-gray-800 focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
