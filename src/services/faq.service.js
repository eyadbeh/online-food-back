const FAQ = require('../models/FAQ');
const ApiError = require('../utils/apiError');

async function list(query) {
  const { active } = query;
  const filter = {};
  if (active !== undefined) filter.active = active === 'true';
  return FAQ.find(filter).sort({ sortOrder: 1 });
}

async function getById(id) {
  const faq = await FAQ.findById(id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
  return faq;
}

async function create(data) {
  return FAQ.create(data);
}

async function update(id, data) {
  const faq = await FAQ.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!faq) throw new ApiError(404, 'FAQ not found');
  return faq;
}

async function remove(id) {
  const faq = await FAQ.findByIdAndDelete(id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
  return faq;
}

module.exports = { list, getById, create, update, remove };
