'use strict';

let TenantService = null;
try {
  TenantService = require('../modules/tenant/tenant.service');
} catch (e) {
  // Tenant module is not installed (sparse-checkout)
}

/**
 * Tenant Middleware (Bab 13)
 * ─────────────────────────────────────────────────────────────
 * Mengidentifikasi tenant dari user yang login.
 * Menjamin data terisolasi per tenant.
 */
const tenantIdentify = async (req, res, next) => {
  if (!req.user || !TenantService) return next();

  try {
    const tenant = await TenantService.getByUserId(req.user.id);
    
    if (tenant) {
      req.tenant = tenant;
    }
    
    next();
  } catch (err) {
    next();
  }
};

module.exports = tenantIdentify;
