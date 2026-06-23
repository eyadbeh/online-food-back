const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateEmailVerificationToken,
  generateResetPasswordToken,
} = require('../utils/token');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/email');
const { logAction } = require('./auditLog.service');

async function register({ firstName, lastName, email, phone, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailToken = generateEmailVerificationToken();

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    emailVerificationToken: emailToken,
  });

  sendVerificationEmail(email, emailToken).catch(() => {});

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { user: { id: user._id, firstName, lastName, email, role: user.role }, accessToken, refreshToken };
}

async function login(email, password, deviceInfo) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  if (!user.active) throw new ApiError(403, 'Account is deactivated');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  await logAction({
    user: user._id,
    action: 'LOGIN_SUCCESS',
    entityType: 'User',
    entityId: user._id,
    metadata: { device: deviceInfo?.device, ip: deviceInfo?.ip },
  });

  return {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

  let decoded;
  try {
    decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.active) throw new ApiError(401, 'User not found or deactivated');
  if (user.refreshToken !== refreshToken) throw new ApiError(401, 'Refresh token reuse detected');

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

async function logout(userId, refreshToken) {
  const user = await User.findById(userId);
  if (user && user.refreshToken === refreshToken) {
    user.refreshToken = null;
    await user.save();
  }
}

async function verifyEmail(token) {
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) throw new ApiError(400, 'Invalid or expired verification token');

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return;

  const resetToken = generateResetPasswordToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  sendResetPasswordEmail(email, resetToken).catch(() => {});
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = null;
  await user.save();
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
