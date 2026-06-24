const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

function getCartOwner(userId, guestId) {
  if (userId) return { user: userId };
  if (guestId) return { guestId };
  throw new ApiError(400, 'User or device ID required');
}

async function getCart(userId, guestId) {
  const query = getCartOwner(userId, guestId);
  let cart = await Cart.findOne(query).populate('items.product', 'name price discountedPrice image available');

  if (!cart) {
    cart = await Cart.create({ ...query, items: [], subtotal: 0 });
  }

  return cart;
}

async function addItem(userId, guestId, { product: productId, quantity }) {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (!product.available) throw new ApiError(400, 'Product is not available');

  const query = getCartOwner(userId, guestId);
  let cart = await Cart.findOne(query);

  if (!cart) {
    cart = await Cart.create({ ...query, items: [], subtotal: 0 });
  }

  const unitPrice = product.discountedPrice || product.price;
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > 20) throw new ApiError(400, 'Maximum 20 units per product');
    existingItem.totalPrice = existingItem.quantity * unitPrice;
  } else {
    cart.items.push({ product: productId, quantity, unitPrice, totalPrice: quantity * unitPrice });
  }

  cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  await cart.save();

  return cart.populate('items.product', 'name price discountedPrice image available');
}

async function updateItem(userId, guestId, productId, quantity) {
  const query = getCartOwner(userId, guestId);
  const cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, 'Item not found in cart');

  item.quantity = quantity;
  item.totalPrice = quantity * item.unitPrice;

  cart.subtotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
  await cart.save();

  return cart.populate('items.product', 'name price discountedPrice image available');
}

async function removeItem(userId, guestId, productId) {
  const query = getCartOwner(userId, guestId);
  const cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  cart.subtotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
  await cart.save();

  return cart.populate('items.product', 'name price discountedPrice image available');
}

async function clearCart(userId, guestId) {
  const query = getCartOwner(userId, guestId);
  const cart = await Cart.findOne(query);
  if (cart) {
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();
  }
  return cart || { items: [], subtotal: 0 };
}

async function mergeGuestCart(guestId, userId) {
  const guestCart = await Cart.findOne({ guestId }).populate('items.product', 'price discountedPrice available');
  if (!guestCart || guestCart.items.length === 0) {
    return getCart(userId);
  }

  let userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    userCart = await Cart.create({ user: userId, items: [], subtotal: 0 });
  }

  for (const guestItem of guestCart.items) {
    const product = guestItem.product;
    if (!product || !product.available) continue;

    const unitPrice = product.discountedPrice || product.price;
    const existingItem = userCart.items.find((i) => i.product.toString() === guestItem.product._id.toString());

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + guestItem.quantity, 20);
      existingItem.totalPrice = existingItem.quantity * unitPrice;
    } else {
      userCart.items.push({
        product: guestItem.product._id,
        quantity: guestItem.quantity,
        unitPrice,
        totalPrice: guestItem.quantity * unitPrice,
      });
    }
  }

  userCart.subtotal = userCart.items.reduce((sum, i) => sum + i.totalPrice, 0);
  await userCart.save();

  await Cart.deleteOne({ guestId });

  return userCart.populate('items.product', 'name price discountedPrice image available');
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, mergeGuestCart };
