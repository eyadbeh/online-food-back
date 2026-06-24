const joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: joi.object().keys({
    addressId: objectId.required(),
    couponCode: joi.string().trim().uppercase(),
    paymentMethod: joi.string().required().valid('cod', 'paypal'),
    notes: joi.string().trim().max(500),
  }),
};

const getById = {
  params: joi.object().keys({ orderId: objectId.required() }),
};

const updateStatus = {
  params: joi.object().keys({ orderId: objectId.required() }),
  body: joi.object().keys({
    orderStatus: joi.string().required().valid(
      'confirmed', 'preparing', 'out_for_delivery', 'delivered'
    ),
  }),
};

const cancel = {
  params: joi.object().keys({ orderId: objectId.required() }),
};

const list = {
  query: joi.object().keys({
    orderStatus: joi.string().valid('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
    paymentStatus: joi.string().valid('pending', 'paid', 'failed'),
    startDate: joi.date(),
    endDate: joi.date(),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = { createOrder, getById, updateStatus, cancel, list };
