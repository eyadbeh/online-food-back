const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validate');
const categoryValidation = require('../validations/category.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.get('/', categoryController.getAll);
router.get('/:categoryId', validate(categoryValidation.getById), categoryController.getById);

router.use(authenticate, authorize(ROLES.ADMIN));
router.post('/', validate(categoryValidation.create), categoryController.create);
router.put('/:categoryId', validate(categoryValidation.update), categoryController.update);
router.delete('/:categoryId', validate(categoryValidation.remove), categoryController.remove);

module.exports = router;
