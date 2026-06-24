const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');

router.get('/health', systemController.getHealth);

module.exports = router;
