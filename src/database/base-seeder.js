'use strict';

/**
 * Base Seeder Class
 * ─────────────────────────────────────────────────────────────
 * Semua seeder harus extend class ini.
 *
 * @example
 * class UserSeeder extends BaseSeeder {
 *   async run() {
 *     await this.db.table('users').insert({ ... });
 *   }
 * }
 */
class BaseSeeder {
  constructor(db) {
    this.db = db;
  }

  /**
   * Override method ini di setiap seeder.
   */
  async run() {
    throw new Error('Seeder must implement run() method');
  }

  /**
   * Helper: truncate tabel sebelum seed (opsional)
   */
  async truncate(tableName) {
    await this.db.raw(`DELETE FROM ${tableName}`);
    console.log(`  🗑️  Truncated: ${tableName}`);
  }

  /**
   * Helper: insert satu row
   */
  async insert(tableName, data) {
    return this.db.table(tableName).insert(data);
  }

  /**
   * Helper: insert banyak row sekaligus
   */
  async insertMany(tableName, rows) {
    for (const row of rows) {
      await this.db.table(tableName).insert(row);
    }
    console.log(`  ✅ Inserted ${rows.length} rows into: ${tableName}`);
  }
}

module.exports = BaseSeeder;
