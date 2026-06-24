const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const validate = require('../middlewares/validate');
const couponValidation = require('../validations/coupon.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(couponValidation.list), couponController.list);
router.get('/:couponId', validate(couponValidation.getById), couponController.getById);
router.post('/', validate(couponValidation.create), couponController.create);
router.put('/:couponId', validate(couponValidation.update), couponController.update);
router.delete('/:couponId', validate(couponValidation.remove), couponController.remove);

module.exports = router;
