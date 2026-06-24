const settingService = require('../services/setting.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const get = catchAsync(async (req, res) => {
  const settings = await settingService.get();
  sendSuccess(res, { settings });
});

const update = catchAsync(async (req, res) => {
  const settings = await settingService.update(req.body);
  sendSuccess(res, { settings }, 'Settings updated');
});

module.exports = { get, update };
