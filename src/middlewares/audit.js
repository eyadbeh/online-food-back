const { logAction } = require('../services/auditLog.service');

function audit(action, entityType, getEntityId) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (res.statusCode < 400 && body?.success) {
        const entityId = typeof getEntityId === 'function'
          ? getEntityId(req, body)
          : req.params.id;
        if (entityId) {
          logAction({ user: req.user._id, action, entityType, entityId }).catch(() => {});
        }
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { audit };
