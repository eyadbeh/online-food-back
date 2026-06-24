const productService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const create = catchAsync(async (req, res) => {
  const product = await productService.create(req.body);
  sendSuccess(res, { product }, 'Product created', 201);
});

const list = catchAsync(async (req, res) => {
  const { products, total, page, limit } = await productService.list(req.query);
  sendPaginated(res, { products }, total, page, limit);
});

const getById = catchAsync(async (req, res) => {
  const product = await productService.getById(req.params.productId);
  sendSuccess(res, { product });
});

const update = catchAsync(async (req, res) => {
  const product = await productService.update(req.params.productId, req.body);
  sendSuccess(res, { product }, 'Product updated');
});

const remove = catchAsync(async (req, res) => {
  await productService.remove(req.params.productId);
  sendSuccess(res, null, 'Product deleted');
});

const toggleAvailability = catchAsync(async (req, res) => {
  const product = await productService.toggleAvailability(req.params.productId);
  sendSuccess(res, { product }, 'Availability toggled');
});

const toggleFeatured = catchAsync(async (req, res) => {
  const product = await productService.toggleFeatured(req.params.productId);
  sendSuccess(res, { product }, 'Featured toggled');
});

const uploadImage = catchAsync(async (req, res) => {
  const result = await productService.uploadImage(req.file);
  sendSuccess(res, result, 'Image uploaded');
});

module.exports = { create, list, getById, update, remove, toggleAvailability, toggleFeatured, uploadImage };
