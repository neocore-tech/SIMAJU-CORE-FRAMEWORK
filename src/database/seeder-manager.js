'use strict';

const fs   = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Seeder Manager
 * ─────────────────────────────────────────────────────────────
 * Mengelola pemuatan dan eksekusi seeder secara berurutan.
 *
 * Usage via CLI:
 *   ./simaju db:seed              → jalankan semua seeder
 *   ./simaju db:seed UserSeeder   → jalankan seeder tertentu
 */
class SeederManager {
  constructor() {
    this.seedersPath = path.join(__dirname, 'seeders');
  }

  /**
   * Jalankan semua seeder, atau satu seeder spesifik.
   * @param {string|null} specific - Nama file seeder (tanpa .js), atau null untuk semua
   */
  async run(specific = null) {
    const DB = require('./index');
    const config = require('../config/database');

    if (!DB._config) {
      await DB.boot(config);
    }

    if (specific) {
      await this.runSeeder(specific, DB);
    } else {
      // Jalankan DatabaseSeeder sebagai master entry point
      await this.runSeeder('DatabaseSeeder', DB);
    }

    logger.info('[Seeder] All seeders completed.');
    await DB.disconnect();
  }

  /**
   * Jalankan satu seeder berdasarkan nama.
   * @param {string} name - Nama seeder (contoh: 'UserSeeder')
   * @param {Object} DB   - DatabaseManager instance
   */
  async runSeeder(name, DB) {
    const seederPath = path.join(this.seedersPath, `${name}.js`);

    if (!fs.existsSync(seederPath)) {
      throw new Error(`[Seeder] File tidak ditemukan: ${name}.js di ${this.seedersPath}`);
    }

    const SeederClass = require(seederPath);
    const seeder = new SeederClass(DB);

    logger.info(`[Seeder] Running: ${name}`);
    await seeder.run();
    logger.info(`[Seeder] ✅ Done: ${name}`);
  }
}

module.exports = new SeederManager();
