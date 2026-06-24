# FINAL INTEGRATION & VERIFICATION PHASE

Before considering the backend implementation complete, perform a full-system verification.

## Cross-Module Validation

Verify that every module is correctly connected to all dependent modules.

### Authentication

- User registration creates valid user records.
- Login works with email/password.
- Google OAuth works correctly.
- GitHub OAuth works correctly.
- Refresh token flow works correctly.
- Email verification updates user status.
- Forgot password flow updates password successfully.

### Users

- Users can create orders.
- Users can create reviews.
- Users can manage addresses.
- Users can manage favorites.
- Users can receive notifications.

### Products

- Products are linked to categories.
- Products appear correctly in search and filtering.
- Product ratings are recalculated when reviews change.

### Cart

- Cart items reference valid products.
- Cart subtotal is recalculated automatically.
- Cart converts correctly into orders.

### Orders

- Orders correctly reference:
  - User
  - Address
  - Products
  - Coupon
  - Payment

- Order status changes update:
  - Notifications
  - Audit Logs
  - Socket.IO Events

### Delivery Zones

- Address zone correctly determines delivery fee.
- Fallback zone is applied when no matching zone exists.

### Coupons

- Coupon validation works.
- Expiration works.
- Usage limits work.

### Payments

- COD orders work correctly.
- Paymob payment flow updates payment status.
- Successful payments update order status.

### Notifications

- Notifications are stored in database.
- Notifications are emitted through Socket.IO.
- Read/unread status works correctly.

### AI Assistant

- AI can access:
  - Products
  - Categories
  - FAQs
  - Settings

- Conversations are stored.
- Messages are stored.

### Admin Dashboard

- Analytics data matches database records.
- User management works.
- Product management works.
- Order management works.
- Coupon management works.
- Delivery zone management works.
- FAQ management works.

### Audit Logs

Verify that all admin actions generate audit logs.

Examples:

- Product Created
- Product Updated
- Product Deleted
- Coupon Created
- Coupon Updated
- Order Status Changed
- User Status Changed
- Zone Updated

---

# API Verification

Verify that:

- Every route exists.
- Every controller exists.
- Every service exists.
- Every validation schema exists.
- Every model exists.
- Every route is registered in Express.

No endpoint should reference missing files.

---

# Database Verification

Verify that:

- All collections exist.
- All indexes exist.
- All references use valid ObjectIds.
- All relationships are populated correctly.
- Seed script runs successfully.

---

# Security Verification

Verify that:

- Passwords are hashed.
- JWT verification works.
- Protected routes require authentication.
- Admin routes require admin role.
- Sensitive fields are not exposed in API responses.

---

# Code Quality Verification

Verify that:

- No business logic exists inside routes.
- No business logic exists inside controllers.
- Business logic exists only in services.
- No duplicated code exists.
- All async operations use async/await.
- Proper error handling exists everywhere.

---

# Final System Test

Run a complete end-to-end scenario:

1. Register user
2. Verify email
3. Login
4. Browse products
5. Add to cart
6. Apply coupon
7. Select address
8. Create order
9. Pay using Paymob
10. Receive notification
11. Track order status
12. Admin updates order
13. Customer receives realtime update
14. Audit logs created
15. Analytics updated

All steps must succeed without errors.

---

# AI Self-Review Instruction

After implementation is complete:

Perform a full codebase audit.

Review every model, route, controller, service, middleware, validation schema, socket event, database relation, environment variable, and API endpoint.

Detect and fix:

- Missing imports
- Missing exports
- Broken references
- Circular dependencies
- Invalid database relations
- Missing route registrations
- Validation mismatches
- Authentication issues
- Authorization issues
- Unused code
- Dead code
- Runtime errors
- Inconsistent naming
- Schema inconsistencies

Ensure the entire backend functions as one integrated system.

Do not assume anything is correct.
Verify every connection explicitly.
Refactor where necessary.
Only finish when the backend is fully connected, consistent, and production-ready.
