const paypal = require('paypal-rest-sdk');
const Payment = require('../models/Payment');

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function initiatePayPalPayment(order) {
  const createPaymentJson = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: `${FRONTEND_URL}/payments/paypal/success?orderId=${order._id}`,
      cancel_url: `${FRONTEND_URL}/payments/paypal/cancel?orderId=${order._id}`,
    },
    transactions: [
      {
        item_list: {
          items: order.items.map((item) => ({
            name: item.product?.name?.en || 'Product',
            sku: item.product?.toString() || 'N/A',
            price: (item.price / item.quantity).toFixed(2),
            currency: 'EGP',
            quantity: item.quantity,
          })),
        },
        amount: { total: order.totalAmount.toFixed(2), currency: 'EGP' },
        description: `Order #${order._id}`,
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(createPaymentJson, (err, payment) => {
      if (err) return reject(err);
      const approvalUrl = payment.links.find((l) => l.rel === 'approval_url')?.href;
      resolve({ paymentId: payment.id, approvalUrl });
    });
  });
}

async function executePayPalPayment(paymentId, payerId, orderId) {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, { payer_id: payerId }, (err, payment) => {
      if (err) return reject(err);
      resolve(payment);
    });
  });
}

async function logPayment({ order, user, provider, transactionId, amount, currency = 'EGP', status, rawResponse }) {
  return Payment.create({ order, user, provider, transactionId, amount, currency, status, rawResponse });
}

module.exports = { initiatePayPalPayment, executePayPalPayment, logPayment };
