const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const validate = require('../middlewares/validate');
const wishlistValidation = require('../validations/wishlist.validation');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', wishlistController.get);
router.post('/', validate(wishlistValidation.addProduct), wishlistController.addProduct);
router.post('/:productId', wishlistController.addProduct);
router.delete('/:productId', validate(wishlistValidation.removeProduct), wishlistController.removeProduct);

module.exports = router;
