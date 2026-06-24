const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  sendSuccess(res, user);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  sendSuccess(res, user);
});

const changePassword = catchAsync(async (req, res) => {
  const result = await userService.changePassword(req.user._id, req.body);
  sendSuccess(res, result);
});

const uploadAvatar = catchAsync(async (req, res) => {
  const url = await userService.uploadAvatar(req.user._id, req.file);
  sendSuccess(res, { avatar: url });
});

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar };
