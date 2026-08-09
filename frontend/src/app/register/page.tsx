'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ fullName, email, phone, password });
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg border border-[#E5E0D8] shadow-md space-y-6">
            
            <div className="text-center">
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Join VASTRADA Privé</h1>
              <p className="text-xs text-gray-500 mt-1">Create your royal account to enjoy personalized shopping</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                  placeholder="e.g. Priya Patel"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                  placeholder="priya@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A2B4C] hover:bg-[#0F1C34] text-[#C5A059] font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-md"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-600 pt-2 border-t border-[#E5E0D8]">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#C5A059] hover:underline">
                Sign In
              </Link>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
