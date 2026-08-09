import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: 'VASTRADA | Artisanal Indian Couture & Heritage Lifestyle E-Commerce',
  description: 'Shop authentic pure Kanjeevaram silk sarees, Zardozi embroidered lehengas, royal Jodhpuri sherwanis, Kundan jewellery, and handcrafted juttis online across India.',
  keywords: ['VASTRADA', 'Indian Fashion', 'Pure Silk Sarees', 'Kanjeevaram Saree', 'Lehenga Choli', 'Sherwani', 'Jodhpuri Bandhgala', 'Kundan Jewellery', 'Handmade Juttis', 'E-Commerce India'],
  authors: [{ name: 'VASTRADA Enterprise' }],
  openGraph: {
    title: 'VASTRADA — Indian Couture & Heritage Lifestyle',
    description: 'Premier online destination for authentic Indian handlooms, silk sarees, and royal wedding apparel.',
    url: 'https://vastrada.in',
    siteName: 'VASTRADA',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'VASTRADA Royal Heritage Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VASTRADA | Royal Indian Couture',
    description: 'Pure silk sarees, lehengas, and royal bandhgalas shipped across India.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VASTRADA',
    url: 'https://vastrada.in',
    logo: 'https://vastrada.in/logo.png',
    sameAs: ['https://instagram.com/vastrada.official', 'https://facebook.com/vastrada.official'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#C5A059] selection:text-[#1A2B4C]">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
