const Review = require('../models/Review');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

async function create(userId, data) {
  const product = await Product.findById(data.product);
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await Review.findOne({ user: userId, product: data.product });
  if (existing) throw new ApiError(400, 'You have already reviewed this product');

  const review = await Review.create({ ...data, user: userId });
  await updateProductRating(data.product);
  return review;
}

async function list(query) {
  const { product, user, page = 1, limit = 20 } = query;
  const filter = {};
  if (product) filter.product = product;
  if (user) filter.user = user;

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(filter).populate('user', 'firstName lastName avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Review.countDocuments(filter),
  ]);

  return { reviews, total, page, limit };
}

async function getById(id) {
  const review = await Review.findById(id).populate('user', 'firstName lastName avatar').populate('product', 'name');
  if (!review) throw new ApiError(404, 'Review not found');
  return review;
}

async function update(id, userId, data) {
  const review = await Review.findOneAndUpdate({ _id: id, user: userId }, data, { new: true, runValidators: true });
  if (!review) throw new ApiError(404, 'Review not found or unauthorized');

  await updateProductRating(review.product);
  return review;
}

async function remove(id, userId) {
  const review = await Review.findOneAndDelete({ _id: id, user: userId });
  if (!review) throw new ApiError(404, 'Review not found or unauthorized');

  await updateProductRating(review.product);
  return review;
}

async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { averageRating: 0, reviewCount: 0 });
  }
}

module.exports = { create, list, getById, update, remove };
