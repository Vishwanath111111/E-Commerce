'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function FAQPage() {
  const faqs = [
    { q: 'Are all VASTRADA sarees certified pure silk?', a: 'Yes. Every Kanjeevaram, Banarasi, and Chanderi silk saree comes with certified Silk Mark authenticity tags guaranteeing 100% pure silk yarn and authentic zari brocade.' },
    { q: 'How long does shipping take across India?', a: 'Standard express shipping takes 2-4 business days. Custom tailored garments (such as bridal sherwanis or blouses) take 5-7 business days.' },
    { q: 'Do you offer Cash on Delivery (COD)?', a: 'Yes! Cash on Delivery is supported for order values up to ₹50,000 across 18,000+ PIN codes in India.' },
    { q: 'What is your return and size exchange policy?', a: 'We offer a hassle-free 7-day size exchange and return policy for unworn items with intact original tags.' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <div className="text-center space-y-2 border-b border-[#E5E0D8] pb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Help & Support</span>
            <h1 className="text-3xl font-serif font-bold text-[#1A2B4C]">Frequently Asked Questions</h1>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-2">
                <h3 className="font-serif font-bold text-[#1A2B4C] text-base">{f.q}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
