'use strict';

const RoleService  = require('./role.service');
const Response     = require('../../utils/response');

/**
 * Role Controller
 * Mengelola CRUD roles dan assignment permissions.
 */
class RoleController {

  static async index(req, res) {
    try {
      const roles = await RoleService.getAll();
      return Response.success(res, roles, 'Roles fetched successfully');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async store(req, res) {
    try {
      const role = await RoleService.create(req.body);
      return Response.success(res, role, 'Role created successfully', 201);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async show(req, res) {
    try {
      const role = await RoleService.findById(req.params.id);
      if (!role) return Response.error(res, 'Role not found', 404);
      return Response.success(res, role);
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      await RoleService.update(req.params.id, req.body);
      return Response.success(res, null, 'Role updated successfully');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async destroy(req, res) {
    try {
      await RoleService.delete(req.params.id);
      return Response.success(res, null, 'Role deleted successfully');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async getPermissions(req, res) {
    try {
      const permissions = await RoleService.getPermissions(req.params.id);
      return Response.success(res, permissions, 'Permissions fetched successfully');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async syncPermissions(req, res) {
    try {
      const { permissionIds } = req.body;
      await RoleService.syncPermissions(req.params.id, permissionIds);
      return Response.success(res, null, 'Permissions synced successfully');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }

  static async getAllPermissions(req, res) {
    try {
      const permissions = await RoleService.getAllPermissions();
      return Response.success(res, permissions, 'All permissions fetched');
    } catch (err) {
      return Response.error(res, err.message);
    }
  }
}

module.exports = RoleController;
