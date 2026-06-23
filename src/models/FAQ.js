const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    answer: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
