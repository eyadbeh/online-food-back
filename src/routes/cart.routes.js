const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const validate = require('../middlewares/validate');
const cartValidation = require('../validations/cart.validation');
const optionalAuth = require('../middlewares/optionalAuth');
const { authenticate } = require('../middlewares/auth');

router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', validate(cartValidation.addItem), cartController.addItem);
router.put('/items/:productId', validate(cartValidation.updateItem), cartController.updateItem);
router.delete('/items/:productId', validate(cartValidation.removeItem), cartController.removeItem);
router.delete('/', cartController.clearCart);
router.post('/merge', authenticate, validate(cartValidation.merge), cartController.mergeGuestCart);

module.exports = router;
