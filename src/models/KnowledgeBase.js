const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

knowledgeBaseSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
