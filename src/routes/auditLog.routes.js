const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLog.controller');
const validate = require('../middlewares/validate');
const auditLogValidation = require('../validations/auditLog.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(auditLogValidation.list), auditLogController.list);

module.exports = router;
