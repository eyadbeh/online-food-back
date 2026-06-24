const AuditLog = require('../models/AuditLog');

async function logAction({ user, action, entityType, entityId, metadata }) {
  await AuditLog.create({ user: user?._id || user, action, entityType, entityId, metadata });
}

async function list(query) {
  const { action, entityType, user, page = 1, limit = 20 } = query;
  const filter = {};
  if (action) filter.action = action;
  if (entityType) filter.entityType = entityType;
  if (user) filter.user = user;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return { logs, total, page, limit };
}

module.exports = { logAction, list };
