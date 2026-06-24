const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  sendVerificationEmail(email, emailToken).catch((err) => console.error('Failed to send verification email:', err));

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
  if (!user.emailVerified) throw new ApiError(403, 'Please verify your email first');

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
  if (user.emailVerificationExpires && user.emailVerificationExpires < Date.now()) {
    throw new ApiError(400, 'Verification token has expired. Please request a new one.');
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return;

  const resetToken = generateResetPasswordToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  sendResetPasswordEmail(email, resetToken).catch((err) => console.error('Failed to send reset password email:', err));
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

async function updateUserRole(userId, newRole, adminId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === newRole) throw new ApiError(400, 'User already has this role');

  const oldRole = user.role;
  user.role = newRole;
  await user.save();

  await logAction({
    user: adminId,
    action: 'USER_ROLE_CHANGED',
    entityType: 'User',
    entityId: user._id,
    metadata: { from: oldRole, to: newRole },
  });

  return user;
}

async function googleLogin(idToken) {
  const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!googleRes.ok) throw new ApiError(401, 'Invalid Google token');

  const profile = await googleRes.json();
  if (profile.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(401, 'Invalid token audience');
  }

  let user = await User.findOne({ email: profile.email });
  if (!user) {
    const nameParts = (profile.name || '').split(' ');
    user = await User.create({
      firstName: nameParts[0] || profile.given_name || 'Google',
      lastName: nameParts.slice(1).join(' ') || profile.family_name || 'User',
      email: profile.email,
      avatar: profile.picture,
      provider: 'google',
      emailVerified: true,
      password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
    });
  } else if (user.provider !== 'google') {
    user.provider = 'google';
    user.emailVerified = true;
    if (profile.picture) user.avatar = profile.picture;
    await user.save();
  }

  if (!user.active) throw new ApiError(403, 'Account is deactivated');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatar: user.avatar },
    accessToken,
    refreshToken,
  };
}

async function githubLogin(code) {
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  if (!tokenRes.ok) throw new ApiError(401, 'Failed to exchange GitHub code');

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new ApiError(401, 'Invalid GitHub code');

  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/json' },
  });
  if (!userRes.ok) throw new ApiError(401, 'Failed to fetch GitHub profile');

  const profile = await userRes.json();
  const email = profile.email || `${profile.login}@github.local`;

  let user = await User.findOne({ email });
  if (!user) {
    const nameParts = (profile.name || profile.login || '').split(' ');
    user = await User.create({
      firstName: nameParts[0] || 'GitHub',
      lastName: nameParts.slice(1).join(' ') || 'User',
      email,
      avatar: profile.avatar_url,
      provider: 'github',
      emailVerified: true,
      password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
    });
  } else if (user.provider !== 'github') {
    user.provider = 'github';
    user.emailVerified = true;
    if (profile.avatar_url) user.avatar = profile.avatar_url;
    await user.save();
  }

  if (!user.active) throw new ApiError(403, 'Account is deactivated');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatar: user.avatar },
    accessToken,
    refreshToken,
  };
}

module.exports = {
  register,
  login,
  googleLogin,
  githubLogin,
  refreshTokens,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateUserRole,
};
