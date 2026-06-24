const joi = require('joi');

const update = {
  body: joi.object().keys({
    restaurantName: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    restaurantDescription: joi.object().keys({
      en: joi.string().trim(),
      ar: joi.string().trim(),
    }),
    logo: joi.string().trim(),
    phone: joi.string().trim(),
    supportPhone: joi.string().trim(),
    email: joi.string().trim().email(),
    supportEmail: joi.string().trim().email(),
    address: joi.string().trim(),
    facebook: joi.string().trim(),
    facebookUrl: joi.string().trim(),
    instagram: joi.string().trim(),
    instagramUrl: joi.string().trim(),
    twitter: joi.string().trim(),
    twitterUrl: joi.string().trim(),
    linkedin: joi.string().trim(),
    tiktokUrl: joi.string().trim(),
    workingHours: joi.string().trim(),
    deliveryFee: joi.number().min(0),
    defaultDeliveryFee: joi.number().min(0),
    estimatedTimes: joi.string().trim(),
    currency: joi.string().trim(),
    defaultLanguage: joi.string().trim(),
    aiEnabled: joi.boolean(),
  }).min(1).message('At least one field must be provided for update'),
};

module.exports = { update };
