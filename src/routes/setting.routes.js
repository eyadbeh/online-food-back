const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const validate = require('../middlewares/validate');
const settingValidation = require('../validations/setting.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.get('/', settingController.get);

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));
router.put('/', audit(AUDIT_ACTIONS.SETTINGS_UPDATED, 'Settings'), validate(settingValidation.update), settingController.update);

module.exports = router;
