'use strict';

const BaseSeeder = require('../base-seeder');

/**
 * Permission Seeder
 * ─────────────────────────────────────────────────────────────
 * Seed permissions berdasarkan modul yang ada.
 * Format: {modul}.{aksi} — contoh: users.view, users.create
 */
class PermissionSeeder extends BaseSeeder {
  async run() {
    const modules = [
      'users', 'roles', 'products', 'categories', 'suppliers',
      'sales', 'purchases', 'inventory', 'warehouse',
      'crm', 'lms', 'cms', 'analytics',
      'audit', 'communication', 'payment', 'file',
      'config', 'plugins', 'tenants',
    ];

    const actions = ['view', 'create', 'update', 'delete'];

    const permissions = [];
    for (const mod of modules) {
      for (const action of actions) {
        permissions.push({
          name: `${mod}.${action}`,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${mod}`,
          module: mod,
          created_at: new Date(),
        });
      }
    }

    // Tambah permissions khusus
    permissions.push(
      { name: 'roles.assign',      description: 'Assign roles to users',         module: 'roles',  created_at: new Date() },
      { name: 'permissions.manage',description: 'Manage role permissions',        module: 'roles',  created_at: new Date() },
      { name: 'reports.export',    description: 'Export reports to file',         module: 'reports',created_at: new Date() },
    );

    for (const perm of permissions) {
      const exists = await this.db.table('permissions').where('name', perm.name).first();
      if (!exists) {
        await this.insert('permissions', perm);
      }
    }

    console.log(`  ✅ Inserted ${permissions.length} permissions`);

    // Assign semua permissions ke SUPER_ADMIN
    await this._assignAllToSuperAdmin(permissions);
  }

  async _assignAllToSuperAdmin(permissions) {
    const superAdmin = await this.db.table('roles').where('name', 'SUPER_ADMIN').first();
    if (!superAdmin) return;

    const allPerms = await this.db.table('permissions').get();
    for (const perm of allPerms) {
      const exists = await this.db.table('role_permissions')
        .where('role_id', superAdmin.id)
        .where('permission_id', perm.id)
        .first();

      if (!exists) {
        await this.insert('role_permissions', {
          role_id: superAdmin.id,
          permission_id: perm.id,
          created_at: new Date(),
        });
      }
    }
    console.log(`  ✅ All permissions assigned to SUPER_ADMIN`);
  }
}

module.exports = PermissionSeeder;
