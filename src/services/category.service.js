const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

async function create(data) {
  return Category.create(data);
}

async function getAll() {
  return Category.find().sort({ sortOrder: 1 });
}

async function getById(id) {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

async function update(id, data) {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

async function remove(id) {
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) throw new ApiError(400, `Cannot delete category used by ${productCount} product(s)`);
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

module.exports = { create, getAll, getById, update, remove };
