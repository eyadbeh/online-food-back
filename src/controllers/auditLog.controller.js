const auditLogService = require('../services/auditLog.service');
const catchAsync = require('../utils/catchAsync');
const { sendPaginated } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const { logs, total, page, limit } = await auditLogService.list(req.query);
  sendPaginated(res, { logs }, total, page, limit);
});

module.exports = { list };
