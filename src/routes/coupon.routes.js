const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const validate = require('../middlewares/validate');
const couponValidation = require('../validations/coupon.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(couponValidation.list), couponController.list);
router.get('/:couponId', validate(couponValidation.getById), couponController.getById);
router.post('/', audit(AUDIT_ACTIONS.COUPON_CREATED, 'Coupon', (req, body) => body?.data?.coupon?._id), validate(couponValidation.create), couponController.create);
router.put('/:couponId', audit(AUDIT_ACTIONS.COUPON_UPDATED, 'Coupon', (req) => req.params.couponId), validate(couponValidation.update), couponController.update);
router.delete('/:couponId', audit(AUDIT_ACTIONS.COUPON_DELETED, 'Coupon', (req) => req.params.couponId), validate(couponValidation.remove), couponController.remove);

module.exports = router;
