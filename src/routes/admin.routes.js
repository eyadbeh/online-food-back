const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate');
const adminValidation = require('../validations/admin.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(adminValidation.list), adminController.list);
router.get('/:adminId', validate(adminValidation.getById), adminController.getById);
router.post('/', validate(adminValidation.create), adminController.create);
router.put('/:adminId', validate(adminValidation.update), adminController.update);
router.delete('/:adminId', validate(adminValidation.remove), adminController.remove);

module.exports = router;
