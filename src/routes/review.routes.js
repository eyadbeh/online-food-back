const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const validate = require('../middlewares/validate');
const reviewValidation = require('../validations/review.validation');
const { authenticate } = require('../middlewares/auth');

router.get('/', validate(reviewValidation.list), reviewController.list);
router.get('/:reviewId', validate(reviewValidation.getById), reviewController.getById);

router.use(authenticate);
router.post('/', validate(reviewValidation.create), reviewController.create);
router.put('/:reviewId', validate(reviewValidation.update), reviewController.update);
router.delete('/:reviewId', validate(reviewValidation.remove), reviewController.remove);

module.exports = router;
