const joi = require('joi');
const { objectId } = require('./custom.validation');

const list = {
  query: joi.object().keys({
    isRead: joi.boolean(),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  }),
};

const markAsRead = {
  params: joi.object().keys({ notificationId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ notificationId: objectId.required() }),
};

module.exports = { list, markAsRead, remove };
