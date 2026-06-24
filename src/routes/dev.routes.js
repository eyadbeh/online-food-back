const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev.controller');

router.post('/seed', devController.seed);
router.delete('/reset', devController.reset);

module.exports = router;
