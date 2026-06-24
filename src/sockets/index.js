const { verifyToken } = require('../utils/token');
const User = require('../models/User');

const setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (!user || !user.active) {
        return next(new Error('User not found or deactivated'));
      }
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user._id})`);

    socket.join(`user:${socket.user._id}`);

    if (socket.user.role === 'admin') {
      socket.join('admins');
    }

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocketHandlers;
