const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validate');
const productValidation = require('../validations/product.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.get('/', validate(productValidation.list), productController.list);
router.get('/:productId', validate(productValidation.getById), productController.getById);

router.use(authenticate);
router.post('/', authorize(ROLES.ADMIN), validate(productValidation.create), productController.create);
router.put('/:productId', authorize(ROLES.ADMIN), validate(productValidation.update), productController.update);
router.delete('/:productId', authorize(ROLES.ADMIN), validate(productValidation.remove), productController.remove);
router.patch('/:productId/availability', authorize(ROLES.ADMIN), productController.toggleAvailability);

module.exports = router;
