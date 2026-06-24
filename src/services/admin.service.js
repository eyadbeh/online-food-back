const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

async function listAdmins({ page = 1, limit = 20, search } = {}) {
  const filter = { role: 'admin' };

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [admins, total] = await Promise.all([
    User.find(filter).select('-password -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { admins, total, page, limit };
}

async function getAdmin(adminId) {
  const admin = await User.findOne({ _id: adminId, role: 'admin' }).select('-password -refreshToken');
  if (!admin) throw new ApiError(404, 'Admin not found');
  return admin;
}

async function createAdmin({ firstName, lastName, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already in use');

  const generatedPassword = password || crypto.randomBytes(16).toString('hex');
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || 'admin',
    emailVerified: true,
    active: true,
  });

  const admin = await User.findById(user._id).select('-password -refreshToken');
  return { admin, generatedPassword: password ? undefined : generatedPassword };
}

async function updateAdmin(adminId, updates) {
  const admin = await User.findOneAndUpdate(
    { _id: adminId, role: 'admin' },
    updates,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!admin) throw new ApiError(404, 'Admin not found');
  return admin;
}

async function removeAdmin(adminId, currentAdminId) {
  if (adminId === currentAdminId.toString()) {
    throw new ApiError(400, 'Cannot delete yourself');
  }

  const admin = await User.findOne({ _id: adminId, role: 'admin' });
  if (!admin) throw new ApiError(404, 'Admin not found');

  const activeAdminCount = await User.countDocuments({ role: 'admin', active: true });
  if (activeAdminCount <= 1) {
    throw new ApiError(400, 'Cannot delete the last active admin');
  }

  admin.active = false;
  await admin.save();
  return admin;
}

module.exports = { listAdmins, getAdmin, createAdmin, updateAdmin, removeAdmin };
