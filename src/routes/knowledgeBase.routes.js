const express = require('express');
const router = express.Router();
const knowledgeBaseController = require('../controllers/knowledgeBase.controller');
const validate = require('../middlewares/validate');
const knowledgeBaseValidation = require('../validations/knowledgeBase.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.get('/', validate(knowledgeBaseValidation.list), knowledgeBaseController.list);
router.get('/:knowledgeId', validate(knowledgeBaseValidation.getById), knowledgeBaseController.getById);

router.use(authenticate, authorize(ROLES.ADMIN));
router.post('/', audit(AUDIT_ACTIONS.KNOWLEDGE_BASE_CREATED, 'KnowledgeBase', (req, body) => body?.data?.knowledgeBase?._id), validate(knowledgeBaseValidation.create), knowledgeBaseController.create);
router.put('/:knowledgeId', audit(AUDIT_ACTIONS.KNOWLEDGE_BASE_UPDATED, 'KnowledgeBase', (req) => req.params.knowledgeId), validate(knowledgeBaseValidation.update), knowledgeBaseController.update);
router.delete('/:knowledgeId', audit(AUDIT_ACTIONS.KNOWLEDGE_BASE_DELETED, 'KnowledgeBase', (req) => req.params.knowledgeId), validate(knowledgeBaseValidation.remove), knowledgeBaseController.remove);

module.exports = router;
