const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const validate = require('../middlewares/validate');
const aiValidation = require('../validations/ai.validation');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.post('/chat', validate(aiValidation.chat), aiController.chat);
router.get('/conversations', aiController.getConversations);
router.get('/conversations/:conversationId/messages', validate(aiValidation.getMessages), aiController.getMessages);
router.delete('/conversations/:conversationId', validate(aiValidation.remove), aiController.remove);

module.exports = router;
