const joi = require('joi');
const { objectId } = require('./custom.validation');

const list = {
  query: joi.object().keys({
    active: joi.string().valid('true', 'false'),
  }),
};

const getById = {
  params: joi.object().keys({
    faqId: objectId.required(),
  }),
};

const create = {
  body: joi.object().keys({
    question: joi.object({
      en: joi.string().required().trim(),
      ar: joi.string().required().trim(),
    }).required(),
    answer: joi.object({
      en: joi.string().required().trim(),
      ar: joi.string().required().trim(),
    }).required(),
    active: joi.boolean(),
    sortOrder: joi.number().integer().min(0),
  }),
};

const update = {
  params: joi.object().keys({
    faqId: objectId.required(),
  }),
  body: joi.object().keys({
    question: joi.object({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    answer: joi.object({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    active: joi.boolean(),
    sortOrder: joi.number().integer().min(0),
  }),
};

const remove = {
  params: joi.object().keys({
    faqId: objectId.required(),
  }),
};

module.exports = { list, getById, create, update, remove };
