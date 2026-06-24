const Setting = require('../models/Setting');
const ApiError = require('../utils/apiError');

async function get() {
  const settings = await Setting.findOne();
  if (!settings) throw new ApiError(404, 'Settings not found');
  return settings;
}

async function update(data) {
  const settings = await Setting.findOne();
  if (!settings) throw new ApiError(404, 'Settings not found');

  Object.assign(settings, data);
  await settings.save();

  return settings;
}

module.exports = { get, update };
