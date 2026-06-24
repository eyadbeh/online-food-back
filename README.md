# Food Express — Backend

AI-powered food ordering platform API built with Node.js, Express, MongoDB, and Socket.IO.

![Node](https://img.shields.io/badge/node-%3E%3D18-green) ![Express](https://img.shields.io/badge/express-5.x-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![License](https://img.shields.io/badge/license-MIT-orange)

---

## Features

- **Authentication** — Email/password registration, Google OAuth, GitHub OAuth, JWT with refresh token rotation
- **Email Verification** — Nodemailer-based email verification on registration (24h expiry)
- **Paymob Payments** — Intention API with Unified Checkout (PCI-DSS compliant), plus COD
- **Real-time Orders** — Socket.IO-powered order status updates and admin notifications
- **AI Assistant** — Gemini-powered chatbot with full menu context (products, categories, FAQs)
- **Admin Dashboard** — Analytics (revenue, orders, top products), user management, audit logs
- **Bilingual (en/ar)** — All content stored in both English and Arabic
- **Delivery Zones** — Polygon-based zone matching with fallback fee calculation
- **Coupons** — Fixed/percentage discounts, usage limits, expiration
- **Wishlist & Reviews** — User favorites and product ratings
- **Audit Logging** — Every admin action tracked with metadata
- **File Upload** — Cloudinary integration via admin upload endpoint
- **Rate Limiting** — 20 req/15min on auth, 100 req/15min general API
- **Guest Cart** — Device-based anonymous cart with merge-on-login

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose ODM |
| Authentication | JWT (access + refresh tokens), Passport.js |
| Validation | Joi |
| Real-time | Socket.IO |
| Payments | Paymob (Intention API) |
| AI | Google Gemini API |
| Email | Nodemailer (SMTP) |
| File Storage | Cloudinary (Multer) |
| Security | Helmet, CORS, bcrypt, rate-limiter |

---

## Architecture

```
Client (React)  ──HTTP──▶  Express API Server  ──Socket.IO──▶  Client
                                │
                     ┌──────────┼──────────────┐
                     ▼          ▼              ▼
                 Routes    Middleware      Sockets
                     │          │
                     ▼          ▼
                Controllers    Validation
                     │
                     ▼
                Services (Business Logic)
                     │
              ┌──────┼──────┐
              ▼      ▼      ▼
           MongoDB  External APIs  Socket.IO Emit
                    (Paymob, Gemini,
                     Cloudinary, SMTP)
```

### Request Flow

```
Request → Route → Middleware (auth, validation, rate-limit, audit) → Controller → Service → DB/External → Response
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Paymob account (test credentials)
- Gemini API key
- Cloudinary account (optional, for file uploads)
- Gmail SMTP app password (for email verification)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file (see `.env.example` for all options):

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/food?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_EMAIL=your@gmail.com
SMTP_PASS=your-app-password

# Paymob
PAYMOB_PUBLIC_KEY=egy_pk_test_...
PAYMOB_SECRET_KEY=egy_sk_test_...
PAYMOB_INTEGRATION_ID=5747409

# Gemini AI
GEMINI_API_KEY=your-gemini-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret

# Frontend (for email links)
FRONTEND_URL=http://localhost:5173
```

### Seed & Run

```bash
# Seed default data (admin, categories, products, zones, settings)
npm run seed

# Development
npm run dev

# Production
npm start
```

### Default Admin

| Email | Password |
|-------|----------|
| admin@electropi.com | Password@123 |

---

## Project Structure

```
backend/
├── src/
│   ├── config/              # DB connection, env config
│   ├── constants/           # Roles, order statuses, audit actions, enums
│   ├── controllers/         # Request handlers (thin — delegates to services)
│   ├── services/            # Business logic layer
│   ├── models/              # Mongoose schemas (17 collections)
│   ├── routes/              # Express routers (18 route files)
│   ├── middlewares/         # Auth, validation, audit, rate-limit, upload, error
│   ├── validations/         # Joi schemas per module
│   ├── utils/               # Email, tokens, API response helpers, IO, catchAsync
│   ├── sockets/             # Socket.IO event handlers
│   ├── seeders/             # Database seed script
│   ├── views/               # (Legacy — removed)
│   ├── app.js               # Express app setup + route registration
│   └── server.js            # HTTP server + Socket.IO bootstrap
├── docs/                    # API documentation (per module)
├── package.json
├── .env
└── README.md
```

---

## API Reference

All endpoints return JSON with the format:
```json
{ "success": true, "message": "...", "data": { ... } }
```

Paginated endpoints also include:
```json
{ "pagination": { "total": 50, "page": 1, "limit": 20, "totalPages": 3 } }
```

### Authentication — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Create account (sends verification email) |
| POST | `/login` | — | Email/password login |
| POST | `/google` | — | Google OAuth (idToken) |
| POST | `/github` | — | GitHub OAuth (code) |
| POST | `/refresh-token` | — | Rotate refresh token |
| POST | `/logout` | Bearer | Invalidate refresh token |
| GET | `/verify-email/:token` | — | Verify email address |
| POST | `/forgot-password` | — | Request password reset email |
| POST | `/reset-password/:token` | — | Reset password with token |
| GET | `/me` | Bearer | Get current user profile |
| PATCH | `/users/:userId/role` | Admin | Change user role |

### Categories — `/api/categories`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List all categories |
| GET | `/:categoryId` | — | Get category by ID |
| POST | `/` | Admin | Create category |
| PUT | `/:categoryId` | Admin | Update category |
| DELETE | `/:categoryId` | Admin | Delete category (blocked if has products) |

### Products — `/api/products`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List products (search, filter, sort, paginate) |
| GET | `/:productId` | — | Get product by ID |
| POST | `/` | Admin | Create product |
| PUT | `/:productId` | Admin | Update product |
| DELETE | `/:productId` | Admin | Delete product |
| PATCH | `/:productId/availability` | Admin | Toggle available status |

**Query params:** `category`, `search`, `featured`, `available`, `minPrice`, `maxPrice`, `tags`, `sort`, `page`, `limit`

### Cart — `/api/cart`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer/Device | Get or create cart |
| POST | `/items` | Bearer/Device | Add item (qty 1–20) |
| PUT | `/items/:productId` | Bearer/Device | Update item quantity |
| DELETE | `/items/:productId` | Bearer/Device | Remove item |
| DELETE | `/` | Bearer/Device | Clear cart |
| POST | `/merge` | Bearer | Merge guest cart into user cart |

**Guest cart:** Send `x-device-id` header for anonymous cart.

### Reviews — `/api/reviews`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List reviews (filter by `product`, `user`) |
| GET | `/:reviewId` | — | Get review by ID |
| POST | `/` | Bearer+Verified | Create review (1 per user per product) |
| PUT | `/:reviewId` | Owner | Update review |
| DELETE | `/:reviewId` | Owner | Delete review |

### Addresses — `/api/addresses`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer | List my addresses |
| GET | `/:addressId` | Bearer | Get address by ID |
| POST | `/` | Bearer | Create address |
| PUT | `/:addressId` | Bearer | Update address |
| PATCH | `/:addressId` | Bearer | Partial update address |
| DELETE | `/:addressId` | Bearer | Delete address |

### Orders — `/api/orders`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Bearer+Verified | Create order (COD or Paymob) |
| GET | `/` | Bearer | List my orders (filter, paginate) |
| GET | `/:orderId` | Bearer | Get order by ID |
| POST | `/:orderId/cancel` | Bearer | Cancel order (if `placed`/`confirmed`) |
| GET | `/admin/all` | Admin | List all orders |
| PATCH | `/:orderId/status` | Admin | Update order status |

**Order body:** `{ addressId, paymentMethod, couponCode?, notes? }`

**Paymob response includes:** `clientSecret`, `checkoutUrl` for Unified Checkout redirect.

### Payments — `/api/payments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/paymob/callback` | — | Paymob webhook (transaction callback) |
| GET | `/paymob/success` | — | Paymob success redirect |
| GET | `/paymob/cancel` | — | Paymob cancel redirect |

### Delivery Zones — `/api/delivery-zones`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List active zones |
| GET | `/:zoneId` | — | Get zone by ID |
| POST | `/` | Admin | Create zone |
| PUT | `/:zoneId` | Admin | Update zone |
| DELETE | `/:zoneId` | Admin | Delete zone |

### Coupons — `/api/coupons`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Admin | List coupons (filter, search, paginate) |
| GET | `/:couponId` | Admin | Get coupon by ID |
| POST | `/` | Admin | Create coupon |
| PUT | `/:couponId` | Admin | Update coupon |
| DELETE | `/:couponId` | Admin | Delete coupon |

**Coupon types:** `fixed` (flat amount) or `percentage` (capped at `maxDiscount`).

### Wishlist — `/api/wishlist`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer | Get my wishlist |
| POST | `/:productId` | Bearer | Add product to wishlist |
| DELETE | `/:productId` | Bearer | Remove from wishlist |

### Notifications — `/api/notifications`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Bearer | List my notifications |
| PATCH | `/:notificationId/read` | Bearer | Mark as read |
| POST | `/read-all` | Bearer | Mark all as read |

### AI Assistant — `/api/ai`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chat` | Bearer | Send message to Gemini AI (context: products, categories, FAQs, settings) |

### Dashboard — `/api/dashboard`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/summary` | Admin | Total orders, revenue, products, users |
| GET | `/revenue-per-day` | Admin | Revenue grouped by day (optional `startDate`/`endDate`) |
| GET | `/top-products` | Admin | Best-selling products (`limit` param, default 10) |

### Settings — `/api/settings`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | Get public settings |
| PUT | `/` | Admin | Update settings (single document) |

### FAQs — `/api/faqs`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List FAQs (filter by `active`) |
| GET | `/:faqId` | — | Get FAQ by ID |
| POST | `/` | Admin | Create FAQ |
| PUT | `/:faqId` | Admin | Update FAQ |
| DELETE | `/:faqId` | Admin | Delete FAQ |

### Audit Logs — `/api/audit-logs`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Admin | List logs (filter: `action`, `entityType`, `user`, `page`, `limit`) |

### File Upload — `/api/upload`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Admin | Upload image (multipart `image` field) → returns Cloudinary URL |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |

---

## Database Collections

| Collection | Key Fields | Purpose |
|-----------|-----------|---------|
| `users` | email, role, provider, emailVerified | Customers & admins |
| `categories` | name (en/ar), image, sortOrder | Product categories |
| `products` | name (en/ar), price, category, discountedPrice | Menu items |
| `carts` | user/guestId, items[], subtotal | Shopping carts |
| `orders` | user, items[], statusHistory, paymentMethod | Customer orders |
| `payments` | order, provider, transactionId, status | Payment records |
| `addresses` | user, street, building, zone, isDefault | Delivery addresses |
| `reviews` | user, product, rating, comment | Product reviews |
| `wishlists` | user, products[] | User favorites |
| `coupons` | code, type, value, usageLimit, expiresAt | Discount coupons |
| `delivery_zones` | name (en/ar), fee, isDefaultFallback | Delivery areas |
| `notifications` | user, title (en/ar), type, read | User notifications |
| `conversations` | user, timestamps | AI chat threads |
| `messages` | conversation, role, content | AI chat messages |
| `faqs` | question (en/ar), answer (en/ar), sortOrder | Help center |
| `settings` | restaurantName (en/ar), aiEnabled, etc. | Single-document config |
| `audit_logs` | user, action, entityType, entityId, metadata | Admin activity trail |

---

## Key Business Flows

### Order Lifecycle

```
placed → confirmed → preparing → out_for_delivery → delivered
placed / confirmed → cancelled
```

### Payment Flow (Paymob)

```
Order Created → Intention API → clientSecret + checkoutUrl → Frontend redirects to Unified Checkout
→ Customer pays on Paymob → Paymob webhook → Payment record created → Order paymentStatus updated
```

### Real-time Events (Socket.IO)

| Event | Direction | Trigger |
|-------|-----------|---------|
| `order_status_updated` | Server → User room | Order status changes |
| `notification_received` | Server → User room | New notification created |
| `new_order` | Server → Admin room | New order placed |

**User room:** `user:<userId>` — user subscribes on connect.
**Admin room:** `admin` — admins subscribe after JWT auth.

### Email Verification Flow

```
Register → sendVerificationEmail() → User clicks link → GET /verify-email/:token
→ Token validated (24h expiry) → emailVerified = true
→ Login blocked with 403 until verified
```

---

## Security

- **Helmet** — HTTP security headers
- **CORS** — Configured origin restrictions
- **Rate Limiting** — 20 req/15min on auth, 100 req/15min on all API
- **JWT** — Short-lived access tokens (15 min) + refresh token rotation (7 days)
- **Password Hashing** — bcrypt with salt rounds
- **Input Validation** — Joi schemas on every endpoint
- **PCI-DSS Compliance** — Card data never touches backend (Paymob Unified Checkout)
- **Audit Trail** — All admin mutations logged with `from`/`to` metadata
- **Authorization** — Role-based access (`admin` / `customer`)
- **Email Verification** — Unverified users blocked from orders and reviews

---

## Testing

The backend is verified via an automated E2E test suite that covers:

Registration → email verification → login → cart → address → COD order → Paymob order → notifications → coupons → dashboard → reviews → AI chat → audit logs → Paymob callbacks

```bash
# Dependencies required for testing
npm install --dev

# Run with MongoDB in-memory (no external DB needed)
node test-e2e.js
```

### API Documentation

Per-module API testing guides with request/response examples are available in [`./docs/api/`](./docs/api/):

| Module | Guide |
|--------|-------|
| Authentication | [01-authentication.md](./docs/api/01-authentication.md) |
| Products & Categories & Reviews | [02-products.md](./docs/api/02-products.md) |
| Cart | [03-cart.md](./docs/api/03-cart.md) |
| Orders & Addresses | [04-orders.md](./docs/api/04-orders.md) |
| Delivery Zones | [05-delivery-zones.md](./docs/api/05-delivery-zones.md) |
| Coupons | [06-coupons.md](./docs/api/06-coupons.md) |
| Notifications | [07-notifications.md](./docs/api/07-notifications.md) |
| AI Assistant | [08-ai-assistant.md](./docs/api/08-ai-assistant.md) |
| Reviews | [09-reviews.md](./docs/api/09-reviews.md) |
| Dashboard & Analytics | [10-dashboard-analytics.md](./docs/api/10-dashboard-analytics.md) |
| Settings | [11-settings.md](./docs/api/11-settings.md) |
| Audit Logs | [12-audit-logs.md](./docs/api/12-audit-logs.md) |
| Cross-cutting Utilities | [14-cross-cutting-utilities.md](./docs/api/14-cross-cutting-utilities.md) |

---

## Related

- [Frontend Repository](https://github.com/your-org/food-frontend) (React app)
- [API Documentation](./docs/api/) (per-module testing guides)
- [Database Schema](./docs/backend/DATABASE_SCHEMA.md)
- [Architecture Documentation](./docs/backend/BACKEND%20ARCHITECTURE%20%E2%80%94%20AI%20FOOD%20ORDERING%20PLATFORM.md)
