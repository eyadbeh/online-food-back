# 🚀 BACKEND ARCHITECTURE — AI FOOD ORDERING PLATFORM

## 📌 Project Type

Single Restaurant AI-Powered Food Ordering System  
Architecture Style: Modular Monolith (AI-First Design)

---

# 🧠 1. SYSTEM OVERVIEW

This backend is designed as a production-ready, AI-driven food ordering platform supporting:

- Full authentication system (Email/Google/GitHub)
- Real-time order tracking
- AI chatbot (Gemini-powered)
- Payment integration (Paymob + COD)
- Admin dashboard APIs
- Delivery zones & dynamic pricing
- Notifications system
- Audit logs for admin actions

---

# ⚙️ 2. TECH STACK

- Node.js (LTS)
- Express.js
- MongoDB + Mongoose
- Socket.IO (Realtime)
- JWT Authentication
- Passport.js (OAuth)
- Joi (Validation)
- Cloudinary (Media)
- Paymob (Payments)
- Nodemailer (Email)
- Gemini API (AI Assistant)
- Bcrypt (Security)

---

# 🏗️ 3. HIGH LEVEL ARCHITECTURE

Client (React Frontend)
↓
Express API Server
↓
Routes Layer
↓
Controllers Layer
↓
Services Layer (Business Logic)
↓
MongoDB Database
↓
External Services:

- Cloudinary
- Paymob
- OAuth Providers
- Gemini AI
- Email Service
- Socket.IO

---

# 🔁 4. REQUEST FLOW

1. Client sends request
2. Route receives request
3. Middleware validates/authenticates
4. Controller handles request
5. Service executes business logic
6. Database queried/updated
7. Response returned

---

# 📦 5. PROJECT STRUCTURE

backend/
└── src/
├── config/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── validations/
├── utils/
├── sockets/
├── seeders/
├── constants/
├── jobs/
├── app.js
├── server.js

---

# 🔐 6. AUTHENTICATION SYSTEM

## Supported Methods:

- Email/Password
- Google OAuth
- GitHub OAuth
- JWT Access Token
- Refresh Token

---

## Auth Flow:

User Login/Register
→ Validate Input
→ Check User
→ Hash Password
→ Generate Tokens
→ Store Refresh Token
→ Return Access Token

---

## Token Strategy:

- Access Token → short-lived (15 min)
- Refresh Token → long-lived (7 days)

---

## Roles:

- admin
- customer

---

# 🛒 7. ORDER SYSTEM

## Order Lifecycle:

created → confirmed → preparing → out_for_delivery → delivered → cancelled

---

## Flow:

Cart → Checkout → Coupon → Delivery Fee → Order Creation → Payment → Notification

---

# 🚚 8. DELIVERY ZONES SYSTEM

## Logic:

User Address → Zone Matching → Fee Calculation

## Fallback Rule:

If no zone found → apply DEFAULT zone (highest fee)

---

# 💳 9. PAYMENT SYSTEM

Supported Methods:

- Cash on Delivery
- Paymob

Flow:
Order Created → Payment Initiated → Callback → Update Order Status

---

# 🤖 10. AI CHATBOT SYSTEM

Powered by Gemini API

## AI Context Includes:

- Products
- Prices
- Categories
- FAQs
- Availability

## Flow:

User Message → Fetch DB Context → Build Prompt → Gemini API → Response → Store Chat

---

# 🔌 11. REALTIME SYSTEM (SOCKET.IO)

## Events:

Customer:

- order_status_updated
- notification_received

Admin:

- new_order
- system_alert

---

# 🔔 12. NOTIFICATIONS SYSTEM

- Stored in DB
- Real-time via Socket.IO
- Mark as read/unread
- Triggered by system events

---

# 📜 13. AUDIT LOG SYSTEM

Tracks admin actions:

- PRODUCT_CREATED
- ORDER_UPDATED
- USER_ROLE_CHANGED
- COUPON_CREATED
- ZONE_UPDATED

---

# ☁️ 14. FILE UPLOAD SYSTEM

Provider: Cloudinary

Flow:
Client → Multer → Cloudinary → Store URL in DB

---

# 🧪 15. VALIDATION SYSTEM

- Joi-based validation
- Central error handler
- Request sanitization

---

# 🛡️ 16. SECURITY LAYERS

- Helmet
- CORS
- Rate Limiting
- JWT Protection
- Password Hashing
- Input Validation

---

# 🗄️ 17. DATABASE DESIGN STRATEGY

## Core Collections:

- users
- products
- orders
- carts

## Supporting:

- notifications
- audit_logs
- settings
- coupons
- delivery_zones

## AI System:

- conversations
- messages
- faqs

---

# 📊 18. INDEXING STRATEGY

- users.email (unique)
- orders.status
- products.category
- createdAt indexes

---

# 🌱 19. SEEDING SYSTEM

Seeds:

- Admin User
- Categories
- Products
- Delivery Zones
- Settings

Rule:
Seeder must be idempotent (safe to re-run)

---

# ⚙️ 20. ENVIRONMENT VARIABLES

MONGODB_URI  
JWT_SECRET  
JWT_REFRESH_SECRET  
GOOGLE_CLIENT_ID  
GITHUB_CLIENT_ID  
GEMINI_API_KEY  
PAYMOB_API_KEY  
CLOUDINARY_CONFIG  
EMAIL_CONFIG

---

# 🚀 21. DEPLOYMENT READINESS

- Stateless API
- Environment-based config
- Scalable modular structure
- Production-safe logging

---

# 🤖 22. AI AGENT RULES

Any AI code generator must:

- Never skip validation
- Never put logic in controllers
- Always use services layer
- Follow folder structure strictly
- Never hardcode secrets
- Always handle errors properly

---

# 🧩 23. SYSTEM SUMMARY

This backend is:

AI-driven Modular Monolith Architecture  
with Full Authentication + Realtime + Payments + AI Assistant + Admin Dashboard APIs

---

# 🔥 READY FOR IMPLEMENTATION
