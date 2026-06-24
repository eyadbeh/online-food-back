const addressService = require('../services/address.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const create = catchAsync(async (req, res) => {
  const address = await addressService.create(req.user._id, req.body);
  sendSuccess(res, { address }, 'Address created', 201);
});

const getAll = catchAsync(async (req, res) => {
  const addresses = await addressService.getAll(req.user._id);
  sendSuccess(res, { addresses });
});

const getById = catchAsync(async (req, res) => {
  const address = await addressService.getById(req.params.addressId, req.user._id);
  sendSuccess(res, { address });
});

const update = catchAsync(async (req, res) => {
  const address = await addressService.update(req.params.addressId, req.user._id, req.body);
  sendSuccess(res, { address }, 'Address updated');
});

const remove = catchAsync(async (req, res) => {
  await addressService.remove(req.params.addressId, req.user._id);
  sendSuccess(res, null, 'Address deleted');
});

const setDefault = catchAsync(async (req, res) => {
  const address = await addressService.setDefaultAddress(req.user._id, req.params.addressId);
  sendSuccess(res, { address }, 'Default address updated');
});

module.exports = { create, getAll, getById, update, remove, setDefault };
