const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.use(authenticate);

router.post('/', validate(orderValidation.createOrder), orderController.createOrder);
router.get('/', validate(orderValidation.list), orderController.getMyOrders);
router.get('/:orderId', validate(orderValidation.getById), orderController.getOrder);
router.post('/:orderId/cancel', validate(orderValidation.cancel), orderController.cancelOrder);

router.get('/admin/all', authorize(ROLES.ADMIN), validate(orderValidation.list), orderController.getAllOrders);
router.patch('/:orderId/status', authorize(ROLES.ADMIN), validate(orderValidation.updateStatus), orderController.updateOrderStatus);

module.exports = router;
