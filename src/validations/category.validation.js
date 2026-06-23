const joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    name: joi.object().keys({
      en: joi.string().required().trim(),
      ar: joi.string().required().trim(),
    }),
    image: joi.string().trim(),
    active: joi.boolean(),
    sortOrder: joi.number().integer().min(0),
  }),
};

const update = {
  params: joi.object().keys({ categoryId: objectId.required() }),
  body: joi.object().keys({
    name: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    image: joi.string().trim(),
    active: joi.boolean(),
    sortOrder: joi.number().integer().min(0),
  }),
};

const getById = {
  params: joi.object().keys({ categoryId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ categoryId: objectId.required() }),
};

module.exports = { create, update, getById, remove };
