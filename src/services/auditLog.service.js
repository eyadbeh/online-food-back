const AuditLog = require('../models/AuditLog');

async function logAction({ user, action, entityType, entityId, metadata }) {
  await AuditLog.create({ user: user?._id || user, action, entityType, entityId, metadata });
}

module.exports = { logAction };
