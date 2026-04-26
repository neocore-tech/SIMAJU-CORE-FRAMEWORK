'use strict';

/**
 * Core Middleware Registry
 * ─────────────────────────────────────────────────────────────
 * Memudahkan import middleware inti dari satu tempat.
 */
module.exports = {
  auth:       require('../middlewares/auth.middleware'),
  permission: require('../middlewares/permission.middleware'),
  tenant:     require('../middlewares/tenant.middleware'),
  activity:   require('../middlewares/activity-log.middleware'),
  rateLimit:  require('../middlewares/rate-limit.middleware'),
  apiKey:     require('../middlewares/api-key.middleware'),
};
