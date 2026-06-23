const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    restaurantName: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    logo: { type: String },
    supportEmail: { type: String, trim: true },
    supportPhone: { type: String, trim: true },
    facebookUrl: { type: String, trim: true },
    instagramUrl: { type: String, trim: true },
    tiktokUrl: { type: String, trim: true },
    twitterUrl: { type: String, trim: true },
    workingHours: { type: String, trim: true },
    currency: { type: String, default: 'EGP', trim: true },
    defaultLanguage: { type: String, default: 'en', trim: true },
    aiEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
