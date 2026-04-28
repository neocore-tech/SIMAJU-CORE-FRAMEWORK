'use strict';

const DB = require('../../database');

/**
 * Role Service (updated)
 * Business logic untuk manajemen roles & permissions.
 */
class RoleService {

  async getAll() {
    return DB.table('roles').orderBy('name').get();
  }

  async findById(id) {
    return DB.table('roles').where('id', id).first();
  }

  async create(data) {
    const { name, description } = data;
    const result = await DB.table('roles').insert({
      name: name.toUpperCase(),
      description,
      status: 'active',
      created_at: new Date(),
    });
    return { id: result.insertId || result.lastInsertRowid, name };
  }

  async update(id, data) {
    const { name, description, status } = data;
    await DB.table('roles').where('id', id).update({
      ...(name        && { name: name.toUpperCase() }),
      ...(description && { description }),
      ...(status      && { status }),
    });
    return true;
  }

  async delete(id) {
    await DB.table('role_permissions').where('role_id', id).delete();
    await DB.table('user_roles').where('role_id', id).delete();
    await DB.table('roles').where('id', id).delete();
    return true;
  }

  async assignToUser(userId, roleId) {
    const existing = await DB.table('user_roles')
      .where('user_id', userId)
      .where('role_id', roleId)
      .first();

    if (!existing) {
      await DB.table('user_roles').insert({
        user_id: userId,
        role_id: roleId,
        created_at: new Date(),
      });
    }
    return true;
  }

  async getPermissions(roleId) {
    return DB.table('permissions')
      .join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
      .where('role_permissions.role_id', roleId)
      .select('permissions.id', 'permissions.name', 'permissions.description', 'permissions.module')
      .get();
  }

  async getAllPermissions() {
    return DB.table('permissions').orderBy('module').orderBy('name').get();
  }

  async syncPermissions(roleId, permissionIds = []) {
    // Hapus semua permission lama
    await DB.table('role_permissions').where('role_id', roleId).delete();

    // Insert permission baru
    for (const permId of permissionIds) {
      await DB.table('role_permissions').insert({
        role_id: roleId,
        permission_id: permId,
        created_at: new Date(),
      });
    }
    return true;
  }

  async getUserPermissions(userId) {
    const permissions = await DB.table('permissions')
      .join('role_permissions', 'permissions.id', '=', 'role_permissions.permission_id')
      .join('user_roles', 'role_permissions.role_id', '=', 'user_roles.role_id')
      .where('user_roles.user_id', userId)
      .select('permissions.name')
      .get();

    return permissions.map(p => p.name);
  }
}

module.exports = new RoleService();
