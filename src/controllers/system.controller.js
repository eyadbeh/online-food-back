const mongoose = require('mongoose');
const { getIO } = require('../utils/io');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getHealth = catchAsync(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const io = getIO();

  sendSuccess(res, {
    server: 'healthy',
    database: dbState === 1 ? 'healthy' : 'unhealthy',
    socket: io ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
  });
});

module.exports = { getHealth };
