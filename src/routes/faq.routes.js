const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const validate = require('../middlewares/validate');
const faqValidation = require('../validations/faq.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.get('/', validate(faqValidation.list), faqController.list);
router.get('/:faqId', validate(faqValidation.getById), faqController.getById);

router.use(authenticate, authorize(ROLES.ADMIN));
router.post('/', audit(AUDIT_ACTIONS.FAQ_CREATED, 'FAQ', (req, body) => body?.data?.faq?._id), validate(faqValidation.create), faqController.create);
router.put('/:faqId', audit(AUDIT_ACTIONS.FAQ_UPDATED, 'FAQ', (req) => req.params.faqId), validate(faqValidation.update), faqController.update);
router.delete('/:faqId', audit(AUDIT_ACTIONS.FAQ_DELETED, 'FAQ', (req) => req.params.faqId), validate(faqValidation.remove), faqController.remove);

module.exports = router;
