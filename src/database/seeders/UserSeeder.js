'use strict';

const BaseSeeder = require('../base-seeder');
const bcrypt = require('bcryptjs');

/**
 * User Seeder
 * ─────────────────────────────────────────────────────────────
 * Seed user admin default.
 * Ganti password setelah deploy ke production!
 */
class UserSeeder extends BaseSeeder {
  async run() {
    const defaultUsers = [
      {
        name:       'Super Admin',
        email:      'superadmin@simaju.dev',
        password:   await bcrypt.hash('Admin@1234', 12),
        role:       'SUPER_ADMIN',
        status:     'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name:       'Admin',
        email:      'admin@simaju.dev',
        password:   await bcrypt.hash('Admin@1234', 12),
        role:       'ADMIN',
        status:     'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (const user of defaultUsers) {
      const exists = await this.db.table('users').where('email', user.email).first();
      if (!exists) {
        const result = await this.insert('users', user);
        const userId = result?.lastInsertRowid || result?.insertId;
        console.log(`  ✅ User created: ${user.email}`);

        // Assign role
        const role = await this.db.table('roles').where('name', user.role).first();
        if (role && userId) {
          await this.insert('user_roles', {
            user_id: userId,
            role_id: role.id,
            created_at: new Date(),
          });
          console.log(`     → Role assigned: ${user.role}`);
        }
      } else {
        console.log(`  ⏭️  User already exists: ${user.email}`);
      }
    }
  }
}

module.exports = UserSeeder;
