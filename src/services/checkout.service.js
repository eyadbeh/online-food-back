const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Coupon = require('../models/Coupon');
const DeliveryZone = require('../models/DeliveryZone');
const ApiError = require('../utils/apiError');

async function validateCheckout(userId, { addressId, couponCode }) {
  const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price discountedPrice available');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw new ApiError(400, 'Address not found or does not belong to you');

  const items = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.available) continue;
    const price = product.discountedPrice || product.price;
    items.push({ product: product._id, quantity: item.quantity, price });
  }

  if (items.length === 0) throw new ApiError(400, 'No available products in cart');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) throw new ApiError(400, 'Coupon not found');
    if (!coupon.active) throw new ApiError(400, 'Coupon is inactive');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, 'Coupon has expired');
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, 'Coupon usage limit reached');
    }
    if (subtotal < coupon.minOrderAmount) {
      throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount} for this coupon`);
    }

    if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  let deliveryFee = 0;
  let zone = null;

  if (address.zone) {
    const addressWithZone = await Address.findById(addressId).populate('zone');
    if (addressWithZone.zone && addressWithZone.zone.active) {
      deliveryFee = addressWithZone.zone.fee;
      zone = addressWithZone.zone;
    }
  }

  if (!zone) {
    const fallback = await DeliveryZone.findOne({ isDefaultFallback: true, active: true });
    if (fallback) {
      deliveryFee = fallback.fee;
      zone = fallback;
    }
  }

  const total = subtotal + deliveryFee - discount;

  return { subtotal, discount, deliveryFee, total, zone };
}

module.exports = { validateCheckout };
