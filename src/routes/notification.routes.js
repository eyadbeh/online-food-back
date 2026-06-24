const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const validate = require('../middlewares/validate');
const notificationValidation = require('../validations/notification.validation');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', validate(notificationValidation.list), notificationController.list);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:notificationId/read', validate(notificationValidation.markAsRead), notificationController.markAsRead);
router.delete('/:notificationId', validate(notificationValidation.remove), notificationController.remove);

module.exports = router;
