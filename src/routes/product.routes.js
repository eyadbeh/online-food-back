const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validate');
const productValidation = require('../validations/product.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.get('/', validate(productValidation.list), productController.list);
router.get('/:productId', validate(productValidation.getById), productController.getById);

router.use(authenticate);
router.post('/', authorize(ROLES.ADMIN), audit(AUDIT_ACTIONS.PRODUCT_CREATED, 'Product', (req, body) => body?.data?.product?._id), validate(productValidation.create), productController.create);
router.put('/:productId', authorize(ROLES.ADMIN), audit(AUDIT_ACTIONS.PRODUCT_UPDATED, 'Product', (req) => req.params.productId), validate(productValidation.update), productController.update);
router.delete('/:productId', authorize(ROLES.ADMIN), audit(AUDIT_ACTIONS.PRODUCT_DELETED, 'Product', (req) => req.params.productId), validate(productValidation.remove), productController.remove);
router.patch('/:productId/availability', authorize(ROLES.ADMIN), productController.toggleAvailability);

module.exports = router;
