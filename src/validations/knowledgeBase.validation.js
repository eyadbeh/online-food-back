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
    knowledgeId: objectId.required(),
  }),
};

const create = {
  body: joi.object().keys({
    title: joi.string().required().trim(),
    content: joi.string().required().trim(),
    active: joi.boolean(),
  }),
};

const update = {
  params: joi.object().keys({
    knowledgeId: objectId.required(),
  }),
  body: joi.object().keys({
    title: joi.string().trim(),
    content: joi.string().trim(),
    active: joi.boolean(),
  }),
};

const remove = {
  params: joi.object().keys({
    knowledgeId: objectId.required(),
  }),
};

module.exports = { list, getById, create, update, remove };
