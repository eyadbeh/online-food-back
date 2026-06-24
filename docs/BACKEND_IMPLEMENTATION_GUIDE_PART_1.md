# BACKEND_IMPLEMENTATION_GUIDE_PART_1.md

## Mission

Build the complete backend foundation for an AI-Powered Food Ordering Platform using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Joi
- Socket.IO (setup only for now)

The implementation must be production-ready, modular, scalable, and follow clean architecture principles.

---

# Folder Structure

Create exactly this structure:

backend/

src/

config/
controllers/
middlewares/
models/
routes/
services/
validations/
sockets/
utils/
seeders/
constants/

app.js
server.js

.env.example

---

# Database Configuration

Create:

src/config/database.js

Requirements:

- Connect using mongoose
- Read MONGODB_URI from environment
- Exit process on failed connection
- Export connectDatabase()

---

# Express Application

Create:

src/app.js

Requirements:

- express
- cors
- helmet
- compression
- morgan
- cookie-parser

Global Middlewares:

- express.json()
- express.urlencoded()

Health Endpoint:

GET /api/health

Response:

{
"success": true,
"message": "API is running"
}

---

# Server Bootstrap

Create:

src/server.js

Requirements:

- Load environment variables
- Connect MongoDB
- Start Express Server
- Create Socket.IO instance
- Export io instance

---

# Base Schema Rules

Every schema must:

- use timestamps
- export mongoose model
- use proper indexes
- include validation
- include comments

---

# Models

Create the following models.

---

## User Model

Fields:

- firstName
- lastName
- email (unique)
- phone
- password
- avatar
- role

Enum:

admin
customer

provider:

local
google
github

emailVerified
refreshToken
lastLoginAt
active

Indexes:

email
role

---

## Category Model

Fields:

name.en
name.ar

image

active

sortOrder

---

## Product Model

Fields:

category

name.en
name.ar

description.en
description.ar

image

gallery[]

price

discountedPrice

averageRating

reviewCount

featured

available

tags[]

Indexes:

category
featured
available
price

---

## Cart Model

Fields:

user

items[]

product
quantity
unitPrice
totalPrice

subtotal

---

## DeliveryZone Model

Fields:

name.en
name.ar

fee

estimatedMinutes

active

isDefaultFallback

Rule:

Only one fallback zone allowed.

---

## Address Model

Fields:

user

title
phone

street
building
floor
apartment

notes

zone

isDefault

---

## Coupon Model

Fields:

code

type

Enum:

fixed
percentage

value

maxDiscount

minOrderAmount

usageLimit

usedCount

active

expiresAt

---

## Order Model

Fields:

user
address

items[]

subtotal

deliveryFee

discountAmount

totalAmount

coupon

paymentMethod

Enum:

cod
paymob

paymentStatus

Enum:

pending
paid
failed

orderStatus

Enum:

placed
confirmed
preparing
out_for_delivery
delivered
cancelled

statusHistory[]

notes

Indexes:

user
orderStatus
createdAt

---

## Payment Model

Fields:

order

user

provider

transactionId

amount

currency

status

rawResponse

---

## Review Model

Fields:

user

product

rating

1-5

comment

Rule:

One review per user per product

Compound Index:

user + product unique

---

## Wishlist Model

Fields:

user

products[]

---

## Notification Model

Fields:

user

title.en
title.ar

message.en
message.ar

type

read

---

## Conversation Model

Fields:

user

---

## Message Model

Fields:

conversation

role

Enum:

user
assistant

content

---

## FAQ Model

Fields:

question.en
question.ar

answer.en
answer.ar

active

sortOrder

---

## Setting Model

Single document collection.

Fields:

restaurantName.en
restaurantName.ar

logo

supportEmail

supportPhone

facebookUrl
instagramUrl
twitterUrl
tiktokUrl

workingHours

currency

defaultLanguage

aiEnabled

---

## AuditLog Model

Fields:

user

action

entityType

entityId

metadata

---

# Seeders

Create:

src/seeders/seed.js

Requirements:

Connect database

Delete old seed data

Insert:

Admin User

Email:
[admin@electropi.com](mailto:admin@electropi.com)

Password:
Password@123

Role:
admin

Hash password with bcrypt.

---

Create Categories:

Pizza
Burgers
Sandwiches
Drinks
Desserts

English and Arabic.

---

Create Delivery Zones:

Maadi
Nasr City
Heliopolis

Default Fallback Zone

Fee:
50

isDefaultFallback:
true

---

Create Settings Document

Restaurant Name:

Electro Food

Currency:

EGP

AI Enabled:

true

---

Create 15 Products

Distributed among categories.

Use realistic prices.

Use placeholder Cloudinary image URLs.

---

# Package.json Scripts

Add:

"dev": "nodemon src/server.js"

"start": "node src/server.js"

"seed": "node src/seeders/seed.js"

---

# Validation

Every schema must include:

- required validation
- enum validation
- default values

---

# Code Quality Rules

- CommonJS syntax
- Modular architecture
- Clean code
- No duplicated code
- Use async/await
- Proper error handling
- Production-ready naming

---

# Deliverables

Generate all files completely.

Do not leave TODOs.

Do not generate pseudocode.

Generate working code only.
