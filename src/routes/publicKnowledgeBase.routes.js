const express = require('express');
const router = express.Router();
const knowledgeBaseController = require('../controllers/knowledgeBase.controller');
const validate = require('../middlewares/validate');
const knowledgeBaseValidation = require('../validations/knowledgeBase.validation');

router.get('/', validate(knowledgeBaseValidation.list), knowledgeBaseController.list);
router.get('/:knowledgeId', validate(knowledgeBaseValidation.getById), knowledgeBaseController.getById);

module.exports = router;
