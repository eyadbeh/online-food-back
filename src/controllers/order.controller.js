const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrder(req.user._id, req.body);
  sendSuccess(res, result, 'Order created', 201);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req.params.orderId, req.user._id);
  sendSuccess(res, { order });
});

const getMyOrders = catchAsync(async (req, res) => {
  const { orders, total, page, limit } = await orderService.getMyOrders(req.user._id, req.query);
  sendPaginated(res, { orders }, total, page, limit);
});

const getAllOrders = catchAsync(async (req, res) => {
  const { orders, total, page, limit } = await orderService.getAllOrders(req.query);
  sendPaginated(res, { orders }, total, page, limit);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.orderId, req.body.orderStatus, req.user._id);
  sendSuccess(res, { order }, 'Order status updated');
});

const cancelOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.orderId, req.user._id);
  sendSuccess(res, { order }, 'Order cancelled');
});

module.exports = { createOrder, getOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder };
