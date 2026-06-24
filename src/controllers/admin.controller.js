const adminService = require('../services/admin.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const list = catchAsync(async (req, res) => {
  const { admins, total, page, limit } = await adminService.listAdmins(req.query);
  sendPaginated(res, { admins }, total, page, limit);
});

const getById = catchAsync(async (req, res) => {
  const admin = await adminService.getAdmin(req.params.adminId);
  sendSuccess(res, { admin });
});

const create = catchAsync(async (req, res) => {
  const result = await adminService.createAdmin(req.body);
  const data = { admin: result.admin };
  if (result.generatedPassword) data.generatedPassword = result.generatedPassword;
  sendSuccess(res, data, 'Admin created', 201);
});

const update = catchAsync(async (req, res) => {
  const admin = await adminService.updateAdmin(req.params.adminId, req.body);
  sendSuccess(res, { admin }, 'Admin updated');
});

const remove = catchAsync(async (req, res) => {
  await adminService.removeAdmin(req.params.adminId, req.user._id);
  sendSuccess(res, null, 'Admin deactivated');
});

module.exports = { list, getById, create, update, remove };
