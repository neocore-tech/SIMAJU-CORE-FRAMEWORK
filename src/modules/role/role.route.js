'use strict';

const express    = require('express');
const router     = express.Router();
const RoleController = require('./role.controller');
const auth       = require('../../middlewares/auth.middleware');
const permission = require('../../middlewares/permission.middleware');

/**
 * Role Routes
 * Base: /api/roles
 */

// CRUD Roles
router.get   ('/',                    auth, permission('roles.view'),   RoleController.index);
router.post  ('/',                    auth, permission('roles.create'), RoleController.store);
router.get   ('/:id',                 auth, permission('roles.view'),   RoleController.show);
router.put   ('/:id',                 auth, permission('roles.update'), RoleController.update);
router.delete('/:id',                 auth, permission('roles.delete'), RoleController.destroy);

// Permission management
router.get   ('/all/permissions',     auth, permission('permissions.manage'), RoleController.getAllPermissions);
router.get   ('/:id/permissions',     auth, permission('roles.view'),         RoleController.getPermissions);
router.post  ('/:id/permissions/sync',auth, permission('permissions.manage'), RoleController.syncPermissions);

module.exports = router;
