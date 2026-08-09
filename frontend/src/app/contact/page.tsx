'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">Privé Concierge</span>
            <h1 className="text-3xl font-serif font-bold text-[#1A2B4C] mt-1">Get In Touch With Us</h1>
            <p className="text-xs text-gray-500 mt-2">Our bridal couture consultants and customer support team are available 7 days a week.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-4">
                <div className="flex items-center space-x-3 text-[#1A2B4C]">
                  <Phone className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h4 className="font-bold text-xs">Customer Support Helpline</h4>
                    <p className="text-xs text-gray-600">+91 (022) 4987 6543 / +91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-[#1A2B4C]">
                  <Mail className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h4 className="font-bold text-xs">Email Concierge</h4>
                    <p className="text-xs text-gray-600">concierge@vastrada.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-[#1A2B4C]">
                  <MapPin className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h4 className="font-bold text-xs">Flagship Atelier</h4>
                    <p className="text-xs text-gray-600">VASTRADA Heritage House, Bandra West, Mumbai - 400050</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-lg border border-[#E5E0D8]">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#1A2B4C]">Message Sent Successfully</h3>
                  <p className="text-xs text-gray-500">A VASTRADA concierge manager will reach out within 4 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                      <input type="text" required className="w-full px-3 py-2 border rounded-md" placeholder="Aarav Sharma" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                      <input type="email" required className="w-full px-3 py-2 border rounded-md" placeholder="aarav@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Bridal Appointment / Order Enquiry" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Message *</label>
                    <textarea required rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="How can our couture team assist you?" />
                  </div>
                  <button type="submit" className="px-8 py-3 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
