const User = require('../models/User');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const { uploadToCloudinary } = require('../middlewares/upload');

async function getProfile(userId) {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

async function updateProfile(userId, { firstName, lastName, phone }) {
  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (phone !== undefined) updates.phone = phone;

  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: 'Password changed successfully' };
}

async function uploadAvatar(userId, file) {
  if (!file) throw new ApiError(400, 'No file uploaded');

  const url = await uploadToCloudinary(file.buffer, 'avatars');

  const user = await User.findByIdAndUpdate(userId, { avatar: url }, { new: true }).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');

  return url;
}

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar };
