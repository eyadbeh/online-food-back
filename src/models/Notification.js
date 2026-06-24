const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  message: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  type: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
