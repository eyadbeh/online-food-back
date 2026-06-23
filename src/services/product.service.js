const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');

async function create(data) {
  const category = await Category.findById(data.category);
  if (!category) throw new ApiError(400, 'Category not found');

  return Product.create(data);
}

async function list(query) {
  const { category, search, featured, available, minPrice, maxPrice, tags, sort, page = 1, limit = 20 } = query;

  const filter = {};

  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured;
  if (available !== undefined) filter.available = available;

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (search) {
    filter.$or = [
      { 'name.en': { $regex: search, $options: 'i' } },
      { 'name.ar': { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  if (tags) {
    filter.tags = { $in: tags.split(',').map((t) => t.trim()) };
  }

  let sortOption = { createdAt: -1 };
  if (sort) {
    if (sort === 'price') sortOption = { price: 1 };
    else if (sort === '-price') sortOption = { price: -1 };
    else if (sort === 'createdAt') sortOption = { createdAt: 1 };
    else if (sort === '-createdAt') sortOption = { createdAt: -1 };
    else if (sort === 'averageRating') sortOption = { averageRating: 1 };
    else if (sort === '-averageRating') sortOption = { averageRating: -1 };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name image').sort(sortOption).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, limit };
}

async function getById(id) {
  const product = await Product.findById(id).populate('category', 'name image');
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

async function update(id, data) {
  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) throw new ApiError(400, 'Category not found');
  }

  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('category', 'name image');
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

async function remove(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

async function toggleAvailability(id) {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  product.available = !product.available;
  await product.save();
  return product;
}

module.exports = { create, list, getById, update, remove, toggleAvailability };
