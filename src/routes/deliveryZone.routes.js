const express = require('express');
const router = express.Router();
const deliveryZoneController = require('../controllers/deliveryZone.controller');
const validate = require('../middlewares/validate');
const deliveryZoneValidation = require('../validations/deliveryZone.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');

router.get('/', validate(deliveryZoneValidation.list), deliveryZoneController.list);
router.get('/:zoneId', validate(deliveryZoneValidation.getById), deliveryZoneController.getById);

router.use(authenticate, authorize(ROLES.ADMIN));
router.post('/', validate(deliveryZoneValidation.create), deliveryZoneController.create);
router.put('/:zoneId', validate(deliveryZoneValidation.update), deliveryZoneController.update);
router.delete('/:zoneId', validate(deliveryZoneValidation.remove), deliveryZoneController.remove);

module.exports = router;
