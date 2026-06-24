const DeliveryZone = require('../models/DeliveryZone');
const ApiError = require('../utils/apiError');

async function list(query) {
  const { active, sort } = query;
  const filter = {};

  if (active !== undefined) filter.active = active;

  let sortOption = { fee: 1 };
  if (sort === 'fee') sortOption = { fee: 1 };
  else if (sort === '-fee') sortOption = { fee: -1 };
  else if (sort === 'name') sortOption = { 'name.en': 1 };
  else if (sort === '-name') sortOption = { 'name.en': -1 };

  return DeliveryZone.find(filter).sort(sortOption);
}

async function getById(id) {
  const zone = await DeliveryZone.findById(id);
  if (!zone) throw new ApiError(404, 'Delivery zone not found');
  return zone;
}

async function create(data) {
  if (data.isDefaultFallback) {
    await unsetOtherFallbacks();
  }

  const zone = await DeliveryZone.create(data);

  if (zone.isDefaultFallback) {
    await ensureHighestFee(zone._id);
  }

  return zone;
}

async function update(id, data) {
  const zone = await DeliveryZone.findById(id);
  if (!zone) throw new ApiError(404, 'Delivery zone not found');

  const becomingFallback = data.isDefaultFallback === true;
  const ceasingFallback = data.isDefaultFallback === false && zone.isDefaultFallback;

  if (becomingFallback) {
    await unsetOtherFallbacks();
  }

  if (ceasingFallback) {
    const fallbackCount = await DeliveryZone.countDocuments({ isDefaultFallback: true, _id: { $ne: id } });
    if (fallbackCount === 0) {
      throw new ApiError(400, 'Cannot remove the only fallback zone. Set another zone as fallback first.');
    }
  }

  Object.assign(zone, data);
  await zone.save();

  if (zone.isDefaultFallback) {
    await ensureHighestFee(zone._id);
  }

  return zone;
}

async function remove(id) {
  const zone = await DeliveryZone.findById(id);
  if (!zone) throw new ApiError(404, 'Delivery zone not found');

  if (zone.isDefaultFallback) {
    const fallbackCount = await DeliveryZone.countDocuments({ isDefaultFallback: true });
    if (fallbackCount <= 1) {
      throw new ApiError(400, 'Cannot delete the only fallback zone. Set another zone as fallback first.');
    }
  }

  await DeliveryZone.findByIdAndDelete(id);
  return zone;
}

async function unsetOtherFallbacks() {
  await DeliveryZone.updateMany({ isDefaultFallback: true }, { isDefaultFallback: false });
}

async function ensureHighestFee(fallbackZoneId) {
  const highestFeeZone = await DeliveryZone.findOne({ _id: { $ne: fallbackZoneId } })
    .sort({ fee: -1 })
    .limit(1);

  if (highestFeeZone) {
    const fallbackZone = await DeliveryZone.findById(fallbackZoneId);
    if (fallbackZone && fallbackZone.fee < highestFeeZone.fee) {
      fallbackZone.fee = highestFeeZone.fee + 1;
      await fallbackZone.save();
    }
  }
}

async function setDefaultZone(zoneId) {
  await DeliveryZone.updateMany({ isDefaultFallback: true }, { isDefaultFallback: false });
  const zone = await DeliveryZone.findByIdAndUpdate(zoneId, { isDefaultFallback: true }, { new: true });
  if (!zone) throw new ApiError(404, 'Delivery zone not found');
  return zone;
}

module.exports = { list, getById, create, update, remove, setDefaultZone };
