const joi = require('joi');
const { objectId } = require('./custom.validation');

const list = {
  query: joi.object().keys({
    action: joi.string(),
    entityType: joi.string(),
    user: objectId,
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  }),
};

module.exports = { list };
