const Address = require('../models/Address');
const ApiError = require('../utils/apiError');

async function create(userId, data) {
  return Address.create({ ...data, user: userId });
}

async function getAll(userId) {
  return Address.find({ user: userId }).populate('zone', 'name fee estimatedMinutes');
}

async function getById(id, userId) {
  const address = await Address.findOne({ _id: id, user: userId }).populate('zone', 'name fee estimatedMinutes');
  if (!address) throw new ApiError(404, 'Address not found');
  return address;
}

async function update(id, userId, data) {
  const address = await Address.findOneAndUpdate({ _id: id, user: userId }, data, { new: true, runValidators: true });
  if (!address) throw new ApiError(404, 'Address not found or unauthorized');
  return address;
}

async function remove(id, userId) {
  const address = await Address.findOneAndDelete({ _id: id, user: userId });
  if (!address) throw new ApiError(404, 'Address not found or unauthorized');
  return address;
}

module.exports = { create, getAll, getById, update, remove };
