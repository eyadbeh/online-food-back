const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
const { authenticate } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshTokens);
router.post('/logout', authenticate, validate(authValidation.logout), authController.logout);
router.get('/verify-email/:token', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/forgot-password', authLimiter, validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(authValidation.resetPassword), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
