const knowledgeBaseService = require('../services/knowledgeBase.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const { knowledgeBases, total, page, limit } = await knowledgeBaseService.list(req.query);
  sendPaginated(res, { knowledgeBases }, total, page, limit);
});

const getById = catchAsync(async (req, res) => {
  const knowledgeBase = await knowledgeBaseService.getById(req.params.knowledgeId);
  sendSuccess(res, { knowledgeBase });
});

const create = catchAsync(async (req, res) => {
  const knowledgeBase = await knowledgeBaseService.create(req.body);
  sendSuccess(res, { knowledgeBase }, 'Knowledge base entry created', 201);
});

const update = catchAsync(async (req, res) => {
  const knowledgeBase = await knowledgeBaseService.update(req.params.knowledgeId, req.body);
  sendSuccess(res, { knowledgeBase }, 'Knowledge base entry updated');
});

const remove = catchAsync(async (req, res) => {
  await knowledgeBaseService.remove(req.params.knowledgeId);
  sendSuccess(res, null, 'Knowledge base entry deleted');
});

module.exports = { list, getById, create, update, remove };
