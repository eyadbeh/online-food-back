const joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    code: joi.string().required().trim().uppercase().min(3).max(20),
    type: joi.string().required().valid('fixed', 'percentage'),
    value: joi.number().required().min(0),
    maxDiscount: joi.number().min(0),
    minOrderAmount: joi.number().min(0).default(0),
    usageLimit: joi.number().integer().min(0),
    active: joi.boolean().default(true),
    expiresAt: joi.date(),
  }),
};

const update = {
  params: joi.object().keys({ couponId: objectId.required() }),
  body: joi.object().keys({
    code: joi.string().trim().uppercase().min(3).max(20),
    type: joi.string().valid('fixed', 'percentage'),
    value: joi.number().min(0),
    maxDiscount: joi.number().min(0),
    minOrderAmount: joi.number().min(0),
    usageLimit: joi.number().integer().min(0),
    active: joi.boolean(),
    expiresAt: joi.date().allow(null),
  }),
};

const getById = {
  params: joi.object().keys({ couponId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ couponId: objectId.required() }),
};

const list = {
  query: joi.object().keys({
    active: joi.boolean(),
    type: joi.string().valid('fixed', 'percentage'),
    search: joi.string().trim(),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  }),
};

const validate = {
  body: joi.object().keys({
    couponCode: joi.string().required().trim().uppercase(),
  }),
};

module.exports = { create, update, getById, remove, list, validate };
