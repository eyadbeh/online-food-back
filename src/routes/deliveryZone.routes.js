const express = require('express');
const router = express.Router();
const deliveryZoneController = require('../controllers/deliveryZone.controller');
const validate = require('../middlewares/validate');
const deliveryZoneValidation = require('../validations/deliveryZone.validation');
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES, AUDIT_ACTIONS } = require('../constants');
const { audit } = require('../middlewares/audit');

router.get('/', validate(deliveryZoneValidation.list), deliveryZoneController.list);
router.get('/:zoneId', validate(deliveryZoneValidation.getById), deliveryZoneController.getById);

router.use(authenticate, authorize(ROLES.ADMIN));
router.post('/', audit(AUDIT_ACTIONS.ZONE_CREATED, 'Zone', (req, body) => body?.data?.zone?._id), validate(deliveryZoneValidation.create), deliveryZoneController.create);
router.put('/:zoneId', audit(AUDIT_ACTIONS.ZONE_UPDATED, 'Zone', (req) => req.params.zoneId), validate(deliveryZoneValidation.update), deliveryZoneController.update);
router.delete('/:zoneId', audit(AUDIT_ACTIONS.ZONE_DELETED, 'Zone', (req) => req.params.zoneId), validate(deliveryZoneValidation.remove), deliveryZoneController.remove);

module.exports = router;
