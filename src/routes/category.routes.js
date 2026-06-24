const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validate');
const categoryValidation = require('../validations/category.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.get('/', categoryController.getAll);
router.get('/:categoryId', validate(categoryValidation.getById), categoryController.getById);

router.use(authenticate, authorize(ROLES.ADMIN));
router.post('/', audit(AUDIT_ACTIONS.CATEGORY_CREATED, 'Category', (req, body) => body?.data?.category?._id), validate(categoryValidation.create), categoryController.create);
router.put('/:categoryId', audit(AUDIT_ACTIONS.CATEGORY_UPDATED, 'Category', (req) => req.params.categoryId), validate(categoryValidation.update), categoryController.update);
router.delete('/:categoryId', audit(AUDIT_ACTIONS.CATEGORY_DELETED, 'Category', (req) => req.params.categoryId), validate(categoryValidation.remove), categoryController.remove);

module.exports = router;
