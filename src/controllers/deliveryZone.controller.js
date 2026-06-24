const deliveryZoneService = require('../services/deliveryZone.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const zones = await deliveryZoneService.list(req.query);
  sendSuccess(res, { zones });
});

const getById = catchAsync(async (req, res) => {
  const zone = await deliveryZoneService.getById(req.params.zoneId);
  sendSuccess(res, { zone });
});

const create = catchAsync(async (req, res) => {
  const zone = await deliveryZoneService.create(req.body);
  sendSuccess(res, { zone }, 'Delivery zone created', 201);
});

const update = catchAsync(async (req, res) => {
  const zone = await deliveryZoneService.update(req.params.zoneId, req.body);
  sendSuccess(res, { zone }, 'Delivery zone updated');
});

const remove = catchAsync(async (req, res) => {
  await deliveryZoneService.remove(req.params.zoneId);
  sendSuccess(res, null, 'Delivery zone deleted');
});

module.exports = { list, getById, create, update, remove };
