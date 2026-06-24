const crypto = require('crypto');
const Payment = require('../models/Payment');
const ApiError = require('../utils/apiError');

const INTENTION_API = 'https://accept.paymob.com/v1/intention/';
const PAYMOB_BASE = 'https://accept.paymob.com';
const SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
const PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
const INTEGRATION_ID = parseInt(process.env.PAYMOB_INTEGRATION_ID);
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function createIntention(order, billingData) {
  const deliveryFee = order.deliveryFee || 0;
  const subtotal = order.subtotal || (order.totalAmount - deliveryFee);
  const amount = Math.round(order.totalAmount);

  const items = order.items.map((i) => ({
    name: i.product?.name?.en || 'Item',
    amount: Math.round(i.price),
    quantity: i.quantity,
  }));

  const itemSum = items.reduce((s, i) => s + i.amount * i.quantity, 0);

  if (deliveryFee > 0) {
    items.push({
      name: 'Delivery Fee',
      amount: Math.round(deliveryFee),
      quantity: 1,
    });
  }

  const res = await fetch(INTENTION_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + SECRET_KEY,
    },
    body: JSON.stringify({
      amount,
      currency: 'EGP',
      payment_methods: [INTEGRATION_ID],
      special_reference: order._id.toString(),
      billing_data: {
        first_name: billingData.firstName || billingData.first_name || 'Customer',
        last_name: billingData.lastName || billingData.last_name || 'Name',
        email: billingData.email || 'customer@example.com',
        phone_number: billingData.phone || billingData.phone_number || '0000000000',
        street: billingData.street || 'N/A',
        building: billingData.building || 'N/A',
        apartment: billingData.apartment || 'N/A',
        floor: billingData.floor || 'N/A',
        city: billingData.city || 'Cairo',
        country: billingData.country || 'EG',
      },
      items,
      redirection_url: `${BACKEND_URL}/api/payments/paymob/success?orderId=${order._id}`,
      cancel_url: `${BACKEND_URL}/api/payments/paymob/cancel?orderId=${order._id}`,
    }),
  });

  const data = await res.json();
  if (!data.client_secret) throw new ApiError(500, `Paymob Intention API failed: ${JSON.stringify(data)}`);

  const paymentKey = data.payment_keys?.[0]?.key || data.client_secret;
  const clientSecret = data.client_secret;
  const hostedCheckoutUrl = `${PAYMOB_BASE}/unifiedcheckout/?publicKey=${PUBLIC_KEY}&clientSecret=${clientSecret}`;

  return {
    clientSecret,
    paymentKey,
    checkoutUrl: hostedCheckoutUrl,
    intentionId: data.id,
    intentionOrderId: data.intention_order_id,
  };
}

function verifyCallback(body) {
  const obj = body.obj || body;
  const receivedHmac = obj.hmac;
  if (!receivedHmac) return false;

  const orderVal = obj.order && typeof obj.order === 'object' ? obj.order.id : obj.order;

  const raw = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    orderVal,
    obj.owner,
    obj.pending,
    obj.source_data_pan,
    obj.source_data_sub_type,
    obj.source_data_type,
    obj.success,
    obj.txn_response_code,
  ];

  const stringToHash = raw.map((v) => (v === undefined || v === null ? '' : String(v))).join('');
  const computed = crypto.createHmac('sha256', SECRET_KEY).update(stringToHash).digest('hex');
  return computed === receivedHmac;
}

async function logPayment({ order, user, provider, transactionId, amount, currency = 'EGP', status, rawResponse }) {
  return Payment.create({ order, user, provider, transactionId, amount, currency, status, rawResponse });
}

module.exports = { createIntention, verifyCallback, logPayment };
