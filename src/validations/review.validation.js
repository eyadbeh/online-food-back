const joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    product: objectId.required(),
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().trim().max(500),
  }),
};

const update = {
  params: joi.object().keys({ reviewId: objectId.required() }),
  body: joi.object().keys({
    rating: joi.number().min(1).max(5),
    comment: joi.string().trim().max(500),
  }),
};

const getById = {
  params: joi.object().keys({ reviewId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ reviewId: objectId.required() }),
};

const list = {
  query: joi.object().keys({
    product: objectId,
    user: objectId,
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = { create, update, getById, remove, list };
