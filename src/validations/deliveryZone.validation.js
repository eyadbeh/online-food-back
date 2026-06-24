const joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    name: joi.object().keys({
      en: joi.string().required().trim(),
      ar: joi.string().required().trim(),
    }),
    fee: joi.number().required().min(0),
    estimatedMinutes: joi.number().min(0),
    active: joi.boolean(),
    isDefaultFallback: joi.boolean(),
  }),
};

const update = {
  params: joi.object().keys({ zoneId: objectId.required() }),
  body: joi.object().keys({
    name: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    fee: joi.number().min(0),
    estimatedMinutes: joi.number().min(0),
    active: joi.boolean(),
    isDefaultFallback: joi.boolean(),
  }),
};

const getById = {
  params: joi.object().keys({ zoneId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ zoneId: objectId.required() }),
};

const list = {
  query: joi.object().keys({
    active: joi.boolean(),
    sort: joi.string().valid('fee', '-fee', 'name', '-name'),
  }),
};

module.exports = { create, update, getById, remove, list };
