'use strict';

const DB = require('../../database');

class RoleService {
  async getAll() {
    return DB.table('roles').get();
  }

  async create(data) {
    const { name, description } = data;
    const result = await DB.table('roles').insert({
      name: name.toUpperCase(),
      description,
      status: 'active',
      created_at: new Date()
    });
    return { id: result.insertId || result._id, name };
  }

  async assignToUser(userId, roleId) {
    // Cek jika sudah ada
    const existing = await DB.table('user_roles')
      .where('user_id', userId)
      .where('role_id', roleId)
      .first();

    if (!existing) {
      await DB.table('user_roles').insert({
        user_id: userId,
        role_id: roleId,
        created_at: new Date()
      });
    }
    return true;
  }

  async getUserPermissions(userId) {
    // Join users -> user_roles -> roles -> role_permissions -> permissions
    // Untuk simplifikasi, kita asumsikan tabel sudah ada
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
