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
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
