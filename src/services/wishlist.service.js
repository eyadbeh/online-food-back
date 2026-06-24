const Wishlist = require('../models/Wishlist');
const ApiError = require('../utils/apiError');

async function get(userId) {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
}

async function addProduct(userId, productId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [productId] });
  } else {
    if (wishlist.products.includes(productId)) {
      throw new ApiError(400, 'Product already in wishlist');
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }
  return wishlist.populate('products');
}

async function removeProduct(userId, productId) {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  const idx = wishlist.products.indexOf(productId);
  if (idx === -1) throw new ApiError(404, 'Product not found in wishlist');

  wishlist.products.splice(idx, 1);
  await wishlist.save();
  return wishlist.populate('products');
}

module.exports = { get, addProduct, removeProduct };
