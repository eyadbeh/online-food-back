const joi = require('joi');
const { objectId } = require('./custom.validation');

const addItem = {
  body: joi.object().keys({
    product: objectId.required(),
    quantity: joi.number().integer().min(1).max(20).required(),
  }),
};

const updateItem = {
  params: joi.object().keys({
    productId: objectId.required(),
  }),
  body: joi.object().keys({
    quantity: joi.number().integer().min(1).max(20).required(),
  }),
};

const removeItem = {
  params: joi.object().keys({
    productId: objectId.required(),
  }),
};

const merge = {
  body: joi.object().keys({
    guestId: joi.string().required(),
  }),
};

module.exports = { addItem, updateItem, removeItem, merge };
