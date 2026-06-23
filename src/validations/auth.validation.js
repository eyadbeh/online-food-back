const joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: joi.object().keys({
    firstName: joi.string().required().trim(),
    lastName: joi.string().required().trim(),
    email: joi.string().required().email().lowercase().trim(),
    phone: joi.string().trim(),
    password: password.required(),
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
  }),
};

module.exports = { register, login, refreshToken, logout, verifyEmail, forgotPassword, resetPassword };
