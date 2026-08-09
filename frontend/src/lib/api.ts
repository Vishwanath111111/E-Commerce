import { ApiResponse, AuthResponse, Cart, Category, DashboardStats, Order, Product, Review, User, Wishlist } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercentage(basePrice: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= basePrice) return 0;
  return Math.round(((basePrice - discountPrice) / basePrice) * 100);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vastrada_jwt_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'An API error occurred');
  }

  return json.data;
}

export const api = {
  // AUTH
  register: (data: any) => request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request<User>('/auth/me'),

  // PRODUCTS
  getProducts: (params?: Record<string, string | number | boolean | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    return request<any>(`/products?${searchParams.toString()}`);
  },
  getFeaturedProducts: () => request<Product[]>('/products/featured'),
  getNewArrivals: () => request<Product[]>('/products/new-arrivals'),
  getBestSellers: () => request<Product[]>('/products/best-sellers'),
  getTrendingProducts: () => request<Product[]>('/products/trending'),
  getProductBySlug: (slug: string) => request<Product>(`/products/${slug}`),
  getRelatedProducts: (slug: string) => request<Product[]>(`/products/${slug}/related`),

  // CATEGORIES
  getCategories: () => request<Category[]>('/categories'),
  getCategoryTree: () => request<Category[]>('/categories/tree'),
  getFeaturedCategories: () => request<Category[]>('/categories/featured'),
  getCategoryBySlug: (slug: string) => request<Category>(`/categories/${slug}`),

  // CART
  getCart: () => request<Cart>('/cart'),
  addToCart: (variantId: number, quantity = 1) => request<Cart>('/cart/items', { method: 'POST', body: JSON.stringify({ variantId, quantity }) }),
  updateCartItem: (itemId: number, quantity: number) => request<Cart>(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId: number) => request<Cart>(`/cart/items/${itemId}`, { method: 'DELETE' }),

  // WISHLIST
  getWishlist: () => request<Wishlist>('/wishlist'),
  addToWishlist: (productId: number) => request<Wishlist>(`/wishlist/items/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId: number) => request<Wishlist>(`/wishlist/items/${productId}`, { method: 'DELETE' }),

  // ORDERS & CHECKOUT
  placeOrder: (data: any) => request<Order>('/orders/checkout', { method: 'POST', body: JSON.stringify(data) }),
  getCustomerOrders: () => request<Order[]>('/orders'),
  getOrderDetails: (id: number) => request<Order>(`/orders/${id}`),
  trackOrder: (orderNumber: string) => request<Order>(`/orders/track/${orderNumber}`),
  cancelOrder: (id: number) => request<Order>(`/orders/${id}/cancel`, { method: 'POST' }),

  // REVIEWS
  getProductReviews: (productId: number) => request<Review[]>(`/reviews/product/${productId}`),
  submitReview: (data: any) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // ACCOUNT & ADDRESSES
  getAddresses: () => request<any[]>('/account/addresses'),
  addAddress: (data: any) => request<any>('/account/addresses', { method: 'POST', body: JSON.stringify(data) }),
  deleteAddress: (id: number) => request<void>(`/account/addresses/${id}`, { method: 'DELETE' }),
  updateProfile: (data: any) => request<User>('/account/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // ADMIN
  getAdminDashboardStats: () => request<DashboardStats>('/admin/dashboard/stats'),
  createProduct: (data: any) => request<Product>('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: number, data: any) => request<Product>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: number) => request<void>(`/admin/products/${id}`, { method: 'DELETE' }),
  createCategory: (data: any) => request<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: number, data: any) => request<Category>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: number) => request<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
  getInventoryList: () => request<any[]>('/admin/inventory'),
  updateStock: (variantId: number, quantity: number, lowStockThreshold?: number) =>
    request<any>(`/admin/inventory/${variantId}/stock?quantity=${quantity}${lowStockThreshold ? `&lowStockThreshold=${lowStockThreshold}` : ''}`, { method: 'PUT' }),
  getAdminOrders: (page = 0, size = 20) => request<any>(`/admin/orders?page=${page}&size=${size}`),
  updateOrderStatus: (id: number, status: string, trackingNumber?: string) =>
    request<Order>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, trackingNumber }) }),
  getAdminCustomers: (page = 0, size = 20) => request<any>(`/admin/customers?page=${page}&size=${size}`),
  getAdminReviews: (page = 0, size = 20) => request<any>(`/admin/reviews?page=${page}&size=${size}`),
  updateReviewStatus: (id: number, status: string) => request<Review>(`/admin/reviews/${id}/status?status=${status}`, { method: 'PATCH' }),
  deleteReview: (id: number) => request<void>(`/admin/reviews/${id}`, { method: 'DELETE' }),
};
