const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');
const { getIO } = require('../utils/io');

async function createNotification(userId, { title, message, type }) {
  const notification = await Notification.create({ user: userId, title, message, type });

  const io = getIO();
  io?.to(`user:${userId}`).emit('notification_received', { notification });

  return notification;
}

async function getNotifications(userId, query) {
  const { isRead, page = 1, limit = 20 } = query;
  const filter = { user: userId };

  if (isRead !== undefined) filter.isRead = isRead;

  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);

  return { notifications, total, page, limit };
}

async function getUnreadCount(userId) {
  const count = await Notification.countDocuments({ user: userId, isRead: false });
  return count;
}

async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { returnDocument: 'after' }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
}

async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}

async function removeNotification(notificationId, userId) {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
}

async function notifyOrderCreated(order) {
  await createNotification(order.user, {
    title: { en: 'Order Placed', ar: 'تم تقديم الطلب' },
    message: {
      en: `Your order #${order._id} has been placed. Total: ${order.totalAmount} EGP`,
      ar: `تم تقديم طلبك #${order._id}. الإجمالي: ${order.totalAmount} جنيه`,
    },
    type: 'order_placed',
  });
}

async function notifyAdminNewOrder(order) {
  const adminUsers = await require('../models/User').find({ role: 'admin' });
  for (const admin of adminUsers) {
    await createNotification(admin._id, {
      title: { en: 'New Order', ar: 'طلب جديد' },
      message: {
        en: `New order #${order._id} received. Total: ${order.totalAmount} EGP`,
        ar: `تم استلام طلب جديد #${order._id}. الإجمالي: ${order.totalAmount} جنيه`,
      },
      type: 'new_order',
    });
  }
}

async function notifyOrderStatusChanged(order, status) {
  const statusLabels = {
    confirmed: { en: 'Confirmed', ar: 'مؤكد' },
    preparing: { en: 'Being Prepared', ar: 'قيد التحضير' },
    out_for_delivery: { en: 'Out for Delivery', ar: 'في الطريق' },
    delivered: { en: 'Delivered', ar: 'تم التوصيل' },
    cancelled: { en: 'Cancelled', ar: 'ملغي' },
  };

  const label = statusLabels[status] || { en: status, ar: status };

  await createNotification(order.user, {
    title: { en: 'Order Updated', ar: 'تم تحديث الطلب' },
    message: {
      en: `Your order #${order._id} is now ${label.en}`,
      ar: `طلبك #${order._id} أصبح ${label.ar}`,
    },
    type: 'order_status',
  });
}

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
  notifyOrderCreated,
  notifyAdminNewOrder,
  notifyOrderStatusChanged,
};
