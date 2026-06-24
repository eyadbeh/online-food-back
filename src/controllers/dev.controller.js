const mongoose = require('mongoose');
const seedDatabase = require('../seeders/seed');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const DeliveryZone = require('../models/DeliveryZone');
const Setting = require('../models/Setting');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const seed = catchAsync(async (req, res) => {
  await seedDatabase();
  sendSuccess(res, null, 'Database seeded successfully');
});

const reset = catchAsync(async (req, res) => {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    DeliveryZone.deleteMany({}),
    Setting.deleteMany({}),
  ]);
  sendSuccess(res, null, 'Database reset successfully');
});

module.exports = { seed, reset };
