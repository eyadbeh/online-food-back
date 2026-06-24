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

const getStats = catchAsync(async (req, res) => {
  const stats = await analyticsService.getStats();
  sendSuccess(res, stats);
});

const getRevenue = catchAsync(async (req, res) => {
  const period = req.query.period || 'daily';
  const data = await analyticsService.getRevenueByPeriod(period);
  sendSuccess(res, { revenue: data });
});

const getOrdersAnalytics = catchAsync(async (req, res) => {
  const data = await analyticsService.getOrdersAnalytics();
  sendSuccess(res, { ordersAnalytics: data });
});

const getTopCustomers = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const data = await analyticsService.getTopCustomers(limit);
  sendSuccess(res, { topCustomers: data });
});

module.exports = { getSummary, getRevenuePerDay, getTopSellingProducts, getStats, getRevenue, getOrdersAnalytics, getTopCustomers };
