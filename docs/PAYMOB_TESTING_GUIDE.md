# Paymob Testing Guide (Beginner-Friendly)

## What You'll Need

- **ngrok** — exposes your local server to the internet so Paymob can send webhooks
- **Paymob test credentials** — already in your `.env` file
- **A test card number** — Paymob test environment accepts specific test cards

---

## Step 1: Install ngrok

1. Go to https://ngrok.com/download
2. Download the Windows version (zip file)
3. Extract `ngrok.exe` to a folder (e.g. `C:\ngrok`)
4. Add that folder to your PATH:
   - Press `Win + R`, type `sysdm.cpl`
   - Go to **Advanced** tab → **Environment Variables**
   - Under **System variables**, find `Path`, click **Edit**
   - Click **New**, add `C:\ngrok`, click **OK** all the way
5. Verify installation:
   ```powershell
   ngrok version
   ```
   You should see something like `ngrok version 3.x.x`

---

## Step 2: Start Your Backend + ngrok

Open **two PowerShell terminals** side by side:

### Terminal 1: Start the backend
```powershell
cd D:\food\backend
npm run dev
```
You should see: `Server running on port 5000` and `MongoDB connected`

### Terminal 2: Start ngrok
```powershell
ngrok http 5000
```
You should see something like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:5000
```
**Copy that `https://abc123.ngrok-free.app` URL** — you'll need it.

---

## Step 3: Update .env with the ngrok URL

Open `D:\food\backend\.env` and change:
```env
BACKEND_URL=https://abc123.ngrok-free.app
```
(Replace `abc123` with your actual ngrok URL)

Then **restart your backend** (Ctrl+C in Terminal 1, then `npm run dev` again).

---

## Step 4: Test the Flow with Postman or curl

### 4a. Login as customer
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@food.com",
  "password": "Test123!"
}
```
Save the `accessToken` from the response — you'll use it in the next steps.

### 4b. Get your address ID
```http
GET http://localhost:5000/api/addresses
Authorization: Bearer <token>
```
Copy one address `_id` value.

### 4c. Create a Paymob order
```http
POST http://localhost:5000/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": "<address_id_from_step_4b>",
  "paymentMethod": "paymob"
}
```

**Success response** should look like:
```json
{
  "success": true,
  "data": {
    "order": { ... },
    "clientSecret": "paymob_client_secret_value",
    "checkoutUrl": "https://accept.paymob.com/unifiedcheckout/?public_key=...&client_secret=..."
  }
}
```

### 4d. Open the checkout URL in your browser
Copy the `checkoutUrl` value and paste it into your browser. You'll see Paymob's hosted checkout page.

---

## Step 5: Complete Payment with Test Card

On the Paymob checkout page, use these **test card details**:

| Field | Value |
|-------|-------|
| Card Number | `5123456789012346` |
| Expiry | Any future date (e.g. `12/28`) |
| CVV | Any 3 digits (e.g. `123`) |
| Cardholder Name | Any name |

After submitting, Paymob will:
1. Process the payment (in test mode, it always succeeds with this card)
2. Send a **webhook callback** to your ngrok URL: `https://abc123.ngrok-free.app/api/payments/paymob/callback`
3. Redirect you back to `http://localhost:5173/payments/paymob/success?orderId=...`

---

## Step 6: Verify Everything Worked

### Check the order in your database
```http
GET http://localhost:5000/api/orders/<order_id>
Authorization: Bearer <token>
```
The `paymentStatus` should now be `"paid"`.

### Check the webhook was received
Look at **Terminal 1** (backend logs). You should see:
```
POST /api/payments/paymob/callback 200 ...
```
If you see `Paymob callback HMAC verification failed`, the webhook arrived but HMAC didn't verify — check that `PAYMOB_SECRET_KEY` in `.env` is correct.

### Check the Payment record
Paymob creates a `Payment` document in the database. You can check it via:
```http
GET http://localhost:5000/api/audit-logs
Authorization: Bearer <admin_token>
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Paymob intention failed` | Check your `PAYMOB_API_KEY` in `.env` — make sure it's the full base64 string with no spaces or line breaks |
| `Paymob payment initiation failed` | ngrok might not be running, or `BACKEND_URL` is wrong in `.env` — check and restart backend |
| Webhook `HMAC verification failed` | Make sure `PAYMOB_SECRET_KEY` matches the one in your Paymob dashboard (Settings → API Keys) |
| Checkout page shows error | Your `PAYMOB_INTEGRATION_ID` might be wrong — double-check it's the numeric ID from Paymob dashboard |
| ngrok shows `ERR_NGROK_6024` | Your ngrok account might need authentication. Run `ngrok config add-authtoken YOUR_TOKEN` (get token from https://dashboard.ngrok.com) |
| Cart is empty when creating order | Add items to cart first: `POST /api/cart/items` with `{ "product": "<product_id>", "quantity": 1 }` |

---

## Quick Reference: Paymob Test Cards

| Card Number | Type | Result |
|-------------|------|--------|
| `5123456789012346` | Mastercard (Test) | Always succeeds |
| `4000056655665556` | Visa (Test) | Always succeeds |
| `5200000000000007` | Mastercard (3D Secure) | Requires 3D Secure authentication |

---

## Testing Without ngrok (Skip Webhooks)

If you don't want to set up ngrok, you can still test the **intention creation** part:

1. Create a Paymob order (Step 4c) — you'll get a `checkoutUrl`
2. Open the checkout URL in your browser
3. Complete payment with test card
4. Paymob will try to call your webhook but fail (because localhost isn't reachable)
5. The order's `paymentStatus` remains `"pending"`
6. You can manually update it via admin: `PATCH /api/orders/<id>/status`

This tests the frontend flow but won't automatically update the order status.
