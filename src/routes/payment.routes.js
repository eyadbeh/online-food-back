const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/paymob/callback', paymentController.paymobCallback);
router.get('/paymob/success', paymentController.paymobRedirect);
router.get('/paymob/cancel', paymentController.paymobRedirect);

module.exports = router;
