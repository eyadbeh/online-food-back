const joi = require('joi');
const { objectId } = require('./custom.validation');

const chat = {
  body: joi.object().keys({
    message: joi.string().trim().min(1).max(2000).required(),
    conversationId: objectId,
  }),
};

const getMessages = {
  params: joi.object().keys({ conversationId: objectId.required() }),
};

const remove = {
  params: joi.object().keys({ conversationId: objectId.required() }),
};

module.exports = { chat, getMessages, remove };
