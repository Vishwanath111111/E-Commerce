# Enterprise Software Portfolio Report: Project 04 — VASTRADA E-Commerce Platform

**Client / Project**: Project 04 Professional Software Portfolio  
**Author**: VJ Web Studio  
**Application Name**: VASTRADA — Modern Indian Couture & Heritage Lifestyle E-Commerce  
**Tech Stack**: Next.js 16 App Router | Java 17 Spring Boot 3 REST API | PostgreSQL  
**System Scope**: Customer Web Application + Protected Enterprise Admin Panel + Authoritative Backend REST API + Normalized Relational Database

---

## 1. Executive Summary & Business Problem

### Business Problem
The Indian luxury ethnic wear and lifestyle e-commerce sector requires software capable of handling complex commercial operations beyond basic retail catalogs:
1. **Multi-Variant Inventory & Craftsmanship Complexity**: Products (such as pure silk sarees, bridal lehengas, and handcrafted sherwanis) have distinct sizes, colors, fabric weaves, and strict stock limits per SKU.
2. **Authoritative Financial & Tax Compliance**: Cart and order totals must be authoritatively calculated by the backend to prevent price tampering, while correctly applying Indian Goods & Services Tax (5% apparel GST) and delivery thresholds.
3. **Operations & Fulfillment Control**: Merchants require real-time visibility into inventory levels, low-stock thresholds, order state machine transitions (`PENDING` -> `DELIVERED`), and customer review moderation.

### Proposed Solution
**VASTRADA** addresses these commercial demands with a decoupled, enterprise architecture:
- **Frontend**: High-performance Next.js 16 App Router customer storefront and a separate, role-protected Admin Dashboard.
- **Backend**: Robust Java 17 / Spring Boot 3 REST API managing stateless JWT authentication, inventory reservation guards, authoritative order calculations, and audit logging.
- **Database**: 18-entity normalized PostgreSQL database designed for ACID transaction integrity and high-throughput queries.

---

## 2. Key Technical Features

### Customer Application
- **Commercial Storefront**: Royal hero showcase, category tiles, new arrivals, bestsellers, trending items, customer testimonials, and newsletter subscription.
- **Multi-Faceted Search & Filter Engine**: Dynamic filtering by price range in ₹, category, subcategory, size, color, rating, and sorting (Newest, Price Low-High, High-Low, Most Popular, Highest Rated).
- **Product Details & Stock Guard**: Multi-angle image galleries, variant selection, live stock indicators, material/care/delivery specifications, verified customer reviews, and related items.
- **Authoritative Shopping Cart**: Server-validated pricing, subtotal calculation, 5% GST, free shipping thresholds (> ₹1,999), and cart persistence.
- **5-Step Checkout**: Customer contact information, address book integration, order item review, payment selection (COD & Mock Payment abstractions), and order confirmation.
- **Account Dashboard & Order Tracking**: Real-time status tracking and order cancellation for eligible statuses.

### Admin Dashboard Panel (`/admin/*`)
- **Executive Analytics**: Gross sales in ₹, total orders, active customer accounts, low-stock alert counters, pending order dispatches, and bestseller charts.
- **Product CRUD**: Modal product creation, variant SKU generation, pricing/discount adjustments, image uploads, and active state toggles.
- **Category Taxonomy Management**: Parent/subcategory tree management.
- **Inventory Stock Replenishment**: Real-time stock level updates and low-stock threshold configuration.
- **Order Dispatch Management**: Sequential order status transition enforcement (`PENDING` -> `DELIVERED`) and tracking number assignment.
- **Review Moderation**: Approve or reject customer reviews with automatic recalculation of average rating scores.
- **System Reports**: Exportable CSV ledgers for sales, inventory valuation, and customer accounts.

---

## 3. System Architecture & Component Diagram

