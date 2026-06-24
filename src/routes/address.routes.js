const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const validate = require('../middlewares/validate');
const addressValidation = require('../validations/address.validation');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.post('/', validate(addressValidation.create), addressController.create);
router.get('/', addressController.getAll);
router.get('/:addressId', validate(addressValidation.getById), addressController.getById);
router.put('/:addressId', validate(addressValidation.update), addressController.update);
router.delete('/:addressId', validate(addressValidation.remove), addressController.remove);

module.exports = router;
