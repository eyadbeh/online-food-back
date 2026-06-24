# DATABASE_SCHEMA.md

## Project

AI-Powered Online Food Ordering Platform

---

# Database Overview

Database Type:

```text
MongoDB Atlas
```

ODM:

```text
Mongoose
```

Architecture:

```text
Single Restaurant Architecture
```

Roles:

```text
Admin
Customer
```

Languages:

```text
English
Arabic
```

---

# Collections

1. users
2. categories
3. products
4. carts
5. orders
6. payments
7. notifications
8. conversations
9. messages
10. audit_logs
11. wishlists
12. addresses
13. reviews
14. coupons
15. settings
16. delivery_zones
17. faqs

---

# USERS COLLECTION

Purpose:

Store customers and administrators.

Schema:

```javascript
{
    _id: ObjectId,

    firstName: String,
    lastName: String,

    email: {
        type: String,
        unique: true
    },

    phone: String,

    password: String,

    avatar: String,

    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer"
    },

    provider: {
        type: String,
        enum: [
            "local",
            "google",
            "github"
        ],
        default: "local"
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    refreshToken: String,

    lastLoginAt: Date,

    active: {
        type: Boolean,
        default: true
    },

    createdAt: Date,
    updatedAt: Date
}
```

Indexes:

```text
email unique
role
```

---

# CATEGORIES COLLECTION

Schema:

```javascript
{
    _id: ObjectId,

    name: {
        en: String,
        ar: String
    },

    image: String,

    active: Boolean,

    sortOrder: Number,

    createdAt: Date,
    updatedAt: Date
}
```

---

# PRODUCTS COLLECTION

Schema:

```javascript
{
    _id: ObjectId,

    category: ObjectId,

    name: {
        en: String,
        ar: String
    },

    description: {
        en: String,
        ar: String
    },

    image: String,

    gallery: [String],

    price: Number,

    discountedPrice: Number,

    averageRating: {
        type: Number,
        default: 0
    },

    reviewCount: {
        type: Number,
        default: 0
    },

    featured: {
        type: Boolean,
        default: false
    },

    available: {
        type: Boolean,
        default: true
    },

    tags: [String],

    createdAt: Date,
    updatedAt: Date
}
```

Indexes:

```text
category
featured
available
price
```

---

# CARTS COLLECTION

One Cart Per User

Schema:

```javascript
{
    user: ObjectId,

    items: [
        {
            product: ObjectId,

            quantity: Number,

            unitPrice: Number,

            totalPrice: Number
        }
    ],

    subtotal: Number,

    updatedAt: Date
}
```

---

# DELIVERY_ZONES COLLECTION

Schema:

```javascript
{
    name: {
        en: String,
        ar: String
    },

    fee: Number,

    estimatedMinutes: Number,

    active: Boolean,

    isDefaultFallback: {
        type: Boolean,
        default: false
    },

    createdAt: Date,
    updatedAt: Date
}
```

Business Rule:

```text
Exactly ONE zone must be marked as default fallback.

Fallback zone should have highest delivery fee.
```

---

# ADDRESSES COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    title: String,

    phone: String,

    street: String,

    building: String,

    floor: String,

    apartment: String,

    notes: String,

    zone: ObjectId,

    isDefault: Boolean,

    createdAt: Date,
    updatedAt: Date
}
```

---

# COUPONS COLLECTION

Schema:

```javascript
{
    code: String,

    type: {
        type: String,
        enum: [
            "fixed",
            "percentage"
        ]
    },

    value: Number,

    maxDiscount: Number,

    minOrderAmount: Number,

    usageLimit: Number,

    usedCount: Number,

    active: Boolean,

    expiresAt: Date,

    createdAt: Date,
    updatedAt: Date
}
```

---

# ORDERS COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    address: ObjectId,

    items: [
        {
            product: ObjectId,

            quantity: Number,

            price: Number
        }
    ],

    subtotal: Number,

    deliveryFee: Number,

    discountAmount: Number,

    totalAmount: Number,

    coupon: ObjectId,

    paymentMethod: {
        type: String,
        enum: [
            "cod",
            "paymob"
        ]
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed"
        ]
    },

    orderStatus: {
        type: String,
        enum: [
            "placed",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ]
    },

    statusHistory: [
        {
            status: String,
            changedAt: Date
        }
    ],

    notes: String,

    createdAt: Date,
    updatedAt: Date
}
```

---

# PAYMENTS COLLECTION

Schema:

```javascript
{
    order: ObjectId,

    user: ObjectId,

    provider: String,

    transactionId: String,

    amount: Number,

    currency: String,

    status: String,

    rawResponse: Object,

    createdAt: Date
}
```

---

# REVIEWS COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    product: ObjectId,

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    comment: String,

    createdAt: Date,
    updatedAt: Date
}
```

Business Rule:

```text
One review per user per product.
```

---

# WISHLISTS COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    products: [ObjectId],

    updatedAt: Date
}
```

---

# NOTIFICATIONS COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    title: {
        en: String,
        ar: String
    },

    message: {
        en: String,
        ar: String
    },

    type: String,

    read: Boolean,

    createdAt: Date
}
```

---

# CONVERSATIONS COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    createdAt: Date,
    updatedAt: Date
}
```

---

# MESSAGES COLLECTION

Schema:

```javascript
{
    conversation: ObjectId,

    role: {
        type: String,
        enum: [
            "user",
            "assistant"
        ]
    },

    content: String,

    createdAt: Date
}
```

---

# FAQS COLLECTION

Schema:

```javascript
{
    question: {
        en: String,
        ar: String
    },

    answer: {
        en: String,
        ar: String
    },

    active: Boolean,

    sortOrder: Number,

    createdAt: Date,
    updatedAt: Date
}
```

---

# SETTINGS COLLECTION

Single Document Collection

Schema:

```javascript
{
    restaurantName: {
        en: String,
        ar: String
    },

    logo: String,

    supportEmail: String,

    supportPhone: String,

    facebookUrl: String,

    instagramUrl: String,

    tiktokUrl: String,

    twitterUrl: String,

    workingHours: String,

    currency: String,

    defaultLanguage: String,

    aiEnabled: Boolean,

    updatedAt: Date
}
```

---

# AUDIT_LOGS COLLECTION

Schema:

```javascript
{
    user: ObjectId,

    action: String,

    entityType: String,

    entityId: ObjectId,

    metadata: Object,

    createdAt: Date
}
```

Examples:

```text
Product Created
Product Deleted
Order Status Updated
Coupon Created
Zone Updated
User Role Updated
```

---

# Analytics Requirements

Dashboard Cards:

```text
Total Orders

Total Revenue

Products Count

Users Count
```

Charts:

```text
Revenue Per Day

Orders Per Day

Order Status Distribution

Top Selling Products
```

---

# Seeder Requirements

Default Admin

```text
admin@electropi.com
Password@123
```

Default Categories:

```text
Pizza
Burgers
Sandwiches
Drinks
Desserts
```

Default Delivery Zones:

```text
Maadi
Nasr City
Heliopolis
Default Fallback Zone
```
