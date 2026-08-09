'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FolderTree, Boxes, ShoppingCart, Users, Star, BarChart3, FileText, ArrowLeft } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products CRUD', href: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders Management', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#1A2B4C] text-[#E5E0D8] min-h-screen flex flex-col justify-between p-4 border-r border-[#C5A059]/30">
      <div className="space-y-6">
        
        {/* Admin Brand Badge */}
        <div className="border-b border-[#C5A059]/30 pb-4">
          <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-[#0F1C34] flex items-center justify-center p-1 border border-[#C5A059]/60">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 6L18 9L16 11L14 9L16 6Z" fill="#C5A059"/>
                <path d="M8 12L16 26L24 12H20.5L16 20.5L11.5 12H8Z" fill="#C5A059"/>
              </svg>
            </div>
            <div className="text-left">
              <span className="text-lg font-serif font-bold text-white tracking-widest block leading-tight">VASTRADA</span>
              <span className="text-[9px] text-[#C5A059] uppercase tracking-widest font-semibold block">Enterprise Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 text-xs">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#C5A059] text-[#1A2B4C]'
                    : 'text-gray-300 hover:bg-[#0F1C34] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Back to Customer Store Button */}
      <div className="pt-4 border-t border-[#C5A059]/30">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Customer Store
        </Link>
      </div>

    </aside>
  );
}
