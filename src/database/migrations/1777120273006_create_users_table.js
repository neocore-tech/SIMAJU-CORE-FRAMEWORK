'use strict';

/**
 * Migration: create_users_table
 */
module.exports = {
  /**
   * Jalankan perubahan.
   * @param {import('../index')} DB
   */
  async up(DB) {
    const conn = await DB._resolveConnection(DB.defaultConnection);
    const driver = conn.driver;
    
    // Debug log to ensure we know what driver is being used
    console.log(`[Migration] Using driver: ${driver}`);

    const pk = (driver === 'postgres') ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const dt = (driver === 'postgres') ? 'TIMESTAMP' : 'DATETIME';

    await DB.raw(`
      CREATE TABLE IF NOT EXISTS users (
        id ${pk},
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        created_at ${dt} DEFAULT CURRENT_TIMESTAMP,
        updated_at ${dt} DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  /**
   * Batalkan perubahan.
   * @param {import('../index')} DB
   */
  async down(DB) {
    await DB.raw('DROP TABLE IF EXISTS users');
  }
};
