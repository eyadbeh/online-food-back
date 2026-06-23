const joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    category: objectId.required(),
    name: joi.object().keys({
      en: joi.string().required().trim(),
      ar: joi.string().required().trim(),
    }),
    description: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    image: joi.string().trim(),
    gallery: joi.array().items(joi.string().trim()),
    price: joi.number().required().min(0),
    discountedPrice: joi.number().min(0),
    featured: joi.boolean(),
    available: joi.boolean(),
    tags: joi.array().items(joi.string().trim()),
  }),
};

const update = {
  params: joi.object().keys({ productId: objectId.required() }),
  body: joi.object().keys({
    category: objectId,
    name: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    description: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    image: joi.string().trim(),
    gallery: joi.array().items(joi.string().trim()),
    price: joi.number().min(0),
    discountedPrice: joi.number().min(0),
    featured: joi.boolean(),
    available: joi.boolean(),
    tags: joi.array().items(joi.string().trim()),
  }),
};

const getById = {
  params: joi.object().keys({ productId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ productId: objectId.required() }),
};

const list = {
  query: joi.object().keys({
    category: objectId,
    search: joi.string().trim(),
    featured: joi.boolean(),
    available: joi.boolean(),
    minPrice: joi.number().min(0),
    maxPrice: joi.number().min(0),
    tags: joi.string().trim(),
    sort: joi.string().valid('price', '-price', 'createdAt', '-createdAt', 'averageRating', '-averageRating'),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = { create, update, getById, remove, list };
