const ROLES = Object.freeze({
  ADMIN: 'admin',
  CUSTOMER: 'customer',
});

const PROVIDERS = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
});

const COUPON_TYPES = Object.freeze({
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
});

const PAYMENT_METHODS = Object.freeze({
  COD: 'cod',
  PAYPAL: 'paypal',
});

const PAYMENT_STATUSES = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
});

const ORDER_STATUSES = Object.freeze({
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

const MESSAGE_ROLES = Object.freeze({
  USER: 'user',
  ASSISTANT: 'assistant',
});

const ENTITY_TYPES = Object.freeze({
  PRODUCT: 'Product',
  CATEGORY: 'Category',
  ORDER: 'Order',
  COUPON: 'Coupon',
  ZONE: 'Zone',
  USER: 'User',
});

module.exports = {
  ROLES,
  PROVIDERS,
  COUPON_TYPES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  ORDER_STATUSES,
  MESSAGE_ROLES,
  ENTITY_TYPES,
};
