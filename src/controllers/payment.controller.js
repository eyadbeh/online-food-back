const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const { logPayment } = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const { getIO } = require('../utils/io');

const paypalSuccess = catchAsync(async (req, res) => {
  const { paymentId, PayerID, orderId } = req.query;

  const order = await Order.findById(orderId);
  if (!order) return sendSuccess(res, null, 'Order not found');

  paypal.payment.execute(paymentId, { payer_id: PayerID }, async (err, payment) => {
    if (err) {
      order.paymentStatus = 'failed';
      await order.save();
      return sendSuccess(res, null, 'Payment failed');
    }

    order.paymentStatus = 'paid';
    await order.save();

    await logPayment({
      order: order._id,
      user: order.user,
      provider: 'paypal',
      transactionId: payment.id,
      amount: order.totalAmount,
      status: 'paid',
      rawResponse: payment,
    });

    const io = getIO();
    io?.to(`user:${order.user}`).emit('order_status_updated', {
      orderId: order._id,
      orderStatus: order.orderStatus,
      paymentStatus: 'paid',
    });

    sendSuccess(res, { orderId: order._id, paymentId }, 'Payment successful');
  });
});

const paypalCancel = catchAsync(async (req, res) => {
  const { orderId } = req.query;
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order && order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed';
      await order.save();
    }
  }
  sendSuccess(res, null, 'Payment cancelled');
});

module.exports = { paypalSuccess, paypalCancel };
