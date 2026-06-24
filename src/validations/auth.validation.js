const joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: joi.object().keys({
    firstName: joi.string().required().trim(),
    lastName: joi.string().required().trim(),
    email: joi.string().required().email().lowercase().trim(),
    phone: joi.string().trim(),
    password: password.required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),
  }),
};

const login = {
  body: joi.object().keys({
    email: joi.string().required().email().lowercase().trim(),
    password: joi.string().required(),
  }),
};

const refreshToken = {
  body: joi.object().keys({
    refreshToken: joi.string().required(),
  }),
};

const logout = {
  body: joi.object().keys({
    refreshToken: joi.string().required(),
  }),
};

const verifyEmail = {
  params: joi.object().keys({
    token: joi.string().required(),
  }),
};

const forgotPassword = {
  body: joi.object().keys({
    email: joi.string().required().email().lowercase().trim(),
  }),
};

const resetPassword = {
  params: joi.object().keys({
    token: joi.string().required(),
  }),
  body: joi.object().keys({
    password: password.required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
    }),
  }),
};

const updateRole = {
  params: joi.object().keys({ userId: objectId.required() }),
  body: joi.object().keys({
    role: joi.string().required().valid('admin', 'customer'),
  }),
};

const googleLogin = {
  body: joi.object().keys({
    idToken: joi.string().required(),
  }),
};

const githubLogin = {
  body: joi.object().keys({
    code: joi.string().required(),
  }),
};

const resendVerification = {
  body: joi.object().keys({
    email: joi.string().required().email().lowercase().trim(),
  }),
};

module.exports = { register, login, refreshToken, logout, verifyEmail, forgotPassword, resetPassword, updateRole, googleLogin, githubLogin, resendVerification };
