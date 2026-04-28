'use strict';

/**
 * Migration: Create Custom Fields Tables
 *
 * STATUS: COMING SOON
 * Fitur custom fields belum diintegrasikan ke modul manapun.
 * Migrasi ini siap dijalankan saat fitur Custom Fields tersedia.
 */
exports.up = async (db) => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS custom_fields (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      model_type  VARCHAR(100) NOT NULL,
      name        VARCHAR(100) NOT NULL,
      label       VARCHAR(255),
      type        VARCHAR(50) DEFAULT 'text',
      options     TEXT,
      is_required INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS custom_field_values (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      custom_field_id INTEGER NOT NULL,
      model_id        INTEGER NOT NULL,
      value           TEXT,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = async (db) => {
  await db.raw('DROP TABLE IF EXISTS custom_field_values');
  await db.raw('DROP TABLE IF EXISTS custom_fields');
};
