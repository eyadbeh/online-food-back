const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.get('/paypal/success', paymentController.paypalSuccess);
router.get('/paypal/cancel', paymentController.paypalCancel);

module.exports = router;
