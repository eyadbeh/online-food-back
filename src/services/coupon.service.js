const Coupon = require('../models/Coupon');
const ApiError = require('../utils/apiError');

async function list(query) {
  const { active, type, search, page = 1, limit = 20 } = query;
  const filter = {};

  if (active !== undefined) filter.active = active;
  if (type) filter.type = type;
  if (search) filter.code = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(filter),
  ]);

  return { coupons, total, page, limit };
}

async function getById(id) {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  return coupon;
}

async function create(data) {
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existing) throw new ApiError(400, 'Coupon code already exists');

  return Coupon.create(data);
}

async function update(id, data) {
  if (data.code) {
    const existing = await Coupon.findOne({ code: data.code.toUpperCase(), _id: { $ne: id } });
    if (existing) throw new ApiError(400, 'Coupon code already exists');
  }

  const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  return coupon;
}

async function remove(id) {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  return coupon;
}

module.exports = { list, getById, create, update, remove };
