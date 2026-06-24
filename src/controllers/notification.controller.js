const notificationService = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const { notifications, total, page, limit } = await notificationService.getNotifications(req.user._id, req.query);
  sendPaginated(res, { notifications }, total, page, limit);
});

const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  sendSuccess(res, { count });
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.notificationId, req.user._id);
  sendSuccess(res, { notification }, 'Marked as read');
});

const markAllAsRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  sendSuccess(res, null, 'All notifications marked as read');
});

const remove = catchAsync(async (req, res) => {
  await notificationService.removeNotification(req.params.notificationId, req.user._id);
  sendSuccess(res, null, 'Notification deleted');
});

module.exports = { list, getUnreadCount, markAsRead, markAllAsRead, remove };
