const joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    title: joi.string().required().trim(),
    phone: joi.string().required().trim(),
    street: joi.string().required().trim(),
    building: joi.string().trim(),
    floor: joi.string().trim(),
    apartment: joi.string().trim(),
    notes: joi.string().trim(),
    zone: objectId,
    isDefault: joi.boolean(),
  }),
};

const update = {
  params: joi.object().keys({ addressId: objectId.required() }),
  body: joi.object().keys({
    title: joi.string().trim(),
    phone: joi.string().trim(),
    street: joi.string().trim(),
    building: joi.string().trim(),
    floor: joi.string().trim(),
    apartment: joi.string().trim(),
    notes: joi.string().trim(),
    zone: objectId,
    isDefault: joi.boolean(),
  }),
};

const getById = {
  params: joi.object().keys({ addressId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ addressId: objectId.required() }),
};

module.exports = { create, update, getById, remove };
