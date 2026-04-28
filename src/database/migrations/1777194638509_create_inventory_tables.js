'use strict';

/**
 * Migration: Create Inventory Tables
 */
module.exports = {
  up: async (DB) => {
    const conn = await DB._resolveConnection(DB.defaultConnection);
    const driver = conn.driver;
    const pk = driver === 'postgres' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const dt = driver === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

    // 1. Items (Barang)
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS items (
        id ${pk},
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        stock INTEGER DEFAULT 0,
        category TEXT,
        created_at ${dt} DEFAULT CURRENT_TIMESTAMP,
        updated_at ${dt} DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Item Usage Logs (Pencatatan Penggunaan)
    await DB.raw(`
      CREATE TABLE IF NOT EXISTS item_usage_logs (
        id ${pk},
        item_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        type TEXT NOT NULL, -- 'in' (masuk), 'out' (keluar)
        notes TEXT,
        created_at ${dt} DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  down: async (DB) => {
    await DB.raw('DROP TABLE IF EXISTS item_usage_logs');
    await DB.raw('DROP TABLE IF EXISTS items');
  }
};
