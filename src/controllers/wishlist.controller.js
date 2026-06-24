const wishlistService = require('../services/wishlist.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const get = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.get(req.user._id);
  sendSuccess(res, { wishlist });
});

const addProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId || req.body.productId;
  const wishlist = await wishlistService.addProduct(req.user._id, productId);
  sendSuccess(res, { wishlist }, 'Product added to wishlist');
});

const removeProduct = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.removeProduct(req.user._id, req.params.productId);
  sendSuccess(res, { wishlist }, 'Product removed from wishlist');
});

module.exports = { get, addProduct, removeProduct };
