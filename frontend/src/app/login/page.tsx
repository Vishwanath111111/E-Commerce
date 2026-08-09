'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
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
              <h1 className="text-2xl font-serif font-bold text-[#1A2B4C]">Sign In To VASTRADA</h1>
              <p className="text-xs text-gray-500 mt-1">Access your royal account, orders & saved wishlist</p>
            </div>

            {/* Quick Demo Login Credentials Hint */}
            <div className="bg-[#FDFBF7] p-3 rounded-md border border-[#C5A059]/40 text-xs text-gray-700 space-y-1">
              <p className="font-bold text-[#1A2B4C]">Demo Accounts Ready:</p>
              <p>• Admin: <code>admin@vastrada.in</code> / <code>Admin@123456</code></p>
              <p>• Customer: <code>customer@vastrada.in</code> / <code>Customer@123456</code></p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:outline-none focus:border-[#C5A059]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A2B4C] hover:bg-[#0F1C34] text-[#C5A059] font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-md"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-600 pt-2 border-t border-[#E5E0D8]">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-[#C5A059] hover:underline">
                Create Account
              </Link>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
