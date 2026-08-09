'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Review } from '@/types';
import { api } from '@/lib/api';
import RatingStars from '@/components/ui/RatingStars';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminReviews();
      setReviews(data.content || []);
    } catch (e) {
      console.error('Failed to load reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.updateReviewStatus(id, status);
      alert(`Review status updated to ${status}`);
      loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status.');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await api.deleteReview(id);
      loadReviews();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Review Moderation & Trust Desk</h1>
              <p className="text-xs text-gray-500 mt-0.5">Approve, reject or moderate customer product reviews</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading reviews...</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Comment</th>
                    <th className="p-3">Verified Buyer</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#1A2B4C] max-w-xs truncate">{r.productName || `Product #${r.productId}`}</td>
                      <td className="p-3 font-semibold">{r.customerName}</td>
                      <td className="p-3"><RatingStars rating={r.rating} /></td>
                      <td className="p-3 text-gray-700 max-w-sm">{r.comment}</td>
                      <td className="p-3">
                        {r.isVerifiedPurchase ? (
                          <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded">Verified</span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Standard</span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-[#C5A059]">{r.status}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'APPROVED')}
                          className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'REJECTED')}
                          className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
