const cartService = require('../services/cart.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getCart = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartService.getCart(userId, req.guestId);
  sendSuccess(res, { cart });
});

const addItem = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartService.addItem(userId, req.guestId, req.body);
  sendSuccess(res, { cart }, 'Item added to cart');
});

const updateItem = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartService.updateItem(userId, req.guestId, req.params.productId, req.body.quantity);
  sendSuccess(res, { cart }, 'Item updated');
});

const removeItem = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartService.removeItem(userId, req.guestId, req.params.productId);
  sendSuccess(res, { cart }, 'Item removed from cart');
});

const clearCart = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const cart = await cartService.clearCart(userId, req.guestId);
  sendSuccess(res, { cart }, 'Cart cleared');
});

const mergeGuestCart = catchAsync(async (req, res) => {
  const cart = await cartService.mergeGuestCart(req.body.guestId, req.user._id);
  sendSuccess(res, { cart }, 'Guest cart merged');
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, mergeGuestCart };
