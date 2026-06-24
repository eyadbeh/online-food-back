const faqService = require('../services/faq.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const faqs = await faqService.list(req.query);
  sendSuccess(res, { faqs });
});

const getById = catchAsync(async (req, res) => {
  const faq = await faqService.getById(req.params.faqId);
  sendSuccess(res, { faq });
});

const create = catchAsync(async (req, res) => {
  const faq = await faqService.create(req.body);
  sendSuccess(res, { faq }, 'FAQ created', 201);
});

const update = catchAsync(async (req, res) => {
  const faq = await faqService.update(req.params.faqId, req.body);
  sendSuccess(res, { faq }, 'FAQ updated');
});

const remove = catchAsync(async (req, res) => {
  await faqService.remove(req.params.faqId);
  sendSuccess(res, null, 'FAQ deleted');
});

module.exports = { list, getById, create, update, remove };
