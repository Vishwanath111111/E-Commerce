# VASTRADA — Enterprise Full-Stack E-Commerce Platform

> **Project 04 of Portfolio**: A complete, commercial-grade Indian fashion and luxury lifestyle e-commerce platform built with Next.js 16 (App Router), Java 17 Spring Boot 3 REST API, and PostgreSQL.

---

## 🌟 Project Overview

**VASTRADA** (*Artisanal Grace, Modern Elegance*) is a production-ready, full-stack e-commerce system designed for the Indian fashion market. It features a complete **Customer Application**, a protected **Enterprise Admin Panel**, a stateless **Spring Boot REST API**, and a normalized **PostgreSQL Database**.

Unlike landing page prototypes or static frontend mockups, VASTRADA provides end-to-end commercial operations:
- **Authoritative Backend Pricing & Taxes**: Cart & Order totals, 5% fashion GST, and delivery thresholds calculated strictly by Spring Boot.
- **Stock Guard & Inventory Reservation**: Prevents overselling, tracks low-stock thresholds per variant SKU, and auto-restores stock on cancellations.
- **Role-Based JWT Security**: Stateless authentication protecting customer accounts and restricting admin capabilities (`/api/v1/admin/**`).
- **Verified Review Moderation**: Reviews restricted to authenticated customers with verified purchase indicators.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Backend REST API** | Java 17, Spring Boot 3.2.5, Maven |
| **Security & Auth** | Spring Security 6, JWT (HMAC-SHA256), BCrypt |
| **ORM & Persistence** | Spring Data JPA, Hibernate, Bean Validation |
| **Database** | PostgreSQL (Production) / H2 (Development fallback) |
| **SEO & Microdata** | Schema.org JSON-LD, Dynamic OpenGraph, Sitemap & Robots.txt |

---

## 📁 Repository Structure

```
04-e-commerce/
├── frontend/                     # Next.js 16 App Router Customer + Admin Frontend
│   ├── public/                   # Static images, assets
│   ├── src/
│   │   ├── app/                  # Customer routes & Admin routes
│   │   │   ├── (customer)/       # /, /products, /products/[slug], /cart, /checkout, etc.
│   │   │   └── admin/            # /admin/dashboard, /admin/products, /admin/inventory, etc.
│   │   ├── components/           # Navbar, Footer, ProductCard, FilterSidebar, AdminSidebar
│   │   ├── context/              # AuthContext, CartContext, WishlistContext
│   │   ├── lib/                  # API client & INR (₹) formatters
│   │   └── types/                # TypeScript interfaces
│   └── package.json
│
├── backend/                      # Java Spring Boot REST API
│   ├── mvnw & mvnw.cmd           # Maven wrapper scripts
│   ├── pom.xml                   # Maven dependencies & build config
│   ├── src/
│   │   ├── main/java/com/vastrada/
│   │   │   ├── config/           # SecurityConfig, JwtUtils, CorsConfig
│   │   │   ├── controller/       # Auth, Product, Cart, Order, Review, Admin Controllers
│   │   │   ├── dto/              # Request/Response Data Transfer Objects
│   │   │   ├── entity/           # 18 Normalized JPA Entities
│   │   │   ├── exception/        # GlobalExceptionHandler
│   │   │   ├── repository/       # Spring Data Repositories
│   │   │   ├── service/          # Business logic implementations
│   │   │   └── util/             # SeedDataInitializer
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── schema.sql        # Raw PostgreSQL DDL Schema
│
├── README.md                     # Technical documentation & setup guide
├── portfolio_documentation.md    # Comprehensive enterprise portfolio report
└── .gitignore                    # Version control exclusion rules
```

---

## 🚀 Quick Setup & Execution

### Prerequisites
- **Node.js** `v18+` & `npm`
- **Java 17 LTS**
- **PostgreSQL** (Optional; backend defaults to H2 PostgreSQL mode for zero-setup execution)

---

### Running Backend REST API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Execute the Spring Boot application using Maven Wrapper:
   ```bash
   # On Windows:
   .\mvnw.cmd spring-boot:run

   # On Linux/macOS:
   ./mvnw spring-boot:run
   ```
3. The API server will start on `http://localhost:8080` and automatically seed realistic Indian products, categories, stock, and default credentials.

#### Default Demo Credentials:
- **Admin User**: `admin@vastrada.in` | Password: `Admin@123456`
- **Customer User**: `customer@vastrada.in` | Password: `Customer@123456`

---

### Running Frontend Application

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your web browser.

---

## 🔐 Environment Variables

Create `.env.local` inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Set environment variables in production backend (`application-prod.yml`):
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/vastrada_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password
```

---

## 📊 Business & Technical Features

### Customer Application
- **Commercial Homepage**: Hero banner, category showcases, new arrivals, bestsellers, customer testimonials, newsletter.
- **Product Filtering & Search**: Multi-faceted filter by price in ₹, size, color, rating, category, and sorting (Newest, Price Low-High, High-Low, Most Popular).
- **Product Detail**: Multi-angle image gallery, size/color variant selector, live stock availability guard, verified buyer reviews, and related products.
- **Authoritative Shopping Cart**: Backend calculated subtotal, 5% GST, free delivery above ₹1,999, and live cart persistence.
- **5-Step Checkout**: Customer details, address, order summary, COD & Mock payment abstractions, order confirmation.
- **Account & Tracking**: Real-time status pipeline tracking (`PENDING` -> `CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).

### Protected Admin Panel (`/admin/*`)
- **Dashboard Analytics**: Gross revenue in ₹, total orders, active customer count, pending dispatches, low-stock alerts, bestsellers.
- **Product & Category CRUD**: Modal form creation, pricing/discount updates, image management, status toggles.
- **Inventory Replenishment**: Low-stock threshold alerts and variant stock level management.
- **Order Dispatch Management**: Sequential order status transition updates and tracking number assignment.
- **Review Moderation**: Approve or reject customer reviews.
- **Exportable Reports**: CSV downloads for sales, inventory audits, and customer ledgers.

---

## 🛡️ Testing & Build Verification

- **Backend Compile & Test**:
  ```bash
  cd backend
  .\mvnw.cmd test-compile
  ```
- **Frontend Production Build**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 📄 License & Attribution

Developed by **VJ Web Studio** as part of Professional Software Portfolio Project 04. All rights reserved.
