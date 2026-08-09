'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">The VASTRADA Heritage</span>
            <h1 className="text-4xl font-serif font-bold text-[#1A2B4C]">Preserving Indian Handloom & Royal Couture</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Founded with a mission to bring authentic, heirloom-quality Indian textiles and royal ethnic wear directly from master artisan clusters to global connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#E5E0D8] shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=80"
                alt="Banarasi Weaving"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-[#1A2B4C]">Our Artisan Promise</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every pure Kanjeevaram saree, Zardozi lehenga, and Jodhpuri Bandhgala at VASTRADA is crafted using traditional techniques passed down through generations. We work directly with over 1,200 weavers across Kanchipuram, Varanasi, Lucknow, and Jaipur.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white rounded border text-xs">
                  <strong className="block text-[#1A2B4C]">100% Pure Mulberry Silk</strong> Certified by Silk Mark Organization.
                </div>
                <div className="p-3 bg-white rounded border text-xs">
                  <strong className="block text-[#1A2B4C]">Real Zari Brocade</strong> Woven with pure metallic silver & gold threads.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
