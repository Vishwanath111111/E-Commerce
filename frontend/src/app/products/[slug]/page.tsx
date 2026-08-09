'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import RatingStars from '@/components/ui/RatingStars';
import { Product, ProductVariant, Review } from '@/types';
import { api, formatINR, calculateDiscountPercentage } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getProductBySlug(slug);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].imageUrl);
        }
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        const [rel, revs] = await Promise.allSettled([
          api.getRelatedProducts(slug),
          api.getProductReviews(data.id),
        ]);

        if (rel.status === 'fulfilled') setRelatedProducts(rel.value);
        if (revs.status === 'fulfilled') setReviews(revs.value);
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-500">
            Loading royal garment details...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#1A2B4C]">Product Not Found</h2>
            <p className="text-xs text-gray-500">The product you are looking for may have been retired or moved.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercentage(product.basePrice, product.discountPrice);
  const inStock = selectedVariant ? (selectedVariant.availableQuantity || 0) > 0 : false;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const newRev = await api.submitReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviews([newRev, ...reviews]);
      setReviewTitle('');
      setReviewComment('');
      alert('Thank you! Your verified review has been submitted.');
    } catch (e: any) {
      alert(e.message || 'Failed to submit review. Make sure you are signed in.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />

        {/* Product Detail Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <Image
                  src={selectedImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-top"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-[#DC2626] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className={`relative w-20 aspect-3/4 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === img.imageUrl ? 'border-[#C5A059]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img.imageUrl} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Specifications & Purchase Controls */}
            <div className="space-y-6">
              
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#C5A059]">
                  {product.brand || 'VASTRADA Couture'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B4C] mt-1">
                  {product.name}
                </h1>
                <div className="mt-2 flex items-center space-x-3">
                  <RatingStars rating={product.averageRating || 4.8} count={product.reviewCount || 12} />
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs font-medium text-[#059669]">100% Authentic Handloom</span>
                </div>
              </div>

              {/* Price & Discounts */}
              <div className="bg-white p-4 rounded-lg border border-[#E5E0D8] flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-[#1A2B4C]">
                  {formatINR(selectedVariant?.discountPrice || product.discountPrice || product.basePrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatINR(product.basePrice)}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">Inclusive of all taxes & GST</span>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  {inStock ? `IN STOCK (${selectedVariant?.availableQuantity} available)` : 'OUT OF STOCK'}
                </span>
              </div>

              {/* Variant Selector - Size */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Select Size: <span className="text-[#C5A059]">{selectedVariant?.size || 'Free Size'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 text-xs font-semibold rounded-md border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-[#1A2B4C] text-[#C5A059] border-[#1A2B4C]'
                            : 'bg-white text-gray-800 border-[#E5E0D8] hover:border-[#C5A059]'
                        }`}
                      >
                        {v.size || 'Standard'} {v.color ? `(${v.color})` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-md border border-[#E5E0D8] bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-md border border-[#E5E0D8] bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  disabled={!inStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#1A2B4C] hover:bg-[#0F1C34] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" /> Add to Shopping Cart
                </button>
                <button
                  disabled={!inStock}
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 bg-[#C5A059] hover:bg-[#b08c46] disabled:opacity-50 text-[#1A2B4C] font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                  className={`p-3.5 border rounded-sm transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-[#E5E0D8] bg-white text-gray-700 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Delivery & Assurance Cards */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5E0D8] text-center text-[11px] text-gray-600">
                <div className="p-3 bg-white rounded-md border border-[#E5E0D8]">
                  <Truck className="w-4 h-4 mx-auto text-[#C5A059] mb-1" /> Express Shipping
                </div>
                <div className="p-3 bg-white rounded-md border border-[#E5E0D8]">
                  <ShieldCheck className="w-4 h-4 mx-auto text-[#C5A059] mb-1" /> Pure Silk Certified
                </div>
                <div className="p-3 bg-white rounded-md border border-[#E5E0D8]">
                  <RotateCcw className="w-4 h-4 mx-auto text-[#C5A059] mb-1" /> 7-Day Easy Returns
                </div>
              </div>

              {/* Specifications & Care Accordion */}
              <div className="bg-white p-6 rounded-lg border border-[#E5E0D8] space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#1A2B4C] uppercase tracking-wider mb-1">Product Description</h4>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                {product.material && (
                  <div>
                    <h4 className="font-bold text-[#1A2B4C] uppercase tracking-wider mb-1">Material & Fabric</h4>
                    <p className="text-gray-600">{product.material}</p>
                  </div>
                )}
                {product.careInstructions && (
                  <div>
                    <h4 className="font-bold text-[#1A2B4C] uppercase tracking-wider mb-1">Care Instructions</h4>
                    <p className="text-gray-600">{product.careInstructions}</p>
                  </div>
                )}
                {product.deliveryInfo && (
                  <div>
                    <h4 className="font-bold text-[#1A2B4C] uppercase tracking-wider mb-1">Delivery Information</h4>
                    <p className="text-gray-600">{product.deliveryInfo}</p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* VERIFIED CUSTOMER REVIEWS SECTION */}
          <div className="mt-16 bg-white p-8 rounded-lg border border-[#E5E0D8]">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E5E0D8] pb-6 mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2B4C]">Verified Customer Reviews</h3>
                <div className="mt-1 flex items-center space-x-2">
                  <RatingStars rating={product.averageRating || 4.8} />
                  <span className="text-xs text-gray-500">Based on {reviews.length} reviews</span>
                </div>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-[#FDFBF7] p-6 rounded-lg border border-[#E5E0D8] mb-10 space-y-4">
              <h4 className="font-serif font-bold text-[#1A2B4C] text-base">Write a Customer Review</h4>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Review Title</label>
                <input
                  type="text"
                  placeholder="Summarize your experience..."
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Review Details *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe fabric quality, fitting, embroidery..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D8] rounded-md text-xs bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-6 py-2.5 bg-[#1A2B4C] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#0F1C34]"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-[#E5E0D8] pb-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#1A2B4C]">{rev.customerName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold border border-green-200">
                            <Check className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <RatingStars rating={rev.rating} />
                    {rev.title && <h5 className="font-bold text-xs text-gray-900">{rev.title}</h5>}
                    <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No customer reviews submitted yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-serif font-bold text-[#1A2B4C] mb-8">You May Also Admire</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
