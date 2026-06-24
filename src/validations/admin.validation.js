const joi = require('joi');
const { objectId } = require('./custom.validation');

const list = {
  query: joi.object().keys({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
    search: joi.string().trim(),
  }),
};

const getById = {
  params: joi.object().keys({
    adminId: objectId.required(),
  }),
};

const create = {
  body: joi.object().keys({
    firstName: joi.string().required().trim(),
    lastName: joi.string().required().trim(),
    email: joi.string().required().email().trim().lowercase(),
    password: joi.string().min(8),
    role: joi.string().valid('admin').default('admin'),
  }),
};

const update = {
  params: joi.object().keys({
    adminId: objectId.required(),
  }),
  body: joi.object().keys({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    email: joi.string().email().trim().lowercase(),
  }),
};

const remove = {
  params: joi.object().keys({
    adminId: objectId.required(),
  }),
};

module.exports = { list, getById, create, update, remove };
