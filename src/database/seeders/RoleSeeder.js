'use strict';

const BaseSeeder = require('../base-seeder');

/**
 * Role Seeder
 * ─────────────────────────────────────────────────────────────
 * Seed roles dasar: SUPER_ADMIN, ADMIN, USER
 */
class RoleSeeder extends BaseSeeder {
  async run() {
    const roles = [
      { name: 'SUPER_ADMIN', description: 'Full access to all resources', status: 'active', created_at: new Date() },
      { name: 'ADMIN',       description: 'Administrative access',        status: 'active', created_at: new Date() },
      { name: 'USER',        description: 'Regular user access',          status: 'active', created_at: new Date() },
    ];

    // Cek apakah sudah ada
    for (const role of roles) {
      const exists = await this.db.table('roles').where('name', role.name).first();
      if (!exists) {
        await this.insert('roles', role);
        console.log(`  ✅ Role created: ${role.name}`);
      } else {
        console.log(`  ⏭️  Role already exists: ${role.name}`);
      }
    }
  }
}

module.exports = RoleSeeder;
