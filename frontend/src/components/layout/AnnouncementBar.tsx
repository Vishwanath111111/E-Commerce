'use client';

import React from 'react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#1A2B4C] text-[#FDFBF7] text-xs py-2 px-4 border-b border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
          <span>VASTRADA FESTIVE COLLECTION — UP TO 30% OFF ON ARTISANAL ETHNIC WEAR</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[#E5E0D8]">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#C5A059]" /> Free Express Shipping Over ₹1,999
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> 100% Authentic Handcrafted Heritage
          </span>
        </div>
      </div>
    </div>
  );
}