```
                               ┌────────────────────────────────────────┐
                               │  VASTRADA Next.js 16 Client App        │
                               │  - Customer Storefront Pages           │
                               │  - Protected Admin Panel (/admin/*)    │
                               └───────────────────┬────────────────────┘
                                                   │
                                         HTTP / REST API (JSON)
                                                   │
                               ┌───────────────────▼────────────────────┐
                               │  Spring Boot 3 REST API Server         │
                               │  - Spring Security + JWT Filter        │
                               │  - Controller -> Service -> Repository │
                               └───────────────────┬────────────────────┘
                                                   │
                                         Spring Data JPA / SQL
                                                   │
                               ┌───────────────────▼────────────────────┘
                               │   PostgreSQL Database (vastrada_db)    │
                               └────────────────────────────────────────┘
```

---

## 4. Database Architecture & Schema Specification

The PostgreSQL schema is fully normalized across 18 relational tables:

```sql
users (id PK, email UK, password, full_name, phone, role, created_at, updated_at)
addresses (id PK, user_id FK, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, address_type)
categories (id PK, name, slug UK, description, image_url, parent_id FK, is_featured, is_active)
products (id PK, name, slug UK, brand, description, specifications, material, care_instructions, delivery_info, base_price, discount_price, category_id FK, is_featured, is_new_arrival, is_best_seller, is_trending, is_active, average_rating, review_count, created_at)
product_images (id PK, product_id FK, image_url, is_primary, display_order)
product_variants (id PK, product_id FK, sku UK, size, color, color_hex, price, discount_price, is_active)
inventory (id PK, variant_id FK UK, available_quantity, reserved_quantity, sold_quantity, low_stock_threshold, updated_at)
carts (id PK, user_id FK UK, session_id, created_at, updated_at)
cart_items (id PK, cart_id FK, variant_id FK, quantity, unit_price, created_at)
wishlists (id PK, user_id FK UK, created_at)
wishlist_items (id PK, wishlist_id FK, product_id FK, created_at)
orders (id PK, order_number UK, user_id FK, subtotal, tax_amount, shipping_fee, discount_amount, total_amount, status, payment_method, payment_status, shipping_address, tracking_number, customer_notes, created_at)
order_items (id PK, order_id FK, variant_id FK, product_name, variant_sku, size, color, quantity, unit_price, total_price)
payments (id PK, order_id FK UK, transaction_id, payment_method, payment_status, amount, gateway_response, created_at)
reviews (id PK, product_id FK, user_id FK, rating, title, comment, is_verified_purchase, status, created_at)
promotions (id PK, title, description, discount_percentage, banner_url, target_category_id FK, is_active)
audit_logs (id PK, admin_user, action, entity_name, entity_id, details, created_at)
```

---

## 5. Security & Authentication Architecture

1. **Stateless JWT Security**: Upon login, `AuthService` generates a signed JWT token (HMAC-SHA256). The token is parsed on every incoming request by `JwtAuthenticationFilter`.
2. **Password Security**: Passwords are hashed using BCrypt (`BCryptPasswordEncoder`) with a strength factor of 10. Passwords are never stored or returned in DTO responses.
3. **Role-Based Authorization**:
   - `/api/v1/auth/**`, GET `/api/v1/products/**`, GET `/api/v1/categories/**`: Public
   - `/api/v1/cart/**`, `/api/v1/orders/**`, `/api/v1/account/**`: Authenticated Customer
   - `/api/v1/admin/**`: Restricted to users with `ROLE_ADMIN` authority (`@PreAuthorize("hasRole('ADMIN')")`).

---

## 6. SEO, Performance & Accessibility

- **SEO**: Schema.org `Organization` JSON-LD microdata, dynamic OpenGraph & Twitter Cards, `robots.ts`, and `sitemap.ts`.
- **Performance**: Next.js Turbopack compiler, optimized font loading, image layout constraints, and database index optimization on `slug`, `category_id`, `sku`, and `status`.
- **Accessibility**: Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`), ARIA attributes, keyboard accessibility, and proper contrast ratios.

---

## 7. Future Scope & Extensibility

- **Payment Gateway Integration**: Clean abstraction ready for Razorpay, Cashfree, or Stripe SDK integration.
- **Automated SMS & WhatsApp Dispatch Alerts**: Integration hooks for Twilio / Kaleyra notification webhooks upon status changes (`SHIPPED` / `DELIVERED`).
- **Multi-Warehouse Inventory**: Extending `inventory` table to support multi-location stock routing across Delhi, Mumbai, and Jaipur ateliers.
