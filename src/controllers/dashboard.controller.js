const analyticsService = require('../services/analytics.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getSummary = catchAsync(async (req, res) => {
  const summary = await analyticsService.getSummary();
  sendSuccess(res, summary);
});

const getRevenuePerDay = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await analyticsService.getRevenuePerDay(startDate, endDate);
  sendSuccess(res, { revenuePerDay: data });
});

const getTopSellingProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const data = await analyticsService.getTopSellingProducts(limit);
  sendSuccess(res, { topProducts: data });
});

module.exports = { getSummary, getRevenuePerDay, getTopSellingProducts };
