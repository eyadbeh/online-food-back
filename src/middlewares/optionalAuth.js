const { verifyToken } = require('../utils/token');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user && user.active) {
        req.user = user;
      }
    } catch (err) {
      // Token invalid — proceed as guest
    }
  }

  req.guestId = req.headers['x-device-id'] || null;
  next();
};

module.exports = optionalAuth;
