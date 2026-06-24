const joi = require('joi');
const { objectId } = require('./custom.validation');

const validate = {
  body: joi.object().keys({
    addressId: objectId.required(),
    couponCode: joi.string().trim().uppercase(),
  }),
};

module.exports = { validate };
