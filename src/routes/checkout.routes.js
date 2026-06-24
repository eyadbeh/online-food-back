const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const validate = require('../middlewares/validate');
const checkoutValidation = require('../validations/checkout.validation');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.post('/validate', validate(checkoutValidation.validate), checkoutController.validate);

module.exports = router;
