const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const { authenticate } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');

router.use(authenticate);

router.get('/me', validate(userValidation.getProfile), userController.getProfile);
router.put('/me', validate(userValidation.updateProfile), userController.updateProfile);
router.put('/change-password', validate(userValidation.changePassword), userController.changePassword);
router.post('/avatar', uploadSingle, userController.uploadAvatar);

module.exports = router;
