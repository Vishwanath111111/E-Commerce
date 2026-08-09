export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  subCategories?: Category[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  discountPrice?: number;
  isActive?: boolean;
  availableQuantity?: number;
  inStock?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand?: string;
  description: string;
  specifications?: string;
  material?: string;
  careInstructions?: string;
  deliveryInfo?: string;
  basePrice: number;
  discountPrice?: number;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isActive?: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt?: string;
}

export interface CartItem {
  id: number;
  variantId: number;
  sku: string;
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock?: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
  createdAt?: string;
}

export interface Wishlist {
  id?: number;
  items: WishlistItem[];
}

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
  addressType?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  variantId?: number;
  productName: string;
  variantSku: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number;
  customerName?: string;
  customerEmail?: string;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  trackingNumber?: string;
  customerNotes?: string;
  items: OrderItem[];
  createdAt: string;
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: number;
  productId: number;
  productName?: string;
  userId: number;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase?: boolean;
  status: ReviewStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProductsCount: number;
  pendingOrdersCount: number;
  recentOrders: Order[];
  bestSellingProducts: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}
