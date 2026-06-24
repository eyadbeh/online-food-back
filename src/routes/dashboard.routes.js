const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get('/summary', dashboardController.getSummary);
router.get('/revenue-per-day', dashboardController.getRevenuePerDay);
router.get('/top-products', dashboardController.getTopSellingProducts);

module.exports = router;
