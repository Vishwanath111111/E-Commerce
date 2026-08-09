'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { api } from '@/lib/api';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventoryList();
      setInventoryList(data);
    } catch (e) {
      console.error('Failed to load inventory', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateStock = async (variantId: number, currentQty: number) => {
    const newQtyStr = prompt('Enter updated available inventory quantity:', String(currentQty));
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr, 10);
    if (isNaN(newQty) || newQty < 0) {
      alert('Quantity must be a valid non-negative integer.');
      return;
    }

    try {
      await api.updateStock(variantId, newQty);
      alert('Inventory quantity updated successfully!');
      loadInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Inventory & Stock Control</h1>
              <p className="text-xs text-gray-500 mt-0.5">Track variant SKUs, available stock, sold quantities & low-stock guards</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading inventory...</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Variant SKU</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Attributes</th>
                    <th className="p-3">Available Qty</th>
                    <th className="p-3">Sold Qty</th>
                    <th className="p-3">Stock Status</th>
                    <th className="p-3 text-right">Replenish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventoryList.map((inv) => {
                    const available = inv.availableQuantity || 0;
                    const threshold = inv.lowStockThreshold || 5;
                    const isLow = available > 0 && available <= threshold;
                    const isOut = available === 0;

                    return (
                      <tr key={inv.id} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-[#1A2B4C]">{inv.variant?.sku}</td>
                        <td className="p-3 font-semibold">{inv.variant?.product?.name || 'Heritage Product'}</td>
                        <td className="p-3 text-gray-500">Size: {inv.variant?.size} | Color: {inv.variant?.color}</td>
                        <td className="p-3 font-bold text-sm">{available}</td>
                        <td className="p-3 text-gray-600">{inv.soldQuantity || 0}</td>
                        <td className="p-3">
                          {isOut ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" /> OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" /> LOW STOCK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" /> IN STOCK
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleUpdateStock(inv.variant.id, available)}
                            className="px-3 py-1 bg-[#1A2B4C] text-[#C5A059] text-xs font-bold rounded hover:bg-[#0F1C34]"
                          >
                            Set Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
