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
  PAYMOB: 'paymob',
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

const AUDIT_ACTIONS = Object.freeze({
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  CATEGORY_CREATED: 'CATEGORY_CREATED',
  CATEGORY_UPDATED: 'CATEGORY_UPDATED',
  CATEGORY_DELETED: 'CATEGORY_DELETED',
  ORDER_STATUS_UPDATED: 'ORDER_STATUS_UPDATED',
  USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',
  COUPON_CREATED: 'COUPON_CREATED',
  COUPON_UPDATED: 'COUPON_UPDATED',
  COUPON_DELETED: 'COUPON_DELETED',
  ZONE_CREATED: 'ZONE_CREATED',
  ZONE_UPDATED: 'ZONE_UPDATED',
  ZONE_DELETED: 'ZONE_DELETED',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  FAQ_CREATED: 'FAQ_CREATED',
  FAQ_UPDATED: 'FAQ_UPDATED',
  FAQ_DELETED: 'FAQ_DELETED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
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
  AUDIT_ACTIONS,
};
