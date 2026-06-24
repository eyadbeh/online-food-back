const KnowledgeBase = require('../models/KnowledgeBase');
const ApiError = require('../utils/apiError');

async function list({ page = 1, limit = 20, search } = {}) {
  const filter = {};
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const [knowledgeBases, total] = await Promise.all([
    KnowledgeBase.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    KnowledgeBase.countDocuments(filter),
  ]);

  return { knowledgeBases, total, page, limit };
}

async function getById(id) {
  const knowledgeBase = await KnowledgeBase.findById(id);
  if (!knowledgeBase) throw new ApiError(404, 'Knowledge base entry not found');
  return knowledgeBase;
}

async function create(data) {
  return KnowledgeBase.create(data);
}

async function update(id, data) {
  const knowledgeBase = await KnowledgeBase.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!knowledgeBase) throw new ApiError(404, 'Knowledge base entry not found');
  return knowledgeBase;
}

async function remove(id) {
  const knowledgeBase = await KnowledgeBase.findByIdAndDelete(id);
  if (!knowledgeBase) throw new ApiError(404, 'Knowledge base entry not found');
  return knowledgeBase;
}

module.exports = { list, getById, create, update, remove };
