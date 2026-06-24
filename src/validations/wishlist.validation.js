const joi = require('joi');
const { objectId } = require('./custom.validation');

const addProduct = {
  params: joi.object().keys({
    productId: objectId.required(),
  }),
};

const removeProduct = {
  params: joi.object().keys({
    productId: objectId.required(),
  }),
};

module.exports = { addProduct, removeProduct };
