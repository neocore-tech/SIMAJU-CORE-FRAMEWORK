'use strict';

const RoleService = require('../modules/role/role.service');
const Response = require('../utils/response');

/**
 * Permission Middleware (Bab 12)
 * ─────────────────────────────────────────────────────────────
 * Mengecek apakah user memiliki hak akses tertentu.
 * 
 * Usage:
 *   router.post('/', can('create-product'), ProductController.store);
 */
const can = (permissionName) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    try {
      const permissions = await RoleService.getUserPermissions(userId);
      
      if (permissions.includes(permissionName) || permissions.includes('admin-access')) {
        return next();
      }

      return Response.error(res, `Forbidden: You don't have [${permissionName}] permission`, 403);
    } catch (err) {
      return Response.error(res, 'Error checking permissions', 500);
    }
  };
};

module.exports = can;
