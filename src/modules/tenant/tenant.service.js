'use strict';

const DB = require('../../database');

class TenantService {
  async getAll() {
    return DB.table('tenants').get();
  }

  async create(data) {
    const { name, address, logo, owner_id } = data;
    const result = await DB.table('tenants').insert({
      name,
      address,
      logo,
      owner_id,
      status: 'active',
      created_at: new Date()
    });
    return { id: result.insertId || result._id, name };
  }

  async getByUserId(userId) {
    return DB.table('tenants')
      .join('tenant_users', 'tenants.id', '=', 'tenant_users.tenant_id')
      .where('tenant_users.user_id', userId)
      .select('tenants.*', 'tenant_users.role_in_tenant')
      .first();
  }
}

module.exports = new TenantService();
