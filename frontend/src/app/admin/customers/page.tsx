'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { User } from '@/types';
import { api } from '@/lib/api';
import { User as UserIcon, ShieldCheck } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await api.getAdminCustomers();
        setCustomers(data.content || []);
      } catch (e) {
        console.error('Failed to load customers', e);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Customer Relationship Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">Registered customer accounts, contact information & role privileges</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E0D8] overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading customer database...</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#E5E0D8] text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">System Role</th>
                    <th className="p-3">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-500">#{c.id}</td>
                      <td className="p-3 font-bold text-[#1A2B4C] flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#C5A059]" /> {c.fullName}
                      </td>
                      <td className="p-3 text-gray-700">{c.email}</td>
                      <td className="p-3 text-gray-600">{c.phone || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.role === 'ADMIN' ? 'bg-[#1A2B4C] text-[#C5A059]' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
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
