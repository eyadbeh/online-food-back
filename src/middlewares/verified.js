const ApiError = require('../utils/apiError');

const verified = (req, res, next) => {
  if (!req.user || !req.user.emailVerified) {
    throw new ApiError(403, 'Please verify your email first');
  }
  next();
};

module.exports = verified;
