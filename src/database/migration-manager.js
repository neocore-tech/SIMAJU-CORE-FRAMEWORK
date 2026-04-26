'use strict';

const fs = require('fs');
const path = require('path');
const DB = require('./index');
const logger = require('../utils/logger');

/**
 * Migration Manager
 * ─────────────────────────────────────────────────────────────
 * Menangani eksekusi migrasi database.
 */
class MigrationManager {
  constructor() {
    this.migrationsPath = path.join(__dirname, 'migrations');
    this.tableName = 'migrations';
  }

  /**
   * Memastikan tabel migrations ada di database.
   */
  async _ensureMigrationsTable() {
    const driver = DB.connection(DB.defaultConnection).driver;

    if (driver === 'mongodb') {
      // MongoDB handled automatically when inserting, but we can ensure collection
      // though mongoose doesn't really need it.
      return;
    }

    try {
      // Cek apakah tabel ada (berbeda-beda per driver, tapi kita coba query dulu)
      await DB.table(this.tableName).limit(1).get();
    } catch (err) {
      logger.info(`[Migration] Creating table "${this.tableName}"...`);
      
      let sql = '';

      if (driver === 'sqlite') {
        sql = `CREATE TABLE ${this.tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          migration TEXT NOT NULL,
          batch INTEGER NOT NULL,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;
      } else if (driver === 'mysql') {
        sql = `CREATE TABLE ${this.tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          migration VARCHAR(255) NOT NULL,
          batch INT NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      } else if (driver === 'postgres') {
        sql = `CREATE TABLE ${this.tableName} (
          id SERIAL PRIMARY KEY,
          migration VARCHAR(255) NOT NULL,
          batch INT NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      }

      if (sql) await DB.raw(sql);
    }
  }

  /**
   * Mendapatkan daftar file migrasi yang tersedia.
   */
  _getMigrationFiles() {
    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
    }

    return fs.readdirSync(this.migrationsPath)
      .filter(f => f.endsWith('.js'))
      .sort();
  }

  /**
   * Menjalankan migrasi yang tertunda.
   */
  async migrate() {
    await this._ensureMigrationsTable();

    const files = this._getMigrationFiles();
    const executed = await DB.table(this.tableName).select('migration').get();
    const executedNames = executed.map(e => e.migration);

    const pending = files.filter(f => !executedNames.includes(f));

    if (pending.length === 0) {
      logger.info('[Migration] Nothing to migrate');
      return;
    }

    // Ambil batch number terakhir
    const lastBatchRow = await DB.table(this.tableName).orderBy('batch', 'DESC').first();
    const nextBatch = (lastBatchRow?.batch || 0) + 1;

    logger.info(`[Migration] Running ${pending.length} pending migrations (Batch ${nextBatch})...`);

    for (const file of pending) {
      const migrationPath = path.join(this.migrationsPath, file);
      const migration = require(migrationPath);

      logger.info(`[Migration] Migrating: ${file}`);
      
      try {
        await migration.up(DB);
        await DB.table(this.tableName).insert({
          migration: file,
          batch: nextBatch
        });
        logger.info(`[Migration] Migrated:  ${file}`);
      } catch (err) {
        logger.error({ err }, `[Migration] Failed migrating: ${file}`);
        throw err;
      }
    }

    logger.info('[Migration] All migrations completed successfully');
  }

  /**
   * Membatalkan migrasi batch terakhir.
   */
  async rollback() {
    await this._ensureMigrationsTable();

    const lastBatchRow = await DB.table(this.tableName).orderBy('batch', 'DESC').first();
    if (!lastBatchRow) {
      logger.info('[Migration] Nothing to rollback');
      return;
    }

    const batch = lastBatchRow.batch;
    const migrationsToRollback = await DB.table(this.tableName)
      .where('batch', batch)
      .orderBy('id', 'DESC')
      .get();

    logger.info(`[Migration] Rolling back batch ${batch} (${migrationsToRollback.length} migrations)...`);

    for (const record of migrationsToRollback) {
      const file = record.migration;
      const migrationPath = path.join(this.migrationsPath, file);
      
      if (!fs.existsSync(migrationPath)) {
        logger.warn(`[Migration] File not found for rollback: ${file}`);
        continue;
      }

      const migration = require(migrationPath);
      logger.info(`[Migration] Rolling back: ${file}`);

      try {
        await migration.down(DB);
        await DB.table(this.tableName).where('id', record.id).delete();
        logger.info(`[Migration] Rolled back:  ${file}`);
      } catch (err) {
        logger.error({ err }, `[Migration] Failed rolling back: ${file}`);
        throw err;
      }
    }

    logger.info(`[Migration] Rollback batch ${batch} completed`);
  }

  /**
   * Membuat file migrasi baru.
   */
  create(name) {
    const timestamp = new Date().getTime();
    const filename = `${timestamp}_${name}.js`;
    const filePath = path.join(this.migrationsPath, filename);

    const template = `'use strict';

/**
 * Migration: ${name}
 */
module.exports = {
  /**
   * Jalankan perubahan.
   * @param {import('../index')} DB
   */
  async up(DB) {
    // await DB.raw('CREATE TABLE users (...)');
  },

  /**
   * Batalkan perubahan.
   * @param {import('../index')} DB
   */
  async down(DB) {
    // await DB.raw('DROP TABLE users');
  }
};
`;

    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
    }

    fs.writeFileSync(filePath, template);
    return filename;
  }
}

module.exports = new MigrationManager();
