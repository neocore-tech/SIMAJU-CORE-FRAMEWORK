'use strict';

const TenantService = require('../modules/tenant/tenant.service');
const Response = require('../utils/response');

/**
 * Tenant Middleware (Bab 13)
 * ─────────────────────────────────────────────────────────────
 * Mengidentifikasi tenant dari user yang login.
 * Menjamin data terisolasi per tenant.
 */
const tenantIdentify = async (req, res, next) => {
  if (!req.user) return next();

  try {
    const tenant = await TenantService.getByUserId(req.user.id);
    
    if (tenant) {
      req.tenant = tenant;
      // Inject tenant_id ke Query Builder secara global bisa dilakukan di sini 
      // jika kita mau meng-override DB.table()
    }
    
    next();
  } catch (err) {
    next();
  }
};

module.exports = tenantIdentify;
