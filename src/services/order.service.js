const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Coupon = require('../models/Coupon');
const DeliveryZone = require('../models/DeliveryZone');
const ApiError = require('../utils/apiError');
const { getIO } = require('../utils/io');
const { initiatePayPalPayment, logPayment } = require('./payment.service');
const { logAction } = require('./auditLog.service');
const { notifyOrderCreated, notifyAdminNewOrder, notifyOrderStatusChanged } = require('./notification.service');

const VALID_TRANSITIONS = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
};

async function calculateDeliveryFee(addressId) {
  const address = await Address.findById(addressId).populate('zone');
  if (!address) throw new ApiError(404, 'Address not found');

  let fee = 0;
  let zoneName = null;

  if (address.zone && address.zone.active) {
    fee = address.zone.fee;
    zoneName = address.zone.name;
  } else {
    const fallback = await DeliveryZone.findOne({ isDefaultFallback: true, active: true });
    if (fallback) {
      fee = fallback.fee;
      zoneName = fallback.name;
    }
  }

  return { fee, zoneName };
}

async function validateAndApplyCoupon(couponCode, subtotal) {
  if (!couponCode) return { discount: 0 };

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon) throw new ApiError(400, 'Coupon not found');
  if (!coupon.active) throw new ApiError(400, 'Coupon is inactive');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, 'Coupon has expired');
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached');
  }
  if (subtotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount} for this coupon`);
  }

  let discount = 0;
  if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  }

  coupon.usedCount += 1;
  await coupon.save();

  return { discount, couponId: coupon._id };
}

function buildStatusHistory(status) {
  return [{ status, changedAt: new Date() }];
}

async function createOrder(userId, { addressId, couponCode, paymentMethod, notes }) {
  const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price discountedPrice available');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw new ApiError(400, 'Address not found or does not belong to you');

  const { fee: deliveryFee } = await calculateDeliveryFee(addressId);

  const items = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.available) continue;
    const price = product.discountedPrice || product.price;
    items.push({ product: product._id, quantity: item.quantity, price });
  }

  if (items.length === 0) throw new ApiError(400, 'No available products in cart');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const { discount, couponId } = await validateAndApplyCoupon(couponCode, subtotal);
  const totalAmount = subtotal + deliveryFee - discount;

  const order = await Order.create({
    user: userId,
    address: addressId,
    items,
    subtotal,
    deliveryFee,
    discountAmount: discount,
    totalAmount,
    coupon: couponId || undefined,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    orderStatus: 'placed',
    statusHistory: buildStatusHistory('placed'),
    notes,
  });

  const populated = await Order.findById(order._id)
    .populate('items.product', 'name price image')
    .populate('address', 'title street building');

  cart.items = [];
  cart.subtotal = 0;
  await cart.save();

  if (paymentMethod === 'paypal') {
    try {
      const paypal = await initiatePayPalPayment(populated);
      await logPayment({
        order: order._id,
        user: userId,
        provider: 'paypal',
        transactionId: paypal.paymentId,
        amount: totalAmount,
        status: 'pending',
        rawResponse: paypal,
      });
      notifyOrderCreated(populated);
      notifyAdminNewOrder(populated);

      const io = getIO();
      io?.emit('new_order', { orderId: order._id, order: populated });

      return { order: populated, approvalUrl: paypal.approvalUrl, paymentId: paypal.paymentId };
    } catch (err) {
      await logPayment({
        order: order._id,
        user: userId,
        provider: 'paypal',
        amount: totalAmount,
        status: 'failed',
        rawResponse: err.message,
      });
      throw new ApiError(500, 'PayPal payment initiation failed');
    }
  }

  notifyOrderCreated(populated);
  notifyAdminNewOrder(populated);

  const io = getIO();
  io?.emit('new_order', { orderId: order._id, order: populated });

  return { order: populated };
}

async function getOrder(orderId, userId) {
  const order = await Order.findById(orderId)
    .populate('items.product', 'name price image')
    .populate('address', 'title street building floor apartment phone');

  if (!order) throw new ApiError(404, 'Order not found');
  return order;
}

async function getMyOrders(userId, query) {
  const { orderStatus, paymentStatus, startDate, endDate, page = 1, limit = 20 } = query;
  const filter = { user: userId };

  if (orderStatus) filter.orderStatus = orderStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('items.product', 'name price image'),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page, limit };
}

async function getAllOrders(query) {
  const { orderStatus, paymentStatus, startDate, endDate, page = 1, limit = 20 } = query;
  const filter = {};

  if (orderStatus) filter.orderStatus = orderStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('items.product', 'name price image')
      .populate('user', 'firstName lastName email'),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page, limit };
}

async function updateOrderStatus(orderId, newStatus, adminId) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  const allowed = VALID_TRANSITIONS[order.orderStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new ApiError(400, `Cannot transition from ${order.orderStatus} to ${newStatus}`);
  }

  order.orderStatus = newStatus;
  order.statusHistory.push({ status: newStatus, changedAt: new Date() });

  if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }

  if (newStatus === 'delivered') {
    order.paymentStatus = 'paid';
  }

  await order.save();

  await logAction({
    user: adminId,
    action: 'ORDER_STATUS_UPDATED',
    entityType: 'Order',
    entityId: order._id,
    metadata: { from: order.orderStatus, to: newStatus },
  });

  const populated = await Order.findById(order._id)
    .populate('items.product', 'name price image');

  notifyOrderStatusChanged(populated, newStatus);

  const io = getIO();
  io?.to(`user:${order.user}`).emit('order_status_updated', {
    orderId: order._id,
    orderStatus: newStatus,
    order: populated,
  });

  return populated;
}

async function cancelOrder(orderId, userId) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');

  const allowed = VALID_TRANSITIONS[order.orderStatus];
  if (!allowed || !allowed.includes('cancelled')) {
    throw new ApiError(400, 'Order cannot be cancelled at this stage');
  }

  order.orderStatus = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', changedAt: new Date() });
  await order.save();

  notifyOrderStatusChanged(order, 'cancelled');

  const io = getIO();
  io?.to(`user:${userId}`).emit('order_status_updated', {
    orderId: order._id,
    orderStatus: 'cancelled',
  });

  return order.populate('items.product', 'name price image');
}

module.exports = {
  createOrder, getOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder,
};
