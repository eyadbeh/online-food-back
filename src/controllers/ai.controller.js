const aiService = require('../services/ai.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const chat = catchAsync(async (req, res) => {
  const { message, conversationId } = req.body;
  const result = await aiService.chat(req.user._id, message, conversationId);
  sendSuccess(res, result);
});

const getConversations = catchAsync(async (req, res) => {
  const conversations = await aiService.getConversations(req.user._id);
  sendSuccess(res, { conversations });
});

const getMessages = catchAsync(async (req, res) => {
  const messages = await aiService.getMessages(req.params.conversationId, req.user._id);
  sendSuccess(res, { messages });
});

const remove = catchAsync(async (req, res) => {
  await aiService.removeConversation(req.params.conversationId, req.user._id);
  sendSuccess(res, null, 'Conversation deleted');
});

module.exports = { chat, getConversations, getMessages, remove };
