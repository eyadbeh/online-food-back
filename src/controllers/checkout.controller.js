const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const checkoutService = require('../services/checkout.service');
const { sendSuccess } = require('../utils/apiResponse');

const serveCheckout = catchAsync(async (req, res) => {
  const { orderId } = req.query;
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).send('Missing or invalid orderId parameter');
  }

  const order = await Order.findById(orderId).lean();
  if (!order) return res.status(404).send('Order not found');
  if (order.paymentMethod !== 'paymob') {
    return res.status(400).send('This order is not a Paymob payment');
  }
  if (!order.paymentKey) {
    return res.status(400).send('Payment key not found for this order');
  }

  let html = fs.readFileSync(path.join(__dirname, '..', 'views', 'paymob-checkout.html'), 'utf-8');
  html = html.replace('{{SUBTOTAL}}', (order.subtotal || 0).toFixed(2));
  html = html.replace('{{DELIVERY_FEE}}', (order.deliveryFee || 0).toFixed(2));
  html = html.replace('{{TOTAL_AMOUNT}}', (order.totalAmount || 0).toFixed(2));
  html = html.replace('{{ORDER_ID}}', orderId);
  html = html.replace('{{PAYMENT_KEY}}', order.paymentKey);

  res.type('html').send(html);
});

const validate = catchAsync(async (req, res) => {
  const result = await checkoutService.validateCheckout(req.user._id, req.body);
  sendSuccess(res, result);
});

module.exports = { serveCheckout, validate };
