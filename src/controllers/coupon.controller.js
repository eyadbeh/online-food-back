const couponService = require('../services/coupon.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const { coupons, total, page, limit } = await couponService.list(req.query);
  sendPaginated(res, { coupons }, total, page, limit);
});

const getById = catchAsync(async (req, res) => {
  const coupon = await couponService.getById(req.params.couponId);
  sendSuccess(res, { coupon });
});

const create = catchAsync(async (req, res) => {
  const coupon = await couponService.create(req.body);
  sendSuccess(res, { coupon }, 'Coupon created', 201);
});

const update = catchAsync(async (req, res) => {
  const coupon = await couponService.update(req.params.couponId, req.body);
  sendSuccess(res, { coupon }, 'Coupon updated');
});

const remove = catchAsync(async (req, res) => {
  await couponService.remove(req.params.couponId);
  sendSuccess(res, null, 'Coupon deleted');
});

const validate = catchAsync(async (req, res) => {
  const coupon = await couponService.validateCoupon(req.body.couponCode);
  sendSuccess(res, { coupon });
});

module.exports = { list, getById, create, update, remove, validate };
