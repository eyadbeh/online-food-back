const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

async function getTotalOrders() {
  return Order.countDocuments();
}

async function getTotalRevenue() {
  const result = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
}

async function getProductsCount() {
  return Product.countDocuments();
}

async function getUsersCount() {
  return User.countDocuments({ role: 'customer' });
}

async function getRevenuePerDay(startDate, endDate) {
  const match = { paymentStatus: 'paid' };
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const result = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return result;
}

async function getTopSellingProducts(limit = 10) {
  const result = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalRevenue: 1,
        name: '$product.name',
        image: '$product.image',
        price: '$product.price',
      },
    },
  ]);

  return result;
}

async function getSummary() {
  const [totalOrders, totalRevenue, productsCount, usersCount] = await Promise.all([
    getTotalOrders(),
    getTotalRevenue(),
    getProductsCount(),
    getUsersCount(),
  ]);

  return { totalOrders, totalRevenue, productsCount, usersCount };
}

module.exports = {
  getSummary,
  getTotalOrders,
  getTotalRevenue,
  getProductsCount,
  getUsersCount,
  getRevenuePerDay,
  getTopSellingProducts,
};
