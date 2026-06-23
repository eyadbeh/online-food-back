const categoryService = require('../services/category.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const create = catchAsync(async (req, res) => {
  const category = await categoryService.create(req.body);
  sendSuccess(res, { category }, 'Category created', 201);
});

const getAll = catchAsync(async (req, res) => {
  const categories = await categoryService.getAll();
  sendSuccess(res, { categories });
});

const getById = catchAsync(async (req, res) => {
  const category = await categoryService.getById(req.params.categoryId);
  sendSuccess(res, { category });
});

const update = catchAsync(async (req, res) => {
  const category = await categoryService.update(req.params.categoryId, req.body);
  sendSuccess(res, { category }, 'Category updated');
});

const remove = catchAsync(async (req, res) => {
  await categoryService.remove(req.params.categoryId);
  sendSuccess(res, null, 'Category deleted');
});

module.exports = { create, getAll, getById, update, remove };
