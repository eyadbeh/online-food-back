const joi = require('joi');

const objectId = joi.string().hex().length(24).message('Invalid ID');

const password = joi.string().min(8).max(128).message('Password must be 8-128 characters');

module.exports = { objectId, password };
