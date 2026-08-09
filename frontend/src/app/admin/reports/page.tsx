'use client';

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { FileText, Download } from 'lucide-react';

export default function AdminReportsPage() {
  const handleExport = (reportType: string) => {
    alert(`Exporting ${reportType} report... CSV download initiated.`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="border-b border-[#E5E0D8] pb-4">
            <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">System Audit & Commercial Reports</h1>
            <p className="text-xs text-gray-500 mt-0.5">Download exportable CSV reports for sales, stock audit & customer orders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-3">
              <FileText className="w-8 h-8 text-[#C5A059]" />
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base">Sales & Revenue Report</h3>
              <p className="text-xs text-gray-500">Detailed itemized sales ledger with GST taxes and order dates.</p>
              <button
                onClick={() => handleExport('Sales')}
                className="w-full py-2 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase rounded-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Sales CSV
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-3">
              <FileText className="w-8 h-8 text-[#C5A059]" />
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base">Inventory Audit Report</h3>
              <p className="text-xs text-gray-500">Complete SKU inventory levels, sold items count & stock valuation.</p>
              <button
                onClick={() => handleExport('Inventory')}
                className="w-full py-2 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase rounded-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Inventory CSV
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-3">
              <FileText className="w-8 h-8 text-[#C5A059]" />
              <h3 className="font-serif font-bold text-[#1A2B4C] text-base">Customer Ledger Report</h3>
              <p className="text-xs text-gray-500">Customer directory with total spending, registration dates & status.</p>
              <button
                onClick={() => handleExport('Customer')}
                className="w-full py-2 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase rounded-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Customers CSV
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
