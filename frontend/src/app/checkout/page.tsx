'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, formatINR } from '@/lib/api';
import { ShieldCheck, CheckCircle2, CreditCard, Banknote } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'MOCK_CARD' | 'MOCK_UPI'>('COD');
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  const items = cart?.items || [];

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#1A2B4C]">Checkout Bag Empty</h2>
            <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const order = await api.placeOrder({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: 'India',
        paymentMethod,
        customerNotes,
      });

      setOrderConfirmed(order);
      await refreshCart();
      setStep(5); // Confirmation Step
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Step Indicator */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              {['1. Customer Info', '2. Delivery Address', '3. Summary', '4. Payment', '5. Confirmation'].map((title, i) => (
                <div key={i} className={`flex items-center gap-1.5 ${step === i + 1 ? 'text-[#C5A059]' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{title}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1A2B4C] h-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {step === 5 && orderConfirmed ? (
            /* Order Confirmation Step */
            <div className="bg-white p-10 rounded-lg border border-[#E5E0D8] max-w-2xl mx-auto text-center space-y-6 shadow-md">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
              <h2 className="text-3xl font-serif font-bold text-[#1A2B4C]">Order Confirmed!</h2>
              <p className="text-xs text-gray-600">
                Thank you for your purchase with VASTRADA. Your order number is{' '}
                <span className="font-bold text-[#C5A059]">{orderConfirmed.orderNumber}</span>.
              </p>
              <div className="bg-[#FDFBF7] p-4 rounded-md border border-[#E5E0D8] text-xs text-left space-y-2">
                <p><strong>Total Amount:</strong> {formatINR(orderConfirmed.totalAmount)}</p>
                <p><strong>Payment Method:</strong> {orderConfirmed.paymentMethod}</p>
                <p><strong>Shipping Address:</strong> {orderConfirmed.shippingAddress}</p>
                <p><strong>Status:</strong> {orderConfirmed.status}</p>
              </div>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => router.push('/account/orders')}
                  className="px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-sm"
                >
                  View Order History
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="px-6 py-2.5 border border-[#1A2B4C] text-[#1A2B4C] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg border border-[#E5E0D8] space-y-6">
                
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#1A2B4C] border-b border-[#E5E0D8] pb-3">
                      Step 1: Customer Information
                    </h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:border-[#C5A059]"
                        placeholder="e.g. Aarav Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs focus:border-[#C5A059]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <button
                      onClick={() => { if (fullName && phone) setStep(2); else alert('Please fill in your name and phone number.'); }}
                      className="px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-widest rounded-sm"
                    >
                      Continue to Address
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#1A2B4C] border-b border-[#E5E0D8] pb-3">
                      Step 2: Delivery Address
                    </h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs"
                        placeholder="House / Flat No., Building Name, Street"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs"
                        placeholder="Landmark, Area"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs"
                          placeholder="e.g. Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs"
                          placeholder="e.g. Maharashtra"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">PIN / Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs"
                        placeholder="e.g. 400001"
                      />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button onClick={() => setStep(1)} className="px-4 py-2 border text-xs font-bold uppercase rounded-sm">Back</button>
                      <button
                        onClick={() => { if (addressLine1 && city && state && postalCode) setStep(3); else alert('Please fill in required address fields.'); }}
                        className="px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-widest rounded-sm"
                      >
                        Continue to Order Review
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#1A2B4C] border-b border-[#E5E0D8] pb-3">
                      Step 3: Review Order Items
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
                          <div>
                            <p className="font-bold text-[#1A2B4C]">{item.productName}</p>
                            <p className="text-gray-500">Qty: {item.quantity} | Size: {item.size || 'Free Size'}</p>
                          </div>
                          <span className="font-bold">{formatINR(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button onClick={() => setStep(2)} className="px-4 py-2 border text-xs font-bold uppercase rounded-sm">Back</button>
                      <button
                        onClick={() => setStep(4)}
                        className="px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-widest rounded-sm"
                      >
                        Proceed to Payment Selection
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <h3 className="text-lg font-serif font-bold text-[#1A2B4C] border-b border-[#E5E0D8] pb-3">
                      Step 4: Select Payment Method
                    </h3>

                    <div className="space-y-3">
                      <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#C5A059] bg-[#FDFBF7]' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="pm"
                              value="COD"
                              checked={paymentMethod === 'COD'}
                              onChange={() => setPaymentMethod('COD')}
                            />
                            <div>
                              <p className="font-bold text-xs text-[#1A2B4C] flex items-center gap-1.5">
                                <Banknote className="w-4 h-4 text-green-700" /> Cash on Delivery (COD)
                              </p>
                              <p className="text-[11px] text-gray-500">Pay cash upon home delivery across India</p>
                            </div>
                          </div>
                        </div>
                      </label>

                      <label className={`block p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'MOCK_CARD' ? 'border-[#C5A059] bg-[#FDFBF7]' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="pm"
                              value="MOCK_CARD"
                              checked={paymentMethod === 'MOCK_CARD'}
                              onChange={() => setPaymentMethod('MOCK_CARD')}
                            />
                            <div>
                              <p className="font-bold text-xs text-[#1A2B4C] flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-blue-700" /> Test Credit / Debit Card (Mock Abstraction)
                              </p>
                              <p className="text-[11px] text-gray-500">Simulates instant payment authorization</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Customer Delivery Instructions</label>
                      <textarea
                        rows={2}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs"
                        placeholder="Leave at front desk, call before arrival..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(3)} className="px-4 py-2 border text-xs font-bold uppercase rounded-sm">Back</button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3.5 bg-[#C5A059] hover:bg-[#b08c46] text-[#1A2B4C] font-bold text-xs uppercase tracking-widest rounded-sm shadow-md"
                      >
                        {submitting ? 'Confirming Order...' : `Confirm & Place Order (${formatINR(cart?.grandTotal)})`}
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Order Total Sidebar */}
              <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] h-fit space-y-4">
                <h4 className="font-serif font-bold text-[#1A2B4C] border-b border-[#E5E0D8] pb-3">Order Summary</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{formatINR(cart?.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Delivery:</span><span>{cart?.deliveryFee === 0 ? 'FREE' : formatINR(cart?.deliveryFee)}</span></div>
                  <div className="flex justify-between font-bold text-sm text-[#1A2B4C] border-t border-[#E5E0D8] pt-2">
                    <span>Total Amount:</span><span className="text-[#C5A059]">{formatINR(cart?.grandTotal)}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
