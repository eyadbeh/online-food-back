const joi = require('joi');
const { objectId } = require('./custom.validation');

const getProfile = {};

const updateProfile = {
  body: joi.object().keys({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    phone: joi.string().trim(),
  }),
};

const changePassword = {
  body: joi.object().keys({
    currentPassword: joi.string().required(),
    newPassword: joi.string().min(8).max(128).required(),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).required(),
  }),
};

const uploadAvatar = {};

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar };
