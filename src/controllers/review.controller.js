const reviewService = require('../services/review.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const create = catchAsync(async (req, res) => {
  const review = await reviewService.create(req.user._id, req.body);
  sendSuccess(res, { review }, 'Review created', 201);
});

const list = catchAsync(async (req, res) => {
  const { reviews, total, page, limit } = await reviewService.list(req.query);
  sendPaginated(res, { reviews }, total, page, limit);
});

const getById = catchAsync(async (req, res) => {
  const review = await reviewService.getById(req.params.reviewId);
  sendSuccess(res, { review });
});

const update = catchAsync(async (req, res) => {
  const review = await reviewService.update(req.params.reviewId, req.user._id, req.body);
  sendSuccess(res, { review }, 'Review updated');
});

const remove = catchAsync(async (req, res) => {
  await reviewService.remove(req.params.reviewId, req.user._id);
  sendSuccess(res, null, 'Review deleted');
});

const listByProduct = catchAsync(async (req, res) => {
  const { reviews, total, page, limit } = await reviewService.listByProduct(req.params.productId, req.query);
  sendPaginated(res, { reviews }, total, page, limit);
});

module.exports = { create, list, getById, update, remove, listByProduct };
