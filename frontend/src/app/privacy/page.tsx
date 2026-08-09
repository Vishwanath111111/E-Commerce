'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-serif font-bold text-[#1A2B4C]">Privacy Policy</h1>
          <p>At VASTRADA, we value your trust and are committed to protecting your personal data. We collect customer information solely to fulfill orders, process payments, and improve your couture shopping experience.</p>
          <h3 className="font-bold text-sm text-[#1A2B4C]">Data Security</h3>
          <p>All sensitive transactions are encrypted using 256-bit SSL technology. We never store plaintext passwords or unencrypted financial credentials.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
