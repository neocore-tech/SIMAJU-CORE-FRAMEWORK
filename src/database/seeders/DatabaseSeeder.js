'use strict';

const BaseSeeder = require('../base-seeder');

/**
 * Database Seeder — Master Entry Point
 * ─────────────────────────────────────────────────────────────
 * Panggil semua seeder di sini secara berurutan.
 */
class DatabaseSeeder extends BaseSeeder {
  async run() {
    console.log('\n🌱 Starting database seeding...\n');

    const seeders = [
      'RoleSeeder',
      'PermissionSeeder',
      'UserSeeder',
    ];

    for (const name of seeders) {
      const SeederClass = require(`./${name}`);
      const seeder = new SeederClass(this.db);
      console.log(`▶ Running ${name}...`);
      await seeder.run();
    }

    console.log('\n✅ All seeders completed!\n');
  }
}

module.exports = DatabaseSeeder;
