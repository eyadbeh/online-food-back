const mongoose = require('mongoose');
const Order = require('../models/Order');
const { verifyCallback, logPayment } = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const { getIO } = require('../utils/io');

const paymobCallback = catchAsync(async (req, res) => {
  const body = req.body;
  const obj = body.obj || body;

  const isValid = verifyCallback(body);
  if (!isValid) {
    console.warn('Paymob callback HMAC verification failed', obj.id);
    return sendSuccess(res, null, 'Callback acknowledged');
  }

  const orderRef = obj.special_reference || obj.order?.special_reference || obj.order?.merchant_order_id;
  const transactionId = obj.id;

  if (!orderRef) {
    return sendSuccess(res, null, 'No order reference');
  }

  const order = await Order.findById(orderRef);
  if (!order) {
    return sendSuccess(res, null, 'Order not found');
  }

  if (order.paymentStatus === 'paid') {
    return sendSuccess(res, null, 'Already paid');
  }

  const success = obj.success === true || obj.success === 'true';

  if (success) {
    order.paymentStatus = 'paid';
    await order.save();

    await logPayment({
      order: order._id,
      user: order.user,
      provider: 'paymob',
      transactionId: String(transactionId),
      amount: order.totalAmount,
      status: 'paid',
      rawResponse: obj,
    });

    const io = getIO();
    io?.to(`user:${order.user}`).emit('order_status_updated', {
      orderId: order._id,
      orderStatus: order.orderStatus,
      paymentStatus: 'paid',
    });
  } else {
    order.paymentStatus = 'failed';
    await order.save();

    await logPayment({
      order: order._id,
      user: order.user,
      provider: 'paymob',
      transactionId: String(transactionId),
      amount: order.totalAmount,
      status: 'failed',
      rawResponse: obj,
    });
  }

  sendSuccess(res, null, success ? 'Payment processed' : 'Payment failed');
});

const paymobRedirect = catchAsync(async (req, res) => {
  const { orderId } = req.query;
  if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
    const order = await Order.findById(orderId);
    if (order && order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed';
      await order.save();
    }
  }
  sendSuccess(res, null, 'Redirect processed');
});

module.exports = { paymobCallback, paymobRedirect };
