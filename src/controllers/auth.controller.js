const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  sendSuccess(res, { user, accessToken, refreshToken }, 'Registration successful', 201);
});

const login = catchAsync(async (req, res) => {
  const deviceInfo = { device: req.headers['user-agent'], ip: req.ip };
  const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password, deviceInfo);
  sendSuccess(res, { user, accessToken, refreshToken }, 'Login successful');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  sendSuccess(res, tokens, 'Tokens refreshed');
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user._id, req.body.refreshToken);
  sendSuccess(res, null, 'Logged out successfully');
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.params.token);
  sendSuccess(res, null, 'Email verified successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  sendSuccess(res, null, 'If that email exists, a reset link has been sent');
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  sendSuccess(res, null, 'Password reset successfully');
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  sendSuccess(res, { user });
});

const updateRole = catchAsync(async (req, res) => {
  const user = await authService.updateUserRole(req.params.userId, req.body.role, req.user._id);
  sendSuccess(res, { user }, 'User role updated');
});

const googleLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const result = await authService.googleLogin(idToken);
  sendSuccess(res, result, 'Google login successful');
});

const githubLogin = catchAsync(async (req, res) => {
  const { code } = req.body;
  const result = await authService.githubLogin(code);
  sendSuccess(res, result, 'GitHub login successful');
});

module.exports = { register, login, refreshTokens, logout, verifyEmail, forgotPassword, resetPassword, getMe, updateRole, googleLogin, githubLogin };
