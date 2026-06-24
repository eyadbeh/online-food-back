const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    restaurantName: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    restaurantDescription: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
    },
    logo: { type: String },
    phone: { type: String, trim: true },
    supportPhone: { type: String, trim: true },
    email: { type: String, trim: true },
    supportEmail: { type: String, trim: true },
    address: { type: String, trim: true },
    facebook: { type: String, trim: true },
    facebookUrl: { type: String, trim: true },
    instagram: { type: String, trim: true },
    instagramUrl: { type: String, trim: true },
    twitter: { type: String, trim: true },
    twitterUrl: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    tiktokUrl: { type: String, trim: true },
    workingHours: { type: String, trim: true },
    deliveryFee: { type: Number, default: 0, min: 0 },
    defaultDeliveryFee: { type: Number, default: 0, min: 0 },
    estimatedTimes: { type: String, trim: true },
    currency: { type: String, default: 'EGP', trim: true },
    defaultLanguage: { type: String, default: 'en', trim: true },
    aiEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
