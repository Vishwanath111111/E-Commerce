'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-serif font-bold text-[#1A2B4C]">Terms & Conditions</h1>
          <p>Welcome to VASTRADA. By accessing or purchasing from our platform, you agree to comply with our terms of commercial service.</p>
          <h3 className="font-bold text-sm text-[#1A2B4C]">Authenticity & Product Specifications</h3>
          <p>Due to the artisanal nature of handloom silk sarees and hand-embroidered garments, subtle weave variations are natural hallmarks of authentic craftsmanship.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
